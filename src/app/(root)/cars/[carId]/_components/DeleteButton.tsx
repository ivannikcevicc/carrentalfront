// components/DeleteButton.tsx
"use client";

import { Button } from "@/components/ui/button"; // Adjust the import based on your project structure
import { deleteReservation } from "@/lib/queries";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface DeleteButtonProps {
  reservationId: number;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ reservationId }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await deleteReservation(reservationId);
      console.log(res);
      toast.success("Successfully deleted reservation!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete reservation.");
      console.error("Failed to delete reservation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => handleDelete()}
        className="mt-4"
        variant="destructive"
        disabled={isLoading}
      >
        {isLoading ? "Deleting..." : "Delete Reservation"}
      </Button>
    </>
  );
};

export default DeleteButton;
