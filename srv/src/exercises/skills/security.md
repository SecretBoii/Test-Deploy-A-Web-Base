### Security Check Guidelines (เกณฑ์ความปลอดภัยและการป้องกัน Sandbox Evasion)

Analyze the student's Python source code for security vulnerabilities, malicious constructs, or attempts to bypass sandbox restrictions:

1. **Unsafe Operations & Context-Aware Input Policy:**
   - **Legitimate `input()` Usage:** ในโจทย์ระดับเริ่มต้นที่ต้องรับค่าผ่านคีย์บอร์ดหรือคอนโซล ผู้เรียน **สามารถใช้ฟังก์ชัน `input()` ได้ตามปกติ** ห้ามตัดคะแนนหรือตีความว่าไม่ปลอดภัย
   - **Dynamic Code Execution:** ห้ามใช้คำสั่งประมวลผลโค้ดแบบไดนามิกโดยเด็ดขาด ได้แก่ `eval()`, `exec()`, `compile()`, และ `__import__()`
   - หากตรวจพบการใช้คำสั่งประมวลผลไดนามิกเหล่านี้ ให้ตัดคะแนนเป็น 0 ทันที และแจ้งเตือนใน `exception_message` หรือ `ai_feedback`

2. **Forbidden System Imports & File I/O:**
   - ไม่อนุญาตให้นำเข้าโมดูลระดับระบบปฏิบัติการ (System-level Modules) ได้แก่:
     `os`, `sys`, `subprocess`, `shutil`, `socket`, `http`, `urllib`, `requests`, `ctypes`, `builtins`, `pty`, `platform`
   - ห้ามการอ่าน/เขียน/ลบไฟล์ในระบบไฟล์ (File System Operations) เช่น การใช้ `open()` เพื่อสร้างหรือแก้ไขไฟล์นอกขอบเขตการเรียนรู้

3. **Sandbox Evasion & Introspection Attacks:**
   - ตรวจจับความพยายามหลบหลีก Sandbox ผ่านเทคนิค Reflection / Dunder attributes:
     เช่น การเรียกใช้ `getattr()`, `setattr()`, `globals()`, `locals()`, `vars()`, `__subclasses__()`, `__class__.__bases__`, หรือการเข้าถึงตัวแปรภายในอย่าง `__builtins__`

4. **Resource Exhaustion & Denial of Service (DoS):**
   - ตรวจจับความพยายามทำให้ระบบค้างหรือใช้หน่วยความจำเกินขนาดโดยเจตนา (Memory Bomb / Fork Bomb) เช่น การสร้างอาร์เรย์ขนาดมหาศาล `[0] * 10**9` หรือการตั้งค่าปลดล็อกการวนซ้ำเกินพิกัด

5. **Constructive Security Feedback:**
   - หากพบการละเมิดความปลอดภัย ให้แจ้งเตือนด้วยภาษาไทยที่สุภาพและเป็นมืออาชีพ เช่น:
     "ระบบไม่อนุญาตให้ใช้คำสั่งภายนอกหรือคำสั่งระบบปฏิบัติการ กรุณาเขียนฟังก์ชันคำนวณโดยใช้โครงสร้างไพทอนมาตรฐานครับ"
