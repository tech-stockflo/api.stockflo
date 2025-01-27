import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

export async function seedOwnerData() {
  // Password hashing
  const hashedPassword = await argon2.hash('prop1@23');

  // The already existing stock owner
  const stockOwnerId = '1565dc54-bf0d-462c-8a04-b01c842e419d';

  // Create Stock Managers
  const stockManagers = [];
  for (let i = 1; i <= 3; i++) {
    const stockManager = await prisma.stockManager.create({
      data: {
        email: `stockmanager--of-peace${i}@example.com`,
        userName: `stockmanager-of-peace${i}`,
        fullName: `Stock Manager--of-peace ${i}`,
        password: hashedPassword,
        stockOwnerId: stockOwnerId,
      },
    });
    stockManagers.push(stockManager);
  }

  // Create Suppliers
  const suppliers = [];
  for (let i = 1; i <= 5; i++) { // Create a few suppliers for the example
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
  for (let i = 1; i <= 6; i++) { // 6 stocks managed by stock managers
    const manager1 = stockManagers[(i * 2 - 1) % stockManagers.length];
    const manager2 = stockManagers[(i * 2) % stockManagers.length];
    const stock = await prisma.stock.create({
      data: {
        name: `Stock ${i}`,
        streetAddress: `Street ${i}, Kigali`,
        stockManagers: {
          connect: [{ id: manager1.id }, { id: manager2.id }],
        },
        stockOwnerId: stockOwnerId,
      },
    });
    stocks.push(stock);
  }

  // Create Stock managed by the owner (user)
  const stockByOwner = await prisma.stock.create({
    data: {
      name: `Stock 7`,
      streetAddress: `Street 7, Kigali`,
      stockManagers: {
        connect: [],
      }, // No managers; owned by the stock owner directly
      stockOwnerId: stockOwnerId,
    },
  });

  // Create Products and assign them to stocks
  for (let i = 1; i <= 1000; i++) {
    const supplier = suppliers[i % suppliers.length];
    const stock = i <= 6 ? stocks[i % stocks.length] : stockByOwner; // Distribute products to the 6 manager stocks, and 1 to the owner's stock
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

  console.log('Seed data creation completed');
}