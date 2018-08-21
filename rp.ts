import rp from "request-promise";
import { RequestError } from "request-promise/errors";

rp({ uri: "http://123.123.123.123", timeout: 2 })
  .then(r => {
    console.log(r);
  })
  .catch(e => {
    console.log("INSTANCEOF " + (e instanceof RequestError));
    console.log("INSTANCEOF " + e.cause.message);
    console.log(e);
  });
