import bcrypt from 'bcrypt';

function hashPassword(password: string) {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
}

export default {
  hashPassword,
};
