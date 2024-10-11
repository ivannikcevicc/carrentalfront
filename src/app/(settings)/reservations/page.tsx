// app/reservations/page.tsx
import { getReservations } from "@/lib/queries";
import { ReservationList } from "./_components/reservation-list";

export default async function ReservationsPage() {
  const reservations = await getReservations();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Reservations</h1>
      <ReservationList initialReservations={reservations} />
    </div>
  );
}
