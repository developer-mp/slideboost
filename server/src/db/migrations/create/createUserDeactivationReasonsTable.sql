CREATE TABLE user_deactivation_reasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reason VARCHAR(100) UNIQUE NOT NULL
);