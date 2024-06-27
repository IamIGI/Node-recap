import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function getUser(email: string) {
  return await prisma.user.findFirst({ where: { email } });
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
  getUser,
  createUser,
};
