import validator from 'validator';

import graphqlUtil from '../../utils/graphql.util';
import postService from '../../services/post.service';
import postUtils from '../../utils/post.utils';
import userService from '../../services/user.service';
import { GraphQLContext } from '../context';

export type PostInput = {
  title: string;
  content: string;
  imageUrl: string;
};

const typeDef = /* GraphQL */ `
  type Query {
    allPosts(page: Int!): PostData!
  }
  type Mutation {
    createPost(data: PostInputData!): Post!
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
    imageUrl: String!
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
  },
};

export default { typeDef, resolvers };
