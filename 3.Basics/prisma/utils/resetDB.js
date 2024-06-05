const { exec } = require('child_process');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const resetDatabase = async () => {
  try {
    // Drop the existing database
    await prisma.$executeRaw`DROP SCHEMA public CASCADE;`;
    console.log('Database schema dropped.');

    // Recreate the schema
    await prisma.$executeRaw`CREATE SCHEMA public;`;
    console.log('Database schema recreated.');
  } catch (e) {
    console.error(`Failed to reset database: ${e.message}`);
  } finally {
    await prisma.$disconnect();
  }
};

resetDatabase();
