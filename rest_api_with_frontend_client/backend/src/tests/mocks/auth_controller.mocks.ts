import { User } from '@prisma/client';

export const MOCK_USER: User = {
  id: '1',
  email: 'user@gmail.com',
  name: 'user',
  password: 'User123!',
  status: 'Active',
  createdAt: new Date(),
  updatedAt: new Date(),
};
export const MOCK_HASHED_PASSWORD: string =
  '$2b$10$Hf5U0OdQbYZM7x5gTS3E.upDgxwPX1E/dSV63nx7qhyWsyBpyUqzW';
export const MOCK_TOKEN: string = 'JWT_TOKEN.upDgxwPX1E/dSV63nx7qhyWsyBpyUqzW';
