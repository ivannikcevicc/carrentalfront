import CarGrid from "@/components/car-grid";
import Search from "@/components/search";
import React from "react";

const page = () => {
  return (
    <div className="flex">
      <aside className="w-[30%]"></aside>
      <main className="w-[70%]  py-6 ">
        <Search />
        <CarGrid slim={true} />
      </main>
    </div>
  );
};

export default page;
