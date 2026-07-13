import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    console.log('🌱 Start seeding...');

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
    console.log('✅ Roles seeded.');

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
    console.log('✅ Education seeded.');

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
      await prisma.userprofile.upsert({
        where: { userId: u.userId },
        update: {
          username: u.username,
          password: u.password,
        },
        create: u,
      });
    }
    console.log('✅ Userprofiles seeded.');

    // 4. Seed Exercises
    const exercises = [
      {
        exerciseId: 101,
        title: 'หาพื้นที่รูปสี่เหลี่ยม',
        description: 'เขียนโปรแกรมรับค่ากว้างและยาว แล้วแสดงผลลัพธ์เป็นพื้นที่ของรูปสี่เหลี่ยม',
        topic: 'Variables & Basic Arithmetic',
        objective: 'ฝึกการใช้งานตัวแปรและการคำนวณคณิตศาสตร์เบื้องต้น (คูณกว้างยาว)',
        difficultyLevel: 1,
        expectedTime: 10,
        status: 'active',
        hint: 'ใช้สูตร width * height',
      },
      {
        exerciseId: 102,
        title: 'การคำนวณหาค่าแฟกทอเรียล (Factorial)',
        description: 'เขียนโปรแกรมคำนวณหาค่า Factorial (n!) โดยการเขียนฟังก์ชัน Recursive',
        topic: 'Recursion',
        objective: 'ต้องเขียนโดยใช้ฟังก์ชันแบบเรียกตัวเอง (Recursion) เท่านั้น ห้ามใช้คำสั่ง loop เช่น for หรือ while เด็ดขาด',
        difficultyLevel: 2,
        expectedTime: 15,
        status: 'active',
        hint: 'n * factorial(n - 1) base case คือ n <= 1',
      }
    ];
    for (const ex of exercises) {
      await prisma.exercise.upsert({
        where: { exerciseId: ex.exerciseId },
        update: {
          title: ex.title,
          description: ex.description,
          topic: ex.topic,
          objective: ex.objective,
          hint: ex.hint,
        },
        create: ex,
      });
    }
    console.log('✅ Exercises seeded.');

    // 5. Seed Session
    const session = {
      sessionId: 1,
      sessionName: 'บทเรียนที่ 1: พื้นฐาน Python',
      sessionObjective: 'เรียนรู้เรื่องตัวแปรและการคำนวณเบื้องต้น',
      targetLevel: 'Beginner',
      duration: 60,
      status: 'active',
    };
    await prisma.session.upsert({
      where: { sessionId: session.sessionId },
      update: {},
      create: session,
    });
    console.log('✅ Session seeded.');

    // 6. Seed SessionExercise
    await prisma.sessionExercise.upsert({
      where: {
        sessionId_exerciseId: {
          sessionId: 1,
          exerciseId: 101,
        },
      },
      update: {},
      create: {
        sessionId: 1,
        exerciseId: 101,
      },
    });
    await prisma.sessionExercise.upsert({
      where: {
        sessionId_exerciseId: {
          sessionId: 1,
          exerciseId: 102,
        },
      },
      update: {},
      create: {
        sessionId: 1,
        exerciseId: 102,
      },
    });
    console.log('✅ SessionExercise links seeded.');

    console.log('🌱 Seeding finished successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
