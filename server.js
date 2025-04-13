// CommonJS
// const {ApolloServer, gql} = require("apollo-server")
//  * "type": "module" => ES Modules
import { ApolloServer, gql } from "apollo-server";

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    firstname: String!
    lastname: String
  }
  type Tweet {
    id: ID!
    title: String!
    author: User!
  }
  type Query {
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }
  type Mutation {
    postTweet(title: String!, userID: ID!): Tweet!
    deleteTweet(id: ID!): Boolean
  }
`;

const server = new ApolloServer({ typeDefs });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
