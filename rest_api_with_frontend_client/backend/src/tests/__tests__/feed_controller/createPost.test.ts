import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import express from 'express';
import request from 'supertest';

import feedRouter from '../../../routes/feed.router';
import { MOCK_NEW_POST, MOCK_NEW_POST_DTO } from '../../mocks/post.mocks';
import { MOCK_USER_DB } from '../../mocks/auth_controller.mocks';
import postService from '../../../services/post.service';
import postUtils from '../../../utils/post.utils';
import socketConfig from '../../../config/socket.config';

// Mocking the necessary services
jest.mock('../../../services/post.service');
jest.mock('../../../utils/post.utils');
jest.mock('../../../config/socket.config');

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use('/feed', feedRouter);

describe('POST /feed/post', () => {
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

  it('should create a new post', async () => {
    (postService.createPost as jest.Mock).mockResolvedValue(MOCK_NEW_POST);
    (postUtils.getPostDto as jest.Mock).mockReturnValue(MOCK_NEW_POST_DTO);

    const mockEmit = jest.fn();
    (socketConfig.getIO as jest.Mock).mockReturnValue({ emit: mockEmit });

    const response = await request(app)
      .post('/feed/post')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: MOCK_NEW_POST.title,
        content: MOCK_NEW_POST.content,
        imageUrl: MOCK_NEW_POST.imageUrl,
      });

    console.log(response);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Post created successfully',
      post: MOCK_NEW_POST_DTO,
    });

    expect(postService.createPost).toHaveBeenCalledWith(
      {
        title: MOCK_NEW_POST.title,
        content: MOCK_NEW_POST.content,
        imageUrl: MOCK_NEW_POST.imageUrl,
      },
      'mock-user-id'
    );
    expect(postUtils.getPostDto).toHaveBeenCalledWith(MOCK_NEW_POST);
    expect(socketConfig.getIO().emit).toHaveBeenCalledWith('posts', {
      action: 'create',
      post: MOCK_NEW_POST_DTO,
    });
  });
});
