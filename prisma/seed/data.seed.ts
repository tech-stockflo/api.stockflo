import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const SeedData = async () => {
  const hashedPassword = await argon2.hash("prop1@23");

  await prisma.product.deleteMany({});
  await prisma.stock.deleteMany({});
  await prisma.stockManager.deleteMany({});
  await prisma.supplier.deleteMany({});
  await prisma.user.deleteMany({});

  const stockOwners = [];

  // Create 50 stock owners
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

  // Create 5 stock owners without any stock managers
  for (let i = 0; i < 5; i++) {
    await prisma.user.create({
      data: {
        email: faker.internet.email(),
        userName: faker.internet.username(),
        fullName: faker.person.fullName(),
        password: hashedPassword,
        role: 'STOCK_OWNER',
        status: 'ENABLED',
      },
    });
  }

  const stockManagers = [];
  const stocks = [];

  // Assign stock owners their stocks and stock managers
  for (const stockOwner of stockOwners) {
    const numStocks = Math.floor(Math.random() * 10) + 1; // Each owner has 1-10 stocks
    const numManagers = Math.floor(Math.random() * (numStocks / 2)) + 1; // Some managers will manage multiple stocks

    const assignedManagers = [];

    // Create stock managers
    for (let j = 0; j < numManagers; j++) {
      const stockManager = await prisma.stockManager.create({
        data: {
          email: faker.internet.email(),
          userName: faker.internet.username(),
          fullName: faker.person.fullName(),
          phoneNumber: faker.phone.number(),
          password: hashedPassword,
          status: 'ENABLED',
          stockOwnerId: stockOwner.id,
        },
      });

      stockManagers.push(stockManager);
      assignedManagers.push(stockManager);
    }

    // Create stocks and assign them to managers
    for (let k = 0; k < numStocks; k++) {
      let assignedManager = null;

      if (assignedManagers.length > 0 && Math.random() > 0.5) {
        // Randomly assign one of the managers, allowing multiple assignments
        assignedManager = assignedManagers[Math.floor(Math.random() * assignedManagers.length)];
      }

      const stock = await prisma.stock.create({
        data: {
          name: faker.company.name(),
          streetAddress: faker.location.streetAddress(),
          status: 'ENABLED',
          stockOwnerId: stockOwner.id,
          stockManagers: assignedManager ? { connect: { id: assignedManager.id } } : undefined,
        },
      });

      stocks.push(stock);
    }
  }

  // Create 100 suppliers
  const suppliers = [];
  for (let i = 0; i < 100; i++) {
    const supplier = await prisma.supplier.create({
      data: {
        name: faker.company.name(),
        contact: faker.phone.number(),
        status: 'ENABLED',
      },
    });
    suppliers.push(supplier);
  }

  // Create 100,000 products distributed among the stocks
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
};

export default SeedData;