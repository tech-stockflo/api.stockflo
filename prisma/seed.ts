import { PrismaClient } from '@prisma/client';
import { seedData } from './seed/data-seed';
import { seedUsers } from './seed/user-seed';
import { seedOwnerData } from './seed/stock-owner-seed';
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');
    // await seedUsers();
    await seedData()
    // await seedOwnerData()
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