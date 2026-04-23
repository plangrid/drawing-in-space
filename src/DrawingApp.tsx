import React, { useState, useEffect, useRef, useMemo } from "react";
import { throttle } from "lodash";

import DrawingServer from "./DrawingServer";
import generatePathSegments from "./generate-paths";
import type { DrawingPoint } from "./types";

import "./App.css";

export default function DrawingApp() {
  const [dragging, setDragging] = useState(false);
  const [points, setPoints] = useState<DrawingPoint[]>([]);
  const [confirmedPoints, setConfirmedPoints] = useState<DrawingPoint[]>([]);
  const [justStarted, setJustStarted] = useState(false);

  const server = useMemo(() => new DrawingServer(), []);
  const pointsToSendRef = useRef<DrawingPoint[]>([]);

  const sendPoints = useMemo(
    () =>
      throttle(() => {
        const batch = pointsToSendRef.current;
        pointsToSendRef.current = [];

        server
          .addPoints(batch)
          .then((confirmed) => {
            setConfirmedPoints((prev) => prev.concat(confirmed));
          })
          .catch(() => {});
      }, 200, { leading: true, trailing: true }),
    [server]
  );

  useEffect(() => {
    server
      .getPoints()
      .then((serverPoints) => {
        setPoints(serverPoints);
        setConfirmedPoints(serverPoints);
      })
      .catch((error) => {
        console.warn(error);
      });
  }, [server]);

  useEffect(() => {
    return () => sendPoints.cancel();
  }, [sendPoints]);

  function onMouseDown() {
    setDragging(true);
    setJustStarted(true);
  }

  function onMouseUp() {
    setDragging(false);
  }

  function onMouseMove(ev: React.MouseEvent<SVGSVGElement>) {
    if (!dragging) return;

    const newPoints: DrawingPoint[] = [];

    if (justStarted && points.length > 0) {
      newPoints.push({ x: null, y: null, isEndOfSegment: true });
    }

    newPoints.push({
      x: ev.nativeEvent.offsetX,
      y: ev.nativeEvent.offsetY,
      isEndOfSegment: false,
    });

    setPoints((prev) => prev.concat(newPoints));
    setJustStarted(false);

    pointsToSendRef.current = pointsToSendRef.current.concat(newPoints);
    sendPoints();
  }

  function reset() {
    setPoints([]);
    setConfirmedPoints([]);
    setJustStarted(true);
    server.reset();
  }

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
}
