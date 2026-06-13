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
import { RehabSeachParams } from "./types";

type RehabCardProps = {
  instance: any;
  id: number;
  params: RehabSeachParams;
};

function RehabCard({ instance, id, params }: RehabCardProps) {
  const router = useRouter();
  const {
    searchName,
    searchAddress,
    searchCity,
    searchCounty,
    searchPayment,
    searchServices,
    searchTreatment,
  } = params;
  const format = (x: string) => {
    if (x.length > 30) return x.substring(0, 30) + "...";
    return x;
  };

  const title_format = (x: string) => {
    if (x.length > 15) return x.substring(0, 15) + "...";
    return x;
  };

  const splitQuery = (s?: string) => {
    if (s === undefined) {
      return [""];
    }
    return s.split(" ");
  };

  return (
    <Card
      className="hover:bg-gray-100 cursor-pointer flex flex-col "
      onClick={() => router.push(`/rehab/${id}`)}
      id="rehab_card"
    >
        <CardHeader>
          <CardTitle>
            <Highlighter
              highlightClassName="YourHighlightClass"
              searchWords={splitQuery(searchName)}
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
            <div className="">
              Treatment Type:{" "}
              <Highlighter
                highlightClassName="YourHighlightClass"
                searchWords={splitQuery(searchTreatment + " " + searchName)}
                autoEscape={true}
                textToHighlight={" " + instance.type}
              ></Highlighter>
            </div>
          </div>
          <div className="flex flex-col">
            <div className={`font-semibold`}>Payments:</div>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
              if (instance[`payment${index}`])
                return (
                  <div>
                    -{" "}
                    <Highlighter
                      highlightClassName="YourHighlightClass"
                      searchWords={splitQuery(searchName).concat(searchPayment!)}
                      autoEscape={true}
                      textToHighlight={format(" " + instance[`payment${index}`])}
                    ></Highlighter>
                  </div>
                );
            })}
          </div>
          <div className="flex flex-col flex-wrap">
            <div className={`font-semibold`}>Services:</div>
            {[0, 1, 2].map((index) => {
              if (instance[`services${index}`])
                return (
                  <div>
                    {" "}
                    -{" "}
                    <Highlighter
                      highlightClassName="YourHighlightClass"
                      searchWords={splitQuery(searchName).concat(searchServices!)}
                      autoEscape={true}
                      textToHighlight={format(" " + instance[`services${index}`])}
                    ></Highlighter>
                  </div>
                );
            })}
          </div>
          <div className="flex flex-row space-x-2">
            <div className="font-semibold">
              City:
              <Highlighter
                highlightClassName="YourHighlightClass"
                searchWords={splitQuery(searchName)}
                autoEscape={true}
                textToHighlight={" " + (instance.city || "N/A")}
              ></Highlighter>
            </div>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="font-semibold">
              County:
              <Highlighter
                highlightClassName="YourHighlightClass"
                searchWords={splitQuery(searchName)}
                autoEscape={true}
                textToHighlight={" " + (instance.county || "N/A")}
              ></Highlighter>
            </div>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="font-semibold">
              Address:
              <Highlighter
                highlightClassName="YourHighlightClass"
                searchWords={splitQuery(searchName)}
                autoEscape={true}
                textToHighlight={" " + (instance.address || "N/A")}
              ></Highlighter>
            </div>
          </div>
          <a className="text-sky-400 hover:text-cyan-700" href={instance.website}>
            Website
          </a>
        </CardContent>
    </Card>
  );
}

export default RehabCard;
