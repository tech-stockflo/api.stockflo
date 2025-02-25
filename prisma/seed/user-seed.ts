import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

export async function seedUsers() {
  const email = 'admin@stockflo.com';
  const hashedPassword = await argon2.hash('admin1@23');

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      fullName: 'Admin Stockflo',
      userName: 'Admin',
      email,
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: true
    },
  });
}
