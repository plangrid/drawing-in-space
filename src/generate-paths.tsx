import React from "react";
import type { DrawingPoint } from "./types";

export default function generatePathSegments(
  points: DrawingPoint[],
  key = "segment"
): React.ReactElement[] {
  const segments: React.ReactElement[] = [];
  let currentSegment: DrawingPoint[] = [];

  points.forEach((p) => {
    currentSegment.push(p);
    if (p.isEndOfSegment) {
      segments.push(
        <path
          key={key + segments.length}
          className={key}
          d={generatePath(currentSegment)}
        />
      );
      currentSegment = [];
    }
  });

  if (currentSegment.length) {
    segments.push(
      <path
        key={key + segments.length}
        className={key}
        d={generatePath(currentSegment)}
      />
    );
  }

  return segments;
}

function generatePath(points: DrawingPoint[]): string {
  return points.reduce(
    (out, p, i) =>
      p.x !== null && p.y !== null
        ? `${out} ${i === 0 ? "M" : "L"} ${p.x} ${p.y} `
        : out,
    ""
  );
}
