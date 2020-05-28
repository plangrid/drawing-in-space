import React, { useState, useCallback, useEffect } from 'react';

import { DrawingClient } from './DrawingClient';
import { ViewingClient } from './ViewingClient';
import { NetworkLayer } from './util/network-layer';
import Button from '@material-ui/core/Button';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import './App.css';

export default () => {
  const [networkLayer] = useState(() => new NetworkLayer());
  const [networkType, setNetworkType] = useState(networkLayer.type);
  const onChangeNetworkType = useCallback((_, type) => setNetworkType(type), [setNetworkType]);

  useEffect(() => {
    networkLayer.type = networkType;
  }, [networkLayer, networkType]);

  return (
    <div className="DrawingApp">
      <ViewingClient network={networkLayer} />
      <DrawingClient sendPoint={networkLayer.sendPoint} />
      <div className="controls">
        <Button color="secondary" variant="contained" onClick={() => window.location.reload()}>
          Reset
        </Button>
        <ToggleButtonGroup exclusive value={networkType} onChange={onChangeNetworkType}>
          <ToggleButton value="launchpad">Launchpad</ToggleButton>
          <ToggleButton value="space">Space</ToggleButton>
          <ToggleButton value="stormy">Solar Storm</ToggleButton>
        </ToggleButtonGroup>
      </div>
    </div>
  );
};
