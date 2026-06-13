"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { BarChartBig, School2, Cross } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const navigate = (url: string) => {
    router.push(`/${url}`);
  };

  return (
    <main className="flex flex-col items-center text-xs space-y-16">
      <div className="flex md:flex-row w-full flex-col-reverse">
        <div className="w-full md:w-1/2 space-y-8">
          <div className="text-3xl font-semibold" id="home_text">
            Second Chance Support
          </div>
          <div className="text-lg text-gray-800 pr-8">
            Second Chance is a website to help people in Texas who were
            previously convicted of a crime reintegrate with society. We provide
            statistics to bring awareness to this community, as well as provide
            lists of re-entry programs and rehabilitation facilities that can be
            located by proximity.
          </div>
          <Button size={"lg"} onClick={() => navigate("county")}>
            Learn More
          </Button>
        </div>
        <div className="w-full md:w-1/2 items-center justify-center md:mb-0 mb-8">
          <img
            src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="rounded-md w-full h-[400px] object-cover"
            alt="Person breaking free of chains with sunset behind."
          ></img>
        </div>
      </div>

      <div className="text-3xl font-semibold">Explore</div>
      <div className="flex md:flex-row flex-col items gap-4">
        <Card
          className="p-4 flex flex-row space-y-4 items-center hover:bg-gray-50 cursor-pointer"
          onClick={() => navigate("county")}
        >
          <BarChartBig size={80} className="mr-2" />
          <div>Statistics from 254 Texas Counties</div>
        </Card>
        <Card
          className="p-4 flex flex-row items-center hover:bg-gray-50 cursor-pointer"
          onClick={() => navigate("re-entry")}
        >
          <School2 size={80} className="mr-2" />
          <div>Over 500 Re-Entry Programs</div>
        </Card>
        <Card
          className="p-4 flex flex-row items-center hover:bg-gray-50 cursor-pointer"
          onClick={() => navigate("rehab")}
        >
          <Cross size={80} className="mr-2" />
          <div>Over 1000 Rehab Programs</div>
        </Card>
      </div>
      <iframe
        className="md:w-1/2 w-full h-96"
        src="https://www.youtube.com/embed/DczkgbD7JkQ?si=vu7ntaLSY735Cxvp"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </main>
  );
}
