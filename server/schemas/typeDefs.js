const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Mutation {
  login(email: String!, password: String!): Auth
  addUser(username: String!, email: String!, password: String!): Auth
  saveMedia(mediaData: MediaInput!): User
  removeMedia(mediaId: ID!): User
}

type User {
    _id: ID!
    username: String!
    email: String
    mediaCount: Int
    savedMedia: [Media]
  }

type Media {
    mediaId: ID!
    description: String
    image: String
    title: String!
  }

input MediaInput {
    description: String!
    mediaId: Int!
    image: String
    title: String!
  }

type Query {
    me: User
  }

  type Auth {
    token: ID!
    user: User
  }


`;

module.exports = typeDefs;
