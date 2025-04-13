-- Hotspot Uygulaması Veritabanı Şeması

-- Organizasyon tablosu
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    logo_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Rol tablosu
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Kullanıcı tablosu
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    role_id INTEGER REFERENCES roles(id),
    is_super_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- İzin tablosu
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Rol-İzin ilişki tablosu
CREATE TABLE role_permissions (
    role_id INTEGER REFERENCES roles(id),
    permission_id INTEGER REFERENCES permissions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id)
);

-- Firewall türleri tablosu
CREATE TABLE firewall_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Firewall konfigürasyonu tablosu
CREATE TABLE firewall_configs (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    firewall_type_id INTEGER REFERENCES firewall_types(id),
    name VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    port INTEGER,
    username VARCHAR(100),
    password_encrypted VARCHAR(255),
    api_key_encrypted VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    connection_status VARCHAR(50),
    last_connected TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Kimlik doğrulama yöntemleri tablosu
CREATE TABLE auth_methods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Organizasyon kimlik doğrulama yöntemleri tablosu
CREATE TABLE organization_auth_methods (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    auth_method_id INTEGER REFERENCES auth_methods(id),
    is_enabled BOOLEAN DEFAULT TRUE,
    config JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (organization_id, auth_method_id)
);

-- PMS entegrasyonları tablosu
CREATE TABLE pms_integrations (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    name VARCHAR(100) NOT NULL,
    pms_type VARCHAR(100) NOT NULL,
    api_url VARCHAR(255),
    api_key_encrypted VARCHAR(255),
    username VARCHAR(100),
    password_encrypted VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    connection_status VARCHAR(50),
    last_connected TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Hotspot misafir tablosu
CREATE TABLE guests (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    nationality VARCHAR(100),
    id_number VARCHAR(100),
    room_number VARCHAR(50),
    auth_method_id INTEGER REFERENCES auth_methods(id),
    auth_reference VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Hotspot oturumları tablosu
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    guest_id INTEGER REFERENCES guests(id),
    organization_id INTEGER REFERENCES organizations(id),
    ip_address VARCHAR(45) NOT NULL,
    mac_address VARCHAR(17) NOT NULL,
    device_type VARCHAR(100),
    browser VARCHAR(100),
    os VARCHAR(100),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration INTEGER,
    data_usage_bytes BIGINT DEFAULT 0,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5651 logları tablosu
CREATE TABLE logs_5651 (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    session_id INTEGER REFERENCES sessions(id),
    ip_address VARCHAR(45) NOT NULL,
    mac_address VARCHAR(17) NOT NULL,
    destination_ip VARCHAR(45) NOT NULL,
    destination_port INTEGER NOT NULL,
    protocol VARCHAR(10) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Hotspot paketleri tablosu
CREATE TABLE hotspot_packages (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    data_limit_bytes BIGINT,
    bandwidth_limit_kbps INTEGER,
    price DECIMAL(10, 2),
    currency VARCHAR(3),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Misafir paket abonelikleri tablosu
CREATE TABLE guest_packages (
    id SERIAL PRIMARY KEY,
    guest_id INTEGER REFERENCES guests(id),
    package_id INTEGER REFERENCES hotspot_packages(id),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sistem ayarları tablosu
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    key VARCHAR(100) NOT NULL,
    value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (organization_id, key)
);

-- Bildirimler tablosu
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Varsayılan roller ekleme
INSERT INTO roles (name, description) VALUES 
('Super Admin', 'Tüm sisteme tam erişim'),
('Organization Admin', 'Organizasyon içinde tam yetki'),
('Manager', 'Yönetici yetkileri'),
('Staff', 'Sınırlı personel yetkileri'),
('Read Only', 'Sadece okuma yetkileri');

-- Varsayılan izinler ekleme
INSERT INTO permissions (name, description) VALUES 
('user.view', 'Kullanıcıları görüntüleme'),
('user.create', 'Kullanıcı oluşturma'),
('user.edit', 'Kullanıcı düzenleme'),
('user.delete', 'Kullanıcı silme'),
('guest.view', 'Misafirleri görüntüleme'),
('guest.create', 'Misafir oluşturma'),
('guest.edit', 'Misafir düzenleme'),
('guest.delete', 'Misafir silme'),
('session.view', 'Oturumları görüntüleme'),
('session.create', 'Oturum oluşturma'),
('session.edit', 'Oturum düzenleme'),
('session.delete', 'Oturum silme'),
('firewall.view', 'Firewall yapılandırmalarını görüntüleme'),
('firewall.create', 'Firewall yapılandırması oluşturma'),
('firewall.edit', 'Firewall yapılandırması düzenleme'),
('firewall.delete', 'Firewall yapılandırması silme'),
('log.view', '5651 loglarını görüntüleme'),
('report.view', 'Raporları görüntüleme'),
('report.create', 'Rapor oluşturma'),
('setting.view', 'Ayarları görüntüleme'),
('setting.edit', 'Ayarları düzenleme');

-- Rol-İzin ilişkilerini ekleme
-- Super Admin tüm izinlere sahip
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;

-- Organization Admin tüm izinlere sahip
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, id FROM permissions;

-- Manager için izinler
INSERT INTO role_permissions (role_id, permission_id)
SELECT 3, id FROM permissions WHERE name NOT LIKE '%.delete';

-- Staff için izinler
INSERT INTO role_permissions (role_id, permission_id)
SELECT 4, id FROM permissions WHERE name LIKE '%.view' OR name IN ('guest.create', 'guest.edit', 'session.create');

-- Read Only için izinler
INSERT INTO role_permissions (role_id, permission_id)
SELECT 5, id FROM permissions WHERE name LIKE '%.view';

-- Firewall türlerini ekleme
INSERT INTO firewall_types (name, description) VALUES 
('Sophos', 'Sophos Firewall entegrasyonu'),
('Fortinet', 'Fortinet Firewall entegrasyonu'),
('Cisco', 'Cisco Firewall entegrasyonu'),
('Mikrotik', 'Mikrotik Router entegrasyonu');

-- Kimlik doğrulama yöntemlerini ekleme
INSERT INTO auth_methods (name, description) VALUES 
('SMS', 'SMS ile doğrulama'),
('Email', 'E-posta ile doğrulama'),
('PMS', 'Otel PMS entegrasyonu ile doğrulama'),
('Facebook', 'Facebook ile giriş'),
('Google', 'Google ile giriş'),
('Twitter', 'Twitter ile giriş'),
('Apple', 'Apple ile giriş'),
('Form', 'Form doldurarak kayıt');
