"use client";

import { Reservation } from "@/lib/types";
import { deleteReservation } from "@/lib/queries";
import { useState } from "react";
import toast from "react-hot-toast";

export function useOptimisticReservations(initialReservations: Reservation[]) {
  const [reservations, setReservations] = useState(initialReservations);

  const cancelReservation = async (id: number) => {
    try {
      // Optimistically remove the reservation
      setReservations((current) =>
        current.filter((reservation) => reservation.id !== id)
      );

      // Make the API call
      await deleteReservation(id);

      toast.success("Reservation cancelled successfully");
    } catch (error) {
      // Revert the optimistic update on error
      setReservations(initialReservations);
      toast.error("Failed to cancel reservation");
    }
  };

  return {
    reservations,
    cancelReservation,
  };
}
