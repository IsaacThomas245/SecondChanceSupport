"use client";
import React, { useState, useEffect } from "react";

import RelatedCards from "@/components/RelatedCards";

const KEY = "AIzaSyCT7_cNQ9nTtOqQW9_z6YcnV52OIJMeUK4";

import Loading from "@/components/Loading";
import { BASE_URL } from "@/lib/BASE_URL";
import axios from "axios";
import Error from "@/components/Error";

function Page({ params }: { params: { id: number } }) {
  const id = params.id;

  //const instance = reentryInstances[0];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [instance, setInstance] = useState<any>({});

  useEffect(() => {
    axios
      .get(`${BASE_URL}/reentry/${id}`)
      .then((res) => {
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

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-black-400 text-2xl font-bold" id="reentry_instance_text">{instance.name}</h2>

      <img
        src={"data:image/png;base64," + instance.b64_img}
        className={"rounded-lg"}
      ></img>

      <div>{instance.programtype}</div>
      <a
        href={instance.websiteurl}
        className="text-sky-400 hover:text-cyan-700"
      >
        Website
      </a>
      <p>City: {instance.city} </p>
      <div>Hours of Operations: {instance.openhour}</div>
      <div>{instance.address1}</div>
      <iframe
        className="w-full h-96"
        loading="lazy"
        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCT7_cNQ9nTtOqQW9_z6YcnV52OIJMeUK4
    &q=${instance.address1}`}
      ></iframe>
      <RelatedCards cards={instance.related}></RelatedCards>
    </div>
  );
}

export default Page;
