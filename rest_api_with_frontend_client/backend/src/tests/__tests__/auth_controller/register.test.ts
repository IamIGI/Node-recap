import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import authRouter from '../../../routes/auth.route';
import userService from '../../../services/user.service';
import dotenv from 'dotenv';
import passwordUtil from '../../../utils/password.util';

import {
  MOCK_HASHED_PASSWORD,
  MOCK_USER_DB,
} from '../../mocks/auth_controller.mocks';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use('/auth', authRouter);

//Tell jest that I will declare mocked version of methods from given services
jest.mock('../../../services/user.service');
jest.mock('../../../utils/password.util');
jest.mock('../../../services/auth.service.ts');

describe('Auth Controller - register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user', async () => {
    (userService.getUserByEmail as jest.Mock).mockResolvedValue(null);
    (passwordUtil.hashPassword as jest.Mock).mockReturnValue(
      MOCK_HASHED_PASSWORD
    );
    (userService.createUser as jest.Mock).mockResolvedValue(MOCK_USER_DB);

    const response = await request(app).put('/auth/register').send({
      email: MOCK_USER_DB.email,
      password: MOCK_USER_DB.password,
      name: MOCK_USER_DB.name,
    });

    expect(userService.getUserByEmail).toHaveBeenCalledWith(MOCK_USER_DB.email);
    expect(passwordUtil.hashPassword).toHaveBeenCalledWith(
      MOCK_USER_DB.password
    );
    expect(userService.createUser).toHaveBeenCalledWith(
      MOCK_USER_DB.email,
      MOCK_HASHED_PASSWORD,
      MOCK_USER_DB.name
    );

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'User created!',
      userId: MOCK_USER_DB.id,
    });
  });

  it('should return 422 if validation fails', async () => {
    const response = await request(app).put('/auth/register').send({
      email: 'invalid-email',
      password: 'short',
      name: '',
    });

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty(
      'message',
      'Validation failed, entered data is incorrect.'
    );
    expect(response.body.errors).toBeDefined();
  });

  it('should return 422 if email already exists', async () => {
    (userService.getUserByEmail as jest.Mock).mockResolvedValue(MOCK_USER_DB);

    const response = await request(app).put('/auth/register').send({
      email: MOCK_USER_DB.email,
      password: MOCK_USER_DB.password,
      name: MOCK_USER_DB.name,
    });

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty(
      'message',
      'Validation failed, entered data is incorrect.'
    );
    expect(response.body.errors).toBeDefined();
  });
});
