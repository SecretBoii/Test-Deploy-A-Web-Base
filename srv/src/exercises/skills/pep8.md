### Coding Convention & PEP 8 Guidelines (เกณฑ์มาตรฐานและความสะอาดของโค้ดไพทอน)

Evaluate the structure, readability, and idiomatic quality of the student's Python code following Python's style guide conventions:

1. **Naming Conventions & Semantic Clarity:**
   - **Functions & Variables:** ใช้รูปแบบ `snake_case` (เช่น `total_score`, `calculate_area`, `user_name`)
   - **Constants:** ใช้รูปแบบ `UPPER_CASE` (เช่น `MAX_LIMIT`, `PI = 3.14159`)
   - **Meaningful Names:** สนับสนุนให้ตั้งชื่อตัวแปรที่สื่อความหมาย หลีกเลี่ยงการใช้ตัวแปรตัวอักษรเดี่ยว เช่น `a`, `b`, `x`, `temp1` โดยไม่จำเป็น (ยกเว้นตัวนับลูปธรรมดาทั่วไป เช่น `i`, `j` หรือพิกัดคณิตศาสตร์ `x`, `y`)

2. **Spacing, Indentation & Formatting:**
   - **Indentation:** ใช้การเว้นวรรค 4 ช่องว่างอย่างสม่ำเสมอในแต่ละระดับบล็อกคำสั่ง (ห้ามผสมการใช้ Tab และ Space)
   - **Operators & Commas:** เว้นวรรค 1 ช่องรอบตัวดำเนินการทวิภาค (`=`, `+`, `-`, `*`, `/`, `==`) และหลังเครื่องหมายจุลภาค (เช่น `print(a, b)`, `[1, 2, 3]`)
   - **Single Statements:** หลีกเลี่ยงการรวมหลายคำสั่งไว้ในบรรทัดเดียวโดยใช้เครื่องหมายเซมิโคลอน (`;`)

3. **Pythonic Idioms & Clean Code:**
   - **Boolean Evaluation:** นิยมใช้ `if is_valid:` หรือ `if not items:` แทนการเขียนเปรียบเทียบแบบฟุ่มเฟือย เช่น `if is_valid == True:` หรือ `if len(items) == 0:`
   - **Looping over Sequences:** นิยมใช้ `for item in items:` หรือ `for i, item in enumerate(items):` แทนการใช้ Anti-pattern `for i in range(len(items)):`
   - **String Formatting:** แนะนำการใช้ F-string (เช่น `f"Total: {total}"`) แทนการบวกสตริงหลายชั้น

4. **Educational Scoring Principle:**
   - เกณฑ์ PEP 8 เป็นเกณฑ์เพื่อการปลูกฝังนิสัยการเขียนโปรแกรมที่ดี (Best Practice)
   - **ห้ามหักคะแนนรุนแรงจนทำให้ผู้เรียนสอบตก** หากตรรกะทำงานถูกต้อง ให้คะแนนผ่าน และให้คำแนะนำเรื่องความสวยงามของโค้ดอย่างสร้างสรรค์
