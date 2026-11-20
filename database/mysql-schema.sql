SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS om_schema_migrations (
  version VARCHAR(64) PRIMARY KEY,
  applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS om_admin_users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  display_name VARCHAR(160) NOT NULL DEFAULT '',
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('owner','manager','editor','sales','viewer') NOT NULL DEFAULT 'viewer',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS om_admin_sessions (
  id CHAR(36) PRIMARY KEY,
  admin_id CHAR(36) NOT NULL,
  token_hash CHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  last_seen_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX om_sessions_admin_idx (admin_id),
  INDEX om_sessions_expiry_idx (expires_at),
  CONSTRAINT om_sessions_user_fk FOREIGN KEY (admin_id) REFERENCES om_admin_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS om_admin_login_attempts (
  email_hash CHAR(64) NOT NULL,
  ip_hash CHAR(64) NOT NULL,
  failure_count TINYINT UNSIGNED NOT NULL DEFAULT 0,
  window_started_at DATETIME NOT NULL,
  blocked_until DATETIME NULL,
  PRIMARY KEY (email_hash,ip_hash),
  INDEX om_login_blocked_idx (blocked_until)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS om_categories (
  id CHAR(36) PRIMARY KEY,
  slug VARCHAR(120) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(2000) NOT NULL DEFAULT '',
  parent_id CHAR(36) NULL,
  display_order INT UNSIGNED NOT NULL DEFAULT 0,
  status ENUM('draft','published','archived') NOT NULL DEFAULT 'published',
  draft_json JSON NOT NULL,
  published_json JSON NULL,
  published_by CHAR(36) NULL,
  published_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX om_categories_order_idx (status,display_order),
  CONSTRAINT om_category_parent_fk FOREIGN KEY (parent_id) REFERENCES om_categories(id) ON DELETE RESTRICT,
  CONSTRAINT om_category_publisher_fk FOREIGN KEY (published_by) REFERENCES om_admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS om_products (
  id CHAR(36) PRIMARY KEY,
  slug VARCHAR(180) NOT NULL UNIQUE,
  category_id CHAR(36) NULL,
  category VARCHAR(120) NOT NULL,
  status ENUM('draft','published','archived') NOT NULL DEFAULT 'published',
  display_order INT UNSIGNED NOT NULL DEFAULT 0,
  draft_json JSON NOT NULL,
  published_json JSON NULL,
  published_at DATETIME NULL,
  published_by CHAR(36) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX om_products_public_idx (status,category,display_order),
  INDEX om_products_updated_idx (updated_at),
  CONSTRAINT om_product_category_fk FOREIGN KEY (category_id) REFERENCES om_categories(id) ON DELETE SET NULL,
  CONSTRAINT om_product_publisher_fk FOREIGN KEY (published_by) REFERENCES om_admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS om_media (
  id CHAR(36) PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  mime_type ENUM('image/jpeg','image/png','image/webp','image/avif') NOT NULL,
  byte_size INT UNSIGNED NOT NULL,
  width INT UNSIGNED NULL,
  height INT UNSIGNED NULL,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  alt_text VARCHAR(500) NOT NULL DEFAULT '',
  category ENUM('product','homepage','about','gallery','other') NOT NULL DEFAULT 'other',
  image_data LONGBLOB NOT NULL,
  uploaded_by CHAR(36) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX om_media_category_idx (category,created_at),
  CONSTRAINT om_media_uploader_fk FOREIGN KEY (uploaded_by) REFERENCES om_admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS om_site_content (
  content_key VARCHAR(180) PRIMARY KEY,
  draft_json JSON NOT NULL,
  published_json JSON NULL,
  updated_by CHAR(36) NULL,
  published_by CHAR(36) NULL,
  published_at DATETIME NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT om_content_editor_fk FOREIGN KEY (updated_by) REFERENCES om_admin_users(id) ON DELETE SET NULL,
  CONSTRAINT om_content_publisher_fk FOREIGN KEY (published_by) REFERENCES om_admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS om_content_versions (
  id CHAR(36) PRIMARY KEY,
  content_key VARCHAR(180) NOT NULL,
  content_json JSON NOT NULL,
  actor_id CHAR(36) NULL,
  action ENUM('draft_saved','published','restored') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX om_versions_key_idx (content_key,created_at),
  CONSTRAINT om_version_actor_fk FOREIGN KEY (actor_id) REFERENCES om_admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS om_enquiries (
  id CHAR(36) PRIMARY KEY,
  type ENUM('quote','sample') NOT NULL DEFAULT 'quote',
  customer_name VARCHAR(160) NOT NULL,
  company_name VARCHAR(200) NOT NULL DEFAULT '',
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(60) NOT NULL DEFAULT '',
  country VARCHAR(120) NOT NULL,
  product_names JSON NOT NULL,
  form_size VARCHAR(200) NOT NULL DEFAULT '',
  quantity VARCHAR(120) NOT NULL DEFAULT '',
  unit VARCHAR(100) NOT NULL DEFAULT '',
  packaging VARCHAR(240) NOT NULL DEFAULT '',
  destination VARCHAR(240) NOT NULL DEFAULT '',
  timeline VARCHAR(120) NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  status ENUM('new','contacted','in_progress','completed','cancelled') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX om_enquiries_status_idx (status,created_at),
  INDEX om_enquiries_email_idx (email),
  INDEX om_enquiries_created_idx (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS om_enquiry_notes (
  id CHAR(36) PRIMARY KEY,
  enquiry_id CHAR(36) NOT NULL,
  admin_id CHAR(36) NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX om_enquiry_notes_idx (enquiry_id,created_at),
  CONSTRAINT om_note_enquiry_fk FOREIGN KEY (enquiry_id) REFERENCES om_enquiries(id) ON DELETE CASCADE,
  CONSTRAINT om_note_admin_fk FOREIGN KEY (admin_id) REFERENCES om_admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS om_admin_activity (
  id CHAR(36) PRIMARY KEY,
  admin_id CHAR(36) NULL,
  action VARCHAR(120) NOT NULL,
  entity VARCHAR(120) NOT NULL,
  entity_id VARCHAR(180) NULL,
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX om_activity_created_idx (created_at),
  CONSTRAINT om_activity_admin_fk FOREIGN KEY (admin_id) REFERENCES om_admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS om_admin_backups (
  id CHAR(36) PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  byte_size BIGINT UNSIGNED NOT NULL,
  checksum CHAR(64) NOT NULL,
  backup_data LONGBLOB NOT NULL,
  created_by CHAR(36) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT om_backup_admin_fk FOREIGN KEY (created_by) REFERENCES om_admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
