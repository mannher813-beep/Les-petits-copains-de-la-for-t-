/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface MazeBackgroundProps {
  width: number;
  height: number;
  layout: 1 | 2;
}

/**
 * Renders an actual maze (walls + entry/exit markers) as an SVG background
 * so children have a real path to trace inside the DrawingCanvas, instead
 * of an empty box.
 *
 * layout 1: vertical "serpentine" maze (5 columns, snake top-left -> bottom-right)
 * layout 2: horizontal "serpentine" maze (3 rows, snake top-left -> bottom-right)
 */
export const MazeBackground: React.FC<MazeBackgroundProps> = ({ width, height, layout }) => {
  const pad = 10;
  const left = pad;
  const right = width - pad;
  const top = pad;
  const bottom = height - pad;

  const wallProps = {
    stroke: "#8B5E3C",
    strokeWidth: 4,
    strokeLinecap: "round" as const
  };

  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];

  if (layout === 1) {
    // 5 vertical columns, gaps alternate bottom/top to force a snake path
    const cols = 5;
    const colW = (right - left) / cols;
    const gapH = (bottom - top) * 0.28;

    // Outer border with an entry gap (top-left, on the left edge)
    // and an exit gap (bottom-right, on the right edge)
    lines.push({ x1: left, y1: top, x2: right, y2: top }); // top
    lines.push({ x1: left, y1: bottom, x2: right, y2: bottom }); // bottom
    lines.push({ x1: left, y1: top + gapH, x2: left, y2: bottom }); // left (gap at top = entry)
    lines.push({ x1: right, y1: top, x2: right, y2: bottom - gapH }); // right (gap at bottom = exit)

    for (let i = 1; i < cols; i++) {
      const x = left + colW * i;
      const gapAtBottom = i % 2 === 1; // col boundary 1,3 gap at bottom; 2,4 gap at top
      if (gapAtBottom) {
        lines.push({ x1: x, y1: top, x2: x, y2: bottom - gapH });
      } else {
        lines.push({ x1: x, y1: top + gapH, x2: x, y2: bottom });
      }
    }

    const startPos = { x: left, y: top + gapH / 2 };
    const endPos = { x: right, y: bottom - gapH / 2 };

    return (
      <MazeSvg width={width} height={height} lines={lines} wallProps={wallProps} start={startPos} end={endPos} />
    );
  }

  // layout === 2: 3 horizontal rows, gaps alternate right/left to force a snake path
  const rows = 3;
  const rowH = (bottom - top) / rows;
  const gapW = (right - left) * 0.24;

  // Entry gap on left edge (row 0), exit gap on right edge (row 2)
  lines.push({ x1: left, y1: top, x2: right, y2: top }); // top border
  lines.push({ x1: left, y1: bottom, x2: right, y2: bottom }); // bottom border
  lines.push({ x1: left, y1: top + rowH, x2: left, y2: bottom }); // left border (gap = row0 = entry)
  lines.push({ x1: right, y1: top, x2: right, y2: bottom - rowH }); // right border (gap = row2 = exit)

  for (let i = 1; i < rows; i++) {
    const y = top + rowH * i;
    const gapAtRight = i % 2 === 1; // divider 1 (row0/row1) gap at right, divider 2 gap at left
    if (gapAtRight) {
      lines.push({ x1: left, y1: y, x2: right - gapW, y2: y });
    } else {
      lines.push({ x1: left + gapW, y1: y, x2: right, y2: y });
    }
  }

  const startPos = { x: left, y: top + rowH / 2 };
  const endPos = { x: right, y: bottom - rowH / 2 };

  return <MazeSvg width={width} height={height} lines={lines} wallProps={wallProps} start={startPos} end={endPos} />;
};

const MazeSvg: React.FC<{
  width: number;
  height: number;
  lines: { x1: number; y1: number; x2: number; y2: number }[];
  wallProps: { stroke: string; strokeWidth: number; strokeLinecap: "round" };
  start: { x: number; y: number };
  end: { x: number; y: number };
}> = ({ width, height, lines, wallProps, start, end }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="absolute inset-0 pointer-events-none select-none"
      aria-hidden="true"
    >
      {lines.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} {...wallProps} />
      ))}
      {/* Start marker */}
      <circle cx={start.x} cy={start.y} r={9} fill="#5A7D51" opacity={0.9} />
      <text x={start.x} y={start.y + 4} fontSize="11" textAnchor="middle" fill="#fff">
        🐾
      </text>
      {/* End marker */}
      <circle cx={end.x} cy={end.y} r={11} fill="#E98074" opacity={0.9} />
      <text x={end.x} y={end.y + 5} fontSize="13" textAnchor="middle" fill="#fff">
        🎯
      </text>
    </svg>
  );
};
