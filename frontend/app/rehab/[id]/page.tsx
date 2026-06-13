"use client";
import React, { useState, useEffect } from "react";

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
      .get(`${BASE_URL}/rehab/${id}`)
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
      <h2 className="text-black-400 text-2xl font-bold" id="rehab_instance_text">{instance.name}</h2>
      {instance.Rating && <div>{instance.Rating}</div>}
      <img
        src={"data:image/png;base64," + instance.b64_img}
        className={"rounded-lg"}
      ></img>
      <div>{instance.description}</div>
      <a href={instance.website} className="text-sky-400 hover:text-cyan-700">
        Website
      </a>
      {instance.phone && <div>Phone number: {instance.phone}</div>}
      <div>Primary Treatment Type: {instance.type}</div>
      <div className="flex flex-col">
        <div>Services:</div>
        {instance.services0 && <div>{instance.services0}</div>}
        {instance.services1 && <div>{instance.services1}</div>}
        {instance.services2 && <div>{instance.services2}</div>}
        {instance.services3 && <div>{instance.services3}</div>}
      </div>

      <div className="flex flex-col">
        <div>Payments:</div>
        {instance.payment0 && <div>{instance.payment0}</div>}
        {instance.payment1 && <div>{instance.payment1}</div>}
        {instance.payment2 && <div>{instance.payment2}</div>}
        {instance.payment3 && <div>{instance.payment3}</div>}
      </div>

      <div>Address: {instance.address}</div>
      <iframe
        className="w-full h-96"
        loading="lazy"
        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCT7_cNQ9nTtOqQW9_z6YcnV52OIJMeUK4
    &q=${instance.address}`}
      ></iframe>
      <RelatedCards cards={instance.related}></RelatedCards>
    </div>
  );
}

export default Page;
