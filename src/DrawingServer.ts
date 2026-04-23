import type { DrawingPoint } from "./types";

const baseUrl = "http://localhost:1337";

export default class DrawingServer {
  async addPoints(points: DrawingPoint[]): Promise<DrawingPoint[]> {
    const response = await fetch(`${baseUrl}/points/add`, {
      method: "POST",
      body: JSON.stringify(points),
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }

  async getPoints(): Promise<DrawingPoint[]> {
    const response = await fetch(`${baseUrl}/points`);
    return response.json();
  }

  async reset(): Promise<unknown> {
    const response = await fetch(`${baseUrl}/reset`);
    return response.json();
  }
}
