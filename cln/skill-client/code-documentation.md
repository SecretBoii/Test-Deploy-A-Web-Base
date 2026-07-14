---
name: code-documentation
description: ใช้เมื่อ push โค้ดเสร็จแล้วต้องการ auto-generate README, API docs, หรือ changelog จากซอร์สโค้ดจริง
track: Developer
---

# Code Documentation

## เมื่อไหร่ควรใช้ Skill นี้
- เพิ่งเขียน/แก้โค้ดเสร็จ และต้องการเอกสารประกอบ (README, API reference, changelog)
- repo ไม่มีเอกสารหรือเอกสารล้าสมัย

## สิ่งที่ Skill นี้ทำ
1. อ่านโครงสร้างโค้ดในโปรเจกต์/repo
2. สร้าง README ที่อธิบายวิธีติดตั้งและใช้งาน
3. Generate API docs จาก function/class signatures
4. สรุป changelog จาก commit history (ถ้ามี)

## ตัวอย่างการใช้งาน
```
ผู้ใช้: generate a README for this repo
```
→ ได้ไฟล์ README.md ที่ครอบคลุม installation, usage, และโครงสร้างโปรเจกต์
