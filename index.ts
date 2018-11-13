import {List} from "immutable";

class Foo {

  public name!: string;
  public colors!: List<string>;

  constructor(foo?: Partial<Foo>) {
  }

  public copy(foo: Partial<Foo>): this {
    return this;
  }
}

const foo = new Foo();
console.log(foo.name);
console.log(foo.colors);

const bar = foo.copy({ colors: foo.colors });

