import { merge } from 'lodash';
import userGraphqlModel from './models/user.graphql.model';

export const resolvers = merge(userGraphqlModel.resolvers);
