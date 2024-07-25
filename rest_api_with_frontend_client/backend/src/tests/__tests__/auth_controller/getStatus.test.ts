import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import express from 'express';
import authRouter from '../../../routes/auth.route';
import { MOCK_USER } from '../../mocks/auth_controller.mocks';
import userService from '../../../services/user.service';
import request from 'supertest';

dotenv.config();

//Tell jest that I will declare mocked version of methods from given services
jest.mock('../../../services/user.service');
jest.mock('../../../utils/password.util');
jest.mock('../../../services/auth.service.ts');

const app = express();
app.use(bodyParser.json());
app.use('/auth', authRouter);

describe('Auth Controller - getUserStatus', () => {
  let token: string;

  const jwt_token = process.env.JWT_SECRET_TOKEN;
  const jwt_expires_time = process.env.JWT_TOKEN_EXPIRES;

  beforeAll(() => {
    token = jwt.sign(
      { email: MOCK_USER.email, userId: MOCK_USER.id },
      jwt_token as string,
      { expiresIn: jwt_expires_time }
    );
  });

  it('should return the status of the user', async () => {
    (userService.getUserById as jest.Mock).mockResolvedValue(MOCK_USER);

    const response = await request(app)
      .get('/auth/status')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: MOCK_USER.status });
  });

  it('should return 404 if user not found', async () => {
    (userService.getUserById as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .get('/auth/status')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'User not found' });
  });

  it('should return 401 if no token is provided', async () => {
    const response = await request(app).get('/auth/status');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'missing authorization token' });
  });
});
