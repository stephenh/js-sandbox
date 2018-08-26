import { Agent } from "https";
import { Response } from "request";
import rp, { Options } from "request-promise-native";
import { RequestError } from "request-promise-native/errors";

let agent = new Agent({ keepAlive: true, keepAliveMsecs: 1000 });

let opts: Options = {
  uri: "https://www.google.com",
  time: true,
  agent: agent,
  timeout: 2000,
  resolveWithFullResponse: true
};

rp(opts)
  .then((r: Response) => {
    console.log(r.timingPhases);
    rp(opts).then((r: Response) => {
      console.log(r.timingPhases);
    });
  })
  .catch(e => {
    console.log("INSTANCEOF " + (e instanceof RequestError));
    console.log("INSTANCEOF " + e.cause.message);
    console.log(e.timingPhases);
    // console.log(e);
  });
