CREATE TABLE supported_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  extension VARCHAR(10) UNIQUE NOT NULL,
  type VARCHAR(10) NOT NULL
);