import React, { Component } from 'react';

import './App.css';

import generatePathSegments from './util/generate-paths';

export default class Repro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      points: [],
    };
  }

  onMouseMove = (e) => {
    this.setState({
      points: [
        ...this.state.points,
        {
          x: e.nativeEvent.offsetX,
          y: e.nativeEvent.offsetY,
        },
      ],
    });
  };

  render() {
    return (
      <div className="DrawingApp">
        <svg
          className="DrawingLayer"
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onMouseMove={this.onMouseMove}
        >
          {generatePathSegments(this.state.points, 'sent')}
        </svg>
        <div className="controls">
          <button onClick={() => window.location.reload()}>Reset</button>
        </div>
      </div>
    );
  }
}
