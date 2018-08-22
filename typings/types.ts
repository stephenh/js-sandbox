/* tslint:disable */
import { GraphQLResolveInfo } from "graphql";

export type Resolver<Result, Parent = any, Context = any, Args = any> = (
  parent: Parent,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<Result> | Result;

export type SubscriptionResolver<
  Result,
  Parent = any,
  Context = any,
  Args = any
> = {
  subscribe<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo
  ): AsyncIterator<R | Result>;
  resolve?<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo
  ): R | Result | Promise<R | Result>;
};

export interface Query {
  hello: string;
  helloAsync: string;
  employees?: (Employee | null)[] | null;
  employers?: (Employer | null)[] | null;
}

export interface Employee {
  uuid: string;
  firstName?: string | null;
}

export interface Employer {
  uuid: string;
  name: string;
}

export namespace QueryResolvers {
  export interface Resolvers<Context = any> {
    hello?: HelloResolver<string, any, Context>;
    helloAsync?: HelloAsyncResolver<string, any, Context>;
    employees?: EmployeesResolver<(Employee | null)[] | null, any, Context>;
    employers?: EmployersResolver<(Employer | null)[] | null, any, Context>;
  }

  export type HelloResolver<R = string, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type HelloAsyncResolver<
    R = string,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type EmployeesResolver<
    R = (Employee | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type EmployersResolver<
    R = (Employer | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace EmployeeResolvers {
  export interface Resolvers<Context = any> {
    uuid?: UuidResolver<string, any, Context>;
    firstName?: FirstNameResolver<string | null, any, Context>;
  }

  export type UuidResolver<R = string, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type FirstNameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace EmployerResolvers {
  export interface Resolvers<Context = any> {
    uuid?: UuidResolver<string, any, Context>;
    name?: NameResolver<string, any, Context>;
  }

  export type UuidResolver<R = string, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type NameResolver<R = string, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
}
