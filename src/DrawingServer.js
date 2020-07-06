const baseUrl = "http://localhost:1337";

export default class DrawingServer {
  async addPoints(points) {
    await fetch(`${baseUrl}/points/add`, {
      method: "POST",
      body: JSON.stringify(points),
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getPoints() {
    return await (await fetch(`${baseUrl}/points`)).json();
  }

  async reset() {
    return await (await fetch(`${baseUrl}/reset`)).json();
  }
}
