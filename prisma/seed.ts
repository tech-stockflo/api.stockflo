import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seed/user-seed';
import SeedData from './seed/data.seed';
const prisma = new PrismaClient();

async function main() {
    // await seedUsers();
    await SeedData();
}

main()
    .catch((error) => {
        console.error('Error seeding database:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });