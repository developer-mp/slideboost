CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  google_id VARCHAR(255) UNIQUE NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  verification_code VARCHAR(6) NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  code_expires_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  size INT NOT NULL,
  folder VARCHAR(10) NOT NULL,
  template_category VARCHAR(20) NULL,
  file_id VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  source VARCHAR(10) NULL,
  user_id UUID NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    balance NUMERIC(10, 2) DEFAULT 10,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE deactivation_reasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reason VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE faq (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL
);

CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  text TEXT NOT NULL
);

CREATE TABLE supported_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  extension VARCHAR(10) UNIQUE NOT NULL,
  type VARCHAR(10) NOT NULL,
  category VARCHAR(10) NOT NULL
);

CREATE TABLE template_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE user_deactivation_reasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reason VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO deactivation_reasons (reason)
VALUES 
('Privacy concerns'),
('Too many notifications'),
('Service is too expensive'),
('Switching to a competitor'),
('No longer needed the service'),
('Technical issues or bugs'),
('Poor customer service'),
('Too complex or hard to use'),
('Lack of features I want'),
('Other');

INSERT INTO faq (question, answer)
VALUES 
('What is SlideBoost?', 'SlideBoost is a platform that allows users to seamlessly integrate and customize content from a variety of sources, including video, text, images, and audio, to create appealing presentations'),
('How do I get started with SlideBoost?', 'To get started with SlideBoost, simply create an account and follow the on-screen instructions to start converting your content into presentations'),
('What content formats does SlideBoost support?', 'SlideBoost supports a wide range of formats, including video, audio, text, and images'),
('Can I use SlideBoost on both Windows and Mac?', 'Yes, SlideBoost is compatible with both Windows and Mac operating systems'),
('Is there a mobile version of SlideBoost?', 'Currently, SlideBoost is available for desktop use. We are working on a mobile version, so stay tuned for updates'),
('How much does SlideBoost cost?', 'SlideBoost offers a variety of pricing plans, including a free version with basic features and premium plans that provide access to advanced tools and features'),
('How can I contact customer support?', 'You can reach our customer support team through the "Contact" page on our website'),
('How do I save and export my finished file?', 'Once you have finished converting your video, you can save your project and export it in your desired format'),
('Is my data safe with SlideBoost?', 'SlideBoost takes data security seriously. We implement industry-standard security measures to protect your projects and personal information'),
('Can I cancel my subscription at any time?', 'Yes, you can cancel your subscription at any time through your account settings');

INSERT INTO news (date, text)
VALUES 
('2025-02-01', 'SlideBoost has been launched! This new platform promises to improve presentation generation from the most popular formats like text, audio, video, and more.'),
('2024-02-02', 'The sale is now live! Enjoy discounts on all premium features until the end of the month.');

INSERT INTO supported_files (extension, type, category)
VALUES 
('ppt', 'PowerPoint', 'templates'),
('pptx', 'PowerPoint', 'templates'),
('txt', 'Text', 'media'),
('docs', 'Text', 'media'),
('pdf', 'Text', 'media'),
('png', 'Image', 'media'),
('jpg', 'Image', 'media'),
('jpeg', 'Image', 'media'),
('tiff', 'Image', 'media'),
('gif', 'Image', 'media'),
('bmp', 'Image', 'media'),
('webp', 'Image', 'media'),
('mp4', 'Video', 'media'),
('mpg', 'Video', 'media'),
('mpeg', 'Video', 'media'),
('avi', 'Video', 'media'),
('mov', 'Video', 'media'),
('wmv', 'Video', 'media'),
('mkv', 'Video', 'media'),
('webm', 'Video', 'media'),
('3gp', 'Video', 'media'),
('mp3', 'Audio', 'media'),
('wav', 'Audio', 'media');

INSERT INTO template_categories (category_name)
VALUES 
('Education'),
('Health'),
('Finance'),
('Art'),
('Business'),
('Science');