// This is the server code that lives on the space ship. You can inspect it,
// but don't modify it (not even to include console.log statements).

const express = require("express");
const cors = require("cors");
const app = express();
const port = 1337;

app.use(express.json());
app.use(cors());
app.options("*", cors());

async function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function randomLatency() {
  const minLatency = 50;
  const maxLatency = 500;
  return Math.round(Math.random() * (maxLatency - minLatency) + minLatency);
}

let points = [];

async function addPoints(newPoints) {
  await delay(randomLatency());
  if (!Array.isArray(newPoints)) {
    throw new Error("new points must be an array");
  }
  points = points.concat(newPoints);
  await delay(randomLatency());
  return newPoints;
}

async function getPoints() {
  const snapshot = [...points];
  await delay(randomLatency());
  return snapshot;
}

async function deletePoints() {
  await delay(randomLatency());
  points = [];
}

app.post("/points", (req, res) => {
  addPoints(req.body)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(400);
      res.send({ message: err.message });
    });
});

app.get("/points", (_req, res) => {
  getPoints()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(400);
      res.send({ message: err.message });
    });
});

app.delete("/points", (_req, res) => {
  deletePoints()
    .then(() => {
      res.send([]);
    })
    .catch((err) => {
      res.status(500);
      res.send({ message: err.message });
    });
});

app.listen(port, () => {
  console.log(`Space station listening at http://localhost:${port}`);
});
