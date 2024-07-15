import { GraphQLError } from 'graphql';
import userService from '../../services/user.service';
import passwordUtil from '../../utils/password.util';
import { Context } from '../context';
import validator from 'validator';

export type UserInput = {
  name: string;
  email: string;
  password: string;
};

const typeDef = /* GraphQL */ `
  # Query - Read operation
  type Query {
    allUsers: [User!]!
    userById(id: String): User
  }

  #Mutations  - CUD operations
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
    allUsers: (_parent: undefined, _args: undefined, context: Context) => {
      return userService.getAllUser(context.prisma);
    },
    userById: (_parent: undefined, args: { id: string }, context: Context) => {
      const { id } = args;
      return userService.getUserById(context.prisma, id);
    },
  },
  //TODO: Done next
  Mutation: {
    createUser: async (
      _parent: undefined,
      args: { data: UserInput },
      context: Context
    ) => {
      const { email, name, password } = args.data;
      // TODO: email     String   @unique
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
        // let error: {data: {message: string}[] | undefined, code: number | undefined} = {}
        // error.data = errors;
        // error.code = 422;

        return Promise.reject(
          new GraphQLError('Invalid input.', {
            extensions: {
              code: 422,
              errors,
            },
          })
        );
      }

      const existingUser = await userService.getUserByEmail(
        context.prisma,
        email
      );

      if (existingUser) {
        return Promise.reject(new GraphQLError('User already exists.'));
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
      context: Context
    ) => {
      return userService.deleteUser(context.prisma, args.id);
    },
    updateUser: async (
      _parent: undefined,
      args: { id: string; data: UserInput },
      context: Context
    ) => {
      const { id, data } = args;
      return userService.updateUser(context.prisma, id, data);
    },
  },
  //Modify returned fields when called from given types
  User: {
    name: (obj: { name: string }) => obj.name.trim().toUpperCase(),
  },
};

export default { typeDef, resolvers };
