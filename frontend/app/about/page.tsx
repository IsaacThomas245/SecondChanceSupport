"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toolInstances } from "./toolData";
import ToolCard from "./toolCard";

import Image from "next/image";

import Danny from "./imgs/Danny.jpg";
import Isaac from "./imgs/isaac.jpeg";
import Albert from "./imgs/Albert.png";
import Nabil from "./imgs/nabil.jpg";

type gitLabDataType = {
  firstName: string;
  commits: number;
  issues: number;
};

type profile = {
  name: string;
  image: string;
  description: string;
};

function Page() {
  const [gitlabData, setGitlabData] = useState<gitLabDataType[]>([
    { firstName: "Isaac", commits: 0, issues: 0 },
    { firstName: "Albert", commits: 0, issues: 0 },
    { firstName: "Danny", commits: 0, issues: 0 },
    { firstName: "Nabil", commits: 0, issues: 0 },
  ]);
  const projectId = 54659674;

  //https://gitlab.com/api/v4/projects/50428861/
  let parse: gitLabDataType[] = [
    { firstName: "Isaac", commits: 0, issues: 0 },
    { firstName: "Albert", commits: 0, issues: 0 },
    { firstName: "Danny", commits: 0, issues: 0 },
    { firstName: "Nabil", commits: 0, issues: 0 },
  ];

  const infos = [
    {
      name: "Isaac Thomas",
      image: Isaac,
      description:
        "I’m a second-year CS major at UT Austin. I enjoy playing games and reading manhwa/manga.",
      responsibility: "Frontend",
      unit_tests: "10",
    },
    {
      name: "Albert Sun",
      image: Albert,
      description: "I'm a third-year CS major, and I love Tailwind CSS",
      responsibility: "Frontend",
      unit_tests: "10",
    },
    {
      name: "Danny Zheng",
      image: Danny,
      description:
        "I'm a sophmore CS Major at UT Austin. I enjoy listening to video essays and coding. Vim is the best!",
      responsibility: "Backend",
      unit_tests: "10",
    },
    {
      name: "Nabil Chowdhury",
      image: Nabil,
      description: "Third year CS Major at UT Austin. Former top 10 Yasuo NA",
      responsibility: "Backend",
      unit_tests: "12",
    },
  ];

  useEffect(() => {
    const nameMap = new Map([
      ["isaac", 0],
      ["albert", 1],
      ["danny", 2],
      ["nabil", 3],
    ]);

    axios
      .get(
        `https://gitlab.com/api/v4/projects/${projectId}/repository/contributors`
      )
      .then((res) => {
        //console.log(res);
        res.data.forEach((element: any) => {
          // grab first name that is lowercase
          const gitName: string = element.name.toLowerCase().split(" ")[0];

          nameMap.forEach((nameIndex, contributorName) => {
            // check to see if lowercase git first name is part of
            // contributors name, done so different emails and
            // same name, with different capitalizations, are treated the same
            if (gitName.includes(contributorName)) {
              const index = nameMap.get(contributorName) || 0;
              parse[index].commits += element.commits;
            }
          });
        });
      })
      .catch((err) => console.log(err));

    const ISSUES_PER_PAGE = 20;

    axios
      .get(`https://gitlab.com/api/v4/projects/${projectId}/issues_statistics`)
      .then((res) => {
        const totalIssues = res.data.statistics.counts.all;
        const totalPages = Math.ceil(totalIssues / ISSUES_PER_PAGE);

        // pages start at 1, pages=0 and pages=1 are the same
        const pageApiLinks = [];

        for (let page = 0; page < totalPages; page++) {
          pageApiLinks.push(
            `https://gitlab.com/api/v4/projects/${projectId}/issues?state=closed&page=${page}`
          );
        }

        axios
          .all(pageApiLinks.map((pageLink) => axios.get(pageLink)))
          .then((responses) => {
            for (const res of responses) {
              res.data.forEach((closedIssue: any) => {
                if (closedIssue.closed_by) {
                  // grab the first git name, convert to lower case
                  const name = closedIssue.closed_by.name
                    .split(" ")[0]
                    .toLowerCase();
                  // grab index in parse that corresponds to the name
                  const index = nameMap.get(name) || 0;
                  parse[index].issues += 1;
                }
              });
            }
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            // console.log("parse at finally: " + JSON.stringify(parse));
            setGitlabData(parse);
          });
      });
  }, []);

  return (
    <div className="flex flex-col text-xs space-y-16">
      <div className="flex flex-col space-y-4">
        <div className="text-3xl font-semibold" id="about_text">
          About
        </div>
        <div className="text-lg text-gray-800 pr-8">
          Second Chance is a website to help people in Texas who were previously
          convicted of a crime reintegrate with society. We provide statistics
          to bring awareness to this community, as well as provide lists of
          re-entry programs and rehabilitation facilities that can be located by
          proximity.
        </div>
      </div>
      <div className="flex flex-col items-center">
        <iframe
          className="md:w-1/2 w-full h-96"
          src="https://www.youtube.com/embed/MPeyVZJvrAo?si=AAh9VH3JFAV2rNkN"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
      <div className="flex flex-col space-y-4">
        <div className="text-3xl font-semibold">Results</div>
        <div className="text-lg text-gray-800 pr-8">
          There are a lot of untapped resources for ex-convicts in Texas, and we
          hope that our research can spread awareness of them.
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        <div className="text-3xl font-semibold">Meet The Team</div>
        <div className="grid md:grid-cols-4 grid-cols-1 gap-3">
          {infos.map((person, i) => {
            return (
              <Card
                className="flex flex-col p-4 items-center"
                key={person.name}
              >
                <div className="h-72 bg-blue-200 relative w-full rounded-sm">
                  <Image
                    src={person.image}
                    alt={person.name + "'s photo"}
                    className="object-cover rounded-sm"
                    fill
                  />
                </div>
                <div className="text-lg">{person.name}</div>
                <div>Main Responsibility: {person.responsibility}</div>
                <div>{person.description}</div>
                <div>Commits: {gitlabData[i]?.commits}</div>
                <div>Closed Issues: {gitlabData[i]?.issues}</div>
                <div>Unit Tests: {person.unit_tests}</div>
              </Card>
            );
          })}
        </div>
      </div>
      <div className="flex justify-center text-3xl font-semibold">
        <div className="flex flex-col space-y-3">
          <div>
            Total Commits:{" "}
            {gitlabData.reduce(
              (totalCommit, person) => totalCommit + person["commits"],
              0
            )}
          </div>
          <div>
            Total Closed Issues:{" "}
            {gitlabData.reduce(
              (totalIssues, person) => totalIssues + person["issues"],
              0
            )}
          </div>
          <div>
            Total Unit Tests:{" "}
            {infos.reduce(
              (totalTests, person) => totalTests + Number(person["unit_tests"]),
              0
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="text-lg font-bold text-gray-800 mb-4">Tools Used</div>
        <div className="grid md:grid-cols-4 grid-cols-3 gap-8">
          {toolInstances.map((instance, index) => {
            return (
              <div key={instance.Name}>
                <ToolCard instance={instance} id={index} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="text-xl font-bold text-gray-800 mb-4">Data Sources</div>
        <a className="text-lg text-gray-800 pr-8 underline" href="https://findtreatment.gov/locator">FindTreatment Treatment Search</a>
        <a className="text-lg text-gray-800 pr-8 underline" href="https://www.careeronestop.org/Developers/WebAPI/ReEntryPrograms/list-reentry-program-contacts.aspx">
          CareerOneStop Re-Entry Programs
        </a>
        <a className="text-lg text-gray-800 pr-8 underline" href="https://data.texas.gov/dataset/Texas-Department-of-Criminal-Justice-Releases-FY-2/htfi-jkdg/about_data">
          Texas Department of Criminal Justice Releases
        </a>
        <a className="text-lg text-gray-800 pr-8 underline" href="https://www.google.com/maps/place/">
          Google Maps
        </a>
        <a className="text-lg text-gray-800 pr-8 underline" href="https://www.zip-codes.com/state/tx.asp">
          Zip Codes
        </a>
        <a className="text-lg text-gray-800 pr-8 underline" href="https://www.texas-demographics.com/counties_by_population">
          Texas Demographics
        </a>
        <a className="text-lg text-gray-800 pr-8 underline" href="https://en.wikipedia.org/wiki/">
          Wikipedia
        </a>
      </div>
      <div className="flex flex-col space-y-2">
        <Button asChild>
          <a href="https://documenter.getpostman.com/view/18391024/2sA2r6WPgJ">
            API Link
          </a>
        </Button>
        <Button asChild>
          <a href="https://gitlab.com/dannyzheng1/cs373-group-03">
            Gitlab Repositiory
          </a>
        </Button>
      </div>
    </div>
  );
}

export default Page;
