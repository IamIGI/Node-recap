import { PostWithUserData } from '../../models/feed.model';

export const MOCK_POSTS: {
  countPosts: number;
  posts: PostWithUserData[];
} = {
  countPosts: 2,
  posts: [
    {
      id: 'post1',
      title: 'First Post',
      content: 'This is the first post.',
      imageUrl: '/images/post1.jpg',
      userId: '65272535-533d-4f80-b6a1-99a6423d474f',
      createdAt: new Date('2024-07-15T18:39:33.421Z'),
      updatedAt: new Date('2024-07-22T14:46:04.461Z'),
      user: {
        id: '65272535-533d-4f80-b6a1-99a6423d474f',
        createdAt: new Date('2024-07-15T18:39:33.421Z'),
        updatedAt: new Date('2024-07-22T14:46:04.461Z'),
        email: 'user@gmail.com',
        password:
          '$2b$10$Hf5U0OdQbYZM7x5gTS3E.upDgxwPX1E/dSV63nx7qhyWsyBpyUqzW',
        name: 'user',
        status: 'I am new!!!',
      },
    },
    {
      id: 'post2',
      title: 'Second Post',
      content: 'This is the second post.',
      imageUrl: '/images/post2.jpg',
      userId: 'user2',
      createdAt: new Date('2024-07-29T20:07:04.271Z'),
      updatedAt: new Date('2024-07-29T20:07:04.271Z'),
      user: {
        id: 'user2',
        name: 'User Two',
        createdAt: new Date('2024-07-29T20:07:04.271Z'),
        updatedAt: new Date('2024-07-29T20:07:04.271Z'),
        email: 'user2@gmail.com',
        password: 'hashedPassword',
        status: 'I am user two',
      },
    },
  ],
};

export const MOCK_POSTS_DTO = MOCK_POSTS.posts.map((post) => ({
  ...post,
  createdAt: (post.createdAt as Date).toISOString(),
  updatedAt: (post.updatedAt as Date).toISOString(),
  user: {
    ...post.user,
    createdAt: (post.user.createdAt as Date).toISOString(),
    updatedAt: (post.user.updatedAt as Date).toISOString(),
  },
  creator: {
    _id: post.user.id,
    name: post.user.name,
  },
}));

export const MOCK_NEW_POST = {
  id: 'post123',
  title: 'New Post Post',
  content: 'This is the first post.',
  imageUrl: '/images/post1.jpg',
  userId: '65272535-533d-4f80-b6a1-99a6423d474f',
  createdAt: new Date('2024-07-15T18:39:33.421Z'),
  updatedAt: new Date('2024-07-22T14:46:04.461Z'),
  user: {
    id: '65272535-533d-4f80-b6a1-99a6423d474f',
    createdAt: new Date('2024-07-15T18:39:33.421Z'),
    updatedAt: new Date('2024-07-22T14:46:04.461Z'),
    email: 'user@gmail.com',
    password: '$2b$10$Hf5U0OdQbYZM7x5gTS3E.upDgxwPX1E/dSV63nx7qhyWsyBpyUqzW',
    name: 'user',
    status: 'I am new!!!',
  },
};

export const MOCK_NEW_POST_DTO = {
  ...MOCK_NEW_POST,
  createdAt: (MOCK_NEW_POST.createdAt as Date).toISOString(),
  updatedAt: (MOCK_NEW_POST.updatedAt as Date).toISOString(),
  user: {
    ...MOCK_NEW_POST.user,
    createdAt: (MOCK_NEW_POST.user.createdAt as Date).toISOString(),
    updatedAt: (MOCK_NEW_POST.user.updatedAt as Date).toISOString(),
  },
  creator: {
    id: MOCK_NEW_POST.userId,
    name: MOCK_NEW_POST.user.name,
  },
};

export const MOCK_POST = MOCK_POSTS.posts[0];

export const MOCK_UPDATED_POST = {
  ...MOCK_POST,
  title: 'Updated Post',
  content: 'This is an updated post.',
};

export const MOCK_UPDATED_POST_DTO = {
  ...MOCK_UPDATED_POST,
  createdAt: (MOCK_UPDATED_POST.createdAt as Date).toISOString(),
  updatedAt: (MOCK_UPDATED_POST.updatedAt as Date).toISOString(),
  user: {
    ...MOCK_UPDATED_POST.user,
    createdAt: (MOCK_UPDATED_POST.user.createdAt as Date).toISOString(),
    updatedAt: (MOCK_UPDATED_POST.user.updatedAt as Date).toISOString(),
  },
  creator: {
    id: MOCK_UPDATED_POST.userId,
    name: MOCK_UPDATED_POST.user.name,
  },
};
