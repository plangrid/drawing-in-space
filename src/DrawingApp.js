import React from 'react';

import DrawingServer from './DrawingServer';
import generatePathSegments from './generate-paths';

import './App.css';

export default class DrawingApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dragging: false,
      points: [],
      confirmedPoints: [],
      refreshInterval: null,
    };

    this.server = new DrawingServer();

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.reset = this.reset.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    this.setState({
      refreshInterval: window.setInterval(this.refresh, 33),
    });
  }
  componentWillUnmount() {
    if (this.state.refreshInterval) {
      window.clearInterval(this.state.refreshInterval);
    }
  }

  onMouseDown(ev) {
    this.dragging = true;
  }

  onMouseUp(ev) {
    this.dragging = false;
    this.onDraw(ev.nativeEvent.offsetX, ev.nativeEvent.offsetY, true);
  }

  onMouseMove(ev) {
    this.onDraw(ev.nativeEvent.offsetX, ev.nativeEvent.offsetY);
  }

  onDraw(offsetX, offsetY, isEndOfSegment = false) {
    const { server, dragging } = this;

    if (dragging) {
      // We will build an array of exactly one or two points to add to our overall line data
      const points = [...this.state.points];

      // If this point is the start of a new segment, create an "end segment" point
      // with null coordinates.
      //
      // This simply acts as a separator between segments so we can keep all
      // points in one flat array.

      // Append a new point to the array
      const point = {
        x: offsetX,
        y: offsetY,
        isEndOfSegment,
      };
      points.push(point);
      server
        .sendPoint(point)
        .then((response) => {
          // Success
        })
        .catch((error) => {
          // Failure
        });

      this.setState({
        points,
      });
    }
  }

  reset() {
    this.setState({ points: [] });
    this.server.reset();
  }

  refresh() {
    this.server
      .getPoints()
      .then((response) => {
        this.setState({ confirmedPoints: response });
      })
      .catch((error) => {
        console.warn(error);
      });
  }

  render() {
    return (
      <div className="DrawingApp">
        <svg
          width="100%"
          height="100%"
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onMouseMove={this.onMouseMove}
        >
          {generatePathSegments(this.state.points, 'sent')}
          {generatePathSegments(this.state.confirmedPoints, 'confirmed')}
        </svg>
        <div className="reset">
          <button onClick={this.reset}>Reset</button>
        </div>
      </div>
    );
  }
}
