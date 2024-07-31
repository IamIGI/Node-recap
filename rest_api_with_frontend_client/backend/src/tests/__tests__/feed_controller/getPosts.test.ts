import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import express from 'express';
import request from 'supertest';

import feedRouter from '../../../routes/feed.router';
import { MOCK_POSTS, MOCK_POSTS_DTO } from '../../mocks/post.mocks';
import { MOCK_USER_DB } from '../../mocks/auth_controller.mocks';
import postService from '../../../services/post.service';
import postUtils from '../../../utils/post.utils';

// Mocking the necessary services
jest.mock('../../../services/post.service');
jest.mock('../../../utils/post.utils');

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use('/feed', feedRouter);

describe('GET /feed/posts', () => {
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

  it('should fetch posts successfully', async () => {
    (postService.getPosts as jest.Mock).mockResolvedValue(MOCK_POSTS);
    (postUtils.getPostsDto as jest.Mock).mockReturnValue(MOCK_POSTS_DTO);

    const response = await request(app)
      .get('/feed/posts')
      .set('Authorization', `Bearer ${token}`)
      .query({ page: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Fetched posts successfully',
      posts: MOCK_POSTS_DTO,
      totalItems: MOCK_POSTS.countPosts,
    });

    expect(postService.getPosts).toHaveBeenCalledWith(1);
    expect(postUtils.getPostsDto).toHaveBeenCalledWith(MOCK_POSTS.posts);
  });
});
