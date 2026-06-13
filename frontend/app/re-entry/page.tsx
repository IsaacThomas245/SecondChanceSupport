"use client";
import React, { useState, useEffect } from "react";

import Router, { useRouter } from "next/navigation";
import ReentryCard from "./reentryCard";
import { CiSearch } from "react-icons/ci";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import PageSelect from "@/components/PageSelect";

import Loading from "@/components/Loading";
import axios from "axios";
import { BASE_URL } from "@/lib/BASE_URL";

import Error from "@/components/Error";

import { countyOptions, programTypeOptions } from "./filterOptions";

import MultiSelect from "@/components/MultiSelect";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { userAgent } from "next/server";

import { ReentrySearchParams } from "./types";

function Page() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [instances, setInstances] = useState<any>({});
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [sortOrderDesc, setSortOrderDesc] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [lowerRating, setLowerRating] = useState(0);
  const [upperRating, setUpperRating] = useState(0);

  const [apiUrl, setApiUrl] = useState(`${BASE_URL}/search?model=reentry&sort=asc`);

  const [programType, setProgramType] = useState(
    new Array(programTypeOptions.length).fill(false)
  );

  // note: treating state as immutable (hence creation),
  // to avoid stale state from setter
  const toggleProgram = (i: number) => {
    const newProgram = programType.slice();
    newProgram[i] = !programType[i];
    setProgramType(newProgram);
  };

  const [county, setCounty] = useState(
    new Array(countyOptions.length).fill(false)
  );

  const toggleCounty = (i: number) => {
    const newServices = county.slice();
    newServices[i] = !newServices[i];
    setCounty(newServices);
  };

  const [prevSearch, setPrevSearch] = useState<ReentrySearchParams>({
    nameSearch: searchQuery,
    countySearch: countyOptions.filter((p, i) => county[i]),
    programType: programTypeOptions.filter((p, i) => programType[i]),
    RatingMax: upperRating,
    RatingMin: lowerRating,
  });

  // todo:
  // filter:

  // columns_to_filter = ["programtype", "county"]
  // search_cols: list[str] = ["name", "address1", "city"]
  // range_cols = ["rating"]

  const getPage = async (page: number) => {
    setLoading(true);
    axios
      .get(`${apiUrl}&page=${page}`)
      .then((res) => {
        //console.log("getPage url: " + `${apiUrl}&page=${page}`);
        if (!res.data.results) {
          //console.log("res.data: " + res.data.toString());
          setError(true);
        }
        // console.log("api url: " + `${apiUrl}&page=${page}`);
        // console.log("page: " + res.data.page + ". total pages: " + res.data.totalPages)
        setInstances(res.data.results);
        setPage(res.data.page);
        setTotalPages(res.data.totalPages);
        setTotalResults(res.data.total);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getPage(1);
  }, []);

  const search = () => {
    // Build the api call
    let apiCallUrl = `${BASE_URL}/search?model=reentry`;

    if (searchQuery != "") {
      apiCallUrl += "&query=" + searchQuery.split(" ").join(",");
    }

    if (sortOrderDesc) {
      apiCallUrl += "&sort=desc";
    } else {
      apiCallUrl += "&sort=asc";
    }
    // go through the payments boolean array, if
    // true, append the payment, else, append comma
    // will be using cumulated payments to grab results
    let selectedProgramType: string[] = programTypeOptions.filter(
      (p, i) => programType[i]
    );
    // same thing is true of counties
    let selectedCounties: string[] = countyOptions.filter((p, i) => county[i]);

    if (selectedProgramType.length > 0) {
      apiCallUrl += "&programtype=" + selectedProgramType.join();
    }

    if (selectedCounties.length > 0) {
      apiCallUrl += "&county=" + selectedCounties.join();
    }

    // there's a rating, query for it
    if (lowerRating != upperRating) {
      apiCallUrl += "&rating=" + lowerRating + "," + upperRating;
    }

    // useEffect listens to changes in apiUrl, will fire
    // getPage on change
    setApiUrl(apiCallUrl);

    const newReentryParams = {
      nameSearch: searchQuery,
      countySearch: countyOptions.filter((p, i) => county[i]),
      programType: programTypeOptions.filter((p, i) => programType[i]),
      RatingMax: upperRating,
      RatingMin: lowerRating,
    };

    setPrevSearch(newReentryParams);
  };

  useEffect(() => {
    getPage(1);
  }, [apiUrl]);

  if (error) {
    return <Error />;
  }
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-2xl font-semibold" id="reentry_text">
        Re-Entry Resources
      </div>
      <Card className="flex flex-col gap-2 p-4">
        <div className="text-xl font-semibold">Filters</div>
        <div className="flex flex-col w-full space-y-2">
          <div className="font-semibold">Search: </div>
          <Input
            placeholder="Instance Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-full space-y-2">
          <div className="font-semibold">Select Program Type:</div>
          <MultiSelect
            selectOptions={programTypeOptions}
            selectedValues={programType}
            editSelectValues={toggleProgram}
            searchBar={true}
          />
        </div>
        <div className="flex flex-col w-full space-y-2">
          <div className="font-semibold">Select County:</div>
          <MultiSelect
            selectOptions={countyOptions}
            selectedValues={county}
            editSelectValues={toggleCounty}
            searchBar={true}
          />
        </div>

        {/* TODO: REPLACE WITH SOMETHING BETTER, really scuffed rating  */}
        <div className="flex flex-col w-full space-y-2">
          <div className="font-semibold">Filter By Rating:</div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Lower Rating"
              value={lowerRating}
              onChange={(e) => setLowerRating(e.target.valueAsNumber)}
            />
            <Input
              type="number"
              placeholder="Upper Rating"
              value={upperRating}
              onChange={(e) => setUpperRating(e.target.valueAsNumber)}
            />
          </div>
        </div>

        <div className="items-top flex flex-row space-x-2">
          <Checkbox onClick={() => setSortOrderDesc(!sortOrderDesc)} />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms1"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Sort By Name/Address (Z - A)
            </label>
          </div>
        </div>
        <Button className="mt-4" onClick={search}>
          Apply
        </Button>
      </Card>

      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row space-x-4">
            <div>Total Results: {totalResults}</div>
            <div>{`Page ${page} out of ${totalPages}`}</div>
          </div>
          <div className="grid md:grid-cols-4 gap-8 grid-cols-1">
            {instances &&
              instances.map((instance: any, index: number) => {
                return (
                  <ReentryCard
                    instance={instance}
                    id={instance.id}
                    key={instance.name + instance.id}
                    params={prevSearch}
                  />
                );
              })}
          </div>
          <PageSelect page={page} getPage={getPage} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}

export default Page;
