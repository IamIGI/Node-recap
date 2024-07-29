import userService from '../../../services/user.service';
import request from 'supertest';
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authRouter from '../../../routes/auth.route';
import isAuth from '../../../middleware/is-auth';
import { MOCK_USER_DB } from '../../mocks/auth_controller.mocks';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(isAuth); // Apply the auth middleware
app.use('/auth', authRouter);

// Mock the methods
jest.mock('../../../services/user.service');

describe('Auth Controller - updateUserStatus', () => {
  let token: string;

  const jwt_token = process.env.JWT_SECRET_TOKEN;
  const jwt_expires_time = process.env.JWT_TOKEN_EXPIRES;

  beforeAll(() => {
    token = jwt.sign(
      { email: MOCK_USER_DB.email, userId: MOCK_USER_DB.id },
      jwt_token as string,
      { expiresIn: jwt_expires_time }
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and update the user status when successful', async () => {
    (userService.getUserById as jest.Mock).mockResolvedValue(MOCK_USER_DB);
    (userService.updateUser as jest.Mock).mockResolvedValue({
      ...MOCK_USER_DB,
      status: 'New Status',
    });

    const response = await request(app)
      .patch('/auth/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'New Status' });

    expect(userService.getUserById).toHaveBeenCalledWith(MOCK_USER_DB.id);
    expect(userService.updateUser).toHaveBeenCalledWith(MOCK_USER_DB.id, {
      status: 'New Status',
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'User updated!' });
  });

  it('should return 404 if user is not found', async () => {
    (userService.getUserById as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .patch('/auth/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'New Status' });

    expect(userService.getUserById).toHaveBeenCalledWith(MOCK_USER_DB.id);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'User not found' });
  });
});
