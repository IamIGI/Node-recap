import React, { Component, Fragment } from 'react';

import Post from '../../components/Feed/Post/Post';
import Button from '../../components/Button/Button';
import FeedEdit from '../../components/Feed/FeedEdit/FeedEdit';
import Input from '../../components/Form/Input/Input';
import Paginator from '../../components/Paginator/Paginator';
import Loader from '../../components/Loader/Loader';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import './Feed.css';

class Feed extends Component {
  state = {
    isEditing: false,
    posts: [],
    totalPosts: 0,
    editPost: null,
    status: '',
    postPage: 1,
    postsLoading: true,
    editLoading: false,
  };

  baseUrl = 'http://localhost:8080/graphql';

  componentDidMount() {
    const query = /* GraphQL */ `
      query getUserById($userId: String!) {
        userById(id: $userId) {
          status
        }
      }
    `;
    fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          userId: this.props.userId,
        },
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.errors) {
          throw new Error('Fetching status failed.');
        }
        this.setState({ status: resData.data.userById.status });
      })
      .catch(this.catchError);

    this.loadPosts();
  }

  loadPosts = (direction) => {
    if (direction) {
      this.setState({ postsLoading: true, posts: [] });
    }
    let page = this.state.postPage;
    if (direction === 'next') {
      page++;
      this.setState({ postPage: page });
    }
    if (direction === 'previous') {
      page--;
      this.setState({ postPage: page });
    }

    //We could use it then in whole app, so we do not need to every time explicitly says what we want
    const POST_FIELDS_FRAGMENT = /* GraphQL */ `
      fragment PostFields on Post {
        id
        createdAt
        updatedAt
        title
        imageUrl
        content
        user {
          id
          email
          name
          status
        }
        creator {
          id
          name
        }
      }
    `;

    const query = /* GraphQL */ `
      query getPosts($page: Int!) {
        allPosts(page: $page) {
          posts {
            ...PostFields
          }
          totalPosts
        }
      }
      ${POST_FIELDS_FRAGMENT}
    `;

    fetch(`${this.baseUrl}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          page,
        },
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.errors) {
          throw new Error('Fetching posts failed.');
        }
        console.log(resData.data);
        this.setState({
          posts: resData.data.allPosts.posts.map((post) => {
            return { ...post, imagePath: post.imageUrl };
          }),
          totalPosts: resData.data.allPosts.totalPosts,
          postsLoading: false,
        });
      })
      .catch(this.catchError);
  };

  statusUpdateHandler = (event) => {
    event.preventDefault();

    const query = /* GraphQL */ `
      mutation UpdateStatus($userId: String!, $status: String!) {
        updateStatus(id: $userId, status: $status) {
          status
        }
      }
    `;
    fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          userId: this.props.userId,
          status: this.state.status,
        },
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.errors) {
          throw new Error('Fetching posts failed.');
        }
        console.log(resData);
      })
      .catch(this.catchError);
  };

  newPostHandler = () => {
    this.setState({ isEditing: true });
  };

  startEditPostHandler = (postId) => {
    this.setState((prevState) => {
      const loadedPost = { ...prevState.posts.find((p) => p.id === postId) };

      return {
        isEditing: true,
        editPost: loadedPost,
      };
    });
  };

  cancelEditHandler = () => {
    this.setState({ isEditing: false, editPost: null });
  };

  finishEditHandler = (postData) => {
    this.setState({
      editLoading: true,
    });
    const formData = new FormData();
    formData.append('image', postData.image);
    if (this.state.editPost) {
      formData.append('oldPath', this.state.editPost.imagePath);
    }
    fetch('http://localhost:8080/post-image', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.props.token}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((fileResData) => {
        const imageUrl = fileResData.filePath;
        let query = /* GraphQL */ `
          mutation CreatePost($postInputData: PostInputData!) {
            createPost(data: $postInputData) {
              id
              title
              content
              imageUrl
              creator {
                id
                name
              }
              createdAt
            }
          }
        `;

        let variables = {
          postInputData: {
            title: postData.title,
            content: postData.content,
            imageUrl,
          },
        };

        if (this.state.editPost) {
          query = /* GraphQL */ `
            mutation UpdatePost(
              $id: String!
              $userId: String!
              $data: PostInputData!
            ) {
              updatePost(id: $id, userId: $userId, data: $data) {
                id
                title
                content
                imageUrl
                creator {
                  id
                  name
                }
                createdAt
              }
            }
          `;

          console.log(this.state.editPost);
          variables = {
            id: this.state.editPost.id,
            userId: this.state.editPost.creator.id,
            data: {
              title: postData.title,
              content: postData.content,
              imageUrl,
            },
          };
          console.log(variables);
        }

        // this.setState({ authLoading: true });
        //GraphQL request
        return fetch(`${this.baseUrl}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.props.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables,
          }),
        });
      })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        if (resData.errors && resData.errors[0].extensions.status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (resData.errors) {
          throw new Error('User login failed!');
        }

        let resDataField = this.state.editPost ? 'updatePost' : 'createPost';
        let postData = resData.data[resDataField];

        const post = {
          id: postData.id,
          title: postData.title,
          content: postData.content,
          creator: postData.creator,
          createdAt: postData.createdAt,
          imageUrl: postData.imageUrl,
        };
        this.setState((prevState) => {
          let updatedPosts = [...prevState.posts];
          if (prevState.editPost) {
            const postIndex = prevState.posts.findIndex(
              (p) => p.id === prevState.editPost.id
            );
            updatedPosts[postIndex] = post;
          } else {
            if (prevState.posts.length >= 2) {
              updatedPosts.pop();
            }
            updatedPosts.unshift(post);
          }
          return {
            posts: updatedPosts,
            isEditing: false,
            editPost: null,
            editLoading: false,
          };
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isEditing: false,
          editPost: null,
          editLoading: false,
          error: err,
        });
      });
  };

  statusInputChangeHandler = (input, value) => {
    this.setState({ status: value });
  };

  deletePostHandler = (postId) => {
    this.setState({ postsLoading: true });

    const query = /* GraphQL */ `
      mutation deletePost($id: String!) {
        deletePost(id: $id)
      }
    `;

    fetch(`${this.baseUrl}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          id: postId,
        },
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        console.log(resData);

        if (resData.errors) {
          throw new Error('Delete post failed!');
        }
        this.loadPosts();
        // this.setState((prevState) => {
        //   const updatedPosts = prevState.posts.filter((p) => p.id !== postId);
        //   return { posts: updatedPosts, postsLoading: false };
        // });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ postsLoading: false });
      });
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = (error) => {
    this.setState({ error: error });
  };

  render() {
    return (
      <Fragment>
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        <FeedEdit
          editing={this.state.isEditing}
          selectedPost={this.state.editPost}
          loading={this.state.editLoading}
          onCancelEdit={this.cancelEditHandler}
          onFinishEdit={this.finishEditHandler}
        />
        <section className="feed__status">
          <form onSubmit={this.statusUpdateHandler}>
            <Input
              type="text"
              placeholder="Your status"
              control="input"
              onChange={this.statusInputChangeHandler}
              value={this.state.status}
            />
            <Button mode="flat" type="submit">
              Update
            </Button>
          </form>
        </section>
        <section className="feed__control">
          <Button mode="raised" design="accent" onClick={this.newPostHandler}>
            New Post
          </Button>
        </section>
        <section className="feed">
          {this.state.postsLoading && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Loader />
            </div>
          )}
          {this.state.posts.length <= 0 && !this.state.postsLoading ? (
            <p style={{ textAlign: 'center' }}>No posts found.</p>
          ) : null}
          {!this.state.postsLoading && (
            <Paginator
              onPrevious={this.loadPosts.bind(this, 'previous')}
              onNext={this.loadPosts.bind(this, 'next')}
              lastPage={Math.ceil(this.state.totalPosts / 2)}
              currentPage={this.state.postPage}
            >
              {this.state.posts.map((post) => (
                <Post
                  key={post.id}
                  id={post.id}
                  author={post.creator.name}
                  date={new Date(post.createdAt).toLocaleDateString('en-US')}
                  title={post.title}
                  image={post.imageUrl}
                  content={post.content}
                  onStartEdit={this.startEditPostHandler.bind(this, post.id)}
                  onDelete={this.deletePostHandler.bind(this, post.id)}
                />
              ))}
            </Paginator>
          )}
        </section>
      </Fragment>
    );
  }
}

export default Feed;
