import React, { Component } from 'react';

import Image from '../../../components/Image/Image';
import './SinglePost.css';

class SinglePost extends Component {
  state = {
    title: '',
    author: '',
    date: '',
    image: '',
    content: '',
  };

  url = 'http://localhost:8080/graphql';

  componentDidMount() {
    const postId = this.props.match.params.postId;

    const query = /* GraphQL */ `
      query getPost($id: String!) {
        postById(id: $id) {
          id
          createdAt
          updatedAt
          title
          content
          imageUrl
          creator {
            name
          }
        }
      }
    `;

    fetch(`${this.url}`, {
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
        if (resData.errors) {
          throw new Error('Fetching posts failed.');
        }
        console.log(resData.data);
        const post = resData.data.postById;
        this.setState({
          title: post.title,
          author: post.creator.name,
          image: `http://localhost:8080${post.imageUrl}`,
          date: new Date(post.createdAt).toLocaleDateString('en-US'),
          content: post.content,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;
