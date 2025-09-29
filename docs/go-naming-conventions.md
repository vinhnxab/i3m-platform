# Go Naming Conventions - Best Practices

## 📁 File Naming

### ✅ Correct Go File Names

```go
// Single word files
main.go
handlers.go
database.go
models.go

// Multi-word files (snake_case)
api_permissions.go
context_middleware.go
api_routes.go
user_management.go
auth_service.go
```

### ❌ Incorrect File Names

```go
// DON'T use camelCase for files
apiPermissions.go
contextMiddleware.go
userManagement.go

// DON'T use PascalCase for files  
ApiPermissions.go
ContextMiddleware.go
UserManagement.go

// DON'T use kebab-case for files
api-permissions.go
context-middleware.go
```

## 🏗️ Project Structure

### Standard Go Project Layout

```
core-services/auth-service/
├── main.go                    # Entry point
├── handlers.go               # HTTP handlers
├── database.go               # Database operations
├── models.go                 # Data structures
├── middleware.go             # HTTP middleware
├── api_permissions.go        # API permission logic
├── context_middleware.go     # Context-based middleware
├── api_routes.go             # API route definitions
├── auth_service.go           # Service logic
└── config.go                 # Configuration
```

## 📝 Code Examples

### File: `api_permissions.go`

```go
package main

// ✅ Correct: snake_case for multi-word
const (
    PERMISSION_NONE  = "none"
    PERMISSION_READ  = "read"
    PERMISSION_WRITE = "write"
)

// ✅ Correct: PascalCase for exported types
type APIPermissionMatrix struct {
    Endpoint    string            `json:"endpoint"`
    Method      string            `json:"method"`
    Permissions map[string]string `json:"permissions"`
}

// ✅ Correct: camelCase for exported functions
func (as *AuthService) getUserAPIPermission(userID, endpoint, method string) (string, error) {
    // Implementation
}

// ✅ Correct: camelCase for unexported functions
func (as *AuthService) matchEndpoint(pattern, endpoint string) bool {
    // Implementation
}
```

### File: `context_middleware.go`

```go
package main

// ✅ Correct: PascalCase for exported types
type UserGroupContext struct {
    UserID      string                 `json:"user_id"`
    Groups      []UserGroupInfo        `json:"groups"`
    Permissions map[string]interface{} `json:"permissions"`
    Context     string                 `json:"context"`
}

// ✅ Correct: camelCase for exported functions
func (as *AuthService) contextPermissionMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        // Implementation
    }
}

// ✅ Correct: camelCase for unexported functions
func (as *AuthService) getHighestPriorityGroup(groups []UserGroupInfo) *UserGroupInfo {
    // Implementation
}
```

## 🎯 Why These Conventions?

### 1. **Go Standard Library**
Go standard library uses snake_case for multi-word files:
- `http_server.go`
- `json_encoder.go`
- `time_format.go`

### 2. **Readability**
```go
// ✅ Easy to read
api_permissions.go
context_middleware.go

// ❌ Harder to read
apiPermissions.go
contextMiddleware.go
```

### 3. **Consistency**
All Go projects follow the same pattern:
- **Files**: snake_case
- **Functions**: camelCase
- **Types**: PascalCase
- **Constants**: PascalCase (exported) or camelCase (unexported)

### 4. **Tool Compatibility**
Go tools expect these conventions:
- `go fmt` works better with standard naming
- IDEs provide better support
- Linters follow these rules

## 📚 References

### Official Go Documentation
- [Effective Go - Names](https://golang.org/doc/effective_go.html#names)
- [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments)

### Community Standards
- [Go Project Layout](https://github.com/golang-standards/project-layout)
- [Uber Go Style Guide](https://github.com/uber-go/guide)

## 🚀 Best Practices

### 1. **File Organization**
```go
// Group related functionality
auth_service.go      # Authentication service
auth_handlers.go     # Authentication handlers
auth_middleware.go   # Authentication middleware
auth_models.go       # Authentication models
```

### 2. **Naming Consistency**
```go
// ✅ Consistent naming
user_management.go
user_handlers.go
user_models.go
user_service.go

// ❌ Inconsistent naming
userManagement.go
user_handlers.go
userModels.go
user_service.go
```

### 3. **Descriptive Names**
```go
// ✅ Clear and descriptive
api_permission_matrix.go
context_based_middleware.go
multi_group_user_handler.go

// ❌ Unclear names
permissions.go
middleware.go
handler.go
```

## 🎯 Conclusion

The naming conventions I used follow Go's official standards:

- **Files**: `snake_case` for multi-word, `lowercase` for single word
- **Functions**: `camelCase` 
- **Types**: `PascalCase` for exported, `camelCase` for unexported
- **Constants**: `PascalCase` for exported, `camelCase` for unexported

This ensures:
- ✅ **Consistency** with Go ecosystem
- ✅ **Readability** and maintainability  
- ✅ **Tool compatibility** (go fmt, linters, IDEs)
- ✅ **Team collaboration** (everyone follows same rules)
