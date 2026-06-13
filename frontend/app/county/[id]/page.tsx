"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import RelatedCards from "@/components/RelatedCards";

import Loading from "@/components/Loading";
import { BASE_URL } from "@/lib/BASE_URL";
import axios from "axios";
import Error from "@/components/Error";

function Page({ params }: { params: { id: number } }) {
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [instance, setInstance] = useState<any>({});

  useEffect(() => {
    axios
      .get(`${BASE_URL}/county/${id}`)
      .then((res) => {
        //console.log(res.data);
        setInstance(res.data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  const calculateWidthPercent = (input: string) => {
    const num = parseInt(input);
    return (Math.min(1000, num) / 1000) * 100;
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-black-400 text-2xl font-bold" id="county_instance_text">
        {instance.name + " County"}
      </h2>
      <a href={instance.website} className="text-sky-400 hover:text-cyan-700">
        Website
      </a>
      <img src={instance.img_src} className={"rounded-lg"}></img>
      <p>Number of Convicts: {instance.typetotal}</p>
      <p>Number of Exconvicts: {instance.NumberExconvicts || "N/A"}</p>
      <p>Population: {instance.population}</p>
      <p>Population Rank: {instance.population_rank}</p>
      <p>Main Prison/Jail: {instance.typetotal}</p>

      <Card className="flex flex-col rounded-lg p-4 w-full space-y-4">
        <div className="text-lg font-bold text-gray-800">
          Ex-Convicts per crime category
        </div>
        <div className="flex flex-row w-full">
          <div className=" border-gray-300 border-r pr-4">
            <div className="h-10 items-center jusify-center flex flex-row">
              Violent Convictions
            </div>
            <div className="h-10 items-center jusify-center flex flex-row">
              Property Crime Convictions
            </div>
            <div className="h-10 items-center jusify-center flex flex-row">
              Drug Convictions
            </div>
            <div className="h-10 items-center jusify-center flex flex-row">
              Other Convictions
            </div>
          </div>
          <div className="grow ml-4">
            <div className="h-10 p-1 ">
              <div
                className="bg-green-300 h-full rounded-sm flex flex-col justify-center pl-4"
                style={{
                  width: `${calculateWidthPercent(
                    instance.typeviolent || ""
                  )}%`,
                }}
              >
                {instance.typeviolent}
              </div>
            </div>
            <div className="h-10 p-1 ">
              <div
                className="bg-blue-300 h-full rounded-sm flex flex-col justify-center pl-4"
                style={{
                  width: `${calculateWidthPercent(
                    instance.typeproperty || ""
                  )}%`,
                }}
              >
                {instance.typeproperty}
              </div>
            </div>
            <div className="h-10 p-1 ">
              <div
                className="bg-yellow-300 h-full rounded-sm flex flex-col justify-center pl-4"
                style={{
                  width: `${calculateWidthPercent(instance.typedrug || "")}%`,
                }}
              >
                {instance.typedrug}
              </div>
            </div>
            <div className="h-10 p-1 ">
              <div
                className="bg-red-300 h-full rounded-sm flex flex-col justify-center pl-4"
                style={{
                  width: `${calculateWidthPercent(instance.typeother || "")}%`,
                }}
              >
                {instance.typeother}
              </div>
            </div>
          </div>
        </div>
      </Card>
      <iframe
        className="w-full h-96"
        loading="lazy"
        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCT7_cNQ9nTtOqQW9_z6YcnV52OIJMeUK4
    &q=${instance.name} County, TX`}
      ></iframe>
      <RelatedCards cards={instance.related}></RelatedCards>
    </div>
  );
}

export default Page;
