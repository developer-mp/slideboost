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