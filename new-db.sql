-- ============================================================
--  A-Web-Based-Python  |  New SQL Script (Bloom's Taxonomy)
--  Generated for 5 cognitive levels of difficulty
--  Database: PostgreSQL
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- DROP TABLES (เพื่อ reset ก่อน create ใหม่)
-- ─────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS activity          CASCADE;
DROP TABLE IF EXISTS session_exercise  CASCADE;
DROP TABLE IF EXISTS session           CASCADE;
DROP TABLE IF EXISTS exercise          CASCADE;
DROP TABLE IF EXISTS user_profile      CASCADE;
DROP TABLE IF EXISTS education         CASCADE;
DROP TABLE IF EXISTS role              CASCADE;


-- ─────────────────────────────────────────────────────────────
-- TABLE: role
-- ─────────────────────────────────────────────────────────────
CREATE TABLE role (
    role_id   SERIAL        PRIMARY KEY,
    role_name VARCHAR(50)   NOT NULL
);


-- ─────────────────────────────────────────────────────────────
-- TABLE: education
-- ─────────────────────────────────────────────────────────────
CREATE TABLE education (
    education_id  SERIAL        PRIMARY KEY,
    university    VARCHAR(100)  NOT NULL,
    faculty       VARCHAR(100)  NOT NULL,
    major         VARCHAR(100)  NOT NULL
);


-- ─────────────────────────────────────────────────────────────
-- TABLE: user_profile
-- ─────────────────────────────────────────────────────────────
CREATE TABLE user_profile (
    user_id             SERIAL        PRIMARY KEY,
    username            VARCHAR(100)  NOT NULL,
    password            VARCHAR(100)  NOT NULL,
    gender              VARCHAR(10)   NOT NULL,
    date_of_birth       DATE          NOT NULL,
    education_id        INT           NOT NULL REFERENCES education(education_id),
    role_id             INT           NOT NULL REFERENCES role(role_id),
    register_timestamp  TIMESTAMP     NOT NULL DEFAULT NOW()
);


-- ─────────────────────────────────────────────────────────────
-- TABLE: exercise
-- ─────────────────────────────────────────────────────────────
CREATE TABLE exercise (
    exercise_id       SERIAL        PRIMARY KEY,
    title             VARCHAR(255)  NOT NULL,
    description       TEXT          NOT NULL,
    topic             VARCHAR(100)  NOT NULL,
    objective         TEXT          NOT NULL,
    difficulty_level  INT           NOT NULL,
    expected_time     INT           NOT NULL,
    status            VARCHAR(50)   NOT NULL,
    hint              TEXT          NOT NULL,
    created_at        TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP     NOT NULL DEFAULT NOW()
);


-- ─────────────────────────────────────────────────────────────
-- TABLE: session
-- ─────────────────────────────────────────────────────────────
CREATE TABLE session (
    session_id        SERIAL        PRIMARY KEY,
    session_name      VARCHAR(100)  NOT NULL,
    session_objective VARCHAR(100)  NOT NULL,
    target_level      VARCHAR(50)   NOT NULL,
    duration          INT           NOT NULL,
    status            VARCHAR(50)   NOT NULL,
    created_at        TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP     NOT NULL DEFAULT NOW()
);


-- ─────────────────────────────────────────────────────────────
-- TABLE: session_exercise  (junction / many-to-many)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE session_exercise (
    session_id   INT       NOT NULL REFERENCES session(session_id)   ON DELETE CASCADE,
    exercise_id  INT       NOT NULL REFERENCES exercise(exercise_id) ON DELETE CASCADE,
    created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (session_id, exercise_id)
);


-- ─────────────────────────────────────────────────────────────
-- TABLE: activity  (บันทึกการส่งโค้ดแต่ละครั้ง)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE activity (
    activity_id       SERIAL        PRIMARY KEY,
    user_id           INT           NOT NULL REFERENCES user_profile(user_id) ON DELETE CASCADE,
    exercise_id       INT           NOT NULL REFERENCES exercise(exercise_id) ON DELETE CASCADE,
    session_id        INT           NOT NULL REFERENCES session(session_id)   ON DELETE CASCADE,
    started_at        TIMESTAMP     NOT NULL,
    submitted_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
    hint_used         BOOLEAN       NOT NULL DEFAULT FALSE,
    answer            TEXT          NOT NULL,
    score             INT           NOT NULL,
    status            VARCHAR(50)   NOT NULL DEFAULT 'PENDING',
    exception_message TEXT,
    ai_feedback       TEXT,
    event_type        VARCHAR(50)   NOT NULL,
    run_count         INT           NOT NULL,
    created_at        TIMESTAMP     NOT NULL DEFAULT NOW()
);


-- ============================================================
--  SEED DATA
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- INSERT: role  (3 roles)
-- ─────────────────────────────────────────────────────────────
INSERT INTO role (role_id, role_name) VALUES
    (1, 'Student'),
    (2, 'Teacher'),
    (3, 'Admin');

-- reset sequence หลัง manual insert
SELECT SETVAL('role_role_id_seq', (SELECT MAX(role_id) FROM role));


-- ─────────────────────────────────────────────────────────────
-- INSERT: education
-- ─────────────────────────────────────────────────────────────
INSERT INTO education (education_id, university, faculty, major) VALUES
    (1, 'Default University', 'Default Faculty', 'Default Major');

SELECT SETVAL('education_education_id_seq', (SELECT MAX(education_id) FROM education));


-- ─────────────────────────────────────────────────────────────
-- INSERT: user_profile  (1 user ต่อ role)
-- ─────────────────────────────────────────────────────────────
INSERT INTO user_profile (user_id, username, password, gender, date_of_birth, education_id, role_id) VALUES
    (1, 'student', '1234', 'male',   '2000-01-01', 1, 1),
    (2, 'teacher', '1234', 'female', '1990-05-15', 1, 2),
    (3, 'admin',   '1234', 'male',   '1985-03-20', 1, 3);

SELECT SETVAL('user_profile_user_id_seq', (SELECT MAX(user_id) FROM user_profile));


-- ─────────────────────────────────────────────────────────────
-- INSERT: exercise  (20 ข้อ แบ่งเป็น 5 ระดับความยากตามหลัก Bloom's Taxonomy)
--   difficulty_level: 
--     1 = Remembering & Understanding 
--     2 = Applying 
--     3 = Analyzing 
--     4 = Evaluating 
--     5 = Creating
-- ─────────────────────────────────────────────────────────────

-- ── Level 1 – Remembering & Understanding (4 ข้อ) ──────────────────────────────────
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES
(101,
 'พิมพ์ Hello World',
 'เขียนโปรแกรมเพื่อแสดงผลคำว่า "Hello, World!" ออกทางหน้าจอให้ถูกต้องตามโครงสร้างภาษา Python',
 'Basic Output',
 'เรียนรู้การใช้งานฟังก์ชัน print() และการส่งออกข้อมูลพื้นฐานออกสู่คอนโซล',
 1, 5, 'active',
 'ใช้คำสั่ง print("Hello, World!")'),

(102,
 'แนะนำตัวเบื้องต้น',
 'เขียนโปรแกรมรับชื่อของผู้ใช้งานผ่านคีย์บอร์ด แล้วนำมาแสดงผลร่วมกับข้อความต้อนรับ เช่น กรอกชื่อ "John" ให้แสดงผลลัพธ์ว่า "Hello, John!"',
 'Variables & Input',
 'ฝึกฝนการใช้งานฟังก์ชัน input() ในการรับข้อมูลผู้ใช้ และเก็บลงในตัวแปรเพื่อนำไปแสดงผลต่อไป',
 1, 5, 'active',
 'ใช้ฟังก์ชัน input() และนำมาต่อกับข้อความทักทาย เช่น print("Hello, " + name + "!")'),

(103,
 'หาชนิดของข้อมูล',
 'เขียนโปรแกรมที่กำหนดตัวแปร x = 42 จากนั้นทำการตรวจสอบชนิดข้อมูลของตัวแปร x และพิมพ์ผลลัพธ์ออกมาทางหน้าจอ',
 'Data Types',
 'ทำความรู้จักกับชนิดข้อมูลจำพวก Integer และเรียนรู้การเช็กชนิดตัวแปรด้วยฟังก์ชัน type()',
 1, 5, 'active',
 'ใช้คำสั่ง print(type(x)) เพื่อแสดงผลชนิดของข้อมูล'),

(104,
 'แสดงข้อความหลายบรรทัดด้วยอักขระพิเศษ',
 'เขียนโปรแกรมแสดงข้อความ "Line 1" และ "Line 2" ออกทางหน้าจอทีละบรรทัด โดยสั่งงานผ่านการเรียกใช้ฟังก์ชัน print() เพียงครั้งเดียวเท่านั้น',
 'Strings & Escape Characters',
 'เข้าใจการใช้งาน Escape Character (\n) สำหรับการขึ้นบรรทัดใหม่ในข้อความสตริง',
 1, 5, 'active',
 'ใช้สัญลักษณ์ \n ในสตริงเพื่อบอกคำสั่งขึ้นบรรทัดใหม่ เช่น print("Line 1\nLine 2")');


-- ── Level 2 – Applying (4 ข้อ) ───────────────────────────
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES
(105,
 'คำนวณพื้นที่วงกลม',
 'เขียนโปรแกรมรับค่ารัศมีของวงกลม (ทศนิยม) เข้ามาจากผู้ใช้งาน จากนั้นแสดงผลพื้นที่วงกลมโดยกำหนดให้ใช้ค่า PI = 3.14 (สูตรพื้นที่วงกลม: 3.14 * r * r)',
 'Variables & Arithmetic',
 'ฝึกฝนการใช้ทักษะการคำนวณพื้นฐานทางคณิตศาสตร์ และการแปลงข้อมูล input เป็นชนิด float()',
 2, 8, 'active',
 'รับข้อมูลด้วย input() แปลงค่าด้วย float() แล้วนำมาคูณกันตามสูตร: 3.14 * radius * radius'),

(106,
 'ตรวจสอบเลขคู่หรือคี่',
 'เขียนโปรแกรมรับข้อมูลตัวเลขจำนวนเต็ม 1 จำนวน แล้วประมวลผลเพื่อตรวจสอบและแสดงผลว่าตัวเลขนั้นเป็นเลขคู่ ("Even") หรือเลขคี่ ("Odd")',
 'Conditionals',
 'ประยุกต์ใช้โครงสร้างเงื่อนไข if-else ในการตัดสินใจและตัวดำเนินทางคณิตศาสตร์ Modulo (%)',
 2, 8, 'active',
 'ตรวจสอบเศษการหารด้วย 2: if number % 2 == 0: print("Even") else: print("Odd")'),

(107,
 'บวกเลขสองจำนวน',
 'เขียนโปรแกรมรับค่าตัวเลขจำนวนเต็ม 2 ตัวแปรจากคีย์บอร์ดของผู้ใช้งาน จากนั้นคำนวณและแสดงผลลัพธ์ผลรวมของตัวเลขทั้งสองตัวออกมา',
 'Variables & Arithmetic',
 'เรียนรู้การจัดการค่าอินพุตหลายค่า การใช้ฟังก์ชันแปลงประเภทข้อมูล int() และการบวกตัวเลข',
 2, 5, 'active',
 'รับอินพุต 2 ตัว แปลงเป็น int ทั้งคู่แล้วนำมารวมกัน เช่น int(input1) + int(input2)'),

(108,
 'แปลงเซลเซียสเป็นฟาเรนไฮต์',
 'เขียนโปรแกรมรับค่าอุณหภูมิในหน่วยเซลเซียส (ทศนิยม) แล้วแปลงเป็นหน่วยอุณหภูมิฟาเรนไฮต์ (สูตรการแปลงคือ: Fahrenheit = (Celsius * 1.8) + 32)',
 'Variables & Arithmetic',
 'ฝึกการแปลงสูตรคำนวณคณิตศาสตร์ในวิชาฟิสิกส์ให้อยู่ในรูปคำสั่งประมวลผลของ Python',
 2, 8, 'active',
 'แปลงข้อมูลนำเข้าเป็น float แล้วประมวลผลด้วยสูตร (celsius * 1.8) + 32');


-- ── Level 3 – Analyzing (4 ข้อ) ────────────────────────────────
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES
(109,
 'หาผลรวมของตัวเลข 1 ถึง N',
 'เขียนโปรแกรมรับค่าตัวเลขจำนวนเต็มบวก N จากผู้ใช้ จากนั้นคำนวณหาผลรวมสะสมของตัวเลขทั้งหมดตั้งแต่ 1 จนถึง N (1 + 2 + ... + N) และแสดงผลลัพธ์',
 'Loops & Accumulation',
 'วิเคราะห์ขั้นตอนการวนลูปการทำงานซ้ำโดยการเขียนตัวแปรเก็บสะสมค่าด้วยคำสั่ง for หรือ while loop',
 3, 12, 'active',
 'สร้างตัวแปรสะสมค่าเริ่มต้นด้วย 0 วนลูปด้วย for i in range(1, N + 1) แล้วสะสมค่าผลรวมเข้าไป'),

(110,
 'นับจำนวนสระในคำ',
 'เขียนโปรแกรมรับคำศัพท์ภาษาอังกฤษ 1 คำ จากผู้ใช้ จากนั้นตรวจสอบและนับจำนวนตัวอักษรที่เป็นสระ (a, e, i, o, u) ในคำดังกล่าวว่ามีกี่ตัว และแสดงจำนวนออกมา',
 'Strings & Iteration',
 'ฝึกทักษะการแยกแยะ วิเคราะห์ความยาวของสตริง และการตรวจสอบการเป็นสมาชิกในเซ็ตของสระ',
 3, 12, 'active',
 'วนลูปตรวจสอบตัวอักษรทีละตัวในข้อความ หากตัวอักษรนั้นอยู่ใน "aeiouAEIOU" ให้บวกตัวนับเพิ่มขึ้น 1'),

(111,
 'สูตรคูณแม่ 2',
 'เขียนโปรแกรมแสดงสูตรคูณแม่ 2 ตั้งแต่ 2 x 1 ไปจนถึง 2 x 12 ออกทางหน้าจอทีละบรรทัดในรูปแบบ "2 x i = ผลลัพธ์"',
 'Loops & Formatting',
 'ทำความเข้าใจลูปและการจัดรูปแบบข้อความสตริงในการแสดงผลให้เป็นระเบียบ',
 3, 10, 'active',
 'วนลูป i ตั้งแต่ 1 ถึง 12 แล้วพิมพ์ในรูปแบบ f"2 x {i} = {2 * i}"'),

(112,
 'ค้นหาค่าเฉลี่ยใน List',
 'กำหนดตัวแปร list ของคะแนนเก็บนักเรียน เช่น scores = [85, 90, 78, 92, 88] เขียนโปรแกรมเพื่อหาค่าเฉลี่ย (Average) ของตัวเลขทั้งหมดใน list ออกมาทางหน้าจอ',
 'Lists & Data Analysis',
 'ทำความเข้าใจและวิเคราะห์โครงสร้างข้อมูลลิสต์ การหาผลรวมทั้งหมด (sum) และความยาวของลิสต์ (len)',
 3, 10, 'active',
 'นำผลรวมข้อมูลทั้งหมดหารด้วยจำนวนสมาชิกของข้อมูล เช่น sum(scores) / len(scores)');


-- ── Level 4 – Evaluating (4 ข้อ) ────────────────────────────────
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES
(113,
 'ตรวจสอบปีอธิกสุรทิน (Leap Year)',
 'เขียนโปรแกรมรับค่าปี ค.ศ. (จำนวนเต็ม) แล้วตรวจสอบว่าเป็นปีอธิกสุรทิน (Leap Year) หรือไม่ โดยกำหนดเงื่อนไข: ปีนั้นต้องหารด้วย 4 ลงตัว และ (ต้องหารด้วย 100 ไม่ลงตัว หรือ ต้องหารด้วย 400 ลงตัว)',
 'Conditionals & Logic Validation',
 'ประเมินค่าและตรวจสอบปีตามเงื่อนไขหลายชั้นทางตรรกศาสตร์ และการดักจับเงื่อนไขทับซ้อน',
 4, 15, 'active',
 'เงื่อนไข: (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)'),

(114,
 'ตรวจสอบพาลินโดรม (Palindrome)',
 'เขียนโปรแกรมรับคำศัพท์ 1 คำ จากนั้นเปรียบเทียบข้อความเพื่อตรวจสอบว่าคำนั้นเป็นคำพาลินโดรม (อ่านจากหน้าไปหลังหรือหลังไปหน้าเหมือนเดิม เช่น "radar", "level") หรือไม่ หากใช่แสดง "Yes" ไม่ใช่แสดง "No"',
 'Strings & Logic Check',
 'ประเมินความสอดคล้องของลำดับสตริงโดยการกลับอักษร (String Slicing หรือการกลับลำดับข้อความ)',
 4, 15, 'active',
 'เปรียบเทียบสตริงเดิมกับสตริงที่ถูกสลับหลังมาหน้าด้วยคำสั่ง string == string[::-1]'),

(115,
 'ตรวจสอบรหัสผ่านที่ปลอดภัย',
 'เขียนโปรแกรมตรวจสอบว่ารหัสผ่านที่กรอกมามีความยาวตั้งแต่ 8 ตัวอักษรขึ้นไป และต้องประกอบด้วยอักขระพิมพ์ใหญ่อย่างน้อย 1 ตัว และตัวเลขอักษรอย่างน้อย 1 ตัว หากผ่านเกณฑ์แสดง "Strong" หากไม่ผ่านแสดง "Weak"',
 'Validation & Exception Check',
 'ประเมินความถูกต้องของความปลอดภัยรหัสผ่านตามเงื่อนไขที่กำหนด และการใช้เมธอดตรวจสอบตัวอักษร',
 4, 15, 'active',
 'เช็กความยาวด้วย len() >= 8 วนลูปตรวจสอบอักขระด้วย .isupper() และ .isdigit() ในแต่ละตำแหน่ง'),

(116,
 'แปลงวินาทีเป็นเวลา',
 'เขียนโปรแกรมรับจำนวนวินาทีทั้งหมด (จำนวนเต็ม) จากผู้ใช้ จากนั้นคำนวณและแปลงหน่วยให้แสดงผลในรูปแบบ ชั่วโมง นาที และวินาทีที่เหลือตามลำดับ',
 'Arithmetic Operations & Division',
 'วิเคราะห์การดำเนินการหารเอาส่วน (//) และการหารเอาเศษ (%) ในการตัดทอนเวลาเชิงตัวเลข',
 4, 15, 'active',
 'หาชั่วโมง: seconds // 3600 | หานาทีที่เหลือ: (seconds % 3600) // 60 | หาวินาทีที่เหลือ: seconds % 60');


-- ── Level 5 – Creating (4 ข้อ) ────────────────────────────────
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES
(117,
 'หาค่าแฟกทอเรียลแบบ Recursion',
 'เขียนฟังก์ชัน factorial(n) เพื่อคำนวณค่าแฟกทอเรียลของตัวเลขจำนวนเต็มบวก n โดยใช้เทคนิคฟังก์ชันเรียกตัวเอง (Recursion) เท่านั้น **ห้ามใช้โครงสร้าง loop วนซ้ำ (for/while) เด็ดขาด**',
 'Recursion & Algorithms',
 'สร้างสรรค์ฟังก์ชันควบคุมแบบเรียกซ้ำตัวเอง (Self-calling functions) เพื่อขจัดโครงสร้างควบคุมแบบดั้งเดิม',
 5, 20, 'active',
 'Base case คือ if n <= 1: return 1 และ Recursive case คือ return n * factorial(n - 1)'),

(118,
 'ค้นหาจำนวนเฉพาะถึง N',
 'เขียนโปรแกรมเพื่อสร้างฟังก์ชันค้นหาตัวเลขที่เป็น "จำนวนเฉพาะ" (Prime Numbers) ทั้งหมดที่มีค่าตั้งแต่ 2 จนถึง N แล้วเก็บตัวเลขทั้งหมดนั้นลงใน List และแสดงผลออกทางหน้าจอ',
 'Custom Algorithms',
 'ออกแบบและสร้างสรรค์อัลกอริทึมในการค้นหาและพิสูจน์จำนวนเฉพาะที่มีประสิทธิภาพตามเงื่อนไขทางคณิตศาสตร์',
 5, 20, 'active',
 'ตัวเลขจำนวนเฉพาะคือตัวเลขที่มีเพียง 1 และตัวมันเองหารลงตัวเท่านั้น เขียนลูปตรวจสอบเศษการหารตั้งแต่ 2 ถึง sqrt(i)'),

(119,
 'เรียงลำดับตัวเลขใน List (Manual Sorting)',
 'เขียนโปรแกรมรับข้อมูล List ของตัวเลขที่ไม่ได้เรียงลำดับ เช่น [64, 34, 25, 12, 22] แล้วดำเนินการจัดเรียงข้อมูลตัวเลขจากน้อยไปมากด้วยตนเอง **ห้ามเรียกใช้ฟังก์ชัน .sort() หรือ sorted() สำเร็จรูปของภาษา**',
 'Sorting Algorithms',
 'คิดค้น ออกแบบ และดำเนินการเขียนโค้ดเรียงลำดับข้อมูลด้วยทฤษฎีอัลกอริทึมพื้นฐาน เช่น Bubble Sort หรือ Selection Sort',
 5, 25, 'active',
 'ใช้วิธีวนลูปสองชั้นเปรียบเทียบข้อมูลตัวเลขข้างกันทีละคู่ (Bubble Sort) แล้วสลับตำแหน่งค่าหากพบว่าตัวหน้ามากกว่าตัวหลัง'),

(120,
 'หาลำดับฟีโบนัชชีตัวที่ N',
 'เขียนฟังก์ชัน fibonacci(n) เพื่อค้นหาและแสดงผลค่าของลำดับฟีโบนัชชี (Fibonacci Sequence) ลำดับที่ n โดยมีฐานข้อมูลเริ่มต้นคือ fib(0)=0, fib(1)=1 และ fib(n)=fib(n-1)+fib(n-2)',
 'Recursion & Dynamic Programming',
 'ออกแบบโครงสร้างโปรแกรมในการคำนวณและประมวลผลโครงสร้างลำดับเลขอนุกรมทางคณิตศาสตร์ระดับสูง',
 5, 20, 'active',
 'ระบุเงื่อนไขเริ่มแรก: if n == 0: return 0, elif n == 1: return 1 จากนั้นคำนวณหาค่าแบบเรียกซ้ำตัวเองหรือสะสมค่าในอาร์เรย์');

SELECT SETVAL('exercise_exercise_id_seq', (SELECT MAX(exercise_id) FROM exercise));


-- ─────────────────────────────────────────────────────────────
-- INSERT: session  (5 sessions แยกตาม 5 ระดับของ Bloom's Taxonomy)
-- ─────────────────────────────────────────────────────────────
INSERT INTO session (session_id, session_name, session_objective, target_level, duration, status) VALUES
(1, 'บทเรียนที่ 1: การจดจำและทำความเข้าใจพื้นฐาน Python (Level 1)', 'เรียนรู้ไวยากรณ์พื้นฐาน ตัวแปร และชนิดข้อมูล', 'Level 1', 45,  'active'),
(2, 'บทเรียนที่ 2: การประยุกต์ใช้งานเบื้องต้น (Level 2)', 'ฝึกการใช้ตัวดำเนินการและเงื่อนไขแบบง่าย', 'Level 2', 60,  'active'),
(3, 'บทเรียนที่ 3: การวิเคราะห์ลอจิกวนซ้ำและข้อมูลชุด (Level 3)', 'ฝึกฝนเรื่องลูป ลิสต์ และฟังก์ชันเบื้องต้น', 'Level 3', 90,  'active'),
(4, 'บทเรียนที่ 4: การประเมินค่าและตรวจสอบตรรกะระดับสูง (Level 4)', 'ฝึกตรวจสอบบั๊ก ดักจับ Edge Cases และตรวจสอบรหัส', 'Level 4', 120, 'active'),
(5, 'บทเรียนที่ 5: การออกแบบอัลกอริทึมและฟังก์ชันซับซ้อน (Level 5)', 'เรียนรู้อัลกอริทึมเรียงลำดับและการเขียน Recursion', 'Level 5', 150, 'active');

SELECT SETVAL('session_session_id_seq', (SELECT MAX(session_id) FROM session));


-- ─────────────────────────────────────────────────────────────
-- INSERT: session_exercise  (เชื่อมโจทย์ทั้ง 20 ข้อเข้า 5 Session)
--   Session 1 (Remembering & Understanding) ← exercise 101–104
--   Session 2 (Applying)                    ← exercise 105–108
--   Session 3 (Analyzing)                   ← exercise 109–112
--   Session 4 (Evaluating)                  ← exercise 113–116
--   Session 5 (Creating)                    ← exercise 117–120
-- ─────────────────────────────────────────────────────────────
INSERT INTO session_exercise (session_id, exercise_id) VALUES
-- Session 1
(1, 101), (1, 102), (1, 103), (1, 104),
-- Session 2
(2, 105), (2, 106), (2, 107), (2, 108),
-- Session 3
(3, 109), (3, 110), (3, 111), (3, 112),
-- Session 4
(4, 113), (4, 114), (4, 115), (4, 116),
-- Session 5
(5, 117), (5, 118), (5, 119), (5, 120);


-- ============================================================
--  END OF SCRIPT
-- ============================================================
