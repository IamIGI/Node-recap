import { PrismaClient, User } from '@prisma/client';
import { AddUser } from '../models/user.model';
const prisma = new PrismaClient();

async function getUsers() {
  const users = await prisma.user.findFirstOrThrow();

  return users;
}

async function addUser(user: AddUser): Promise<User | undefined> {
  const { name, email } = user;

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    return newUser;
  } catch (e) {
    console.error(e);
  }
}

export default { getUsers, addUser };
