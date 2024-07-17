import userService from '../../services/user.service';
import passwordUtil from '../../utils/password.util';

import validator from 'validator';
import graphqlUtil from '../../utils/graphql.util';
import authService from '../../services/auth.service';
import { User } from '@prisma/client';

import { GraphQLContext } from '../context';

export type UserInput = {
  name: string;
  email: string;
  password: string;
};

export type Auth = {
  token: string;
  userId: string;
};

const typeDef = /* GraphQL */ `
  # Query - Read operation
  type Query {
    allUsers: [User!]!
    userById(id: String): User
    login(email: String!, password: String!): AuthData!
  }

  # Mutations - CUD operations
  type Mutation {
    createUser(data: UserInputData!): User
    deleteUser(id: String): User
    updateUser(id: String, data: UserInputData!): User
  }

  input UserInputData {
    name: String!
    email: String!
    password: String!
  }

  type AuthData {
    token: String!
    userId: String!
  }

  type User {
    id: ID!
    createdAt: String
    updatedAt: String

    name: String!
    email: String!
    password: String!
    status: String!
    postsCreatedByUser: [Post!]!
  }
`;

const resolvers = {
  Query: {
    allUsers: async (
      _parent: undefined,
      _args: undefined,
      context: GraphQLContext
    ): Promise<User[]> => {
      return await userService.getAllUser(context.prisma);
    },
    userById: async (
      _parent: undefined,
      args: { id: string },
      context: GraphQLContext
    ): Promise<User | null> => {
      const { id } = args;
      return await userService.getUserById(context.prisma, id);
    },
    login: async (
      _parent: undefined,
      { email, password }: { email: string; password: string },
      context: GraphQLContext
    ): Promise<Auth> => {
      console.log('Login');
      const user = await userService.getUserByEmail(context.prisma, email);
      if (!user) {
        return graphqlUtil.sendError('User not found', 401);
      }

      const isMatch = await passwordUtil.comparePassword(password, user);
      if (!isMatch) {
        return graphqlUtil.sendError('Wrong password', 401);
      }

      const token = authService.getJWT_token(user);

      return { token: token, userId: user.id };
    },
  },
  Mutation: {
    createUser: async (
      _parent: undefined,
      args: { data: UserInput },
      context: GraphQLContext
    ) => {
      const { email, name, password } = args.data;
      const errors = [];
      if (!validator.isEmail(email)) {
        errors.push({ message: 'E-mail is invalid' });
      }

      if (
        validator.isEmpty(password) ||
        !validator.isLength(password, { min: 5 })
      ) {
        errors.push({ message: 'Password too short!' });
      }

      if (errors.length > 0) {
        return graphqlUtil.sendError('Invalid input.', 422, errors);
      }

      const existingUser = await userService.getUserByEmail(
        context.prisma,
        email
      );

      if (existingUser) {
        return graphqlUtil.sendError('User already exists.', 422);
      }
      const hashedPassword = passwordUtil.hashPassword(password);

      return await userService.createUser(
        context.prisma,
        email,
        hashedPassword,
        name
      );
    },
    deleteUser: async (
      _parent: undefined,
      args: { id: string },
      context: GraphQLContext
    ) => {
      return userService.deleteUser(context.prisma, args.id);
    },
    updateUser: async (
      _parent: undefined,
      args: { id: string; data: UserInput },
      context: GraphQLContext
    ) => {
      const { id, data } = args;
      return userService.updateUser(context.prisma, id, data);
    },
  },
  User: {
    name: (obj: { name: string }) => obj.name.trim().toUpperCase(),
  },
};

export default { typeDef, resolvers };
