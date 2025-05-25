"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useToast } from "@/hooks/use-toast";
import LoadingState from "@/components/LoadingState";
import {  Reservation } from "@/services/api";

import {  deleteReservation, getReservations } from "./actions";
import { getHotels } from "../hotels/actions";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  // selectedHotel state



  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const response = await getReservations();
      const hotelResponse = await getHotels();
      
      if (response && hotelResponse) {
        setReservations(response);
      } else {
        console.error("Failed to fetch reservations");
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setIsLoading(false);
    }
  };



  const handleDeleteReservation = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await deleteReservation(id);
      if (response) {
        setReservations((prev) =>
          prev.filter((reservation) => reservation.id !== id)
        );
        toast({
          title: "Reservation deleted",
          description: `Reservation ID ${id} was successfully deleted.`,
        });
      } else {
        setReservations((prev) =>
          prev.filter((reservation) => reservation.id !== id)
        );
        toast({
          title: "Reservation deleted",
          description: `Reservation ID ${id} was successfully deleted.`,
        });
      }
    } catch (error) {
      console.error("Error deleting reservation:", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the reservation.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchReservations();
  }, []);

  

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Manage Reservations</h1>
      {isLoading ? (
        <LoadingState isOpen={isLoading} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Reservations</CardTitle>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Flight Number</TableHead>
                  <TableHead>Hotel Details</TableHead>
                  <TableHead>User Username</TableHead>
                  <TableHead>User Email</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>{reservation.id}</TableCell>
                    <TableCell>{new Date(reservation.reservationDate).toLocaleString()}</TableCell>
                    <TableCell>{reservation.flight?.flightNumber}</TableCell>
                    <TableCell>{reservation.hotel?.name ?? 'no hotel booked'}</TableCell>
                    <TableCell>{reservation.user?.name}</TableCell>
                    <TableCell>{reservation.user?.email}</TableCell>

                    <TableCell>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this reservation?")) {
                            handleDeleteReservation(reservation.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}



    </div>
  );
}
