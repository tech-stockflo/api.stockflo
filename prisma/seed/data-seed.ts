import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

export async function seedData() {
  // Clear existing data (optional, only use if starting fresh)
  await prisma.product.deleteMany();
  await prisma.stock.deleteMany(); 
  await prisma.supplier.deleteMany();
  await prisma.stockManager.deleteMany();
  await prisma.user.deleteMany();

  // Password hashing
  const hashedPassword = await argon2.hash('prop1@23');

  // Create Stock Owners
  const stockOwners = [];
  for (let i = 1; i <= 50; i++) {
    const stockOwner = await prisma.user.create({
      data: {
        email: `stockowner${i}@example.com`,
        userName: `stockowner${i}`,
        fullName: `Stock Owner ${i}`,
        password: hashedPassword,
        emailVerified: true,
        role: 'STOCK_OWNER',
      },
    });
    stockOwners.push(stockOwner);
  }

  // Create Stock Managers
  const stockManagers = [];
  for (let i = 1; i <= 150; i++) {
    const assignedOwner = stockOwners[i % stockOwners.length];
    const stockManager = await prisma.stockManager.create({
      data: {
        email: `stockmanager${i}@example.com`,
        userName: `stockmanager${i}`,
        fullName: `Stock Manager ${i}`,
        password: hashedPassword,
        stockOwnerId: assignedOwner.id,
      },
    });
    stockManagers.push(stockManager);
  }

  // Create Suppliers
  const suppliers = [];
  for (let i = 1; i <= 500; i++) {
    const supplier = await prisma.supplier.create({
      data: {
        name: `Supplier ${i}`,
        contact: `+250700000${i.toString().padStart(4, '0')}`,
      },
    });
    suppliers.push(supplier);
  }

  // Create Stocks and associate them with Stock Managers
  const stocks = [];
  for (let i = 1; i <= 400; i++) {
    const manager1 = stockManagers[(i * 2 - 1) % stockManagers.length];
    const manager2 = stockManagers[(i * 2) % stockManagers.length];
    const stock = await prisma.stock.create({
      data: {
        name: `Stock ${i}`,
        streetAddress: `Street ${i}, Kigali`,
        stockManagers: {
          connect: [{ id: manager1.id }, { id: manager2.id }],
        },
        stockOwnerId: stockOwners[i % stockOwners.length].id,
      },
    });
    stocks.push(stock);
  }

  // Create Products
  for (let i = 1; i <= 20000; i++) {
    const supplier = suppliers[i % suppliers.length];
    const stock = stocks[i % stocks.length];
    await prisma.product.create({
      data: {
        name: `Product ${i}`,
        quantity: Math.floor(Math.random() * 100) + 1,
        thresholdValue: Math.floor(Math.random() * 10) + 5,
        supplierId: supplier.id,
        stockId: stock.id,
      },
    });
  }

  console.log('Seeding complete!');
}