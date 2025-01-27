CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  size INT NOT NULL,
  folder VARCHAR(10) NOT NULL,
  template_category VARCHAR(20) NULL,
  file_id VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  png_url TEXT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id UUID NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);