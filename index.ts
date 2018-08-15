console.log("foo bar");

import DataLoader from "dataloader";

let loads = 0;

const dl = new DataLoader<number, string>(keys => {
  loads++;
  let resolver: ((a: string[]) => void) | null = null;
  let p = new Promise<string[]>((resolve, reject) => {
    resolver = resolve;
  });
  setTimeout(() => {
    if (resolver) {
      resolver(keys.map(i => (i * 2).toString()));
    }
  }, 1000);
  return p;
});

let a = dl.load(1);
let b = dl.load(2);
let c = Promise.resolve(null).then(() => dl.load(3));
let d = Promise.resolve(null).then(() => dl.load(4));
// let d = Promise.resolve(b).then(b => dl.load(parseInt(b, 10)));

Promise.all([a, b, c, d]).then(([a, b, c, d]) => {
  console.log(a);
  console.log(b);
  console.log(c);
  console.log(d);
  console.log("loads=" + loads);
});
// let ap = Promise.resolve(a);
// let ab = Promise.resolve(b);
