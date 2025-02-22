"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getFavoriteVehicles, getVehicles } from "@/lib/queries";
import { FilterParams, PaginatedResponse, Car } from "@/lib/types";
import CarGrid from "@/components/car-grid";
import { SearchForm } from "@/components/forms/search-form";
import Search from "@/components/search";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import toast from "react-hot-toast";
import { getUserInfo } from "@/lib/auth";

export default function CarsPage() {
  const [cars, setCars] = useState<PaginatedResponse<Car> | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [initialFavorites, setInitialFavorites] = useState<number[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  //   `useCallback` is used here to memoize the `fetchCars` function. This means that the function
  //   will only be recreated if its dependencies (`searchParams` or `router`) change. This optimization is important because:

  // 1. It prevents unnecessary re-renders of child components that might receive this function as a prop.
  // 2. It ensures that the effect hook that uses this function doesn't run unnecessarily.

  const fetchCars = useCallback(async () => {
    setLoading(true);
    //Filter generation
    const filters: FilterParams = {
      type: searchParams.getAll("type[]"),
      seating_capacity: searchParams.getAll("seating_capacity[]"),
      make: searchParams.getAll("make[]"),
      max_price: searchParams.get("max_price")
        ? parseInt(searchParams.get("max_price") as string)
        : undefined,
      is_available: searchParams.get("is_available") === "1",
      start_date: searchParams.get("start_date") as string | undefined,
      end_date: searchParams.get("end_date") as string | undefined,
      page: parseInt(searchParams.get("page") || "1"),
    };

    try {
      const user = await getUserInfo(); // Get user info

      const carsResult = await getVehicles(filters);

      if (carsResult.data.length === 0 && carsResult.meta.current_page > 1) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");
        router.push(`/cars?${params.toString()}`, { scroll: false });
      } else {
        setCars(carsResult);

        // Only fetch favorites if user exists
        if (user) {
          const favoritesResult = await getFavoriteVehicles();
          setInitialFavorites(favoritesResult.data.map((car) => car.id));
        } else {
          setInitialFavorites([]); // Set to empty array if no user
        }
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch cars. Please try again."
      );
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      router.push(`/cars?${params.toString()}`, { scroll: false });
    } finally {
      setLoading(false);
    }
  }, [searchParams, router]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/cars?${params.toString()}`, { scroll: false });
  };

  const renderPaginationItems = () => {
    if (!cars) return null;

    const { current_page, last_page } = cars.meta;
    const items = [];

    for (let i = 1; i <= last_page; i++) {
      if (
        i === 1 ||
        i === last_page ||
        (i >= current_page - 1 && i <= current_page + 1)
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
              isActive={i === current_page}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (i === current_page - 2 || i === current_page + 2) {
        items.push(
          <PaginationItem key={i}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    return items;
  };

  // Get the count of active filters
  const getActiveFilterCount = () => {
    let count = 0;
    count += searchParams.getAll("type[]").length;
    count += searchParams.getAll("seating_capacity[]").length;
    count += searchParams.getAll("make[]").length;
    if (searchParams.get("max_price")) count++;
    if (searchParams.get("is_available") === "1") count++;
    return count;
  };

  return (
    <div className="flex bg-light">
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-[25%]">
        <SearchForm onClose={() => setIsOpen(false)} />
      </aside>

      {/* Mobile sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden fixed bottom-4 left-4 z-50">
          <Button className="rounded-full px-4 py-2 bg-primary shadow-lg">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters{" "}
            {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[85%] sm:w-[350px] pt-10">
          <SheetHeader>
            <SheetTitle className="flex justify-between items-center">
              Filters
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </SheetTitle>
          </SheetHeader>
          <SearchForm onClose={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>

      <main className="flex-1 md:w-[75%] py-6 px-4 md:px-6">
        <Search />
        {loading ? (
          <div className="text-3xl text-center mt-[3rem]">Loading...</div>
        ) : cars && cars.data.length > 0 ? (
          <>
            <CarGrid
              slim={true}
              cars={cars.data}
              initialFavorites={initialFavorites}
            />
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (cars.links.prev)
                        handlePageChange(cars.meta.current_page - 1);
                    }}
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (cars.links.next)
                        handlePageChange(cars.meta.current_page + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        ) : (
          <div className="text-3xl text-center mt-[3rem]">No cars found</div>
        )}
      </main>
    </div>
  );
}
