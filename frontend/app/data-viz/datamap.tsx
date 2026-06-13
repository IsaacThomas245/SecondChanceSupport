// @ts-nocheck
"use client";
import * as d3 from "d3";
import { useRef, useEffect } from "react";
import geojson from "./us.json";
import { geoMercator, geoPath } from "d3-geo";
import { select } from "d3-selection";
import Loading from "@/components/Loading";
type MapProps = {
  locations: any;
};

export default function DataMap({ locations }: MapProps) {
  const gx = useRef();
  const gy = useRef();
  const width = 600;
  const height = width;
  const features = geojson.features.filter((d) => d.properties.STATE === "48");
  const projection = geoMercator().fitExtent(
    [
      [0, 0],
      [width * 0.9, height * 0.9],
    ],
    {
      type: "FeatureCollection",
      features: features,
    }
  );
  const path = geoPath().projection(projection);
  if (locations.length > 0) {
    return (
      <svg width={width} height={height}>
        <g className="geojson-layer">
          {features.map((d) => (
            <path
              key={d.properties.Name}
              d={path(d)}
              fill="#eee"
              stroke="#0e1724"
              strokeWidth="1"
              strokeOpacity="0.5"
              onMouseEnter={(e) => {
                select(e.target).attr("fill", "#000");
              }}
              onMouseOut={(e) => {
                select(e.target).attr("fill", "#eee");
              }}
            />
          ))}
        </g>
        <g>
          {locations.map((p) => {
            return (
              <>
                <circle
                  key={p.name + p.color + p.location}
                  fill={p.color}
                  r={4}
                  cx={projection(p.location)[0]}
                  cy={projection(p.location)[1]}
                  onMouseEnter={(e) => {
                    select(e.target).attr("fill", "#000");
                  }}
                  onMouseOut={(e) => {
                    select(e.target).attr("fill", p.color);
                  }}
                />
              </>
            );
          })}
        </g>
      </svg>
    );
  }
  return <Loading />;
}
