import { getVehicles } from "@/lib/queries";
import CarGrid from "@/components/car-grid";
import { SearchForm } from "@/components/forms/search-form";
import Search from "@/components/search";
import { getUserInfo } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function CarsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUserInfo();
  if (!user) {
    redirect("/login");
  }

  const filters = {
    type: Array.isArray(searchParams["type[]"])
      ? searchParams["type[]"]
      : searchParams["type[]"]
      ? [searchParams["type[]"]]
      : undefined,
    seating_capacity: Array.isArray(searchParams["seating_capacity[]"])
      ? searchParams["seating_capacity[]"]
      : searchParams["seating_capacity[]"]
      ? [searchParams["seating_capacity[]"]]
      : undefined,
    make: Array.isArray(searchParams["make[]"])
      ? searchParams["make[]"]
      : searchParams["make[]"]
      ? [searchParams["make[]"]]
      : undefined,
    max_price: searchParams.max_price
      ? parseInt(searchParams.max_price as string)
      : undefined,
    is_available: searchParams.is_available === "1",
  };

  const cars = await getVehicles(filters);
  return (
    <div className="flex bg-light">
      <aside className="w-[25%]">
        <SearchForm />
      </aside>
      <main className="w-[75%] py-6">
        <Search />
        <CarGrid slim={true} cars={cars} />
      </main>
    </div>
  );
}
