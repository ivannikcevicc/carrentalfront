import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { User, Reservation } from "@/lib/adminTypes";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { fetchUserDetails } from "@/lib/admin";

const UserDetails: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [user, setUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState([]);
  const [rentalSummary, setRentalSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Current ID from search params:", id);
    const loadUserDetails = async () => {
      if (id) {
        setIsLoading(true);
        setError(null);
        try {
          const data = await fetchUserDetails(Number(id));
          console.log(data);
          setUser(data.user);
          setReservations(data.rental_history);
          setRentalSummary(data.rental_summary);
        } catch (error: any) {
          console.error("Error loading user details:", error);
          setError(
            error?.response?.data?.message ||
              "Failed to load user details. Please try again later."
          );
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadUserDetails();
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">User Details</h2>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Basic Information</h3>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Status:</strong>
              <Badge variant={user.is_blocked ? "destructive" : "success"}>
                {user.is_blocked ? "Blocked" : "Active"}
              </Badge>
            </p>
            <div>
              <strong>Roles:</strong>
              {user.roles.map((role) => (
                <Badge key={role} className="mr-2" variant="secondary">
                  {role}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Rental Summary</h3>
            <p>
              <strong>Total Rentals:</strong> {rentalSummary?.total_rentals}
            </p>
            <p>
              <strong>Total Spent:</strong> $
              {rentalSummary?.total_spent ?? "0.00"}
            </p>
            <p>
              <strong>Favorite Vehicle ID:</strong>{" "}
              {rentalSummary?.favorite_vehicle}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Rental History</h3>
            {reservations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reservation ID</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell>{reservation.id}</TableCell>
                      <TableCell>
                        {reservation.vehicle.make} {reservation.vehicle.model}
                      </TableCell>
                      <TableCell>
                        {new Date(reservation.start_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(reservation.end_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>${reservation.total_price}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            reservation.status === "completed"
                              ? "success"
                              : "secondary"
                          }
                        >
                          {reservation.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>No rental history found.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetails;
