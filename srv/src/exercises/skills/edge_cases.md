### Edge Case Resiliency Guidelines (เกณฑ์ความยืดหยุ่นและการรองรับกรณีขอบเขต)

Evaluate how robustly the student's code handles boundary inputs, unexpected data, and potential break cases:

1. **Numeric Boundaries & Division:**
   - **Zero & Negative Numbers:** ตรวจสอบกรณีที่ข้อมูลนำเข้าเป็น `0` หรือจำนวนลบ โดยเฉพาะการคำนวณทางคณิตศาสตร์ แฟกทอเรียล หรือการนับ
   - **Division by Zero:** ระวังการหารด้วยศูนย์ (`ZeroDivisionError`) ควรมีการตรวจสอบเงื่อนไขตัวหารก่อนทำการคำนวณ

2. **Empty Collections & Null Values:**
   - **Empty Inputs:** ตรวจสอบการรับค่าว่าง เช่น สตริงว่าง `""`, ลิสต์ว่าง `[]`, ดิกชันนารีว่าง `{}`, หรือค่า `None`
   - ป้องกันไม่ให้เกิดข้อผิดพลาดรันไทม์ เช่น การเข้าถึงสมาชิกตัวแรกของลิสต์ว่าง `arr[0]` (เสี่ยงเกิด `IndexError`) ควรตรวจสอบความยาวหรือใช้การดักจับที่เหมาะสม

3. **Index Bounds & Off-by-One Discrepancies:**
   - **Range Boundaries:** ตรวจสอบช่วงการวนลูป `range(start, stop, step)` ว่าครอบคลุมตัวเลขสุดท้ายตามที่โจทย์ต้องการหรือไม่ (ระวังปัญหาขาดไป 1 หรือเกินไป 1)
   - **Sequence Indices:** ตรวจสอบการเข้าถึงดัชนีของสตริงและลิสต์ เพื่อไม่ให้เกินขอบเขตที่จัดสรรไว้

4. **Formatting, Whitespace & Type Sensitivity:**
   - **Whitespace Handling:** การตัดช่องว่างส่วนเกินที่หัว/ท้ายข้อความ (`strip()`) เมื่อรับข้อมูลจากผู้ใช้
   - **Case Sensitivity:** ความละเอียดอ่อนของตัวพิมพ์เล็ก-ใหญ่ ในการเปรียบเทียบสตริง
   - **Type Conversion:** ป้องกันข้อผิดพลาดจากการรับค่าผ่าน `input()` ที่เป็นสตริงแล้วนำไปเปรียบเทียบหรือบวกกับตัวเลขโดยตรง

5. **Socratic Guidance on Edge Cases:**
   - **STRICT RULE:** ห้ามเปิดเผยชุดข้อมูลทดสอบลับ (Secret Test Cases) ให้นักเรียนเห็นโดยตรง
   - ให้ตั้งคำถามชวนคิดในเชิงกว้าง เช่น "ลองนึกถึงกรณีที่ข้อมูลนำเข้าเป็นค่าขอบเขต เช่น ค่า 0 หรือข้อความว่าง โปรแกรมจะให้ผลลัพธ์อย่างไร?"
