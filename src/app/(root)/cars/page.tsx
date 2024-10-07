import { getVehicles } from "@/lib/queries";
import CarGrid from "@/components/car-grid";
import Search from "@/components/search";
import { SearchForm } from "@/components/forms/search-form";

export default async function CarsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const filters = {
    make: searchParams.make as string,
    model: searchParams.model as string,
    type: searchParams.type as string,
    year: searchParams.year ? parseInt(searchParams.year as string) : undefined,
    min_price: searchParams.min_price
      ? parseInt(searchParams.min_price as string)
      : undefined,
    max_price: searchParams.max_price
      ? parseInt(searchParams.max_price as string)
      : undefined,
    is_available: searchParams.is_available === "1",
    status: searchParams.status as string,
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
