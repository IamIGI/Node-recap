const typeDef = /* GraphQL */ `
  type Post {
    id: ID!
    createdAt: String
    updatedAt: String

    title: String!
    imageUrl: String!
    content: String!
    user: User!
  }
`;

const resolvers = {};

export default { typeDef, resolvers };
