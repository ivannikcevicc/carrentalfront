import { getVehicles, getFavoriteVehicles } from "@/lib/queries";
import { getUserInfo } from "@/lib/auth";
import CarGrid from "./car-grid";
import { FilterParams } from "@/lib/types";

interface CarGridWrapperProps {
  extraSlim?: boolean;
  slim?: boolean;
  filter?: boolean;
  filterParams?: FilterParams;
}

export default async function CarGridWrapper({
  extraSlim,
  slim,
  filter,
  filterParams = {},
}: CarGridWrapperProps) {
  const [vehicles, user] = await Promise.all([
    getVehicles(filterParams),
    getUserInfo(),
  ]);

  let initialFavorites: number[] = [];
  if (user) {
    const favorites = await getFavoriteVehicles();
    initialFavorites = favorites.data.map((car) => car.id);
  }

  return (
    <CarGrid
      cars={vehicles.data}
      initialFavorites={initialFavorites}
      extraSlim={extraSlim}
      slim={slim}
      filter={filter}
    />
  );
}
