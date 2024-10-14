import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchVehicleDetails } from "@/lib/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const VehicleDetails = ({ onBack }) => {
  const [vehicle, setVehicle] = useState(null);
  const [rentalHistory, setRentalHistory] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const loadVehicleDetails = async () => {
      try {
        const data = await fetchVehicleDetails(id);
        setVehicle(data.vehicle);
        setRentalHistory(data.rental_history);
      } catch (error) {
        console.error("Error loading vehicle details:", error);
      }
    };

    loadVehicleDetails();
  }, [id]);

  if (!vehicle) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Button onClick={onBack} variant="outline" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Vehicles
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Make:</strong> {vehicle.make}
            </div>
            <div>
              <strong>Model:</strong> {vehicle.model}
            </div>
            <div>
              <strong>Type:</strong> {vehicle.type}
            </div>
            <div>
              <strong>Year:</strong> {vehicle.year}
            </div>
            <div>
              <strong>Price per day:</strong> ${vehicle.price_per_day}
            </div>
            <div>
              <strong>Status:</strong> {vehicle.status}
            </div>
            <div>
              <strong>Seating Capacity:</strong> {vehicle.seating_capacity}
            </div>
            <div>
              <strong>Transmission:</strong> {vehicle.transmission}
            </div>
            <div>
              <strong>Fuel Capacity:</strong> {vehicle.fuel_capacity}
            </div>
            <div>
              <strong>Fuel Type:</strong> {vehicle.fuel_type}
            </div>
          </div>
          <div className="mt-4">
            <strong>Description:</strong>
            <p>{vehicle.description}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rental History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentalHistory.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>
                    {new Date(reservation.start_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(reservation.end_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{reservation.user.name}</TableCell>
                  <TableCell>{reservation.status}</TableCell>
                  <TableCell>${reservation.total_price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleDetails;
