import postGraphqlModel from './models/post.graphql.model';
import userGraphqlModel from './models/user.graphql.model';

export const typeDefinitions = [
  userGraphqlModel.typeDef,
  postGraphqlModel.typeDef,
];
