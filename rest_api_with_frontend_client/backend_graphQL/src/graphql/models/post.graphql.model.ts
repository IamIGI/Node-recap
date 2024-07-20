import validator from 'validator';

import graphqlUtil from '../../utils/graphql.util';
import postService from '../../services/post.service';
import postUtils from '../../utils/post.utils';
import userService from '../../services/user.service';
import { GraphQLContext } from '../context';
import { Post } from '@prisma/client';
import fileUtils from '../../utils/file.utils';
import { PostWithUserData } from '../../models/feed.model';

export type PostInput = {
  title: string;
  content: string;
  imageUrl: string;
};

const typeDef = /* GraphQL */ `
  type Query {
    allPosts(page: Int!): PostData!
    postById(id: String!): Post!
  }
  type Mutation {
    createPost(data: PostInputData!): Post!
    updatePost(id: String!, userId: String!, data: PostInputData!): Post!
    deletePost(id: String!): Boolean!
  }

  type Creator {
    id: String!
    name: String!
  }

  type PostData {
    posts: [Post!]!
    totalPosts: Int!
  }

  type Post {
    id: ID!
    createdAt: String
    updatedAt: String

    title: String!
    imageUrl: String!
    content: String!
    user: User!
    creator: Creator!
  }

  input PostInputData {
    title: String!
    content: String!
    imageUrl: String
  }
`;

const resolvers = {
  Query: {
    allPosts: async (
      _parent: undefined,
      args: { page: number },
      context: GraphQLContext
    ) => {
      let { page } = args;
      if (!page) {
        page = 1;
      }

      const { prisma, req, res } = context;
      if (!req.isAuth) {
        return graphqlUtil.sendError('Not authenticated', 401);
      }

      let posts = await postService.getPosts(prisma, page);

      const postsDto = postUtils.getPostsDto(posts.posts);

      return {
        posts: postsDto,
        totalPosts: posts.countPosts,
      };
    },
    postById: async (
      _parent: undefined,
      args: { id: string },
      context: GraphQLContext
    ) => {
      console.log('PostById');

      const { prisma, req, res } = context;
      if (!req.isAuth) {
        return graphqlUtil.sendError('Not authenticated', 401);
      }

      let post = await postService.getPost(prisma, args.id);
      if (!post) {
        return graphqlUtil.sendError('No post found', 404);
      }

      const postDto = postUtils.getPostDto(post);

      return postDto;
    },
  },
  Mutation: {
    createPost: async (
      _parent: undefined,
      args: { data: PostInput },
      context: GraphQLContext
    ) => {
      const { prisma, req, res } = context;
      const { content, imageUrl, title } = args.data;

      if (!req.isAuth) {
        return graphqlUtil.sendError('Not authenticated', 401);
      }

      const errors = [];
      if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
        errors.push({ message: 'Title is invalid' });
      }
      if (
        validator.isEmpty(content) ||
        !validator.isLength(content, { min: 5 })
      ) {
        errors.push({ message: 'Content is invalid' });
      }

      if (errors.length > 0) {
        return graphqlUtil.sendError('Invalid input.', 422, errors);
      }

      const user = await userService.getUserById(prisma, req.userId);

      if (!user) {
        return graphqlUtil.sendError('Invalid user', 422);
      }

      // TODO: replace it later
      const createdPost = await postService.createPost(
        prisma,
        { title, content, imageUrl },
        user.id
      );

      if (!createdPost || !createdPost.user) {
        return graphqlUtil.sendError('Post was not created.', 422, errors);
      }

      const createdPostDto = postUtils.getPostDto(createdPost);
      return createdPostDto;
    },
    updatePost: async (
      _parent: undefined,
      args: { id: string; userId: string; data: PostWithUserData },
      context: GraphQLContext
    ) => {
      console.log('updatePost');

      const { prisma, req, res } = context;
      const { id, data, userId } = args;
      let { title, content, imageUrl } = data;

      if (!req.isAuth) {
        return graphqlUtil.sendError('Not authenticated', 401);
      }

      const errors = [];
      if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
        errors.push({ message: 'Title is invalid' });
      }
      if (
        validator.isEmpty(content) ||
        !validator.isLength(content, { min: 5 })
      ) {
        errors.push({ message: 'Content is invalid' });
      }

      if (errors.length > 0) {
        return graphqlUtil.sendError('Invalid input.', 422, errors);
      }

      try {
        const editedPost = await postService.getPost(prisma, id);

        if (!editedPost) {
          return graphqlUtil.sendError('No post found!', 404);
        }

        if (editedPost?.userId !== userId) {
          return graphqlUtil.sendError('No authorized', 403);
        }

        if (
          editedPost &&
          editedPost.imageUrl !== imageUrl &&
          imageUrl != undefined
        ) {
          fileUtils.deleteFile(editedPost.imageUrl);
        }
        if (!imageUrl) {
          if (editedPost.imageUrl[0] === '/')
            editedPost.imageUrl = editedPost.imageUrl.slice(1);

          imageUrl = editedPost.imageUrl;
        }
        const updatedPost = await postService.updatePost(prisma, id, {
          title,
          content,
          imageUrl,
        });

        const updatedPostDto = postUtils.getPostDto(updatedPost);

        return updatedPostDto;
      } catch (error) {
        console.log(error);
      }
    },
    deletePost: async (
      _parent: undefined,
      args: { id: string },
      context: GraphQLContext
    ) => {
      console.log('deletePost');
      const { prisma, req, res } = context;
      const { id } = args;

      if (!req.isAuth) {
        return graphqlUtil.sendError('Not authenticated', 401);
      }

      if (req.userId) {
        const post = await postService.getPost(prisma, id);

        if (post?.userId !== req.userId) {
          return graphqlUtil.sendError('User do not own this post', 401);
        }
      }

      const deletedPost = await postService.deletePost(prisma, id);

      if (deletedPost) fileUtils.deleteFile(deletedPost.imageUrl);

      return Boolean(deletedPost);
    },
  },
};

export default { typeDef, resolvers };
