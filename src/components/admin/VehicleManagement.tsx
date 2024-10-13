import React, { useState, useEffect } from "react";
import {
  fetchVehicles,
  updateVehicle,
  deleteVehicle,
  createVehicle,
} from "@/lib/admin";
import { Vehicle } from "@/lib/adminTypes";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const VehicleManagement: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewVehicle, setIsNewVehicle] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    const data = await fetchVehicles();
    setVehicles(data.vehicles);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };

  const handleSort = (column: keyof Vehicle) => {
    const direction = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(direction);

    const sortedVehicles = [...vehicles].sort((a, b) => {
      const comparison = a[column] < b[column] ? -1 : 1;
      return direction === "asc" ? comparison : -comparison;
    });
    setVehicles(sortedVehicles);
  };

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter === "" || vehicle.status === filter)
  );

  const openModal = (vehicle: Vehicle | null) => {
    setSelectedVehicle(vehicle);
    setIsNewVehicle(!vehicle);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVehicle(null);
  };

  const handleSave = async (updatedVehicle: FormData) => {
    try {
      if (isNewVehicle) {
        await createVehicle(updatedVehicle);
      } else {
        if (!selectedVehicle || !selectedVehicle.id) {
          throw new Error("Vehicle ID is missing for update operation");
        }
        await updateVehicle(
          selectedVehicle.id,
          updatedVehicle,
          selectedVehicle
        );
      }
      loadVehicles();
      closeModal();
    } catch (error) {
      console.error("Error saving vehicle:", error);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteVehicle(id);
    loadVehicles();
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Vehicle Management</h2>
          <Button onClick={() => openModal(null)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Vehicle
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex space-x-2">
            <Input
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={handleSearch}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort("make")}>Make</TableHead>
                <TableHead onClick={() => handleSort("model")}>Model</TableHead>
                <TableHead onClick={() => handleSort("year")}>Year</TableHead>
                <TableHead onClick={() => handleSort("status")}>
                  Status
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>{vehicle.make}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell>{vehicle.status}</TableCell>
                  <TableCell>
                    <Button variant="ghost" onClick={() => openModal(vehicle)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleDelete(vehicle.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isNewVehicle ? "Add New Vehicle" : "Edit Vehicle"}
            </DialogTitle>
          </DialogHeader>
          <VehicleForm
            vehicle={selectedVehicle}
            onSave={handleSave}
            onCancel={closeModal}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface VehicleFormProps {
  vehicle: Vehicle | null;
  onSave: (vehicle: Vehicle) => void;
  onCancel: () => void;
}
const VehicleForm: React.FC<VehicleFormProps> = ({
  vehicle,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Vehicle>(
    vehicle || {
      id: 0,
      make: "",
      model: "",
      type: "",
      year: new Date().getFullYear(),
      price_per_day: 0,
      description: "",
      images: [],
      seating_capacity: 0,
      transmission: "Automatic",
      fuel_capacity: 0,
      fuel_type: "Petrol",
      status: "Available",
    }
  );
  const [newImages, setNewImages] = useState<File[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof Vehicle, string>>>(
    {}
  );

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Vehicle, string>> = {};

    if (!formData.make) newErrors.make = "Make is required";
    if (!formData.model) newErrors.model = "Model is required";
    if (
      !formData.year ||
      formData.year < 1900 ||
      formData.year > new Date().getFullYear() + 1
    ) {
      newErrors.year = "Please enter a valid year";
    }
    if (!formData.price_per_day || formData.price_per_day <= 0) {
      newErrors.price_per_day = "Please enter a valid price per day";
    }
    if (!formData.seating_capacity || formData.seating_capacity <= 0) {
      newErrors.seating_capacity = "Please enter a valid seating capacity";
    }
    if (!formData.fuel_capacity || formData.fuel_capacity <= 0) {
      newErrors.fuel_capacity = "Please enter a valid fuel capacity";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validFiles = Array.from(files).filter((file) => {
        const fileType = file.type;
        return (
          fileType === "image/jpeg" ||
          fileType === "image/png" ||
          fileType === "image/gif"
        );
      });
      setNewImages((prev) => [...prev, ...validFiles]);
    }
  };

  const handleRemoveExistingImage = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== imageUrl),
    }));
    setRemovedImages((prev) => [...prev, imageUrl]);
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const vehicleFormData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "images") {
        vehicleFormData.append(key, value.toString());
      }
    });

    newImages.forEach((image) => {
      vehicleFormData.append("new_images[]", image);
    });

    removedImages.forEach((image) => {
      vehicleFormData.append("removed_images[]", image);
    });

    try {
      await onSave(vehicleFormData);
    } catch (error) {
      console.error("Error saving vehicle:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            name="make"
            value={formData.make}
            onChange={handleChange}
            placeholder="Make"
          />
          {errors.make && <p className="text-red-500 text-sm">{errors.make}</p>}
        </div>
        <div>
          <Input
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="Model"
          />
          {errors.model && (
            <p className="text-red-500 text-sm">{errors.model}</p>
          )}
        </div>
        <div>
          <Input
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="Type"
          />
        </div>
        <div>
          <Input
            name="year"
            value={formData.year}
            onChange={handleChange}
            type="number"
            placeholder="Year"
          />
          {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
        </div>
        <div>
          <Input
            name="price_per_day"
            value={formData.price_per_day}
            onChange={handleChange}
            type="number"
            placeholder="Price per Day"
          />
          {errors.price_per_day && (
            <p className="text-red-500 text-sm">{errors.price_per_day}</p>
          )}
        </div>
        <div>
          <Input
            name="seating_capacity"
            value={formData.seating_capacity}
            onChange={handleChange}
            type="number"
            placeholder="Seating Capacity"
          />
          {errors.seating_capacity && (
            <p className="text-red-500 text-sm">{errors.seating_capacity}</p>
          )}
        </div>
        <div>
          <Select
            name="transmission"
            value={formData.transmission}
            onValueChange={(value) =>
              handleChange({ target: { name: "transmission", value } } as any)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Transmission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Automatic">Automatic</SelectItem>
              <SelectItem value="Manual">Manual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            name="fuel_type"
            value={formData.fuel_type}
            onValueChange={(value) =>
              handleChange({ target: { name: "fuel_type", value } } as any)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Fuel Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Petrol">Petrol</SelectItem>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="Electric">Electric</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Input
            name="fuel_capacity"
            value={formData.fuel_capacity}
            onChange={handleChange}
            type="number"
            placeholder="Fuel Capacity"
          />
          {errors.fuel_capacity && (
            <p className="text-red-500 text-sm">{errors.fuel_capacity}</p>
          )}
        </div>
        <div className="col-span-2">
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            rows={4}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Current Images</h3>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(formData.images) &&
            formData.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Vehicle ${index}`}
                  className="w-24 h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(image)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">New Images</h3>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {newImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(image)}
                alt={`New ${index}`}
                className="w-24 h-24 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveNewImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

export default VehicleManagement;
