"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getVehicles } from "@/lib/queries";
import { FilterParams, PaginatedResponse, Car } from "@/lib/types";
import CarGrid from "@/components/car-grid";
import { SearchForm } from "@/components/forms/search-form";
import Search from "@/components/search";
import { getUserInfo } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function CarsPage() {
  const [cars, setCars] = useState<PaginatedResponse<Car> | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchCars = useCallback(async () => {
    setLoading(true);
    const user = await getUserInfo();
    if (!user) {
      redirect("/login");
    }

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
      const result = await getVehicles(filters);
      if (result.data.length === 0 && result.meta.current_page > 1) {
        // If we're on a page with no results, and it's not the first page,
        // redirect to the first page silently
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");
        router.push(`/cars?${params.toString()}`, { scroll: false });
      } else {
        setCars(result);
      }
    } catch (error) {
      console.error("Failed to fetch cars:", error);
      // Silently redirect to the first page in case of an error
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

  return (
    <div className="flex bg-light">
      <aside className="w-[25%]">
        <SearchForm />
      </aside>
      <main className="w-[75%] py-6">
        <Search />
        {loading ? (
          <div className="text-3xl text-center mt-[3rem]">Loading...</div>
        ) : cars && cars.data.length > 0 ? (
          <>
            <CarGrid slim={true} cars={cars.data} />
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
