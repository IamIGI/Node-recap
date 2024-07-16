import { GraphQLError } from 'graphql';

function sendError(text: string, code: number, errors?: { message: string }[]) {
  return Promise.reject(
    new GraphQLError(text, {
      extensions: {
        code,
        errors,
      },
    })
  );
}

export default {
  sendError,
};
