/* eslint-disable react/no-unescaped-entities */
'use client'
import { Reservation, User } from '@/services/api'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/reducers/reducers';
import { getUserByEmail } from '@/app/admin/users/actions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getReservationsByUserEmail } from './actions';
import { deleteReservation } from '../admin/reservations/actions';

const Page = () => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);

  const userEmail = useSelector((state: RootState) => state.email);
  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await getUserByEmail(userEmail);
      console.log(fetchedUser)
      setUser(fetchedUser);
      if (fetchedUser != null) {
        const fetchedReservations = await getReservationsByUserEmail(userEmail);
        setReservations(fetchedReservations);
      }
    };
    fetchUser();
  }, [userEmail]);

  // Handle reservation deletion
  const handleDelete = async () => {
    if (selectedReservationId) {
      try {
        await deleteReservation(selectedReservationId);
        setReservations(reservations.filter(reservation => reservation.id !== selectedReservationId));
        toast({ title: "Reservation deleted successfully", variant: "default" });
      } catch {
        toast({ title: "Error deleting reservation", variant: "destructive" });
      }
      setOpen(false); // Close the confirmation dialog
    }
  };

  return (
    <div className='p-10'>
      <div className="flex flex-col items-center justify-center space-y-4 my-10">
        <h1 className="text-3xl font-semibold">Your Reservations</h1>
        {/* Display message if there are no reservations */}
        {reservations.length === 0 && user && (
          <div className="mb-6">
            <p>You don't have any reservations for now!</p>
          </div>
        )}
        {!user && (
                    <div className="mb-6">
                    <p>No user found, please login!</p>
                  </div>
        )}
      </div>

      {user && (
      <Card className='bg-slate-200'>
        <CardHeader>
          <CardTitle>Your Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reservation Date</TableHead>
                <TableHead>Flight Destination</TableHead>
                <TableHead>Hotel Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>{reservation.reservationDate}</TableCell>
                  <TableCell>{reservation.flight?.destination.city}</TableCell>
                  <TableCell>{reservation.hotel ? reservation.hotel?.name : 'No hotel booked'}</TableCell>
                  <TableCell>
                    {/* Delete button */}
                    <button
                      className="mr-2 text-red-600 hover:underline"
                      onClick={() => {
                        setSelectedReservationId(reservation.id);
                        setOpen(true);
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
      {/* Delete confirmation dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this reservation?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className=" bg-red-500" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Page;
