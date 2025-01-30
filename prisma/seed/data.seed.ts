import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const SeedData = async () => {
  try {
    console.log("🔄 Seeding database...");

    const hashedPassword = await argon2.hash("prop1@23");

    // ✅ Step 1: Clear existing data
    await prisma.product.deleteMany({});
    await prisma.stock.deleteMany({});
    await prisma.supplier.deleteMany({});
    await prisma.user.deleteMany({});

    const stockOwners = [];

    // ✅ Step 2: Create Stock Owners
    for (let i = 0; i < 50; i++) {
      const stockOwner = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          userName: faker.internet.username(),
          fullName: faker.person.fullName(),
          password: hashedPassword,
          role: 'STOCK_OWNER',
          status: 'ENABLED',
        },
      });

      stockOwners.push(stockOwner);
    }

    const stockManagers = [];
    const stocks = [];
    const suppliers = [];

    // ✅ Step 3: Assign Stock Owners their Stocks and Stock Managers
    for (const stockOwner of stockOwners) {
      const numStocks = Math.floor(Math.random() * 10) + 1; // Each owner has 1-10 stocks
      const numManagers = Math.floor(Math.random() * Math.min(numStocks, 5)) + 1; // Ensure at least 1 manager

      const assignedManagers = [];

      // ✅ Step 4: Create Stock Managers (Some will manage multiple stocks)
      for (let j = 0; j < numManagers; j++) {
        const stockManager = await prisma.user.create({
          data: {
            email: faker.internet.email(),
            userName: faker.internet.username(),
            fullName: faker.person.fullName(),
            phoneNumber: faker.phone.number(),
            password: hashedPassword,
            role: 'STOCK_MANAGER',
            status: 'ENABLED',
            stockOwnerId: stockOwner.id,
          },
        });

        stockManagers.push(stockManager);
        assignedManagers.push(stockManager);
      }

      // ✅ Step 5: Create Stocks and Assign Multiple Managers
      for (let k = 0; k < numStocks; k++) {
        let assignedStockManagers = [];

        // 🔹 Randomly decide if a stock will have multiple managers
        if (assignedManagers.length > 0 && Math.random() > 0.3) {
          assignedStockManagers = assignedManagers.slice(0, Math.floor(Math.random() * assignedManagers.length) + 1);
        }

        const stock = await prisma.stock.create({
          data: {
            name: faker.company.name(),
            streetAddress: faker.location.streetAddress(),
            status: 'ENABLED',
            stockOwnerId: stockOwner.id, // ✅ Ensures valid foreign key
            stockManagers: assignedStockManagers.length > 0
              ? { connect: assignedStockManagers.map((manager) => ({ id: manager.id })) }
              : undefined,
          },
        });

        stocks.push(stock);
      }

      // ✅ Step 6: Create Suppliers
      const numSuppliers = Math.floor(Math.random() * 5) + 1;
      for (let s = 0; s < numSuppliers; s++) {
        const supplier = await prisma.supplier.create({
          data: {
            name: faker.company.name(),
            contact: faker.phone.number(),
            status: 'ENABLED',
            stockOwnerId: stockOwner.id,
            createdBy: stockOwner.id,
          },
        });

        suppliers.push(supplier);
      }
    }

    // ✅ Step 7: Create 100,000 Products
    for (let i = 0; i < 100000; i++) {
      const stock = stocks[Math.floor(Math.random() * stocks.length)];
      const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];

      await prisma.product.create({
        data: {
          name: faker.commerce.productName(),
          quantity: Math.floor(Math.random() * 1000),
          thresholdValue: Math.floor(Math.random() * 100),
          supplierId: supplier.id,
          stockId: stock.id,
          status: 'ENABLED',
        },
      });
    }

    console.log("✅ Seeding complete!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
};

export default SeedData;