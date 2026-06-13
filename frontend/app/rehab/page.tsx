"use client";
import React, { useState, useEffect } from "react";

import Router, { useRouter } from "next/navigation";
import RehabCard from "./RehabCard";
import { CiSearch } from "react-icons/ci";

import { Checkbox } from "@/components/ui/checkbox";

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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { paymentOptions, servicesOptions } from "./paymentOptions";
import MultiSelect from "@/components/MultiSelect";
import { RehabSeachParams } from "./types";
const treatmentTypes = ["All", "Substance Use", "Mental Health"];

function Page() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [instances, setInstances] = useState<any>({});
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [apiUrl, setApiUrl] = useState(`${BASE_URL}/search?model=rehab&sort=asc`);

  const [sortOrderDesc, setSortOrderDesc] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [addressQuery, setAddressQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [countyQuery, setCountyQuery] = useState("");
  const [typeQuery, setTypeQuery] = useState("");

  const [payments, setPayments] = useState(
    new Array(paymentOptions.length).fill(false)
  );

  const togglePayments = (i: number) => {
    const newPayments = payments.slice();
    newPayments[i] = !payments[i];
    setPayments(newPayments);
  };

  const [services, setServices] = useState(
    new Array(servicesOptions.length).fill(false)
  );

  const toggleServices = (i: number) => {
    const newServices = services.slice();
    newServices[i] = !newServices[i];
    setServices(newServices);
  };

  const [prevSearch, setPrevSearch] = useState<RehabSeachParams>({
    searchName: searchQuery,
    searchAddress: addressQuery,
    searchCity: cityQuery,
    searchCounty: countyQuery,
    searchTreatment: typeQuery,
    searchPayment: paymentOptions.filter((p, i) => payments[i]),
    searchServices: servicesOptions.filter((p, i) => services[i]),
  });

  //http://127.0.0.1:5000/api/v1/search?model=rehab&name=reh&address=12&type=Substance%20Use

  const getPage = async (page: number) => {
    setLoading(true);
    axios
      .get(`${apiUrl}&page=${page}`)
      .then((res) => {
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
    let apiCallUrl = `${BASE_URL}/search?model=rehab`;

    if (searchQuery != "") {
      apiCallUrl += "&query=" + searchQuery.split(" ").join(",");
    }

    if (typeQuery !== "All" && typeQuery !== "") {
      apiCallUrl += "&type=" + typeQuery;
    }

    if (sortOrderDesc) {
      apiCallUrl += "&sort=desc";
    } else {
      apiCallUrl += "&sort=asc";
    }

    let selectedPayments: string[] = [];
    // go through the payments boolean array, if
    // true, append the payment, else, append comma
    // will be using cumulated payments to grab results
    payments.forEach((isSelected, paymentIndex) => {
      if (isSelected) {
        selectedPayments.push(paymentOptions[paymentIndex]);
      }
    });

    let selectedServices: string[] = [];
    // same thing is true of services
    services.forEach((isSelected, serviceIndex) => {
      if (isSelected) {
        selectedServices.push(servicesOptions[serviceIndex]);
      }
    });

    if (selectedPayments.length > 0) {
      apiCallUrl += "&payment=" + selectedPayments.join();
    }

    if (selectedServices.length > 0) {
      apiCallUrl += "&services=" + selectedServices.join();
    }

    console.log("api call url: " + apiCallUrl);
    // useEffect listens to changes in apiUrl, will fire
    // getPage on change
    setApiUrl(apiCallUrl);

    const newSearch = {
      searchName: searchQuery,
      searchAddress: addressQuery,
      searchCity: cityQuery,
      searchCounty: countyQuery,
      searchTreatment: typeQuery,
      searchPayment: paymentOptions.filter((p, i) => payments[i]),
      searchServices: servicesOptions.filter((p, i) => services[i]),
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
      <div className="text-2xl font-semibold" id="rehab_text">
        Rehab Resources
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
          <div className="font-semibold">Treatment Type:</div>
          <Select onValueChange={(e) => setTypeQuery(e)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              {treatmentTypes.map((type) => {
                return (
                  <SelectItem value={type} key={type}>
                    {type}{" "}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col w-full space-y-2">
          <div className="font-semibold">Select Payment Type:</div>
          <MultiSelect
            selectOptions={paymentOptions}
            selectedValues={payments}
            editSelectValues={togglePayments}
            searchBar={true}
          />
        </div>
        <div className="flex flex-col w-full space-y-2">
          <div className="font-semibold">Select Services:</div>
          <MultiSelect
            selectOptions={servicesOptions}
            selectedValues={services}
            editSelectValues={toggleServices}
            searchBar={true}
          />
        </div>
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
                // console.log("instance: " + JSON.stringify(instance));
                return (
                  <RehabCard
                    instance={instance}
                    id={instance.id}
                    key={instance.name + instance.id}
                    params={prevSearch}
                  />
                );
              })}
          </div>
          {instances.length === 0 ? (
            <div>No Results Found</div>
          ) : (
            <PageSelect page={page} getPage={getPage} totalPages={totalPages} />
          )}
        </div>
      )}
    </div>
  );
}

export default Page;
