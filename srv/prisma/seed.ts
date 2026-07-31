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

    // 3. Seed Userprofile (แปลงรหัสผ่านด้วย bcrypt Hash)
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
      await prisma.userProfile.upsert({
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

    // 5. Seed Custom Sessions & SessionExercises from custom-sessions.sql
    console.log('Seeding custom sessions...');
    const customSessionsPath = path.join(__dirname, '../../custom-sessions.sql');
    const customSessionsSql = fs.readFileSync(customSessionsPath, 'utf-8');
    await prisma.$executeRawUnsafe(customSessionsSql);
    console.log('Custom Sessions seeded successfully!');

    console.log('Seeding finished successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
