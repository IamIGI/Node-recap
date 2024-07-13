import userService from '../../services/user.service';
import { Context } from '../context';

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
    createUser(data: NewUserInput!): User
    deleteUser(id: String): User
    updateUser(id: String, data: NewUserInput!): User
  }

  input NewUserInput {
    name: String!
    email: String!
    password: String!
  }

  type User {
    id: String
    createdAt: String
    updatedAt: String

    name: String
    email: String
    password: String
    status: String
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
      console.log('Create user mock');
      //   return userService.createUser(context.prisma, args.data);
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
