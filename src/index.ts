import express from "express";
import { ApolloServer, gql, IResolvers } from "apollo-server-express";

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String!
    helloAsync: String!
    employees: [Employee]
  }

  type Employee {
    uuid: String!
    firstName: String
  }
`;

// Regular code generated GQL types
type Employee = {
  uuid: string;
  firstName: string | null;
};

// The code generated resolver contract
type QueryResolver = {
  hello: () => string | Promise<string>;
  helloAsync: () => string | Promise<string>;
  employees: () => EmployeeRoot[] | Promise<EmployeeRoot[]>;
};

// The hand-written implementation
const QueryResolverImpl: QueryResolver = {
  hello: () => {
    return "Hello world!!";
  },

  helloAsync: () => {
    return Promise.resolve("Hello async!!");
  },

  employees: () => {
    // pretend i got this list from some where
    return [1, 2, 3].map(id => id.toString());
  }
};

// This is an example of a root that is always the primary key
type EmployeeRoot = string;

// The code generated resolver contract
type EmployeeResolver = {
  uuid: (root: EmployeeRoot) => string;

  firstName: (root: EmployeeRoot) => string | null;
};

// The hand-written implementation
const EmployeeResolverImpl: EmployeeResolver = {
  uuid: root => fetchEmployee(root).uuid,

  firstName: root => fetchEmployee(root).firstName
};

// i want these to be methods not dictionaries
function fetchEmployee(uuid: string): Employee {
  return { uuid, firstName: `employee${uuid}` };
}

const resolvers: IResolvers = {
  Query: QueryResolverImpl,
  Employee: EmployeeResolverImpl
};

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
server.applyMiddleware({ app });
app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
