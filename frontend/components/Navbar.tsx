"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

type NavbarProps = {
  title: string;
};

type navigationItemType = {
  name: string;
  url: string;
  id: string;
};

const navigationItems: navigationItemType[] = [
  { name: "Home", url: "", id: "navbar_home" },
  { name: "About", url: "about", id: "navbar_about" },
  { name: "Re-Entry", url: "re-entry", id: "navbar_reentry" },
  { name: "Rehab", url: "rehab", id: "navbar_rehab" },
  { name: "Counties", url: "county", id: "navbar_county" },
  { name: "Visualizations", url: "data-viz", id: "navbar_viz" },
];

function Navbar({ title }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedPage, setSelectedPage] = useState<string>("");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = (url: string) => {
    router.push(`/${url}`);
  };

  useEffect(() => {
    const splitPath = pathname.split("/");
    const selectedVal = splitPath[1];
    setSelectedPage(selectedVal);
  }, [pathname]);

  const [text, setText] = useState("");
  return (
    <div className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="w-full flex flex-wrap items-center justify-between mx-auto p-4 border-b border-gray-200">
        <span className="self-center font-semibold whitespace-nowrap dark:text-white">
          Second Chance
        </span>

        <div className="flex md:order-2">
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search icon</span>
            </div>
            <div className="flex flex-row space-x-2">
              <input
                value={text}
                type="text"
                id="search-navbar"
                className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search..."
                onChange={(e) => setText(e.target.value)}
              />
              <Button
                id="search-button"
                onClick={() => router.push(`search?q=${text}`)}
              >
                Search
              </Button>
            </div>
          </div>
          <button
            data-collapse-toggle="navbar-search"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-search"
            aria-expanded="false"
            onClick={() => setShowMenu(!showMenu)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`items-center justify-between ${
            showMenu ? "visible" : "hidden"
          } w-full md:flex md:w-auto md:order-1`}
          id="navbar-search"
        >
          <div className="relative mt-3 md:hidden">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <div className="flex flex-row space-x-2">
              <input
                type="text"
                id="search-navbar"
                className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <Button onClick={() => router.push(`search?q=${text}`)}>
                Search
              </Button>
            </div>
          </div>

          <div className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-4 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {navigationItems.map((item, index) => {
              return (
                <Button
                  type="button"
                  key={item.url}
                  className={`${
                    selectedPage === item.url ? "bg-slate-200" : "bg-white"
                  } text-black hover:bg-slate-100`}
                  onClick={() => {
                    (navigate(item.url), setShowMenu(false));
                  }}
                  id={item.id}
                >
                  {item.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
