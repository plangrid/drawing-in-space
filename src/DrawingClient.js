import React from 'react';
import * as _ from 'lodash';

import generatePathSegments from './util/generate-paths';

export class DrawingClient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      points: [],
    };

    this.dragging = false;
    this.onDraw = _.throttle(this.onDraw, 30);
  }

  onMouseDown = (ev) => {
    this.dragging = true;
    return this.onDraw(ev.nativeEvent.offsetX, ev.nativeEvent.offsetY);
  };

  onMouseUp = (ev) => {
    const promise = this.onDraw(ev.nativeEvent.offsetX, ev.nativeEvent.offsetY, true);
    this.dragging = false;
    return promise;
  };

  onMouseMove = (ev) => {
    let promise = Promise.resolve();
    if (this.dragging) {
      promise = this.onDraw(ev.nativeEvent.offsetX, ev.nativeEvent.offsetY);
    }
    return promise;
  };

  async onDraw(offsetX, offsetY, isEndOfSegment = false) {
    const { sendPoint } = this.props;

    const point = {
      x: offsetX,
      y: offsetY,
      isEndOfSegment,
    };

    this.setState({
      points: [...this.state.points, point],
    });
    await sendPoint(point);
  }

  render() {
    return (
      <svg
        className="DrawingLayer"
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseMove={this.onMouseMove}
      >
        {generatePathSegments(this.state.points, 'sent')}
      </svg>
    );
  }
}
