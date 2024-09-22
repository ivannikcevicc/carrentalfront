"use client";

import { PuffLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="h-[70vh]  justify-center items-center flex flex-col">
      <PuffLoader size={100} color="blue" />
    </div>
  );
};

export default Loader;
