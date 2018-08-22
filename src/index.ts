import express from "express";
import {
  ApolloServer,
  gql,
  IResolvers,
  IResolverObject
} from "apollo-server-express";

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
    helloAsync: String
  }
`;

type QueryResolver = {
  hello: () => string | Promise<string>;
  helloAsync: () => string | Promise<string>;
};

const QueryResolverImpl: QueryResolver = {
  hello: () => {
    return "Hello world!!";
  },

  helloAsync: () => {
    return Promise.resolve("Hello async!!");
  }
};

const resolvers: IResolvers = {
  Query: QueryResolverImpl
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
