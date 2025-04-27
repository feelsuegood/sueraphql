// CommonJS
// const {ApolloServer, gql} = require("apollo-server")
//  * "type": "module" => ES Modules
import { ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch";

let tweets = [
  { id: "1", text: "first one", userId: "2" },
  { id: "2", text: "second one", userId: "1" },
];

let users = [
  {
    id: "1",
    firstName: "Sue",
    lastName: "J",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Doe",
  },
];

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String
    """
    fullName is the sum of firstName + lastName as a string
    """
    fullName: String!
  }
  """
  Tweet objects shows each tweet that a user wrote
  """
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
  }
  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    allMovies: [Movie!]!
    tweet(id: ID!): Tweet
    movie(id: String!): Movie
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    """
    if id is found, delete tweet and return true , else retrun false
    """
    deleteTweet(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    allUsers() {
      console.log("allUsers are called");
      return users;
    },
    allTweets() {
      return tweets;
    },
    allMovies() {
      return fetch("https://yts.mx/api/v2/list_movies.json")
        .then((r) => r.json())
        .then((json) => json.data.movies);
    },
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    movie(_, { id }) {
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
        .then((r) => r.json())
        .then((json) => json.data.movie);
    },
  },
  Mutation: {
    // postTweet(root, { text, userId }) {
    postTweet(_, { text, userId }) {
      const user = users.find((user) => user.id === userId);
      if (!user) {
        return new Error("User not found");
      }
      const newTweet = {
        id: tweets.length + 1,
        text,
        userId,
      };
      tweets.push(newTweet);
      return newTweet;
    },

    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) {
        return false;
      }
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  User: {
    fullName({ firstName, lastName }) {
      // console.log(root);
      // console.log("fullName Called");
      return `${firstName} ${lastName}`;
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
