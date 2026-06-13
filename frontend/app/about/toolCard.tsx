"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardDescription,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

type ToolCardProps = {
  instance: any;
  id: number;
};

import Router, { useRouter } from "next/navigation";

function ToolCard({ instance, id }: ToolCardProps) {
  const router = useRouter();
  return (
    <a href={instance.Website}>
      <Card className="hover:bg-gray-100 cursor-pointer">
        <CardContent className="text-wrap">
          <img
            src={instance.Image}
            className={"object-cover rounded-sm w-full"}
          ></img>
        </CardContent>
        <CardHeader>
          <CardTitle className="text-center">{instance.Name}</CardTitle>
        </CardHeader>
      </Card>
    </a>
  );
}

export default ToolCard;
