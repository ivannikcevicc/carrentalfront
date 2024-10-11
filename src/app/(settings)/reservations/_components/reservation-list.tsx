"use client";

import { Reservation } from "@/lib/types";
import { ReservationCard } from "./reservation-card";
import { useOptimisticReservations } from "./use-optimistic-reservations";

interface ReservationListProps {
  initialReservations: Reservation[];
}

export function ReservationList({ initialReservations }: ReservationListProps) {
  const { reservations, cancelReservation } =
    useOptimisticReservations(initialReservations);

  if (reservations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h2 className="text-2xl font-semibold">No Reservations Found</h2>
        <p className="text-gray-600">
          You haven&apos;t made any reservations yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reservations.map((reservation) => (
        <ReservationCard
          key={reservation.id}
          reservation={reservation}
          onCancel={cancelReservation}
        />
      ))}
    </div>
  );
}
