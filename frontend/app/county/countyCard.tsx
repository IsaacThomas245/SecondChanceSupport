"use client";
import React from "react";
import {
  Card,
  CardDescription,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import { CountySearchParams } from "./types";

import Highlighter from "react-highlight-words";

type CountyCardProps = {
  instance: any;
  id: number;
  params: CountySearchParams;
};

const rangeFilterNames: string[] = [
  "typeviolent",
  "typeproperty",
  "typeother",
  "typedrug",
  "typetotal",
  "population_rank",
  "population",
];

const title_format = (x: string) => {
  if (x.length > 14) return x.substring(0, 14) + "...";
  return x;
};

import Router, { useRouter } from "next/navigation";

const splitQuery = (s?: string) => {
  if (s === undefined) {
    return [""];
  }
  return s.split(" ");
};

function CountyCard({ instance, id, params }: CountyCardProps) {
  const router = useRouter();
  const { nameQuery, rangeQueries } = params;
  return (
    <Card
      className="hover:bg-gray-100 cursor-pointer flex flex-col"
      onClick={() => {
        router.push(`/county/${id}`);
      }}
      id="county_card"
    >
      <CardHeader>
        <CardTitle>
          <Highlighter
            highlightClassName="YourHighlightClass"
            searchWords={splitQuery(nameQuery)}
            autoEscape={true}
            textToHighlight={title_format(instance.name + " County")}
          ></Highlighter>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-wrap">
        <img
          src={instance.img_src}
          className={"rounded-lg w-full h-40 object-cover"}
        ></img>
        {rangeFilterNames?.map((name, index) => {
          if (instance[name])
            return (
              <div className="flex flex-row space-x-2" key={index}>
                <div className="font-semibold">{name + ":"}</div>
                <div
                  className={`${
                    (nameQuery?.includes(instance[name]) && "bg-[#ffff00]") ||
                    (rangeQueries &&
                      instance[name] > rangeQueries[index][0] &&
                      instance[name] < rangeQueries[index][1] &&
                      "bg-[#ffff00]")
                  }`}
                >
                  {instance[name]}
                </div>
              </div>
            );
        })}

        <a className="text-sky-400 hover:text-cyan-700" href={instance.Website}>
          Website
        </a>
      </CardContent>
    </Card>
  );
}

export default CountyCard;
