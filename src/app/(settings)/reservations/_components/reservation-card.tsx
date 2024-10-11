// app/reservations/components/reservation-card.tsx
"use client";

import { Reservation } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Car, Clock, DollarSign, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";

interface ReservationCardProps {
  reservation: Reservation;
  onCancel: (id: number) => Promise<void>;
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "MMMM dd, yyyy 'at' hh:mm a");
};

export function ReservationCard({
  reservation,
  onCancel,
}: ReservationCardProps) {
  return (
    <Card className="p-6 relative">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">
            {reservation.vehicle.make} {reservation.vehicle.model}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Car className="w-4 h-4" />
              <span>{reservation.vehicle.type}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDate(reservation.start_date)} -{" "}
                {formatDate(reservation.end_date)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Status: {reservation.status}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span>Total: ${reservation.total_price}</span>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-4 right-4"
          >
            <X className="w-4 h-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this reservation? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onCancel(reservation.id)}
              className="bg-red-500 hover:bg-red-600"
            >
              Yes, cancel it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
