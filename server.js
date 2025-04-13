// CommonJS
// const {ApolloServer, gql} = require("apollo-server")
//  * "type": "module" => ES Modules
import { ApolloServer, gql } from "apollo-server";

const typeDefs = gql`
  type Director {
    id: ID
    name: String
  }
  type Movie {
    id: ID
    title: String
    director: Director
  }
  type Query {
    allMoview: [Movie]
    movie(id: ID): Movie
  }
`;

const server = new ApolloServer({ typeDefs });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
