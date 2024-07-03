import { PrismaClient } from '@prisma/client';
import { UpdateUser } from '../models/user.model';
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

async function updateUser(userId: string, data: UpdateUser) {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: { ...data },
  });
}

export default {
  getUserByEmail,
  getUserById,
  createUser,
  updateUser,
};
