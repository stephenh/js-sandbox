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

// These are the regular code-generated GQL types, written by hand for now
type Employee = {
  uuid: string;
  firstName: string | null;
};

type Employer = {
  uuid: string;
  name: string;
};

// These are the prototype code-generated resolver contracts
type QueryResolver = {
  hello: () => string | Promise<string>;
  helloAsync: () => string | Promise<string>;
  employees: () => EmployeeRoot[] | Promise<EmployeeRoot[]>;
  employers: () => EmployerRoot[] | Promise<EmployerRoot[]>;
};

type EmployeeResolver = {
  uuid: (root: EmployeeRoot) => string;
  firstName: (root: EmployeeRoot) => string | null;
};

type EmployerResolver = {
  uuid: (root: EmployerRoot) => string | Promise<string>;
  name: (root: EmployerRoot) => string | Promise<string>;
};

// We would hand-write the "root" type alias for each resolver, e.g. what
// the upstream resolvers must pass down to the resolver
type EmployeeRoot = string;

// This is an example of a root that could be different things, using the
// JS/TS idiom of tagged/discriminated unions (basically ADTs if you squint)
type EmployerRoot =
  | { tag: "uuid"; value: string }
  | { tag: "instance"; value: Employer };

// Now we have our hand-written resolver implementations that must meet
// the codegen'd contracts
const QueryResolverImpl: QueryResolver = {
  hello: () => "Hello world!!",

  helloAsync: () => {
    return Promise.resolve("Hello async!!");
  },

  employees: () => {
    // pretend i got this list from some where
    return [1, 2, 3].map(id => id.toString());
  },

  employers: () => {
    return [{ tag: "instance", value: { uuid: "1", name: "employer1" } }];
  }
};

const EmployeeResolverImpl: EmployeeResolver = {
  uuid: root => fetchEmployee(root).uuid,
  firstName: root => fetchEmployee(root).firstName
};

// Ideally this would be a private helper method inside of EmployeeResolverImpl
// but right now everything are hashes instead of objects b/c that's what graphql wants
function fetchEmployee(uuid: string): Employee {
  return { uuid, firstName: `employee${uuid}` };
}

const EmployerResolverImpl: EmployerResolver = {
  uuid: root => fetchEmployerIfNeeded(root).then(root => root.uuid),
  name: root => fetchEmployerIfNeeded(root).then(root => root.name)
};

// This can be intelligent about "did you already fetch the object for me"?
async function fetchEmployerIfNeeded(root: EmployerRoot): Promise<Employer> {
  switch (root.tag) {
    case "uuid":
      return { uuid: "1", name: `employer1` };
    case "instance":
      return root.value;
  }
}

// Now we have the usual GraphQL resolver definition + server config/boot
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
