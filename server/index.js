const express = require("express");
const app = express();

let points = [];

const PORT = 1337;
const ERROR_RATE = 0.0;
const MIN_LATENCY = 100;
const MAX_LATENCY = 100;

function withLatency(cb) {
  const success = Math.random() < 1 - ERROR_RATE;
  const latency = Math.random() * (MAX_LATENCY - MIN_LATENCY) + MIN_LATENCY;
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (success) {
        resolve(cb());
      } else {
        reject("Network error.");
      }
    }, latency)
  );
}

app.get("/points/add", (req, res, next) => {
  const newPoints = JSON.parse(req.body);
  withLatency(() => points.concat(newPoints))
    .then(res.send.bind(res), error => {
      throw new Error(error);
    })
    .catch(next);
});

app.get("/points", (req, res, next) => {
  withLatency(() => points)
    .then(res.send.bind(res), error => {
      throw new Error(error);
    })
    .catch(next);
});

app.get("/reset", (req, res) => {
  points = [];
  res.send(points);
});

app.listen(PORT, () => console.log("Server listening on port " + PORT));
