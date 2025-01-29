CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  text TEXT NOT NULL
);