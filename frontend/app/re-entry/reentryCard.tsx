import React from "react";
import {
  Card,
  CardDescription,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import Router, { useRouter } from "next/navigation";
import Highlighter from "react-highlight-words";
import { list } from "postcss";

import { ReentrySearchParams } from "./types";

type ReentryCardProps = {
  instance: any;
  id: number;
  params: ReentrySearchParams;
};

const title_format = (x: string) => {
  if (x.length > 15) return x.substring(0, 15) + "...";
  return x;
};

function ReentryCard({ instance, id, params }: ReentryCardProps) {
  const router = useRouter();

  const { nameSearch, countySearch, programType, RatingMax, RatingMin } =
    params;

  const splitQuery = (s?: string) => {
    if (s === undefined) {
      return [""];
    }
    return s.split(" ");
  };

  return (
    <Card
      className="hover:bg-gray-100 cursor-pointer flex flex-col"
      onClick={() => router.push(`/re-entry/${id}`)}
      id="reentry_card"
    >
      <CardHeader>
        <CardTitle>
          <Highlighter
            highlightClassName="YourHighlightClass"
            searchWords={splitQuery(nameSearch)}
            autoEscape={true}
            textToHighlight={title_format(instance.name)}
          ></Highlighter>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-wrap space-y-2">
        <img
          src={"data:image/png;base64," + instance.b64_img}
          className={"rounded-lg w-full h-40 object-cover"}
        ></img>
        <div className="flex flex-row space-x-2">
          <div className="font-semibold">
            City:
            <Highlighter
              highlightClassName="YourHighlightClass"
              searchWords={splitQuery(nameSearch)}
              autoEscape={true}
              textToHighlight={" " + instance.city}
            ></Highlighter>
          </div>
        </div>
        <div className="flex flex-row space-x-2">
          <div className="font-semibold">
            County: 
            <Highlighter
              highlightClassName="YourHighlightClass"
              searchWords={splitQuery(nameSearch).concat(countySearch!)}
              autoEscape={true}
              textToHighlight={" " + instance.county}
            ></Highlighter>
          </div>
        </div>
        <div className="flex flex-row space-x-2">
          <div className="font-semibold">
            Type:
            <Highlighter
              highlightClassName="YourHighlightClass"
              searchWords={splitQuery(nameSearch).concat(programType!)}
              autoEscape={true}
              textToHighlight={" " + instance.programtype}
            ></Highlighter>
          </div>
        </div>
        <div className="flex flex-row space-x-2">
          <div className="font-semibold">
            Open Hours:
            <Highlighter
              highlightClassName="YourHighlightClass"
              searchWords={splitQuery(nameSearch)}
              autoEscape={true}
              textToHighlight={" " + instance.openhour}
            ></Highlighter>
          </div>
        </div>
        <div className="flex flex-row space-x-2">
          <div className="font-semibold"> Rating: </div>
          <div
            className={`${
              (nameSearch?.includes(instance.rating) && "bg-[#ffff00]") ||
              (RatingMin &&
                RatingMax &&
                instance.rating >= RatingMin &&
                instance.rating <= RatingMax &&
                "bg-[#ffff00]")
            }`}
          >
            {" " + instance.rating}
          </div>
        </div>
        <a
          className="text-sky-400 hover:text-cyan-700"
          href={instance.websiteurl}
        >
          Website
        </a>
      </CardContent>
    </Card>
  );
}

export default ReentryCard;
