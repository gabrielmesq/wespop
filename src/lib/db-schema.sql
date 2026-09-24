-- CREATE DATABASE IF NOT EXISTS wespop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE wespop;

CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_username (username)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_active (is_active)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  details JSON,
  price DECIMAL(10, 2) NOT NULL,
  image LONGTEXT,
  category_id INT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_category (category_id),
  INDEX idx_active (is_active),
  CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS login_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45),
  attempted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  success BOOLEAN NOT NULL DEFAULT FALSE,
  INDEX idx_email_time (email, attempted_at),
  INDEX idx_ip_time (ip_address, attempted_at)
) ENGINE=InnoDB;

-- Seed default admin user (password: admin123 - MUST be changed)
INSERT INTO admin_users (email, username, password_hash, name) VALUES
('admin@wespopmindlabs.com.br', 'admin', '$2b$12$VjavG2iE.NnqL/WcFqeVwOyXUGpYnC9Zl8/XMj0LaSOgaIqoKn4sa', 'Administrador')
ON DUPLICATE KEY UPDATE id=id;

-- Seed initial categories matching existing data
INSERT INTO categories (name, slug, is_active) VALUES
('Masculinos', 'masculino', TRUE),
('Femininos', 'feminino', TRUE),
('Personalizados', 'personalizado', TRUE)
ON DUPLICATE KEY UPDATE id=id;
