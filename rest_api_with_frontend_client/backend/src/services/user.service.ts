import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function getUserByEmail(email: string) {
  return await prisma.user.findFirst({ where: { email } });
}

async function getUserById(id: string) {
  return await prisma.user.findFirst({ where: { id } });
}

async function createUser(email: string, password: string, name: string) {
  return await prisma.user.create({
    data: {
      email,
      password,
      name,
    },
  });
}

export default {
  getUserByEmail,
  getUserById,
  createUser,
};
