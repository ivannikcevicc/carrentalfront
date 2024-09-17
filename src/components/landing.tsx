import React from "react";

import Car from "./../../public/RI-2 22.png";

const Landing = () => {
  return (
    <div className=" w-full min-h-[60vh] relative  flex">
      <div className="w-[100%]   sm:pl-[8%] max-w-[95%] mx-auto sm:max-w-none text-center sm:text-left">
        <h1 className="lg:text-[85px] md:text-[60px] sm:text-[50px] text-[40px] font-bold max-w-[1000px] px-[2rem] leading-tight mt-[7rem] ">
          Drive Your Journey with{" "}
          <span className="text-blue-600">Confidence!</span>
        </h1>
      </div>
      <div className="w-[1050px] absolute right-0 top-[20%] z-[-10]">
        <img
          src={Car.src} // Replace with your actual car image path
          alt="Luxury blue sports car"
          className="w-full h-auto "
        />
      </div>
    </div>
  );
};

export default Landing;
