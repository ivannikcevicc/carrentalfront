"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import { fetchReservations, updateReservationStatus } from "@/lib/admin";
import { Loader2, FileText } from "lucide-react";

interface Reservation {
  id: number;
  user: { name: string };
  vehicle: { name: string };
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
}

const ReservationsPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canceling, setCanceling] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [generatingInvoice, setGeneratingInvoice] = useState<number | null>(
    null
  );
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  const loadReservations = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetchReservations(page);
      setReservations(response.data);
      setCurrentPage(response.current_page);
      setTotalPages(response.last_page);
    } catch (err) {
      setError("Failed to fetch reservations.");
      toast.error("Error fetching reservations");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      setCanceling(id);
      await updateReservationStatus(id, "cancelled");
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.id === id
            ? { ...reservation, status: "cancelled" }
            : reservation
        )
      );
      toast.success("Reservation canceled successfully.");
    } catch (err) {
      toast.error("Failed to cancel the reservation.");
    } finally {
      setCanceling(null);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      setUpdatingStatus(id);
      await updateReservationStatus(id, newStatus);
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.id === id
            ? { ...reservation, status: newStatus }
            : reservation
        )
      );
      toast.success("Reservation status updated successfully.");
    } catch (err) {
      toast.error("Failed to update reservation status.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );

  if (error)
    return (
      <Card className="max-w-lg mx-auto mt-8">
        <CardContent className="text-center p-6">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          {reservations.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Total Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell>{reservation.id}</TableCell>
                        <TableCell>{reservation.user.name}</TableCell>
                        <TableCell>{reservation.vehicle.name}</TableCell>
                        <TableCell>
                          {new Date(
                            reservation.start_date
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(reservation.end_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>${reservation.total_price}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold
                            ${
                              reservation.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : reservation.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : reservation.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {reservation.status.charAt(0).toUpperCase() +
                              reservation.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Select
                              value={reservation.status}
                              onValueChange={(value) =>
                                handleStatusChange(reservation.id, value)
                              }
                              disabled={updatingStatus === reservation.id}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">
                                  Confirmed
                                </SelectItem>
                                <SelectItem value="completed">
                                  Completed
                                </SelectItem>
                                <SelectItem value="cancelled">
                                  Cancelled
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCancel(reservation.id)}
                              disabled={
                                reservation.status === "cancelled" ||
                                canceling === reservation.id
                              }
                            >
                              {canceling === reservation.id ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              ) : null}
                              Cancel
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={generatingInvoice === reservation.id}
                            >
                              {generatingInvoice === reservation.id ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              ) : (
                                <FileText className="w-4 h-4 mr-2" />
                              )}
                              Invoice
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-between items-center">
                <Button
                  onClick={() => loadReservations(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={() => loadReservations(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">
              No reservations found.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationsPage;
