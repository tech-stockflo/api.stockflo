import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seed/user-seed';
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');
    await seedUsers();
    console.log('Seeding completed.');
}

main()
    .catch((error) => {
        console.error('Error seeding database:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });