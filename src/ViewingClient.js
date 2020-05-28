import React, { Component } from 'react';

import generatePathSegments from './util/generate-paths';

export class ViewingClient extends Component {
  constructor(props) {
    super(props);

    this.state = {
      points: [],
    };

    props.network.on('point', (point) => {
      this.setState({
        points: [...this.state.points, point],
      });
    });
  }

  render() {
    return (
      <svg className="DrawingLayer">{generatePathSegments(this.state.points, 'confirmed')}</svg>
    );
  }
}
