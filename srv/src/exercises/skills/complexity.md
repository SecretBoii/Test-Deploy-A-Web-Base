### Complexity & Performance Guidelines (เกณฑ์ประสิทธิภาพและความซับซ้อนของโค้ด)

Analyze the runtime efficiency and spatial characteristics of the student's code, adapting the rigor based on the exercise difficulty level:

1. **Difficulty-Aware Evaluation:**
   - **Beginner Level (Difficulty 1 - 2):**
     * ไม่ควรกดดันผู้เรียนด้วยทฤษฎี Big-O notation หรือคำศัพท์เฉพาะทางที่ซับซ้อน
     * มุ่งเน้นการตรวจจับการทำงานซ้ำซ้อนที่ไม่จำเป็น (Redundant execution) เช่น การวนลูปที่ไม่มีวันหยุด, ลูปที่ทำงานเกินความจำเป็น, หรือการเรียกฟังก์ชันซ้ำๆ ในจุดเดิม
     * แนะนำด้วยข้อสังเกตง่ายๆ เช่น "ลองสังเกตดูว่ามีคำสั่งหรือการคำนวณใดที่ทำซ้ำโดยไม่จำเป็นหรือไม่?"
   - **Intermediate & Advanced Level (Difficulty 3 - 5):**
     * ประเมินประสิทธิภาพ Asymptotic Time Complexity โดยใช้ Big-O Notation (เช่น $O(1)$, $O(\log n)$, $O(n)$, $O(n \log n)$, $O(n^2)$)
     * หากโจทย์สามารถแก้ได้ในเวลา Linear $O(n)$ หรือเร็วกว่า แต่ผู้เรียนใช้ Nested Loop ($O(n^2)$) ให้แนะนำเทคนิคการจัดเก็บข้อมูลที่มีประสิทธิภาพขึ้น เช่น การใช้ Dictionary (Hash Map) หรือ Set ในการค้นหา

2. **Suboptimal Loops & Repeated Operations:**
   - ตรวจสอบการใช้คำสั่งที่มีต้นทุนสูงซ่อนอยู่ภายในลูป เช่น การเรียก `list.count()` หรือ `item in list` ภายใน `for` loop ซึ่งทำให้กลายเป็น $O(n^2)$ โดยไม่รู้ตัว
   - ตรวจสอบการต่อสตริงแบบสะสมในลูป (`s += char`) หากข้อมูลมีขนาดใหญ่ ควรแนะนำให้ชวนคิดถึงการสะสมในลิสต์แล้วนำมา `''.join()`

3. **Space Complexity & Memory Efficiency:**
   - ตักเตือนหากผู้เรียนสร้างโครงสร้างข้อมูลขนาดใหญ่ซ้ำซ้อน (Duplicate data structures) เช่น การคัดลอกลิสต์ทั้งชุดโดยไม่มีความจำเป็น
   - แนะนำการคำนวณแบบ In-place หรือใช้ Generator/Iterator เมื่อต้องการวนรอบประมวลผลข้อมูลขนาดใหญ่

4. **Educational Feedback Principle:**
   - ห้ามหักคะแนนส่วนประสิทธิภาพจนทำให้ผู้เริ่มต้นสอบตก หากตรรกะพื้นฐานถูกต้อง ให้คะแนนผ่านและเสริมคำแนะนำเชิงชวนคิดเพื่อพัฒนาประสิทธิภาพโค้ด
