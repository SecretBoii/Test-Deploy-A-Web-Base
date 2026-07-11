-- ============================================================
--  A-Web-Based-Python  |  Full SQL Script
--  Generated from Prisma schema + seed data
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
    session_name      VARCHAR(50)   NOT NULL,
    session_objective VARCHAR(50)   NOT NULL,
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
    (1, 'student1', '1234_hashed_or_plain', 'male',   '2000-01-01', 1, 1),
    (2, 'teacher1', '1234_hashed_or_plain', 'female', '1990-05-15', 1, 2),
    (3, 'admin1',   '1234_hashed_or_plain', 'male',   '1985-03-20', 1, 3);

SELECT SETVAL('user_profile_user_id_seq', (SELECT MAX(user_id) FROM user_profile));


-- ─────────────────────────────────────────────────────────────
-- INSERT: exercise  (20 ข้อ แบ่ง 3 ระดับ)
--   difficulty_level: 1 = Basic | 2 = Intermediate | 3 = Advanced
-- ─────────────────────────────────────────────────────────────

-- ── Level 1 – Basic (7 ข้อ) ──────────────────────────────────
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES
(101,
 'พิมพ์ Hello World',
 'เขียนโปรแกรมเพื่อแสดงผลคำว่า "Hello, World!" ออกทางหน้าจอ',
 'Basic Output',
 'เรียนรู้การใช้งานฟังก์ชัน print() ใน Python',
 1, 5, 'active',
 'ใช้คำสั่ง print("Hello, World!")'),

(102,
 'บวกเลขสองจำนวน',
 'เขียนโปรแกรมรับค่าตัวเลขจำนวนเต็ม 2 จำนวนจากผู้ใช้ แล้วแสดงผลลัพธ์เป็นผลรวมของเลขทั้งสอง',
 'Variables & Basic Arithmetic',
 'ฝึกการรับค่าด้วย input(), แปลงชนิดข้อมูลเป็น int() และคำนวณผลบวก',
 1, 5, 'active',
 'รับค่าด้วย input() แปลงเป็น int ด้วย int() แล้วนำมาบวกกันด้วยเครื่องหมาย +'),

(103,
 'ตรวจสอบเลขคู่หรือเลขคี่',
 'เขียนโปรแกรมรับตัวเลขจำนวนเต็ม 1 จำนวน แล้วตรวจสอบว่าตัวเลขนั้นเป็นเลขคู่ (Even) หรือเลขคี่ (Odd)',
 'Conditionals',
 'ฝึกการใช้งานโครงสร้างควบคุม if-else และตัวดำเนินการ Modulo (%)',
 1, 8, 'active',
 'ถ้าตัวเลข modulo (%) ด้วย 2 แล้วเหลือเศษ 0 แสดงว่าเป็นเลขคู่'),

(104,
 'คำนวณพื้นที่วงกลม',
 'เขียนโปรแกรมรับค่ารัศมีของวงกลม (ทศนิยม) แล้วคำนวณหาพื้นที่ของวงกลม กำหนดให้ค่า PI = 3.14',
 'Variables & Basic Arithmetic',
 'ฝึกการทำงานกับข้อมูลชนิดทศนิยม (float) และสูตรคณิตศาสตร์',
 1, 8, 'active',
 'สูตรพื้นที่วงกลมคือ 3.14 * radius * radius'),

(105,
 'แปลงเซลเซียสเป็นฟาเรนไฮต์',
 'เขียนโปรแกรมรับอุณหภูมิในหน่วยเซลเซียส (Celsius) แล้วแปลงให้เป็นหน่วยฟาเรนไฮต์ (Fahrenheit)',
 'Variables & Basic Arithmetic',
 'ฝึกการแปลสูตรคำนวณทางคณิตศาสตร์ให้เป็นโค้ดโปรแกรม',
 1, 8, 'active',
 'สูตรการแปลงคือ (celsius * 1.8) + 32'),

(106,
 'หาค่าเฉลี่ยของเลขสามจำนวน',
 'เขียนโปรแกรมรับตัวเลข 3 จำนวน แล้วคำนวณหาค่าเฉลี่ย (Average) ของเลขทั้งหมด',
 'Variables & Basic Arithmetic',
 'ฝึกการหาผลรวมและการหารเลขใน Python',
 1, 8, 'active',
 'นำเลขทั้ง 3 ตัวมารวมกัน แล้วหารด้วย 3 (ระวังลำดับการคำนวณ ควรใส่วงเล็บให้ผลรวมก่อนหาร)'),

(107,
 'ตรวจสอบผลการเรียน (ผ่าน/ไม่ผ่าน)',
 'เขียนโปรแกรมรับคะแนนสอบของนักเรียน (0-100) หากคะแนนตั้งแต่ 50 ขึ้นไป ให้แสดงผลว่า "Pass" หากน้อยกว่านั้นให้แสดงผลว่า "Fail"',
 'Conditionals',
 'ฝึกการใช้เปรียบเทียบค่าแบบมากกว่าหรือเท่ากับ (>=) ในโครงสร้าง if-else',
 1, 5, 'active',
 'ใช้ if score >= 50: print("Pass") else: print("Fail")');


-- ── Level 2 – Intermediate (7 ข้อ) ───────────────────────────
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES
(108,
 'สูตรคูณแม่ 2',
 'เขียนโปรแกรมแสดงสูตรคูณแม่ 2 ตั้งแต่ 2 x 1 ถึง 2 x 12 ออกทางหน้าจอทีละบรรทัด',
 'Loops',
 'ฝึกการใช้งานคำสั่ง loop (for หรือ while) เพื่อทำงานซ้ำ',
 2, 10, 'active',
 'ใช้ for loop วนลูป range(1, 13) แล้วพิมพ์ 2 * i'),

(109,
 'หาค่ามากที่สุดในเลขสามตัว',
 'เขียนโปรแกรมรับตัวเลขจำนวนเต็ม 3 ตัว แล้วแสดงผลตัวเลขที่มีค่ามากที่สุด',
 'Conditionals',
 'ฝึกการซ้อนเงื่อนไข หรือใช้ฟังก์ชัน max()',
 2, 10, 'active',
 'สามารถเปรียบเทียบทีละคู่โดยใช้ logical operator (and) หรือใช้ฟังก์ชัน max(a, b, c) ใน Python'),

(110,
 'นับถอยหลัง 5 ถึง 1',
 'เขียนโปรแกรมพิมพ์ตัวเลขถอยหลังจาก 5 ถึง 1 ออกทางหน้าจอ โดยแสดงผลบรรทัดละ 1 ตัวเลข',
 'Loops',
 'เรียนรู้การกำหนดทิศทางลูปลดค่าตัวแปรลงใน loop',
 2, 8, 'active',
 'ใช้ range(5, 0, -1) ใน for loop หรือควบคุมตัวแปรใน while loop ให้ลดค่าทีละ 1'),

(111,
 'นับจำนวนตัวอักษร',
 'เขียนโปรแกรมรับข้อความ (String) จากผู้ใช้งาน แล้วคำนวณและแสดงจำนวนตัวอักษรทั้งหมดในข้อความนั้น',
 'Strings',
 'ฝึกการใช้งานฟังก์ชัน len() สำหรับหาความยาวของออบเจกต์',
 2, 8, 'active',
 'ใช้ฟังก์ชัน len(text) เพื่อหาความยาวของข้อความ'),

(112,
 'คำนวณดัชนีมวลกาย (BMI)',
 'เขียนโปรแกรมรับค่าน้ำหนัก (กิโลกรัม) และส่วนสูง (เซนติเมตร) แล้วคำนวณหาค่า BMI ตามสูตร',
 'Variables & Basic Arithmetic',
 'ฝึกการแปลงหน่วยข้อมูล (เซนติเมตรเป็นเมตร) และการคำนวณเลขยกกำลัง',
 2, 12, 'active',
 'สูตรคือ weight / (height_in_meters ** 2) อย่าลืมแปลงส่วนสูงเซนติเมตรให้เป็นเมตรโดยหารด้วย 100 ก่อน'),

(113,
 'ตรวจสอบปีอธิกสุรทิน (Leap Year)',
 'เขียนโปรแกรมรับปี ค.ศ. (จำนวนเต็ม) แล้วตรวจสอบว่าเป็นปีอธิกสุรทิน (มี 366 วัน) หรือไม่',
 'Conditionals',
 'ฝึกการใช้เงื่อนไขซับซ้อนและการตรวจสอบปีทางปฏิทิน',
 2, 12, 'active',
 'เงื่อนไขคือ: ปีนั้นต้องหารด้วย 4 ลงตัว และ (ต้องหารด้วย 100 ไม่ลงตัว หรือ ต้องหารด้วย 400 ลงตัว)'),

(114,
 'หาผลรวมของตัวเลข 1 ถึง N',
 'เขียนโปรแกรมรับตัวเลขจำนวนเต็มบวก N แล้วหาผลรวมของตัวเลขตั้งแต่ 1 ถึง N (1 + 2 + ... + N)',
 'Loops',
 'ฝึกการสะสมค่าตัวแปรใน loop',
 2, 12, 'active',
 'สร้างตัวแปรเก็บผลรวมสะสมเริ่มต้นด้วย 0 แล้ววนลูปบวกเลขตั้งแต่ 1 ถึง N เข้าไป');


-- ── Level 3 – Advanced (6 ข้อ) ────────────────────────────────
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES
(115,
 'คำนวณราคาสินค้ารวมภาษีมูลค่าเพิ่ม (VAT 7%)',
 'เขียนโปรแกรมรับราคาสินค้า (ทศนิยม) แล้วคำนวณและแสดงราคาสุทธิที่รวมภาษีมูลค่าเพิ่ม 7% แล้ว',
 'Variables & Basic Arithmetic',
 'ฝึกการคิดคำนวณอัตราส่วนร้อยละในโปรแกรม',
 3, 10, 'active',
 'ราคาสุทธิ = ราคาสินค้า * 1.07'),

(116,
 'ตรวจสอบค่าบวก ลบ หรือศูนย์',
 'เขียนโปรแกรมรับตัวเลข 1 จำนวน แล้วแสดงผลลัพธ์ว่าตัวเลขนั้นเป็น "Positive" (บวก), "Negative" (ลบ) หรือ "Zero" (ศูนย์)',
 'Conditionals',
 'ฝึกการใช้งานโครงสร้างเงื่อนไขแบบหลายทางเลือก if-elif-else',
 3, 8, 'active',
 'ใช้ if num > 0: ... elif num < 0: ... else: ...'),

(117,
 'เช็คคำอ่านย้อนหลัง (Palindrome)',
 'เขียนโปรแกรมรับคำศัพท์ 1 คำ แล้วตรวจสอบว่าคำนั้นอ่านจากหลังมาหน้าแล้วยังเหมือนเดิมหรือไม่ (เช่น "level", "radar") ถ้าใช่พิมพ์ "Yes" ถ้าไม่ใช่พิมพ์ "No"',
 'Strings',
 'ฝึกการกลับด้านข้อความ (String Slicing)',
 3, 15, 'active',
 'ใน Python สามารถสลับข้อความย้อนกลับได้ง่าย ๆ ด้วย text[::-1] จากนั้นนำมาเปรียบเทียบกับคำเดิม'),

(118,
 'แปลงวินาทีเป็นนาทีและวินาที',
 'เขียนโปรแกรมรับจำนวนวินาที (จำนวนเต็ม) แล้วแปลงเป็นจำนวนนาทีและเศษวินาทีที่เหลือ เช่น 130 วินาที แปลงได้เป็น 2 นาที 10 วินาที',
 'Variables & Basic Arithmetic',
 'ฝึกการใช้งานการหารเอาส่วน (//) และการหารเอาเศษ (%)',
 3, 15, 'active',
 'นาที = seconds // 60, วินาทีที่เหลือ = seconds % 60'),

(119,
 'ตรวจสอบตัวอักษรพิมพ์ใหญ่',
 'เขียนโปรแกรมรับตัวอักษรภาษาอังกฤษ 1 ตัว แล้วตรวจสอบว่าตัวอักษรนั้นเป็นตัวพิมพ์ใหญ่ (Uppercase) หรือไม่',
 'Conditionals',
 'ฝึกการใช้งานเมธอดของสตริง เช่น .isupper() หรือช่วงเปรียบเทียบ ASCII',
 3, 10, 'active',
 'ใช้เมธอด char.isupper() หรือเปรียบเทียบเงื่อนไข "A" <= char <= "Z"'),

(120,
 'คำนวณส่วนลดสินค้า',
 'เขียนโปรแกรมรับราคาสินค้าและเปอร์เซ็นต์ส่วนลด จากนั้นคำนวณและแสดงราคาขายสุดท้ายหลังหักส่วนลดแล้ว',
 'Variables & Basic Arithmetic',
 'ฝึกคิดเลขและจัดการตัวแปรหลายตัวเพื่อคำนวณราคาปลายทาง',
 3, 15, 'active',
 'ราคาสุดท้าย = ราคาเต็ม - (ราคาเต็ม * เปอร์เซ็นต์ส่วนลด / 100)');

SELECT SETVAL('exercise_exercise_id_seq', (SELECT MAX(exercise_id) FROM exercise));


-- ─────────────────────────────────────────────────────────────
-- INSERT: session  (3 sessions แยกตาม Level)
-- ─────────────────────────────────────────────────────────────
INSERT INTO session (session_id, session_name, session_objective, target_level, duration, status) VALUES
(1, 'บทเรียนที่ 1: พื้นฐาน Python (Basic)',    'output, ตัวแปร, เงื่อนไขเบื้องต้น',  'Basic',        60,  'active'),
(2, 'บทเรียนที่ 2: Loop และ String (Intermediate)', 'วนลูป, String และเงื่อนไขขั้นกลาง', 'Intermediate', 90,  'active'),
(3, 'บทเรียนที่ 3: โจทย์ประยุกต์ (Advanced)',   'แก้ปัญหาโจทย์ที่ซับซ้อนขึ้น',        'Advanced',     120, 'active');

SELECT SETVAL('session_session_id_seq', (SELECT MAX(session_id) FROM session));


-- ─────────────────────────────────────────────────────────────
-- INSERT: session_exercise  (เชื่อมโจทย์ทั้ง 20 ข้อเข้า session)
--   Session 1 (Basic)        ← exercise 101–107
--   Session 2 (Intermediate) ← exercise 108–114
--   Session 3 (Advanced)     ← exercise 115–120
-- ─────────────────────────────────────────────────────────────
INSERT INTO session_exercise (session_id, exercise_id) VALUES
-- Basic
(1, 101), (1, 102), (1, 103), (1, 104), (1, 105), (1, 106), (1, 107),
-- Intermediate
(2, 108), (2, 109), (2, 110), (2, 111), (2, 112), (2, 113), (2, 114),
-- Advanced
(3, 115), (3, 116), (3, 117), (3, 118), (3, 119), (3, 120);


-- ============================================================
--  END OF SCRIPT
-- ============================================================
