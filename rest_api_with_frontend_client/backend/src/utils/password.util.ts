import { User } from '@prisma/client';
import bcrypt from 'bcrypt';

function hashPassword(password: string) {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
}

async function comparePassword(password: string, user: User) {
  return await bcrypt.compare(password, user.password);
}

export default {
  hashPassword,
  comparePassword,
};
