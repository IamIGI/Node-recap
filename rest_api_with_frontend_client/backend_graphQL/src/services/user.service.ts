import { PrismaClient, User } from '@prisma/client';
import { UpdateUser } from '../models/user.model';

async function getAllUser(prisma: PrismaClient) {
  return await prisma.user.findMany({});
}

async function getUserByEmail(prisma: PrismaClient, email: string) {
  return await prisma.user.findFirst({ where: { email } });
}

async function getUserById(prisma: PrismaClient, id: string) {
  return await prisma.user.findFirst({ where: { id } });
}

async function createUser(
  prisma: PrismaClient,
  email: string,
  password: string,
  name: string
): Promise<User | undefined> {
  try {
    return await prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });
  } catch (error) {
    console.log('Could not create an user');
    console.error(error);
    return undefined;
  }
}

async function updateUser(
  prisma: PrismaClient,
  userId: string,
  data: UpdateUser
) {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: { ...data },
  });
}

async function updateStatus(
  prisma: PrismaClient,
  userId: string,
  status: string
) {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: { status },
  });
}

async function deleteUser(
  prisma: PrismaClient,
  id: string
): Promise<User | undefined> {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    return deletedUser;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export default {
  getAllUser,
  getUserByEmail,
  getUserById,
  createUser,
  updateUser,
  updateStatus,
  deleteUser,
};
