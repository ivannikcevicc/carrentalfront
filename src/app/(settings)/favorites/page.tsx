"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CarGrid from "@/components/car-grid";
import { getFavoriteVehicles } from "@/lib/queries";
import { FavoriteResponse } from "@/lib/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<FavoriteResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const page = parseInt(searchParams.get("page") || "1");
      const result = await getFavoriteVehicles({ page });
      if (result.data.length === 0 && result.current_page > 1) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");
        router.push(`/favorites?${params.toString()}`, { scroll: false });
      } else {
        setFavorites(result);
      }
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      router.push(`/favorites?${params.toString()}`, { scroll: false });
    } finally {
      setLoading(false);
    }
  }, [searchParams, router]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/favorites?${params.toString()}`, { scroll: false });
  };

  const renderPaginationItems = () => {
    if (!favorites) return null;

    return favorites.links.map((link, index) => {
      if (link.label === "&laquo; Previous" || link.label === "Next &raquo;") {
        return null; // We'll handle these separately
      }
      return (
        <PaginationItem key={index}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (link.url) handlePageChange(parseInt(link.label));
            }}
            isActive={link.active}
          >
            {link.label}
          </PaginationLink>
        </PaginationItem>
      );
    });
  };

  return (
    <div className="bg-light py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Your Favorites</h1>
      {loading ? (
        <div className="text-3xl text-center mt-[3rem]">Loading...</div>
      ) : favorites && favorites.data.length > 0 ? (
        <>
          <CarGrid slim={true} cars={favorites.data} />
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (favorites.prev_page_url)
                      handlePageChange(favorites.current_page - 1);
                  }}
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (favorites.next_page_url)
                      handlePageChange(favorites.current_page + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      ) : (
        <div className="text-3xl text-center mt-[3rem]">
          No favorite cars found
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
