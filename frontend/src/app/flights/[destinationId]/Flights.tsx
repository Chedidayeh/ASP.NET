'use client'
import { Flight, User } from '@/services/api'
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
import { Input } from '@/components/ui/input';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/reducers/reducers';
import { getUserByEmail } from '@/app/admin/users/actions';
import { Button } from '@/components/ui/button';
import { createReservation } from '@/app/admin/reservations/actions';
import { useToast } from '@/hooks/use-toast';

const Flights = ({ flights }: { flights: Flight[] }) => {
  const [search, setSearch] = useState(''); // State to store search query
  const [openDialog, setOpenDialog] = useState(false); // State to control dialog visibility
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null); // Selected flight for reservation
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Filter flights by departure city based on the search query
  const filteredFlights = flights.filter((flight) =>
    flight.departureCity.toLowerCase().includes(search.toLowerCase())
  );

  const userEmail = useSelector((state: RootState) => state.email);

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await getUserByEmail(userEmail);
      setUser(fetchedUser);
    };
    fetchUser();
  }, [userEmail]);

  const handleReservation = async () => {
    if(!user) {
        toast({
            title: "No logged In user",
            description: `Please login to continue.`,
            variant: "destructive",
          });
          return
    }
    if (user && selectedFlight) {
      const reservation = {
        reservationDate: new Date().toISOString(),
        user,
        flight: selectedFlight,
      };
      // Here, you would send the reservation to the backend, for example:
      await createReservation(reservation);
      toast({
        title: "Reservation created",
        description: `Reservation was successfully booked.`,
      });
      // Close the dialog after reservation
      setOpenDialog(false);
      alert('Reservation confirmed!');
    }
  };

  return (
    <div className='p-10'>
      <div className="flex flex-col items-center justify-center space-y-4 my-10">
        <h1 className="text-3xl font-semibold">Available Flights</h1>
        {/* Input for filtering by departure city */}
        <div className="mb-6">
          <Input
            type="search"
            placeholder="Search by Departure City"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-[105%] "
          />
        </div>
      </div>

      <Card className='bg-slate-200'>
        <CardHeader>
          <CardTitle>Flights</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flight Number</TableHead>
                <TableHead>Departure city</TableHead>
                <TableHead>Departure Time</TableHead>
                <TableHead>Arrival Time</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFlights.map((flight) => (
                <TableRow key={flight.id}>
                  <TableCell>{flight.flightNumber}</TableCell>
                  <TableCell>{flight.departureCity}</TableCell>
                  <TableCell>{flight.departureTime}</TableCell>
                  <TableCell>{flight.arrivalTime}</TableCell>
                  <TableCell>{flight.price} TND</TableCell>
                  <TableCell>{flight.destination.city}</TableCell>
                  <TableCell>
                    <button
                      className="mr-2 text-blue-600 hover:underline"
                      onClick={() => {
                        setSelectedFlight(flight);
                        setOpenDialog(true);
                      }}
                    >
                      Book this Flight
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog for reservation */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Your Flight</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={handleReservation}
              className="bg-blue-600 text-white"
            >
              Confirm Reservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Flights
