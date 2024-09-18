import CarGrid from "@/components/car-grid";
import Search from "@/components/search";
import { SearchForm } from "@/components/search-form";
import React from "react";

const page = () => {
  return (
    <div className="flex bg-light">
      <aside className="w-[25%]">
        <SearchForm />
      </aside>
      <main className="w-[75%]  py-6 ">
        <Search />
        <CarGrid slim={true} />
      </main>
    </div>
  );
};

export default page;
