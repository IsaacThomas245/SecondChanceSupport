"use client";
import React, { useState, useEffect } from "react";

import Router, { useRouter } from "next/navigation";

import PageSelect from "@/components/PageSelect";

import Loading from "@/components/Loading";
import axios from "axios";
import { BASE_URL } from "@/lib/BASE_URL";
import Error from "@/components/Error";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Search from "@/components/Search";
import RehabCard from "@/app/rehab/RehabCard";
import ReentryCard from "../re-entry/reentryCard";
import CountyCard from "../county/countyCard";

import { useSearchParams } from "next/navigation";

function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const param = searchParams.get("q");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [apiUrl, setApiUrl] = useState(`${BASE_URL}/search?`);
  const [rehabInstances, setRehabInstances] = useState<any>([]);
  const [reentryInstances, setReentryInstances] = useState<any>([]);
  const [countyInstances, setCountyInstances] = useState<any>([]);

  const [search, setSearch] = useState(param || "");
  //http://127.0.0.1:5000/api/v1/search?model=rehab&name=reh&address=12&type=Substance%20Use

  const getPage = async (page: number) => {
    setLoading(true);
    const query = search.split(" ").join(",");
    axios
      .all([
        axios.get(`${apiUrl}model=rehab&query=${query}&page=${page}`),
        axios.get(`${apiUrl}model=reentry&query=${query}&page=${page}`),
        axios.get(`${apiUrl}model=county&query=${query}&page=${page}`),
      ])
      .then(
        axios.spread((res1, res2, res3) => {
          if (!res1.data.results || !res2.data.results || !res3.data.results) {
            setError(true);
          }
          // console.log("api url: " + `${apiUrl}`);
          // console.log("page: " + res.data.page + ". total pages: " + res.data.totalPages)
          setRehabInstances(res1.data.results);
          setReentryInstances(res2.data.results);
          setCountyInstances(res3.data.results);
          setPage(res1.data.page);
          setTotalPages(
            Math.max(
              res1.data.totalPages,
              res2.data.totalPages,
              res3.data.totalPages
            )
          );
          setTotalResults(res1.data.total + res2.data.total + res3.data.total);
        })
      )
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getPage(1);
  }, [param]);

  useEffect(() => {
    getPage(1);
  }, [search]);

  if (error) {
    return <Error />;
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="text-2xl font-semibold" id="search_text">
        Search
      </div>
      <Search
        submit={(str) => {
          setSearch(str);
        }}
      />
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row space-x-4">
            <div>Total Results: {totalResults}</div>
            <div>{`Page ${page} out of ${totalPages}`}</div>
          </div>
          <div className="font-semibold"> Rehab Instances </div>
          <div className="grid md:grid-cols-4 gap-8 grid-cols-1">
            {rehabInstances &&
              rehabInstances.map((instance: any, index: number) => {
                return (
                  <RehabCard
                    instance={instance}
                    id={instance.id}
                    key={instance.name + instance.id}
                    params={{ searchName: search }}
                  />
                );
              })}
          </div>
          {rehabInstances.length === 0 && <div>No Rehab Instances Found</div>}
          <div className="font-semibold"> Reentry Instances </div>
          <div className="grid md:grid-cols-4 gap-8 grid-cols-1">
            {reentryInstances &&
              reentryInstances.map((instance: any, index: number) => {
                return (
                  <ReentryCard
                    instance={instance}
                    id={instance.id}
                    key={instance.name + instance.id}
                    params={{ nameSearch: search }}
                  />
                );
              })}
          </div>
          {reentryInstances.length === 0 && (
            <div>No Reentry Instances Found</div>
          )}
          <div className="font-semibold"> County Instances </div>
          <div className="grid md:grid-cols-4 gap-8 grid-cols-1">
            {countyInstances &&
              countyInstances.map((instance: any, index: number) => {
                return (
                  <CountyCard
                    instance={instance}
                    id={instance.id}
                    key={instance.name + instance.id}
                    params={{ nameQuery: search }}
                  />
                );
              })}
          </div>
          {countyInstances.length === 0 && <div>No County Instances Found</div>}
          <PageSelect page={page} getPage={getPage} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}

export default Page;
