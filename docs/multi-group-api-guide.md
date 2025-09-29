# Multi-Group User API Management Guide

## 🎯 Tổng Quan

Hệ thống quản lý API cho multi-group users cho phép:
- **Một user thuộc nhiều groups** với các quyền khác nhau
- **Chọn context** (group) để sử dụng khi gọi API
- **Tự động xác định quyền cao nhất** từ tất cả groups
- **Quản lý quyền API** dựa trên group membership

## 🔐 Cách Hoạt Động

### 1. User Groups và Roles

```json
{
  "user_id": "john.developer@i3m-platform.com",
  "groups": [
    {
      "group_name": "marketplace_developers",
      "role": "developer",
      "permissions": {
        "developer": true,
        "api_access": true,
        "marketplace_access": true
      }
    },
    {
      "group_name": "management_users", 
      "role": "customer_service_user",
      "permissions": {
        "erp_access": true,
        "customer_service": true
      }
    }
  ]
}
```

### 2. API Permission Matrix

| API Endpoint | Method | Management Users | Tenant Users | Marketplace Developers | Tenant Customers |
|--------------|--------|------------------|--------------|----------------------|-------------------|
| `/api/v1/users` | GET | read | read | none | none |
| `/api/v1/users` | POST | write | none | none | none |
| `/api/v1/users/:id` | PUT | write | read | none | none |
| `/api/v1/users/:id` | DELETE | admin | none | none | none |
| `/api/v1/marketplace/apps` | GET | read | read | read | read |
| `/api/v1/marketplace/apps` | POST | write | none | write | none |
| `/api/v1/erp/finance` | GET | read | read | none | none |
| `/api/v1/erp/finance` | POST | write | read | none | none |

### 3. Permission Levels

- **none**: Không có quyền truy cập
- **read**: Chỉ đọc dữ liệu
- **write**: Đọc và ghi dữ liệu
- **admin**: Quyền quản trị đầy đủ
- **owner**: Quyền sở hữu cao nhất

## 🚀 Cách Sử Dụng API

### 1. Lấy Thông Tin User Groups

```bash
GET /api/v1/auth/groups/users/{user_id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "user_id": "john.developer@i3m-platform.com",
  "groups": [
    {
      "group_id": "uuid",
      "group_name": "marketplace_developers",
      "role": "developer",
      "permissions": {...},
      "assigned_at": "2025-09-29T03:23:31Z"
    },
    {
      "group_id": "uuid", 
      "group_name": "management_users",
      "role": "customer_service_user",
      "permissions": {...},
      "assigned_at": "2025-09-29T03:23:31Z"
    }
  ]
}
```

### 2. Lấy Available Contexts

```bash
GET /api/v1/permissions/users/{user_id}/contexts
Authorization: Bearer {token}
```

**Response:**
```json
{
  "user_id": "john.developer@i3m-platform.com",
  "contexts": [
    {
      "name": "default",
      "description": "Use highest priority group",
      "group": {
        "group_name": "management_users",
        "role": "customer_service_user"
      }
    },
    {
      "name": "developer",
      "description": "Use marketplace_developers group",
      "group": {
        "group_name": "marketplace_developers", 
        "role": "developer"
      }
    },
    {
      "name": "management",
      "description": "Use management_users group",
      "group": {
        "group_name": "management_users",
        "role": "customer_service_user"
      }
    }
  ],
  "current_context": "default"
}
```

### 3. Switch Context

```bash
POST /api/v1/permissions/users/{user_id}/context
Authorization: Bearer {token}
Content-Type: application/json

{
  "context": "developer"
}
```

**Response:**
```json
{
  "message": "Context switched successfully",
  "context": "developer",
  "active_group": {
    "group_name": "marketplace_developers",
    "role": "developer",
    "permissions": {...}
  }
}
```

### 4. Gọi API với Context

```bash
# Sử dụng header để chỉ định context
GET /api/v1/users
Authorization: Bearer {token}
X-User-Context: developer

# Hoặc sử dụng query parameter
GET /api/v1/users?context=developer
Authorization: Bearer {token}
```

### 5. Kiểm Tra API Permissions

```bash
GET /api/v1/permissions/users/{user_id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "user_id": "john.developer@i3m-platform.com",
  "groups": [...],
  "combined_permissions": {...},
  "api_permissions": {
    "GET:/api/v1/users": "read",
    "POST:/api/v1/users": "none", 
    "GET:/api/v1/marketplace/apps": "read",
    "POST:/api/v1/marketplace/apps": "write"
  },
  "context": "default"
}
```

## 📊 Ví Dụ Thực Tế

### Scenario 1: John Developer

**User Groups:**
- `marketplace_developers` → `developer` role
- `management_users` → `customer_service_user` role

**API Access:**

| API | Context: developer | Context: management |
|-----|-------------------|---------------------|
| `GET /api/v1/users` | ❌ none | ✅ read |
| `POST /api/v1/users` | ❌ none | ❌ none |
| `GET /api/v1/marketplace/apps` | ✅ read | ✅ read |
| `POST /api/v1/marketplace/apps` | ✅ write | ✅ write |
| `GET /api/v1/erp/finance` | ❌ none | ✅ read |

### Scenario 2: Sarah Johnson

**User Groups:**
- `management_users` → `hr_manager` role  
- `marketplace_developers` → `developer` role

**API Access:**

| API | Context: management | Context: developer |
|-----|-------------------|-------------------|
| `GET /api/v1/users` | ✅ read | ❌ none |
| `POST /api/v1/users` | ✅ write | ❌ none |
| `GET /api/v1/marketplace/apps` | ✅ read | ✅ read |
| `POST /api/v1/marketplace/apps` | ✅ write | ✅ write |
| `GET /api/v1/erp/finance` | ✅ read | ❌ none |

## 🔧 Implementation Details

### 1. Permission Resolution Logic

```go
func (as *AuthService) getUserAPIPermission(userID, endpoint, method string) (string, error) {
    // 1. Lấy tất cả groups của user
    userGroups, err := as.getUserGroups(userID)
    
    // 2. Tìm permission matrix cho API endpoint
    matrix := as.apiPermissionManager.permissionMatrix[permissionKey]
    
    // 3. Tìm quyền cao nhất từ tất cả groups
    highestPermission := PERMISSION_NONE
    for _, group := range userGroups {
        if groupPermission, exists := matrix.Permissions[group.GroupName]; exists {
            if permissionLevels[groupPermission] > permissionLevels[highestPermission] {
                highestPermission = groupPermission
            }
        }
    }
    
    return highestPermission, nil
}
```

### 2. Context Middleware

```go
func (as *AuthService) contextPermissionMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        // 1. Lấy context từ header hoặc query
        context := c.GetHeader("X-User-Context")
        
        // 2. Xác định group context để sử dụng
        var activeGroup *UserGroupInfo
        switch context {
        case "developer":
            activeGroup = as.getGroupByName(userGroups, "marketplace_developers")
        case "management":
            activeGroup = as.getGroupByName(userGroups, "management_users")
        // ...
        }
        
        // 3. Set context information
        c.Set("activeGroup", activeGroup)
        c.Next()
    }
}
```

## 🎯 Best Practices

### 1. Context Selection
- **Default**: Sử dụng group có priority cao nhất
- **Explicit**: Chỉ định context cụ thể qua header/query
- **Dynamic**: Cho phép user chọn context tại runtime

### 2. Permission Management
- **Principle of Least Privilege**: Chỉ cấp quyền tối thiểu cần thiết
- **Audit Trail**: Log tất cả API calls với context
- **Permission Matrix**: Quản lý tập trung tất cả quyền API

### 3. Security Considerations
- **Token Validation**: Kiểm tra JWT token cho mỗi request
- **Context Validation**: Đảm bảo user có quyền sử dụng context
- **Rate Limiting**: Giới hạn số lượng API calls per user/context

## 🚀 Kết Luận

Hệ thống multi-group API management cung cấp:
- **Flexibility**: User có thể chọn context phù hợp
- **Security**: Quyền được quản lý chặt chẽ theo groups
- **Scalability**: Dễ dàng thêm groups và permissions mới
- **User Experience**: Giao diện đơn giản cho việc chuyển đổi context

Điều này đặc biệt hữu ích cho các tổ chức có cấu trúc phức tạp với nhiều departments và roles khác nhau.
