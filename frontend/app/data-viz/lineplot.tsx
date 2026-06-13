// @ts-nocheck
"use client";
import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";

type LinePlotProps = {
  name: string;
  horizontalData: number[];
  verticalData: number[];
  dataLabels: string[];
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
};

export default function LinePlot({
  horizontalData,
  verticalData,
  name,
  dataLabels,
  width = 640,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 30,
  marginLeft = 40,
}: LinePlotProps) {
  const gx = useRef();
  const gy = useRef();
  const x = d3.scaleLinear(
    [0, d3.max(horizontalData)],
    [marginLeft, width - marginRight],
  );

  const y = d3.scaleLinear(d3.extent(verticalData), [
    height - marginBottom,
    marginTop,
  ]);

  useEffect(() => void d3.select(gx.current).call(d3.axisBottom(x)), [gx, x]);
  useEffect(() => void d3.select(gy.current).call(d3.axisLeft(y)), [gy, y]);

  let dataPoints = verticalData.map((value, index) => {
    return [horizontalData[index], value];
  });

  function sortDataPoint(pointOne, pointTwo) {
    return pointOne[0] - pointTwo[0];
  }

  dataPoints = dataPoints.sort(sortDataPoint);

  for (const point of dataPoints) {
    // console.log(`{x: ${point[0]}. y: ${point[1]}}`);
  }

  const lineBuilder = d3
    .line()
    .x((point) => x(point[0]))
    .y((point) => y(point[1]));

  return (
    <>
      <svg width={width} height={height}>
        <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
        <g ref={gy} transform={`translate(${marginLeft},0)`} />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          d={lineBuilder(dataPoints)}
        />
        <g fill="white" stroke="currentColor" strokeWidth="1.5">
          {verticalData.map((value, index) => (
            <g key={index + value + "g"}>
              <text
                className="opacity-0 hover:opacity-100"
                fontSize={12}
                key={index + value + "text"}
                dx={x(horizontalData[index])}
                dy={y(value)}
              >
                {`${dataLabels[index]}`}
              </text>
              <circle
                key={index + "circle"}
                cx={x(horizontalData[index])}
                cy={y(value)}
                r="2.5"
              />
            </g>
          ))}
        </g>
      </svg>
    </>
  );
}
