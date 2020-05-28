import React from "react";

// --------------------------------------------------------------------------
// Path drawing code
// --------------------------------------------------------------------------

export default function generatePathSegments(points, key = "segment") {
  const segments = [];
  let currentSegment = [];
  points.forEach(p => {
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

  // Flush out last segment
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

function generatePath(points) {
  return points.reduce(
    (out, p, i) =>
      p.x !== null && p.y !== null
        ? `${out} ${i === 0 ? "M" : "L"} ${p.x} ${p.y} `
        : out,
    ""
  );
}
