import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import DrawingApp from './DrawingApp';

it('renders without crashing', () => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  let root;
  act(() => {
    root = createRoot(div);
    root.render(<DrawingApp />);
  });
  act(() => {
    root.unmount();
  });
  document.body.removeChild(div);
});
