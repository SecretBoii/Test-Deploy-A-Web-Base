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
    image               TEXT,
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

-- ─────────────────────────────────────────────────────────────
-- INSERT: exercise  (500 ข้อ แบ่งเป็น 5 ระดับความยากตามหลัก Bloom's Taxonomy)
-- ─────────────────────────────────────────────────────────────
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (101, 'พิมพ์ข้อความทักทาย', 'เขียนโปรแกรมเพื่อแสดงคำว่า ''Welcome to Python'' ออกทางหน้าจอให้ถูกต้อง', 'Basic Output', 'เรียนรู้การใช้ฟังก์ชัน print()', 1, 5, 'active', 'ใช้คำสั่ง print(''Welcome to Python'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (102, 'กำหนดค่าตัวแปรตัวเลข ชุดที่ 2', 'สร้างตัวแปรชื่อ B แล้วกำหนดค่าเท่ากับ 100 จากนั้นพิมพ์ค่าของตัวแปรออกหน้าจอ', 'Variables', 'เข้าใจการสร้างและพิมพ์ค่าตัวแปรอินทิเจอร์', 1, 5, 'active', 'score = 100 แล้วตามด้วย print(score)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (103, 'ตรวจสอบชนิดทศนิยม ชุดที่ 3', 'กำหนดตัวแปร pi = 3.14159 จากนั้นใช้ฟังก์ชันตรวจสอบชนิดข้อมูลแล้วพิมพ์ผลลัพธ์ออกมา', 'Data Types', 'เข้าใจการใช้งานฟังก์ชัน type() กับข้อมูล float', 1, 5, 'active', 'print(type(pi))');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (104, 'สร้างข้อความแบบ Single Quote ชุดที่ 4', 'เขียนโปรแกรมแสดงข้อความ ''Python is fun'' โดยใช้เครื่องหมาย Single Quote ในการครอบสตริง', 'String Basics', 'เรียนรู้ความแตกต่างและไวยากรณ์ของโควตในข้อความ', 1, 5, 'active', 'print(''Python is fun'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (105, 'แปลงสตริงเป็นจำนวนเต็ม ชุดที่ 5', 'กำหนดสตริง num_str = ''50'' จงแปลงตัวแปรนี้ให้เป็นชนิดข้อมูล Integer และพิมพ์ออกมา', 'Type Conversion', 'ฝึกการใช้ฟังก์ชัน int() ในการแปลงประเภทข้อมูล', 1, 5, 'active', 'ใช้ int(num_str)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (106, 'พิมพ์ข้อความทักทาย ชุดที่ 6', 'เขียนโปรแกรมเพื่อแสดงคำว่า ''Welcome to Python'' ออกทางหน้าจอให้ถูกต้อง', 'Basic Output', 'เรียนรู้การใช้ฟังก์ชัน print()', 1, 5, 'active', 'ใช้คำสั่ง print(''Welcome to Python'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (107, 'กำหนดค่าตัวแปรตัวเลข ชุดที่ 7', 'สร้างตัวแปรชื่อ result แล้วกำหนดค่าเท่ากับ 100 จากนั้นพิมพ์ค่าของตัวแปรออกหน้าจอ', 'Variables', 'เข้าใจการสร้างและพิมพ์ค่าตัวแปรอินทิเจอร์', 1, 5, 'active', 'score = 100 แล้วตามด้วย print(score)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (108, 'ตรวจสอบชนิดทศนิยม ชุดที่ 8', 'กำหนดตัวแปร pi = 3.14159 จากนั้นใช้ฟังก์ชันตรวจสอบชนิดข้อมูลแล้วพิมพ์ผลลัพธ์ออกมา', 'Data Types', 'เข้าใจการใช้งานฟังก์ชัน type() กับข้อมูล float', 1, 5, 'active', 'print(type(pi))');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (109, 'สร้างข้อความแบบ Single Quote ชุดที่ 9', 'เขียนโปรแกรมแสดงข้อความ ''Python is fun'' โดยใช้เครื่องหมาย Single Quote ในการครอบสตริง', 'String Basics', 'เรียนรู้ความแตกต่างและไวยากรณ์ของโควตในข้อความ', 1, 5, 'active', 'print(''Python is fun'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (110, 'แปลงสตริงเป็นจำนวนเต็ม ชุดที่ 10', 'กำหนดสตริง num_str = ''50'' จงแปลงตัวแปรนี้ให้เป็นชนิดข้อมูล Integer และพิมพ์ออกมา', 'Type Conversion', 'ฝึกการใช้ฟังก์ชัน int() ในการแปลงประเภทข้อมูล', 1, 5, 'active', 'ใช้ int(num_str)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (111, 'พิมพ์ข้อความทักทาย ชุดที่ 11', 'เขียนโปรแกรมเพื่อแสดงคำว่า ''Welcome to Python'' ออกทางหน้าจอให้ถูกต้อง', 'Basic Output', 'เรียนรู้การใช้ฟังก์ชัน print()', 1, 5, 'active', 'ใช้คำสั่ง print(''Welcome to Python'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (112, 'กำหนดค่าตัวแปรตัวเลข ชุดที่ 12', 'สร้างตัวแปรชื่อ B แล้วกำหนดค่าเท่ากับ 100 จากนั้นพิมพ์ค่าของตัวแปรออกหน้าจอ', 'Variables', 'เข้าใจการสร้างและพิมพ์ค่าตัวแปรอินทิเจอร์', 1, 5, 'active', 'score = 100 แล้วตามด้วย print(score)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (113, 'ตรวจสอบชนิดทศนิยม ชุดที่ 13', 'กำหนดตัวแปร pi = 3.14159 จากนั้นใช้ฟังก์ชันตรวจสอบชนิดข้อมูลแล้วพิมพ์ผลลัพธ์ออกมา', 'Data Types', 'เข้าใจการใช้งานฟังก์ชัน type() กับข้อมูล float', 1, 5, 'active', 'print(type(pi))');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (114, 'สร้างข้อความแบบ Single Quote ชุดที่ 14', 'เขียนโปรแกรมแสดงข้อความ ''Python is fun'' โดยใช้เครื่องหมาย Single Quote ในการครอบสตริง', 'String Basics', 'เรียนรู้ความแตกต่างและไวยากรณ์ของโควตในข้อความ', 1, 5, 'active', 'print(''Python is fun'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (115, 'แปลงสตริงเป็นจำนวนเต็ม ชุดที่ 15', 'กำหนดสตริง num_str = ''50'' จงแปลงตัวแปรนี้ให้เป็นชนิดข้อมูล Integer และพิมพ์ออกมา', 'Type Conversion', 'ฝึกการใช้ฟังก์ชัน int() ในการแปลงประเภทข้อมูล', 1, 5, 'active', 'ใช้ int(num_str)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (116, 'พิมพ์ข้อความทักทาย ชุดที่ 16', 'เขียนโปรแกรมเพื่อแสดงคำว่า ''Welcome to Python'' ออกทางหน้าจอให้ถูกต้อง', 'Basic Output', 'เรียนรู้การใช้ฟังก์ชัน print()', 1, 5, 'active', 'ใช้คำสั่ง print(''Welcome to Python'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (117, 'กำหนดค่าตัวแปรตัวเลข ชุดที่ 17', 'สร้างตัวแปรชื่อ result แล้วกำหนดค่าเท่ากับ 100 จากนั้นพิมพ์ค่าของตัวแปรออกหน้าจอ', 'Variables', 'เข้าใจการสร้างและพิมพ์ค่าตัวแปรอินทิเจอร์', 1, 5, 'active', 'score = 100 แล้วตามด้วย print(score)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (118, 'ตรวจสอบชนิดทศนิยม ชุดที่ 18', 'กำหนดตัวแปร pi = 3.14159 จากนั้นใช้ฟังก์ชันตรวจสอบชนิดข้อมูลแล้วพิมพ์ผลลัพธ์ออกมา', 'Data Types', 'เข้าใจการใช้งานฟังก์ชัน type() กับข้อมูล float', 1, 5, 'active', 'print(type(pi))');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (119, 'สร้างข้อความแบบ Single Quote ชุดที่ 19', 'เขียนโปรแกรมแสดงข้อความ ''Python is fun'' โดยใช้เครื่องหมาย Single Quote ในการครอบสตริง', 'String Basics', 'เรียนรู้ความแตกต่างและไวยากรณ์ของโควตในข้อความ', 1, 5, 'active', 'print(''Python is fun'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (120, 'แปลงสตริงเป็นจำนวนเต็ม ชุดที่ 20', 'กำหนดสตริง num_str = ''50'' จงแปลงตัวแปรนี้ให้เป็นชนิดข้อมูล Integer และพิมพ์ออกมา', 'Type Conversion', 'ฝึกการใช้ฟังก์ชัน int() ในการแปลงประเภทข้อมูล', 1, 5, 'active', 'ใช้ int(num_str)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (121, 'พิมพ์ข้อความทักทาย ชุดที่ 21', 'เขียนโปรแกรมเพื่อแสดงคำว่า ''Welcome to Python'' ออกทางหน้าจอให้ถูกต้อง', 'Basic Output', 'เรียนรู้การใช้ฟังก์ชัน print()', 1, 5, 'active', 'ใช้คำสั่ง print(''Welcome to Python'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (122, 'กำหนดค่าตัวแปรตัวเลข ชุดที่ 22', 'สร้างตัวแปรชื่อ B แล้วกำหนดค่าเท่ากับ 100 จากนั้นพิมพ์ค่าของตัวแปรออกหน้าจอ', 'Variables', 'เข้าใจการสร้างและพิมพ์ค่าตัวแปรอินทิเจอร์', 1, 5, 'active', 'score = 100 แล้วตามด้วย print(score)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (123, 'ตรวจสอบชนิดทศนิยม ชุดที่ 23', 'กำหนดตัวแปร pi = 3.14159 จากนั้นใช้ฟังก์ชันตรวจสอบชนิดข้อมูลแล้วพิมพ์ผลลัพธ์ออกมา', 'Data Types', 'เข้าใจการใช้งานฟังก์ชัน type() กับข้อมูล float', 1, 5, 'active', 'print(type(pi))');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (124, 'สร้างข้อความแบบ Single Quote ชุดที่ 24', 'เขียนโปรแกรมแสดงข้อความ ''Python is fun'' โดยใช้เครื่องหมาย Single Quote ในการครอบสตริง', 'String Basics', 'เรียนรู้ความแตกต่างและไวยากรณ์ของโควตในข้อความ', 1, 5, 'active', 'print(''Python is fun'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (125, 'แปลงสตริงเป็นจำนวนเต็ม ชุดที่ 25', 'กำหนดสตริง num_str = ''50'' จงแปลงตัวแปรนี้ให้เป็นชนิดข้อมูล Integer และพิมพ์ออกมา', 'Type Conversion', 'ฝึกการใช้ฟังก์ชัน int() ในการแปลงประเภทข้อมูล', 1, 5, 'active', 'ใช้ int(num_str)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (126, 'พิมพ์ข้อความทักทาย ชุดที่ 26', 'เขียนโปรแกรมเพื่อแสดงคำว่า ''Welcome to Python'' ออกทางหน้าจอให้ถูกต้อง', 'Basic Output', 'เรียนรู้การใช้ฟังก์ชัน print()', 1, 5, 'active', 'ใช้คำสั่ง print(''Welcome to Python'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (127, 'กำหนดค่าตัวแปรตัวเลข ชุดที่ 27', 'สร้างตัวแปรชื่อ result แล้วกำหนดค่าเท่ากับ 100 จากนั้นพิมพ์ค่าของตัวแปรออกหน้าจอ', 'Variables', 'เข้าใจการสร้างและพิมพ์ค่าตัวแปรอินทิเจอร์', 1, 5, 'active', 'score = 100 แล้วตามด้วย print(score)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (128, 'ตรวจสอบชนิดทศนิยม ชุดที่ 28', 'กำหนดตัวแปร pi = 3.14159 จากนั้นใช้ฟังก์ชันตรวจสอบชนิดข้อมูลแล้วพิมพ์ผลลัพธ์ออกมา', 'Data Types', 'เข้าใจการใช้งานฟังก์ชัน type() กับข้อมูล float', 1, 5, 'active', 'print(type(pi))');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (129, 'สร้างข้อความแบบ Single Quote ชุดที่ 29', 'เขียนโปรแกรมแสดงข้อความ ''Python is fun'' โดยใช้เครื่องหมาย Single Quote ในการครอบสตริง', 'String Basics', 'เรียนรู้ความแตกต่างและไวยากรณ์ของโควตในข้อความ', 1, 5, 'active', 'print(''Python is fun'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (130, 'แปลงสตริงเป็นจำนวนเต็ม ชุดที่ 30', 'กำหนดสตริง num_str = ''50'' จงแปลงตัวแปรนี้ให้เป็นชนิดข้อมูล Integer และพิมพ์ออกมา', 'Type Conversion', 'ฝึกการใช้ฟังก์ชัน int() ในการแปลงประเภทข้อมูล', 1, 5, 'active', 'ใช้ int(num_str)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (131, 'พิมพ์ข้อความทักทาย ชุดที่ 31', 'เขียนโปรแกรมเพื่อแสดงคำว่า ''Welcome to Python'' ออกทางหน้าจอให้ถูกต้อง', 'Basic Output', 'เรียนรู้การใช้ฟังก์ชัน print()', 1, 5, 'active', 'ใช้คำสั่ง print(''Welcome to Python'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (132, 'กำหนดค่าตัวแปรตัวเลข ชุดที่ 32', 'สร้างตัวแปรชื่อ B แล้วกำหนดค่าเท่ากับ 100 จากนั้นพิมพ์ค่าของตัวแปรออกหน้าจอ', 'Variables', 'เข้าใจการสร้างและพิมพ์ค่าตัวแปรอินทิเจอร์', 1, 5, 'active', 'score = 100 แล้วตามด้วย print(score)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (133, 'ตรวจสอบชนิดทศนิยม ชุดที่ 33', 'กำหนดตัวแปร pi = 3.14159 จากนั้นใช้ฟังก์ชันตรวจสอบชนิดข้อมูลแล้วพิมพ์ผลลัพธ์ออกมา', 'Data Types', 'เข้าใจการใช้งานฟังก์ชัน type() กับข้อมูล float', 1, 5, 'active', 'print(type(pi))');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (134, 'สร้างข้อความแบบ Single Quote ชุดที่ 34', 'เขียนโปรแกรมแสดงข้อความ ''Python is fun'' โดยใช้เครื่องหมาย Single Quote ในการครอบสตริง', 'String Basics', 'เรียนรู้ความแตกต่างและไวยากรณ์ของโควตในข้อความ', 1, 5, 'active', 'print(''Python is fun'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (135, 'แปลงสตริงเป็นจำนวนเต็ม ชุดที่ 35', 'กำหนดสตริง num_str = ''50'' จงแปลงตัวแปรนี้ให้เป็นชนิดข้อมูล Integer และพิมพ์ออกมา', 'Type Conversion', 'ฝึกการใช้ฟังก์ชัน int() ในการแปลงประเภทข้อมูล', 1, 5, 'active', 'ใช้ int(num_str)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (136, 'พิมพ์ข้อความทักทาย ชุดที่ 36', 'เขียนโปรแกรมเพื่อแสดงคำว่า ''Welcome to Python'' ออกทางหน้าจอให้ถูกต้อง', 'Basic Output', 'เรียนรู้การใช้ฟังก์ชัน print()', 1, 5, 'active', 'ใช้คำสั่ง print(''Welcome to Python'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (137, 'กำหนดค่าตัวแปรตัวเลข ชุดที่ 37', 'สร้างตัวแปรชื่อ result แล้วกำหนดค่าเท่ากับ 100 จากนั้นพิมพ์ค่าของตัวแปรออกหน้าจอ', 'Variables', 'เข้าใจการสร้างและพิมพ์ค่าตัวแปรอินทิเจอร์', 1, 5, 'active', 'score = 100 แล้วตามด้วย print(score)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (138, 'ตรวจสอบชนิดทศนิยม ชุดที่ 38', 'กำหนดตัวแปร pi = 3.14159 จากนั้นใช้ฟังก์ชันตรวจสอบชนิดข้อมูลแล้วพิมพ์ผลลัพธ์ออกมา', 'Data Types', 'เข้าใจการใช้งานฟังก์ชัน type() กับข้อมูล float', 1, 5, 'active', 'print(type(pi))');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (139, 'สร้างข้อความแบบ Single Quote ชุดที่ 39', 'เขียนโปรแกรมแสดงข้อความ ''Python is fun'' โดยใช้เครื่องหมาย Single Quote ในการครอบสตริง', 'String Basics', 'เรียนรู้ความแตกต่างและไวยากรณ์ของโควตในข้อความ', 1, 5, 'active', 'print(''Python is fun'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (140, 'แปลงสตริงเป็นจำนวนเต็ม ชุดที่ 40', 'กำหนดสตริง num_str = ''50'' จงแปลงตัวแปรนี้ให้เป็นชนิดข้อมูล Integer และพิมพ์ออกมา', 'Type Conversion', 'ฝึกการใช้ฟังก์ชัน int() ในการแปลงประเภทข้อมูล', 1, 5, 'active', 'ใช้ int(num_str)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (141, 'พิมพ์ข้อความทักทาย ชุดที่ 41', 'เขียนโปรแกรมเพื่อแสดงคำว่า ''Welcome to Python'' ออกทางหน้าจอให้ถูกต้อง', 'Basic Output', 'เรียนรู้การใช้ฟังก์ชัน print()', 1, 5, 'active', 'ใช้คำสั่ง print(''Welcome to Python'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (142, 'กำหนดค่าตัวแปรตัวเลข ชุดที่ 42', 'สร้างตัวแปรชื่อ B แล้วกำหนดค่าเท่ากับ 100 จากนั้นพิมพ์ค่าของตัวแปรออกหน้าจอ', 'Variables', 'เข้าใจการสร้างและพิมพ์ค่าตัวแปรอินทิเจอร์', 1, 5, 'active', 'score = 100 แล้วตามด้วย print(score)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (143, 'ตรวจสอบชนิดทศนิยม ชุดที่ 43', 'กำหนดตัวแปร pi = 3.14159 จากนั้นใช้ฟังก์ชันตรวจสอบชนิดข้อมูลแล้วพิมพ์ผลลัพธ์ออกมา', 'Data Types', 'เข้าใจการใช้งานฟังก์ชัน type() กับข้อมูล float', 1, 5, 'active', 'print(type(pi))');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (144, 'สร้างข้อความแบบ Single Quote ชุดที่ 44', 'เขียนโปรแกรมแสดงข้อความ ''Python is fun'' โดยใช้เครื่องหมาย Single Quote ในการครอบสตริง', 'String Basics', 'เรียนรู้ความแตกต่างและไวยากรณ์ของโควตในข้อความ', 1, 5, 'active', 'print(''Python is fun'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (145, 'แปลงสตริงเป็นจำนวนเต็ม ชุดที่ 45', 'กำหนดสตริง num_str = ''50'' จงแปลงตัวแปรนี้ให้เป็นชนิดข้อมูล Integer และพิมพ์ออกมา', 'Type Conversion', 'ฝึกการใช้ฟังก์ชัน int() ในการแปลงประเภทข้อมูล', 1, 5, 'active', 'ใช้ int(num_str)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (146, 'พิมพ์ข้อความทักทาย ชุดที่ 46', 'เขียนโปรแกรมเพื่อแสดงคำว่า ''Welcome to Python'' ออกทางหน้าจอให้ถูกต้อง', 'Basic Output', 'เรียนรู้การใช้ฟังก์ชัน print()', 1, 5, 'active', 'ใช้คำสั่ง print(''Welcome to Python'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (147, 'กำหนดค่าตัวแปรตัวเลข ชุดที่ 47', 'สร้างตัวแปรชื่อ result แล้วกำหนดค่าเท่ากับ 100 จากนั้นพิมพ์ค่าของตัวแปรออกหน้าจอ', 'Variables', 'เข้าใจการสร้างและพิมพ์ค่าตัวแปรอินทิเจอร์', 1, 5, 'active', 'score = 100 แล้วตามด้วย print(score)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (148, 'ตรวจสอบชนิดทศนิยม ชุดที่ 48', 'กำหนดตัวแปร pi = 3.14159 จากนั้นใช้ฟังก์ชันตรวจสอบชนิดข้อมูลแล้วพิมพ์ผลลัพธ์ออกมา', 'Data Types', 'เข้าใจการใช้งานฟังก์ชัน type() กับข้อมูล float', 1, 5, 'active', 'print(type(pi))');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (149, 'สร้างข้อความแบบ Single Quote ชุดที่ 49', 'เขียนโปรแกรมแสดงข้อความ ''Python is fun'' โดยใช้เครื่องหมาย Single Quote ในการครอบสตริง', 'String Basics', 'เรียนรู้ความแตกต่างและไวยากรณ์ของโควตในข้อความ', 1, 5, 'active', 'print(''Python is fun'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (150, 'แปลงสตริงเป็นจำนวนเต็ม ชุดที่ 50', 'กำหนดสตริง num_str = ''50'' จงแปลงตัวแปรนี้ให้เป็นชนิดข้อมูล Integer และพิมพ์ออกมา', 'Type Conversion', 'ฝึกการใช้ฟังก์ชัน int() ในการแปลงประเภทข้อมูล', 1, 5, 'active', 'ใช้ int(num_str)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (151, 'พิมพ์ข้อความทักทาย ชุดที่ 51', 'เขียนโปรแกรมเพื่อแสดงคำว่า ''Welcome to Python'' ออกทางหน้าจอให้ถูกต้อง', 'Basic Output', 'เรียนรู้การใช้ฟังก์ชัน print()', 1, 5, 'active', 'ใช้คำสั่ง print(''Welcome to Python'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (152, 'กำหนดค่าตัวแปรตัวเลข ชุดที่ 52', 'สร้างตัวแปรชื่อ B แล้วกำหนดค่าเท่ากับ 100 จากนั้นพิมพ์ค่าของตัวแปรออกหน้าจอ', 'Variables', 'เข้าใจการสร้างและพิมพ์ค่าตัวแปรอินทิเจอร์', 1, 5, 'active', 'score = 100 แล้วตามด้วย print(score)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (153, 'ตรวจสอบชนิดทศนิยม ชุดที่ 53', 'กำหนดตัวแปร pi = 3.14159 จากนั้นใช้ฟังก์ชันตรวจสอบชนิดข้อมูลแล้วพิมพ์ผลลัพธ์ออกมา', 'Data Types', 'เข้าใจการใช้งานฟังก์ชัน type() กับข้อมูล float', 1, 5, 'active', 'print(type(pi))');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (154, 'สร้างข้อความแบบ Single Quote ชุดที่ 54', 'เขียนโปรแกรมแสดงข้อความ ''Python is fun'' โดยใช้เครื่องหมาย Single Quote ในการครอบสตริง', 'String Basics', 'เรียนรู้ความแตกต่างและไวยากรณ์ของโควตในข้อความ', 1, 5, 'active', 'print(''Python is fun'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (155, 'แปลงสตริงเป็นจำนวนเต็ม ชุดที่ 55', 'กำหนดสตริง num_str = ''50'' จงแปลงตัวแปรนี้ให้เป็นชนิดข้อมูล Integer และพิมพ์ออกมา', 'Type Conversion', 'ฝึกการใช้ฟังก์ชัน int() ในการแปลงประเภทข้อมูล', 1, 5, 'active', 'ใช้ int(num_str)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (156, 'พิมพ์ข้อความทักทาย ชุดที่ 56', 'เขียนโปรแกรมเพื่อแสดงคำว่า ''Welcome to Python'' ออกทางหน้าจอให้ถูกต้อง', 'Basic Output', 'เรียนรู้การใช้ฟังก์ชัน print()', 1, 5, 'active', 'ใช้คำสั่ง print(''Welcome to Python'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (157, 'กำหนดค่าตัวแปรตัวเลข ชุดที่ 57', 'สร้างตัวแปรชื่อ result แล้วกำหนดค่าเท่ากับ 100 จากนั้นพิมพ์ค่าของตัวแปรออกหน้าจอ', 'Variables', 'เข้าใจการสร้างและพิมพ์ค่าตัวแปรอินทิเจอร์', 1, 5, 'active', 'score = 100 แล้วตามด้วย print(score)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (158, 'ตรวจสอบชนิดทศนิยม ชุดที่ 58', 'กำหนดตัวแปร pi = 3.14159 จากนั้นใช้ฟังก์ชันตรวจสอบชนิดข้อมูลแล้วพิมพ์ผลลัพธ์ออกมา', 'Data Types', 'เข้าใจการใช้งานฟังก์ชัน type() กับข้อมูล float', 1, 5, 'active', 'print(type(pi))');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (159, 'สร้างข้อความแบบ Single Quote ชุดที่ 59', 'เขียนโปรแกรมแสดงข้อความ ''Python is fun'' โดยใช้เครื่องหมาย Single Quote ในการครอบสตริง', 'String Basics', 'เรียนรู้ความแตกต่างและไวยากรณ์ของโควตในข้อความ', 1, 5, 'active', 'print(''Python is fun'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (160, 'แปลงสตริงเป็นจำนวนเต็ม ชุดที่ 60', 'กำหนดสตริง num_str = ''50'' จงแปลงตัวแปรนี้ให้เป็นชนิดข้อมูล Integer และพิมพ์ออกมา', 'Type Conversion', 'ฝึกการใช้ฟังก์ชัน int() ในการแปลงประเภทข้อมูล', 1, 5, 'active', 'ใช้ int(num_str)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (161, 'พิมพ์ข้อความทักทาย ชุดที่ 61', 'เขียนโปรแกรมเพื่อแสดงคำว่า ''Welcome to Python'' ออกทางหน้าจอให้ถูกต้อง', 'Basic Output', 'เรียนรู้การใช้ฟังก์ชัน print()', 1, 5, 'active', 'ใช้คำสั่ง print(''Welcome to Python'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (162, 'กำหนดค่าตัวแปรตัวเลข ชุดที่ 62', 'สร้างตัวแปรชื่อ B แล้วกำหนดค่าเท่ากับ 100 จากนั้นพิมพ์ค่าของตัวแปรออกหน้าจอ', 'Variables', 'เข้าใจการสร้างและพิมพ์ค่าตัวแปรอินทิเจอร์', 1, 5, 'active', 'score = 100 แล้วตามด้วย print(score)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (163, 'ตรวจสอบชนิดทศนิยม ชุดที่ 63', 'กำหนดตัวแปร pi = 3.14159 จากนั้นใช้ฟังก์ชันตรวจสอบชนิดข้อมูลแล้วพิมพ์ผลลัพธ์ออกมา', 'Data Types', 'เข้าใจการใช้งานฟังก์ชัน type() กับข้อมูล float', 1, 5, 'active', 'print(type(pi))');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (164, 'สร้างข้อความแบบ Single Quote ชุดที่ 64', 'เขียนโปรแกรมแสดงข้อความ ''Python is fun'' โดยใช้เครื่องหมาย Single Quote ในการครอบสตริง', 'String Basics', 'เรียนรู้ความแตกต่างและไวยากรณ์ของโควตในข้อความ', 1, 5, 'active', 'print(''Python is fun'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (165, 'แปลงสตริงเป็นจำนวนเต็ม ชุดที่ 65', 'กำหนดสตริง num_str = ''50'' จงแปลงตัวแปรนี้ให้เป็นชนิดข้อมูล Integer และพิมพ์ออกมา', 'Type Conversion', 'ฝึกการใช้ฟังก์ชัน int() ในการแปลงประเภทข้อมูล', 1, 5, 'active', 'ใช้ int(num_str)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (166, 'พิมพ์ข้อความทักทาย ชุดที่ 66', 'เขียนโปรแกรมเพื่อแสดงคำว่า ''Welcome to Python'' ออกทางหน้าจอให้ถูกต้อง', 'Basic Output', 'เรียนรู้การใช้ฟังก์ชัน print()', 1, 5, 'active', 'ใช้คำสั่ง print(''Welcome to Python'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (167, 'กำหนดค่าตัวแปรตัวเลข ชุดที่ 67', 'สร้างตัวแปรชื่อ result แล้วกำหนดค่าเท่ากับ 100 จากนั้นพิมพ์ค่าของตัวแปรออกหน้าจอ', 'Variables', 'เข้าใจการสร้างและพิมพ์ค่าตัวแปรอินทิเจอร์', 1, 5, 'active', 'score = 100 แล้วตามด้วย print(score)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (168, 'ตรวจสอบชนิดทศนิยม ชุดที่ 68', 'กำหนดตัวแปร pi = 3.14159 จากนั้นใช้ฟังก์ชันตรวจสอบชนิดข้อมูลแล้วพิมพ์ผลลัพธ์ออกมา', 'Data Types', 'เข้าใจการใช้งานฟังก์ชัน type() กับข้อมูล float', 1, 5, 'active', 'print(type(pi))');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (169, 'สร้างข้อความแบบ Single Quote ชุดที่ 69', 'เขียนโปรแกรมแสดงข้อความ ''Python is fun'' โดยใช้เครื่องหมาย Single Quote ในการครอบสตริง', 'String Basics', 'เรียนรู้ความแตกต่างและไวยากรณ์ของโควตในข้อความ', 1, 5, 'active', 'print(''Python is fun'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (170, 'แปลงสตริงเป็นจำนวนเต็ม ชุดที่ 70', 'กำหนดสตริง num_str = ''50'' จงแปลงตัวแปรนี้ให้เป็นชนิดข้อมูล Integer และพิมพ์ออกมา', 'Type Conversion', 'ฝึกการใช้ฟังก์ชัน int() ในการแปลงประเภทข้อมูล', 1, 5, 'active', 'ใช้ int(num_str)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (171, 'พิมพ์ข้อความทักทาย ชุดที่ 71', 'เขียนโปรแกรมเพื่อแสดงคำว่า ''Welcome to Python'' ออกทางหน้าจอให้ถูกต้อง', 'Basic Output', 'เรียนรู้การใช้ฟังก์ชัน print()', 1, 5, 'active', 'ใช้คำสั่ง print(''Welcome to Python'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (172, 'กำหนดค่าตัวแปรตัวเลข ชุดที่ 72', 'สร้างตัวแปรชื่อ B แล้วกำหนดค่าเท่ากับ 100 จากนั้นพิมพ์ค่าของตัวแปรออกหน้าจอ', 'Variables', 'เข้าใจการสร้างและพิมพ์ค่าตัวแปรอินทิเจอร์', 1, 5, 'active', 'score = 100 แล้วตามด้วย print(score)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (173, 'ตรวจสอบชนิดทศนิยม ชุดที่ 73', 'กำหนดตัวแปร pi = 3.14159 จากนั้นใช้ฟังก์ชันตรวจสอบชนิดข้อมูลแล้วพิมพ์ผลลัพธ์ออกมา', 'Data Types', 'เข้าใจการใช้งานฟังก์ชัน type() กับข้อมูล float', 1, 5, 'active', 'print(type(pi))');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (174, 'สร้างข้อความแบบ Single Quote ชุดที่ 74', 'เขียนโปรแกรมแสดงข้อความ ''Python is fun'' โดยใช้เครื่องหมาย Single Quote ในการครอบสตริง', 'String Basics', 'เรียนรู้ความแตกต่างและไวยากรณ์ของโควตในข้อความ', 1, 5, 'active', 'print(''Python is fun'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (175, 'แปลงสตริงเป็นจำนวนเต็ม ชุดที่ 75', 'กำหนดสตริง num_str = ''50'' จงแปลงตัวแปรนี้ให้เป็นชนิดข้อมูล Integer และพิมพ์ออกมา', 'Type Conversion', 'ฝึกการใช้ฟังก์ชัน int() ในการแปลงประเภทข้อมูล', 1, 5, 'active', 'ใช้ int(num_str)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (176, 'พิมพ์ข้อความทักทาย ชุดที่ 76', 'เขียนโปรแกรมเพื่อแสดงคำว่า ''Welcome to Python'' ออกทางหน้าจอให้ถูกต้อง', 'Basic Output', 'เรียนรู้การใช้ฟังก์ชัน print()', 1, 5, 'active', 'ใช้คำสั่ง print(''Welcome to Python'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (177, 'กำหนดค่าตัวแปรตัวเลข ชุดที่ 77', 'สร้างตัวแปรชื่อ result แล้วกำหนดค่าเท่ากับ 100 จากนั้นพิมพ์ค่าของตัวแปรออกหน้าจอ', 'Variables', 'เข้าใจการสร้างและพิมพ์ค่าตัวแปรอินทิเจอร์', 1, 5, 'active', 'score = 100 แล้วตามด้วย print(score)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (178, 'ตรวจสอบชนิดทศนิยม ชุดที่ 78', 'กำหนดตัวแปร pi = 3.14159 จากนั้นใช้ฟังก์ชันตรวจสอบชนิดข้อมูลแล้วพิมพ์ผลลัพธ์ออกมา', 'Data Types', 'เข้าใจการใช้งานฟังก์ชัน type() กับข้อมูล float', 1, 5, 'active', 'print(type(pi))');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (179, 'สร้างข้อความแบบ Single Quote ชุดที่ 79', 'เขียนโปรแกรมแสดงข้อความ ''Python is fun'' โดยใช้เครื่องหมาย Single Quote ในการครอบสตริง', 'String Basics', 'เรียนรู้ความแตกต่างและไวยากรณ์ของโควตในข้อความ', 1, 5, 'active', 'print(''Python is fun'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (180, 'แปลงสตริงเป็นจำนวนเต็ม ชุดที่ 80', 'กำหนดสตริง num_str = ''50'' จงแปลงตัวแปรนี้ให้เป็นชนิดข้อมูล Integer และพิมพ์ออกมา', 'Type Conversion', 'ฝึกการใช้ฟังก์ชัน int() ในการแปลงประเภทข้อมูล', 1, 5, 'active', 'ใช้ int(num_str)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (181, 'พิมพ์ข้อความทักทาย ชุดที่ 81', 'เขียนโปรแกรมเพื่อแสดงคำว่า ''Welcome to Python'' ออกทางหน้าจอให้ถูกต้อง', 'Basic Output', 'เรียนรู้การใช้ฟังก์ชัน print()', 1, 5, 'active', 'ใช้คำสั่ง print(''Welcome to Python'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (182, 'กำหนดค่าตัวแปรตัวเลข ชุดที่ 82', 'สร้างตัวแปรชื่อ B แล้วกำหนดค่าเท่ากับ 100 จากนั้นพิมพ์ค่าของตัวแปรออกหน้าจอ', 'Variables', 'เข้าใจการสร้างและพิมพ์ค่าตัวแปรอินทิเจอร์', 1, 5, 'active', 'score = 100 แล้วตามด้วย print(score)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (183, 'ตรวจสอบชนิดทศนิยม ชุดที่ 83', 'กำหนดตัวแปร pi = 3.14159 จากนั้นใช้ฟังก์ชันตรวจสอบชนิดข้อมูลแล้วพิมพ์ผลลัพธ์ออกมา', 'Data Types', 'เข้าใจการใช้งานฟังก์ชัน type() กับข้อมูล float', 1, 5, 'active', 'print(type(pi))');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (184, 'สร้างข้อความแบบ Single Quote ชุดที่ 84', 'เขียนโปรแกรมแสดงข้อความ ''Python is fun'' โดยใช้เครื่องหมาย Single Quote ในการครอบสตริง', 'String Basics', 'เรียนรู้ความแตกต่างและไวยากรณ์ของโควตในข้อความ', 1, 5, 'active', 'print(''Python is fun'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (185, 'แปลงสตริงเป็นจำนวนเต็ม ชุดที่ 85', 'กำหนดสตริง num_str = ''50'' จงแปลงตัวแปรนี้ให้เป็นชนิดข้อมูล Integer และพิมพ์ออกมา', 'Type Conversion', 'ฝึกการใช้ฟังก์ชัน int() ในการแปลงประเภทข้อมูล', 1, 5, 'active', 'ใช้ int(num_str)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (186, 'พิมพ์ข้อความทักทาย ชุดที่ 86', 'เขียนโปรแกรมเพื่อแสดงคำว่า ''Welcome to Python'' ออกทางหน้าจอให้ถูกต้อง', 'Basic Output', 'เรียนรู้การใช้ฟังก์ชัน print()', 1, 5, 'active', 'ใช้คำสั่ง print(''Welcome to Python'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (187, 'กำหนดค่าตัวแปรตัวเลข ชุดที่ 87', 'สร้างตัวแปรชื่อ result แล้วกำหนดค่าเท่ากับ 100 จากนั้นพิมพ์ค่าของตัวแปรออกหน้าจอ', 'Variables', 'เข้าใจการสร้างและพิมพ์ค่าตัวแปรอินทิเจอร์', 1, 5, 'active', 'score = 100 แล้วตามด้วย print(score)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (188, 'ตรวจสอบชนิดทศนิยม ชุดที่ 88', 'กำหนดตัวแปร pi = 3.14159 จากนั้นใช้ฟังก์ชันตรวจสอบชนิดข้อมูลแล้วพิมพ์ผลลัพธ์ออกมา', 'Data Types', 'เข้าใจการใช้งานฟังก์ชัน type() กับข้อมูล float', 1, 5, 'active', 'print(type(pi))');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (189, 'สร้างข้อความแบบ Single Quote ชุดที่ 89', 'เขียนโปรแกรมแสดงข้อความ ''Python is fun'' โดยใช้เครื่องหมาย Single Quote ในการครอบสตริง', 'String Basics', 'เรียนรู้ความแตกต่างและไวยากรณ์ของโควตในข้อความ', 1, 5, 'active', 'print(''Python is fun'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (190, 'แปลงสตริงเป็นจำนวนเต็ม ชุดที่ 90', 'กำหนดสตริง num_str = ''50'' จงแปลงตัวแปรนี้ให้เป็นชนิดข้อมูล Integer และพิมพ์ออกมา', 'Type Conversion', 'ฝึกการใช้ฟังก์ชัน int() ในการแปลงประเภทข้อมูล', 1, 5, 'active', 'ใช้ int(num_str)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (191, 'พิมพ์ข้อความทักทาย ชุดที่ 91', 'เขียนโปรแกรมเพื่อแสดงคำว่า ''Welcome to Python'' ออกทางหน้าจอให้ถูกต้อง', 'Basic Output', 'เรียนรู้การใช้ฟังก์ชัน print()', 1, 5, 'active', 'ใช้คำสั่ง print(''Welcome to Python'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (192, 'กำหนดค่าตัวแปรตัวเลข ชุดที่ 92', 'สร้างตัวแปรชื่อ B แล้วกำหนดค่าเท่ากับ 100 จากนั้นพิมพ์ค่าของตัวแปรออกหน้าจอ', 'Variables', 'เข้าใจการสร้างและพิมพ์ค่าตัวแปรอินทิเจอร์', 1, 5, 'active', 'score = 100 แล้วตามด้วย print(score)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (193, 'ตรวจสอบชนิดทศนิยม ชุดที่ 93', 'กำหนดตัวแปร pi = 3.14159 จากนั้นใช้ฟังก์ชันตรวจสอบชนิดข้อมูลแล้วพิมพ์ผลลัพธ์ออกมา', 'Data Types', 'เข้าใจการใช้งานฟังก์ชัน type() กับข้อมูล float', 1, 5, 'active', 'print(type(pi))');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (194, 'สร้างข้อความแบบ Single Quote ชุดที่ 94', 'เขียนโปรแกรมแสดงข้อความ ''Python is fun'' โดยใช้เครื่องหมาย Single Quote ในการครอบสตริง', 'String Basics', 'เรียนรู้ความแตกต่างและไวยากรณ์ของโควตในข้อความ', 1, 5, 'active', 'print(''Python is fun'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (195, 'แปลงสตริงเป็นจำนวนเต็ม ชุดที่ 95', 'กำหนดสตริง num_str = ''50'' จงแปลงตัวแปรนี้ให้เป็นชนิดข้อมูล Integer และพิมพ์ออกมา', 'Type Conversion', 'ฝึกการใช้ฟังก์ชัน int() ในการแปลงประเภทข้อมูล', 1, 5, 'active', 'ใช้ int(num_str)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (196, 'พิมพ์ข้อความทักทาย ชุดที่ 96', 'เขียนโปรแกรมเพื่อแสดงคำว่า ''Welcome to Python'' ออกทางหน้าจอให้ถูกต้อง', 'Basic Output', 'เรียนรู้การใช้ฟังก์ชัน print()', 1, 5, 'active', 'ใช้คำสั่ง print(''Welcome to Python'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (197, 'กำหนดค่าตัวแปรตัวเลข ชุดที่ 97', 'สร้างตัวแปรชื่อ result แล้วกำหนดค่าเท่ากับ 100 จากนั้นพิมพ์ค่าของตัวแปรออกหน้าจอ', 'Variables', 'เข้าใจการสร้างและพิมพ์ค่าตัวแปรอินทิเจอร์', 1, 5, 'active', 'score = 100 แล้วตามด้วย print(score)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (198, 'ตรวจสอบชนิดทศนิยม ชุดที่ 98', 'กำหนดตัวแปร pi = 3.14159 จากนั้นใช้ฟังก์ชันตรวจสอบชนิดข้อมูลแล้วพิมพ์ผลลัพธ์ออกมา', 'Data Types', 'เข้าใจการใช้งานฟังก์ชัน type() กับข้อมูล float', 1, 5, 'active', 'print(type(pi))');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (199, 'สร้างข้อความแบบ Single Quote ชุดที่ 99', 'เขียนโปรแกรมแสดงข้อความ ''Python is fun'' โดยใช้เครื่องหมาย Single Quote ในการครอบสตริง', 'String Basics', 'เรียนรู้ความแตกต่างและไวยากรณ์ของโควตในข้อความ', 1, 5, 'active', 'print(''Python is fun'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (200, 'แปลงสตริงเป็นจำนวนเต็ม ชุดที่ 100', 'กำหนดสตริง num_str = ''50'' จงแปลงตัวแปรนี้ให้เป็นชนิดข้อมูล Integer และพิมพ์ออกมา', 'Type Conversion', 'ฝึกการใช้ฟังก์ชัน int() ในการแปลงประเภทข้อมูล', 1, 5, 'active', 'ใช้ int(num_str)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (201, 'หาพื้นที่สามเหลี่ยม', 'เขียนโปรแกรมคำนวณพื้นที่สามเหลี่ยม โดยกำหนดฐานเป็น 10 และความสูงเป็น 5 (สูตร: 0.5 * ฐาน * สูง)', 'Arithmetic', 'ประยุกต์ใช้ตัวดำเนินการคูณทางคณิตศาสตร์', 2, 8, 'active', 'คำนวณด้วย 0.5 * 10 * 5');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (202, 'ตรวจสอบคะแนนสอบ ชุดที่ 2', 'รับค่าคะแนนดิบจากผู้ใช้งานผ่านคีย์บอร์ด หากคะแนนมากกว่าหรือเท่ากับ 60 ให้แสดงผลว่า ''Passed''', 'Conditionals', 'ประยุกต์ใช้โครงสร้างเงื่อนไข if แบบบรรทัดเดียวหรือบล็อกอย่างง่าย', 2, 8, 'active', 'if score >= 60: print(''Passed'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (203, 'วนลูปพิมพ์เลขศูนย์ถึงเก้า ชุดที่ 3', 'เขียนโปรแกรมวนลูปเพื่อแสดงตัวเลขตั้งแต่ 0 ถึง 9 ออกทางหน้าจอทีละบรรทัด', 'Loops', 'ฝึกการใช้ for loop ควบคู่กับ range()', 2, 8, 'active', 'ใช้ for i in range(10):');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (204, 'หาเศษการหาร ชุดที่ 4', 'รับตัวเลขจำนวนเต็มจากผู้ใช้ 1 จำนวน แล้วนำมาหาเศษจากการหารด้วย 3 จากนั้นพิมพ์ผลลัพธ์ออกมา', 'Modulo Operator', 'ประยุกต์ใช้เครื่องหมาย Modulo (%)', 2, 8, 'active', 'ใช้ num % 3');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (205, 'ต่อข้อความชื่อนามสกุล ชุดที่ 5', 'รับอินพุตชื่อและนามสกุลแยกกันเป็น 2 ตัวแปร แล้วนำมาเชื่อมต่อกันโดยมีช่องว่างคั่นตรงกลาง', 'String Operations', 'ประยุกต์ใช้การทำ String Concatenation หรือ f-string', 2, 8, 'active', 'ใช้ f''{first_name} {last_name}''');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (206, 'หาพื้นที่สามเหลี่ยม ชุดที่ 6', 'เขียนโปรแกรมคำนวณพื้นที่สามเหลี่ยม โดยกำหนดฐานเป็น 10 และความสูงเป็น 5 (สูตร: 0.5 * ฐาน * สูง)', 'Arithmetic', 'ประยุกต์ใช้ตัวดำเนินการคูณทางคณิตศาสตร์', 2, 8, 'active', 'คำนวณด้วย 0.5 * 10 * 5');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (207, 'ตรวจสอบคะแนนสอบ ชุดที่ 7', 'รับค่าคะแนนดิบจากผู้ใช้งานผ่านคีย์บอร์ด หากคะแนนมากกว่าหรือเท่ากับ 60 ให้แสดงผลว่า ''Passed''', 'Conditionals', 'ประยุกต์ใช้โครงสร้างเงื่อนไข if แบบบรรทัดเดียวหรือบล็อกอย่างง่าย', 2, 8, 'active', 'if score >= 60: print(''Passed'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (208, 'วนลูปพิมพ์เลขศูนย์ถึงเก้า ชุดที่ 8', 'เขียนโปรแกรมวนลูปเพื่อแสดงตัวเลขตั้งแต่ 0 ถึง 9 ออกทางหน้าจอทีละบรรทัด', 'Loops', 'ฝึกการใช้ for loop ควบคู่กับ range()', 2, 8, 'active', 'ใช้ for i in range(10):');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (209, 'หาเศษการหาร ชุดที่ 9', 'รับตัวเลขจำนวนเต็มจากผู้ใช้ 1 จำนวน แล้วนำมาหาเศษจากการหารด้วย 3 จากนั้นพิมพ์ผลลัพธ์ออกมา', 'Modulo Operator', 'ประยุกต์ใช้เครื่องหมาย Modulo (%)', 2, 8, 'active', 'ใช้ num % 3');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (210, 'ต่อข้อความชื่อนามสกุล ชุดที่ 10', 'รับอินพุตชื่อและนามสกุลแยกกันเป็น 2 ตัวแปร แล้วนำมาเชื่อมต่อกันโดยมีช่องว่างคั่นตรงกลาง', 'String Operations', 'ประยุกต์ใช้การทำ String Concatenation หรือ f-string', 2, 8, 'active', 'ใช้ f''{first_name} {last_name}''');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (211, 'หาพื้นที่สามเหลี่ยม ชุดที่ 11', 'เขียนโปรแกรมคำนวณพื้นที่สามเหลี่ยม โดยกำหนดฐานเป็น 10 และความสูงเป็น 5 (สูตร: 0.5 * ฐาน * สูง)', 'Arithmetic', 'ประยุกต์ใช้ตัวดำเนินการคูณทางคณิตศาสตร์', 2, 8, 'active', 'คำนวณด้วย 0.5 * 10 * 5');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (212, 'ตรวจสอบคะแนนสอบ ชุดที่ 12', 'รับค่าคะแนนดิบจากผู้ใช้งานผ่านคีย์บอร์ด หากคะแนนมากกว่าหรือเท่ากับ 60 ให้แสดงผลว่า ''Passed''', 'Conditionals', 'ประยุกต์ใช้โครงสร้างเงื่อนไข if แบบบรรทัดเดียวหรือบล็อกอย่างง่าย', 2, 8, 'active', 'if score >= 60: print(''Passed'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (213, 'วนลูปพิมพ์เลขศูนย์ถึงเก้า ชุดที่ 13', 'เขียนโปรแกรมวนลูปเพื่อแสดงตัวเลขตั้งแต่ 0 ถึง 9 ออกทางหน้าจอทีละบรรทัด', 'Loops', 'ฝึกการใช้ for loop ควบคู่กับ range()', 2, 8, 'active', 'ใช้ for i in range(10):');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (214, 'หาเศษการหาร ชุดที่ 14', 'รับตัวเลขจำนวนเต็มจากผู้ใช้ 1 จำนวน แล้วนำมาหาเศษจากการหารด้วย 3 จากนั้นพิมพ์ผลลัพธ์ออกมา', 'Modulo Operator', 'ประยุกต์ใช้เครื่องหมาย Modulo (%)', 2, 8, 'active', 'ใช้ num % 3');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (215, 'ต่อข้อความชื่อนามสกุล ชุดที่ 15', 'รับอินพุตชื่อและนามสกุลแยกกันเป็น 2 ตัวแปร แล้วนำมาเชื่อมต่อกันโดยมีช่องว่างคั่นตรงกลาง', 'String Operations', 'ประยุกต์ใช้การทำ String Concatenation หรือ f-string', 2, 8, 'active', 'ใช้ f''{first_name} {last_name}''');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (216, 'หาพื้นที่สามเหลี่ยม ชุดที่ 16', 'เขียนโปรแกรมคำนวณพื้นที่สามเหลี่ยม โดยกำหนดฐานเป็น 10 และความสูงเป็น 5 (สูตร: 0.5 * ฐาน * สูง)', 'Arithmetic', 'ประยุกต์ใช้ตัวดำเนินการคูณทางคณิตศาสตร์', 2, 8, 'active', 'คำนวณด้วย 0.5 * 10 * 5');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (217, 'ตรวจสอบคะแนนสอบ ชุดที่ 17', 'รับค่าคะแนนดิบจากผู้ใช้งานผ่านคีย์บอร์ด หากคะแนนมากกว่าหรือเท่ากับ 60 ให้แสดงผลว่า ''Passed''', 'Conditionals', 'ประยุกต์ใช้โครงสร้างเงื่อนไข if แบบบรรทัดเดียวหรือบล็อกอย่างง่าย', 2, 8, 'active', 'if score >= 60: print(''Passed'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (218, 'วนลูปพิมพ์เลขศูนย์ถึงเก้า ชุดที่ 18', 'เขียนโปรแกรมวนลูปเพื่อแสดงตัวเลขตั้งแต่ 0 ถึง 9 ออกทางหน้าจอทีละบรรทัด', 'Loops', 'ฝึกการใช้ for loop ควบคู่กับ range()', 2, 8, 'active', 'ใช้ for i in range(10):');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (219, 'หาเศษการหาร ชุดที่ 19', 'รับตัวเลขจำนวนเต็มจากผู้ใช้ 1 จำนวน แล้วนำมาหาเศษจากการหารด้วย 3 จากนั้นพิมพ์ผลลัพธ์ออกมา', 'Modulo Operator', 'ประยุกต์ใช้เครื่องหมาย Modulo (%)', 2, 8, 'active', 'ใช้ num % 3');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (220, 'ต่อข้อความชื่อนามสกุล ชุดที่ 20', 'รับอินพุตชื่อและนามสกุลแยกกันเป็น 2 ตัวแปร แล้วนำมาเชื่อมต่อกันโดยมีช่องว่างคั่นตรงกลาง', 'String Operations', 'ประยุกต์ใช้การทำ String Concatenation หรือ f-string', 2, 8, 'active', 'ใช้ f''{first_name} {last_name}''');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (221, 'หาพื้นที่สามเหลี่ยม ชุดที่ 21', 'เขียนโปรแกรมคำนวณพื้นที่สามเหลี่ยม โดยกำหนดฐานเป็น 10 และความสูงเป็น 5 (สูตร: 0.5 * ฐาน * สูง)', 'Arithmetic', 'ประยุกต์ใช้ตัวดำเนินการคูณทางคณิตศาสตร์', 2, 8, 'active', 'คำนวณด้วย 0.5 * 10 * 5');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (222, 'ตรวจสอบคะแนนสอบ ชุดที่ 22', 'รับค่าคะแนนดิบจากผู้ใช้งานผ่านคีย์บอร์ด หากคะแนนมากกว่าหรือเท่ากับ 60 ให้แสดงผลว่า ''Passed''', 'Conditionals', 'ประยุกต์ใช้โครงสร้างเงื่อนไข if แบบบรรทัดเดียวหรือบล็อกอย่างง่าย', 2, 8, 'active', 'if score >= 60: print(''Passed'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (223, 'วนลูปพิมพ์เลขศูนย์ถึงเก้า ชุดที่ 23', 'เขียนโปรแกรมวนลูปเพื่อแสดงตัวเลขตั้งแต่ 0 ถึง 9 ออกทางหน้าจอทีละบรรทัด', 'Loops', 'ฝึกการใช้ for loop ควบคู่กับ range()', 2, 8, 'active', 'ใช้ for i in range(10):');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (224, 'หาเศษการหาร ชุดที่ 24', 'รับตัวเลขจำนวนเต็มจากผู้ใช้ 1 จำนวน แล้วนำมาหาเศษจากการหารด้วย 3 จากนั้นพิมพ์ผลลัพธ์ออกมา', 'Modulo Operator', 'ประยุกต์ใช้เครื่องหมาย Modulo (%)', 2, 8, 'active', 'ใช้ num % 3');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (225, 'ต่อข้อความชื่อนามสกุล ชุดที่ 25', 'รับอินพุตชื่อและนามสกุลแยกกันเป็น 2 ตัวแปร แล้วนำมาเชื่อมต่อกันโดยมีช่องว่างคั่นตรงกลาง', 'String Operations', 'ประยุกต์ใช้การทำ String Concatenation หรือ f-string', 2, 8, 'active', 'ใช้ f''{first_name} {last_name}''');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (226, 'หาพื้นที่สามเหลี่ยม ชุดที่ 26', 'เขียนโปรแกรมคำนวณพื้นที่สามเหลี่ยม โดยกำหนดฐานเป็น 10 และความสูงเป็น 5 (สูตร: 0.5 * ฐาน * สูง)', 'Arithmetic', 'ประยุกต์ใช้ตัวดำเนินการคูณทางคณิตศาสตร์', 2, 8, 'active', 'คำนวณด้วย 0.5 * 10 * 5');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (227, 'ตรวจสอบคะแนนสอบ ชุดที่ 27', 'รับค่าคะแนนดิบจากผู้ใช้งานผ่านคีย์บอร์ด หากคะแนนมากกว่าหรือเท่ากับ 60 ให้แสดงผลว่า ''Passed''', 'Conditionals', 'ประยุกต์ใช้โครงสร้างเงื่อนไข if แบบบรรทัดเดียวหรือบล็อกอย่างง่าย', 2, 8, 'active', 'if score >= 60: print(''Passed'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (228, 'วนลูปพิมพ์เลขศูนย์ถึงเก้า ชุดที่ 28', 'เขียนโปรแกรมวนลูปเพื่อแสดงตัวเลขตั้งแต่ 0 ถึง 9 ออกทางหน้าจอทีละบรรทัด', 'Loops', 'ฝึกการใช้ for loop ควบคู่กับ range()', 2, 8, 'active', 'ใช้ for i in range(10):');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (229, 'หาเศษการหาร ชุดที่ 29', 'รับตัวเลขจำนวนเต็มจากผู้ใช้ 1 จำนวน แล้วนำมาหาเศษจากการหารด้วย 3 จากนั้นพิมพ์ผลลัพธ์ออกมา', 'Modulo Operator', 'ประยุกต์ใช้เครื่องหมาย Modulo (%)', 2, 8, 'active', 'ใช้ num % 3');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (230, 'ต่อข้อความชื่อนามสกุล ชุดที่ 30', 'รับอินพุตชื่อและนามสกุลแยกกันเป็น 2 ตัวแปร แล้วนำมาเชื่อมต่อกันโดยมีช่องว่างคั่นตรงกลาง', 'String Operations', 'ประยุกต์ใช้การทำ String Concatenation หรือ f-string', 2, 8, 'active', 'ใช้ f''{first_name} {last_name}''');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (231, 'หาพื้นที่สามเหลี่ยม ชุดที่ 31', 'เขียนโปรแกรมคำนวณพื้นที่สามเหลี่ยม โดยกำหนดฐานเป็น 10 และความสูงเป็น 5 (สูตร: 0.5 * ฐาน * สูง)', 'Arithmetic', 'ประยุกต์ใช้ตัวดำเนินการคูณทางคณิตศาสตร์', 2, 8, 'active', 'คำนวณด้วย 0.5 * 10 * 5');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (232, 'ตรวจสอบคะแนนสอบ ชุดที่ 32', 'รับค่าคะแนนดิบจากผู้ใช้งานผ่านคีย์บอร์ด หากคะแนนมากกว่าหรือเท่ากับ 60 ให้แสดงผลว่า ''Passed''', 'Conditionals', 'ประยุกต์ใช้โครงสร้างเงื่อนไข if แบบบรรทัดเดียวหรือบล็อกอย่างง่าย', 2, 8, 'active', 'if score >= 60: print(''Passed'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (233, 'วนลูปพิมพ์เลขศูนย์ถึงเก้า ชุดที่ 33', 'เขียนโปรแกรมวนลูปเพื่อแสดงตัวเลขตั้งแต่ 0 ถึง 9 ออกทางหน้าจอทีละบรรทัด', 'Loops', 'ฝึกการใช้ for loop ควบคู่กับ range()', 2, 8, 'active', 'ใช้ for i in range(10):');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (234, 'หาเศษการหาร ชุดที่ 34', 'รับตัวเลขจำนวนเต็มจากผู้ใช้ 1 จำนวน แล้วนำมาหาเศษจากการหารด้วย 3 จากนั้นพิมพ์ผลลัพธ์ออกมา', 'Modulo Operator', 'ประยุกต์ใช้เครื่องหมาย Modulo (%)', 2, 8, 'active', 'ใช้ num % 3');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (235, 'ต่อข้อความชื่อนามสกุล ชุดที่ 35', 'รับอินพุตชื่อและนามสกุลแยกกันเป็น 2 ตัวแปร แล้วนำมาเชื่อมต่อกันโดยมีช่องว่างคั่นตรงกลาง', 'String Operations', 'ประยุกต์ใช้การทำ String Concatenation หรือ f-string', 2, 8, 'active', 'ใช้ f''{first_name} {last_name}''');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (236, 'หาพื้นที่สามเหลี่ยม ชุดที่ 36', 'เขียนโปรแกรมคำนวณพื้นที่สามเหลี่ยม โดยกำหนดฐานเป็น 10 และความสูงเป็น 5 (สูตร: 0.5 * ฐาน * สูง)', 'Arithmetic', 'ประยุกต์ใช้ตัวดำเนินการคูณทางคณิตศาสตร์', 2, 8, 'active', 'คำนวณด้วย 0.5 * 10 * 5');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (237, 'ตรวจสอบคะแนนสอบ ชุดที่ 37', 'รับค่าคะแนนดิบจากผู้ใช้งานผ่านคีย์บอร์ด หากคะแนนมากกว่าหรือเท่ากับ 60 ให้แสดงผลว่า ''Passed''', 'Conditionals', 'ประยุกต์ใช้โครงสร้างเงื่อนไข if แบบบรรทัดเดียวหรือบล็อกอย่างง่าย', 2, 8, 'active', 'if score >= 60: print(''Passed'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (238, 'วนลูปพิมพ์เลขศูนย์ถึงเก้า ชุดที่ 38', 'เขียนโปรแกรมวนลูปเพื่อแสดงตัวเลขตั้งแต่ 0 ถึง 9 ออกทางหน้าจอทีละบรรทัด', 'Loops', 'ฝึกการใช้ for loop ควบคู่กับ range()', 2, 8, 'active', 'ใช้ for i in range(10):');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (239, 'หาเศษการหาร ชุดที่ 39', 'รับตัวเลขจำนวนเต็มจากผู้ใช้ 1 จำนวน แล้วนำมาหาเศษจากการหารด้วย 3 จากนั้นพิมพ์ผลลัพธ์ออกมา', 'Modulo Operator', 'ประยุกต์ใช้เครื่องหมาย Modulo (%)', 2, 8, 'active', 'ใช้ num % 3');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (240, 'ต่อข้อความชื่อนามสกุล ชุดที่ 40', 'รับอินพุตชื่อและนามสกุลแยกกันเป็น 2 ตัวแปร แล้วนำมาเชื่อมต่อกันโดยมีช่องว่างคั่นตรงกลาง', 'String Operations', 'ประยุกต์ใช้การทำ String Concatenation หรือ f-string', 2, 8, 'active', 'ใช้ f''{first_name} {last_name}''');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (241, 'หาพื้นที่สามเหลี่ยม ชุดที่ 41', 'เขียนโปรแกรมคำนวณพื้นที่สามเหลี่ยม โดยกำหนดฐานเป็น 10 และความสูงเป็น 5 (สูตร: 0.5 * ฐาน * สูง)', 'Arithmetic', 'ประยุกต์ใช้ตัวดำเนินการคูณทางคณิตศาสตร์', 2, 8, 'active', 'คำนวณด้วย 0.5 * 10 * 5');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (242, 'ตรวจสอบคะแนนสอบ ชุดที่ 42', 'รับค่าคะแนนดิบจากผู้ใช้งานผ่านคีย์บอร์ด หากคะแนนมากกว่าหรือเท่ากับ 60 ให้แสดงผลว่า ''Passed''', 'Conditionals', 'ประยุกต์ใช้โครงสร้างเงื่อนไข if แบบบรรทัดเดียวหรือบล็อกอย่างง่าย', 2, 8, 'active', 'if score >= 60: print(''Passed'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (243, 'วนลูปพิมพ์เลขศูนย์ถึงเก้า ชุดที่ 43', 'เขียนโปรแกรมวนลูปเพื่อแสดงตัวเลขตั้งแต่ 0 ถึง 9 ออกทางหน้าจอทีละบรรทัด', 'Loops', 'ฝึกการใช้ for loop ควบคู่กับ range()', 2, 8, 'active', 'ใช้ for i in range(10):');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (244, 'หาเศษการหาร ชุดที่ 44', 'รับตัวเลขจำนวนเต็มจากผู้ใช้ 1 จำนวน แล้วนำมาหาเศษจากการหารด้วย 3 จากนั้นพิมพ์ผลลัพธ์ออกมา', 'Modulo Operator', 'ประยุกต์ใช้เครื่องหมาย Modulo (%)', 2, 8, 'active', 'ใช้ num % 3');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (245, 'ต่อข้อความชื่อนามสกุล ชุดที่ 45', 'รับอินพุตชื่อและนามสกุลแยกกันเป็น 2 ตัวแปร แล้วนำมาเชื่อมต่อกันโดยมีช่องว่างคั่นตรงกลาง', 'String Operations', 'ประยุกต์ใช้การทำ String Concatenation หรือ f-string', 2, 8, 'active', 'ใช้ f''{first_name} {last_name}''');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (246, 'หาพื้นที่สามเหลี่ยม ชุดที่ 46', 'เขียนโปรแกรมคำนวณพื้นที่สามเหลี่ยม โดยกำหนดฐานเป็น 10 และความสูงเป็น 5 (สูตร: 0.5 * ฐาน * สูง)', 'Arithmetic', 'ประยุกต์ใช้ตัวดำเนินการคูณทางคณิตศาสตร์', 2, 8, 'active', 'คำนวณด้วย 0.5 * 10 * 5');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (247, 'ตรวจสอบคะแนนสอบ ชุดที่ 47', 'รับค่าคะแนนดิบจากผู้ใช้งานผ่านคีย์บอร์ด หากคะแนนมากกว่าหรือเท่ากับ 60 ให้แสดงผลว่า ''Passed''', 'Conditionals', 'ประยุกต์ใช้โครงสร้างเงื่อนไข if แบบบรรทัดเดียวหรือบล็อกอย่างง่าย', 2, 8, 'active', 'if score >= 60: print(''Passed'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (248, 'วนลูปพิมพ์เลขศูนย์ถึงเก้า ชุดที่ 48', 'เขียนโปรแกรมวนลูปเพื่อแสดงตัวเลขตั้งแต่ 0 ถึง 9 ออกทางหน้าจอทีละบรรทัด', 'Loops', 'ฝึกการใช้ for loop ควบคู่กับ range()', 2, 8, 'active', 'ใช้ for i in range(10):');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (249, 'หาเศษการหาร ชุดที่ 49', 'รับตัวเลขจำนวนเต็มจากผู้ใช้ 1 จำนวน แล้วนำมาหาเศษจากการหารด้วย 3 จากนั้นพิมพ์ผลลัพธ์ออกมา', 'Modulo Operator', 'ประยุกต์ใช้เครื่องหมาย Modulo (%)', 2, 8, 'active', 'ใช้ num % 3');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (250, 'ต่อข้อความชื่อนามสกุล ชุดที่ 50', 'รับอินพุตชื่อและนามสกุลแยกกันเป็น 2 ตัวแปร แล้วนำมาเชื่อมต่อกันโดยมีช่องว่างคั่นตรงกลาง', 'String Operations', 'ประยุกต์ใช้การทำ String Concatenation หรือ f-string', 2, 8, 'active', 'ใช้ f''{first_name} {last_name}''');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (251, 'หาพื้นที่สามเหลี่ยม ชุดที่ 51', 'เขียนโปรแกรมคำนวณพื้นที่สามเหลี่ยม โดยกำหนดฐานเป็น 10 และความสูงเป็น 5 (สูตร: 0.5 * ฐาน * สูง)', 'Arithmetic', 'ประยุกต์ใช้ตัวดำเนินการคูณทางคณิตศาสตร์', 2, 8, 'active', 'คำนวณด้วย 0.5 * 10 * 5');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (252, 'ตรวจสอบคะแนนสอบ ชุดที่ 52', 'รับค่าคะแนนดิบจากผู้ใช้งานผ่านคีย์บอร์ด หากคะแนนมากกว่าหรือเท่ากับ 60 ให้แสดงผลว่า ''Passed''', 'Conditionals', 'ประยุกต์ใช้โครงสร้างเงื่อนไข if แบบบรรทัดเดียวหรือบล็อกอย่างง่าย', 2, 8, 'active', 'if score >= 60: print(''Passed'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (253, 'วนลูปพิมพ์เลขศูนย์ถึงเก้า ชุดที่ 53', 'เขียนโปรแกรมวนลูปเพื่อแสดงตัวเลขตั้งแต่ 0 ถึง 9 ออกทางหน้าจอทีละบรรทัด', 'Loops', 'ฝึกการใช้ for loop ควบคู่กับ range()', 2, 8, 'active', 'ใช้ for i in range(10):');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (254, 'หาเศษการหาร ชุดที่ 54', 'รับตัวเลขจำนวนเต็มจากผู้ใช้ 1 จำนวน แล้วนำมาหาเศษจากการหารด้วย 3 จากนั้นพิมพ์ผลลัพธ์ออกมา', 'Modulo Operator', 'ประยุกต์ใช้เครื่องหมาย Modulo (%)', 2, 8, 'active', 'ใช้ num % 3');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (255, 'ต่อข้อความชื่อนามสกุล ชุดที่ 55', 'รับอินพุตชื่อและนามสกุลแยกกันเป็น 2 ตัวแปร แล้วนำมาเชื่อมต่อกันโดยมีช่องว่างคั่นตรงกลาง', 'String Operations', 'ประยุกต์ใช้การทำ String Concatenation หรือ f-string', 2, 8, 'active', 'ใช้ f''{first_name} {last_name}''');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (256, 'หาพื้นที่สามเหลี่ยม ชุดที่ 56', 'เขียนโปรแกรมคำนวณพื้นที่สามเหลี่ยม โดยกำหนดฐานเป็น 10 และความสูงเป็น 5 (สูตร: 0.5 * ฐาน * สูง)', 'Arithmetic', 'ประยุกต์ใช้ตัวดำเนินการคูณทางคณิตศาสตร์', 2, 8, 'active', 'คำนวณด้วย 0.5 * 10 * 5');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (257, 'ตรวจสอบคะแนนสอบ ชุดที่ 57', 'รับค่าคะแนนดิบจากผู้ใช้งานผ่านคีย์บอร์ด หากคะแนนมากกว่าหรือเท่ากับ 60 ให้แสดงผลว่า ''Passed''', 'Conditionals', 'ประยุกต์ใช้โครงสร้างเงื่อนไข if แบบบรรทัดเดียวหรือบล็อกอย่างง่าย', 2, 8, 'active', 'if score >= 60: print(''Passed'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (258, 'วนลูปพิมพ์เลขศูนย์ถึงเก้า ชุดที่ 58', 'เขียนโปรแกรมวนลูปเพื่อแสดงตัวเลขตั้งแต่ 0 ถึง 9 ออกทางหน้าจอทีละบรรทัด', 'Loops', 'ฝึกการใช้ for loop ควบคู่กับ range()', 2, 8, 'active', 'ใช้ for i in range(10):');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (259, 'หาเศษการหาร ชุดที่ 59', 'รับตัวเลขจำนวนเต็มจากผู้ใช้ 1 จำนวน แล้วนำมาหาเศษจากการหารด้วย 3 จากนั้นพิมพ์ผลลัพธ์ออกมา', 'Modulo Operator', 'ประยุกต์ใช้เครื่องหมาย Modulo (%)', 2, 8, 'active', 'ใช้ num % 3');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (260, 'ต่อข้อความชื่อนามสกุล ชุดที่ 60', 'รับอินพุตชื่อและนามสกุลแยกกันเป็น 2 ตัวแปร แล้วนำมาเชื่อมต่อกันโดยมีช่องว่างคั่นตรงกลาง', 'String Operations', 'ประยุกต์ใช้การทำ String Concatenation หรือ f-string', 2, 8, 'active', 'ใช้ f''{first_name} {last_name}''');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (261, 'หาพื้นที่สามเหลี่ยม ชุดที่ 61', 'เขียนโปรแกรมคำนวณพื้นที่สามเหลี่ยม โดยกำหนดฐานเป็น 10 และความสูงเป็น 5 (สูตร: 0.5 * ฐาน * สูง)', 'Arithmetic', 'ประยุกต์ใช้ตัวดำเนินการคูณทางคณิตศาสตร์', 2, 8, 'active', 'คำนวณด้วย 0.5 * 10 * 5');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (262, 'ตรวจสอบคะแนนสอบ ชุดที่ 62', 'รับค่าคะแนนดิบจากผู้ใช้งานผ่านคีย์บอร์ด หากคะแนนมากกว่าหรือเท่ากับ 60 ให้แสดงผลว่า ''Passed''', 'Conditionals', 'ประยุกต์ใช้โครงสร้างเงื่อนไข if แบบบรรทัดเดียวหรือบล็อกอย่างง่าย', 2, 8, 'active', 'if score >= 60: print(''Passed'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (263, 'วนลูปพิมพ์เลขศูนย์ถึงเก้า ชุดที่ 63', 'เขียนโปรแกรมวนลูปเพื่อแสดงตัวเลขตั้งแต่ 0 ถึง 9 ออกทางหน้าจอทีละบรรทัด', 'Loops', 'ฝึกการใช้ for loop ควบคู่กับ range()', 2, 8, 'active', 'ใช้ for i in range(10):');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (264, 'หาเศษการหาร ชุดที่ 64', 'รับตัวเลขจำนวนเต็มจากผู้ใช้ 1 จำนวน แล้วนำมาหาเศษจากการหารด้วย 3 จากนั้นพิมพ์ผลลัพธ์ออกมา', 'Modulo Operator', 'ประยุกต์ใช้เครื่องหมาย Modulo (%)', 2, 8, 'active', 'ใช้ num % 3');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (265, 'ต่อข้อความชื่อนามสกุล ชุดที่ 65', 'รับอินพุตชื่อและนามสกุลแยกกันเป็น 2 ตัวแปร แล้วนำมาเชื่อมต่อกันโดยมีช่องว่างคั่นตรงกลาง', 'String Operations', 'ประยุกต์ใช้การทำ String Concatenation หรือ f-string', 2, 8, 'active', 'ใช้ f''{first_name} {last_name}''');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (266, 'หาพื้นที่สามเหลี่ยม ชุดที่ 66', 'เขียนโปรแกรมคำนวณพื้นที่สามเหลี่ยม โดยกำหนดฐานเป็น 10 และความสูงเป็น 5 (สูตร: 0.5 * ฐาน * สูง)', 'Arithmetic', 'ประยุกต์ใช้ตัวดำเนินการคูณทางคณิตศาสตร์', 2, 8, 'active', 'คำนวณด้วย 0.5 * 10 * 5');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (267, 'ตรวจสอบคะแนนสอบ ชุดที่ 67', 'รับค่าคะแนนดิบจากผู้ใช้งานผ่านคีย์บอร์ด หากคะแนนมากกว่าหรือเท่ากับ 60 ให้แสดงผลว่า ''Passed''', 'Conditionals', 'ประยุกต์ใช้โครงสร้างเงื่อนไข if แบบบรรทัดเดียวหรือบล็อกอย่างง่าย', 2, 8, 'active', 'if score >= 60: print(''Passed'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (268, 'วนลูปพิมพ์เลขศูนย์ถึงเก้า ชุดที่ 68', 'เขียนโปรแกรมวนลูปเพื่อแสดงตัวเลขตั้งแต่ 0 ถึง 9 ออกทางหน้าจอทีละบรรทัด', 'Loops', 'ฝึกการใช้ for loop ควบคู่กับ range()', 2, 8, 'active', 'ใช้ for i in range(10):');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (269, 'หาเศษการหาร ชุดที่ 69', 'รับตัวเลขจำนวนเต็มจากผู้ใช้ 1 จำนวน แล้วนำมาหาเศษจากการหารด้วย 3 จากนั้นพิมพ์ผลลัพธ์ออกมา', 'Modulo Operator', 'ประยุกต์ใช้เครื่องหมาย Modulo (%)', 2, 8, 'active', 'ใช้ num % 3');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (270, 'ต่อข้อความชื่อนามสกุล ชุดที่ 70', 'รับอินพุตชื่อและนามสกุลแยกกันเป็น 2 ตัวแปร แล้วนำมาเชื่อมต่อกันโดยมีช่องว่างคั่นตรงกลาง', 'String Operations', 'ประยุกต์ใช้การทำ String Concatenation หรือ f-string', 2, 8, 'active', 'ใช้ f''{first_name} {last_name}''');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (271, 'หาพื้นที่สามเหลี่ยม ชุดที่ 71', 'เขียนโปรแกรมคำนวณพื้นที่สามเหลี่ยม โดยกำหนดฐานเป็น 10 และความสูงเป็น 5 (สูตร: 0.5 * ฐาน * สูง)', 'Arithmetic', 'ประยุกต์ใช้ตัวดำเนินการคูณทางคณิตศาสตร์', 2, 8, 'active', 'คำนวณด้วย 0.5 * 10 * 5');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (272, 'ตรวจสอบคะแนนสอบ ชุดที่ 72', 'รับค่าคะแนนดิบจากผู้ใช้งานผ่านคีย์บอร์ด หากคะแนนมากกว่าหรือเท่ากับ 60 ให้แสดงผลว่า ''Passed''', 'Conditionals', 'ประยุกต์ใช้โครงสร้างเงื่อนไข if แบบบรรทัดเดียวหรือบล็อกอย่างง่าย', 2, 8, 'active', 'if score >= 60: print(''Passed'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (273, 'วนลูปพิมพ์เลขศูนย์ถึงเก้า ชุดที่ 73', 'เขียนโปรแกรมวนลูปเพื่อแสดงตัวเลขตั้งแต่ 0 ถึง 9 ออกทางหน้าจอทีละบรรทัด', 'Loops', 'ฝึกการใช้ for loop ควบคู่กับ range()', 2, 8, 'active', 'ใช้ for i in range(10):');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (274, 'หาเศษการหาร ชุดที่ 74', 'รับตัวเลขจำนวนเต็มจากผู้ใช้ 1 จำนวน แล้วนำมาหาเศษจากการหารด้วย 3 จากนั้นพิมพ์ผลลัพธ์ออกมา', 'Modulo Operator', 'ประยุกต์ใช้เครื่องหมาย Modulo (%)', 2, 8, 'active', 'ใช้ num % 3');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (275, 'ต่อข้อความชื่อนามสกุล ชุดที่ 75', 'รับอินพุตชื่อและนามสกุลแยกกันเป็น 2 ตัวแปร แล้วนำมาเชื่อมต่อกันโดยมีช่องว่างคั่นตรงกลาง', 'String Operations', 'ประยุกต์ใช้การทำ String Concatenation หรือ f-string', 2, 8, 'active', 'ใช้ f''{first_name} {last_name}''');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (276, 'หาพื้นที่สามเหลี่ยม ชุดที่ 76', 'เขียนโปรแกรมคำนวณพื้นที่สามเหลี่ยม โดยกำหนดฐานเป็น 10 และความสูงเป็น 5 (สูตร: 0.5 * ฐาน * สูง)', 'Arithmetic', 'ประยุกต์ใช้ตัวดำเนินการคูณทางคณิตศาสตร์', 2, 8, 'active', 'คำนวณด้วย 0.5 * 10 * 5');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (277, 'ตรวจสอบคะแนนสอบ ชุดที่ 77', 'รับค่าคะแนนดิบจากผู้ใช้งานผ่านคีย์บอร์ด หากคะแนนมากกว่าหรือเท่ากับ 60 ให้แสดงผลว่า ''Passed''', 'Conditionals', 'ประยุกต์ใช้โครงสร้างเงื่อนไข if แบบบรรทัดเดียวหรือบล็อกอย่างง่าย', 2, 8, 'active', 'if score >= 60: print(''Passed'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (278, 'วนลูปพิมพ์เลขศูนย์ถึงเก้า ชุดที่ 78', 'เขียนโปรแกรมวนลูปเพื่อแสดงตัวเลขตั้งแต่ 0 ถึง 9 ออกทางหน้าจอทีละบรรทัด', 'Loops', 'ฝึกการใช้ for loop ควบคู่กับ range()', 2, 8, 'active', 'ใช้ for i in range(10):');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (279, 'หาเศษการหาร ชุดที่ 79', 'รับตัวเลขจำนวนเต็มจากผู้ใช้ 1 จำนวน แล้วนำมาหาเศษจากการหารด้วย 3 จากนั้นพิมพ์ผลลัพธ์ออกมา', 'Modulo Operator', 'ประยุกต์ใช้เครื่องหมาย Modulo (%)', 2, 8, 'active', 'ใช้ num % 3');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (280, 'ต่อข้อความชื่อนามสกุล ชุดที่ 80', 'รับอินพุตชื่อและนามสกุลแยกกันเป็น 2 ตัวแปร แล้วนำมาเชื่อมต่อกันโดยมีช่องว่างคั่นตรงกลาง', 'String Operations', 'ประยุกต์ใช้การทำ String Concatenation หรือ f-string', 2, 8, 'active', 'ใช้ f''{first_name} {last_name}''');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (281, 'หาพื้นที่สามเหลี่ยม ชุดที่ 81', 'เขียนโปรแกรมคำนวณพื้นที่สามเหลี่ยม โดยกำหนดฐานเป็น 10 และความสูงเป็น 5 (สูตร: 0.5 * ฐาน * สูง)', 'Arithmetic', 'ประยุกต์ใช้ตัวดำเนินการคูณทางคณิตศาสตร์', 2, 8, 'active', 'คำนวณด้วย 0.5 * 10 * 5');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (282, 'ตรวจสอบคะแนนสอบ ชุดที่ 82', 'รับค่าคะแนนดิบจากผู้ใช้งานผ่านคีย์บอร์ด หากคะแนนมากกว่าหรือเท่ากับ 60 ให้แสดงผลว่า ''Passed''', 'Conditionals', 'ประยุกต์ใช้โครงสร้างเงื่อนไข if แบบบรรทัดเดียวหรือบล็อกอย่างง่าย', 2, 8, 'active', 'if score >= 60: print(''Passed'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (283, 'วนลูปพิมพ์เลขศูนย์ถึงเก้า ชุดที่ 83', 'เขียนโปรแกรมวนลูปเพื่อแสดงตัวเลขตั้งแต่ 0 ถึง 9 ออกทางหน้าจอทีละบรรทัด', 'Loops', 'ฝึกการใช้ for loop ควบคู่กับ range()', 2, 8, 'active', 'ใช้ for i in range(10):');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (284, 'หาเศษการหาร ชุดที่ 84', 'รับตัวเลขจำนวนเต็มจากผู้ใช้ 1 จำนวน แล้วนำมาหาเศษจากการหารด้วย 3 จากนั้นพิมพ์ผลลัพธ์ออกมา', 'Modulo Operator', 'ประยุกต์ใช้เครื่องหมาย Modulo (%)', 2, 8, 'active', 'ใช้ num % 3');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (285, 'ต่อข้อความชื่อนามสกุล ชุดที่ 85', 'รับอินพุตชื่อและนามสกุลแยกกันเป็น 2 ตัวแปร แล้วนำมาเชื่อมต่อกันโดยมีช่องว่างคั่นตรงกลาง', 'String Operations', 'ประยุกต์ใช้การทำ String Concatenation หรือ f-string', 2, 8, 'active', 'ใช้ f''{first_name} {last_name}''');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (286, 'หาพื้นที่สามเหลี่ยม ชุดที่ 86', 'เขียนโปรแกรมคำนวณพื้นที่สามเหลี่ยม โดยกำหนดฐานเป็น 10 และความสูงเป็น 5 (สูตร: 0.5 * ฐาน * สูง)', 'Arithmetic', 'ประยุกต์ใช้ตัวดำเนินการคูณทางคณิตศาสตร์', 2, 8, 'active', 'คำนวณด้วย 0.5 * 10 * 5');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (287, 'ตรวจสอบคะแนนสอบ ชุดที่ 87', 'รับค่าคะแนนดิบจากผู้ใช้งานผ่านคีย์บอร์ด หากคะแนนมากกว่าหรือเท่ากับ 60 ให้แสดงผลว่า ''Passed''', 'Conditionals', 'ประยุกต์ใช้โครงสร้างเงื่อนไข if แบบบรรทัดเดียวหรือบล็อกอย่างง่าย', 2, 8, 'active', 'if score >= 60: print(''Passed'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (288, 'วนลูปพิมพ์เลขศูนย์ถึงเก้า ชุดที่ 88', 'เขียนโปรแกรมวนลูปเพื่อแสดงตัวเลขตั้งแต่ 0 ถึง 9 ออกทางหน้าจอทีละบรรทัด', 'Loops', 'ฝึกการใช้ for loop ควบคู่กับ range()', 2, 8, 'active', 'ใช้ for i in range(10):');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (289, 'หาเศษการหาร ชุดที่ 89', 'รับตัวเลขจำนวนเต็มจากผู้ใช้ 1 จำนวน แล้วนำมาหาเศษจากการหารด้วย 3 จากนั้นพิมพ์ผลลัพธ์ออกมา', 'Modulo Operator', 'ประยุกต์ใช้เครื่องหมาย Modulo (%)', 2, 8, 'active', 'ใช้ num % 3');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (290, 'ต่อข้อความชื่อนามสกุล ชุดที่ 90', 'รับอินพุตชื่อและนามสกุลแยกกันเป็น 2 ตัวแปร แล้วนำมาเชื่อมต่อกันโดยมีช่องว่างคั่นตรงกลาง', 'String Operations', 'ประยุกต์ใช้การทำ String Concatenation หรือ f-string', 2, 8, 'active', 'ใช้ f''{first_name} {last_name}''');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (291, 'หาพื้นที่สามเหลี่ยม ชุดที่ 91', 'เขียนโปรแกรมคำนวณพื้นที่สามเหลี่ยม โดยกำหนดฐานเป็น 10 และความสูงเป็น 5 (สูตร: 0.5 * ฐาน * สูง)', 'Arithmetic', 'ประยุกต์ใช้ตัวดำเนินการคูณทางคณิตศาสตร์', 2, 8, 'active', 'คำนวณด้วย 0.5 * 10 * 5');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (292, 'ตรวจสอบคะแนนสอบ ชุดที่ 92', 'รับค่าคะแนนดิบจากผู้ใช้งานผ่านคีย์บอร์ด หากคะแนนมากกว่าหรือเท่ากับ 60 ให้แสดงผลว่า ''Passed''', 'Conditionals', 'ประยุกต์ใช้โครงสร้างเงื่อนไข if แบบบรรทัดเดียวหรือบล็อกอย่างง่าย', 2, 8, 'active', 'if score >= 60: print(''Passed'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (293, 'วนลูปพิมพ์เลขศูนย์ถึงเก้า ชุดที่ 93', 'เขียนโปรแกรมวนลูปเพื่อแสดงตัวเลขตั้งแต่ 0 ถึง 9 ออกทางหน้าจอทีละบรรทัด', 'Loops', 'ฝึกการใช้ for loop ควบคู่กับ range()', 2, 8, 'active', 'ใช้ for i in range(10):');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (294, 'หาเศษการหาร ชุดที่ 94', 'รับตัวเลขจำนวนเต็มจากผู้ใช้ 1 จำนวน แล้วนำมาหาเศษจากการหารด้วย 3 จากนั้นพิมพ์ผลลัพธ์ออกมา', 'Modulo Operator', 'ประยุกต์ใช้เครื่องหมาย Modulo (%)', 2, 8, 'active', 'ใช้ num % 3');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (295, 'ต่อข้อความชื่อนามสกุล ชุดที่ 95', 'รับอินพุตชื่อและนามสกุลแยกกันเป็น 2 ตัวแปร แล้วนำมาเชื่อมต่อกันโดยมีช่องว่างคั่นตรงกลาง', 'String Operations', 'ประยุกต์ใช้การทำ String Concatenation หรือ f-string', 2, 8, 'active', 'ใช้ f''{first_name} {last_name}''');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (296, 'หาพื้นที่สามเหลี่ยม ชุดที่ 96', 'เขียนโปรแกรมคำนวณพื้นที่สามเหลี่ยม โดยกำหนดฐานเป็น 10 และความสูงเป็น 5 (สูตร: 0.5 * ฐาน * สูง)', 'Arithmetic', 'ประยุกต์ใช้ตัวดำเนินการคูณทางคณิตศาสตร์', 2, 8, 'active', 'คำนวณด้วย 0.5 * 10 * 5');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (297, 'ตรวจสอบคะแนนสอบ ชุดที่ 97', 'รับค่าคะแนนดิบจากผู้ใช้งานผ่านคีย์บอร์ด หากคะแนนมากกว่าหรือเท่ากับ 60 ให้แสดงผลว่า ''Passed''', 'Conditionals', 'ประยุกต์ใช้โครงสร้างเงื่อนไข if แบบบรรทัดเดียวหรือบล็อกอย่างง่าย', 2, 8, 'active', 'if score >= 60: print(''Passed'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (298, 'วนลูปพิมพ์เลขศูนย์ถึงเก้า ชุดที่ 98', 'เขียนโปรแกรมวนลูปเพื่อแสดงตัวเลขตั้งแต่ 0 ถึง 9 ออกทางหน้าจอทีละบรรทัด', 'Loops', 'ฝึกการใช้ for loop ควบคู่กับ range()', 2, 8, 'active', 'ใช้ for i in range(10):');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (299, 'หาเศษการหาร ชุดที่ 99', 'รับตัวเลขจำนวนเต็มจากผู้ใช้ 1 จำนวน แล้วนำมาหาเศษจากการหารด้วย 3 จากนั้นพิมพ์ผลลัพธ์ออกมา', 'Modulo Operator', 'ประยุกต์ใช้เครื่องหมาย Modulo (%)', 2, 8, 'active', 'ใช้ num % 3');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (300, 'ต่อข้อความชื่อนามสกุล ชุดที่ 100', 'รับอินพุตชื่อและนามสกุลแยกกันเป็น 2 ตัวแปร แล้วนำมาเชื่อมต่อกันโดยมีช่องว่างคั่นตรงกลาง', 'String Operations', 'ประยุกต์ใช้การทำ String Concatenation หรือ f-string', 2, 8, 'active', 'ใช้ f''{first_name} {last_name}''');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (301, 'หาผลรวมในลิสต์', 'กำหนดลิสต์ของตัวเลข numbers = [5, 12, 9, 23, 8] จงเขียนโปรแกรมวนลูปเพื่อคำนวณผลรวมของสมาชิกทุกตัว', 'Lists & Accumulation', 'วิเคราะห์และควบคุมการเก็บสะสมมูลค่าผ่านลูปบนโครงสร้างข้อมูล List', 3, 12, 'active', 'สร้างตัวแปรเก็บผลรวมเริ่มต้นด้วย 0 แล้ววนลูปบวกเพิ่มสมาชิกทีละตัว');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (302, 'นับจำนวนตัวอักษรเฉพาะ ชุดที่ 2', 'รับข้อความ 1 ประโยคจากผู้ใช้ จากนั้นเขียนโปรแกรมวิเคราะห์และนับว่ามีตัวอักษร ''a'' อยู่ทั้งหมดกี่ตัว', 'String Filtering', 'วิเคราะห์องค์ประกอบของสตริงและการเปรียบเทียบค่าพยัญชนะ', 3, 12, 'active', 'วนลูปตรวจสอบ if char == ''a'': แล้วบวกตัวนับเพิ่ม');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (303, 'สร้างตารางสี่เหลี่ยมจัตุรัส ชุดที่ 3', 'เขียนโปรแกรมแสดงเครื่องหมายดอกจัน (*) ขนาด 5X5 แถว ออกทางหน้าจอคอมพิวเตอร์ให้เป็นรูปบล็อกสี่เหลี่ยม', 'Nested Loops', 'วิเคราะห์การทำงานของลูปซ้อนลูป (Nested Loops) ในการจัดรูปกราฟิกแบบข้อความ', 3, 12, 'active', 'ใช้ลูปสองชั้น ชั้นนอกควบคุมแถว ชั้นในควบคุมคอลัมน์');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (304, 'ค้นหาตัวเลขที่น้อยที่สุด ชุดที่ 4', 'กำหนดลิสต์ data = [45, 19, 72, 8, 31] จงเขียนโปรแกรมวนลูปไล่เรียงสมาชิกเพื่อหาค่าที่น้อยที่สุดโดยห้ามใช้ฟังก์ชัน min()', 'Lists Search', 'วิเคราะห์กระบวนการค้นหาข้อมูลเปรียบเทียบในอาร์เรย์', 3, 12, 'active', 'ตั้งค่าแปร min_val = data[0] แล้ววนลูปเทียบตัวที่เหลือเพื่อเปลี่ยนค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (305, 'สกัดข้อมูลราคาผลไม้ ชุดที่ 5', 'กำหนดดิกชันนารีราคาผลไม้ จงเขียนโปรแกรมรับชื่อผลไม้จากผู้ใช้ หากมีอยู่ในระบบให้แสดงราคา นอกเหนือจากนั้นแจ้งว่าไม่มีข้อมูล', 'Dictionary Query', 'วิเคราะห์การเข้าถึงและตรวจสอบ Key ภายในโครงสร้างข้อมูล Dictionary', 3, 12, 'active', 'ใช้เงื่อนไข if fruit_name in prices:');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (306, 'หาผลรวมในลิสต์ ชุดที่ 6', 'กำหนดลิสต์ของตัวเลข numbers = [5, 12, 9, 23, 8] จงเขียนโปรแกรมวนลูปเพื่อคำนวณผลรวมของสมาชิกทุกตัว', 'Lists & Accumulation', 'วิเคราะห์และควบคุมการเก็บสะสมมูลค่าผ่านลูปบนโครงสร้างข้อมูล List', 3, 12, 'active', 'สร้างตัวแปรเก็บผลรวมเริ่มต้นด้วย 0 แล้ววนลูปบวกเพิ่มสมาชิกทีละตัว');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (307, 'นับจำนวนตัวอักษรเฉพาะ ชุดที่ 7', 'รับข้อความ 1 ประโยคจากผู้ใช้ จากนั้นเขียนโปรแกรมวิเคราะห์และนับว่ามีตัวอักษร ''a'' อยู่ทั้งหมดกี่ตัว', 'String Filtering', 'วิเคราะห์องค์ประกอบของสตริงและการเปรียบเทียบค่าพยัญชนะ', 3, 12, 'active', 'วนลูปตรวจสอบ if char == ''a'': แล้วบวกตัวนับเพิ่ม');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (308, 'สร้างตารางสี่เหลี่ยมจัตุรัส ชุดที่ 8', 'เขียนโปรแกรมแสดงเครื่องหมายดอกจัน (*) ขนาด 5val5 แถว ออกทางหน้าจอคอมพิวเตอร์ให้เป็นรูปบล็อกสี่เหลี่ยม', 'Nested Loops', 'วิเคราะห์การทำงานของลูปซ้อนลูป (Nested Loops) ในการจัดรูปกราฟิกแบบข้อความ', 3, 12, 'active', 'ใช้ลูปสองชั้น ชั้นนอกควบคุมแถว ชั้นในควบคุมคอลัมน์');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (309, 'ค้นหาตัวเลขที่น้อยที่สุด ชุดที่ 9', 'กำหนดลิสต์ data = [45, 19, 72, 8, 31] จงเขียนโปรแกรมวนลูปไล่เรียงสมาชิกเพื่อหาค่าที่น้อยที่สุดโดยห้ามใช้ฟังก์ชัน min()', 'Lists Search', 'วิเคราะห์กระบวนการค้นหาข้อมูลเปรียบเทียบในอาร์เรย์', 3, 12, 'active', 'ตั้งค่าแปร min_val = data[0] แล้ววนลูปเทียบตัวที่เหลือเพื่อเปลี่ยนค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (310, 'สกัดข้อมูลราคาผลไม้ ชุดที่ 10', 'กำหนดดิกชันนารีราคาผลไม้ จงเขียนโปรแกรมรับชื่อผลไม้จากผู้ใช้ หากมีอยู่ในระบบให้แสดงราคา นอกเหนือจากนั้นแจ้งว่าไม่มีข้อมูล', 'Dictionary Query', 'วิเคราะห์การเข้าถึงและตรวจสอบ Key ภายในโครงสร้างข้อมูล Dictionary', 3, 12, 'active', 'ใช้เงื่อนไข if fruit_name in prices:');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (311, 'หาผลรวมในลิสต์ ชุดที่ 11', 'กำหนดลิสต์ของตัวเลข numbers = [5, 12, 9, 23, 8] จงเขียนโปรแกรมวนลูปเพื่อคำนวณผลรวมของสมาชิกทุกตัว', 'Lists & Accumulation', 'วิเคราะห์และควบคุมการเก็บสะสมมูลค่าผ่านลูปบนโครงสร้างข้อมูล List', 3, 12, 'active', 'สร้างตัวแปรเก็บผลรวมเริ่มต้นด้วย 0 แล้ววนลูปบวกเพิ่มสมาชิกทีละตัว');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (312, 'นับจำนวนตัวอักษรเฉพาะ ชุดที่ 12', 'รับข้อความ 1 ประโยคจากผู้ใช้ จากนั้นเขียนโปรแกรมวิเคราะห์และนับว่ามีตัวอักษร ''a'' อยู่ทั้งหมดกี่ตัว', 'String Filtering', 'วิเคราะห์องค์ประกอบของสตริงและการเปรียบเทียบค่าพยัญชนะ', 3, 12, 'active', 'วนลูปตรวจสอบ if char == ''a'': แล้วบวกตัวนับเพิ่ม');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (313, 'สร้างตารางสี่เหลี่ยมจัตุรัส ชุดที่ 13', 'เขียนโปรแกรมแสดงเครื่องหมายดอกจัน (*) ขนาด 5X5 แถว ออกทางหน้าจอคอมพิวเตอร์ให้เป็นรูปบล็อกสี่เหลี่ยม', 'Nested Loops', 'วิเคราะห์การทำงานของลูปซ้อนลูป (Nested Loops) ในการจัดรูปกราฟิกแบบข้อความ', 3, 12, 'active', 'ใช้ลูปสองชั้น ชั้นนอกควบคุมแถว ชั้นในควบคุมคอลัมน์');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (314, 'ค้นหาตัวเลขที่น้อยที่สุด ชุดที่ 14', 'กำหนดลิสต์ data = [45, 19, 72, 8, 31] จงเขียนโปรแกรมวนลูปไล่เรียงสมาชิกเพื่อหาค่าที่น้อยที่สุดโดยห้ามใช้ฟังก์ชัน min()', 'Lists Search', 'วิเคราะห์กระบวนการค้นหาข้อมูลเปรียบเทียบในอาร์เรย์', 3, 12, 'active', 'ตั้งค่าแปร min_val = data[0] แล้ววนลูปเทียบตัวที่เหลือเพื่อเปลี่ยนค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (315, 'สกัดข้อมูลราคาผลไม้ ชุดที่ 15', 'กำหนดดิกชันนารีราคาผลไม้ จงเขียนโปรแกรมรับชื่อผลไม้จากผู้ใช้ หากมีอยู่ในระบบให้แสดงราคา นอกเหนือจากนั้นแจ้งว่าไม่มีข้อมูล', 'Dictionary Query', 'วิเคราะห์การเข้าถึงและตรวจสอบ Key ภายในโครงสร้างข้อมูล Dictionary', 3, 12, 'active', 'ใช้เงื่อนไข if fruit_name in prices:');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (316, 'หาผลรวมในลิสต์ ชุดที่ 16', 'กำหนดลิสต์ของตัวเลข numbers = [5, 12, 9, 23, 8] จงเขียนโปรแกรมวนลูปเพื่อคำนวณผลรวมของสมาชิกทุกตัว', 'Lists & Accumulation', 'วิเคราะห์และควบคุมการเก็บสะสมมูลค่าผ่านลูปบนโครงสร้างข้อมูล List', 3, 12, 'active', 'สร้างตัวแปรเก็บผลรวมเริ่มต้นด้วย 0 แล้ววนลูปบวกเพิ่มสมาชิกทีละตัว');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (317, 'นับจำนวนตัวอักษรเฉพาะ ชุดที่ 17', 'รับข้อความ 1 ประโยคจากผู้ใช้ จากนั้นเขียนโปรแกรมวิเคราะห์และนับว่ามีตัวอักษร ''a'' อยู่ทั้งหมดกี่ตัว', 'String Filtering', 'วิเคราะห์องค์ประกอบของสตริงและการเปรียบเทียบค่าพยัญชนะ', 3, 12, 'active', 'วนลูปตรวจสอบ if char == ''a'': แล้วบวกตัวนับเพิ่ม');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (318, 'สร้างตารางสี่เหลี่ยมจัตุรัส ชุดที่ 18', 'เขียนโปรแกรมแสดงเครื่องหมายดอกจัน (*) ขนาด 5val5 แถว ออกทางหน้าจอคอมพิวเตอร์ให้เป็นรูปบล็อกสี่เหลี่ยม', 'Nested Loops', 'วิเคราะห์การทำงานของลูปซ้อนลูป (Nested Loops) ในการจัดรูปกราฟิกแบบข้อความ', 3, 12, 'active', 'ใช้ลูปสองชั้น ชั้นนอกควบคุมแถว ชั้นในควบคุมคอลัมน์');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (319, 'ค้นหาตัวเลขที่น้อยที่สุด ชุดที่ 19', 'กำหนดลิสต์ data = [45, 19, 72, 8, 31] จงเขียนโปรแกรมวนลูปไล่เรียงสมาชิกเพื่อหาค่าที่น้อยที่สุดโดยห้ามใช้ฟังก์ชัน min()', 'Lists Search', 'วิเคราะห์กระบวนการค้นหาข้อมูลเปรียบเทียบในอาร์เรย์', 3, 12, 'active', 'ตั้งค่าแปร min_val = data[0] แล้ววนลูปเทียบตัวที่เหลือเพื่อเปลี่ยนค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (320, 'สกัดข้อมูลราคาผลไม้ ชุดที่ 20', 'กำหนดดิกชันนารีราคาผลไม้ จงเขียนโปรแกรมรับชื่อผลไม้จากผู้ใช้ หากมีอยู่ในระบบให้แสดงราคา นอกเหนือจากนั้นแจ้งว่าไม่มีข้อมูล', 'Dictionary Query', 'วิเคราะห์การเข้าถึงและตรวจสอบ Key ภายในโครงสร้างข้อมูล Dictionary', 3, 12, 'active', 'ใช้เงื่อนไข if fruit_name in prices:');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (321, 'หาผลรวมในลิสต์ ชุดที่ 21', 'กำหนดลิสต์ของตัวเลข numbers = [5, 12, 9, 23, 8] จงเขียนโปรแกรมวนลูปเพื่อคำนวณผลรวมของสมาชิกทุกตัว', 'Lists & Accumulation', 'วิเคราะห์และควบคุมการเก็บสะสมมูลค่าผ่านลูปบนโครงสร้างข้อมูล List', 3, 12, 'active', 'สร้างตัวแปรเก็บผลรวมเริ่มต้นด้วย 0 แล้ววนลูปบวกเพิ่มสมาชิกทีละตัว');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (322, 'นับจำนวนตัวอักษรเฉพาะ ชุดที่ 22', 'รับข้อความ 1 ประโยคจากผู้ใช้ จากนั้นเขียนโปรแกรมวิเคราะห์และนับว่ามีตัวอักษร ''a'' อยู่ทั้งหมดกี่ตัว', 'String Filtering', 'วิเคราะห์องค์ประกอบของสตริงและการเปรียบเทียบค่าพยัญชนะ', 3, 12, 'active', 'วนลูปตรวจสอบ if char == ''a'': แล้วบวกตัวนับเพิ่ม');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (323, 'สร้างตารางสี่เหลี่ยมจัตุรัส ชุดที่ 23', 'เขียนโปรแกรมแสดงเครื่องหมายดอกจัน (*) ขนาด 5X5 แถว ออกทางหน้าจอคอมพิวเตอร์ให้เป็นรูปบล็อกสี่เหลี่ยม', 'Nested Loops', 'วิเคราะห์การทำงานของลูปซ้อนลูป (Nested Loops) ในการจัดรูปกราฟิกแบบข้อความ', 3, 12, 'active', 'ใช้ลูปสองชั้น ชั้นนอกควบคุมแถว ชั้นในควบคุมคอลัมน์');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (324, 'ค้นหาตัวเลขที่น้อยที่สุด ชุดที่ 24', 'กำหนดลิสต์ data = [45, 19, 72, 8, 31] จงเขียนโปรแกรมวนลูปไล่เรียงสมาชิกเพื่อหาค่าที่น้อยที่สุดโดยห้ามใช้ฟังก์ชัน min()', 'Lists Search', 'วิเคราะห์กระบวนการค้นหาข้อมูลเปรียบเทียบในอาร์เรย์', 3, 12, 'active', 'ตั้งค่าแปร min_val = data[0] แล้ววนลูปเทียบตัวที่เหลือเพื่อเปลี่ยนค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (325, 'สกัดข้อมูลราคาผลไม้ ชุดที่ 25', 'กำหนดดิกชันนารีราคาผลไม้ จงเขียนโปรแกรมรับชื่อผลไม้จากผู้ใช้ หากมีอยู่ในระบบให้แสดงราคา นอกเหนือจากนั้นแจ้งว่าไม่มีข้อมูล', 'Dictionary Query', 'วิเคราะห์การเข้าถึงและตรวจสอบ Key ภายในโครงสร้างข้อมูล Dictionary', 3, 12, 'active', 'ใช้เงื่อนไข if fruit_name in prices:');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (326, 'หาผลรวมในลิสต์ ชุดที่ 26', 'กำหนดลิสต์ของตัวเลข numbers = [5, 12, 9, 23, 8] จงเขียนโปรแกรมวนลูปเพื่อคำนวณผลรวมของสมาชิกทุกตัว', 'Lists & Accumulation', 'วิเคราะห์และควบคุมการเก็บสะสมมูลค่าผ่านลูปบนโครงสร้างข้อมูล List', 3, 12, 'active', 'สร้างตัวแปรเก็บผลรวมเริ่มต้นด้วย 0 แล้ววนลูปบวกเพิ่มสมาชิกทีละตัว');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (327, 'นับจำนวนตัวอักษรเฉพาะ ชุดที่ 27', 'รับข้อความ 1 ประโยคจากผู้ใช้ จากนั้นเขียนโปรแกรมวิเคราะห์และนับว่ามีตัวอักษร ''a'' อยู่ทั้งหมดกี่ตัว', 'String Filtering', 'วิเคราะห์องค์ประกอบของสตริงและการเปรียบเทียบค่าพยัญชนะ', 3, 12, 'active', 'วนลูปตรวจสอบ if char == ''a'': แล้วบวกตัวนับเพิ่ม');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (328, 'สร้างตารางสี่เหลี่ยมจัตุรัส ชุดที่ 28', 'เขียนโปรแกรมแสดงเครื่องหมายดอกจัน (*) ขนาด 5val5 แถว ออกทางหน้าจอคอมพิวเตอร์ให้เป็นรูปบล็อกสี่เหลี่ยม', 'Nested Loops', 'วิเคราะห์การทำงานของลูปซ้อนลูป (Nested Loops) ในการจัดรูปกราฟิกแบบข้อความ', 3, 12, 'active', 'ใช้ลูปสองชั้น ชั้นนอกควบคุมแถว ชั้นในควบคุมคอลัมน์');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (329, 'ค้นหาตัวเลขที่น้อยที่สุด ชุดที่ 29', 'กำหนดลิสต์ data = [45, 19, 72, 8, 31] จงเขียนโปรแกรมวนลูปไล่เรียงสมาชิกเพื่อหาค่าที่น้อยที่สุดโดยห้ามใช้ฟังก์ชัน min()', 'Lists Search', 'วิเคราะห์กระบวนการค้นหาข้อมูลเปรียบเทียบในอาร์เรย์', 3, 12, 'active', 'ตั้งค่าแปร min_val = data[0] แล้ววนลูปเทียบตัวที่เหลือเพื่อเปลี่ยนค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (330, 'สกัดข้อมูลราคาผลไม้ ชุดที่ 30', 'กำหนดดิกชันนารีราคาผลไม้ จงเขียนโปรแกรมรับชื่อผลไม้จากผู้ใช้ หากมีอยู่ในระบบให้แสดงราคา นอกเหนือจากนั้นแจ้งว่าไม่มีข้อมูล', 'Dictionary Query', 'วิเคราะห์การเข้าถึงและตรวจสอบ Key ภายในโครงสร้างข้อมูล Dictionary', 3, 12, 'active', 'ใช้เงื่อนไข if fruit_name in prices:');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (331, 'หาผลรวมในลิสต์ ชุดที่ 31', 'กำหนดลิสต์ของตัวเลข numbers = [5, 12, 9, 23, 8] จงเขียนโปรแกรมวนลูปเพื่อคำนวณผลรวมของสมาชิกทุกตัว', 'Lists & Accumulation', 'วิเคราะห์และควบคุมการเก็บสะสมมูลค่าผ่านลูปบนโครงสร้างข้อมูล List', 3, 12, 'active', 'สร้างตัวแปรเก็บผลรวมเริ่มต้นด้วย 0 แล้ววนลูปบวกเพิ่มสมาชิกทีละตัว');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (332, 'นับจำนวนตัวอักษรเฉพาะ ชุดที่ 32', 'รับข้อความ 1 ประโยคจากผู้ใช้ จากนั้นเขียนโปรแกรมวิเคราะห์และนับว่ามีตัวอักษร ''a'' อยู่ทั้งหมดกี่ตัว', 'String Filtering', 'วิเคราะห์องค์ประกอบของสตริงและการเปรียบเทียบค่าพยัญชนะ', 3, 12, 'active', 'วนลูปตรวจสอบ if char == ''a'': แล้วบวกตัวนับเพิ่ม');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (333, 'สร้างตารางสี่เหลี่ยมจัตุรัส ชุดที่ 33', 'เขียนโปรแกรมแสดงเครื่องหมายดอกจัน (*) ขนาด 5X5 แถว ออกทางหน้าจอคอมพิวเตอร์ให้เป็นรูปบล็อกสี่เหลี่ยม', 'Nested Loops', 'วิเคราะห์การทำงานของลูปซ้อนลูป (Nested Loops) ในการจัดรูปกราฟิกแบบข้อความ', 3, 12, 'active', 'ใช้ลูปสองชั้น ชั้นนอกควบคุมแถว ชั้นในควบคุมคอลัมน์');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (334, 'ค้นหาตัวเลขที่น้อยที่สุด ชุดที่ 34', 'กำหนดลิสต์ data = [45, 19, 72, 8, 31] จงเขียนโปรแกรมวนลูปไล่เรียงสมาชิกเพื่อหาค่าที่น้อยที่สุดโดยห้ามใช้ฟังก์ชัน min()', 'Lists Search', 'วิเคราะห์กระบวนการค้นหาข้อมูลเปรียบเทียบในอาร์เรย์', 3, 12, 'active', 'ตั้งค่าแปร min_val = data[0] แล้ววนลูปเทียบตัวที่เหลือเพื่อเปลี่ยนค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (335, 'สกัดข้อมูลราคาผลไม้ ชุดที่ 35', 'กำหนดดิกชันนารีราคาผลไม้ จงเขียนโปรแกรมรับชื่อผลไม้จากผู้ใช้ หากมีอยู่ในระบบให้แสดงราคา นอกเหนือจากนั้นแจ้งว่าไม่มีข้อมูล', 'Dictionary Query', 'วิเคราะห์การเข้าถึงและตรวจสอบ Key ภายในโครงสร้างข้อมูล Dictionary', 3, 12, 'active', 'ใช้เงื่อนไข if fruit_name in prices:');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (336, 'หาผลรวมในลิสต์ ชุดที่ 36', 'กำหนดลิสต์ของตัวเลข numbers = [5, 12, 9, 23, 8] จงเขียนโปรแกรมวนลูปเพื่อคำนวณผลรวมของสมาชิกทุกตัว', 'Lists & Accumulation', 'วิเคราะห์และควบคุมการเก็บสะสมมูลค่าผ่านลูปบนโครงสร้างข้อมูล List', 3, 12, 'active', 'สร้างตัวแปรเก็บผลรวมเริ่มต้นด้วย 0 แล้ววนลูปบวกเพิ่มสมาชิกทีละตัว');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (337, 'นับจำนวนตัวอักษรเฉพาะ ชุดที่ 37', 'รับข้อความ 1 ประโยคจากผู้ใช้ จากนั้นเขียนโปรแกรมวิเคราะห์และนับว่ามีตัวอักษร ''a'' อยู่ทั้งหมดกี่ตัว', 'String Filtering', 'วิเคราะห์องค์ประกอบของสตริงและการเปรียบเทียบค่าพยัญชนะ', 3, 12, 'active', 'วนลูปตรวจสอบ if char == ''a'': แล้วบวกตัวนับเพิ่ม');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (338, 'สร้างตารางสี่เหลี่ยมจัตุรัส ชุดที่ 38', 'เขียนโปรแกรมแสดงเครื่องหมายดอกจัน (*) ขนาด 5val5 แถว ออกทางหน้าจอคอมพิวเตอร์ให้เป็นรูปบล็อกสี่เหลี่ยม', 'Nested Loops', 'วิเคราะห์การทำงานของลูปซ้อนลูป (Nested Loops) ในการจัดรูปกราฟิกแบบข้อความ', 3, 12, 'active', 'ใช้ลูปสองชั้น ชั้นนอกควบคุมแถว ชั้นในควบคุมคอลัมน์');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (339, 'ค้นหาตัวเลขที่น้อยที่สุด ชุดที่ 39', 'กำหนดลิสต์ data = [45, 19, 72, 8, 31] จงเขียนโปรแกรมวนลูปไล่เรียงสมาชิกเพื่อหาค่าที่น้อยที่สุดโดยห้ามใช้ฟังก์ชัน min()', 'Lists Search', 'วิเคราะห์กระบวนการค้นหาข้อมูลเปรียบเทียบในอาร์เรย์', 3, 12, 'active', 'ตั้งค่าแปร min_val = data[0] แล้ววนลูปเทียบตัวที่เหลือเพื่อเปลี่ยนค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (340, 'สกัดข้อมูลราคาผลไม้ ชุดที่ 40', 'กำหนดดิกชันนารีราคาผลไม้ จงเขียนโปรแกรมรับชื่อผลไม้จากผู้ใช้ หากมีอยู่ในระบบให้แสดงราคา นอกเหนือจากนั้นแจ้งว่าไม่มีข้อมูล', 'Dictionary Query', 'วิเคราะห์การเข้าถึงและตรวจสอบ Key ภายในโครงสร้างข้อมูล Dictionary', 3, 12, 'active', 'ใช้เงื่อนไข if fruit_name in prices:');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (341, 'หาผลรวมในลิสต์ ชุดที่ 41', 'กำหนดลิสต์ของตัวเลข numbers = [5, 12, 9, 23, 8] จงเขียนโปรแกรมวนลูปเพื่อคำนวณผลรวมของสมาชิกทุกตัว', 'Lists & Accumulation', 'วิเคราะห์และควบคุมการเก็บสะสมมูลค่าผ่านลูปบนโครงสร้างข้อมูล List', 3, 12, 'active', 'สร้างตัวแปรเก็บผลรวมเริ่มต้นด้วย 0 แล้ววนลูปบวกเพิ่มสมาชิกทีละตัว');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (342, 'นับจำนวนตัวอักษรเฉพาะ ชุดที่ 42', 'รับข้อความ 1 ประโยคจากผู้ใช้ จากนั้นเขียนโปรแกรมวิเคราะห์และนับว่ามีตัวอักษร ''a'' อยู่ทั้งหมดกี่ตัว', 'String Filtering', 'วิเคราะห์องค์ประกอบของสตริงและการเปรียบเทียบค่าพยัญชนะ', 3, 12, 'active', 'วนลูปตรวจสอบ if char == ''a'': แล้วบวกตัวนับเพิ่ม');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (343, 'สร้างตารางสี่เหลี่ยมจัตุรัส ชุดที่ 43', 'เขียนโปรแกรมแสดงเครื่องหมายดอกจัน (*) ขนาด 5X5 แถว ออกทางหน้าจอคอมพิวเตอร์ให้เป็นรูปบล็อกสี่เหลี่ยม', 'Nested Loops', 'วิเคราะห์การทำงานของลูปซ้อนลูป (Nested Loops) ในการจัดรูปกราฟิกแบบข้อความ', 3, 12, 'active', 'ใช้ลูปสองชั้น ชั้นนอกควบคุมแถว ชั้นในควบคุมคอลัมน์');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (344, 'ค้นหาตัวเลขที่น้อยที่สุด ชุดที่ 44', 'กำหนดลิสต์ data = [45, 19, 72, 8, 31] จงเขียนโปรแกรมวนลูปไล่เรียงสมาชิกเพื่อหาค่าที่น้อยที่สุดโดยห้ามใช้ฟังก์ชัน min()', 'Lists Search', 'วิเคราะห์กระบวนการค้นหาข้อมูลเปรียบเทียบในอาร์เรย์', 3, 12, 'active', 'ตั้งค่าแปร min_val = data[0] แล้ววนลูปเทียบตัวที่เหลือเพื่อเปลี่ยนค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (345, 'สกัดข้อมูลราคาผลไม้ ชุดที่ 45', 'กำหนดดิกชันนารีราคาผลไม้ จงเขียนโปรแกรมรับชื่อผลไม้จากผู้ใช้ หากมีอยู่ในระบบให้แสดงราคา นอกเหนือจากนั้นแจ้งว่าไม่มีข้อมูล', 'Dictionary Query', 'วิเคราะห์การเข้าถึงและตรวจสอบ Key ภายในโครงสร้างข้อมูล Dictionary', 3, 12, 'active', 'ใช้เงื่อนไข if fruit_name in prices:');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (346, 'หาผลรวมในลิสต์ ชุดที่ 46', 'กำหนดลิสต์ของตัวเลข numbers = [5, 12, 9, 23, 8] จงเขียนโปรแกรมวนลูปเพื่อคำนวณผลรวมของสมาชิกทุกตัว', 'Lists & Accumulation', 'วิเคราะห์และควบคุมการเก็บสะสมมูลค่าผ่านลูปบนโครงสร้างข้อมูล List', 3, 12, 'active', 'สร้างตัวแปรเก็บผลรวมเริ่มต้นด้วย 0 แล้ววนลูปบวกเพิ่มสมาชิกทีละตัว');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (347, 'นับจำนวนตัวอักษรเฉพาะ ชุดที่ 47', 'รับข้อความ 1 ประโยคจากผู้ใช้ จากนั้นเขียนโปรแกรมวิเคราะห์และนับว่ามีตัวอักษร ''a'' อยู่ทั้งหมดกี่ตัว', 'String Filtering', 'วิเคราะห์องค์ประกอบของสตริงและการเปรียบเทียบค่าพยัญชนะ', 3, 12, 'active', 'วนลูปตรวจสอบ if char == ''a'': แล้วบวกตัวนับเพิ่ม');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (348, 'สร้างตารางสี่เหลี่ยมจัตุรัส ชุดที่ 48', 'เขียนโปรแกรมแสดงเครื่องหมายดอกจัน (*) ขนาด 5val5 แถว ออกทางหน้าจอคอมพิวเตอร์ให้เป็นรูปบล็อกสี่เหลี่ยม', 'Nested Loops', 'วิเคราะห์การทำงานของลูปซ้อนลูป (Nested Loops) ในการจัดรูปกราฟิกแบบข้อความ', 3, 12, 'active', 'ใช้ลูปสองชั้น ชั้นนอกควบคุมแถว ชั้นในควบคุมคอลัมน์');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (349, 'ค้นหาตัวเลขที่น้อยที่สุด ชุดที่ 49', 'กำหนดลิสต์ data = [45, 19, 72, 8, 31] จงเขียนโปรแกรมวนลูปไล่เรียงสมาชิกเพื่อหาค่าที่น้อยที่สุดโดยห้ามใช้ฟังก์ชัน min()', 'Lists Search', 'วิเคราะห์กระบวนการค้นหาข้อมูลเปรียบเทียบในอาร์เรย์', 3, 12, 'active', 'ตั้งค่าแปร min_val = data[0] แล้ววนลูปเทียบตัวที่เหลือเพื่อเปลี่ยนค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (350, 'สกัดข้อมูลราคาผลไม้ ชุดที่ 50', 'กำหนดดิกชันนารีราคาผลไม้ จงเขียนโปรแกรมรับชื่อผลไม้จากผู้ใช้ หากมีอยู่ในระบบให้แสดงราคา นอกเหนือจากนั้นแจ้งว่าไม่มีข้อมูล', 'Dictionary Query', 'วิเคราะห์การเข้าถึงและตรวจสอบ Key ภายในโครงสร้างข้อมูล Dictionary', 3, 12, 'active', 'ใช้เงื่อนไข if fruit_name in prices:');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (351, 'หาผลรวมในลิสต์ ชุดที่ 51', 'กำหนดลิสต์ของตัวเลข numbers = [5, 12, 9, 23, 8] จงเขียนโปรแกรมวนลูปเพื่อคำนวณผลรวมของสมาชิกทุกตัว', 'Lists & Accumulation', 'วิเคราะห์และควบคุมการเก็บสะสมมูลค่าผ่านลูปบนโครงสร้างข้อมูล List', 3, 12, 'active', 'สร้างตัวแปรเก็บผลรวมเริ่มต้นด้วย 0 แล้ววนลูปบวกเพิ่มสมาชิกทีละตัว');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (352, 'นับจำนวนตัวอักษรเฉพาะ ชุดที่ 52', 'รับข้อความ 1 ประโยคจากผู้ใช้ จากนั้นเขียนโปรแกรมวิเคราะห์และนับว่ามีตัวอักษร ''a'' อยู่ทั้งหมดกี่ตัว', 'String Filtering', 'วิเคราะห์องค์ประกอบของสตริงและการเปรียบเทียบค่าพยัญชนะ', 3, 12, 'active', 'วนลูปตรวจสอบ if char == ''a'': แล้วบวกตัวนับเพิ่ม');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (353, 'สร้างตารางสี่เหลี่ยมจัตุรัส ชุดที่ 53', 'เขียนโปรแกรมแสดงเครื่องหมายดอกจัน (*) ขนาด 5X5 แถว ออกทางหน้าจอคอมพิวเตอร์ให้เป็นรูปบล็อกสี่เหลี่ยม', 'Nested Loops', 'วิเคราะห์การทำงานของลูปซ้อนลูป (Nested Loops) ในการจัดรูปกราฟิกแบบข้อความ', 3, 12, 'active', 'ใช้ลูปสองชั้น ชั้นนอกควบคุมแถว ชั้นในควบคุมคอลัมน์');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (354, 'ค้นหาตัวเลขที่น้อยที่สุด ชุดที่ 54', 'กำหนดลิสต์ data = [45, 19, 72, 8, 31] จงเขียนโปรแกรมวนลูปไล่เรียงสมาชิกเพื่อหาค่าที่น้อยที่สุดโดยห้ามใช้ฟังก์ชัน min()', 'Lists Search', 'วิเคราะห์กระบวนการค้นหาข้อมูลเปรียบเทียบในอาร์เรย์', 3, 12, 'active', 'ตั้งค่าแปร min_val = data[0] แล้ววนลูปเทียบตัวที่เหลือเพื่อเปลี่ยนค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (355, 'สกัดข้อมูลราคาผลไม้ ชุดที่ 55', 'กำหนดดิกชันนารีราคาผลไม้ จงเขียนโปรแกรมรับชื่อผลไม้จากผู้ใช้ หากมีอยู่ในระบบให้แสดงราคา นอกเหนือจากนั้นแจ้งว่าไม่มีข้อมูล', 'Dictionary Query', 'วิเคราะห์การเข้าถึงและตรวจสอบ Key ภายในโครงสร้างข้อมูล Dictionary', 3, 12, 'active', 'ใช้เงื่อนไข if fruit_name in prices:');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (356, 'หาผลรวมในลิสต์ ชุดที่ 56', 'กำหนดลิสต์ของตัวเลข numbers = [5, 12, 9, 23, 8] จงเขียนโปรแกรมวนลูปเพื่อคำนวณผลรวมของสมาชิกทุกตัว', 'Lists & Accumulation', 'วิเคราะห์และควบคุมการเก็บสะสมมูลค่าผ่านลูปบนโครงสร้างข้อมูล List', 3, 12, 'active', 'สร้างตัวแปรเก็บผลรวมเริ่มต้นด้วย 0 แล้ววนลูปบวกเพิ่มสมาชิกทีละตัว');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (357, 'นับจำนวนตัวอักษรเฉพาะ ชุดที่ 57', 'รับข้อความ 1 ประโยคจากผู้ใช้ จากนั้นเขียนโปรแกรมวิเคราะห์และนับว่ามีตัวอักษร ''a'' อยู่ทั้งหมดกี่ตัว', 'String Filtering', 'วิเคราะห์องค์ประกอบของสตริงและการเปรียบเทียบค่าพยัญชนะ', 3, 12, 'active', 'วนลูปตรวจสอบ if char == ''a'': แล้วบวกตัวนับเพิ่ม');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (358, 'สร้างตารางสี่เหลี่ยมจัตุรัส ชุดที่ 58', 'เขียนโปรแกรมแสดงเครื่องหมายดอกจัน (*) ขนาด 5val5 แถว ออกทางหน้าจอคอมพิวเตอร์ให้เป็นรูปบล็อกสี่เหลี่ยม', 'Nested Loops', 'วิเคราะห์การทำงานของลูปซ้อนลูป (Nested Loops) ในการจัดรูปกราฟิกแบบข้อความ', 3, 12, 'active', 'ใช้ลูปสองชั้น ชั้นนอกควบคุมแถว ชั้นในควบคุมคอลัมน์');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (359, 'ค้นหาตัวเลขที่น้อยที่สุด ชุดที่ 59', 'กำหนดลิสต์ data = [45, 19, 72, 8, 31] จงเขียนโปรแกรมวนลูปไล่เรียงสมาชิกเพื่อหาค่าที่น้อยที่สุดโดยห้ามใช้ฟังก์ชัน min()', 'Lists Search', 'วิเคราะห์กระบวนการค้นหาข้อมูลเปรียบเทียบในอาร์เรย์', 3, 12, 'active', 'ตั้งค่าแปร min_val = data[0] แล้ววนลูปเทียบตัวที่เหลือเพื่อเปลี่ยนค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (360, 'สกัดข้อมูลราคาผลไม้ ชุดที่ 60', 'กำหนดดิกชันนารีราคาผลไม้ จงเขียนโปรแกรมรับชื่อผลไม้จากผู้ใช้ หากมีอยู่ในระบบให้แสดงราคา นอกเหนือจากนั้นแจ้งว่าไม่มีข้อมูล', 'Dictionary Query', 'วิเคราะห์การเข้าถึงและตรวจสอบ Key ภายในโครงสร้างข้อมูล Dictionary', 3, 12, 'active', 'ใช้เงื่อนไข if fruit_name in prices:');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (361, 'หาผลรวมในลิสต์ ชุดที่ 61', 'กำหนดลิสต์ของตัวเลข numbers = [5, 12, 9, 23, 8] จงเขียนโปรแกรมวนลูปเพื่อคำนวณผลรวมของสมาชิกทุกตัว', 'Lists & Accumulation', 'วิเคราะห์และควบคุมการเก็บสะสมมูลค่าผ่านลูปบนโครงสร้างข้อมูล List', 3, 12, 'active', 'สร้างตัวแปรเก็บผลรวมเริ่มต้นด้วย 0 แล้ววนลูปบวกเพิ่มสมาชิกทีละตัว');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (362, 'นับจำนวนตัวอักษรเฉพาะ ชุดที่ 62', 'รับข้อความ 1 ประโยคจากผู้ใช้ จากนั้นเขียนโปรแกรมวิเคราะห์และนับว่ามีตัวอักษร ''a'' อยู่ทั้งหมดกี่ตัว', 'String Filtering', 'วิเคราะห์องค์ประกอบของสตริงและการเปรียบเทียบค่าพยัญชนะ', 3, 12, 'active', 'วนลูปตรวจสอบ if char == ''a'': แล้วบวกตัวนับเพิ่ม');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (363, 'สร้างตารางสี่เหลี่ยมจัตุรัส ชุดที่ 63', 'เขียนโปรแกรมแสดงเครื่องหมายดอกจัน (*) ขนาด 5X5 แถว ออกทางหน้าจอคอมพิวเตอร์ให้เป็นรูปบล็อกสี่เหลี่ยม', 'Nested Loops', 'วิเคราะห์การทำงานของลูปซ้อนลูป (Nested Loops) ในการจัดรูปกราฟิกแบบข้อความ', 3, 12, 'active', 'ใช้ลูปสองชั้น ชั้นนอกควบคุมแถว ชั้นในควบคุมคอลัมน์');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (364, 'ค้นหาตัวเลขที่น้อยที่สุด ชุดที่ 64', 'กำหนดลิสต์ data = [45, 19, 72, 8, 31] จงเขียนโปรแกรมวนลูปไล่เรียงสมาชิกเพื่อหาค่าที่น้อยที่สุดโดยห้ามใช้ฟังก์ชัน min()', 'Lists Search', 'วิเคราะห์กระบวนการค้นหาข้อมูลเปรียบเทียบในอาร์เรย์', 3, 12, 'active', 'ตั้งค่าแปร min_val = data[0] แล้ววนลูปเทียบตัวที่เหลือเพื่อเปลี่ยนค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (365, 'สกัดข้อมูลราคาผลไม้ ชุดที่ 65', 'กำหนดดิกชันนารีราคาผลไม้ จงเขียนโปรแกรมรับชื่อผลไม้จากผู้ใช้ หากมีอยู่ในระบบให้แสดงราคา นอกเหนือจากนั้นแจ้งว่าไม่มีข้อมูล', 'Dictionary Query', 'วิเคราะห์การเข้าถึงและตรวจสอบ Key ภายในโครงสร้างข้อมูล Dictionary', 3, 12, 'active', 'ใช้เงื่อนไข if fruit_name in prices:');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (366, 'หาผลรวมในลิสต์ ชุดที่ 66', 'กำหนดลิสต์ของตัวเลข numbers = [5, 12, 9, 23, 8] จงเขียนโปรแกรมวนลูปเพื่อคำนวณผลรวมของสมาชิกทุกตัว', 'Lists & Accumulation', 'วิเคราะห์และควบคุมการเก็บสะสมมูลค่าผ่านลูปบนโครงสร้างข้อมูล List', 3, 12, 'active', 'สร้างตัวแปรเก็บผลรวมเริ่มต้นด้วย 0 แล้ววนลูปบวกเพิ่มสมาชิกทีละตัว');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (367, 'นับจำนวนตัวอักษรเฉพาะ ชุดที่ 67', 'รับข้อความ 1 ประโยคจากผู้ใช้ จากนั้นเขียนโปรแกรมวิเคราะห์และนับว่ามีตัวอักษร ''a'' อยู่ทั้งหมดกี่ตัว', 'String Filtering', 'วิเคราะห์องค์ประกอบของสตริงและการเปรียบเทียบค่าพยัญชนะ', 3, 12, 'active', 'วนลูปตรวจสอบ if char == ''a'': แล้วบวกตัวนับเพิ่ม');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (368, 'สร้างตารางสี่เหลี่ยมจัตุรัส ชุดที่ 68', 'เขียนโปรแกรมแสดงเครื่องหมายดอกจัน (*) ขนาด 5val5 แถว ออกทางหน้าจอคอมพิวเตอร์ให้เป็นรูปบล็อกสี่เหลี่ยม', 'Nested Loops', 'วิเคราะห์การทำงานของลูปซ้อนลูป (Nested Loops) ในการจัดรูปกราฟิกแบบข้อความ', 3, 12, 'active', 'ใช้ลูปสองชั้น ชั้นนอกควบคุมแถว ชั้นในควบคุมคอลัมน์');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (369, 'ค้นหาตัวเลขที่น้อยที่สุด ชุดที่ 69', 'กำหนดลิสต์ data = [45, 19, 72, 8, 31] จงเขียนโปรแกรมวนลูปไล่เรียงสมาชิกเพื่อหาค่าที่น้อยที่สุดโดยห้ามใช้ฟังก์ชัน min()', 'Lists Search', 'วิเคราะห์กระบวนการค้นหาข้อมูลเปรียบเทียบในอาร์เรย์', 3, 12, 'active', 'ตั้งค่าแปร min_val = data[0] แล้ววนลูปเทียบตัวที่เหลือเพื่อเปลี่ยนค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (370, 'สกัดข้อมูลราคาผลไม้ ชุดที่ 70', 'กำหนดดิกชันนารีราคาผลไม้ จงเขียนโปรแกรมรับชื่อผลไม้จากผู้ใช้ หากมีอยู่ในระบบให้แสดงราคา นอกเหนือจากนั้นแจ้งว่าไม่มีข้อมูล', 'Dictionary Query', 'วิเคราะห์การเข้าถึงและตรวจสอบ Key ภายในโครงสร้างข้อมูล Dictionary', 3, 12, 'active', 'ใช้เงื่อนไข if fruit_name in prices:');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (371, 'หาผลรวมในลิสต์ ชุดที่ 71', 'กำหนดลิสต์ของตัวเลข numbers = [5, 12, 9, 23, 8] จงเขียนโปรแกรมวนลูปเพื่อคำนวณผลรวมของสมาชิกทุกตัว', 'Lists & Accumulation', 'วิเคราะห์และควบคุมการเก็บสะสมมูลค่าผ่านลูปบนโครงสร้างข้อมูล List', 3, 12, 'active', 'สร้างตัวแปรเก็บผลรวมเริ่มต้นด้วย 0 แล้ววนลูปบวกเพิ่มสมาชิกทีละตัว');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (372, 'นับจำนวนตัวอักษรเฉพาะ ชุดที่ 72', 'รับข้อความ 1 ประโยคจากผู้ใช้ จากนั้นเขียนโปรแกรมวิเคราะห์และนับว่ามีตัวอักษร ''a'' อยู่ทั้งหมดกี่ตัว', 'String Filtering', 'วิเคราะห์องค์ประกอบของสตริงและการเปรียบเทียบค่าพยัญชนะ', 3, 12, 'active', 'วนลูปตรวจสอบ if char == ''a'': แล้วบวกตัวนับเพิ่ม');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (373, 'สร้างตารางสี่เหลี่ยมจัตุรัส ชุดที่ 73', 'เขียนโปรแกรมแสดงเครื่องหมายดอกจัน (*) ขนาด 5X5 แถว ออกทางหน้าจอคอมพิวเตอร์ให้เป็นรูปบล็อกสี่เหลี่ยม', 'Nested Loops', 'วิเคราะห์การทำงานของลูปซ้อนลูป (Nested Loops) ในการจัดรูปกราฟิกแบบข้อความ', 3, 12, 'active', 'ใช้ลูปสองชั้น ชั้นนอกควบคุมแถว ชั้นในควบคุมคอลัมน์');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (374, 'ค้นหาตัวเลขที่น้อยที่สุด ชุดที่ 74', 'กำหนดลิสต์ data = [45, 19, 72, 8, 31] จงเขียนโปรแกรมวนลูปไล่เรียงสมาชิกเพื่อหาค่าที่น้อยที่สุดโดยห้ามใช้ฟังก์ชัน min()', 'Lists Search', 'วิเคราะห์กระบวนการค้นหาข้อมูลเปรียบเทียบในอาร์เรย์', 3, 12, 'active', 'ตั้งค่าแปร min_val = data[0] แล้ววนลูปเทียบตัวที่เหลือเพื่อเปลี่ยนค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (375, 'สกัดข้อมูลราคาผลไม้ ชุดที่ 75', 'กำหนดดิกชันนารีราคาผลไม้ จงเขียนโปรแกรมรับชื่อผลไม้จากผู้ใช้ หากมีอยู่ในระบบให้แสดงราคา นอกเหนือจากนั้นแจ้งว่าไม่มีข้อมูล', 'Dictionary Query', 'วิเคราะห์การเข้าถึงและตรวจสอบ Key ภายในโครงสร้างข้อมูล Dictionary', 3, 12, 'active', 'ใช้เงื่อนไข if fruit_name in prices:');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (376, 'หาผลรวมในลิสต์ ชุดที่ 76', 'กำหนดลิสต์ของตัวเลข numbers = [5, 12, 9, 23, 8] จงเขียนโปรแกรมวนลูปเพื่อคำนวณผลรวมของสมาชิกทุกตัว', 'Lists & Accumulation', 'วิเคราะห์และควบคุมการเก็บสะสมมูลค่าผ่านลูปบนโครงสร้างข้อมูล List', 3, 12, 'active', 'สร้างตัวแปรเก็บผลรวมเริ่มต้นด้วย 0 แล้ววนลูปบวกเพิ่มสมาชิกทีละตัว');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (377, 'นับจำนวนตัวอักษรเฉพาะ ชุดที่ 77', 'รับข้อความ 1 ประโยคจากผู้ใช้ จากนั้นเขียนโปรแกรมวิเคราะห์และนับว่ามีตัวอักษร ''a'' อยู่ทั้งหมดกี่ตัว', 'String Filtering', 'วิเคราะห์องค์ประกอบของสตริงและการเปรียบเทียบค่าพยัญชนะ', 3, 12, 'active', 'วนลูปตรวจสอบ if char == ''a'': แล้วบวกตัวนับเพิ่ม');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (378, 'สร้างตารางสี่เหลี่ยมจัตุรัส ชุดที่ 78', 'เขียนโปรแกรมแสดงเครื่องหมายดอกจัน (*) ขนาด 5val5 แถว ออกทางหน้าจอคอมพิวเตอร์ให้เป็นรูปบล็อกสี่เหลี่ยม', 'Nested Loops', 'วิเคราะห์การทำงานของลูปซ้อนลูป (Nested Loops) ในการจัดรูปกราฟิกแบบข้อความ', 3, 12, 'active', 'ใช้ลูปสองชั้น ชั้นนอกควบคุมแถว ชั้นในควบคุมคอลัมน์');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (379, 'ค้นหาตัวเลขที่น้อยที่สุด ชุดที่ 79', 'กำหนดลิสต์ data = [45, 19, 72, 8, 31] จงเขียนโปรแกรมวนลูปไล่เรียงสมาชิกเพื่อหาค่าที่น้อยที่สุดโดยห้ามใช้ฟังก์ชัน min()', 'Lists Search', 'วิเคราะห์กระบวนการค้นหาข้อมูลเปรียบเทียบในอาร์เรย์', 3, 12, 'active', 'ตั้งค่าแปร min_val = data[0] แล้ววนลูปเทียบตัวที่เหลือเพื่อเปลี่ยนค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (380, 'สกัดข้อมูลราคาผลไม้ ชุดที่ 80', 'กำหนดดิกชันนารีราคาผลไม้ จงเขียนโปรแกรมรับชื่อผลไม้จากผู้ใช้ หากมีอยู่ในระบบให้แสดงราคา นอกเหนือจากนั้นแจ้งว่าไม่มีข้อมูล', 'Dictionary Query', 'วิเคราะห์การเข้าถึงและตรวจสอบ Key ภายในโครงสร้างข้อมูล Dictionary', 3, 12, 'active', 'ใช้เงื่อนไข if fruit_name in prices:');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (381, 'หาผลรวมในลิสต์ ชุดที่ 81', 'กำหนดลิสต์ของตัวเลข numbers = [5, 12, 9, 23, 8] จงเขียนโปรแกรมวนลูปเพื่อคำนวณผลรวมของสมาชิกทุกตัว', 'Lists & Accumulation', 'วิเคราะห์และควบคุมการเก็บสะสมมูลค่าผ่านลูปบนโครงสร้างข้อมูล List', 3, 12, 'active', 'สร้างตัวแปรเก็บผลรวมเริ่มต้นด้วย 0 แล้ววนลูปบวกเพิ่มสมาชิกทีละตัว');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (382, 'นับจำนวนตัวอักษรเฉพาะ ชุดที่ 82', 'รับข้อความ 1 ประโยคจากผู้ใช้ จากนั้นเขียนโปรแกรมวิเคราะห์และนับว่ามีตัวอักษร ''a'' อยู่ทั้งหมดกี่ตัว', 'String Filtering', 'วิเคราะห์องค์ประกอบของสตริงและการเปรียบเทียบค่าพยัญชนะ', 3, 12, 'active', 'วนลูปตรวจสอบ if char == ''a'': แล้วบวกตัวนับเพิ่ม');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (383, 'สร้างตารางสี่เหลี่ยมจัตุรัส ชุดที่ 83', 'เขียนโปรแกรมแสดงเครื่องหมายดอกจัน (*) ขนาด 5X5 แถว ออกทางหน้าจอคอมพิวเตอร์ให้เป็นรูปบล็อกสี่เหลี่ยม', 'Nested Loops', 'วิเคราะห์การทำงานของลูปซ้อนลูป (Nested Loops) ในการจัดรูปกราฟิกแบบข้อความ', 3, 12, 'active', 'ใช้ลูปสองชั้น ชั้นนอกควบคุมแถว ชั้นในควบคุมคอลัมน์');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (384, 'ค้นหาตัวเลขที่น้อยที่สุด ชุดที่ 84', 'กำหนดลิสต์ data = [45, 19, 72, 8, 31] จงเขียนโปรแกรมวนลูปไล่เรียงสมาชิกเพื่อหาค่าที่น้อยที่สุดโดยห้ามใช้ฟังก์ชัน min()', 'Lists Search', 'วิเคราะห์กระบวนการค้นหาข้อมูลเปรียบเทียบในอาร์เรย์', 3, 12, 'active', 'ตั้งค่าแปร min_val = data[0] แล้ววนลูปเทียบตัวที่เหลือเพื่อเปลี่ยนค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (385, 'สกัดข้อมูลราคาผลไม้ ชุดที่ 85', 'กำหนดดิกชันนารีราคาผลไม้ จงเขียนโปรแกรมรับชื่อผลไม้จากผู้ใช้ หากมีอยู่ในระบบให้แสดงราคา นอกเหนือจากนั้นแจ้งว่าไม่มีข้อมูล', 'Dictionary Query', 'วิเคราะห์การเข้าถึงและตรวจสอบ Key ภายในโครงสร้างข้อมูล Dictionary', 3, 12, 'active', 'ใช้เงื่อนไข if fruit_name in prices:');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (386, 'หาผลรวมในลิสต์ ชุดที่ 86', 'กำหนดลิสต์ของตัวเลข numbers = [5, 12, 9, 23, 8] จงเขียนโปรแกรมวนลูปเพื่อคำนวณผลรวมของสมาชิกทุกตัว', 'Lists & Accumulation', 'วิเคราะห์และควบคุมการเก็บสะสมมูลค่าผ่านลูปบนโครงสร้างข้อมูล List', 3, 12, 'active', 'สร้างตัวแปรเก็บผลรวมเริ่มต้นด้วย 0 แล้ววนลูปบวกเพิ่มสมาชิกทีละตัว');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (387, 'นับจำนวนตัวอักษรเฉพาะ ชุดที่ 87', 'รับข้อความ 1 ประโยคจากผู้ใช้ จากนั้นเขียนโปรแกรมวิเคราะห์และนับว่ามีตัวอักษร ''a'' อยู่ทั้งหมดกี่ตัว', 'String Filtering', 'วิเคราะห์องค์ประกอบของสตริงและการเปรียบเทียบค่าพยัญชนะ', 3, 12, 'active', 'วนลูปตรวจสอบ if char == ''a'': แล้วบวกตัวนับเพิ่ม');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (388, 'สร้างตารางสี่เหลี่ยมจัตุรัส ชุดที่ 88', 'เขียนโปรแกรมแสดงเครื่องหมายดอกจัน (*) ขนาด 5val5 แถว ออกทางหน้าจอคอมพิวเตอร์ให้เป็นรูปบล็อกสี่เหลี่ยม', 'Nested Loops', 'วิเคราะห์การทำงานของลูปซ้อนลูป (Nested Loops) ในการจัดรูปกราฟิกแบบข้อความ', 3, 12, 'active', 'ใช้ลูปสองชั้น ชั้นนอกควบคุมแถว ชั้นในควบคุมคอลัมน์');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (389, 'ค้นหาตัวเลขที่น้อยที่สุด ชุดที่ 89', 'กำหนดลิสต์ data = [45, 19, 72, 8, 31] จงเขียนโปรแกรมวนลูปไล่เรียงสมาชิกเพื่อหาค่าที่น้อยที่สุดโดยห้ามใช้ฟังก์ชัน min()', 'Lists Search', 'วิเคราะห์กระบวนการค้นหาข้อมูลเปรียบเทียบในอาร์เรย์', 3, 12, 'active', 'ตั้งค่าแปร min_val = data[0] แล้ววนลูปเทียบตัวที่เหลือเพื่อเปลี่ยนค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (390, 'สกัดข้อมูลราคาผลไม้ ชุดที่ 90', 'กำหนดดิกชันนารีราคาผลไม้ จงเขียนโปรแกรมรับชื่อผลไม้จากผู้ใช้ หากมีอยู่ในระบบให้แสดงราคา นอกเหนือจากนั้นแจ้งว่าไม่มีข้อมูล', 'Dictionary Query', 'วิเคราะห์การเข้าถึงและตรวจสอบ Key ภายในโครงสร้างข้อมูล Dictionary', 3, 12, 'active', 'ใช้เงื่อนไข if fruit_name in prices:');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (391, 'หาผลรวมในลิสต์ ชุดที่ 91', 'กำหนดลิสต์ของตัวเลข numbers = [5, 12, 9, 23, 8] จงเขียนโปรแกรมวนลูปเพื่อคำนวณผลรวมของสมาชิกทุกตัว', 'Lists & Accumulation', 'วิเคราะห์และควบคุมการเก็บสะสมมูลค่าผ่านลูปบนโครงสร้างข้อมูล List', 3, 12, 'active', 'สร้างตัวแปรเก็บผลรวมเริ่มต้นด้วย 0 แล้ววนลูปบวกเพิ่มสมาชิกทีละตัว');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (392, 'นับจำนวนตัวอักษรเฉพาะ ชุดที่ 92', 'รับข้อความ 1 ประโยคจากผู้ใช้ จากนั้นเขียนโปรแกรมวิเคราะห์และนับว่ามีตัวอักษร ''a'' อยู่ทั้งหมดกี่ตัว', 'String Filtering', 'วิเคราะห์องค์ประกอบของสตริงและการเปรียบเทียบค่าพยัญชนะ', 3, 12, 'active', 'วนลูปตรวจสอบ if char == ''a'': แล้วบวกตัวนับเพิ่ม');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (393, 'สร้างตารางสี่เหลี่ยมจัตุรัส ชุดที่ 93', 'เขียนโปรแกรมแสดงเครื่องหมายดอกจัน (*) ขนาด 5X5 แถว ออกทางหน้าจอคอมพิวเตอร์ให้เป็นรูปบล็อกสี่เหลี่ยม', 'Nested Loops', 'วิเคราะห์การทำงานของลูปซ้อนลูป (Nested Loops) ในการจัดรูปกราฟิกแบบข้อความ', 3, 12, 'active', 'ใช้ลูปสองชั้น ชั้นนอกควบคุมแถว ชั้นในควบคุมคอลัมน์');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (394, 'ค้นหาตัวเลขที่น้อยที่สุด ชุดที่ 94', 'กำหนดลิสต์ data = [45, 19, 72, 8, 31] จงเขียนโปรแกรมวนลูปไล่เรียงสมาชิกเพื่อหาค่าที่น้อยที่สุดโดยห้ามใช้ฟังก์ชัน min()', 'Lists Search', 'วิเคราะห์กระบวนการค้นหาข้อมูลเปรียบเทียบในอาร์เรย์', 3, 12, 'active', 'ตั้งค่าแปร min_val = data[0] แล้ววนลูปเทียบตัวที่เหลือเพื่อเปลี่ยนค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (395, 'สกัดข้อมูลราคาผลไม้ ชุดที่ 95', 'กำหนดดิกชันนารีราคาผลไม้ จงเขียนโปรแกรมรับชื่อผลไม้จากผู้ใช้ หากมีอยู่ในระบบให้แสดงราคา นอกเหนือจากนั้นแจ้งว่าไม่มีข้อมูล', 'Dictionary Query', 'วิเคราะห์การเข้าถึงและตรวจสอบ Key ภายในโครงสร้างข้อมูล Dictionary', 3, 12, 'active', 'ใช้เงื่อนไข if fruit_name in prices:');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (396, 'หาผลรวมในลิสต์ ชุดที่ 96', 'กำหนดลิสต์ของตัวเลข numbers = [5, 12, 9, 23, 8] จงเขียนโปรแกรมวนลูปเพื่อคำนวณผลรวมของสมาชิกทุกตัว', 'Lists & Accumulation', 'วิเคราะห์และควบคุมการเก็บสะสมมูลค่าผ่านลูปบนโครงสร้างข้อมูล List', 3, 12, 'active', 'สร้างตัวแปรเก็บผลรวมเริ่มต้นด้วย 0 แล้ววนลูปบวกเพิ่มสมาชิกทีละตัว');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (397, 'นับจำนวนตัวอักษรเฉพาะ ชุดที่ 97', 'รับข้อความ 1 ประโยคจากผู้ใช้ จากนั้นเขียนโปรแกรมวิเคราะห์และนับว่ามีตัวอักษร ''a'' อยู่ทั้งหมดกี่ตัว', 'String Filtering', 'วิเคราะห์องค์ประกอบของสตริงและการเปรียบเทียบค่าพยัญชนะ', 3, 12, 'active', 'วนลูปตรวจสอบ if char == ''a'': แล้วบวกตัวนับเพิ่ม');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (398, 'สร้างตารางสี่เหลี่ยมจัตุรัส ชุดที่ 98', 'เขียนโปรแกรมแสดงเครื่องหมายดอกจัน (*) ขนาด 5val5 แถว ออกทางหน้าจอคอมพิวเตอร์ให้เป็นรูปบล็อกสี่เหลี่ยม', 'Nested Loops', 'วิเคราะห์การทำงานของลูปซ้อนลูป (Nested Loops) ในการจัดรูปกราฟิกแบบข้อความ', 3, 12, 'active', 'ใช้ลูปสองชั้น ชั้นนอกควบคุมแถว ชั้นในควบคุมคอลัมน์');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (399, 'ค้นหาตัวเลขที่น้อยที่สุด ชุดที่ 99', 'กำหนดลิสต์ data = [45, 19, 72, 8, 31] จงเขียนโปรแกรมวนลูปไล่เรียงสมาชิกเพื่อหาค่าที่น้อยที่สุดโดยห้ามใช้ฟังก์ชัน min()', 'Lists Search', 'วิเคราะห์กระบวนการค้นหาข้อมูลเปรียบเทียบในอาร์เรย์', 3, 12, 'active', 'ตั้งค่าแปร min_val = data[0] แล้ววนลูปเทียบตัวที่เหลือเพื่อเปลี่ยนค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (400, 'สกัดข้อมูลราคาผลไม้ ชุดที่ 100', 'กำหนดดิกชันนารีราคาผลไม้ จงเขียนโปรแกรมรับชื่อผลไม้จากผู้ใช้ หากมีอยู่ในระบบให้แสดงราคา นอกเหนือจากนั้นแจ้งว่าไม่มีข้อมูล', 'Dictionary Query', 'วิเคราะห์การเข้าถึงและตรวจสอบ Key ภายในโครงสร้างข้อมูล Dictionary', 3, 12, 'active', 'ใช้เงื่อนไข if fruit_name in prices:');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (401, 'ระบบคัดกรองเบอร์โทรศัพท์', 'เขียนโปรแกรมรับอินพุตเบอร์โทรศัพท์ และตรวจสอบว่าความยาวต้องเท่ากับ 10 หลักพอดี และทุกตัวอักษรต้องเป็นตัวเลขเท่านั้น', 'Validation', 'ประเมินค่าความสมบูรณ์และตรวจสอบกฎเกณฑ์ (Validation) ของสายอักขระ', 4, 15, 'active', 'เช็กเงื่อนไขด้วย len(phone) == 10 และ phone.isdigit()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (402, 'ป้องกันข้อผิดพลาดการหาร ชุดที่ 2', 'เขียนโปรแกรมรับตัวเลข 2 ตัวแล้วนำมาหารกัน โดยใช้โครงสร้างป้องกันโปรแกรมพังในกรณีที่ผู้ใช้ป้อนตัวเลขตัวส่วนเป็นเลข 0', 'Exception Handling', 'ประเมินค่าขอบเขตความเสี่ยงของซอฟต์แวร์และดักจับ Exception เชิงลอจิก', 4, 15, 'active', 'ใช้บล็อก try-except ดักจับ ZeroDivisionError');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (403, 'คัดกรองเลขอุณหภูมิผิดปกติ ชุดที่ 3', 'รับลิสต์ของค่าอุณหภูมิห้องมา แล้วประเมินเพื่อลบค่าที่ต่ำกว่า 0 องศา หรือสูงกว่า 50 องศาออกไปเนื่องจากคาดว่าเป็นข้อมูลขยะ', 'Data Filtering', 'ประเมินและคัดกรองข้อมูลแปลกปลอม (Outliers) ออกจากระบบประมวลผล', 4, 15, 'active', 'สร้างลิสต์ใหม่แล้วเก็บเฉพาะตัวเลขที่อยู่ในช่วง 0 ถึง 50');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (404, 'คำนวณตั๋วรถไฟตามอายุ ชุดที่ 4', 'ประเมินราคาตั๋วเดินทางตามเงื่อนไข: อายุต่ำกว่า 10 ปี เรียนฟรี, อายุ 60 ขึ้นไป ลด 50%, นอกเหนือจากนั้น จ่ายราคาเต็ม 100 บาท', 'Advanced Logic', 'ประเมินเกณฑ์การตัดสินใจแบบทับซ้อนและจัดลำดับเงื่อนไขก่อนหลัง', 4, 15, 'active', 'เรียงลำดับ if-elif-else ตามช่วงอายุให้ถูกต้อง');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (405, 'ตรวจสอบรูปแบบนามสกุลไฟล์ ชุดที่ 5', 'รับชื่อไฟล์จากอินพุต แล้วประเมินว่าไฟล์ดังกล่าวเป็นไฟล์รูปภาพตระกูล .png หรือ .jpg หรือไม่ หากไม่ใช่ให้ปฏิเสธการอัปโหลด', 'String Audit', 'ประเมินค่าความสอดคล้องของรูปแบบนามสกุลสตริงตอนท้าย', 4, 15, 'active', 'ใช้เมธอด .endswith(''.png'') หรือ .endswith(''.jpg'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (406, 'ระบบคัดกรองเบอร์โทรศัพท์ ชุดที่ 6', 'เขียนโปรแกรมรับอินพุตเบอร์โทรศัพท์ และตรวจสอบว่าความยาวต้องเท่ากับ 10 หลักพอดี และทุกตัวอักษรต้องเป็นตัวเลขเท่านั้น', 'Validation', 'ประเมินค่าความสมบูรณ์และตรวจสอบกฎเกณฑ์ (Validation) ของสายอักขระ', 4, 15, 'active', 'เช็กเงื่อนไขด้วย len(phone) == 10 และ phone.isdigit()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (407, 'ป้องกันข้อผิดพลาดการหาร ชุดที่ 7', 'เขียนโปรแกรมรับตัวเลข 2 ตัวแล้วนำมาหารกัน โดยใช้โครงสร้างป้องกันโปรแกรมพังในกรณีที่ผู้ใช้ป้อนตัวเลขตัวส่วนเป็นเลข 0', 'Exception Handling', 'ประเมินค่าขอบเขตความเสี่ยงของซอฟต์แวร์และดักจับ Exception เชิงลอจิก', 4, 15, 'active', 'ใช้บล็อก try-except ดักจับ ZeroDivisionError');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (408, 'คัดกรองเลขอุณหภูมิผิดปกติ ชุดที่ 8', 'รับลิสต์ของค่าอุณหภูมิห้องมา แล้วประเมินเพื่อลบค่าที่ต่ำกว่า 0 องศา หรือสูงกว่า 50 องศาออกไปเนื่องจากคาดว่าเป็นข้อมูลขยะ', 'Data Filtering', 'ประเมินและคัดกรองข้อมูลแปลกปลอม (Outliers) ออกจากระบบประมวลผล', 4, 15, 'active', 'สร้างลิสต์ใหม่แล้วเก็บเฉพาะตัวเลขที่อยู่ในช่วง 0 ถึง 50');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (409, 'คำนวณตั๋วรถไฟตามอายุ ชุดที่ 9', 'ประเมินราคาตั๋วเดินทางตามเงื่อนไข: อายุต่ำกว่า 10 ปี เรียนฟรี, อายุ 60 ขึ้นไป ลด 50%, นอกเหนือจากนั้น จ่ายราคาเต็ม 100 บาท', 'Advanced Logic', 'ประเมินเกณฑ์การตัดสินใจแบบทับซ้อนและจัดลำดับเงื่อนไขก่อนหลัง', 4, 15, 'active', 'เรียงลำดับ if-elif-else ตามช่วงอายุให้ถูกต้อง');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (410, 'ตรวจสอบรูปแบบนามสกุลไฟล์ ชุดที่ 10', 'รับชื่อไฟล์จากอินพุต แล้วประเมินว่าไฟล์ดังกล่าวเป็นไฟล์รูปภาพตระกูล .png หรือ .jpg หรือไม่ หากไม่ใช่ให้ปฏิเสธการอัปโหลด', 'String Audit', 'ประเมินค่าความสอดคล้องของรูปแบบนามสกุลสตริงตอนท้าย', 4, 15, 'active', 'ใช้เมธอด .endswith(''.png'') หรือ .endswith(''.jpg'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (411, 'ระบบคัดกรองเบอร์โทรศัพท์ ชุดที่ 11', 'เขียนโปรแกรมรับอินพุตเบอร์โทรศัพท์ และตรวจสอบว่าความยาวต้องเท่ากับ 10 หลักพอดี และทุกตัวอักษรต้องเป็นตัวเลขเท่านั้น', 'Validation', 'ประเมินค่าความสมบูรณ์และตรวจสอบกฎเกณฑ์ (Validation) ของสายอักขระ', 4, 15, 'active', 'เช็กเงื่อนไขด้วย len(phone) == 10 และ phone.isdigit()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (412, 'ป้องกันข้อผิดพลาดการหาร ชุดที่ 12', 'เขียนโปรแกรมรับตัวเลข 2 ตัวแล้วนำมาหารกัน โดยใช้โครงสร้างป้องกันโปรแกรมพังในกรณีที่ผู้ใช้ป้อนตัวเลขตัวส่วนเป็นเลข 0', 'Exception Handling', 'ประเมินค่าขอบเขตความเสี่ยงของซอฟต์แวร์และดักจับ Exception เชิงลอจิก', 4, 15, 'active', 'ใช้บล็อก try-except ดักจับ ZeroDivisionError');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (413, 'คัดกรองเลขอุณหภูมิผิดปกติ ชุดที่ 13', 'รับลิสต์ของค่าอุณหภูมิห้องมา แล้วประเมินเพื่อลบค่าที่ต่ำกว่า 0 องศา หรือสูงกว่า 50 องศาออกไปเนื่องจากคาดว่าเป็นข้อมูลขยะ', 'Data Filtering', 'ประเมินและคัดกรองข้อมูลแปลกปลอม (Outliers) ออกจากระบบประมวลผล', 4, 15, 'active', 'สร้างลิสต์ใหม่แล้วเก็บเฉพาะตัวเลขที่อยู่ในช่วง 0 ถึง 50');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (414, 'คำนวณตั๋วรถไฟตามอายุ ชุดที่ 14', 'ประเมินราคาตั๋วเดินทางตามเงื่อนไข: อายุต่ำกว่า 10 ปี เรียนฟรี, อายุ 60 ขึ้นไป ลด 50%, นอกเหนือจากนั้น จ่ายราคาเต็ม 100 บาท', 'Advanced Logic', 'ประเมินเกณฑ์การตัดสินใจแบบทับซ้อนและจัดลำดับเงื่อนไขก่อนหลัง', 4, 15, 'active', 'เรียงลำดับ if-elif-else ตามช่วงอายุให้ถูกต้อง');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (415, 'ตรวจสอบรูปแบบนามสกุลไฟล์ ชุดที่ 15', 'รับชื่อไฟล์จากอินพุต แล้วประเมินว่าไฟล์ดังกล่าวเป็นไฟล์รูปภาพตระกูล .png หรือ .jpg หรือไม่ หากไม่ใช่ให้ปฏิเสธการอัปโหลด', 'String Audit', 'ประเมินค่าความสอดคล้องของรูปแบบนามสกุลสตริงตอนท้าย', 4, 15, 'active', 'ใช้เมธอด .endswith(''.png'') หรือ .endswith(''.jpg'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (416, 'ระบบคัดกรองเบอร์โทรศัพท์ ชุดที่ 16', 'เขียนโปรแกรมรับอินพุตเบอร์โทรศัพท์ และตรวจสอบว่าความยาวต้องเท่ากับ 10 หลักพอดี และทุกตัวอักษรต้องเป็นตัวเลขเท่านั้น', 'Validation', 'ประเมินค่าความสมบูรณ์และตรวจสอบกฎเกณฑ์ (Validation) ของสายอักขระ', 4, 15, 'active', 'เช็กเงื่อนไขด้วย len(phone) == 10 และ phone.isdigit()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (417, 'ป้องกันข้อผิดพลาดการหาร ชุดที่ 17', 'เขียนโปรแกรมรับตัวเลข 2 ตัวแล้วนำมาหารกัน โดยใช้โครงสร้างป้องกันโปรแกรมพังในกรณีที่ผู้ใช้ป้อนตัวเลขตัวส่วนเป็นเลข 0', 'Exception Handling', 'ประเมินค่าขอบเขตความเสี่ยงของซอฟต์แวร์และดักจับ Exception เชิงลอจิก', 4, 15, 'active', 'ใช้บล็อก try-except ดักจับ ZeroDivisionError');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (418, 'คัดกรองเลขอุณหภูมิผิดปกติ ชุดที่ 18', 'รับลิสต์ของค่าอุณหภูมิห้องมา แล้วประเมินเพื่อลบค่าที่ต่ำกว่า 0 องศา หรือสูงกว่า 50 องศาออกไปเนื่องจากคาดว่าเป็นข้อมูลขยะ', 'Data Filtering', 'ประเมินและคัดกรองข้อมูลแปลกปลอม (Outliers) ออกจากระบบประมวลผล', 4, 15, 'active', 'สร้างลิสต์ใหม่แล้วเก็บเฉพาะตัวเลขที่อยู่ในช่วง 0 ถึง 50');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (419, 'คำนวณตั๋วรถไฟตามอายุ ชุดที่ 19', 'ประเมินราคาตั๋วเดินทางตามเงื่อนไข: อายุต่ำกว่า 10 ปี เรียนฟรี, อายุ 60 ขึ้นไป ลด 50%, นอกเหนือจากนั้น จ่ายราคาเต็ม 100 บาท', 'Advanced Logic', 'ประเมินเกณฑ์การตัดสินใจแบบทับซ้อนและจัดลำดับเงื่อนไขก่อนหลัง', 4, 15, 'active', 'เรียงลำดับ if-elif-else ตามช่วงอายุให้ถูกต้อง');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (420, 'ตรวจสอบรูปแบบนามสกุลไฟล์ ชุดที่ 20', 'รับชื่อไฟล์จากอินพุต แล้วประเมินว่าไฟล์ดังกล่าวเป็นไฟล์รูปภาพตระกูล .png หรือ .jpg หรือไม่ หากไม่ใช่ให้ปฏิเสธการอัปโหลด', 'String Audit', 'ประเมินค่าความสอดคล้องของรูปแบบนามสกุลสตริงตอนท้าย', 4, 15, 'active', 'ใช้เมธอด .endswith(''.png'') หรือ .endswith(''.jpg'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (421, 'ระบบคัดกรองเบอร์โทรศัพท์ ชุดที่ 21', 'เขียนโปรแกรมรับอินพุตเบอร์โทรศัพท์ และตรวจสอบว่าความยาวต้องเท่ากับ 10 หลักพอดี และทุกตัวอักษรต้องเป็นตัวเลขเท่านั้น', 'Validation', 'ประเมินค่าความสมบูรณ์และตรวจสอบกฎเกณฑ์ (Validation) ของสายอักขระ', 4, 15, 'active', 'เช็กเงื่อนไขด้วย len(phone) == 10 และ phone.isdigit()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (422, 'ป้องกันข้อผิดพลาดการหาร ชุดที่ 22', 'เขียนโปรแกรมรับตัวเลข 2 ตัวแล้วนำมาหารกัน โดยใช้โครงสร้างป้องกันโปรแกรมพังในกรณีที่ผู้ใช้ป้อนตัวเลขตัวส่วนเป็นเลข 0', 'Exception Handling', 'ประเมินค่าขอบเขตความเสี่ยงของซอฟต์แวร์และดักจับ Exception เชิงลอจิก', 4, 15, 'active', 'ใช้บล็อก try-except ดักจับ ZeroDivisionError');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (423, 'คัดกรองเลขอุณหภูมิผิดปกติ ชุดที่ 23', 'รับลิสต์ของค่าอุณหภูมิห้องมา แล้วประเมินเพื่อลบค่าที่ต่ำกว่า 0 องศา หรือสูงกว่า 50 องศาออกไปเนื่องจากคาดว่าเป็นข้อมูลขยะ', 'Data Filtering', 'ประเมินและคัดกรองข้อมูลแปลกปลอม (Outliers) ออกจากระบบประมวลผล', 4, 15, 'active', 'สร้างลิสต์ใหม่แล้วเก็บเฉพาะตัวเลขที่อยู่ในช่วง 0 ถึง 50');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (424, 'คำนวณตั๋วรถไฟตามอายุ ชุดที่ 24', 'ประเมินราคาตั๋วเดินทางตามเงื่อนไข: อายุต่ำกว่า 10 ปี เรียนฟรี, อายุ 60 ขึ้นไป ลด 50%, นอกเหนือจากนั้น จ่ายราคาเต็ม 100 บาท', 'Advanced Logic', 'ประเมินเกณฑ์การตัดสินใจแบบทับซ้อนและจัดลำดับเงื่อนไขก่อนหลัง', 4, 15, 'active', 'เรียงลำดับ if-elif-else ตามช่วงอายุให้ถูกต้อง');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (425, 'ตรวจสอบรูปแบบนามสกุลไฟล์ ชุดที่ 25', 'รับชื่อไฟล์จากอินพุต แล้วประเมินว่าไฟล์ดังกล่าวเป็นไฟล์รูปภาพตระกูล .png หรือ .jpg หรือไม่ หากไม่ใช่ให้ปฏิเสธการอัปโหลด', 'String Audit', 'ประเมินค่าความสอดคล้องของรูปแบบนามสกุลสตริงตอนท้าย', 4, 15, 'active', 'ใช้เมธอด .endswith(''.png'') หรือ .endswith(''.jpg'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (426, 'ระบบคัดกรองเบอร์โทรศัพท์ ชุดที่ 26', 'เขียนโปรแกรมรับอินพุตเบอร์โทรศัพท์ และตรวจสอบว่าความยาวต้องเท่ากับ 10 หลักพอดี และทุกตัวอักษรต้องเป็นตัวเลขเท่านั้น', 'Validation', 'ประเมินค่าความสมบูรณ์และตรวจสอบกฎเกณฑ์ (Validation) ของสายอักขระ', 4, 15, 'active', 'เช็กเงื่อนไขด้วย len(phone) == 10 และ phone.isdigit()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (427, 'ป้องกันข้อผิดพลาดการหาร ชุดที่ 27', 'เขียนโปรแกรมรับตัวเลข 2 ตัวแล้วนำมาหารกัน โดยใช้โครงสร้างป้องกันโปรแกรมพังในกรณีที่ผู้ใช้ป้อนตัวเลขตัวส่วนเป็นเลข 0', 'Exception Handling', 'ประเมินค่าขอบเขตความเสี่ยงของซอฟต์แวร์และดักจับ Exception เชิงลอจิก', 4, 15, 'active', 'ใช้บล็อก try-except ดักจับ ZeroDivisionError');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (428, 'คัดกรองเลขอุณหภูมิผิดปกติ ชุดที่ 28', 'รับลิสต์ของค่าอุณหภูมิห้องมา แล้วประเมินเพื่อลบค่าที่ต่ำกว่า 0 องศา หรือสูงกว่า 50 องศาออกไปเนื่องจากคาดว่าเป็นข้อมูลขยะ', 'Data Filtering', 'ประเมินและคัดกรองข้อมูลแปลกปลอม (Outliers) ออกจากระบบประมวลผล', 4, 15, 'active', 'สร้างลิสต์ใหม่แล้วเก็บเฉพาะตัวเลขที่อยู่ในช่วง 0 ถึง 50');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (429, 'คำนวณตั๋วรถไฟตามอายุ ชุดที่ 29', 'ประเมินราคาตั๋วเดินทางตามเงื่อนไข: อายุต่ำกว่า 10 ปี เรียนฟรี, อายุ 60 ขึ้นไป ลด 50%, นอกเหนือจากนั้น จ่ายราคาเต็ม 100 บาท', 'Advanced Logic', 'ประเมินเกณฑ์การตัดสินใจแบบทับซ้อนและจัดลำดับเงื่อนไขก่อนหลัง', 4, 15, 'active', 'เรียงลำดับ if-elif-else ตามช่วงอายุให้ถูกต้อง');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (430, 'ตรวจสอบรูปแบบนามสกุลไฟล์ ชุดที่ 30', 'รับชื่อไฟล์จากอินพุต แล้วประเมินว่าไฟล์ดังกล่าวเป็นไฟล์รูปภาพตระกูล .png หรือ .jpg หรือไม่ หากไม่ใช่ให้ปฏิเสธการอัปโหลด', 'String Audit', 'ประเมินค่าความสอดคล้องของรูปแบบนามสกุลสตริงตอนท้าย', 4, 15, 'active', 'ใช้เมธอด .endswith(''.png'') หรือ .endswith(''.jpg'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (431, 'ระบบคัดกรองเบอร์โทรศัพท์ ชุดที่ 31', 'เขียนโปรแกรมรับอินพุตเบอร์โทรศัพท์ และตรวจสอบว่าความยาวต้องเท่ากับ 10 หลักพอดี และทุกตัวอักษรต้องเป็นตัวเลขเท่านั้น', 'Validation', 'ประเมินค่าความสมบูรณ์และตรวจสอบกฎเกณฑ์ (Validation) ของสายอักขระ', 4, 15, 'active', 'เช็กเงื่อนไขด้วย len(phone) == 10 และ phone.isdigit()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (432, 'ป้องกันข้อผิดพลาดการหาร ชุดที่ 32', 'เขียนโปรแกรมรับตัวเลข 2 ตัวแล้วนำมาหารกัน โดยใช้โครงสร้างป้องกันโปรแกรมพังในกรณีที่ผู้ใช้ป้อนตัวเลขตัวส่วนเป็นเลข 0', 'Exception Handling', 'ประเมินค่าขอบเขตความเสี่ยงของซอฟต์แวร์และดักจับ Exception เชิงลอจิก', 4, 15, 'active', 'ใช้บล็อก try-except ดักจับ ZeroDivisionError');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (433, 'คัดกรองเลขอุณหภูมิผิดปกติ ชุดที่ 33', 'รับลิสต์ของค่าอุณหภูมิห้องมา แล้วประเมินเพื่อลบค่าที่ต่ำกว่า 0 องศา หรือสูงกว่า 50 องศาออกไปเนื่องจากคาดว่าเป็นข้อมูลขยะ', 'Data Filtering', 'ประเมินและคัดกรองข้อมูลแปลกปลอม (Outliers) ออกจากระบบประมวลผล', 4, 15, 'active', 'สร้างลิสต์ใหม่แล้วเก็บเฉพาะตัวเลขที่อยู่ในช่วง 0 ถึง 50');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (434, 'คำนวณตั๋วรถไฟตามอายุ ชุดที่ 34', 'ประเมินราคาตั๋วเดินทางตามเงื่อนไข: อายุต่ำกว่า 10 ปี เรียนฟรี, อายุ 60 ขึ้นไป ลด 50%, นอกเหนือจากนั้น จ่ายราคาเต็ม 100 บาท', 'Advanced Logic', 'ประเมินเกณฑ์การตัดสินใจแบบทับซ้อนและจัดลำดับเงื่อนไขก่อนหลัง', 4, 15, 'active', 'เรียงลำดับ if-elif-else ตามช่วงอายุให้ถูกต้อง');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (435, 'ตรวจสอบรูปแบบนามสกุลไฟล์ ชุดที่ 35', 'รับชื่อไฟล์จากอินพุต แล้วประเมินว่าไฟล์ดังกล่าวเป็นไฟล์รูปภาพตระกูล .png หรือ .jpg หรือไม่ หากไม่ใช่ให้ปฏิเสธการอัปโหลด', 'String Audit', 'ประเมินค่าความสอดคล้องของรูปแบบนามสกุลสตริงตอนท้าย', 4, 15, 'active', 'ใช้เมธอด .endswith(''.png'') หรือ .endswith(''.jpg'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (436, 'ระบบคัดกรองเบอร์โทรศัพท์ ชุดที่ 36', 'เขียนโปรแกรมรับอินพุตเบอร์โทรศัพท์ และตรวจสอบว่าความยาวต้องเท่ากับ 10 หลักพอดี และทุกตัวอักษรต้องเป็นตัวเลขเท่านั้น', 'Validation', 'ประเมินค่าความสมบูรณ์และตรวจสอบกฎเกณฑ์ (Validation) ของสายอักขระ', 4, 15, 'active', 'เช็กเงื่อนไขด้วย len(phone) == 10 และ phone.isdigit()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (437, 'ป้องกันข้อผิดพลาดการหาร ชุดที่ 37', 'เขียนโปรแกรมรับตัวเลข 2 ตัวแล้วนำมาหารกัน โดยใช้โครงสร้างป้องกันโปรแกรมพังในกรณีที่ผู้ใช้ป้อนตัวเลขตัวส่วนเป็นเลข 0', 'Exception Handling', 'ประเมินค่าขอบเขตความเสี่ยงของซอฟต์แวร์และดักจับ Exception เชิงลอจิก', 4, 15, 'active', 'ใช้บล็อก try-except ดักจับ ZeroDivisionError');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (438, 'คัดกรองเลขอุณหภูมิผิดปกติ ชุดที่ 38', 'รับลิสต์ของค่าอุณหภูมิห้องมา แล้วประเมินเพื่อลบค่าที่ต่ำกว่า 0 องศา หรือสูงกว่า 50 องศาออกไปเนื่องจากคาดว่าเป็นข้อมูลขยะ', 'Data Filtering', 'ประเมินและคัดกรองข้อมูลแปลกปลอม (Outliers) ออกจากระบบประมวลผล', 4, 15, 'active', 'สร้างลิสต์ใหม่แล้วเก็บเฉพาะตัวเลขที่อยู่ในช่วง 0 ถึง 50');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (439, 'คำนวณตั๋วรถไฟตามอายุ ชุดที่ 39', 'ประเมินราคาตั๋วเดินทางตามเงื่อนไข: อายุต่ำกว่า 10 ปี เรียนฟรี, อายุ 60 ขึ้นไป ลด 50%, นอกเหนือจากนั้น จ่ายราคาเต็ม 100 บาท', 'Advanced Logic', 'ประเมินเกณฑ์การตัดสินใจแบบทับซ้อนและจัดลำดับเงื่อนไขก่อนหลัง', 4, 15, 'active', 'เรียงลำดับ if-elif-else ตามช่วงอายุให้ถูกต้อง');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (440, 'ตรวจสอบรูปแบบนามสกุลไฟล์ ชุดที่ 40', 'รับชื่อไฟล์จากอินพุต แล้วประเมินว่าไฟล์ดังกล่าวเป็นไฟล์รูปภาพตระกูล .png หรือ .jpg หรือไม่ หากไม่ใช่ให้ปฏิเสธการอัปโหลด', 'String Audit', 'ประเมินค่าความสอดคล้องของรูปแบบนามสกุลสตริงตอนท้าย', 4, 15, 'active', 'ใช้เมธอด .endswith(''.png'') หรือ .endswith(''.jpg'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (441, 'ระบบคัดกรองเบอร์โทรศัพท์ ชุดที่ 41', 'เขียนโปรแกรมรับอินพุตเบอร์โทรศัพท์ และตรวจสอบว่าความยาวต้องเท่ากับ 10 หลักพอดี และทุกตัวอักษรต้องเป็นตัวเลขเท่านั้น', 'Validation', 'ประเมินค่าความสมบูรณ์และตรวจสอบกฎเกณฑ์ (Validation) ของสายอักขระ', 4, 15, 'active', 'เช็กเงื่อนไขด้วย len(phone) == 10 และ phone.isdigit()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (442, 'ป้องกันข้อผิดพลาดการหาร ชุดที่ 42', 'เขียนโปรแกรมรับตัวเลข 2 ตัวแล้วนำมาหารกัน โดยใช้โครงสร้างป้องกันโปรแกรมพังในกรณีที่ผู้ใช้ป้อนตัวเลขตัวส่วนเป็นเลข 0', 'Exception Handling', 'ประเมินค่าขอบเขตความเสี่ยงของซอฟต์แวร์และดักจับ Exception เชิงลอจิก', 4, 15, 'active', 'ใช้บล็อก try-except ดักจับ ZeroDivisionError');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (443, 'คัดกรองเลขอุณหภูมิผิดปกติ ชุดที่ 43', 'รับลิสต์ของค่าอุณหภูมิห้องมา แล้วประเมินเพื่อลบค่าที่ต่ำกว่า 0 องศา หรือสูงกว่า 50 องศาออกไปเนื่องจากคาดว่าเป็นข้อมูลขยะ', 'Data Filtering', 'ประเมินและคัดกรองข้อมูลแปลกปลอม (Outliers) ออกจากระบบประมวลผล', 4, 15, 'active', 'สร้างลิสต์ใหม่แล้วเก็บเฉพาะตัวเลขที่อยู่ในช่วง 0 ถึง 50');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (444, 'คำนวณตั๋วรถไฟตามอายุ ชุดที่ 44', 'ประเมินราคาตั๋วเดินทางตามเงื่อนไข: อายุต่ำกว่า 10 ปี เรียนฟรี, อายุ 60 ขึ้นไป ลด 50%, นอกเหนือจากนั้น จ่ายราคาเต็ม 100 บาท', 'Advanced Logic', 'ประเมินเกณฑ์การตัดสินใจแบบทับซ้อนและจัดลำดับเงื่อนไขก่อนหลัง', 4, 15, 'active', 'เรียงลำดับ if-elif-else ตามช่วงอายุให้ถูกต้อง');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (445, 'ตรวจสอบรูปแบบนามสกุลไฟล์ ชุดที่ 45', 'รับชื่อไฟล์จากอินพุต แล้วประเมินว่าไฟล์ดังกล่าวเป็นไฟล์รูปภาพตระกูล .png หรือ .jpg หรือไม่ หากไม่ใช่ให้ปฏิเสธการอัปโหลด', 'String Audit', 'ประเมินค่าความสอดคล้องของรูปแบบนามสกุลสตริงตอนท้าย', 4, 15, 'active', 'ใช้เมธอด .endswith(''.png'') หรือ .endswith(''.jpg'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (446, 'ระบบคัดกรองเบอร์โทรศัพท์ ชุดที่ 46', 'เขียนโปรแกรมรับอินพุตเบอร์โทรศัพท์ และตรวจสอบว่าความยาวต้องเท่ากับ 10 หลักพอดี และทุกตัวอักษรต้องเป็นตัวเลขเท่านั้น', 'Validation', 'ประเมินค่าความสมบูรณ์และตรวจสอบกฎเกณฑ์ (Validation) ของสายอักขระ', 4, 15, 'active', 'เช็กเงื่อนไขด้วย len(phone) == 10 และ phone.isdigit()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (447, 'ป้องกันข้อผิดพลาดการหาร ชุดที่ 47', 'เขียนโปรแกรมรับตัวเลข 2 ตัวแล้วนำมาหารกัน โดยใช้โครงสร้างป้องกันโปรแกรมพังในกรณีที่ผู้ใช้ป้อนตัวเลขตัวส่วนเป็นเลข 0', 'Exception Handling', 'ประเมินค่าขอบเขตความเสี่ยงของซอฟต์แวร์และดักจับ Exception เชิงลอจิก', 4, 15, 'active', 'ใช้บล็อก try-except ดักจับ ZeroDivisionError');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (448, 'คัดกรองเลขอุณหภูมิผิดปกติ ชุดที่ 48', 'รับลิสต์ของค่าอุณหภูมิห้องมา แล้วประเมินเพื่อลบค่าที่ต่ำกว่า 0 องศา หรือสูงกว่า 50 องศาออกไปเนื่องจากคาดว่าเป็นข้อมูลขยะ', 'Data Filtering', 'ประเมินและคัดกรองข้อมูลแปลกปลอม (Outliers) ออกจากระบบประมวลผล', 4, 15, 'active', 'สร้างลิสต์ใหม่แล้วเก็บเฉพาะตัวเลขที่อยู่ในช่วง 0 ถึง 50');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (449, 'คำนวณตั๋วรถไฟตามอายุ ชุดที่ 49', 'ประเมินราคาตั๋วเดินทางตามเงื่อนไข: อายุต่ำกว่า 10 ปี เรียนฟรี, อายุ 60 ขึ้นไป ลด 50%, นอกเหนือจากนั้น จ่ายราคาเต็ม 100 บาท', 'Advanced Logic', 'ประเมินเกณฑ์การตัดสินใจแบบทับซ้อนและจัดลำดับเงื่อนไขก่อนหลัง', 4, 15, 'active', 'เรียงลำดับ if-elif-else ตามช่วงอายุให้ถูกต้อง');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (450, 'ตรวจสอบรูปแบบนามสกุลไฟล์ ชุดที่ 50', 'รับชื่อไฟล์จากอินพุต แล้วประเมินว่าไฟล์ดังกล่าวเป็นไฟล์รูปภาพตระกูล .png หรือ .jpg หรือไม่ หากไม่ใช่ให้ปฏิเสธการอัปโหลด', 'String Audit', 'ประเมินค่าความสอดคล้องของรูปแบบนามสกุลสตริงตอนท้าย', 4, 15, 'active', 'ใช้เมธอด .endswith(''.png'') หรือ .endswith(''.jpg'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (451, 'ระบบคัดกรองเบอร์โทรศัพท์ ชุดที่ 51', 'เขียนโปรแกรมรับอินพุตเบอร์โทรศัพท์ และตรวจสอบว่าความยาวต้องเท่ากับ 10 หลักพอดี และทุกตัวอักษรต้องเป็นตัวเลขเท่านั้น', 'Validation', 'ประเมินค่าความสมบูรณ์และตรวจสอบกฎเกณฑ์ (Validation) ของสายอักขระ', 4, 15, 'active', 'เช็กเงื่อนไขด้วย len(phone) == 10 และ phone.isdigit()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (452, 'ป้องกันข้อผิดพลาดการหาร ชุดที่ 52', 'เขียนโปรแกรมรับตัวเลข 2 ตัวแล้วนำมาหารกัน โดยใช้โครงสร้างป้องกันโปรแกรมพังในกรณีที่ผู้ใช้ป้อนตัวเลขตัวส่วนเป็นเลข 0', 'Exception Handling', 'ประเมินค่าขอบเขตความเสี่ยงของซอฟต์แวร์และดักจับ Exception เชิงลอจิก', 4, 15, 'active', 'ใช้บล็อก try-except ดักจับ ZeroDivisionError');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (453, 'คัดกรองเลขอุณหภูมิผิดปกติ ชุดที่ 53', 'รับลิสต์ของค่าอุณหภูมิห้องมา แล้วประเมินเพื่อลบค่าที่ต่ำกว่า 0 องศา หรือสูงกว่า 50 องศาออกไปเนื่องจากคาดว่าเป็นข้อมูลขยะ', 'Data Filtering', 'ประเมินและคัดกรองข้อมูลแปลกปลอม (Outliers) ออกจากระบบประมวลผล', 4, 15, 'active', 'สร้างลิสต์ใหม่แล้วเก็บเฉพาะตัวเลขที่อยู่ในช่วง 0 ถึง 50');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (454, 'คำนวณตั๋วรถไฟตามอายุ ชุดที่ 54', 'ประเมินราคาตั๋วเดินทางตามเงื่อนไข: อายุต่ำกว่า 10 ปี เรียนฟรี, อายุ 60 ขึ้นไป ลด 50%, นอกเหนือจากนั้น จ่ายราคาเต็ม 100 บาท', 'Advanced Logic', 'ประเมินเกณฑ์การตัดสินใจแบบทับซ้อนและจัดลำดับเงื่อนไขก่อนหลัง', 4, 15, 'active', 'เรียงลำดับ if-elif-else ตามช่วงอายุให้ถูกต้อง');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (455, 'ตรวจสอบรูปแบบนามสกุลไฟล์ ชุดที่ 55', 'รับชื่อไฟล์จากอินพุต แล้วประเมินว่าไฟล์ดังกล่าวเป็นไฟล์รูปภาพตระกูล .png หรือ .jpg หรือไม่ หากไม่ใช่ให้ปฏิเสธการอัปโหลด', 'String Audit', 'ประเมินค่าความสอดคล้องของรูปแบบนามสกุลสตริงตอนท้าย', 4, 15, 'active', 'ใช้เมธอด .endswith(''.png'') หรือ .endswith(''.jpg'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (456, 'ระบบคัดกรองเบอร์โทรศัพท์ ชุดที่ 56', 'เขียนโปรแกรมรับอินพุตเบอร์โทรศัพท์ และตรวจสอบว่าความยาวต้องเท่ากับ 10 หลักพอดี และทุกตัวอักษรต้องเป็นตัวเลขเท่านั้น', 'Validation', 'ประเมินค่าความสมบูรณ์และตรวจสอบกฎเกณฑ์ (Validation) ของสายอักขระ', 4, 15, 'active', 'เช็กเงื่อนไขด้วย len(phone) == 10 และ phone.isdigit()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (457, 'ป้องกันข้อผิดพลาดการหาร ชุดที่ 57', 'เขียนโปรแกรมรับตัวเลข 2 ตัวแล้วนำมาหารกัน โดยใช้โครงสร้างป้องกันโปรแกรมพังในกรณีที่ผู้ใช้ป้อนตัวเลขตัวส่วนเป็นเลข 0', 'Exception Handling', 'ประเมินค่าขอบเขตความเสี่ยงของซอฟต์แวร์และดักจับ Exception เชิงลอจิก', 4, 15, 'active', 'ใช้บล็อก try-except ดักจับ ZeroDivisionError');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (458, 'คัดกรองเลขอุณหภูมิผิดปกติ ชุดที่ 58', 'รับลิสต์ของค่าอุณหภูมิห้องมา แล้วประเมินเพื่อลบค่าที่ต่ำกว่า 0 องศา หรือสูงกว่า 50 องศาออกไปเนื่องจากคาดว่าเป็นข้อมูลขยะ', 'Data Filtering', 'ประเมินและคัดกรองข้อมูลแปลกปลอม (Outliers) ออกจากระบบประมวลผล', 4, 15, 'active', 'สร้างลิสต์ใหม่แล้วเก็บเฉพาะตัวเลขที่อยู่ในช่วง 0 ถึง 50');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (459, 'คำนวณตั๋วรถไฟตามอายุ ชุดที่ 59', 'ประเมินราคาตั๋วเดินทางตามเงื่อนไข: อายุต่ำกว่า 10 ปี เรียนฟรี, อายุ 60 ขึ้นไป ลด 50%, นอกเหนือจากนั้น จ่ายราคาเต็ม 100 บาท', 'Advanced Logic', 'ประเมินเกณฑ์การตัดสินใจแบบทับซ้อนและจัดลำดับเงื่อนไขก่อนหลัง', 4, 15, 'active', 'เรียงลำดับ if-elif-else ตามช่วงอายุให้ถูกต้อง');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (460, 'ตรวจสอบรูปแบบนามสกุลไฟล์ ชุดที่ 60', 'รับชื่อไฟล์จากอินพุต แล้วประเมินว่าไฟล์ดังกล่าวเป็นไฟล์รูปภาพตระกูล .png หรือ .jpg หรือไม่ หากไม่ใช่ให้ปฏิเสธการอัปโหลด', 'String Audit', 'ประเมินค่าความสอดคล้องของรูปแบบนามสกุลสตริงตอนท้าย', 4, 15, 'active', 'ใช้เมธอด .endswith(''.png'') หรือ .endswith(''.jpg'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (461, 'ระบบคัดกรองเบอร์โทรศัพท์ ชุดที่ 61', 'เขียนโปรแกรมรับอินพุตเบอร์โทรศัพท์ และตรวจสอบว่าความยาวต้องเท่ากับ 10 หลักพอดี และทุกตัวอักษรต้องเป็นตัวเลขเท่านั้น', 'Validation', 'ประเมินค่าความสมบูรณ์และตรวจสอบกฎเกณฑ์ (Validation) ของสายอักขระ', 4, 15, 'active', 'เช็กเงื่อนไขด้วย len(phone) == 10 และ phone.isdigit()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (462, 'ป้องกันข้อผิดพลาดการหาร ชุดที่ 62', 'เขียนโปรแกรมรับตัวเลข 2 ตัวแล้วนำมาหารกัน โดยใช้โครงสร้างป้องกันโปรแกรมพังในกรณีที่ผู้ใช้ป้อนตัวเลขตัวส่วนเป็นเลข 0', 'Exception Handling', 'ประเมินค่าขอบเขตความเสี่ยงของซอฟต์แวร์และดักจับ Exception เชิงลอจิก', 4, 15, 'active', 'ใช้บล็อก try-except ดักจับ ZeroDivisionError');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (463, 'คัดกรองเลขอุณหภูมิผิดปกติ ชุดที่ 63', 'รับลิสต์ของค่าอุณหภูมิห้องมา แล้วประเมินเพื่อลบค่าที่ต่ำกว่า 0 องศา หรือสูงกว่า 50 องศาออกไปเนื่องจากคาดว่าเป็นข้อมูลขยะ', 'Data Filtering', 'ประเมินและคัดกรองข้อมูลแปลกปลอม (Outliers) ออกจากระบบประมวลผล', 4, 15, 'active', 'สร้างลิสต์ใหม่แล้วเก็บเฉพาะตัวเลขที่อยู่ในช่วง 0 ถึง 50');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (464, 'คำนวณตั๋วรถไฟตามอายุ ชุดที่ 64', 'ประเมินราคาตั๋วเดินทางตามเงื่อนไข: อายุต่ำกว่า 10 ปี เรียนฟรี, อายุ 60 ขึ้นไป ลด 50%, นอกเหนือจากนั้น จ่ายราคาเต็ม 100 บาท', 'Advanced Logic', 'ประเมินเกณฑ์การตัดสินใจแบบทับซ้อนและจัดลำดับเงื่อนไขก่อนหลัง', 4, 15, 'active', 'เรียงลำดับ if-elif-else ตามช่วงอายุให้ถูกต้อง');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (465, 'ตรวจสอบรูปแบบนามสกุลไฟล์ ชุดที่ 65', 'รับชื่อไฟล์จากอินพุต แล้วประเมินว่าไฟล์ดังกล่าวเป็นไฟล์รูปภาพตระกูล .png หรือ .jpg หรือไม่ หากไม่ใช่ให้ปฏิเสธการอัปโหลด', 'String Audit', 'ประเมินค่าความสอดคล้องของรูปแบบนามสกุลสตริงตอนท้าย', 4, 15, 'active', 'ใช้เมธอด .endswith(''.png'') หรือ .endswith(''.jpg'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (466, 'ระบบคัดกรองเบอร์โทรศัพท์ ชุดที่ 66', 'เขียนโปรแกรมรับอินพุตเบอร์โทรศัพท์ และตรวจสอบว่าความยาวต้องเท่ากับ 10 หลักพอดี และทุกตัวอักษรต้องเป็นตัวเลขเท่านั้น', 'Validation', 'ประเมินค่าความสมบูรณ์และตรวจสอบกฎเกณฑ์ (Validation) ของสายอักขระ', 4, 15, 'active', 'เช็กเงื่อนไขด้วย len(phone) == 10 และ phone.isdigit()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (467, 'ป้องกันข้อผิดพลาดการหาร ชุดที่ 67', 'เขียนโปรแกรมรับตัวเลข 2 ตัวแล้วนำมาหารกัน โดยใช้โครงสร้างป้องกันโปรแกรมพังในกรณีที่ผู้ใช้ป้อนตัวเลขตัวส่วนเป็นเลข 0', 'Exception Handling', 'ประเมินค่าขอบเขตความเสี่ยงของซอฟต์แวร์และดักจับ Exception เชิงลอจิก', 4, 15, 'active', 'ใช้บล็อก try-except ดักจับ ZeroDivisionError');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (468, 'คัดกรองเลขอุณหภูมิผิดปกติ ชุดที่ 68', 'รับลิสต์ของค่าอุณหภูมิห้องมา แล้วประเมินเพื่อลบค่าที่ต่ำกว่า 0 องศา หรือสูงกว่า 50 องศาออกไปเนื่องจากคาดว่าเป็นข้อมูลขยะ', 'Data Filtering', 'ประเมินและคัดกรองข้อมูลแปลกปลอม (Outliers) ออกจากระบบประมวลผล', 4, 15, 'active', 'สร้างลิสต์ใหม่แล้วเก็บเฉพาะตัวเลขที่อยู่ในช่วง 0 ถึง 50');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (469, 'คำนวณตั๋วรถไฟตามอายุ ชุดที่ 69', 'ประเมินราคาตั๋วเดินทางตามเงื่อนไข: อายุต่ำกว่า 10 ปี เรียนฟรี, อายุ 60 ขึ้นไป ลด 50%, นอกเหนือจากนั้น จ่ายราคาเต็ม 100 บาท', 'Advanced Logic', 'ประเมินเกณฑ์การตัดสินใจแบบทับซ้อนและจัดลำดับเงื่อนไขก่อนหลัง', 4, 15, 'active', 'เรียงลำดับ if-elif-else ตามช่วงอายุให้ถูกต้อง');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (470, 'ตรวจสอบรูปแบบนามสกุลไฟล์ ชุดที่ 70', 'รับชื่อไฟล์จากอินพุต แล้วประเมินว่าไฟล์ดังกล่าวเป็นไฟล์รูปภาพตระกูล .png หรือ .jpg หรือไม่ หากไม่ใช่ให้ปฏิเสธการอัปโหลด', 'String Audit', 'ประเมินค่าความสอดคล้องของรูปแบบนามสกุลสตริงตอนท้าย', 4, 15, 'active', 'ใช้เมธอด .endswith(''.png'') หรือ .endswith(''.jpg'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (471, 'ระบบคัดกรองเบอร์โทรศัพท์ ชุดที่ 71', 'เขียนโปรแกรมรับอินพุตเบอร์โทรศัพท์ และตรวจสอบว่าความยาวต้องเท่ากับ 10 หลักพอดี และทุกตัวอักษรต้องเป็นตัวเลขเท่านั้น', 'Validation', 'ประเมินค่าความสมบูรณ์และตรวจสอบกฎเกณฑ์ (Validation) ของสายอักขระ', 4, 15, 'active', 'เช็กเงื่อนไขด้วย len(phone) == 10 และ phone.isdigit()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (472, 'ป้องกันข้อผิดพลาดการหาร ชุดที่ 72', 'เขียนโปรแกรมรับตัวเลข 2 ตัวแล้วนำมาหารกัน โดยใช้โครงสร้างป้องกันโปรแกรมพังในกรณีที่ผู้ใช้ป้อนตัวเลขตัวส่วนเป็นเลข 0', 'Exception Handling', 'ประเมินค่าขอบเขตความเสี่ยงของซอฟต์แวร์และดักจับ Exception เชิงลอจิก', 4, 15, 'active', 'ใช้บล็อก try-except ดักจับ ZeroDivisionError');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (473, 'คัดกรองเลขอุณหภูมิผิดปกติ ชุดที่ 73', 'รับลิสต์ของค่าอุณหภูมิห้องมา แล้วประเมินเพื่อลบค่าที่ต่ำกว่า 0 องศา หรือสูงกว่า 50 องศาออกไปเนื่องจากคาดว่าเป็นข้อมูลขยะ', 'Data Filtering', 'ประเมินและคัดกรองข้อมูลแปลกปลอม (Outliers) ออกจากระบบประมวลผล', 4, 15, 'active', 'สร้างลิสต์ใหม่แล้วเก็บเฉพาะตัวเลขที่อยู่ในช่วง 0 ถึง 50');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (474, 'คำนวณตั๋วรถไฟตามอายุ ชุดที่ 74', 'ประเมินราคาตั๋วเดินทางตามเงื่อนไข: อายุต่ำกว่า 10 ปี เรียนฟรี, อายุ 60 ขึ้นไป ลด 50%, นอกเหนือจากนั้น จ่ายราคาเต็ม 100 บาท', 'Advanced Logic', 'ประเมินเกณฑ์การตัดสินใจแบบทับซ้อนและจัดลำดับเงื่อนไขก่อนหลัง', 4, 15, 'active', 'เรียงลำดับ if-elif-else ตามช่วงอายุให้ถูกต้อง');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (475, 'ตรวจสอบรูปแบบนามสกุลไฟล์ ชุดที่ 75', 'รับชื่อไฟล์จากอินพุต แล้วประเมินว่าไฟล์ดังกล่าวเป็นไฟล์รูปภาพตระกูล .png หรือ .jpg หรือไม่ หากไม่ใช่ให้ปฏิเสธการอัปโหลด', 'String Audit', 'ประเมินค่าความสอดคล้องของรูปแบบนามสกุลสตริงตอนท้าย', 4, 15, 'active', 'ใช้เมธอด .endswith(''.png'') หรือ .endswith(''.jpg'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (476, 'ระบบคัดกรองเบอร์โทรศัพท์ ชุดที่ 76', 'เขียนโปรแกรมรับอินพุตเบอร์โทรศัพท์ และตรวจสอบว่าความยาวต้องเท่ากับ 10 หลักพอดี และทุกตัวอักษรต้องเป็นตัวเลขเท่านั้น', 'Validation', 'ประเมินค่าความสมบูรณ์และตรวจสอบกฎเกณฑ์ (Validation) ของสายอักขระ', 4, 15, 'active', 'เช็กเงื่อนไขด้วย len(phone) == 10 และ phone.isdigit()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (477, 'ป้องกันข้อผิดพลาดการหาร ชุดที่ 77', 'เขียนโปรแกรมรับตัวเลข 2 ตัวแล้วนำมาหารกัน โดยใช้โครงสร้างป้องกันโปรแกรมพังในกรณีที่ผู้ใช้ป้อนตัวเลขตัวส่วนเป็นเลข 0', 'Exception Handling', 'ประเมินค่าขอบเขตความเสี่ยงของซอฟต์แวร์และดักจับ Exception เชิงลอจิก', 4, 15, 'active', 'ใช้บล็อก try-except ดักจับ ZeroDivisionError');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (478, 'คัดกรองเลขอุณหภูมิผิดปกติ ชุดที่ 78', 'รับลิสต์ของค่าอุณหภูมิห้องมา แล้วประเมินเพื่อลบค่าที่ต่ำกว่า 0 องศา หรือสูงกว่า 50 องศาออกไปเนื่องจากคาดว่าเป็นข้อมูลขยะ', 'Data Filtering', 'ประเมินและคัดกรองข้อมูลแปลกปลอม (Outliers) ออกจากระบบประมวลผล', 4, 15, 'active', 'สร้างลิสต์ใหม่แล้วเก็บเฉพาะตัวเลขที่อยู่ในช่วง 0 ถึง 50');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (479, 'คำนวณตั๋วรถไฟตามอายุ ชุดที่ 79', 'ประเมินราคาตั๋วเดินทางตามเงื่อนไข: อายุต่ำกว่า 10 ปี เรียนฟรี, อายุ 60 ขึ้นไป ลด 50%, นอกเหนือจากนั้น จ่ายราคาเต็ม 100 บาท', 'Advanced Logic', 'ประเมินเกณฑ์การตัดสินใจแบบทับซ้อนและจัดลำดับเงื่อนไขก่อนหลัง', 4, 15, 'active', 'เรียงลำดับ if-elif-else ตามช่วงอายุให้ถูกต้อง');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (480, 'ตรวจสอบรูปแบบนามสกุลไฟล์ ชุดที่ 80', 'รับชื่อไฟล์จากอินพุต แล้วประเมินว่าไฟล์ดังกล่าวเป็นไฟล์รูปภาพตระกูล .png หรือ .jpg หรือไม่ หากไม่ใช่ให้ปฏิเสธการอัปโหลด', 'String Audit', 'ประเมินค่าความสอดคล้องของรูปแบบนามสกุลสตริงตอนท้าย', 4, 15, 'active', 'ใช้เมธอด .endswith(''.png'') หรือ .endswith(''.jpg'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (481, 'ระบบคัดกรองเบอร์โทรศัพท์ ชุดที่ 81', 'เขียนโปรแกรมรับอินพุตเบอร์โทรศัพท์ และตรวจสอบว่าความยาวต้องเท่ากับ 10 หลักพอดี และทุกตัวอักษรต้องเป็นตัวเลขเท่านั้น', 'Validation', 'ประเมินค่าความสมบูรณ์และตรวจสอบกฎเกณฑ์ (Validation) ของสายอักขระ', 4, 15, 'active', 'เช็กเงื่อนไขด้วย len(phone) == 10 และ phone.isdigit()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (482, 'ป้องกันข้อผิดพลาดการหาร ชุดที่ 82', 'เขียนโปรแกรมรับตัวเลข 2 ตัวแล้วนำมาหารกัน โดยใช้โครงสร้างป้องกันโปรแกรมพังในกรณีที่ผู้ใช้ป้อนตัวเลขตัวส่วนเป็นเลข 0', 'Exception Handling', 'ประเมินค่าขอบเขตความเสี่ยงของซอฟต์แวร์และดักจับ Exception เชิงลอจิก', 4, 15, 'active', 'ใช้บล็อก try-except ดักจับ ZeroDivisionError');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (483, 'คัดกรองเลขอุณหภูมิผิดปกติ ชุดที่ 83', 'รับลิสต์ของค่าอุณหภูมิห้องมา แล้วประเมินเพื่อลบค่าที่ต่ำกว่า 0 องศา หรือสูงกว่า 50 องศาออกไปเนื่องจากคาดว่าเป็นข้อมูลขยะ', 'Data Filtering', 'ประเมินและคัดกรองข้อมูลแปลกปลอม (Outliers) ออกจากระบบประมวลผล', 4, 15, 'active', 'สร้างลิสต์ใหม่แล้วเก็บเฉพาะตัวเลขที่อยู่ในช่วง 0 ถึง 50');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (484, 'คำนวณตั๋วรถไฟตามอายุ ชุดที่ 84', 'ประเมินราคาตั๋วเดินทางตามเงื่อนไข: อายุต่ำกว่า 10 ปี เรียนฟรี, อายุ 60 ขึ้นไป ลด 50%, นอกเหนือจากนั้น จ่ายราคาเต็ม 100 บาท', 'Advanced Logic', 'ประเมินเกณฑ์การตัดสินใจแบบทับซ้อนและจัดลำดับเงื่อนไขก่อนหลัง', 4, 15, 'active', 'เรียงลำดับ if-elif-else ตามช่วงอายุให้ถูกต้อง');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (485, 'ตรวจสอบรูปแบบนามสกุลไฟล์ ชุดที่ 85', 'รับชื่อไฟล์จากอินพุต แล้วประเมินว่าไฟล์ดังกล่าวเป็นไฟล์รูปภาพตระกูล .png หรือ .jpg หรือไม่ หากไม่ใช่ให้ปฏิเสธการอัปโหลด', 'String Audit', 'ประเมินค่าความสอดคล้องของรูปแบบนามสกุลสตริงตอนท้าย', 4, 15, 'active', 'ใช้เมธอด .endswith(''.png'') หรือ .endswith(''.jpg'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (486, 'ระบบคัดกรองเบอร์โทรศัพท์ ชุดที่ 86', 'เขียนโปรแกรมรับอินพุตเบอร์โทรศัพท์ และตรวจสอบว่าความยาวต้องเท่ากับ 10 หลักพอดี และทุกตัวอักษรต้องเป็นตัวเลขเท่านั้น', 'Validation', 'ประเมินค่าความสมบูรณ์และตรวจสอบกฎเกณฑ์ (Validation) ของสายอักขระ', 4, 15, 'active', 'เช็กเงื่อนไขด้วย len(phone) == 10 และ phone.isdigit()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (487, 'ป้องกันข้อผิดพลาดการหาร ชุดที่ 87', 'เขียนโปรแกรมรับตัวเลข 2 ตัวแล้วนำมาหารกัน โดยใช้โครงสร้างป้องกันโปรแกรมพังในกรณีที่ผู้ใช้ป้อนตัวเลขตัวส่วนเป็นเลข 0', 'Exception Handling', 'ประเมินค่าขอบเขตความเสี่ยงของซอฟต์แวร์และดักจับ Exception เชิงลอจิก', 4, 15, 'active', 'ใช้บล็อก try-except ดักจับ ZeroDivisionError');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (488, 'คัดกรองเลขอุณหภูมิผิดปกติ ชุดที่ 88', 'รับลิสต์ของค่าอุณหภูมิห้องมา แล้วประเมินเพื่อลบค่าที่ต่ำกว่า 0 องศา หรือสูงกว่า 50 องศาออกไปเนื่องจากคาดว่าเป็นข้อมูลขยะ', 'Data Filtering', 'ประเมินและคัดกรองข้อมูลแปลกปลอม (Outliers) ออกจากระบบประมวลผล', 4, 15, 'active', 'สร้างลิสต์ใหม่แล้วเก็บเฉพาะตัวเลขที่อยู่ในช่วง 0 ถึง 50');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (489, 'คำนวณตั๋วรถไฟตามอายุ ชุดที่ 89', 'ประเมินราคาตั๋วเดินทางตามเงื่อนไข: อายุต่ำกว่า 10 ปี เรียนฟรี, อายุ 60 ขึ้นไป ลด 50%, นอกเหนือจากนั้น จ่ายราคาเต็ม 100 บาท', 'Advanced Logic', 'ประเมินเกณฑ์การตัดสินใจแบบทับซ้อนและจัดลำดับเงื่อนไขก่อนหลัง', 4, 15, 'active', 'เรียงลำดับ if-elif-else ตามช่วงอายุให้ถูกต้อง');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (490, 'ตรวจสอบรูปแบบนามสกุลไฟล์ ชุดที่ 90', 'รับชื่อไฟล์จากอินพุต แล้วประเมินว่าไฟล์ดังกล่าวเป็นไฟล์รูปภาพตระกูล .png หรือ .jpg หรือไม่ หากไม่ใช่ให้ปฏิเสธการอัปโหลด', 'String Audit', 'ประเมินค่าความสอดคล้องของรูปแบบนามสกุลสตริงตอนท้าย', 4, 15, 'active', 'ใช้เมธอด .endswith(''.png'') หรือ .endswith(''.jpg'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (491, 'ระบบคัดกรองเบอร์โทรศัพท์ ชุดที่ 91', 'เขียนโปรแกรมรับอินพุตเบอร์โทรศัพท์ และตรวจสอบว่าความยาวต้องเท่ากับ 10 หลักพอดี และทุกตัวอักษรต้องเป็นตัวเลขเท่านั้น', 'Validation', 'ประเมินค่าความสมบูรณ์และตรวจสอบกฎเกณฑ์ (Validation) ของสายอักขระ', 4, 15, 'active', 'เช็กเงื่อนไขด้วย len(phone) == 10 และ phone.isdigit()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (492, 'ป้องกันข้อผิดพลาดการหาร ชุดที่ 92', 'เขียนโปรแกรมรับตัวเลข 2 ตัวแล้วนำมาหารกัน โดยใช้โครงสร้างป้องกันโปรแกรมพังในกรณีที่ผู้ใช้ป้อนตัวเลขตัวส่วนเป็นเลข 0', 'Exception Handling', 'ประเมินค่าขอบเขตความเสี่ยงของซอฟต์แวร์และดักจับ Exception เชิงลอจิก', 4, 15, 'active', 'ใช้บล็อก try-except ดักจับ ZeroDivisionError');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (493, 'คัดกรองเลขอุณหภูมิผิดปกติ ชุดที่ 93', 'รับลิสต์ของค่าอุณหภูมิห้องมา แล้วประเมินเพื่อลบค่าที่ต่ำกว่า 0 องศา หรือสูงกว่า 50 องศาออกไปเนื่องจากคาดว่าเป็นข้อมูลขยะ', 'Data Filtering', 'ประเมินและคัดกรองข้อมูลแปลกปลอม (Outliers) ออกจากระบบประมวลผล', 4, 15, 'active', 'สร้างลิสต์ใหม่แล้วเก็บเฉพาะตัวเลขที่อยู่ในช่วง 0 ถึง 50');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (494, 'คำนวณตั๋วรถไฟตามอายุ ชุดที่ 94', 'ประเมินราคาตั๋วเดินทางตามเงื่อนไข: อายุต่ำกว่า 10 ปี เรียนฟรี, อายุ 60 ขึ้นไป ลด 50%, นอกเหนือจากนั้น จ่ายราคาเต็ม 100 บาท', 'Advanced Logic', 'ประเมินเกณฑ์การตัดสินใจแบบทับซ้อนและจัดลำดับเงื่อนไขก่อนหลัง', 4, 15, 'active', 'เรียงลำดับ if-elif-else ตามช่วงอายุให้ถูกต้อง');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (495, 'ตรวจสอบรูปแบบนามสกุลไฟล์ ชุดที่ 95', 'รับชื่อไฟล์จากอินพุต แล้วประเมินว่าไฟล์ดังกล่าวเป็นไฟล์รูปภาพตระกูล .png หรือ .jpg หรือไม่ หากไม่ใช่ให้ปฏิเสธการอัปโหลด', 'String Audit', 'ประเมินค่าความสอดคล้องของรูปแบบนามสกุลสตริงตอนท้าย', 4, 15, 'active', 'ใช้เมธอด .endswith(''.png'') หรือ .endswith(''.jpg'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (496, 'ระบบคัดกรองเบอร์โทรศัพท์ ชุดที่ 96', 'เขียนโปรแกรมรับอินพุตเบอร์โทรศัพท์ และตรวจสอบว่าความยาวต้องเท่ากับ 10 หลักพอดี และทุกตัวอักษรต้องเป็นตัวเลขเท่านั้น', 'Validation', 'ประเมินค่าความสมบูรณ์และตรวจสอบกฎเกณฑ์ (Validation) ของสายอักขระ', 4, 15, 'active', 'เช็กเงื่อนไขด้วย len(phone) == 10 และ phone.isdigit()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (497, 'ป้องกันข้อผิดพลาดการหาร ชุดที่ 97', 'เขียนโปรแกรมรับตัวเลข 2 ตัวแล้วนำมาหารกัน โดยใช้โครงสร้างป้องกันโปรแกรมพังในกรณีที่ผู้ใช้ป้อนตัวเลขตัวส่วนเป็นเลข 0', 'Exception Handling', 'ประเมินค่าขอบเขตความเสี่ยงของซอฟต์แวร์และดักจับ Exception เชิงลอจิก', 4, 15, 'active', 'ใช้บล็อก try-except ดักจับ ZeroDivisionError');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (498, 'คัดกรองเลขอุณหภูมิผิดปกติ ชุดที่ 98', 'รับลิสต์ของค่าอุณหภูมิห้องมา แล้วประเมินเพื่อลบค่าที่ต่ำกว่า 0 องศา หรือสูงกว่า 50 องศาออกไปเนื่องจากคาดว่าเป็นข้อมูลขยะ', 'Data Filtering', 'ประเมินและคัดกรองข้อมูลแปลกปลอม (Outliers) ออกจากระบบประมวลผล', 4, 15, 'active', 'สร้างลิสต์ใหม่แล้วเก็บเฉพาะตัวเลขที่อยู่ในช่วง 0 ถึง 50');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (499, 'คำนวณตั๋วรถไฟตามอายุ ชุดที่ 99', 'ประเมินราคาตั๋วเดินทางตามเงื่อนไข: อายุต่ำกว่า 10 ปี เรียนฟรี, อายุ 60 ขึ้นไป ลด 50%, นอกเหนือจากนั้น จ่ายราคาเต็ม 100 บาท', 'Advanced Logic', 'ประเมินเกณฑ์การตัดสินใจแบบทับซ้อนและจัดลำดับเงื่อนไขก่อนหลัง', 4, 15, 'active', 'เรียงลำดับ if-elif-else ตามช่วงอายุให้ถูกต้อง');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (500, 'ตรวจสอบรูปแบบนามสกุลไฟล์ ชุดที่ 100', 'รับชื่อไฟล์จากอินพุต แล้วประเมินว่าไฟล์ดังกล่าวเป็นไฟล์รูปภาพตระกูล .png หรือ .jpg หรือไม่ หากไม่ใช่ให้ปฏิเสธการอัปโหลด', 'String Audit', 'ประเมินค่าความสอดคล้องของรูปแบบนามสกุลสตริงตอนท้าย', 4, 15, 'active', 'ใช้เมธอด .endswith(''.png'') หรือ .endswith(''.jpg'')');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (501, 'ฟังก์ชันหาค่าแฟกทอเรียลซ้ำ', 'สร้างฟังก์ชัน factorial(n) คำนวณหาผลคูณสะสมโดยใช้เทคนิคฟังก์ชันเรียกตัวเอง (Recursion) โดยห้ามใช้ loops วนซ้ำทุกชนิด', 'Algorithm Design', 'คิดค้นและออกแบบขั้นตอนวิธีควบคุมการทำงานแบบเรียกซ้ำ (Recursive Algorithm)', 5, 25, 'active', 'Base case: if n <= 1 return 1 | Recursive case: return n * factorial(n-1)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (502, 'ระบบบัญชีเงินฝากถอนอย่างง่าย ชุดที่ 2', 'ออกแบบและสร้างโปรแกรมเมนูควบคุมยอดเงินในบัญชีธนาคารจำลอง ที่รองรับการฝากเงิน การถอนเงิน (ห้ามถอนเกินยอดคงเหลือ) และเช็กยอดเงิน', 'System Simulation', 'สร้างสรรค์โครงสร้างระบบย่อยจำลองที่มีระบบเก็บสถานะ (State Management) สมบูรณ์', 5, 25, 'active', 'ใช้ while loop ครอบเมนูและตัวแปร balance ด้านนอกเพื่อเก็บสะสมมูลค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (503, 'ระบบสลับตัวอักษรกลับหลัง ชุดที่ 3', 'คิดค้นฟังก์ชันการเข้ารหัสข้อมูลพื้นฐาน โดยรับสตริงเข้ามาแล้วสลับจากตัวสุดท้ายมาตัวแรกสุด พร้อมแปลงเป็นตัวพิมพ์ใหญ่ทั้งหมด', 'Cryptography', 'สร้างสรรค์โมดูลแปลงสตริงเพื่อความปลอดภัยข้อมูลขั้นต้น', 5, 25, 'active', 'ใช้ string[::-1] ร่วมกับเมธอด .upper()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (504, 'หาลำดับเลขฟีโบนัชชีตัวที่ N ชุดที่ 4', 'จงออกแบบและเขียนฟังก์ชัน fibonacci(n) เพื่อส่งกลับค่าตัวเลขในลำดับฟีโบนัชชี ณ ตำแหน่งที่ n ตามกฎคณิตศาสตร์เชิงลึก', 'Custom Math Algorithm', 'สร้างสรรค์อัลกอริทึมคำนวณอนุกรมระดับสูง', 5, 25, 'active', 'เริ่มต้นด้วยการนิยามเงื่อนไข base case ของเลข 0 และ 1 ก่อนประมวลผลคำนวณถัดไป');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (505, 'คูณเมทริกซ์ 2 มิติแมนนวล ชุดที่ 5', 'สร้างฟังก์ชันคูณอาร์เรย์แบบ 2 มิติ (MatriN Multiplication) ขนาด 2N2 สองชุดเข้าด้วยกันด้วยตนเอง โดยห้ามใช้ไลบรารีภายนอกเช่น NumPy', 'Array Transformation', 'สร้างสรรค์ลอจิกประมวลผลข้อมูลโครงสร้างอาเรย์ซับซ้อนเชิงคณิตศาสตร์', 5, 25, 'active', 'ใช้ลูปสามชั้นซ้อนกันเพื่อจัดการผลคูณของแถวและคอลแลมน์แยกแยะตามทฤษฎี');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (506, 'ฟังก์ชันหาค่าแฟกทอเรียลซ้ำ ชุดที่ 6', 'สร้างฟังก์ชัน factorial(n) คำนวณหาผลคูณสะสมโดยใช้เทคนิคฟังก์ชันเรียกตัวเอง (Recursion) โดยห้ามใช้ loops วนซ้ำทุกชนิด', 'Algorithm Design', 'คิดค้นและออกแบบขั้นตอนวิธีควบคุมการทำงานแบบเรียกซ้ำ (Recursive Algorithm)', 5, 25, 'active', 'Base case: if n <= 1 return 1 | Recursive case: return n * factorial(n-1)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (507, 'ระบบบัญชีเงินฝากถอนอย่างง่าย ชุดที่ 7', 'ออกแบบและสร้างโปรแกรมเมนูควบคุมยอดเงินในบัญชีธนาคารจำลอง ที่รองรับการฝากเงิน การถอนเงิน (ห้ามถอนเกินยอดคงเหลือ) และเช็กยอดเงิน', 'System Simulation', 'สร้างสรรค์โครงสร้างระบบย่อยจำลองที่มีระบบเก็บสถานะ (State Management) สมบูรณ์', 5, 25, 'active', 'ใช้ while loop ครอบเมนูและตัวแปร balance ด้านนอกเพื่อเก็บสะสมมูลค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (508, 'ระบบสลับตัวอักษรกลับหลัง ชุดที่ 8', 'คิดค้นฟังก์ชันการเข้ารหัสข้อมูลพื้นฐาน โดยรับสตริงเข้ามาแล้วสลับจากตัวสุดท้ายมาตัวแรกสุด พร้อมแปลงเป็นตัวพิมพ์ใหญ่ทั้งหมด', 'Cryptography', 'สร้างสรรค์โมดูลแปลงสตริงเพื่อความปลอดภัยข้อมูลขั้นต้น', 5, 25, 'active', 'ใช้ string[::-1] ร่วมกับเมธอด .upper()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (509, 'หาลำดับเลขฟีโบนัชชีตัวที่ N ชุดที่ 9', 'จงออกแบบและเขียนฟังก์ชัน fibonacci(n) เพื่อส่งกลับค่าตัวเลขในลำดับฟีโบนัชชี ณ ตำแหน่งที่ n ตามกฎคณิตศาสตร์เชิงลึก', 'Custom Math Algorithm', 'สร้างสรรค์อัลกอริทึมคำนวณอนุกรมระดับสูง', 5, 25, 'active', 'เริ่มต้นด้วยการนิยามเงื่อนไข base case ของเลข 0 และ 1 ก่อนประมวลผลคำนวณถัดไป');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (510, 'คูณเมทริกซ์ 2 มิติแมนนวล ชุดที่ 10', 'สร้างฟังก์ชันคูณอาร์เรย์แบบ 2 มิติ (Matritemp Multiplication) ขนาด 2temp2 สองชุดเข้าด้วยกันด้วยตนเอง โดยห้ามใช้ไลบรารีภายนอกเช่น NumPy', 'Array Transformation', 'สร้างสรรค์ลอจิกประมวลผลข้อมูลโครงสร้างอาเรย์ซับซ้อนเชิงคณิตศาสตร์', 5, 25, 'active', 'ใช้ลูปสามชั้นซ้อนกันเพื่อจัดการผลคูณของแถวและคอลแลมน์แยกแยะตามทฤษฎี');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (511, 'ฟังก์ชันหาค่าแฟกทอเรียลซ้ำ ชุดที่ 11', 'สร้างฟังก์ชัน factorial(n) คำนวณหาผลคูณสะสมโดยใช้เทคนิคฟังก์ชันเรียกตัวเอง (Recursion) โดยห้ามใช้ loops วนซ้ำทุกชนิด', 'Algorithm Design', 'คิดค้นและออกแบบขั้นตอนวิธีควบคุมการทำงานแบบเรียกซ้ำ (Recursive Algorithm)', 5, 25, 'active', 'Base case: if n <= 1 return 1 | Recursive case: return n * factorial(n-1)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (512, 'ระบบบัญชีเงินฝากถอนอย่างง่าย ชุดที่ 12', 'ออกแบบและสร้างโปรแกรมเมนูควบคุมยอดเงินในบัญชีธนาคารจำลอง ที่รองรับการฝากเงิน การถอนเงิน (ห้ามถอนเกินยอดคงเหลือ) และเช็กยอดเงิน', 'System Simulation', 'สร้างสรรค์โครงสร้างระบบย่อยจำลองที่มีระบบเก็บสถานะ (State Management) สมบูรณ์', 5, 25, 'active', 'ใช้ while loop ครอบเมนูและตัวแปร balance ด้านนอกเพื่อเก็บสะสมมูลค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (513, 'ระบบสลับตัวอักษรกลับหลัง ชุดที่ 13', 'คิดค้นฟังก์ชันการเข้ารหัสข้อมูลพื้นฐาน โดยรับสตริงเข้ามาแล้วสลับจากตัวสุดท้ายมาตัวแรกสุด พร้อมแปลงเป็นตัวพิมพ์ใหญ่ทั้งหมด', 'Cryptography', 'สร้างสรรค์โมดูลแปลงสตริงเพื่อความปลอดภัยข้อมูลขั้นต้น', 5, 25, 'active', 'ใช้ string[::-1] ร่วมกับเมธอด .upper()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (514, 'หาลำดับเลขฟีโบนัชชีตัวที่ N ชุดที่ 14', 'จงออกแบบและเขียนฟังก์ชัน fibonacci(n) เพื่อส่งกลับค่าตัวเลขในลำดับฟีโบนัชชี ณ ตำแหน่งที่ n ตามกฎคณิตศาสตร์เชิงลึก', 'Custom Math Algorithm', 'สร้างสรรค์อัลกอริทึมคำนวณอนุกรมระดับสูง', 5, 25, 'active', 'เริ่มต้นด้วยการนิยามเงื่อนไข base case ของเลข 0 และ 1 ก่อนประมวลผลคำนวณถัดไป');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (515, 'คูณเมทริกซ์ 2 มิติแมนนวล ชุดที่ 15', 'สร้างฟังก์ชันคูณอาร์เรย์แบบ 2 มิติ (MatriN Multiplication) ขนาด 2N2 สองชุดเข้าด้วยกันด้วยตนเอง โดยห้ามใช้ไลบรารีภายนอกเช่น NumPy', 'Array Transformation', 'สร้างสรรค์ลอจิกประมวลผลข้อมูลโครงสร้างอาเรย์ซับซ้อนเชิงคณิตศาสตร์', 5, 25, 'active', 'ใช้ลูปสามชั้นซ้อนกันเพื่อจัดการผลคูณของแถวและคอลแลมน์แยกแยะตามทฤษฎี');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (516, 'ฟังก์ชันหาค่าแฟกทอเรียลซ้ำ ชุดที่ 16', 'สร้างฟังก์ชัน factorial(n) คำนวณหาผลคูณสะสมโดยใช้เทคนิคฟังก์ชันเรียกตัวเอง (Recursion) โดยห้ามใช้ loops วนซ้ำทุกชนิด', 'Algorithm Design', 'คิดค้นและออกแบบขั้นตอนวิธีควบคุมการทำงานแบบเรียกซ้ำ (Recursive Algorithm)', 5, 25, 'active', 'Base case: if n <= 1 return 1 | Recursive case: return n * factorial(n-1)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (517, 'ระบบบัญชีเงินฝากถอนอย่างง่าย ชุดที่ 17', 'ออกแบบและสร้างโปรแกรมเมนูควบคุมยอดเงินในบัญชีธนาคารจำลอง ที่รองรับการฝากเงิน การถอนเงิน (ห้ามถอนเกินยอดคงเหลือ) และเช็กยอดเงิน', 'System Simulation', 'สร้างสรรค์โครงสร้างระบบย่อยจำลองที่มีระบบเก็บสถานะ (State Management) สมบูรณ์', 5, 25, 'active', 'ใช้ while loop ครอบเมนูและตัวแปร balance ด้านนอกเพื่อเก็บสะสมมูลค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (518, 'ระบบสลับตัวอักษรกลับหลัง ชุดที่ 18', 'คิดค้นฟังก์ชันการเข้ารหัสข้อมูลพื้นฐาน โดยรับสตริงเข้ามาแล้วสลับจากตัวสุดท้ายมาตัวแรกสุด พร้อมแปลงเป็นตัวพิมพ์ใหญ่ทั้งหมด', 'Cryptography', 'สร้างสรรค์โมดูลแปลงสตริงเพื่อความปลอดภัยข้อมูลขั้นต้น', 5, 25, 'active', 'ใช้ string[::-1] ร่วมกับเมธอด .upper()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (519, 'หาลำดับเลขฟีโบนัชชีตัวที่ N ชุดที่ 19', 'จงออกแบบและเขียนฟังก์ชัน fibonacci(n) เพื่อส่งกลับค่าตัวเลขในลำดับฟีโบนัชชี ณ ตำแหน่งที่ n ตามกฎคณิตศาสตร์เชิงลึก', 'Custom Math Algorithm', 'สร้างสรรค์อัลกอริทึมคำนวณอนุกรมระดับสูง', 5, 25, 'active', 'เริ่มต้นด้วยการนิยามเงื่อนไข base case ของเลข 0 และ 1 ก่อนประมวลผลคำนวณถัดไป');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (520, 'คูณเมทริกซ์ 2 มิติแมนนวล ชุดที่ 20', 'สร้างฟังก์ชันคูณอาร์เรย์แบบ 2 มิติ (Matritemp Multiplication) ขนาด 2temp2 สองชุดเข้าด้วยกันด้วยตนเอง โดยห้ามใช้ไลบรารีภายนอกเช่น NumPy', 'Array Transformation', 'สร้างสรรค์ลอจิกประมวลผลข้อมูลโครงสร้างอาเรย์ซับซ้อนเชิงคณิตศาสตร์', 5, 25, 'active', 'ใช้ลูปสามชั้นซ้อนกันเพื่อจัดการผลคูณของแถวและคอลแลมน์แยกแยะตามทฤษฎี');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (521, 'ฟังก์ชันหาค่าแฟกทอเรียลซ้ำ ชุดที่ 21', 'สร้างฟังก์ชัน factorial(n) คำนวณหาผลคูณสะสมโดยใช้เทคนิคฟังก์ชันเรียกตัวเอง (Recursion) โดยห้ามใช้ loops วนซ้ำทุกชนิด', 'Algorithm Design', 'คิดค้นและออกแบบขั้นตอนวิธีควบคุมการทำงานแบบเรียกซ้ำ (Recursive Algorithm)', 5, 25, 'active', 'Base case: if n <= 1 return 1 | Recursive case: return n * factorial(n-1)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (522, 'ระบบบัญชีเงินฝากถอนอย่างง่าย ชุดที่ 22', 'ออกแบบและสร้างโปรแกรมเมนูควบคุมยอดเงินในบัญชีธนาคารจำลอง ที่รองรับการฝากเงิน การถอนเงิน (ห้ามถอนเกินยอดคงเหลือ) และเช็กยอดเงิน', 'System Simulation', 'สร้างสรรค์โครงสร้างระบบย่อยจำลองที่มีระบบเก็บสถานะ (State Management) สมบูรณ์', 5, 25, 'active', 'ใช้ while loop ครอบเมนูและตัวแปร balance ด้านนอกเพื่อเก็บสะสมมูลค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (523, 'ระบบสลับตัวอักษรกลับหลัง ชุดที่ 23', 'คิดค้นฟังก์ชันการเข้ารหัสข้อมูลพื้นฐาน โดยรับสตริงเข้ามาแล้วสลับจากตัวสุดท้ายมาตัวแรกสุด พร้อมแปลงเป็นตัวพิมพ์ใหญ่ทั้งหมด', 'Cryptography', 'สร้างสรรค์โมดูลแปลงสตริงเพื่อความปลอดภัยข้อมูลขั้นต้น', 5, 25, 'active', 'ใช้ string[::-1] ร่วมกับเมธอด .upper()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (524, 'หาลำดับเลขฟีโบนัชชีตัวที่ N ชุดที่ 24', 'จงออกแบบและเขียนฟังก์ชัน fibonacci(n) เพื่อส่งกลับค่าตัวเลขในลำดับฟีโบนัชชี ณ ตำแหน่งที่ n ตามกฎคณิตศาสตร์เชิงลึก', 'Custom Math Algorithm', 'สร้างสรรค์อัลกอริทึมคำนวณอนุกรมระดับสูง', 5, 25, 'active', 'เริ่มต้นด้วยการนิยามเงื่อนไข base case ของเลข 0 และ 1 ก่อนประมวลผลคำนวณถัดไป');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (525, 'คูณเมทริกซ์ 2 มิติแมนนวล ชุดที่ 25', 'สร้างฟังก์ชันคูณอาร์เรย์แบบ 2 มิติ (MatriN Multiplication) ขนาด 2N2 สองชุดเข้าด้วยกันด้วยตนเอง โดยห้ามใช้ไลบรารีภายนอกเช่น NumPy', 'Array Transformation', 'สร้างสรรค์ลอจิกประมวลผลข้อมูลโครงสร้างอาเรย์ซับซ้อนเชิงคณิตศาสตร์', 5, 25, 'active', 'ใช้ลูปสามชั้นซ้อนกันเพื่อจัดการผลคูณของแถวและคอลแลมน์แยกแยะตามทฤษฎี');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (526, 'ฟังก์ชันหาค่าแฟกทอเรียลซ้ำ ชุดที่ 26', 'สร้างฟังก์ชัน factorial(n) คำนวณหาผลคูณสะสมโดยใช้เทคนิคฟังก์ชันเรียกตัวเอง (Recursion) โดยห้ามใช้ loops วนซ้ำทุกชนิด', 'Algorithm Design', 'คิดค้นและออกแบบขั้นตอนวิธีควบคุมการทำงานแบบเรียกซ้ำ (Recursive Algorithm)', 5, 25, 'active', 'Base case: if n <= 1 return 1 | Recursive case: return n * factorial(n-1)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (527, 'ระบบบัญชีเงินฝากถอนอย่างง่าย ชุดที่ 27', 'ออกแบบและสร้างโปรแกรมเมนูควบคุมยอดเงินในบัญชีธนาคารจำลอง ที่รองรับการฝากเงิน การถอนเงิน (ห้ามถอนเกินยอดคงเหลือ) และเช็กยอดเงิน', 'System Simulation', 'สร้างสรรค์โครงสร้างระบบย่อยจำลองที่มีระบบเก็บสถานะ (State Management) สมบูรณ์', 5, 25, 'active', 'ใช้ while loop ครอบเมนูและตัวแปร balance ด้านนอกเพื่อเก็บสะสมมูลค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (528, 'ระบบสลับตัวอักษรกลับหลัง ชุดที่ 28', 'คิดค้นฟังก์ชันการเข้ารหัสข้อมูลพื้นฐาน โดยรับสตริงเข้ามาแล้วสลับจากตัวสุดท้ายมาตัวแรกสุด พร้อมแปลงเป็นตัวพิมพ์ใหญ่ทั้งหมด', 'Cryptography', 'สร้างสรรค์โมดูลแปลงสตริงเพื่อความปลอดภัยข้อมูลขั้นต้น', 5, 25, 'active', 'ใช้ string[::-1] ร่วมกับเมธอด .upper()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (529, 'หาลำดับเลขฟีโบนัชชีตัวที่ N ชุดที่ 29', 'จงออกแบบและเขียนฟังก์ชัน fibonacci(n) เพื่อส่งกลับค่าตัวเลขในลำดับฟีโบนัชชี ณ ตำแหน่งที่ n ตามกฎคณิตศาสตร์เชิงลึก', 'Custom Math Algorithm', 'สร้างสรรค์อัลกอริทึมคำนวณอนุกรมระดับสูง', 5, 25, 'active', 'เริ่มต้นด้วยการนิยามเงื่อนไข base case ของเลข 0 และ 1 ก่อนประมวลผลคำนวณถัดไป');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (530, 'คูณเมทริกซ์ 2 มิติแมนนวล ชุดที่ 30', 'สร้างฟังก์ชันคูณอาร์เรย์แบบ 2 มิติ (Matritemp Multiplication) ขนาด 2temp2 สองชุดเข้าด้วยกันด้วยตนเอง โดยห้ามใช้ไลบรารีภายนอกเช่น NumPy', 'Array Transformation', 'สร้างสรรค์ลอจิกประมวลผลข้อมูลโครงสร้างอาเรย์ซับซ้อนเชิงคณิตศาสตร์', 5, 25, 'active', 'ใช้ลูปสามชั้นซ้อนกันเพื่อจัดการผลคูณของแถวและคอลแลมน์แยกแยะตามทฤษฎี');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (531, 'ฟังก์ชันหาค่าแฟกทอเรียลซ้ำ ชุดที่ 31', 'สร้างฟังก์ชัน factorial(n) คำนวณหาผลคูณสะสมโดยใช้เทคนิคฟังก์ชันเรียกตัวเอง (Recursion) โดยห้ามใช้ loops วนซ้ำทุกชนิด', 'Algorithm Design', 'คิดค้นและออกแบบขั้นตอนวิธีควบคุมการทำงานแบบเรียกซ้ำ (Recursive Algorithm)', 5, 25, 'active', 'Base case: if n <= 1 return 1 | Recursive case: return n * factorial(n-1)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (532, 'ระบบบัญชีเงินฝากถอนอย่างง่าย ชุดที่ 32', 'ออกแบบและสร้างโปรแกรมเมนูควบคุมยอดเงินในบัญชีธนาคารจำลอง ที่รองรับการฝากเงิน การถอนเงิน (ห้ามถอนเกินยอดคงเหลือ) และเช็กยอดเงิน', 'System Simulation', 'สร้างสรรค์โครงสร้างระบบย่อยจำลองที่มีระบบเก็บสถานะ (State Management) สมบูรณ์', 5, 25, 'active', 'ใช้ while loop ครอบเมนูและตัวแปร balance ด้านนอกเพื่อเก็บสะสมมูลค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (533, 'ระบบสลับตัวอักษรกลับหลัง ชุดที่ 33', 'คิดค้นฟังก์ชันการเข้ารหัสข้อมูลพื้นฐาน โดยรับสตริงเข้ามาแล้วสลับจากตัวสุดท้ายมาตัวแรกสุด พร้อมแปลงเป็นตัวพิมพ์ใหญ่ทั้งหมด', 'Cryptography', 'สร้างสรรค์โมดูลแปลงสตริงเพื่อความปลอดภัยข้อมูลขั้นต้น', 5, 25, 'active', 'ใช้ string[::-1] ร่วมกับเมธอด .upper()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (534, 'หาลำดับเลขฟีโบนัชชีตัวที่ N ชุดที่ 34', 'จงออกแบบและเขียนฟังก์ชัน fibonacci(n) เพื่อส่งกลับค่าตัวเลขในลำดับฟีโบนัชชี ณ ตำแหน่งที่ n ตามกฎคณิตศาสตร์เชิงลึก', 'Custom Math Algorithm', 'สร้างสรรค์อัลกอริทึมคำนวณอนุกรมระดับสูง', 5, 25, 'active', 'เริ่มต้นด้วยการนิยามเงื่อนไข base case ของเลข 0 และ 1 ก่อนประมวลผลคำนวณถัดไป');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (535, 'คูณเมทริกซ์ 2 มิติแมนนวล ชุดที่ 35', 'สร้างฟังก์ชันคูณอาร์เรย์แบบ 2 มิติ (MatriN Multiplication) ขนาด 2N2 สองชุดเข้าด้วยกันด้วยตนเอง โดยห้ามใช้ไลบรารีภายนอกเช่น NumPy', 'Array Transformation', 'สร้างสรรค์ลอจิกประมวลผลข้อมูลโครงสร้างอาเรย์ซับซ้อนเชิงคณิตศาสตร์', 5, 25, 'active', 'ใช้ลูปสามชั้นซ้อนกันเพื่อจัดการผลคูณของแถวและคอลแลมน์แยกแยะตามทฤษฎี');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (536, 'ฟังก์ชันหาค่าแฟกทอเรียลซ้ำ ชุดที่ 36', 'สร้างฟังก์ชัน factorial(n) คำนวณหาผลคูณสะสมโดยใช้เทคนิคฟังก์ชันเรียกตัวเอง (Recursion) โดยห้ามใช้ loops วนซ้ำทุกชนิด', 'Algorithm Design', 'คิดค้นและออกแบบขั้นตอนวิธีควบคุมการทำงานแบบเรียกซ้ำ (Recursive Algorithm)', 5, 25, 'active', 'Base case: if n <= 1 return 1 | Recursive case: return n * factorial(n-1)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (537, 'ระบบบัญชีเงินฝากถอนอย่างง่าย ชุดที่ 37', 'ออกแบบและสร้างโปรแกรมเมนูควบคุมยอดเงินในบัญชีธนาคารจำลอง ที่รองรับการฝากเงิน การถอนเงิน (ห้ามถอนเกินยอดคงเหลือ) และเช็กยอดเงิน', 'System Simulation', 'สร้างสรรค์โครงสร้างระบบย่อยจำลองที่มีระบบเก็บสถานะ (State Management) สมบูรณ์', 5, 25, 'active', 'ใช้ while loop ครอบเมนูและตัวแปร balance ด้านนอกเพื่อเก็บสะสมมูลค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (538, 'ระบบสลับตัวอักษรกลับหลัง ชุดที่ 38', 'คิดค้นฟังก์ชันการเข้ารหัสข้อมูลพื้นฐาน โดยรับสตริงเข้ามาแล้วสลับจากตัวสุดท้ายมาตัวแรกสุด พร้อมแปลงเป็นตัวพิมพ์ใหญ่ทั้งหมด', 'Cryptography', 'สร้างสรรค์โมดูลแปลงสตริงเพื่อความปลอดภัยข้อมูลขั้นต้น', 5, 25, 'active', 'ใช้ string[::-1] ร่วมกับเมธอด .upper()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (539, 'หาลำดับเลขฟีโบนัชชีตัวที่ N ชุดที่ 39', 'จงออกแบบและเขียนฟังก์ชัน fibonacci(n) เพื่อส่งกลับค่าตัวเลขในลำดับฟีโบนัชชี ณ ตำแหน่งที่ n ตามกฎคณิตศาสตร์เชิงลึก', 'Custom Math Algorithm', 'สร้างสรรค์อัลกอริทึมคำนวณอนุกรมระดับสูง', 5, 25, 'active', 'เริ่มต้นด้วยการนิยามเงื่อนไข base case ของเลข 0 และ 1 ก่อนประมวลผลคำนวณถัดไป');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (540, 'คูณเมทริกซ์ 2 มิติแมนนวล ชุดที่ 40', 'สร้างฟังก์ชันคูณอาร์เรย์แบบ 2 มิติ (Matritemp Multiplication) ขนาด 2temp2 สองชุดเข้าด้วยกันด้วยตนเอง โดยห้ามใช้ไลบรารีภายนอกเช่น NumPy', 'Array Transformation', 'สร้างสรรค์ลอจิกประมวลผลข้อมูลโครงสร้างอาเรย์ซับซ้อนเชิงคณิตศาสตร์', 5, 25, 'active', 'ใช้ลูปสามชั้นซ้อนกันเพื่อจัดการผลคูณของแถวและคอลแลมน์แยกแยะตามทฤษฎี');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (541, 'ฟังก์ชันหาค่าแฟกทอเรียลซ้ำ ชุดที่ 41', 'สร้างฟังก์ชัน factorial(n) คำนวณหาผลคูณสะสมโดยใช้เทคนิคฟังก์ชันเรียกตัวเอง (Recursion) โดยห้ามใช้ loops วนซ้ำทุกชนิด', 'Algorithm Design', 'คิดค้นและออกแบบขั้นตอนวิธีควบคุมการทำงานแบบเรียกซ้ำ (Recursive Algorithm)', 5, 25, 'active', 'Base case: if n <= 1 return 1 | Recursive case: return n * factorial(n-1)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (542, 'ระบบบัญชีเงินฝากถอนอย่างง่าย ชุดที่ 42', 'ออกแบบและสร้างโปรแกรมเมนูควบคุมยอดเงินในบัญชีธนาคารจำลอง ที่รองรับการฝากเงิน การถอนเงิน (ห้ามถอนเกินยอดคงเหลือ) และเช็กยอดเงิน', 'System Simulation', 'สร้างสรรค์โครงสร้างระบบย่อยจำลองที่มีระบบเก็บสถานะ (State Management) สมบูรณ์', 5, 25, 'active', 'ใช้ while loop ครอบเมนูและตัวแปร balance ด้านนอกเพื่อเก็บสะสมมูลค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (543, 'ระบบสลับตัวอักษรกลับหลัง ชุดที่ 43', 'คิดค้นฟังก์ชันการเข้ารหัสข้อมูลพื้นฐาน โดยรับสตริงเข้ามาแล้วสลับจากตัวสุดท้ายมาตัวแรกสุด พร้อมแปลงเป็นตัวพิมพ์ใหญ่ทั้งหมด', 'Cryptography', 'สร้างสรรค์โมดูลแปลงสตริงเพื่อความปลอดภัยข้อมูลขั้นต้น', 5, 25, 'active', 'ใช้ string[::-1] ร่วมกับเมธอด .upper()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (544, 'หาลำดับเลขฟีโบนัชชีตัวที่ N ชุดที่ 44', 'จงออกแบบและเขียนฟังก์ชัน fibonacci(n) เพื่อส่งกลับค่าตัวเลขในลำดับฟีโบนัชชี ณ ตำแหน่งที่ n ตามกฎคณิตศาสตร์เชิงลึก', 'Custom Math Algorithm', 'สร้างสรรค์อัลกอริทึมคำนวณอนุกรมระดับสูง', 5, 25, 'active', 'เริ่มต้นด้วยการนิยามเงื่อนไข base case ของเลข 0 และ 1 ก่อนประมวลผลคำนวณถัดไป');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (545, 'คูณเมทริกซ์ 2 มิติแมนนวล ชุดที่ 45', 'สร้างฟังก์ชันคูณอาร์เรย์แบบ 2 มิติ (MatriN Multiplication) ขนาด 2N2 สองชุดเข้าด้วยกันด้วยตนเอง โดยห้ามใช้ไลบรารีภายนอกเช่น NumPy', 'Array Transformation', 'สร้างสรรค์ลอจิกประมวลผลข้อมูลโครงสร้างอาเรย์ซับซ้อนเชิงคณิตศาสตร์', 5, 25, 'active', 'ใช้ลูปสามชั้นซ้อนกันเพื่อจัดการผลคูณของแถวและคอลแลมน์แยกแยะตามทฤษฎี');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (546, 'ฟังก์ชันหาค่าแฟกทอเรียลซ้ำ ชุดที่ 46', 'สร้างฟังก์ชัน factorial(n) คำนวณหาผลคูณสะสมโดยใช้เทคนิคฟังก์ชันเรียกตัวเอง (Recursion) โดยห้ามใช้ loops วนซ้ำทุกชนิด', 'Algorithm Design', 'คิดค้นและออกแบบขั้นตอนวิธีควบคุมการทำงานแบบเรียกซ้ำ (Recursive Algorithm)', 5, 25, 'active', 'Base case: if n <= 1 return 1 | Recursive case: return n * factorial(n-1)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (547, 'ระบบบัญชีเงินฝากถอนอย่างง่าย ชุดที่ 47', 'ออกแบบและสร้างโปรแกรมเมนูควบคุมยอดเงินในบัญชีธนาคารจำลอง ที่รองรับการฝากเงิน การถอนเงิน (ห้ามถอนเกินยอดคงเหลือ) และเช็กยอดเงิน', 'System Simulation', 'สร้างสรรค์โครงสร้างระบบย่อยจำลองที่มีระบบเก็บสถานะ (State Management) สมบูรณ์', 5, 25, 'active', 'ใช้ while loop ครอบเมนูและตัวแปร balance ด้านนอกเพื่อเก็บสะสมมูลค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (548, 'ระบบสลับตัวอักษรกลับหลัง ชุดที่ 48', 'คิดค้นฟังก์ชันการเข้ารหัสข้อมูลพื้นฐาน โดยรับสตริงเข้ามาแล้วสลับจากตัวสุดท้ายมาตัวแรกสุด พร้อมแปลงเป็นตัวพิมพ์ใหญ่ทั้งหมด', 'Cryptography', 'สร้างสรรค์โมดูลแปลงสตริงเพื่อความปลอดภัยข้อมูลขั้นต้น', 5, 25, 'active', 'ใช้ string[::-1] ร่วมกับเมธอด .upper()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (549, 'หาลำดับเลขฟีโบนัชชีตัวที่ N ชุดที่ 49', 'จงออกแบบและเขียนฟังก์ชัน fibonacci(n) เพื่อส่งกลับค่าตัวเลขในลำดับฟีโบนัชชี ณ ตำแหน่งที่ n ตามกฎคณิตศาสตร์เชิงลึก', 'Custom Math Algorithm', 'สร้างสรรค์อัลกอริทึมคำนวณอนุกรมระดับสูง', 5, 25, 'active', 'เริ่มต้นด้วยการนิยามเงื่อนไข base case ของเลข 0 และ 1 ก่อนประมวลผลคำนวณถัดไป');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (550, 'คูณเมทริกซ์ 2 มิติแมนนวล ชุดที่ 50', 'สร้างฟังก์ชันคูณอาร์เรย์แบบ 2 มิติ (Matritemp Multiplication) ขนาด 2temp2 สองชุดเข้าด้วยกันด้วยตนเอง โดยห้ามใช้ไลบรารีภายนอกเช่น NumPy', 'Array Transformation', 'สร้างสรรค์ลอจิกประมวลผลข้อมูลโครงสร้างอาเรย์ซับซ้อนเชิงคณิตศาสตร์', 5, 25, 'active', 'ใช้ลูปสามชั้นซ้อนกันเพื่อจัดการผลคูณของแถวและคอลแลมน์แยกแยะตามทฤษฎี');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (551, 'ฟังก์ชันหาค่าแฟกทอเรียลซ้ำ ชุดที่ 51', 'สร้างฟังก์ชัน factorial(n) คำนวณหาผลคูณสะสมโดยใช้เทคนิคฟังก์ชันเรียกตัวเอง (Recursion) โดยห้ามใช้ loops วนซ้ำทุกชนิด', 'Algorithm Design', 'คิดค้นและออกแบบขั้นตอนวิธีควบคุมการทำงานแบบเรียกซ้ำ (Recursive Algorithm)', 5, 25, 'active', 'Base case: if n <= 1 return 1 | Recursive case: return n * factorial(n-1)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (552, 'ระบบบัญชีเงินฝากถอนอย่างง่าย ชุดที่ 52', 'ออกแบบและสร้างโปรแกรมเมนูควบคุมยอดเงินในบัญชีธนาคารจำลอง ที่รองรับการฝากเงิน การถอนเงิน (ห้ามถอนเกินยอดคงเหลือ) และเช็กยอดเงิน', 'System Simulation', 'สร้างสรรค์โครงสร้างระบบย่อยจำลองที่มีระบบเก็บสถานะ (State Management) สมบูรณ์', 5, 25, 'active', 'ใช้ while loop ครอบเมนูและตัวแปร balance ด้านนอกเพื่อเก็บสะสมมูลค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (553, 'ระบบสลับตัวอักษรกลับหลัง ชุดที่ 53', 'คิดค้นฟังก์ชันการเข้ารหัสข้อมูลพื้นฐาน โดยรับสตริงเข้ามาแล้วสลับจากตัวสุดท้ายมาตัวแรกสุด พร้อมแปลงเป็นตัวพิมพ์ใหญ่ทั้งหมด', 'Cryptography', 'สร้างสรรค์โมดูลแปลงสตริงเพื่อความปลอดภัยข้อมูลขั้นต้น', 5, 25, 'active', 'ใช้ string[::-1] ร่วมกับเมธอด .upper()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (554, 'หาลำดับเลขฟีโบนัชชีตัวที่ N ชุดที่ 54', 'จงออกแบบและเขียนฟังก์ชัน fibonacci(n) เพื่อส่งกลับค่าตัวเลขในลำดับฟีโบนัชชี ณ ตำแหน่งที่ n ตามกฎคณิตศาสตร์เชิงลึก', 'Custom Math Algorithm', 'สร้างสรรค์อัลกอริทึมคำนวณอนุกรมระดับสูง', 5, 25, 'active', 'เริ่มต้นด้วยการนิยามเงื่อนไข base case ของเลข 0 และ 1 ก่อนประมวลผลคำนวณถัดไป');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (555, 'คูณเมทริกซ์ 2 มิติแมนนวล ชุดที่ 55', 'สร้างฟังก์ชันคูณอาร์เรย์แบบ 2 มิติ (MatriN Multiplication) ขนาด 2N2 สองชุดเข้าด้วยกันด้วยตนเอง โดยห้ามใช้ไลบรารีภายนอกเช่น NumPy', 'Array Transformation', 'สร้างสรรค์ลอจิกประมวลผลข้อมูลโครงสร้างอาเรย์ซับซ้อนเชิงคณิตศาสตร์', 5, 25, 'active', 'ใช้ลูปสามชั้นซ้อนกันเพื่อจัดการผลคูณของแถวและคอลแลมน์แยกแยะตามทฤษฎี');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (556, 'ฟังก์ชันหาค่าแฟกทอเรียลซ้ำ ชุดที่ 56', 'สร้างฟังก์ชัน factorial(n) คำนวณหาผลคูณสะสมโดยใช้เทคนิคฟังก์ชันเรียกตัวเอง (Recursion) โดยห้ามใช้ loops วนซ้ำทุกชนิด', 'Algorithm Design', 'คิดค้นและออกแบบขั้นตอนวิธีควบคุมการทำงานแบบเรียกซ้ำ (Recursive Algorithm)', 5, 25, 'active', 'Base case: if n <= 1 return 1 | Recursive case: return n * factorial(n-1)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (557, 'ระบบบัญชีเงินฝากถอนอย่างง่าย ชุดที่ 57', 'ออกแบบและสร้างโปรแกรมเมนูควบคุมยอดเงินในบัญชีธนาคารจำลอง ที่รองรับการฝากเงิน การถอนเงิน (ห้ามถอนเกินยอดคงเหลือ) และเช็กยอดเงิน', 'System Simulation', 'สร้างสรรค์โครงสร้างระบบย่อยจำลองที่มีระบบเก็บสถานะ (State Management) สมบูรณ์', 5, 25, 'active', 'ใช้ while loop ครอบเมนูและตัวแปร balance ด้านนอกเพื่อเก็บสะสมมูลค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (558, 'ระบบสลับตัวอักษรกลับหลัง ชุดที่ 58', 'คิดค้นฟังก์ชันการเข้ารหัสข้อมูลพื้นฐาน โดยรับสตริงเข้ามาแล้วสลับจากตัวสุดท้ายมาตัวแรกสุด พร้อมแปลงเป็นตัวพิมพ์ใหญ่ทั้งหมด', 'Cryptography', 'สร้างสรรค์โมดูลแปลงสตริงเพื่อความปลอดภัยข้อมูลขั้นต้น', 5, 25, 'active', 'ใช้ string[::-1] ร่วมกับเมธอด .upper()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (559, 'หาลำดับเลขฟีโบนัชชีตัวที่ N ชุดที่ 59', 'จงออกแบบและเขียนฟังก์ชัน fibonacci(n) เพื่อส่งกลับค่าตัวเลขในลำดับฟีโบนัชชี ณ ตำแหน่งที่ n ตามกฎคณิตศาสตร์เชิงลึก', 'Custom Math Algorithm', 'สร้างสรรค์อัลกอริทึมคำนวณอนุกรมระดับสูง', 5, 25, 'active', 'เริ่มต้นด้วยการนิยามเงื่อนไข base case ของเลข 0 และ 1 ก่อนประมวลผลคำนวณถัดไป');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (560, 'คูณเมทริกซ์ 2 มิติแมนนวล ชุดที่ 60', 'สร้างฟังก์ชันคูณอาร์เรย์แบบ 2 มิติ (Matritemp Multiplication) ขนาด 2temp2 สองชุดเข้าด้วยกันด้วยตนเอง โดยห้ามใช้ไลบรารีภายนอกเช่น NumPy', 'Array Transformation', 'สร้างสรรค์ลอจิกประมวลผลข้อมูลโครงสร้างอาเรย์ซับซ้อนเชิงคณิตศาสตร์', 5, 25, 'active', 'ใช้ลูปสามชั้นซ้อนกันเพื่อจัดการผลคูณของแถวและคอลแลมน์แยกแยะตามทฤษฎี');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (561, 'ฟังก์ชันหาค่าแฟกทอเรียลซ้ำ ชุดที่ 61', 'สร้างฟังก์ชัน factorial(n) คำนวณหาผลคูณสะสมโดยใช้เทคนิคฟังก์ชันเรียกตัวเอง (Recursion) โดยห้ามใช้ loops วนซ้ำทุกชนิด', 'Algorithm Design', 'คิดค้นและออกแบบขั้นตอนวิธีควบคุมการทำงานแบบเรียกซ้ำ (Recursive Algorithm)', 5, 25, 'active', 'Base case: if n <= 1 return 1 | Recursive case: return n * factorial(n-1)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (562, 'ระบบบัญชีเงินฝากถอนอย่างง่าย ชุดที่ 62', 'ออกแบบและสร้างโปรแกรมเมนูควบคุมยอดเงินในบัญชีธนาคารจำลอง ที่รองรับการฝากเงิน การถอนเงิน (ห้ามถอนเกินยอดคงเหลือ) และเช็กยอดเงิน', 'System Simulation', 'สร้างสรรค์โครงสร้างระบบย่อยจำลองที่มีระบบเก็บสถานะ (State Management) สมบูรณ์', 5, 25, 'active', 'ใช้ while loop ครอบเมนูและตัวแปร balance ด้านนอกเพื่อเก็บสะสมมูลค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (563, 'ระบบสลับตัวอักษรกลับหลัง ชุดที่ 63', 'คิดค้นฟังก์ชันการเข้ารหัสข้อมูลพื้นฐาน โดยรับสตริงเข้ามาแล้วสลับจากตัวสุดท้ายมาตัวแรกสุด พร้อมแปลงเป็นตัวพิมพ์ใหญ่ทั้งหมด', 'Cryptography', 'สร้างสรรค์โมดูลแปลงสตริงเพื่อความปลอดภัยข้อมูลขั้นต้น', 5, 25, 'active', 'ใช้ string[::-1] ร่วมกับเมธอด .upper()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (564, 'หาลำดับเลขฟีโบนัชชีตัวที่ N ชุดที่ 64', 'จงออกแบบและเขียนฟังก์ชัน fibonacci(n) เพื่อส่งกลับค่าตัวเลขในลำดับฟีโบนัชชี ณ ตำแหน่งที่ n ตามกฎคณิตศาสตร์เชิงลึก', 'Custom Math Algorithm', 'สร้างสรรค์อัลกอริทึมคำนวณอนุกรมระดับสูง', 5, 25, 'active', 'เริ่มต้นด้วยการนิยามเงื่อนไข base case ของเลข 0 และ 1 ก่อนประมวลผลคำนวณถัดไป');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (565, 'คูณเมทริกซ์ 2 มิติแมนนวล ชุดที่ 65', 'สร้างฟังก์ชันคูณอาร์เรย์แบบ 2 มิติ (MatriN Multiplication) ขนาด 2N2 สองชุดเข้าด้วยกันด้วยตนเอง โดยห้ามใช้ไลบรารีภายนอกเช่น NumPy', 'Array Transformation', 'สร้างสรรค์ลอจิกประมวลผลข้อมูลโครงสร้างอาเรย์ซับซ้อนเชิงคณิตศาสตร์', 5, 25, 'active', 'ใช้ลูปสามชั้นซ้อนกันเพื่อจัดการผลคูณของแถวและคอลแลมน์แยกแยะตามทฤษฎี');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (566, 'ฟังก์ชันหาค่าแฟกทอเรียลซ้ำ ชุดที่ 66', 'สร้างฟังก์ชัน factorial(n) คำนวณหาผลคูณสะสมโดยใช้เทคนิคฟังก์ชันเรียกตัวเอง (Recursion) โดยห้ามใช้ loops วนซ้ำทุกชนิด', 'Algorithm Design', 'คิดค้นและออกแบบขั้นตอนวิธีควบคุมการทำงานแบบเรียกซ้ำ (Recursive Algorithm)', 5, 25, 'active', 'Base case: if n <= 1 return 1 | Recursive case: return n * factorial(n-1)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (567, 'ระบบบัญชีเงินฝากถอนอย่างง่าย ชุดที่ 67', 'ออกแบบและสร้างโปรแกรมเมนูควบคุมยอดเงินในบัญชีธนาคารจำลอง ที่รองรับการฝากเงิน การถอนเงิน (ห้ามถอนเกินยอดคงเหลือ) และเช็กยอดเงิน', 'System Simulation', 'สร้างสรรค์โครงสร้างระบบย่อยจำลองที่มีระบบเก็บสถานะ (State Management) สมบูรณ์', 5, 25, 'active', 'ใช้ while loop ครอบเมนูและตัวแปร balance ด้านนอกเพื่อเก็บสะสมมูลค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (568, 'ระบบสลับตัวอักษรกลับหลัง ชุดที่ 68', 'คิดค้นฟังก์ชันการเข้ารหัสข้อมูลพื้นฐาน โดยรับสตริงเข้ามาแล้วสลับจากตัวสุดท้ายมาตัวแรกสุด พร้อมแปลงเป็นตัวพิมพ์ใหญ่ทั้งหมด', 'Cryptography', 'สร้างสรรค์โมดูลแปลงสตริงเพื่อความปลอดภัยข้อมูลขั้นต้น', 5, 25, 'active', 'ใช้ string[::-1] ร่วมกับเมธอด .upper()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (569, 'หาลำดับเลขฟีโบนัชชีตัวที่ N ชุดที่ 69', 'จงออกแบบและเขียนฟังก์ชัน fibonacci(n) เพื่อส่งกลับค่าตัวเลขในลำดับฟีโบนัชชี ณ ตำแหน่งที่ n ตามกฎคณิตศาสตร์เชิงลึก', 'Custom Math Algorithm', 'สร้างสรรค์อัลกอริทึมคำนวณอนุกรมระดับสูง', 5, 25, 'active', 'เริ่มต้นด้วยการนิยามเงื่อนไข base case ของเลข 0 และ 1 ก่อนประมวลผลคำนวณถัดไป');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (570, 'คูณเมทริกซ์ 2 มิติแมนนวล ชุดที่ 70', 'สร้างฟังก์ชันคูณอาร์เรย์แบบ 2 มิติ (Matritemp Multiplication) ขนาด 2temp2 สองชุดเข้าด้วยกันด้วยตนเอง โดยห้ามใช้ไลบรารีภายนอกเช่น NumPy', 'Array Transformation', 'สร้างสรรค์ลอจิกประมวลผลข้อมูลโครงสร้างอาเรย์ซับซ้อนเชิงคณิตศาสตร์', 5, 25, 'active', 'ใช้ลูปสามชั้นซ้อนกันเพื่อจัดการผลคูณของแถวและคอลแลมน์แยกแยะตามทฤษฎี');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (571, 'ฟังก์ชันหาค่าแฟกทอเรียลซ้ำ ชุดที่ 71', 'สร้างฟังก์ชัน factorial(n) คำนวณหาผลคูณสะสมโดยใช้เทคนิคฟังก์ชันเรียกตัวเอง (Recursion) โดยห้ามใช้ loops วนซ้ำทุกชนิด', 'Algorithm Design', 'คิดค้นและออกแบบขั้นตอนวิธีควบคุมการทำงานแบบเรียกซ้ำ (Recursive Algorithm)', 5, 25, 'active', 'Base case: if n <= 1 return 1 | Recursive case: return n * factorial(n-1)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (572, 'ระบบบัญชีเงินฝากถอนอย่างง่าย ชุดที่ 72', 'ออกแบบและสร้างโปรแกรมเมนูควบคุมยอดเงินในบัญชีธนาคารจำลอง ที่รองรับการฝากเงิน การถอนเงิน (ห้ามถอนเกินยอดคงเหลือ) และเช็กยอดเงิน', 'System Simulation', 'สร้างสรรค์โครงสร้างระบบย่อยจำลองที่มีระบบเก็บสถานะ (State Management) สมบูรณ์', 5, 25, 'active', 'ใช้ while loop ครอบเมนูและตัวแปร balance ด้านนอกเพื่อเก็บสะสมมูลค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (573, 'ระบบสลับตัวอักษรกลับหลัง ชุดที่ 73', 'คิดค้นฟังก์ชันการเข้ารหัสข้อมูลพื้นฐาน โดยรับสตริงเข้ามาแล้วสลับจากตัวสุดท้ายมาตัวแรกสุด พร้อมแปลงเป็นตัวพิมพ์ใหญ่ทั้งหมด', 'Cryptography', 'สร้างสรรค์โมดูลแปลงสตริงเพื่อความปลอดภัยข้อมูลขั้นต้น', 5, 25, 'active', 'ใช้ string[::-1] ร่วมกับเมธอด .upper()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (574, 'หาลำดับเลขฟีโบนัชชีตัวที่ N ชุดที่ 74', 'จงออกแบบและเขียนฟังก์ชัน fibonacci(n) เพื่อส่งกลับค่าตัวเลขในลำดับฟีโบนัชชี ณ ตำแหน่งที่ n ตามกฎคณิตศาสตร์เชิงลึก', 'Custom Math Algorithm', 'สร้างสรรค์อัลกอริทึมคำนวณอนุกรมระดับสูง', 5, 25, 'active', 'เริ่มต้นด้วยการนิยามเงื่อนไข base case ของเลข 0 และ 1 ก่อนประมวลผลคำนวณถัดไป');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (575, 'คูณเมทริกซ์ 2 มิติแมนนวล ชุดที่ 75', 'สร้างฟังก์ชันคูณอาร์เรย์แบบ 2 มิติ (MatriN Multiplication) ขนาด 2N2 สองชุดเข้าด้วยกันด้วยตนเอง โดยห้ามใช้ไลบรารีภายนอกเช่น NumPy', 'Array Transformation', 'สร้างสรรค์ลอจิกประมวลผลข้อมูลโครงสร้างอาเรย์ซับซ้อนเชิงคณิตศาสตร์', 5, 25, 'active', 'ใช้ลูปสามชั้นซ้อนกันเพื่อจัดการผลคูณของแถวและคอลแลมน์แยกแยะตามทฤษฎี');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (576, 'ฟังก์ชันหาค่าแฟกทอเรียลซ้ำ ชุดที่ 76', 'สร้างฟังก์ชัน factorial(n) คำนวณหาผลคูณสะสมโดยใช้เทคนิคฟังก์ชันเรียกตัวเอง (Recursion) โดยห้ามใช้ loops วนซ้ำทุกชนิด', 'Algorithm Design', 'คิดค้นและออกแบบขั้นตอนวิธีควบคุมการทำงานแบบเรียกซ้ำ (Recursive Algorithm)', 5, 25, 'active', 'Base case: if n <= 1 return 1 | Recursive case: return n * factorial(n-1)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (577, 'ระบบบัญชีเงินฝากถอนอย่างง่าย ชุดที่ 77', 'ออกแบบและสร้างโปรแกรมเมนูควบคุมยอดเงินในบัญชีธนาคารจำลอง ที่รองรับการฝากเงิน การถอนเงิน (ห้ามถอนเกินยอดคงเหลือ) และเช็กยอดเงิน', 'System Simulation', 'สร้างสรรค์โครงสร้างระบบย่อยจำลองที่มีระบบเก็บสถานะ (State Management) สมบูรณ์', 5, 25, 'active', 'ใช้ while loop ครอบเมนูและตัวแปร balance ด้านนอกเพื่อเก็บสะสมมูลค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (578, 'ระบบสลับตัวอักษรกลับหลัง ชุดที่ 78', 'คิดค้นฟังก์ชันการเข้ารหัสข้อมูลพื้นฐาน โดยรับสตริงเข้ามาแล้วสลับจากตัวสุดท้ายมาตัวแรกสุด พร้อมแปลงเป็นตัวพิมพ์ใหญ่ทั้งหมด', 'Cryptography', 'สร้างสรรค์โมดูลแปลงสตริงเพื่อความปลอดภัยข้อมูลขั้นต้น', 5, 25, 'active', 'ใช้ string[::-1] ร่วมกับเมธอด .upper()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (579, 'หาลำดับเลขฟีโบนัชชีตัวที่ N ชุดที่ 79', 'จงออกแบบและเขียนฟังก์ชัน fibonacci(n) เพื่อส่งกลับค่าตัวเลขในลำดับฟีโบนัชชี ณ ตำแหน่งที่ n ตามกฎคณิตศาสตร์เชิงลึก', 'Custom Math Algorithm', 'สร้างสรรค์อัลกอริทึมคำนวณอนุกรมระดับสูง', 5, 25, 'active', 'เริ่มต้นด้วยการนิยามเงื่อนไข base case ของเลข 0 และ 1 ก่อนประมวลผลคำนวณถัดไป');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (580, 'คูณเมทริกซ์ 2 มิติแมนนวล ชุดที่ 80', 'สร้างฟังก์ชันคูณอาร์เรย์แบบ 2 มิติ (Matritemp Multiplication) ขนาด 2temp2 สองชุดเข้าด้วยกันด้วยตนเอง โดยห้ามใช้ไลบรารีภายนอกเช่น NumPy', 'Array Transformation', 'สร้างสรรค์ลอจิกประมวลผลข้อมูลโครงสร้างอาเรย์ซับซ้อนเชิงคณิตศาสตร์', 5, 25, 'active', 'ใช้ลูปสามชั้นซ้อนกันเพื่อจัดการผลคูณของแถวและคอลแลมน์แยกแยะตามทฤษฎี');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (581, 'ฟังก์ชันหาค่าแฟกทอเรียลซ้ำ ชุดที่ 81', 'สร้างฟังก์ชัน factorial(n) คำนวณหาผลคูณสะสมโดยใช้เทคนิคฟังก์ชันเรียกตัวเอง (Recursion) โดยห้ามใช้ loops วนซ้ำทุกชนิด', 'Algorithm Design', 'คิดค้นและออกแบบขั้นตอนวิธีควบคุมการทำงานแบบเรียกซ้ำ (Recursive Algorithm)', 5, 25, 'active', 'Base case: if n <= 1 return 1 | Recursive case: return n * factorial(n-1)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (582, 'ระบบบัญชีเงินฝากถอนอย่างง่าย ชุดที่ 82', 'ออกแบบและสร้างโปรแกรมเมนูควบคุมยอดเงินในบัญชีธนาคารจำลอง ที่รองรับการฝากเงิน การถอนเงิน (ห้ามถอนเกินยอดคงเหลือ) และเช็กยอดเงิน', 'System Simulation', 'สร้างสรรค์โครงสร้างระบบย่อยจำลองที่มีระบบเก็บสถานะ (State Management) สมบูรณ์', 5, 25, 'active', 'ใช้ while loop ครอบเมนูและตัวแปร balance ด้านนอกเพื่อเก็บสะสมมูลค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (583, 'ระบบสลับตัวอักษรกลับหลัง ชุดที่ 83', 'คิดค้นฟังก์ชันการเข้ารหัสข้อมูลพื้นฐาน โดยรับสตริงเข้ามาแล้วสลับจากตัวสุดท้ายมาตัวแรกสุด พร้อมแปลงเป็นตัวพิมพ์ใหญ่ทั้งหมด', 'Cryptography', 'สร้างสรรค์โมดูลแปลงสตริงเพื่อความปลอดภัยข้อมูลขั้นต้น', 5, 25, 'active', 'ใช้ string[::-1] ร่วมกับเมธอด .upper()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (584, 'หาลำดับเลขฟีโบนัชชีตัวที่ N ชุดที่ 84', 'จงออกแบบและเขียนฟังก์ชัน fibonacci(n) เพื่อส่งกลับค่าตัวเลขในลำดับฟีโบนัชชี ณ ตำแหน่งที่ n ตามกฎคณิตศาสตร์เชิงลึก', 'Custom Math Algorithm', 'สร้างสรรค์อัลกอริทึมคำนวณอนุกรมระดับสูง', 5, 25, 'active', 'เริ่มต้นด้วยการนิยามเงื่อนไข base case ของเลข 0 และ 1 ก่อนประมวลผลคำนวณถัดไป');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (585, 'คูณเมทริกซ์ 2 มิติแมนนวล ชุดที่ 85', 'สร้างฟังก์ชันคูณอาร์เรย์แบบ 2 มิติ (MatriN Multiplication) ขนาด 2N2 สองชุดเข้าด้วยกันด้วยตนเอง โดยห้ามใช้ไลบรารีภายนอกเช่น NumPy', 'Array Transformation', 'สร้างสรรค์ลอจิกประมวลผลข้อมูลโครงสร้างอาเรย์ซับซ้อนเชิงคณิตศาสตร์', 5, 25, 'active', 'ใช้ลูปสามชั้นซ้อนกันเพื่อจัดการผลคูณของแถวและคอลแลมน์แยกแยะตามทฤษฎี');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (586, 'ฟังก์ชันหาค่าแฟกทอเรียลซ้ำ ชุดที่ 86', 'สร้างฟังก์ชัน factorial(n) คำนวณหาผลคูณสะสมโดยใช้เทคนิคฟังก์ชันเรียกตัวเอง (Recursion) โดยห้ามใช้ loops วนซ้ำทุกชนิด', 'Algorithm Design', 'คิดค้นและออกแบบขั้นตอนวิธีควบคุมการทำงานแบบเรียกซ้ำ (Recursive Algorithm)', 5, 25, 'active', 'Base case: if n <= 1 return 1 | Recursive case: return n * factorial(n-1)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (587, 'ระบบบัญชีเงินฝากถอนอย่างง่าย ชุดที่ 87', 'ออกแบบและสร้างโปรแกรมเมนูควบคุมยอดเงินในบัญชีธนาคารจำลอง ที่รองรับการฝากเงิน การถอนเงิน (ห้ามถอนเกินยอดคงเหลือ) และเช็กยอดเงิน', 'System Simulation', 'สร้างสรรค์โครงสร้างระบบย่อยจำลองที่มีระบบเก็บสถานะ (State Management) สมบูรณ์', 5, 25, 'active', 'ใช้ while loop ครอบเมนูและตัวแปร balance ด้านนอกเพื่อเก็บสะสมมูลค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (588, 'ระบบสลับตัวอักษรกลับหลัง ชุดที่ 88', 'คิดค้นฟังก์ชันการเข้ารหัสข้อมูลพื้นฐาน โดยรับสตริงเข้ามาแล้วสลับจากตัวสุดท้ายมาตัวแรกสุด พร้อมแปลงเป็นตัวพิมพ์ใหญ่ทั้งหมด', 'Cryptography', 'สร้างสรรค์โมดูลแปลงสตริงเพื่อความปลอดภัยข้อมูลขั้นต้น', 5, 25, 'active', 'ใช้ string[::-1] ร่วมกับเมธอด .upper()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (589, 'หาลำดับเลขฟีโบนัชชีตัวที่ N ชุดที่ 89', 'จงออกแบบและเขียนฟังก์ชัน fibonacci(n) เพื่อส่งกลับค่าตัวเลขในลำดับฟีโบนัชชี ณ ตำแหน่งที่ n ตามกฎคณิตศาสตร์เชิงลึก', 'Custom Math Algorithm', 'สร้างสรรค์อัลกอริทึมคำนวณอนุกรมระดับสูง', 5, 25, 'active', 'เริ่มต้นด้วยการนิยามเงื่อนไข base case ของเลข 0 และ 1 ก่อนประมวลผลคำนวณถัดไป');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (590, 'คูณเมทริกซ์ 2 มิติแมนนวล ชุดที่ 90', 'สร้างฟังก์ชันคูณอาร์เรย์แบบ 2 มิติ (Matritemp Multiplication) ขนาด 2temp2 สองชุดเข้าด้วยกันด้วยตนเอง โดยห้ามใช้ไลบรารีภายนอกเช่น NumPy', 'Array Transformation', 'สร้างสรรค์ลอจิกประมวลผลข้อมูลโครงสร้างอาเรย์ซับซ้อนเชิงคณิตศาสตร์', 5, 25, 'active', 'ใช้ลูปสามชั้นซ้อนกันเพื่อจัดการผลคูณของแถวและคอลแลมน์แยกแยะตามทฤษฎี');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (591, 'ฟังก์ชันหาค่าแฟกทอเรียลซ้ำ ชุดที่ 91', 'สร้างฟังก์ชัน factorial(n) คำนวณหาผลคูณสะสมโดยใช้เทคนิคฟังก์ชันเรียกตัวเอง (Recursion) โดยห้ามใช้ loops วนซ้ำทุกชนิด', 'Algorithm Design', 'คิดค้นและออกแบบขั้นตอนวิธีควบคุมการทำงานแบบเรียกซ้ำ (Recursive Algorithm)', 5, 25, 'active', 'Base case: if n <= 1 return 1 | Recursive case: return n * factorial(n-1)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (592, 'ระบบบัญชีเงินฝากถอนอย่างง่าย ชุดที่ 92', 'ออกแบบและสร้างโปรแกรมเมนูควบคุมยอดเงินในบัญชีธนาคารจำลอง ที่รองรับการฝากเงิน การถอนเงิน (ห้ามถอนเกินยอดคงเหลือ) และเช็กยอดเงิน', 'System Simulation', 'สร้างสรรค์โครงสร้างระบบย่อยจำลองที่มีระบบเก็บสถานะ (State Management) สมบูรณ์', 5, 25, 'active', 'ใช้ while loop ครอบเมนูและตัวแปร balance ด้านนอกเพื่อเก็บสะสมมูลค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (593, 'ระบบสลับตัวอักษรกลับหลัง ชุดที่ 93', 'คิดค้นฟังก์ชันการเข้ารหัสข้อมูลพื้นฐาน โดยรับสตริงเข้ามาแล้วสลับจากตัวสุดท้ายมาตัวแรกสุด พร้อมแปลงเป็นตัวพิมพ์ใหญ่ทั้งหมด', 'Cryptography', 'สร้างสรรค์โมดูลแปลงสตริงเพื่อความปลอดภัยข้อมูลขั้นต้น', 5, 25, 'active', 'ใช้ string[::-1] ร่วมกับเมธอด .upper()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (594, 'หาลำดับเลขฟีโบนัชชีตัวที่ N ชุดที่ 94', 'จงออกแบบและเขียนฟังก์ชัน fibonacci(n) เพื่อส่งกลับค่าตัวเลขในลำดับฟีโบนัชชี ณ ตำแหน่งที่ n ตามกฎคณิตศาสตร์เชิงลึก', 'Custom Math Algorithm', 'สร้างสรรค์อัลกอริทึมคำนวณอนุกรมระดับสูง', 5, 25, 'active', 'เริ่มต้นด้วยการนิยามเงื่อนไข base case ของเลข 0 และ 1 ก่อนประมวลผลคำนวณถัดไป');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (595, 'คูณเมทริกซ์ 2 มิติแมนนวล ชุดที่ 95', 'สร้างฟังก์ชันคูณอาร์เรย์แบบ 2 มิติ (MatriN Multiplication) ขนาด 2N2 สองชุดเข้าด้วยกันด้วยตนเอง โดยห้ามใช้ไลบรารีภายนอกเช่น NumPy', 'Array Transformation', 'สร้างสรรค์ลอจิกประมวลผลข้อมูลโครงสร้างอาเรย์ซับซ้อนเชิงคณิตศาสตร์', 5, 25, 'active', 'ใช้ลูปสามชั้นซ้อนกันเพื่อจัดการผลคูณของแถวและคอลแลมน์แยกแยะตามทฤษฎี');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (596, 'ฟังก์ชันหาค่าแฟกทอเรียลซ้ำ ชุดที่ 96', 'สร้างฟังก์ชัน factorial(n) คำนวณหาผลคูณสะสมโดยใช้เทคนิคฟังก์ชันเรียกตัวเอง (Recursion) โดยห้ามใช้ loops วนซ้ำทุกชนิด', 'Algorithm Design', 'คิดค้นและออกแบบขั้นตอนวิธีควบคุมการทำงานแบบเรียกซ้ำ (Recursive Algorithm)', 5, 25, 'active', 'Base case: if n <= 1 return 1 | Recursive case: return n * factorial(n-1)');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (597, 'ระบบบัญชีเงินฝากถอนอย่างง่าย ชุดที่ 97', 'ออกแบบและสร้างโปรแกรมเมนูควบคุมยอดเงินในบัญชีธนาคารจำลอง ที่รองรับการฝากเงิน การถอนเงิน (ห้ามถอนเกินยอดคงเหลือ) และเช็กยอดเงิน', 'System Simulation', 'สร้างสรรค์โครงสร้างระบบย่อยจำลองที่มีระบบเก็บสถานะ (State Management) สมบูรณ์', 5, 25, 'active', 'ใช้ while loop ครอบเมนูและตัวแปร balance ด้านนอกเพื่อเก็บสะสมมูลค่า');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (598, 'ระบบสลับตัวอักษรกลับหลัง ชุดที่ 98', 'คิดค้นฟังก์ชันการเข้ารหัสข้อมูลพื้นฐาน โดยรับสตริงเข้ามาแล้วสลับจากตัวสุดท้ายมาตัวแรกสุด พร้อมแปลงเป็นตัวพิมพ์ใหญ่ทั้งหมด', 'Cryptography', 'สร้างสรรค์โมดูลแปลงสตริงเพื่อความปลอดภัยข้อมูลขั้นต้น', 5, 25, 'active', 'ใช้ string[::-1] ร่วมกับเมธอด .upper()');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (599, 'หาลำดับเลขฟีโบนัชชีตัวที่ N ชุดที่ 99', 'จงออกแบบและเขียนฟังก์ชัน fibonacci(n) เพื่อส่งกลับค่าตัวเลขในลำดับฟีโบนัชชี ณ ตำแหน่งที่ n ตามกฎคณิตศาสตร์เชิงลึก', 'Custom Math Algorithm', 'สร้างสรรค์อัลกอริทึมคำนวณอนุกรมระดับสูง', 5, 25, 'active', 'เริ่มต้นด้วยการนิยามเงื่อนไข base case ของเลข 0 และ 1 ก่อนประมวลผลคำนวณถัดไป');
INSERT INTO exercise (exercise_id, title, description, topic, objective, difficulty_level, expected_time, status, hint) VALUES (600, 'คูณเมทริกซ์ 2 มิติแมนนวล ชุดที่ 100', 'สร้างฟังก์ชันคูณอาร์เรย์แบบ 2 มิติ (Matritemp Multiplication) ขนาด 2temp2 สองชุดเข้าด้วยกันด้วยตนเอง โดยห้ามใช้ไลบรารีภายนอกเช่น NumPy', 'Array Transformation', 'สร้างสรรค์ลอจิกประมวลผลข้อมูลโครงสร้างอาเรย์ซับซ้อนเชิงคณิตศาสตร์', 5, 25, 'active', 'ใช้ลูปสามชั้นซ้อนกันเพื่อจัดการผลคูณของแถวและคอลแลมน์แยกแยะตามทฤษฎี');

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
-- INSERT: session_exercise  (เชื่อมโจทย์ทั้ง 500 ข้อเข้า 5 Session)
-- ─────────────────────────────────────────────────────────────
INSERT INTO session_exercise (session_id, exercise_id) VALUES
(1, 101),
(1, 102),
(1, 103),
(1, 104),
(1, 105),
(1, 106),
(1, 107),
(1, 108),
(1, 109),
(1, 110),
(1, 111),
(1, 112),
(1, 113),
(1, 114),
(1, 115),
(1, 116),
(1, 117),
(1, 118),
(1, 119),
(1, 120),
(1, 121),
(1, 122),
(1, 123),
(1, 124),
(1, 125),
(1, 126),
(1, 127),
(1, 128),
(1, 129),
(1, 130),
(1, 131),
(1, 132),
(1, 133),
(1, 134),
(1, 135),
(1, 136),
(1, 137),
(1, 138),
(1, 139),
(1, 140),
(1, 141),
(1, 142),
(1, 143),
(1, 144),
(1, 145),
(1, 146),
(1, 147),
(1, 148),
(1, 149),
(1, 150),
(1, 151),
(1, 152),
(1, 153),
(1, 154),
(1, 155),
(1, 156),
(1, 157),
(1, 158),
(1, 159),
(1, 160),
(1, 161),
(1, 162),
(1, 163),
(1, 164),
(1, 165),
(1, 166),
(1, 167),
(1, 168),
(1, 169),
(1, 170),
(1, 171),
(1, 172),
(1, 173),
(1, 174),
(1, 175),
(1, 176),
(1, 177),
(1, 178),
(1, 179),
(1, 180),
(1, 181),
(1, 182),
(1, 183),
(1, 184),
(1, 185),
(1, 186),
(1, 187),
(1, 188),
(1, 189),
(1, 190),
(1, 191),
(1, 192),
(1, 193),
(1, 194),
(1, 195),
(1, 196),
(1, 197),
(1, 198),
(1, 199),
(1, 200),
(2, 201),
(2, 202),
(2, 203),
(2, 204),
(2, 205),
(2, 206),
(2, 207),
(2, 208),
(2, 209),
(2, 210),
(2, 211),
(2, 212),
(2, 213),
(2, 214),
(2, 215),
(2, 216),
(2, 217),
(2, 218),
(2, 219),
(2, 220),
(2, 221),
(2, 222),
(2, 223),
(2, 224),
(2, 225),
(2, 226),
(2, 227),
(2, 228),
(2, 229),
(2, 230),
(2, 231),
(2, 232),
(2, 233),
(2, 234),
(2, 235),
(2, 236),
(2, 237),
(2, 238),
(2, 239),
(2, 240),
(2, 241),
(2, 242),
(2, 243),
(2, 244),
(2, 245),
(2, 246),
(2, 247),
(2, 248),
(2, 249),
(2, 250),
(2, 251),
(2, 252),
(2, 253),
(2, 254),
(2, 255),
(2, 256),
(2, 257),
(2, 258),
(2, 259),
(2, 260),
(2, 261),
(2, 262),
(2, 263),
(2, 264),
(2, 265),
(2, 266),
(2, 267),
(2, 268),
(2, 269),
(2, 270),
(2, 271),
(2, 272),
(2, 273),
(2, 274),
(2, 275),
(2, 276),
(2, 277),
(2, 278),
(2, 279),
(2, 280),
(2, 281),
(2, 282),
(2, 283),
(2, 284),
(2, 285),
(2, 286),
(2, 287),
(2, 288),
(2, 289),
(2, 290),
(2, 291),
(2, 292),
(2, 293),
(2, 294),
(2, 295),
(2, 296),
(2, 297),
(2, 298),
(2, 299),
(2, 300),
(3, 301),
(3, 302),
(3, 303),
(3, 304),
(3, 305),
(3, 306),
(3, 307),
(3, 308),
(3, 309),
(3, 310),
(3, 311),
(3, 312),
(3, 313),
(3, 314),
(3, 315),
(3, 316),
(3, 317),
(3, 318),
(3, 319),
(3, 320),
(3, 321),
(3, 322),
(3, 323),
(3, 324),
(3, 325),
(3, 326),
(3, 327),
(3, 328),
(3, 329),
(3, 330),
(3, 331),
(3, 332),
(3, 333),
(3, 334),
(3, 335),
(3, 336),
(3, 337),
(3, 338),
(3, 339),
(3, 340),
(3, 341),
(3, 342),
(3, 343),
(3, 344),
(3, 345),
(3, 346),
(3, 347),
(3, 348),
(3, 349),
(3, 350),
(3, 351),
(3, 352),
(3, 353),
(3, 354),
(3, 355),
(3, 356),
(3, 357),
(3, 358),
(3, 359),
(3, 360),
(3, 361),
(3, 362),
(3, 363),
(3, 364),
(3, 365),
(3, 366),
(3, 367),
(3, 368),
(3, 369),
(3, 370),
(3, 371),
(3, 372),
(3, 373),
(3, 374),
(3, 375),
(3, 376),
(3, 377),
(3, 378),
(3, 379),
(3, 380),
(3, 381),
(3, 382),
(3, 383),
(3, 384),
(3, 385),
(3, 386),
(3, 387),
(3, 388),
(3, 389),
(3, 390),
(3, 391),
(3, 392),
(3, 393),
(3, 394),
(3, 395),
(3, 396),
(3, 397),
(3, 398),
(3, 399),
(3, 400),
(4, 401),
(4, 402),
(4, 403),
(4, 404),
(4, 405),
(4, 406),
(4, 407),
(4, 408),
(4, 409),
(4, 410),
(4, 411),
(4, 412),
(4, 413),
(4, 414),
(4, 415),
(4, 416),
(4, 417),
(4, 418),
(4, 419),
(4, 420),
(4, 421),
(4, 422),
(4, 423),
(4, 424),
(4, 425),
(4, 426),
(4, 427),
(4, 428),
(4, 429),
(4, 430),
(4, 431),
(4, 432),
(4, 433),
(4, 434),
(4, 435),
(4, 436),
(4, 437),
(4, 438),
(4, 439),
(4, 440),
(4, 441),
(4, 442),
(4, 443),
(4, 444),
(4, 445),
(4, 446),
(4, 447),
(4, 448),
(4, 449),
(4, 450),
(4, 451),
(4, 452),
(4, 453),
(4, 454),
(4, 455),
(4, 456),
(4, 457),
(4, 458),
(4, 459),
(4, 460),
(4, 461),
(4, 462),
(4, 463),
(4, 464),
(4, 465),
(4, 466),
(4, 467),
(4, 468),
(4, 469),
(4, 470),
(4, 471),
(4, 472),
(4, 473),
(4, 474),
(4, 475),
(4, 476),
(4, 477),
(4, 478),
(4, 479),
(4, 480),
(4, 481),
(4, 482),
(4, 483),
(4, 484),
(4, 485),
(4, 486),
(4, 487),
(4, 488),
(4, 489),
(4, 490),
(4, 491),
(4, 492),
(4, 493),
(4, 494),
(4, 495),
(4, 496),
(4, 497),
(4, 498),
(4, 499),
(4, 500),
(5, 501),
(5, 502),
(5, 503),
(5, 504),
(5, 505),
(5, 506),
(5, 507),
(5, 508),
(5, 509),
(5, 510),
(5, 511),
(5, 512),
(5, 513),
(5, 514),
(5, 515),
(5, 516),
(5, 517),
(5, 518),
(5, 519),
(5, 520),
(5, 521),
(5, 522),
(5, 523),
(5, 524),
(5, 525),
(5, 526),
(5, 527),
(5, 528),
(5, 529),
(5, 530),
(5, 531),
(5, 532),
(5, 533),
(5, 534),
(5, 535),
(5, 536),
(5, 537),
(5, 538),
(5, 539),
(5, 540),
(5, 541),
(5, 542),
(5, 543),
(5, 544),
(5, 545),
(5, 546),
(5, 547),
(5, 548),
(5, 549),
(5, 550),
(5, 551),
(5, 552),
(5, 553),
(5, 554),
(5, 555),
(5, 556),
(5, 557),
(5, 558),
(5, 559),
(5, 560),
(5, 561),
(5, 562),
(5, 563),
(5, 564),
(5, 565),
(5, 566),
(5, 567),
(5, 568),
(5, 569),
(5, 570),
(5, 571),
(5, 572),
(5, 573),
(5, 574),
(5, 575),
(5, 576),
(5, 577),
(5, 578),
(5, 579),
(5, 580),
(5, 581),
(5, 582),
(5, 583),
(5, 584),
(5, 585),
(5, 586),
(5, 587),
(5, 588),
(5, 589),
(5, 590),
(5, 591),
(5, 592),
(5, 593),
(5, 594),
(5, 595),
(5, 596),
(5, 597),
(5, 598),
(5, 599),
(5, 600);


-- ============================================================
--  END OF SCRIPT
-- ============================================================
