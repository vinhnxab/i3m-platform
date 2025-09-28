-- I3M Platform Database Initialization Script
-- PostgreSQL 15 compatible

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create schemas for different service groups
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS erp;
CREATE SCHEMA IF NOT EXISTS procurement;
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS industry;
CREATE SCHEMA IF NOT EXISTS shared;

-- =====================
-- CORE SCHEMA TABLES
-- =====================

-- Tenants table for multi-tenant architecture
CREATE TABLE IF NOT EXISTS core.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    plan VARCHAR(50) DEFAULT 'basic',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users table with multi-tenant support
CREATE TABLE IF NOT EXISTS core.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'user',
    status VARCHAR(50) DEFAULT 'active',
    preferences JSONB DEFAULT '{}',
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, email)
);

-- User sessions for JWT management
CREATE TABLE core.user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Permissions for RBAC
CREATE TABLE core.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Roles for RBAC
CREATE TABLE core.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, name)
);

-- Role permissions mapping
CREATE TABLE core.role_permissions (
    role_id UUID NOT NULL REFERENCES core.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES core.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- User roles mapping
CREATE TABLE core.user_roles (
    user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES core.roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

-- =====================
-- ERP SCHEMA TABLES
-- =====================

-- Companies/Organizations within tenants
CREATE TABLE erp.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    tax_id VARCHAR(50),
    address JSONB,
    contact_info JSONB,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Employees for HRM
CREATE TABLE erp.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES erp.companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES core.users(id) ON DELETE SET NULL,
    employee_id VARCHAR(50),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    department VARCHAR(100),
    position VARCHAR(100),
    salary DECIMAL(12, 2),
    hire_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, employee_id)
);

-- Products for inventory management
CREATE TABLE erp.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES erp.companies(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price DECIMAL(12, 2),
    cost DECIMAL(12, 2),
    unit VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, sku)
);

-- Inventory tracking
CREATE TABLE erp.inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES erp.products(id) ON DELETE CASCADE,
    warehouse_location VARCHAR(100),
    quantity_available INTEGER NOT NULL DEFAULT 0,
    quantity_reserved INTEGER NOT NULL DEFAULT 0,
    reorder_level INTEGER DEFAULT 10,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Financial transactions
CREATE TABLE erp.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES erp.companies(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL, -- 'income', 'expense', 'transfer'
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    description TEXT,
    category VARCHAR(100),
    account_from VARCHAR(100),
    account_to VARCHAR(100),
    reference_id UUID, -- Reference to order, invoice, etc.
    reference_type VARCHAR(50), -- 'order', 'invoice', 'payroll', etc.
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders for e-commerce
CREATE TABLE erp.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES erp.companies(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES core.users(id) ON DELETE SET NULL,
    order_number VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
    total_amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    shipping_address JSONB,
    billing_address JSONB,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, order_number)
);

-- Order items
CREATE TABLE erp.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES erp.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES erp.products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- SHARED SCHEMA TABLES
-- =====================

-- Notifications
CREATE TABLE shared.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'email', 'sms', 'push', 'in-app'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'failed'
    metadata JSONB DEFAULT '{}',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- File uploads and media
CREATE TABLE shared.files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_url VARCHAR(500),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- INDEXES
-- =====================

-- Core schema indexes
CREATE INDEX idx_users_tenant_id ON core.users(tenant_id);
CREATE INDEX idx_users_email ON core.users(email);
CREATE INDEX idx_user_sessions_user_id ON core.user_sessions(user_id);
CREATE INDEX idx_user_sessions_token_hash ON core.user_sessions(token_hash);
CREATE INDEX idx_user_sessions_expires_at ON core.user_sessions(expires_at);

-- ERP schema indexes
CREATE INDEX idx_employees_tenant_id ON erp.employees(tenant_id);
CREATE INDEX idx_employees_company_id ON erp.employees(company_id);
CREATE INDEX idx_products_tenant_id ON erp.products(tenant_id);
CREATE INDEX idx_products_sku ON erp.products(sku);
CREATE INDEX idx_inventory_product_id ON erp.inventory(product_id);
CREATE INDEX idx_transactions_tenant_id ON erp.transactions(tenant_id);
CREATE INDEX idx_transactions_date ON erp.transactions(transaction_date);
CREATE INDEX idx_orders_tenant_id ON erp.orders(tenant_id);
CREATE INDEX idx_orders_customer_id ON erp.orders(customer_id);
CREATE INDEX idx_orders_status ON erp.orders(status);
CREATE INDEX idx_order_items_order_id ON erp.order_items(order_id);

-- Shared schema indexes
CREATE INDEX idx_notifications_tenant_id ON shared.notifications(tenant_id);
CREATE INDEX idx_notifications_user_id ON shared.notifications(user_id);
CREATE INDEX idx_notifications_status ON shared.notifications(status);
CREATE INDEX idx_files_tenant_id ON shared.files(tenant_id);

-- =====================
-- FUNCTIONS & TRIGGERS
-- =====================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON core.tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON core.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON erp.companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON erp.employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON erp.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON erp.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- INITIAL DATA
-- =====================

-- Insert default permissions
INSERT INTO core.permissions (name, description, resource, action) VALUES
('users.read', 'Read user information', 'users', 'read'),
('users.write', 'Create and update users', 'users', 'write'),
('users.delete', 'Delete users', 'users', 'delete'),
('products.read', 'Read product information', 'products', 'read'),
('products.write', 'Create and update products', 'products', 'write'),
('products.delete', 'Delete products', 'products', 'delete'),
('orders.read', 'Read order information', 'orders', 'read'),
('orders.write', 'Create and update orders', 'orders', 'write'),
('orders.delete', 'Delete orders', 'orders', 'delete'),
('finance.read', 'Read financial information', 'finance', 'read'),
('finance.write', 'Create and update financial records', 'finance', 'write'),
('analytics.read', 'Read analytics and reports', 'analytics', 'read'),
('admin.full', 'Full administrative access', 'admin', 'all');

-- Create a default tenant for development
INSERT INTO core.tenants (id, name, subdomain, status, plan) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Demo Company', 'demo', 'active', 'enterprise');

-- Create default admin user (password: admin123)
INSERT INTO core.users (id, tenant_id, email, password_hash, first_name, last_name, role, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'admin@demo.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5kYJw.Qx4u', 'Admin', 'User', 'admin', 'active');

-- Create default roles for the demo tenant
INSERT INTO core.roles (id, tenant_id, name, description) VALUES
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440000', 'admin', 'Full system administrator'),
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440000', 'manager', 'Business manager with most permissions'),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440000', 'employee', 'Regular employee with limited permissions'),
('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440000', 'customer', 'Customer with basic permissions');

-- Assign admin role to admin user
INSERT INTO core.user_roles (user_id, role_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010');

-- Assign all permissions to admin role
INSERT INTO core.role_permissions (role_id, permission_id)
SELECT '550e8400-e29b-41d4-a716-446655440010', id FROM core.permissions;

-- Create demo company
INSERT INTO erp.companies (id, tenant_id, name, legal_name, tax_id, address, contact_info) VALUES
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440000', 'Demo Company Ltd.', 'Demo Company Limited', 'TAX123456789', 
'{"street": "123 Business St", "city": "Tech City", "state": "CA", "zip": "90210", "country": "USA"}',
'{"email": "contact@demo.com", "phone": "+1-555-0123", "website": "https://demo.com"}');

-- Create databases for different services
CREATE DATABASE i3m_inventory_db;
CREATE DATABASE i3m_procurement_db;
CREATE DATABASE i3m_crm_db;
CREATE DATABASE i3m_ai_db;
CREATE DATABASE i3m_ml_pipeline_db;
CREATE DATABASE i3m_analytics_db;
CREATE DATABASE i3m_user_analytics_db;
CREATE DATABASE i3m_security_db;
CREATE DATABASE i3m_healthcare_db;
CREATE DATABASE i3m_agriculture_db;
CREATE DATABASE i3m_integration_db;

-- Create schemas for Java Spring Boot services
\c i3m_platform;
CREATE SCHEMA IF NOT EXISTS finance;
CREATE SCHEMA IF NOT EXISTS hrm;
CREATE SCHEMA IF NOT EXISTS ecommerce;
CREATE SCHEMA IF NOT EXISTS procurement;
CREATE SCHEMA IF NOT EXISTS crm;
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS healthcare;
CREATE SCHEMA IF NOT EXISTS agriculture;
CREATE SCHEMA IF NOT EXISTS workflow;
CREATE SCHEMA IF NOT EXISTS billing;
CREATE SCHEMA IF NOT EXISTS integration;
CREATE SCHEMA IF NOT EXISTS security;

COMMIT;
