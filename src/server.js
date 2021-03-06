const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
app.options("*", cors());

let points = [];

const PORT = 1337;
const ERROR_RATE =
  process.env.NETWORK && process.env.NETWORK.toLowerCase() === "b" ? 0.1 : 0.0;
const MIN_LATENCY = 100;
const MAX_LATENCY = process.env.NETWORK ? 1000 : 100; // 'a' and 'b' (and any other named network) have variable max latency

function withLatency(cb) {
  const success = Math.random() < 1 - ERROR_RATE;
  return new Promise((resolve, reject) => {
    // simulate random delay in delivery of the request
    setTimeout(() => {
      const response = cb();
      // simulate random delay in delivery of the response
      setTimeout(() => {
        if (success) {
          resolve(response);
        } else {
          reject("Network error.");
        }
      }, Math.random() * (MAX_LATENCY - MIN_LATENCY) + MIN_LATENCY);
    }, Math.random() * (MAX_LATENCY - MIN_LATENCY) + MIN_LATENCY);
  });
}

app.post("/points/add", (req, res, next) => {
  withLatency(() => {
    points.push.apply(points, req.body);
    return req.body; // respond with received points to confirm
  })
    .then(res.send.bind(res), (error) => {
      res.status(504);
      res.send(error);
    })
    .catch(next);
});

app.get("/points", (req, res, next) => {
  withLatency(() => points)
    .then(res.send.bind(res), (error) => {
      res.status(504);
      res.send(error);
    })
    .catch(next);
});

app.get("/reset", (req, res) => {
  points = [];
  res.send(points);
});

app.listen(PORT, () => console.log("Server listening on port " + PORT));
