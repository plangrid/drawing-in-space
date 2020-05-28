import Emitter from 'tiny-emitter';

// --------------------------------------------------------------------------
// Simulated network layer - Do not edit!
// --------------------------------------------------------------------------

const configs = {
  launchpad: {
    ERROR_RATE: 0.0,
    MIN_LATENCY: 100,
    MAX_LATENCY: 100,
  },
  space: {
    ERROR_RATE: 0.0,
    MIN_LATENCY: 100,
    MAX_LATENCY: 1000,
  },
  stormy: {
    ERROR_RATE: 0.1,
    MIN_LATENCY: 100,
    MAX_LATENCY: 1000,
  },
};

export class NetworkLayer extends Emitter {
  constructor() {
    super();
    this.type = 'launchpad';
  }

  get config() {
    return configs[this.type];
  }

  sendPoint = (point) => {
    return this.withLatency(() => {
      console.log(point);
      this.emit('point', { ...point });

      // Respond with a copy of the newly added object
      return this.withLatency(() => ({ ...point }));
    });
  };

  withLatency(cb) {
    const success = Math.random() < 1 - this.config.ERROR_RATE;
    const latency =
      Math.random() * (this.config.MAX_LATENCY - this.config.MIN_LATENCY) + this.config.MIN_LATENCY;
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
