import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    console.log('Start seeding...');

    // 1. Seed Roles
    const roles = [
      { roleId: 1, roleName: 'Student' },
      { roleId: 2, roleName: 'Teacher' },
      { roleId: 3, roleName: 'Admin' },
    ];
    for (const r of roles) {
      await prisma.role.upsert({
        where: { roleId: r.roleId },
        update: { roleName: r.roleName },
        create: r,
      });
    }
    console.log('Roles seeded.');

    // 2. Seed Education
    const education = {
      educationId: 1,
      university: 'Default University',
      faculty: 'Default Faculty',
      major: 'Default Major',
    };
    await prisma.education.upsert({
      where: { educationId: education.educationId },
      update: {},
      create: education,
    });
    console.log('Education seeded.');

    // 3. Seed Userprofile
    const users = [
      {
        userId: 1,
        username: 'student',
        password: '1234',
        gender: 'male',
        dateOfBirth: new Date('2000-01-01'),
        educationId: 1,
        roleId: 1,
      },
      {
        userId: 2,
        username: 'teacher',
        password: '1234',
        gender: 'female',
        dateOfBirth: new Date('1990-05-15'),
        educationId: 1,
        roleId: 2,
      },
      {
        userId: 3,
        username: 'admin',
        password: '1234',
        gender: 'male',
        dateOfBirth: new Date('1985-03-20'),
        educationId: 1,
        roleId: 3,
      },
    ];
    for (const u of users) {
      const hashedPassword = bcrypt.hashSync(u.password, 10);
      await prisma.userprofile.upsert({
        where: { userId: u.userId },
        update: {
          username: u.username,
          password: hashedPassword,
        },
        create: {
          ...u,
          password: hashedPassword,
        },
      });
    }
    console.log('Userprofiles seeded.');

    // 4. Seed Exercises
    console.log('Seeding exercises from python-exercises.sql...');
    const sqlPath = path.join(__dirname, '../../python-exercises.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');
    await prisma.$executeRawUnsafe(sqlContent);
    console.log('Exercises seeded.');

    // 5. Seed Sessions
    console.log('Seeding sessions...');
    const sessions = [
      {
        sessionId: 1,
        sessionName: 'บทเรียนที่ 1: การจดจำและทำความเข้าใจพื้นฐาน Python (Level 1)',
        sessionObjective: 'เรียนรู้ไวยากรณ์พื้นฐาน ตัวแปร และชนิดข้อมูล',
        targetLevel: 'Level 1',
        duration: 45,
        status: 'active',
      },
      {
        sessionId: 2,
        sessionName: 'บทเรียนที่ 2: การประยุกต์ใช้งานเบื้องต้น (Level 2)',
        sessionObjective: 'ฝึกการใช้ตัวดำเนินการและเงื่อนไขแบบง่าย',
        targetLevel: 'Level 2',
        duration: 60,
        status: 'active',
      },
      {
        sessionId: 3,
        sessionName: 'บทเรียนที่ 3: การวิเคราะห์ลอจิกวนซ้ำและข้อมูลชุด (Level 3)',
        sessionObjective: 'ฝึกฝนเรื่องลูป ลิสต์ และฟังก์ชันเบื้องต้น',
        targetLevel: 'Level 3',
        duration: 90,
        status: 'active',
      },
      {
        sessionId: 4,
        sessionName: 'บทเรียนที่ 4: การประเมินค่าและตรวจสอบตรรกะระดับสูง (Level 4)',
        sessionObjective: 'ฝึกตรวจสอบบั๊ก ดักจับ Edge Cases และตรวจสอบรหัส',
        targetLevel: 'Level 4',
        duration: 120,
        status: 'active',
      },
      {
        sessionId: 5,
        sessionName: 'บทเรียนที่ 5: การออกแบบอัลกอริทึมและฟังก์ชันซับซ้อน (Level 5)',
        sessionObjective: 'เรียนรู้อัลกอริทึมเรียงลำดับและการเขียน Recursion',
        targetLevel: 'Level 5',
        duration: 150,
        status: 'active',
      },
    ];

    for (const s of sessions) {
      await prisma.session.upsert({
        where: { sessionId: s.sessionId },
        update: {
          sessionName: s.sessionName,
          sessionObjective: s.sessionObjective,
          targetLevel: s.targetLevel,
          duration: s.duration,
          status: s.status,
        },
        create: s,
      });
    }
    console.log('Sessions seeded.');

    // 6. Seed SessionExercises
    console.log('Seeding SessionExercise links...');
    const sessionExercisesData = [];
    for (let sId = 1; sId <= 5; sId++) {
      const startId = 100 + (sId - 1) * 100 + 1;
      const endId = 100 + sId * 100;
      for (let exId = startId; exId <= endId; exId++) {
        sessionExercisesData.push({
          sessionId: sId,
          exerciseId: exId,
        });
      }
    }
    await prisma.sessionExercise.createMany({
      data: sessionExercisesData,
      skipDuplicates: true,
    });
    console.log('SessionExercise links seeded.');

    console.log('Seeding finished successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
