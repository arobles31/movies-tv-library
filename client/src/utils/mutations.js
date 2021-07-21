import gql from 'graphql-tag';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_MEDIA = gql`
  mutation saveMedia($mediaData: MediaInput!) {
    saveMedia(mediaData: $mediaData) {
      _id
      username
      email
      savedMedia {
        mediaId
        image
        description
        title
      }
    }
  }
`;

export const REMOVE_MEDIA = gql`
  mutation removeMedia($mediaId: ID!) {
    removeMedia(mediaId: $mediaId) {
      _id
      username
      email
      savedMedia {
        mediaId
        image
        description
        title
      }
    }
  }
`;
