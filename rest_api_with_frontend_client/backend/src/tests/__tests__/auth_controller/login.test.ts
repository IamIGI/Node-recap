import authService from '../../../services/auth.service';
import userService from '../../../services/user.service';
import passwordUtil from '../../../utils/password.util';
import { MOCK_TOKEN, MOCK_USER } from '../../mocks/auth_controller.mocks';
import request from 'supertest';
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authRouter from '../../../routes/auth.route';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use('/auth', authRouter);

//Tell jest that I will declare mocked version of methods from given services
jest.mock('../../../services/user.service');
jest.mock('../../../services/auth.service.ts');
jest.mock('../../../utils/password.util');

describe('Auth Controller - login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and payload when success', async () => {
    (userService.getUserByEmail as jest.Mock).mockResolvedValue(MOCK_USER);
    (passwordUtil.comparePassword as jest.Mock).mockResolvedValue(true);
    (authService.getJWT_token as jest.Mock).mockResolvedValue(MOCK_TOKEN);

    const response = await request(app).post('/auth/login').send({
      email: MOCK_USER.email,
      password: MOCK_USER.password,
    });

    console.log(authService.getJWT_token);
    console.log(response.body);

    expect(userService.getUserByEmail).toHaveBeenCalledWith(MOCK_USER.email);
    expect(passwordUtil.comparePassword).toHaveBeenCalledWith(
      MOCK_USER.password,
      MOCK_USER
    );
    expect(authService.getJWT_token).toHaveBeenCalledWith(MOCK_USER);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ token: MOCK_TOKEN, userId: MOCK_USER.id });
  });
});
