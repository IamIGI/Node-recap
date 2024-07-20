import { PostWithUserData } from '../models/feed.model';

function getPostsDto(posts: PostWithUserData[]) {
  const postsDto = posts?.map((post) => {
    return {
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      creator: {
        id: post.user.id,
        name: post.user.name,
      },
    };
  });

  return postsDto;
}

function getPostDto(post: PostWithUserData) {
  const postDto = {
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    creator: {
      id: post.userId,
      name: post.user.name,
    },
  };

  return postDto;
}

export default {
  getPostsDto,
  getPostDto,
};
