import gql from 'graphql-tag';

export const QUERY_ME = gql`
  {
    me {
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
