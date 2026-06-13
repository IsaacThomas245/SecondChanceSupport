import React from "react";

const temp = "animate-spin"; //make sure tailwind class is loaded
import { ImSpinner8 } from "react-icons/im";
function Loading() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="animate-spin">
        <ImSpinner8 />
        <div className="opacity-0 absolute">Loading</div>
      </div>
    </div>
  );
}

export default Loading;
