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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import LoadingState from "@/components/LoadingState";
import { getFlights, createFlight, updateFlight, deleteFlight } from "./actions";
import { Flight, Destination } from "@/services/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDestinations } from "../destinations/actions";

export default function Page() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentFlight, setCurrentFlight] = useState<Flight | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
    console.log(destinations)
  const [newFlight, setNewFlight] = useState<{
    flightNumber: string;
    departureCity:string;
    departureTime: string;
    arrivalTime: string;
    price: number;
    destination: Destination | null;
  }>({
    flightNumber: "",
    departureCity: "",
    departureTime: "",
    price: 0,
    arrivalTime: "",
    destination: null,
  });

  const handleDestinationChange = (value: string) => {
    const selectedDestination = destinations.find(d => d.id.toString() === value) || null;
    setSelectedDestination(selectedDestination);
  };

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchFlights = async () => {
    setIsLoading(true);
    try {
      const response = await getFlights();
      if (response) {
        setFlights(response);
      } else {
        console.error("Failed to fetch flights");
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      const response = await getDestinations();
      if (response) {
        setDestinations(response);
      }
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  };

  const handleAddFlight = async () => {
    setIsLoading(true);
    const flight = {
      flightNumber: newFlight.flightNumber,
      departureCity: newFlight.departureCity,
      departureTime: newFlight.departureTime,
      arrivalTime: newFlight.arrivalTime,
      price: newFlight.price,
      destination: selectedDestination!,
    };
    try {
      const response = await createFlight(flight);
      if (response) {
        setFlights((prev) => [...prev, response]);
        toast({
          title: "Flight added",
          description: `Flight ${newFlight.flightNumber} was successfully added.`,
        });
        setIsAddDialogOpen(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to add the flight.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding flight:", error);
      toast({
        title: "Error",
        description: "An error occurred while adding the flight.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditFlight = async () => {
    if (!currentFlight) return;

    const flight = {
        id : currentFlight.id,
        flightNumber: currentFlight.flightNumber,
        departureCity: currentFlight.departureCity,
        departureTime: currentFlight.departureTime,
        arrivalTime: currentFlight.arrivalTime,
        price: currentFlight.price,
        destination: selectedDestination!,
    };
    setIsLoading(true);
    try {
      const response = await updateFlight(currentFlight.id, flight);
      if (response) {
        setFlights((prev) =>
          prev.map((flight) => (flight.id === currentFlight.id ? response : flight))
        );
        toast({
          title: "Flight updated",
          description: `Flight ${currentFlight.flightNumber} was successfully updated.`,
        });
        setIsEditDialogOpen(false);
        setCurrentFlight(null);
      } else {
        toast({
          title: "Error",
          description: "Failed to update the flight.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating flight:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the flight.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFlight = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await deleteFlight(id);
      if (response) {
        setFlights((prev) =>
          prev.filter((flight) => flight.id !== id)
        );
        toast({
          title: "Flight deleted",
          description: "The flight was successfully deleted.",
        });
      } else {
        setFlights((prev) =>
          prev.filter((flight) => flight.id !== id)
        );
        toast({
          title: "Flight deleted",
          description: "The flight was successfully deleted.",
        });
      }
    } catch (error) {
      console.error("Error deleting flight:", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the flight.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (flight: Flight) => {
    setCurrentFlight({ ...flight });
    setIsEditDialogOpen(true);
  };

  useEffect(() => {
    fetchFlights();
    fetchDestinations();
  }, []);

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Manage Flights</h1>
      <Button className="mb-4" onClick={() => setIsAddDialogOpen(true)}>
        Add Flight
      </Button>
      {isLoading ? (
        <LoadingState isOpen={isLoading} />
      ) : (
        <Card>
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
                {flights.map((flight) => (
                  <TableRow key={flight.id}>
                    <TableCell>{flight.flightNumber}</TableCell>
                    <TableCell>{flight.departureCity}</TableCell>
                    <TableCell>{flight.departureTime}</TableCell>
                    <TableCell>{flight.arrivalTime}</TableCell>
                    <TableCell>{flight.price}</TableCell>
                    <TableCell>{flight.destination.city}</TableCell>
                    <TableCell>
                      <button
                        className="mr-2 text-blue-600 hover:underline"
                        onClick={() => openEditDialog(flight)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this flight?")) {
                            handleDeleteFlight(flight.id);
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

      {/* Add Flight Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Flight</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new flight.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
            type="number"
              placeholder="Flight Number"
              value={newFlight.flightNumber}
              onChange={(e) =>
                setNewFlight({ ...newFlight, flightNumber: e.target.value })
              }
            />
            <Input
              placeholder="departureCity"
              value={newFlight.departureCity}
              onChange={(e) =>
                setNewFlight({ ...newFlight, departureCity: e.target.value })
              }
            />
            <Input
                            type="datetime-local"
              placeholder="departureTime"
              value={newFlight.departureTime}
              onChange={(e) =>
                setNewFlight({ ...newFlight, departureTime: e.target.value })
              }
            />

            <Input
                            type="datetime-local"
              placeholder="Arrival"
              value={newFlight.arrivalTime}
              onChange={(e) =>
                setNewFlight({ ...newFlight, arrivalTime: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Price"
              value={newFlight.price || ""}
              onChange={(e) =>
                setNewFlight({ ...newFlight, price: +e.target.value })
              }
            />

            <Select onValueChange={handleDestinationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Destinations</SelectLabel>
                  {destinations.map((destination) => (
                    <SelectItem key={destination.id} value={destination.id.toString()}>
                      {destination.city}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFlight}>Add Flight</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Flight Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Flight</DialogTitle>
            <DialogDescription>
              Update the flight details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
            type="number"
              placeholder="Flight Number"
              value={currentFlight?.flightNumber || ""}
              onChange={(e) =>
                setCurrentFlight({ ...currentFlight!, flightNumber: e.target.value })
              }
            />
            <Input
              placeholder="departureCity"
              value={currentFlight?.departureCity || ""}
              onChange={(e) =>
                setCurrentFlight({ ...currentFlight!, departureCity: e.target.value })
              }
            />
            <Input
                            type="datetime-local"
              placeholder="departure"
              value={currentFlight?.departureTime || ""}
              onChange={(e) =>
                setCurrentFlight({ ...currentFlight!, departureTime: e.target.value })
              }
            />

            <Input
              placeholder="Arrival"
              type="datetime-local"
              value={currentFlight?.arrivalTime || ""}
              onChange={(e) =>
                setCurrentFlight({ ...currentFlight!, arrivalTime: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Price"
              value={currentFlight?.price || ""}
              onChange={(e) =>
                setCurrentFlight({ ...currentFlight!, price: +e.target.value })
              }
            />

            <Select onValueChange={handleDestinationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Destinations</SelectLabel>
                  {destinations.map((destination) => (
                    <SelectItem key={destination.id} value={destination.id.toString()}>
                      {destination.city}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditFlight}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
