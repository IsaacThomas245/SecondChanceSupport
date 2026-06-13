import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Check, Search } from "lucide-react";
import { Input } from "./ui/input";
type MultiSelectProps = {
  selectOptions: string[];
  selectedValues: boolean[];
  editSelectValues: (index: number) => void;
  searchBar?: boolean;
};

function MultiSelect({
  selectOptions,
  selectedValues,
  editSelectValues,
  searchBar,
}: MultiSelectProps) {
  const [searchQ, setSearchQ] = useState("");

  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        {selectedValues.reduce((acc, c) => acc + (c ? 1 : 0), 0)} Selected
      </SelectTrigger>
      <SelectContent>
        {searchBar && (
          <div className={`flex flex-row`}>
            <div className="p-2">
              <Search className="h-4 w-4" />
            </div>
            <input
              className="text-sm py-0 w-full border-gray-100 border px-2"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
            ></input>
          </div>
        )}

        {selectOptions.map((p: string, index: number) => {
          if (p.match(`${searchQ}.*`))
            return (
              <div
                className={`flex flex-row hover:bg-blue-50 ${
                  selectedValues[index] && "bg-blue-100"
                }`}
                onClick={() => editSelectValues(index)}
                key={p + index}
              >
                <div className="p-2">
                  {selectedValues[index] ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <div className="h-4 w-4"></div>
                  )}
                </div>
                <div className="p-1 text-sm" key={p}>
                  {p}
                </div>
              </div>
            );
        })}
      </SelectContent>
    </Select>
  );
}

export default MultiSelect;
