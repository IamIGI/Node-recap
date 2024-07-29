import { User } from '@prisma/client';

export const MOCK_USER_DB: User = {
  id: '1',
  name: 'user',
  email: 'user@gmail.com',
  password: 'hashedPassword123!', //User123!
  status: 'Active',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const MOCK_USER_LOGIN_DATA = {
  email: 'user@gmail.com',
  password: 'User123!',
};

export const MOCK_HASHED_PASSWORD =
  'DJKASHDJKLHASJKLHDJKLWHAJKLH2JKjk0-jksdha2jk2h1231jk2';
export const MOCK_TOKEN = 'JWT_TOKEN.upDgxwPX1E/dSV63nx7qhyWsyBpyUqzW';
