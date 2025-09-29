import React from 'react';
import { PermissionGuard } from './PermissionAwareComponents';
import { 
  Card, 
  Avatar, 
  Badge, 
  Button, 
  Space, 
  Tag, 
  Typography,
  Row,
  Col
} from 'antd';
import { 
  UserOutlined,
  TeamOutlined,
  GlobalOutlined,
  BuildOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  MoreOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export const UserManagementTable: React.FC = () => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'PLATFORM_ADMIN', status: 'Active', tenant: 'Platform' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'TENANT_ADMIN', status: 'Active', tenant: 'Tenant A' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'MARKETPLACE_DEVELOPER', status: 'Active', tenant: 'Platform' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'TENANT_USER', status: 'Inactive', tenant: 'Tenant B' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'END_CUSTOMER', status: 'Active', tenant: 'N/A' },
  ];

  const getRoleTag = (role: string) => {
    const roleColors = {
      'PLATFORM_ADMIN': 'red',
      'PLATFORM_USER': 'blue',
      'TENANT_ADMIN': 'green',
      'TENANT_USER': 'orange',
      'MARKETPLACE_DEVELOPER': 'purple',
      'END_CUSTOMER': 'cyan',
    };
    
    return (
      <Tag color={roleColors[role as keyof typeof roleColors] || 'default'}>
        {role.replace('_', ' ')}
      </Tag>
    );
  };

  const getStatusTag = (status: string) => {
    return (
      <Tag color={status === 'Active' ? 'green' : 'red'}>
        {status}
      </Tag>
    );
  };

  return (
    <Card 
      title={
        <Space>
          <TeamOutlined />
          <span>User Management</span>
        </Space>
      }
    >
      <Row gutter={[16, 16]}>
        {users.map((user) => (
          <Col key={user.id} span={24}>
            <Card size="small" hoverable>
              <Row align="middle" justify="space-between">
                <Col>
                  <Space>
                    <Avatar icon={<UserOutlined />} />
                    <div>
                      <Title level={5} style={{ margin: 0 }}>{user.name}</Title>
                      <Text type="secondary">{user.email}</Text>
                    </div>
                  </Space>
                </Col>
                
                <Col>
                  <Space>
                    <PermissionGuard feature="teams">
                      {getRoleTag(user.role)}
                    </PermissionGuard>
                    
                    {getStatusTag(user.status)}
                    
                    <PermissionGuard feature="tenants" requireFullAccess>
                      <Text type="secondary">{user.tenant}</Text>
                    </PermissionGuard>
                    
                    <Space>
                      <PermissionGuard feature="teams">
                        <Button type="text" icon={<EyeOutlined />} size="small" />
                      </PermissionGuard>
                      <PermissionGuard feature="teams">
                        <Button type="text" icon={<EditOutlined />} size="small" />
                      </PermissionGuard>
                      <PermissionGuard feature="teams">
                        <Button type="text" icon={<DeleteOutlined />} size="small" danger />
                      </PermissionGuard>
                    </Space>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export const CustomerManagementTable: React.FC = () => {
  const customers = [
    { id: 1, name: 'Acme Corp', email: 'contact@acme.com', tier: 'Enterprise', status: 'Active', revenue: '$50,000' },
    { id: 2, name: 'TechStart Inc', email: 'info@techstart.com', tier: 'Premium', status: 'Active', revenue: '$25,000' },
    { id: 3, name: 'SmallBiz LLC', email: 'hello@smallbiz.com', tier: 'Basic', status: 'Inactive', revenue: '$5,000' },
    { id: 4, name: 'Global Corp', email: 'support@global.com', tier: 'Enterprise', status: 'Active', revenue: '$100,000' },
    { id: 5, name: 'Local Shop', email: 'owner@localshop.com', tier: 'Basic', status: 'Active', revenue: '$2,000' },
  ];

  const getTierTag = (tier: string) => {
    const tierColors = {
      'Basic': 'default',
      'Premium': 'blue',
      'Enterprise': 'purple',
    };
    
    return (
      <Tag color={tierColors[tier as keyof typeof tierColors] || 'default'}>
        {tier}
      </Tag>
    );
  };

  const getStatusTag = (status: string) => {
    return (
      <Tag color={status === 'Active' ? 'green' : 'red'}>
        {status}
      </Tag>
    );
  };

  return (
    <Card 
      title={
        <Space>
          <BuildOutlined />
          <span>Customer Management</span>
        </Space>
      }
    >
      <Row gutter={[16, 16]}>
        {customers.map((customer) => (
          <Col key={customer.id} span={24}>
            <Card size="small" hoverable>
              <Row align="middle" justify="space-between">
                <Col>
                  <Space>
                    <Avatar icon={<BuildOutlined />} />
                    <div>
                      <Title level={5} style={{ margin: 0 }}>{customer.name}</Title>
                      <Text type="secondary">{customer.email}</Text>
                    </div>
                  </Space>
                </Col>
                
                <Col>
                  <Space>
                    {getTierTag(customer.tier)}
                    {getStatusTag(customer.status)}
                    
                    <PermissionGuard feature="analytics">
                      <Text strong style={{ color: '#52c41a' }}>{customer.revenue}</Text>
                    </PermissionGuard>
                    
                    <Space>
                      <PermissionGuard feature="customers">
                        <Button type="text" icon={<EyeOutlined />} size="small" />
                      </PermissionGuard>
                      <PermissionGuard feature="customers">
                        <Button type="text" icon={<EditOutlined />} size="small" />
                      </PermissionGuard>
                      <PermissionGuard feature="customers">
                        <Button type="text" icon={<MoreOutlined />} size="small" />
                      </PermissionGuard>
                    </Space>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export const APIManagementTable: React.FC = () => {
  const apis = [
    { id: 1, name: 'User API', endpoint: '/api/users', method: 'GET', status: 'Active', requests: '2.4M', rate: '1000/min' },
    { id: 2, name: 'Auth API', endpoint: '/api/auth', method: 'POST', status: 'Active', requests: '1.8M', rate: '500/min' },
    { id: 3, name: 'Payment API', endpoint: '/api/payments', method: 'POST', status: 'Maintenance', requests: '890K', rate: '200/min' },
    { id: 4, name: 'Analytics API', endpoint: '/api/analytics', method: 'GET', status: 'Active', requests: '3.2M', rate: '2000/min' },
    { id: 5, name: 'Notification API', endpoint: '/api/notifications', method: 'POST', status: 'Active', requests: '1.5M', rate: '800/min' },
  ];

  const getMethodTag = (method: string) => {
    const methodColors = {
      'GET': 'green',
      'POST': 'blue',
      'PUT': 'orange',
      'DELETE': 'red',
    };
    
    return (
      <Tag color={methodColors[method as keyof typeof methodColors] || 'default'}>
        {method}
      </Tag>
    );
  };

  const getStatusTag = (status: string) => {
    const statusColors = {
      'Active': 'green',
      'Maintenance': 'orange',
      'Inactive': 'red',
    };
    
    return (
      <Tag color={statusColors[status as keyof typeof statusColors] || 'default'}>
        {status}
      </Tag>
    );
  };

  return (
    <Card 
      title={
        <Space>
          <GlobalOutlined />
          <span>API Management</span>
        </Space>
      }
    >
      <Row gutter={[16, 16]}>
        {apis.map((api) => (
          <Col key={api.id} span={24}>
            <Card size="small" hoverable>
              <Row align="middle" justify="space-between">
                <Col>
                  <Space>
                    <Avatar icon={<GlobalOutlined />} />
                    <div>
                      <Title level={5} style={{ margin: 0 }}>{api.name}</Title>
                      <Text type="secondary" code>{api.endpoint}</Text>
                    </div>
                  </Space>
                </Col>
                
                <Col>
                  <Space>
                    {getMethodTag(api.method)}
                    {getStatusTag(api.status)}
                    <Text strong>{api.requests}</Text>
                    <Text strong style={{ color: '#1890ff' }}>{api.rate}</Text>
                    
                    <Space>
                      <PermissionGuard feature="api">
                        <Button type="text" icon={<EyeOutlined />} size="small" />
                      </PermissionGuard>
                      <PermissionGuard feature="api">
                        <Button type="text" icon={<EditOutlined />} size="small" />
                      </PermissionGuard>
                      <PermissionGuard feature="api">
                        <Button type="text" icon={<SettingOutlined />} size="small" />
                      </PermissionGuard>
                    </Space>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export const TenantManagementTable: React.FC = () => {
  const tenants = [
    { id: 1, name: 'Acme Corporation', subdomain: 'acme', users: 150, status: 'Active', plan: 'Enterprise', revenue: '$50,000' },
    { id: 2, name: 'TechStart Inc', subdomain: 'techstart', users: 75, status: 'Active', plan: 'Premium', revenue: '$25,000' },
    { id: 3, name: 'SmallBiz LLC', subdomain: 'smallbiz', users: 25, status: 'Inactive', plan: 'Basic', revenue: '$5,000' },
    { id: 4, name: 'Global Corp', subdomain: 'global', users: 300, status: 'Active', plan: 'Enterprise', revenue: '$100,000' },
    { id: 5, name: 'Local Shop', subdomain: 'local', users: 10, status: 'Active', plan: 'Basic', revenue: '$2,000' },
  ];

  const getPlanTag = (plan: string) => {
    const planColors = {
      'Basic': 'default',
      'Premium': 'blue',
      'Enterprise': 'purple',
    };
    
    return (
      <Tag color={planColors[plan as keyof typeof planColors] || 'default'}>
        {plan}
      </Tag>
    );
  };

  const getStatusTag = (status: string) => {
    return (
      <Tag color={status === 'Active' ? 'green' : 'red'}>
        {status}
      </Tag>
    );
  };

  return (
    <Card 
      title={
        <Space>
          <BuildOutlined />
          <span>Tenant Management</span>
        </Space>
      }
    >
      <Row gutter={[16, 16]}>
        {tenants.map((tenant) => (
          <Col key={tenant.id} span={24}>
            <Card size="small" hoverable>
              <Row align="middle" justify="space-between">
                <Col>
                  <Space>
                    <Avatar icon={<BuildOutlined />} />
                    <div>
                      <Title level={5} style={{ margin: 0 }}>{tenant.name}</Title>
                      <Text type="secondary" code>{tenant.subdomain}</Text>
                    </div>
                  </Space>
                </Col>
                
                <Col>
                  <Space>
                    <Text strong>{tenant.users} users</Text>
                    {getStatusTag(tenant.status)}
                    {getPlanTag(tenant.plan)}
                    
                    <PermissionGuard feature="analytics">
                      <Text strong style={{ color: '#52c41a' }}>{tenant.revenue}</Text>
                    </PermissionGuard>
                    
                    <Space>
                      <PermissionGuard feature="tenants" requireFullAccess>
                        <Button type="text" icon={<EyeOutlined />} size="small" />
                      </PermissionGuard>
                      <PermissionGuard feature="tenants" requireFullAccess>
                        <Button type="text" icon={<EditOutlined />} size="small" />
                      </PermissionGuard>
                      <PermissionGuard feature="tenants" requireFullAccess>
                        <Button type="text" icon={<SettingOutlined />} size="small" />
                      </PermissionGuard>
                    </Space>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};
