import React from "react";

import ServerInterface from "./ServerInterface";
import generatePathSegments from "./generate-paths";

import "./App.css";

const refreshInterval = 1000;

export default class DrawingApp extends React.Component {
  constructor(props) {
    super(props);
    this.intervalId = null;

    this.state = {
      dragging: false,
      points: [],
      confirmedPoints: [],
      justStarted: false,
      serverInterface: new ServerInterface(),
      refreshInterval: null,
    };
  }

  componentDidMount() {
    this.intervalId = window.setInterval(this.refresh, refreshInterval);
  }

  componentWillUnmount() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  }

  onMouseDown = (ev) => {
    this.setState({ dragging: true, justStarted: true });
  };

  onMouseUp = (ev) => {
    this.setState({ dragging: false });
  };

  onMouseMove = (ev) => {
    if (this.state.dragging) {
      // We will build an array of exactly one or two points to add to our overall line data
      const newPoints = [];

      // If this point is the start of a new segment, create an "end segment" point
      // with null coordinates.
      //
      // This simply acts as a separator between segments so we can keep all
      // points in one flat array.
      if (this.state.justStarted && this.state.points.length > 0) {
        newPoints.push({
          x: null,
          y: null,
          isEndOfSegment: true,
        });
      }

      // Append a new point to the array
      const newPoint = {
        x: ev.nativeEvent.offsetX,
        y: ev.nativeEvent.offsetY,
        isEndOfSegment: false,
      };

      newPoints.push(newPoint);

      this.setState({
        points: this.state.points.concat(newPoints),
        justStarted: false,
      });

      // And send to the space station
      this.state.serverInterface
        .addPoints(newPoints)
        .then((response) => {
          // Success
        })
        .catch((error) => {
          // Failure
        });
    }
  };

  reset = () => {
    this.setState({ points: [] });
    this.state.server.reset();
  };

  refresh = () => {
    this.state.serverInterface
      .getPoints()
      .then((response) => {
        this.setState({ confirmedPoints: response });
      })
      .catch((error) => {
        console.warn(error);
      });
  };

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
          {generatePathSegments(this.state.points, "sent")}
          {generatePathSegments(this.state.confirmedPoints, "confirmed")}
        </svg>
        <div className="reset">
          <button onClick={this.reset}>Reset</button>
        </div>
      </div>
    );
  }
}
