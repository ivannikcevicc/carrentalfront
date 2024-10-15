"use client";

import React, { useState, useEffect } from "react";
import {
  fetchVehicleDetails,
  fetchMaintenanceRecords,
  createMaintenanceRecord,
} from "@/lib/admin";
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

const VehicleDetails = ({ vehicleId, onBack }) => {
  const [vehicle, setVehicle] = useState(null);
  const [rentalHistory, setRentalHistory] = useState([]);
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);
  const [newMaintenance, setNewMaintenance] = useState({
    description: "",
    maintenance_date: "",
    next_maintenance_date: "",
    cost: 0,
    maintenance_type: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVehicleDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchVehicleDetails(vehicleId);
        setVehicle(data.vehicle);
        setRentalHistory(data.reservations || []);
        await loadMaintenanceRecords();
      } catch (error) {
        console.error("Error loading vehicle details:", error);
        setError("Failed to load vehicle details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    const loadMaintenanceRecords = async () => {
      try {
        const data = await fetchMaintenanceRecords(vehicleId);
        setMaintenanceHistory(data);
      } catch (error) {
        console.error("Error loading maintenance records:", error);
      }
    };

    loadVehicleDetails();
  }, [vehicleId]);

  const handleCreateMaintenance = async () => {
    try {
      const maintenance = await createMaintenanceRecord(
        vehicleId,
        newMaintenance
      );
      setMaintenanceHistory([...maintenanceHistory, maintenance]);
      setNewMaintenance({
        description: "",
        maintenance_date: "",
        next_maintenance_date: "",
        cost: 0,
        maintenance_type: "",
      });
    } catch (error) {
      console.error("Error creating maintenance record:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!vehicle) {
    return <div>No vehicle data available.</div>;
  }

  const vehicleImages = JSON.parse(vehicle.images);

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
          <div className="mt-4">
            <strong>Images:</strong>
            <div className="flex space-x-2 mt-2">
              {vehicleImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Vehicle ${vehicleId}`}
                  className="w-32 h-32 object-cover"
                />
              ))}
            </div>
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
                  <TableCell>{reservation.user_id}</TableCell>
                  <TableCell>{reservation.status}</TableCell>
                  <TableCell>${reservation.total_price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenanceHistory.length > 0 ? (
                maintenanceHistory.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.description}</TableCell>
                    <TableCell>
                      {new Date(record.maintenance_date).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2}>
                    No maintenance records available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="mt-4">
            <h4>Create New Maintenance Record</h4>
            <input
              type="text"
              placeholder="Description"
              value={newMaintenance.description}
              onChange={(e) =>
                setNewMaintenance({
                  ...newMaintenance,
                  description: e.target.value,
                })
              }
              className="border p-2 w-full mb-2"
            />
            <input
              type="date"
              value={newMaintenance.maintenance_date}
              onChange={(e) =>
                setNewMaintenance({
                  ...newMaintenance,
                  maintenance_date: e.target.value,
                })
              }
              className="border p-2 w-full mb-2"
            />
            <input
              type="date"
              placeholder="Next Maintenance Date"
              value={newMaintenance.next_maintenance_date}
              onChange={(e) =>
                setNewMaintenance({
                  ...newMaintenance,
                  next_maintenance_date: e.target.value,
                })
              }
              className="border p-2 w-full mb-2"
            />
            <input
              type="number"
              placeholder="Cost"
              value={newMaintenance.cost}
              onChange={(e) =>
                setNewMaintenance({
                  ...newMaintenance,
                  cost: e.target.valueAsNumber,
                })
              }
              className="border p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Maintenance Type"
              value={newMaintenance.maintenance_type}
              onChange={(e) =>
                setNewMaintenance({
                  ...newMaintenance,
                  maintenance_type: e.target.value,
                })
              }
              className="border p-2 w-full mb-2"
            />
            <Button onClick={handleCreateMaintenance} className="mt-2">
              Add Maintenance
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <p>No reviews available.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleDetails;
