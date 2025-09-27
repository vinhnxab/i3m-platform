-- Create schemas for I3M Platform
-- This script creates all necessary schemas for the microservices

-- Core schemas
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS finance;
CREATE SCHEMA IF NOT EXISTS hrm;
CREATE SCHEMA IF NOT EXISTS inventory;
CREATE SCHEMA IF NOT EXISTS procurement;
CREATE SCHEMA IF NOT EXISTS ecommerce;
CREATE SCHEMA IF NOT EXISTS crm;
CREATE SCHEMA IF NOT EXISTS ai;
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS content;
CREATE SCHEMA IF NOT EXISTS media;
CREATE SCHEMA IF NOT EXISTS metadata;
CREATE SCHEMA IF NOT EXISTS healthcare;
CREATE SCHEMA IF NOT EXISTS agriculture;
CREATE SCHEMA IF NOT EXISTS security;
CREATE SCHEMA IF NOT EXISTS observability;
CREATE SCHEMA IF NOT EXISTS cost_optimization;
CREATE SCHEMA IF NOT EXISTS load_balancer;
CREATE SCHEMA IF NOT EXISTS secrets;
CREATE SCHEMA IF NOT EXISTS templates;
CREATE SCHEMA IF NOT EXISTS installation;
CREATE SCHEMA IF NOT EXISTS preview;
CREATE SCHEMA IF NOT EXISTS notification;
CREATE SCHEMA IF NOT EXISTS workflow;
CREATE SCHEMA IF NOT EXISTS billing;
CREATE SCHEMA IF NOT EXISTS integration;
CREATE SCHEMA IF NOT EXISTS currency;

-- Grant permissions to i3m_user
GRANT ALL PRIVILEGES ON SCHEMA core TO i3m_user;
GRANT ALL PRIVILEGES ON SCHEMA finance TO i3m_user;
GRANT ALL PRIVILEGES ON SCHEMA hrm TO i3m_user;
GRANT ALL PRIVILEGES ON SCHEMA inventory TO i3m_user;
GRANT ALL PRIVILEGES ON SCHEMA procurement TO i3m_user;
GRANT ALL PRIVILEGES ON SCHEMA ecommerce TO i3m_user;
GRANT ALL PRIVILEGES ON SCHEMA crm TO i3m_user;
GRANT ALL PRIVILEGES ON SCHEMA ai TO i3m_user;
GRANT ALL PRIVILEGES ON SCHEMA analytics TO i3m_user;
GRANT ALL PRIVILEGES ON SCHEMA content TO i3m_user;
GRANT ALL PRIVILEGES ON SCHEMA media TO i3m_user;
GRANT ALL PRIVILEGES ON SCHEMA metadata TO i3m_user;
GRANT ALL PRIVILEGES ON SCHEMA healthcare TO i3m_user;
GRANT ALL PRIVILEGES ON SCHEMA agriculture TO i3m_user;
GRANT ALL PRIVILEGES ON SCHEMA security TO i3m_user;
GRANT ALL PRIVILEGES ON SCHEMA observability TO i3m_user;
GRANT ALL PRIVILEGES ON SCHEMA cost_optimization TO i3m_user;
GRANT ALL PRIVILEGES ON SCHEMA load_balancer TO i3m_user;
GRANT ALL PRIVILEGES ON SCHEMA secrets TO i3m_user;
GRANT ALL PRIVILEGES ON SCHEMA templates TO i3m_user;
GRANT ALL PRIVILEGES ON SCHEMA installation TO i3m_user;
GRANT ALL PRIVILEGES ON SCHEMA preview TO i3m_user;
GRANT ALL PRIVILEGES ON SCHEMA notification TO i3m_user;
GRANT ALL PRIVILEGES ON SCHEMA workflow TO i3m_user;
GRANT ALL PRIVILEGES ON SCHEMA billing TO i3m_user;
GRANT ALL PRIVILEGES ON SCHEMA integration TO i3m_user;
GRANT ALL PRIVILEGES ON SCHEMA currency TO i3m_user;

-- Create core tables
CREATE TABLE IF NOT EXISTS core.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    plan VARCHAR(50) DEFAULT 'basic',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS core.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
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
    UNIQUE(email, tenant_id)
);

CREATE TABLE IF NOT EXISTS core.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES core.users(id),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON core.users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON core.users(email);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON core.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON core.user_sessions(expires_at);

-- Insert default tenant
INSERT INTO core.tenants (id, name, subdomain, status, plan) 
VALUES ('00000000-0000-0000-0000-000000000000', 'Default Tenant', 'default', 'active', 'enterprise')
ON CONFLICT (subdomain) DO NOTHING;
