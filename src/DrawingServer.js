// --------------------------------------------------------------------------
// Simualted remote server - Do not edit!
// --------------------------------------------------------------------------

export default class DrawingServer {
  constructor() {
    this._points = [];
    this.ERROR_RATE = 0.1;
    this.MIN_LATENCY = 100;
    this.MAX_LATENCY = 1000;
  }

  sendPoint(point) {
    return this.withLatency(() => {
      // And append to internal points array
      this._points = [...this._points, { ...point }];

      // Respond with a copy of the newly added object
      return this.withLatency(() => ({ ...point }));
    });
  }

  getPoints(point) {
    return this.withLatency(() => {
      const snapshot = this._points.map((point) => ({ ...point }));
      return this.withLatency(() => snapshot);
    });
  }

  reset() {
    return new Promise((resolve) => {
      this._points = [];
      resolve();
    });
  }

  withLatency(cb) {
    const success = Math.random() < 1 - this.ERROR_RATE;
    const latency = Math.random() * (this.MAX_LATENCY - this.MIN_LATENCY) + this.MIN_LATENCY;
    return new Promise((resolve, reject) =>
      window.setTimeout(() => {
        if (success) {
          resolve(cb());
        } else {
          reject('Network error.');
        }
      }, latency)
    );
  }
}
