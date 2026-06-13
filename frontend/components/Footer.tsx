"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import CareerOneStop from "./images/careeronestop.jpg";
type FooterProps = {
  title: string;
};

function Footer({ title }: FooterProps) {
  const router = useRouter();
  const redirectHome = () => {
    router.push("/");
  };
  const redirectAbout = () => {
    router.push("/about");
  };
  const redirectReentry = () => {
    router.push("/re-entry");
  };
  const redirectRehab = () => {
    router.push("/rehab");
  };
  const redirectCounty = () => {
    router.push("/county");
  };
  const redirectViz = () => {
    router.push("/data-viz");
  };

  const redirectDevViz = () => {
    router.push("/dev-viz");
  };

  return (
    <div
      style={{ bottom: 0, width: "100%" }}
      className="p-4 bg-white flex gap-x-12 items-baseline justify-between"
    >
      {title}
      <div>
        <Button
          type="button"
          className=" bg-white text-black hover:bg-slate-500"
          onClick={redirectHome}
          id="footer_home"
        >
          Home
        </Button>
        <Button
          type="button"
          className=" bg-white text-black hover:bg-slate-500"
          onClick={redirectAbout}
          id="footer_about"
        >
          About
        </Button>
        <Button
          type="button"
          className=" bg-white text-black hover:bg-slate-500"
          onClick={redirectReentry}
          id="footer_reentry"
        >
          Re-Entry
        </Button>
        <Button
          type="button"
          className=" bg-white text-black hover:bg-slate-500"
          onClick={redirectRehab}
          id="footer_rehab"
        >
          Rehab
        </Button>
        <Button
          type="button"
          className=" bg-white text-black hover:bg-slate-500"
          onClick={redirectCounty}
          id="footer_county"
        >
          Counties
        </Button>
        <Button
          type="button"
          className=" bg-white text-black hover:bg-slate-500"
          onClick={redirectViz}
          id="footer_viz"
        >
          Visualizations
        </Button>
      </div>
      <div>
        <Image
          src={CareerOneStop}
          alt={"Photo saying Powered by CareerOneStop, also shows logo"}
          className="w-20 h-14"
        />
      </div>
    </div>
  );
}

export default Footer;
