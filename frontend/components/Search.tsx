"use client";
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";

import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";

type searchProps = {
  submit: (query: string) => void;
};

function Search({ submit }: searchProps) {
  const [text, setText] = useState("");
  return (
    <div className="flex flex-row">
      <div className="border border-input border-r-0 rounded-l-md items-center justify-center flex flex-row px-2">
        <CiSearch className="w-4 h-4" onClick={() => submit(text)} />
      </div>
      <Input
        placeholder="Search"
        className="rounded-l-none border-l-0 mr-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button onClick={() => submit(text)}>Search</Button>
    </div>
  );
}

export default Search;
