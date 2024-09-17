import CarGrid from "@/components/car-grid";
import Landing from "@/components/landing";
import Search from "@/components/search";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div>
        <Landing />
        <Search />
      </div>
      <div className="flex justify-between items-center p-4 font-semibold max-w-[90%] mx-auto mt-[2rem]">
        <span className="text-gray-500">Popular Car</span>
        <Link
          href="/search"
          className="text-primary border-b-2 border-b-transparent hover:border-b-primary transition-300 transition-all"
        >
          View All
        </Link>
      </div>
      <CarGrid />
    </>
  );
}
