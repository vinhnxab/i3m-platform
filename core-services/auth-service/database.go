package main

import (
	"crypto/sha256"
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Generate JWT token pair (access and refresh tokens)
func (as *AuthService) generateTokenPair(user *User) (string, string, int64, error) {
	now := time.Now()

	// Access token (shorter expiry)
	accessTokenExpiry := now.Add(15 * time.Minute)
	accessTokenClaims := &Claims{
		UserID:   user.ID,
		TenantID: user.TenantID,
		Role:     user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(accessTokenExpiry),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			Issuer:    "i3m-auth-service",
			Subject:   user.ID,
		},
	}

	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessTokenClaims)
	accessTokenString, err := accessToken.SignedString([]byte(as.config.JWTSecret))
	if err != nil {
		return "", "", 0, err
	}

	// Refresh token (longer expiry)
	refreshTokenExpiry := now.Add(7 * 24 * time.Hour) // 7 days
	refreshTokenClaims := &Claims{
		UserID:   user.ID,
		TenantID: user.TenantID,
		Role:     user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(refreshTokenExpiry),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			Issuer:    "i3m-auth-service",
			Subject:   user.ID,
		},
	}

	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshTokenClaims)
	refreshTokenString, err := refreshToken.SignedString([]byte(as.config.JWTSecret))
	if err != nil {
		return "", "", 0, err
	}

	expiresIn := int64(accessTokenExpiry.Sub(now).Seconds())

	// Record token metrics
	as.metrics.tokenDuration.WithLabelValues(user.TenantID, "access").Observe(float64(15 * 60))           // 15 minutes
	as.metrics.tokenDuration.WithLabelValues(user.TenantID, "refresh").Observe(float64(7 * 24 * 60 * 60)) // 7 days

	return accessTokenString, refreshTokenString, expiresIn, nil
}

// Get user by email and tenant
func (as *AuthService) getUserByEmailAndTenant(email, tenantID string) (*User, error) {
	query := `
		SELECT id, tenant_id, email, password_hash, first_name, last_name, role, status, 
		       preferences, last_login_at, created_at, updated_at
		FROM core.users 
		WHERE email = $1 AND tenant_id = $2`

	user := &User{}
	row := as.db.QueryRow(query, email, tenantID)

	err := row.Scan(
		&user.ID, &user.TenantID, &user.Email, &user.PasswordHash,
		&user.FirstName, &user.LastName, &user.Role, &user.Status,
		&user.Preferences, &user.LastLoginAt, &user.CreatedAt, &user.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, err
		}
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	return user, nil
}

// Get user by ID
func (as *AuthService) getUserByID(userID string) (*User, error) {
	query := `
		SELECT id, tenant_id, email, password_hash, first_name, last_name, role, status, 
		       preferences, last_login_at, created_at, updated_at
		FROM core.users 
		WHERE id = $1`

	user := &User{}
	row := as.db.QueryRow(query, userID)

	err := row.Scan(
		&user.ID, &user.TenantID, &user.Email, &user.PasswordHash,
		&user.FirstName, &user.LastName, &user.Role, &user.Status,
		&user.Preferences, &user.LastLoginAt, &user.CreatedAt, &user.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	return user, nil
}

// Create new user
func (as *AuthService) createUser(user *User) error {
	query := `
		INSERT INTO core.users (tenant_id, email, password_hash, first_name, last_name, role, status, preferences)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, created_at, updated_at`

	err := as.db.QueryRow(
		query,
		user.TenantID, user.Email, user.PasswordHash,
		user.FirstName, user.LastName, user.Role, user.Status, user.Preferences,
	).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}

	return nil
}

// Update user profile
func (as *AuthService) updateUserProfile(userID string, req UpdateProfileRequest) error {
	query := `
		UPDATE core.users 
		SET first_name = COALESCE($2, first_name),
		    last_name = COALESCE($3, last_name),
		    preferences = COALESCE($4, preferences),
		    updated_at = CURRENT_TIMESTAMP
		WHERE id = $1`

	_, err := as.db.Exec(query, userID, req.FirstName, req.LastName, req.Preferences)
	if err != nil {
		return fmt.Errorf("failed to update user profile: %w", err)
	}

	return nil
}

// Update user password
func (as *AuthService) updateUserPassword(userID, passwordHash string) error {
	query := `
		UPDATE core.users 
		SET password_hash = $2, updated_at = CURRENT_TIMESTAMP
		WHERE id = $1`

	_, err := as.db.Exec(query, userID, passwordHash)
	if err != nil {
		return fmt.Errorf("failed to update user password: %w", err)
	}

	return nil
}

// Update last login timestamp
func (as *AuthService) updateLastLogin(userID string) error {
	query := `
		UPDATE core.users 
		SET last_login_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
		WHERE id = $1`

	_, err := as.db.Exec(query, userID)
	if err != nil {
		return fmt.Errorf("failed to update last login: %w", err)
	}

	return nil
}

// Create user session
func (as *AuthService) createUserSession(userID, tenantID, token, ipAddress, userAgent string) error {
	tokenHash := hashTokenForStorage(token)
	expiresAt := time.Now().Add(15 * time.Minute) // Match access token expiry

	query := `
		INSERT INTO core.user_sessions (user_id, tenant_id, token_hash, expires_at, ip_address, user_agent)
		VALUES ($1, $2, $3, $4, $5, $6)`

	_, err := as.db.Exec(query, userID, tenantID, tokenHash, expiresAt, ipAddress, userAgent)
	if err != nil {
		return fmt.Errorf("failed to create user session: %w", err)
	}

	return nil
}

// Remove user session
func (as *AuthService) removeUserSession(userID, token string) error {
	tokenHash := hashTokenForStorage(token)

	query := `DELETE FROM core.user_sessions WHERE user_id = $1 AND token_hash = $2`

	_, err := as.db.Exec(query, userID, tokenHash)
	if err != nil {
		return fmt.Errorf("failed to remove user session: %w", err)
	}

	return nil
}

// Get user sessions by user ID
func (as *AuthService) getUserSessionsByUserID(userID string) ([]UserSession, error) {
	query := `
		SELECT id, user_id, tenant_id, token_hash, expires_at, ip_address, user_agent, created_at
		FROM core.user_sessions 
		WHERE user_id = $1 AND expires_at > CURRENT_TIMESTAMP
		ORDER BY created_at DESC`

	rows, err := as.db.Query(query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user sessions: %w", err)
	}
	defer rows.Close()

	var sessions []UserSession
	for rows.Next() {
		var session UserSession
		err := rows.Scan(
			&session.ID, &session.UserID, &session.TenantID, &session.TokenHash,
			&session.ExpiresAt, &session.IPAddress, &session.UserAgent, &session.CreatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan session: %w", err)
		}
		sessions = append(sessions, session)
	}

	return sessions, nil
}

// Revoke user session
func (as *AuthService) revokeUserSession(userID, sessionID string) error {
	query := `DELETE FROM core.user_sessions WHERE user_id = $1 AND id = $2`

	_, err := as.db.Exec(query, userID, sessionID)
	if err != nil {
		return fmt.Errorf("failed to revoke user session: %w", err)
	}

	return nil
}

// Get users by tenant (admin function)
func (as *AuthService) getUsersByTenant(tenantID string, page, pageSize int) ([]User, int, error) {
	// Get total count
	countQuery := `SELECT COUNT(*) FROM core.users WHERE tenant_id = $1`
	var totalCount int
	err := as.db.QueryRow(countQuery, tenantID).Scan(&totalCount)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get user count: %w", err)
	}

	// Get users with pagination
	offset := (page - 1) * pageSize
	query := `
		SELECT id, tenant_id, email, first_name, last_name, role, status, 
		       preferences, last_login_at, created_at, updated_at
		FROM core.users 
		WHERE tenant_id = $1
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3`

	rows, err := as.db.Query(query, tenantID, pageSize, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get users: %w", err)
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		err := rows.Scan(
			&user.ID, &user.TenantID, &user.Email,
			&user.FirstName, &user.LastName, &user.Role, &user.Status,
			&user.Preferences, &user.LastLoginAt, &user.CreatedAt, &user.UpdatedAt,
		)
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan user: %w", err)
		}
		users = append(users, user)
	}

	return users, totalCount, nil
}

// Update user status by ID (admin function)
func (as *AuthService) updateUserStatusByID(userID, status string) error {
	query := `
		UPDATE core.users 
		SET status = $2, updated_at = CURRENT_TIMESTAMP
		WHERE id = $1`

	_, err := as.db.Exec(query, userID, status)
	if err != nil {
		return fmt.Errorf("failed to update user status: %w", err)
	}

	return nil
}

// Get all sessions by tenant (admin function)
func (as *AuthService) getAllSessionsByTenant(tenantID string, page, pageSize int) ([]UserSessionWithUser, int, error) {
	// Get total count
	countQuery := `
		SELECT COUNT(*) 
		FROM core.user_sessions s
		JOIN core.users u ON s.user_id = u.id
		WHERE s.tenant_id = $1`
	var totalCount int
	err := as.db.QueryRow(countQuery, tenantID).Scan(&totalCount)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get session count: %w", err)
	}

	// Get sessions with user info and pagination
	offset := (page - 1) * pageSize
	query := `
		SELECT s.id, s.user_id, s.tenant_id, s.token_hash, s.expires_at, 
		       s.ip_address, s.user_agent, s.created_at,
		       u.email, CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, '')) as user_name
		FROM core.user_sessions s
		JOIN core.users u ON s.user_id = u.id
		WHERE s.tenant_id = $1 AND s.expires_at > CURRENT_TIMESTAMP
		ORDER BY s.created_at DESC
		LIMIT $2 OFFSET $3`

	rows, err := as.db.Query(query, tenantID, pageSize, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get sessions: %w", err)
	}
	defer rows.Close()

	var sessions []UserSessionWithUser
	for rows.Next() {
		var session UserSessionWithUser
		err := rows.Scan(
			&session.ID, &session.UserID, &session.TenantID, &session.TokenHash,
			&session.ExpiresAt, &session.IPAddress, &session.UserAgent, &session.CreatedAt,
			&session.UserEmail, &session.UserName,
		)
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan session: %w", err)
		}
		sessions = append(sessions, session)
	}

	return sessions, totalCount, nil
}

// Revoke session by ID (admin function)
func (as *AuthService) revokeSessionByID(sessionID string) error {
	query := `DELETE FROM core.user_sessions WHERE id = $1`

	_, err := as.db.Exec(query, sessionID)
	if err != nil {
		return fmt.Errorf("failed to revoke session: %w", err)
	}

	return nil
}

// Clean up expired sessions (background task)
func (as *AuthService) cleanupExpiredSessions() error {
	query := `DELETE FROM core.user_sessions WHERE expires_at < CURRENT_TIMESTAMP`

	result, err := as.db.Exec(query)
	if err != nil {
		return fmt.Errorf("failed to cleanup expired sessions: %w", err)
	}

	rowsAffected, _ := result.RowsAffected()
	as.logger.Debugf("Cleaned up %d expired sessions", rowsAffected)

	return nil
}

// Hash token for secure storage
func hashTokenForStorage(token string) string {
	hash := sha256.Sum256([]byte(token))
	return fmt.Sprintf("%x", hash)
}

// Validate tenant exists and is active
func (as *AuthService) validateTenant(tenantID string) (*Tenant, error) {
	query := `
		SELECT id, name, subdomain, status, plan, settings, created_at, updated_at
		FROM core.tenants 
		WHERE id = $1`

	tenant := &Tenant{}
	row := as.db.QueryRow(query, tenantID)

	err := row.Scan(
		&tenant.ID, &tenant.Name, &tenant.Subdomain, &tenant.Status,
		&tenant.Plan, &tenant.Settings, &tenant.CreatedAt, &tenant.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to get tenant: %w", err)
	}

	if tenant.Status != "active" {
		return nil, fmt.Errorf("tenant is not active")
	}

	return tenant, nil
}

// Get user's primary group and role
func (as *AuthService) getUserPrimaryGroupAndRole(userID string) (*UserGroup, *string, error) {
	// Get primary group
	groupQuery := `
		SELECT ug.id, ug.name, ug.description, ug.permissions, ug.priority, uga.role, uga.assigned_at
		FROM core.user_groups ug
		JOIN core.user_group_assignments uga ON ug.id = uga.group_id
		WHERE uga.user_id = $1 AND uga.is_primary = TRUE AND ug.is_active = true
		LIMIT 1
	`

	var group UserGroup
	var permissionsJSON string
	var assignedAt time.Time

	err := as.db.QueryRow(groupQuery, userID).Scan(
		&group.ID, &group.Name, &group.Description, &permissionsJSON,
		&group.Priority, &group.Role, &assignedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil, nil // No primary group found
		}
		return nil, nil, fmt.Errorf("failed to get primary group: %w", err)
	}

	// Parse permissions JSON
	if err := json.Unmarshal([]byte(permissionsJSON), &group.Permissions); err != nil {
		as.logger.Warnf("Failed to parse permissions for group %s: %v", group.Name, err)
		group.Permissions = make(map[string]interface{})
	}

	group.AssignedAt = assignedAt

	// Get primary role
	roleQuery := `
		SELECT uga.role
		FROM core.user_group_assignments uga
		WHERE uga.user_id = $1 AND uga.is_primary_role = TRUE
		LIMIT 1
	`

	var primaryRole string
	err = as.db.QueryRow(roleQuery, userID).Scan(&primaryRole)
	if err != nil {
		if err == sql.ErrNoRows {
			return &group, nil, nil // No primary role found
		}
		return &group, nil, fmt.Errorf("failed to get primary role: %w", err)
	}

	return &group, &primaryRole, nil
}

// Generate tenant-specific token
func (as *AuthService) generateTenantToken(user *User) (string, error) {
	now := time.Now()
	tenantTokenExpiry := now.Add(24 * time.Hour) // 24 hours for tenant token

	tenantTokenClaims := &Claims{
		UserID:   user.ID,
		TenantID: user.TenantID,
		Role:     user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(tenantTokenExpiry),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			Issuer:    "i3m-auth-service",
			Subject:   user.ID,
		},
	}

	tenantToken := jwt.NewWithClaims(jwt.SigningMethodHS256, tenantTokenClaims)
	tenantTokenString, err := tenantToken.SignedString([]byte(as.config.JWTSecret))
	if err != nil {
		return "", err
	}

	return tenantTokenString, nil
}

// Start background cleanup job
func (as *AuthService) startCleanupJob() {
	ticker := time.NewTicker(1 * time.Hour) // Run every hour
	go func() {
		for range ticker.C {
			if err := as.cleanupExpiredSessions(); err != nil {
				as.logger.Errorf("Failed to cleanup expired sessions: %v", err)
			}
		}
	}()
}
