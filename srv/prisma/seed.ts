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

    // 1. Seed Roles dynamically
    const studentRole = await prisma.role.findFirst({ where: { roleName: 'Student' } })
      || await prisma.role.create({ data: { roleName: 'Student' } });

    const teacherRole = await prisma.role.findFirst({ where: { roleName: 'Teacher' } })
      || await prisma.role.create({ data: { roleName: 'Teacher' } });

    const adminRole = await prisma.role.findFirst({ where: { roleName: 'Admin' } })
      || await prisma.role.create({ data: { roleName: 'Admin' } });

    console.log('Roles seeded.');

    // 2. Seed Education dynamically
    let defaultEdu = await prisma.education.findFirst({
      where: { university: 'ไม่ระบุ', faculty: 'ไม่ระบุ' }
    });

    if (!defaultEdu) {
      defaultEdu = await prisma.education.create({
        data: {
          university: 'ไม่ระบุ',
          faculty: 'ไม่ระบุ',
          major: 'ไม่ระบุ',
        }
      });
    }
    console.log('Education seeded.');

    // 3. Seed Userprofile (แปลงรหัสผ่านด้วย bcrypt Hash และอ้างอิง Dynamic ID)
    const users = [
      {
        username: 'student',
        password: '1234',
        firstName: 'Student',
        lastName: 'System',
        email: 'student@example.com',
        gender: 'male',
        dateOfBirth: new Date('2000-01-01'),
        educationId: defaultEdu.educationId,
        roleId: studentRole.roleId,
      },
      {
        username: 'teacher',
        password: '1234',
        firstName: 'Teacher',
        lastName: 'System',
        email: 'teacher@example.com',
        gender: 'female',
        dateOfBirth: new Date('1990-05-15'),
        educationId: defaultEdu.educationId,
        roleId: teacherRole.roleId,
      },
      {
        username: 'admin',
        password: '1234',
        firstName: 'Admin',
        lastName: 'System',
        email: 'admin@example.com',
        gender: 'male',
        dateOfBirth: new Date('1985-03-20'),
        educationId: defaultEdu.educationId,
        roleId: adminRole.roleId,
      },
    ];
    for (const u of users) {
      const hashedPassword = bcrypt.hashSync(u.password, 10);
      await prisma.userProfile.upsert({
        where: { email: u.email },
        update: {
          username: u.username,
          password: hashedPassword,
          firstName: u.firstName,
          lastName: u.lastName,
        },
        create: {
          ...u,
          password: hashedPassword,
        },
      });
    }
    console.log('Userprofiles seeded.');

    // 4. Seed Exercises (รองรับไฟล์ชุดโจทย์ exercise_rows.sql และ python-exercises.sql เพื่อให้การ seed มีความยืดหยุ่น)
    const exerciseRowsPath = path.join(__dirname, '../../exercise_rows.sql');
    const legacyExercisesPath = path.join(__dirname, '../../python-exercises.sql');
    const activeExercisePath = fs.existsSync(exerciseRowsPath)
      ? exerciseRowsPath
      : fs.existsSync(legacyExercisesPath)
        ? legacyExercisesPath
        : null;

    if (activeExercisePath) {
      console.log(`Seeding exercises from ${path.basename(activeExercisePath)}...`);
      const sqlContent = fs.readFileSync(activeExercisePath, 'utf-8');
      await prisma.$executeRawUnsafe(sqlContent);
      console.log('Exercises seeded.');
    }


    // 5. Seed Custom Sessions
    const customSessionsPath = path.join(__dirname, '../../custom-sessions.sql');
    if (fs.existsSync(customSessionsPath)) {
      console.log('Seeding custom sessions...');
      const customSessionsSql = fs.readFileSync(customSessionsPath, 'utf-8');
      await prisma.$executeRawUnsafe(customSessionsSql);
      console.log('Custom Sessions seeded successfully!');
    }


    // 6. Reset Sequences to prevent Unique Constraint errors on auto-increment IDs
    console.log('Resetting database sequences...');
    await prisma.$executeRawUnsafe(`
      SELECT setval(pg_get_serial_sequence('user_profile', 'user_id'), COALESCE(MAX(user_id), 1)) FROM user_profile;
      SELECT setval(pg_get_serial_sequence('role', 'role_id'), COALESCE(MAX(role_id), 1)) FROM role;
      SELECT setval(pg_get_serial_sequence('education', 'education_id'), COALESCE(MAX(education_id), 1)) FROM education;
      SELECT setval(pg_get_serial_sequence('exercise', 'exercise_id'), COALESCE(MAX(exercise_id), 1)) FROM exercise;
      SELECT setval(pg_get_serial_sequence('session', 'session_id'), COALESCE(MAX(session_id), 1)) FROM session;
      SELECT setval(pg_get_serial_sequence('activity', 'activity_id'), COALESCE(MAX(activity_id), 1)) FROM activity;
    `);
    console.log('Sequences reset successfully!');

    console.log('Seeding finished successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
