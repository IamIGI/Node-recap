import { merge } from 'lodash';
import userGraphqlModel from './models/user.graphql.model';
import postGraphqlModel from './models/post.graphql.model';

export const resolvers = merge(
  userGraphqlModel.resolvers,
  postGraphqlModel.resolvers
);
