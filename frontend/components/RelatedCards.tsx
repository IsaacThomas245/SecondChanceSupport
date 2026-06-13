import React from "react";

import ReentryCard from "@/app/re-entry/reentryCard";
import RehabCard from "@/app/rehab/RehabCard";
import CountyCard from "@/app/county/countyCard";

function RelatedCards(cards: any) {
  //console.log(cards.cards);
  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="text-xl font-bold text-gray-800">Related Instances</div>
      <div className="w-full grid md:grid-cols-3 grid-cols-1 gap-4">
        {cards.cards &&
          cards.cards.map((card: any, index: number) => {
            if (card.instance_type === "rehab") {
              return (
                <RehabCard
                  instance={card}
                  id={card.id}
                  key={index}
                  params={{}}
                ></RehabCard>
              );
            }
            if (card.instance_type === "reentry") {
              return (
                <ReentryCard
                  instance={card}
                  id={card.id}
                  key={index}
                  params={{}}
                ></ReentryCard>
              );
            }
            return (
              <CountyCard
                instance={card}
                id={card.id}
                key={index}
                params={{}}
              ></CountyCard>
            );
          })}
      </div>
    </div>
  );
}

export default RelatedCards;
