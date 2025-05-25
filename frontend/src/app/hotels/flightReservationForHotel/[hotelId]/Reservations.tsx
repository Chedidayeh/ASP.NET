/* eslint-disable react/no-unescaped-entities */
'use client'
import { Hotel, Reservation } from '@/services/api'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import React, { useState } from 'react'
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
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { updateReservation } from '@/app/admin/reservations/actions';
import { useRouter } from 'next/navigation';

const Reservations = ({ reservations, hotel }: { reservations: Reservation[] , hotel : Hotel }) => {
  const { toast } = useToast();
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleAddHotel = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDialogOpen(true);
  };

  const handleConfirmAddHotel = async () => {
    if (!selectedReservation) return;

    try {
        const updatedReservation = {
            ...selectedReservation,
            hotel: hotel,
        }
      await updateReservation(selectedReservation.id, updatedReservation);
      

      toast({ title: 'Success', description: 'Hotel has been added to the reservation!', variant: 'default' });
      router.refresh()
      // Close the dialog
      setIsDialogOpen(false);
      setSelectedReservation(null);

    } catch  {
      toast({ title: 'Error', description: 'Failed to add hotel to the reservation.', variant: 'destructive' });
    }
  };

  return (
    <div className='p-10'>
      <div className="flex flex-col items-center justify-center space-y-4 my-10">
        <h1 className="text-3xl font-semibold">Hotel Name : {hotel.name}</h1>
        <p>Location : {hotel.destination.city}</p>

        {/* Display message if there are no reservations */}
        {reservations.length === 0 && (
          <div className="mb-6">
            <p>No reservations found for this location!</p>
          </div>
        )}
      </div>

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
                    {reservation.hotel ? (
                      <p className='text-blue-600'>hotel already booked</p>
                    ) : (
                      <button
                        className="mr-2 text-blue-600 hover:underline"
                        onClick={() => handleAddHotel(reservation)}
                      >
                        Add hotel to this reservation
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog to confirm adding the hotel */}
      {isDialogOpen && selectedReservation && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Hotel Addition</DialogTitle>
              <DialogDescription>
                Are you sure you want to add the hotel "{hotel.name}" to this reservation?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmAddHotel}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Reservations;
