import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

export async function seedUsers() {
  const email = 'admin@sms.com';
  const hashedPassword = await argon2.hash('admin1@23');

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      fullName: 'Project Manager',
      userName: 'Admin',
      email,
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: true
    },
  });
}
