import React, { useState, useEffect, useMemo, useCallback } from "react";
import { throttle } from "lodash";

import DrawingServer from "./DrawingServer";
import generatePathSegments from "./generate-paths";

import "./App.css";

const server = new DrawingServer();
let pointsToSend = [];

const DrawingApp = () => {
  const [dragging, setDragging] = useState(false);
  const [justStarted, setJustStarted] = useState(false);
  const [points, setPoints] = useState([]);
  const [confirmedPoints, setConfirmedPoints] = useState([]);

  const sendPoints = useMemo(
    () =>
      // Creates a throttled function that only invokes func at most once per every wait milliseconds
      throttle(
        () => {
          const batch = pointsToSend;
          pointsToSend = [];
          server
            .addPoints(batch)
            .then((confirmed) => {
              setConfirmedPoints((prev) => [...prev, ...confirmed]);
            })
            .catch(() => {});
        },
        200,
        { leading: true, trailing: true },
      ),
    [],
  );

  const refresh = useCallback(() => {
    server
      .getPoints()
      .then((pts) => {
        setPoints(pts);
        setConfirmedPoints(pts);
      })
      .catch((error) => {
        console.warn(error);
      });
  }, []);

  useEffect(() => {
    refresh();
    return () => sendPoints.cancel();
  }, [refresh, sendPoints]);

  const onMouseDown = useCallback(() => {
    setDragging(true);
    setJustStarted(true);
  }, []);

  const onMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  const onMouseMove = useCallback(
    (ev) => {
      if (dragging) {
        // We will build an array of exactly one or two points to add to our overall line data
        const newPoints = [];

        // If this point is the start of a new segment, create an "end segment" point
        // with null coordinates.
        //
        // This simply acts as a separator between segments so we can keep all
        // points in one flat array.
        if (justStarted && points.length > 0) {
          newPoints.push({ x: null, y: null, isEndOfSegment: true });
        }

        // Append a new point to the array
        newPoints.push({
          x: ev.nativeEvent.offsetX,
          y: ev.nativeEvent.offsetY,
          isEndOfSegment: false,
        });

        setPoints((prev) => [...prev, ...newPoints]);
        setJustStarted(false);

        pointsToSend.push(...newPoints);
        sendPoints();
      }
    },
    [dragging, justStarted, points, sendPoints],
  );

  const reset = useCallback(() => {
    setPoints([]);
    setConfirmedPoints([]);
    setJustStarted(true);
    server.reset();
  }, []);

  return (
    <div className="DrawingApp">
      <svg
        width="100%"
        height="100%"
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        {generatePathSegments(points, "sent")}
        {generatePathSegments(confirmedPoints, "confirmed")}
      </svg>
      <div className="reset">
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
};

export default DrawingApp;
