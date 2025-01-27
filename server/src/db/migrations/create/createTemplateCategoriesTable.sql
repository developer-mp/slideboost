CREATE TABLE template_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_name VARCHAR(20) UNIQUE NOT NULL
);