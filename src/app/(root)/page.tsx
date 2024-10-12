import CarGrid from "@/components/car-grid";
import Landing from "@/components/landing";
import Search from "@/components/search";
import Link from "next/link";
import Testimonials from "@/components/testimonials";
import { getVehicles } from "@/lib/queries";

export default async function Home() {
  const carsResponse = await getVehicles({ per_page: 4 });

  return (
    <div className="background-light">
      <div>
        <Landing />
        <Search />
      </div>
      <div className="flex justify-between items-center p-4 font-semibold max-w-[90%] mx-auto mt-[2rem]">
        <span className="text-gray-500">Popular Car</span>
        <Link
          href="/cars"
          className="text-primary border-b-2 border-b-transparent hover:border-b-primary transition-300 transition-all"
        >
          View All
        </Link>
      </div>
      <CarGrid filter={true} cars={carsResponse.data} />
      <Testimonials />
    </div>
  );
}
