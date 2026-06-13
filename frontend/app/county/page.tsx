"use client";
import React, { useState, useEffect } from "react";

import Router, { useRouter } from "next/navigation";
import CountyCard from "./countyCard";
import { CiSearch } from "react-icons/ci";

import { Input } from "@/components/ui/input";

import PageSelect from "@/components/PageSelect";

import Loading from "@/components/Loading";
import axios from "axios";
import { BASE_URL } from "@/lib/BASE_URL";
import Error from "@/components/Error";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CountySearchParams } from "./types";

const rangeFilterNames: string[] = [
  "typeviolent",
  "typeproperty",
  "typeother",
  "typedrug",
  "typetotal",
  "population_rank",
  "population",
];

// range_cols = ["typeviolent", "typeproperty", "typeother", "typedrug",
//               "typetotal", "population_rank", "population"]

function Page() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [instances, setInstances] = useState<any>({});
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [apiUrl, setApiUrl] = useState(`${BASE_URL}/search?model=county&sort=asc`);
  const [sortOrderDesc, setSortOrderDesc] = useState(false);

  // TODO: use rangeFilters[i]'s name instead of index
  // 2d array, subarray stores [lower, upper] range values
  const [rangeFilterValues, setRangeFilterValues] = useState(
    new Array(rangeFilterNames.length).fill(new Array(2).fill(0))
  );

  const [prevSearch, setPrevSearch] = useState<CountySearchParams>({
    nameQuery: searchQuery,
    rangeQueries: rangeFilterValues,
    rangeFilterNames: rangeFilterNames,
  });

  const updateRangeValues = (
    rangeIndex: number,
    newValue: number,
    isLowerValue: boolean
  ) => {
    const newRangeValues = rangeFilterValues.map(
      (rangeValues, copyRangeIndex) => {
        const newRange = rangeValues.slice();

        if (rangeIndex == copyRangeIndex) {
          if (isLowerValue) {
            newRange[0] = newValue;
          } else {
            newRange[1] = newValue;
          }
        }
        return newRange;
      }
    );
    setRangeFilterValues(newRangeValues);
  };

  const getPage = async (page: number) => {
    setLoading(true);
    axios
      .get(`${apiUrl}&page=${page}`)
      .then((res) => {
        if (!res.data.results) {
          setError(true);
        }
        //console.log(res);
        setInstances(res.data.results);
        setPage(res.data.page);
        setTotalPages(res.data.totalPages);
        setTotalResults(res.data.total);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  const search = () => {
    // Build the api call
    let apiCallUrl = `${BASE_URL}/search?model=county`;

    if (searchQuery != "") {
      apiCallUrl += "&query=" + searchQuery.split(" ").join(",");
    }

    if (sortOrderDesc) {
      apiCallUrl += "&sort=desc";
    } else {
      apiCallUrl += "&sort=asc";
    }

    for (let i = 0; i < rangeFilterNames.length; i++) {
      const lowerRating = rangeFilterValues[i][0];
      const upperRating = rangeFilterValues[i][1];

      if (lowerRating != upperRating) {
        apiCallUrl +=
          "&" + rangeFilterNames[i] + "=" + lowerRating + "," + upperRating;
      }
    }

    //console.log("api call url: " + apiCallUrl);

    // useEffect listens to changes in apiUrl, will fire
    // getPage on change
    setApiUrl(apiCallUrl);
    const newSearch = {
      nameQuery: searchQuery,
      rangeQueries: rangeFilterValues,
      rangeFilterNames: rangeFilterNames,
    };
    setPrevSearch(newSearch);
  };

  useEffect(() => {
    getPage(1);
  }, [apiUrl]);

  if (error) {
    return <Error />;
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="text-2xl font-semibold" id="county_text">
        Counties
      </div>
      <div className="flex flex-col md:flex-row gap-2">
        <Card className="flex flex-col gap-2 p-4 w-full">
          <div className="text-xl font-semibold">Filters</div>
          <div className="flex flex-col w-full space-y-2">
            <div className="font-semibold">Search: </div>
            <Input
              placeholder="Instance Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {rangeFilterNames.map((rangeFilterName, rangeIndex) => {
            return (
              <div
                className="flex flex-col w-full space-y-2"
                key={rangeFilterName}
              >
                <div className="font-semibold">
                  Filter By {rangeFilterName}:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder={rangeFilterName + " Lower Rating"}
                    value={rangeFilterValues[rangeIndex][0]}
                    // onChange={(e) => setLowerRating(e.target.value)}
                    onChange={(e) =>
                      updateRangeValues(
                        rangeIndex,
                        e.target.valueAsNumber,
                        true
                      )
                    }
                    key={rangeFilterName + rangeIndex + "Lower"}
                  />
                  <Input
                    type="number"
                    placeholder={rangeFilterName + " Upper Rating"}
                    value={rangeFilterValues[rangeIndex][1]}
                    onChange={(e) =>
                      updateRangeValues(
                        rangeIndex,
                        e.target.valueAsNumber,
                        false
                      )
                    }
                    key={rangeFilterName + rangeIndex + "Upper"}
                  />
                </div>
              </div>
            );
          })}
          <div className="items-top flex space-x-2">
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
      </div>

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
                  <CountyCard
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
