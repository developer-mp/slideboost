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
  code_expires_at TIMESTAMP WITH TIME ZONE,
  survey_sent BOOLEAN DEFAULT FALSE
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

CREATE TABLE user_deactivation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reason VARCHAR(100) NOT NULL,
  details VARCHAR(255) NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE survey (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  satisfaction VARCHAR(17) NULL,
  would_pay BOOLEAN NULL,
  like_most VARCHAR(255) NULL,
  like_least VARCHAR(255) NULL,
  feature_requests VARCHAR(255) NULL,
  ease_of_use VARCHAR(14) NULL,
  recommendation VARCHAR(11) NULL,
  comments VARCHAR(255) NULL,
  submited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
('What is SlideBoost?', 'SlideBoost is a platform that allows users to seamlessly integrate and customize content from a variety of sources, including video, text, images, audio, and live events, meetings, and webinars, to create appealing presentations.'),
('How do I get started with SlideBoost?', 'To get started with SlideBoost, simply create an account and follow the on-screen instructions to start converting your content into presentations.'),
('What content formats does SlideBoost support?', 'SlideBoost supports a wide range of formats, including video, audio, text, and images.'),
('How to capture a live event?', 'Real-time presentation creation is under development.'),
('Can I use SlideBoost on both Windows and Mac?', 'Yes, SlideBoost is compatible with both Windows and Mac operating systems.'),
('Is there a mobile version of SlideBoost?', 'Currently, SlideBoost is available for desktop use. We are working on a mobile version, so stay tuned for updates.'),
('How much does SlideBoost cost?', 'At the moment, SlideBoost is in the MVP (Minimum Viable Product) stage, offering the basic functionality of converting existing static files into dynamic presentations, with credits based on a pay-per-use basis.'),
('How can I contact customer support?', 'You can reach our customer support team through the "Contact" page on our website.'),
('How do I save and export my finished file?', 'Once you have finished converting your content, it is saved in the Projects menu, where you can easily download it to your local computer.'),
('Is my data safe with SlideBoost?', 'SlideBoost takes data security seriously. We implement industry-standard security measures to protect your projects and personal information'),
('Can I cancel my subscription at any time?', 'Currently, there is no subscription obligation. Credits are purchased on a pay-per-use basis, and unused credits are not returned.');

INSERT INTO news (date, text)
VALUES 
('2025-03-20', 'SlideBoost has been launched! This new platform promises to revolutionize the way presentations are created by allowing users to seamlessly integrate and customize content from a variety of popular formats such as text, audio, video, and more. Get ready for a whole new level of presentation creation!'),
('2024-03-21', 'Stay tuned for upcoming features! In the next releases, we are working on adding support for even more formats, customized templates to suit your unique needs, YouTube link integration for easy video embedding, and enhanced sharing options to make your presentations even more interactive and collaborative!');

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

WITH inserted_user AS (
  INSERT INTO users (google_id, name, email, password, created_at, updated_at, verification_code, is_verified, code_expires_at)
  VALUES
  (NULL, 'admin', 'support@slideboost.org', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, true, NULL)
RETURNING id
)

INSERT INTO files (name, file_path, type, size, folder, template_category, file_id, file_url, uploaded_at, source, user_id)
SELECT
  'Class.pptx', 'default/Class.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 475034, 'templates', 'Education', '4_z478dd0c147fd18b0904f0b17_f10914bd49eabfd37_d20250208_m035425_c005_v0501024_t0040_u01738986865274', 'https://slideboost.s3.us-east-005.backblazeb2.com/default/Class.pptx', CURRENT_TIMESTAMP, 'system', id
FROM inserted_user
UNION ALL
SELECT
  'Colors.pptx', 'default/Colors.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 1258291, 'templates', 'Art', '4_z478dd0c147fd18b0904f0b17_f110f39159ff11f1c_d20250208_m030307_c005_v0501002_t0057_u01738983787662', 'https://slideboost.s3.us-east-005.backblazeb2.com/default/Colors.pptx', CURRENT_TIMESTAMP, 'system', id
FROM inserted_user
UNION ALL
SELECT  
  'Cost.pptx', 'default/Cost.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 938086, 'templates', 'Finance', '4_z478dd0c147fd18b0904f0b17_f1049762dc2bb5a4b_d20250208_m040025_c005_v0501021_t0045_u01738987225633', 'https://slideboost.s3.us-east-005.backblazeb2.com/default/Cost.pptx', CURRENT_TIMESTAMP, 'system', id
FROM inserted_user
UNION ALL
SELECT  
  'Fashion Spring.pptx', 'default/Fashion Spring.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 3457901, 'templates', 'Art', '4_z478dd0c147fd18b0904f0b17_f1145f5d383e59218_d20250208_m052040_c005_v0501015_t0020_u01738992040171', 'https://slideboost.s3.us-east-005.backblazeb2.com/default/Fashion Spring.pptx', CURRENT_TIMESTAMP, 'system', id
FROM inserted_user
UNION ALL
SELECT  
  'Human Health.pptx', 'default/Human Health.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 40346, 'templates', 'Health', '4_z478dd0c147fd18b0904f0b17_f10914bd49eaf0418_d20250208_m044123_c005_v0501024_t0050_u01738989683529', 'https://slideboost.s3.us-east-005.backblazeb2.com/default/Human Health.pptx', CURRENT_TIMESTAMP, 'system', id
FROM inserted_user
UNION ALL
SELECT  
  'Infographic.pptx', 'default/Infographic.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 38400, 'templates', 'Business', '4_z478dd0c147fd18b0904f0b17_f111c73c126d96552_d20250208_m020626_c005_v0501027_t0046_u01738980386329', 'https://slideboost.s3.us-east-005.backblazeb2.com/default/Infographic.pptx', CURRENT_TIMESTAMP, 'system', id
FROM inserted_user
UNION ALL
SELECT  
  'Investor.pptx', 'default/Investor.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 1467990, 'templates', 'Finance', '4_z478dd0c147fd18b0904f0b17_f114922ac11ac76f4_d20250208_m042809_c005_v0501008_t0050_u01738988889829', 'https://slideboost.s3.us-east-005.backblazeb2.com/default/Investor.pptx', CURRENT_TIMESTAMP, 'system', id
FROM inserted_user
UNION ALL
SELECT  
  'Lab.pptx', 'default/Lab.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 610509, 'templates', 'Science', '4_z478dd0c147fd18b0904f0b17_f117a33c888690a65_d20250208_m043343_c005_v0501028_t0022_u01738989223651', 'https://slideboost.s3.us-east-005.backblazeb2.com/default/Lab.pptx', CURRENT_TIMESTAMP, 'system', id
FROM inserted_user
UNION ALL
SELECT  
  'Meeting.pptx', 'default/Meeting.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 39014, 'templates', 'Science', '4_z478dd0c147fd18b0904f0b17_f110e32c9864d5bed_d20250208_m031822_c005_v0501026_t0016_u01738984702477', 'https://slideboost.s3.us-east-005.backblazeb2.com/default/Meeting.pptx', CURRENT_TIMESTAMP, 'system', id
FROM inserted_user
UNION ALL
SELECT  
  'Mental.pptx', 'default/Mental.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 70861, 'templates', 'Health', '4_z478dd0c147fd18b0904f0b17_f1001e11dc6ce307f_d20250208_m031137_c005_v0501028_t0028_u01738984297035', 'https://slideboost.s3.us-east-005.backblazeb2.com/default/Mental.pptx', CURRENT_TIMESTAMP, 'system', id
FROM inserted_user
UNION ALL
SELECT  
  'Planning.pptx', 'default/Planning.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 406323, 'templates', 'Business', '4_z478dd0c147fd18b0904f0b17_f102da9f3f190f8ce_d20250208_m045703_c005_v0501012_t0031_u01738990623211', 'https://slideboost.s3.us-east-005.backblazeb2.com/default/Planning.pptx', CURRENT_TIMESTAMP, 'system', id
FROM inserted_user
UNION ALL
SELECT  
  'Student.pptx', 'default/Student.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 776499, 'templates', 'Education', '4_z478dd0c147fd18b0904f0b17_f1161cac060b1c977_d20250208_m043208_c005_v0501019_t0008_u01738989128133', 'https://slideboost.s3.us-east-005.backblazeb2.com/default/Student.pptx', CURRENT_TIMESTAMP, 'system', id
FROM inserted_user;