// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import LinePlot from "./lineplot";
import { Button } from "@/components/ui/button";

import Error from "@/components/Error";

import { BASE_URL } from "@/lib/BASE_URL";

import axios from "axios";
import DataMap from "./datamap";
import { BarChart } from "./barchart";
import { resourceUsage } from "process";
// need to create data visualizations, and stack them on
// top of each other

type County = {
  id: number;
  name: string;
  typeviolent: number;
  typeproperty: number;
  typeother: number;
  typedrug: number;
  typetotal: number;
  population: number;
  population_rank: number;
  img_src: string;
  longitude: number;
  latitude: number;
};


function Page() {
  const [toggleCounty, setToggleCounty] = useState<boolean>(false);

  const [error, setError] = useState<boolean>(false);

  const [countyTotalReleased, setCountyTotalReleased] = useState<number[]>([]);
  const [countyPopData, setCountyPopData] = useState<number[]>([]);

  const [countyDataLabels, setCountyDataLabels] = useState<string[]>([]);

  const [countyConvictionData, setCountyConvictionData] = useState<IData[]>(
    []
  );

  const [locations, setLocations] = useState<Object[]>([]);

  function compareCountyByRank(firstCounty: County, secondCounty: County) {
    return firstCounty.population_rank - secondCounty.population_rank;
  }

  useEffect(() => {
    axios
      .get(`${BASE_URL}/counties`)
      .then((res) => {
        // grabs all the counties, sort them by population rank
        // literally an array
        const countyArray: County[] = res.data;
        const countyLabels: string[] = [];
        const countyPop: number[] = [];

        countyArray.sort(compareCountyByRank);

        // want to display total on y axis, rank on x axis
        const countyTotalSorted: number[] = countyArray.map((county) => {
          countyLabels.push(`County: ${county.name}. 
                              Pop: ${county.population}. 
                              Total Ex Convicts: ${county.typetotal}`);
          countyPop.push(county.population);
          return county.typetotal;
        });

        // console.log("total number of county array: " + countyArray.length);
        setCountyTotalReleased(countyTotalSorted);
        setCountyDataLabels(countyLabels);
        setCountyPopData(countyPop);

        // grab total of different kinds of conviction
        let drug = 0;
        let property = 0;
        let other = 0;
        let violent = 0;

        for (const county of countyArray) {
          violent += county.typeviolent;
          drug += county.typedrug;
          property += county.typeproperty;
          other += county.typeother;
        }
        setCountyConvictionData([
          { name: "violent", value: violent },
          { name: "property", value: property },
          { name: "drug", value: drug },
          { name: "other", value: other },
        ]);
      })
      .catch((error) => {
        setError(true);
        // console.log("error: " + error);
      });
  }, []);


  useEffect(() => {
    axios
      .all([
        axios.get(`${BASE_URL}/search?model=rehab`),
        axios.get(`${BASE_URL}/search?model=reentry`),
      ])
      .then(
        axios.spread((rehabRes, reEntryRes) => {
          if (!rehabRes.data || !reEntryRes.data) {
            return;
          }
          console.log(rehabRes);
          let parseRehab = rehabRes.data.map((data: any) => {
            return {
              name: data.name,
              location: [data.longitude, data.latitude],
              color: "red",
            };
          });
          let parseReentry = reEntryRes.data.map((data: any) => {
            return {
              name: data.name,
              location: [data.longitude, data.latitude],
              color: "blue",
            };
          });
          setLocations(parseRehab.concat(parseReentry));
          console.log(locations);
        })
      );
  }, []);

  if (error) {
    return <Error />;
  }

  return (
    <div>
      <div>
        <h2 className="text-2xl font-semibold">
          Critiques On Our Team
        </h2>
        <br></br>
        <div>
          <p className="font-semibold">
            What did we do well?
          </p>
          <br></br>
          One of our main priorities was making sure that we communicated well.
          If any of us found ourselves caught in a roadblock, we communicated
          so we could get the necessary help to move forward. Instead of
          working as individuals, we worked as a healthy functioning team.
          <br></br>
          <br></br>
          <p className="font-semibold">
            What did we learn?
          </p>
          <br></br>
          It was the first time most of us worked on a full-stack project
          involving multiple members and technologies. Even if you understand
          how something works, we were reminded that applying it is a different
          scenario. We learned a lot about RESTful APIs, and how the front end
          of an application utilizes the backend to display data.
          <br></br>
          <br></br>
          <p className="font-semibold">
            What did we teach each other?
          </p>
          <br></br>
          Our members each had specific things they knew that others didn’t or
          were very eager to learn, thus we all learned from each other. As a
          result, our teamwork was very fluid and we didn’t get caught on any
          roadblocks for too long.
          <br></br>
          <br></br>
          <p className="font-semibold">
            What can we do better?
          </p>
          <br></br>
          We could have made the search component on each model page smaller
          and more user-friendly. Also, we could have changed the tool we used
          for our database queries for faster loading. Lastly, we could have
          handled our time better. Since we were one of the smaller groups, we
          would have had more time to refine the website if we worked on task
          management.
          <br></br>
          <br></br>
          <p className="font-semibold">
            What effect did the peer reviews have?
          </p>
          <br></br>
          The peer reviews allowed us to evaluate what we were doing and
          effectively move forward to become better individuals and teammates.
          It allowed us to grow and especially helped us in the latter phases.
          <br></br>
          <br></br>
          <p className="font-semibold">
            What puzzles us?
          </p>
          <br></br>
          What puzzled us was how to get images for more obscure reentry and
          rehab centers. Our solution of using Google Maps sometimes gave no
          image because the centers are extremely far away. Other times, these
          centers were so tiny that they didn&apos;t have much data that we could
          easily webscrap programmatically.
        </div>
      </div>
      <br></br>
      <p className="text-2xl font-semibold">
        Our Visualizations
      </p>
      <br></br>
      <p className="font-semibold">Total County Ex Prisoners Plotted Against Population Rank</p>
      <Button onClick={() => setToggleCounty(!toggleCounty)}>
        Toggle County View
      </Button>
      {toggleCounty ? (
        <>
          <p>Total County Population vs Total Released</p>
          <LinePlot
            name={"Total Released vs Total County Population "}
            verticalData={countyTotalReleased}
            horizontalData={countyPopData}
            dataLabels={countyDataLabels}
          ></LinePlot>
        </>
      ) : (
        <>
          <p>Population Rank vs Total Released</p>
          <LinePlot
            name={"Total Released vs Population Rank"}
            verticalData={countyTotalReleased}
            horizontalData={Array(countyTotalReleased.length)
              .fill(0)
              .map((v, i) => i)}
            dataLabels={countyDataLabels}
          ></LinePlot>
        </>
      )}
      <br></br>
      <p className="font-semibold">
        Bar Chart of the Total Number of Exconvicts Broken Down to Each Type of
        Their Conviction
      </p>
      <BarChart
        data={countyConvictionData}
        marginleft={40}
        fill="orange"
      ></BarChart>
      <br></br>
      <div>
        <div className="font-semibold">
          Distribution of Rehab and Reentry Centers
        </div>
        <div className="bg-red-600 h-5 aspect-square inline-block rounded-full font-normal"></div>
        {" "} Rehab
        <br></br>
        <div className="bg-blue-600 h-5 aspect-square inline-block rounded-full font-normal"></div>
        {" "} Reentry
      </div>
      <DataMap locations={locations}></DataMap>
    </div>
  );
}

export default Page;
