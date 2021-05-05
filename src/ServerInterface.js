export default class ServerInterface {
  constructor() {}

  addPoints(points) {
    return fetch("http://localhost:1337/points", {
      method: "POST",
      headers: [["Content-Type", "application/json"]],
      body: JSON.stringify(points),
    }).then((res) => res.json());
  }

  getPoints() {
    return fetch("http://localhost:1337/points").then((res) => res.json());
  }

  reset() {
    return fetch("http://localhost:1337/points", { method: "DELETE" }).then(
      (res) => res.json()
    );
  }
}
