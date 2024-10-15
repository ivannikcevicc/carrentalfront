"use client";
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { fetchVehicles, updateVehicleStatus } from "@/lib/admin";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const STATUSES = [
  { name: "Available", color: "bg-green-200" },
  { name: "Reserved", color: "bg-yellow-200" },
  { name: "In Use", color: "bg-blue-200" },
  { name: "Under Maintenance", color: "bg-orange-200" },
  { name: "Under Repair", color: "bg-red-200" },
];

const VehicleCard = ({ vehicle, index }) => (
  <Draggable draggableId={vehicle.id.toString()} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`bg-white p-4 mb-3 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 ${
          snapshot.isDragging ? "bg-gray-100" : ""
        }`}
      >
        <h4 className="font-bold text-gray-800">
          {vehicle.make} {vehicle.model}
        </h4>
        <p className="text-sm text-gray-600">Year: {vehicle.year}</p>
        <p className="text-sm text-gray-600">
          Price: ${vehicle.price_per_day}/day
        </p>
      </div>
    )}
  </Draggable>
);

const StatusColumn = ({ status, vehicles }) => (
  <div className="flex-1 min-w-[250px]">
    <h3 className={`font-bold text-lg mb-4 ${status.color} p-2 rounded shadow`}>
      {status.name}
    </h3>
    <Droppable droppableId={status.name}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`bg-gray-50 p-3 rounded-lg min-h-[300px] border border-gray-200 shadow-md ${
            snapshot.isDraggingOver ? "bg-blue-50" : ""
          }`}
        >
          {vehicles.map((vehicle, index) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </div>
);

const VehicleKanbanPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setIsLoading(true);
        const data = await fetchVehicles();
        setVehicles(data.vehicles || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch vehicles:", err);
        setError("Failed to load vehicles. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    loadVehicles();
  }, []);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId !== destination.droppableId ||
      source.index !== destination.index
    ) {
      const newStatus = destination.droppableId;
      const vehicleId = parseInt(draggableId, 10);

      try {
        await updateVehicleStatus(vehicleId, newStatus);

        setVehicles((prevVehicles) =>
          prevVehicles.map((vehicle) =>
            vehicle.id === vehicleId
              ? { ...vehicle, status: newStatus }
              : vehicle
          )
        );
      } catch (err) {
        console.error("Failed to update vehicle status:", err);
        setError("Failed to update vehicle status. Please try again.");
      }
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesStatus =
      selectedStatus === "All" || vehicle.status === selectedStatus;
    const matchesPrice =
      (priceRange.min === "" || vehicle.price_per_day >= priceRange.min) &&
      (priceRange.max === "" || vehicle.price_per_day <= priceRange.max);
    const matchesSearch =
      vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesPrice && matchesSearch;
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <h2 className="text-3xl font-semibold text-gray-700">
            Vehicle Kanban Board
          </h2>
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded p-2 mb-4"
          />
          <div className="flex space-x-4 mb-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border rounded p-2"
            >
              <option value="All">All Statuses</option>
              {STATUSES.map((status) => (
                <option key={status.name} value={status.name}>
                  {status.name}
                </option>
              ))}
            </select>

            <div>
              <input
                type="number"
                placeholder="Min Price"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                }
                className="border rounded p-2 mr-2"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                }
                className="border rounded p-2"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex space-x-4">
              {STATUSES.map((status) => (
                <StatusColumn
                  key={status.name}
                  status={status}
                  vehicles={filteredVehicles.filter(
                    (vehicle) => vehicle.status === status.name
                  )}
                />
              ))}
            </div>
          </DragDropContext>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleKanbanPage;
