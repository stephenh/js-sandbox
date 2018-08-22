import express from "express";
import { ApolloServer, gql, IResolvers } from "apollo-server-express";

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String!
    helloAsync: String!
    employees: [Employee]
    employers: [Employer]
  }

  type Employee {
    uuid: String!
    firstName: String
  }

  type Employer {
    uuid: String!
    name: String!
  }
`;

// Regular code generated GQL types
type Employee = {
  uuid: string;
  firstName: string | null;
};

type Employer = {
  uuid: string;
  name: string;
};

// The code generated resolver contract
type QueryResolver = {
  hello: () => string | Promise<string>;
  helloAsync: () => string | Promise<string>;
  employees: () => EmployeeRoot[] | Promise<EmployeeRoot[]>;
  employers: () => EmployerRoot[] | Promise<EmployerRoot[]>;
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
  },

  employers: () => {
    return [{ key: "instance", value: { uuid: "1", name: "employer1" } }];
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

// I want this to be a private helper method inside the resolver impl, but its just a dictionary
function fetchEmployee(uuid: string): Employee {
  return { uuid, firstName: `employee${uuid}` };
}

// This is an example of a root that could be different things
type EmployerRoot =
  | { key: "uuid"; value: string }
  | { key: "instance"; value: Employer };

// The code generated resolver contract
type EmployerResolver = {
  uuid: (root: EmployerRoot) => string | Promise<string>;

  name: (root: EmployerRoot) => string | Promise<string>;
};

// The hand-written implementation
const EmployerResolverImpl: EmployerResolver = {
  uuid: root => fetchEmployerIfNeeded(root).then(root => root.uuid),

  name: root => fetchEmployerIfNeeded(root).then(root => root.name)
};

function fetchEmployerIfNeeded(root: EmployerRoot): Promise<Employer> {
  switch (root.key) {
    case "uuid":
      return Promise.resolve({ uuid: "1", name: `employer1` });
    case "instance":
      return Promise.resolve(root.value);
  }
}

const resolvers: IResolvers = {
  Query: QueryResolverImpl,
  Employee: EmployeeResolverImpl,
  Employer: EmployerResolverImpl
};

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
server.applyMiddleware({ app });
app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
