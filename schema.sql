-- Schema for DropshippingStack, matching the Next.js app's queries.
-- Run this against your existing AwardSpace MySQL database (or diff it
-- against your current database.sql and add whatever's missing).

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  email_verified TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS tools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  logo_url VARCHAR(500),
  website_url VARCHAR(500) NOT NULL,
  affiliate_url VARCHAR(500) NOT NULL,
  pricing VARCHAR(100),
  current_price DECIMAL(10,2) DEFAULT NULL,
  rating DECIMAL(2,1) DEFAULT NULL,
  upvotes INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  INDEX (category)
);

CREATE TABLE IF NOT EXISTS clicks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tool_id INT NOT NULL,
  clicked_at DATETIME NOT NULL,
  ip VARCHAR(64),
  FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bookmarks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tool_id INT NOT NULL,
  created_at DATETIME NOT NULL,
  UNIQUE KEY unique_bookmark (user_id, tool_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS upvotes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tool_id INT NOT NULL,
  created_at DATETIME NOT NULL,
  UNIQUE KEY unique_upvote (user_id, tool_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS price_alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tool_id INT NOT NULL,
  target_price DECIMAL(10,2) NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS roadmap_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  done TINYINT(1) NOT NULL DEFAULT 0,
  position INT NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS stacks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  tool_ids JSON NOT NULL,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT DEFAULT NULL,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(100) NOT NULL,
  website_url VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- First admin account (change the password immediately after import via the
-- app: log in as this user, or update the hash directly with bcrypt).
-- INSERT INTO users (name, email, password, role, email_verified, created_at)
-- VALUES ('Admin', 'admin@yourdomain.com', '$2y$12$REPLACE_WITH_BCRYPT_HASH', 'admin', 1, NOW());
