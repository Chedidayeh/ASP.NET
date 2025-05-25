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
import { getHotels, createHotel, updateHotel, deleteHotel } from "./actions";
import { Hotel, Destination } from "@/services/api";
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
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentHotel, setCurrentHotel] = useState<Hotel | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  const [newHotel, setNewHotel] = useState<{
    name: string;
    rating?: number;
    pricePerNight?: number;
    image: File | null;
    destinationId: number;
  }>({
    name: "",
    rating: undefined,
    pricePerNight: undefined,
    image: null,
    destinationId: 0,
  });

  const handleDestinationChange = (value: string) => {
    const selectedPatient = destinations.find(p => p.id.toString() === value) || null;
    setSelectedDestination(selectedPatient);
  };

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchHotels = async () => {
    setIsLoading(true);
    try {
      const response = await getHotels();
      if (response) {
        setHotels(response);
      } else {
        console.error("Failed to fetch hotels");
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
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

  const handleAddHotel = async () => {
    setIsLoading(true);
    const hotel = {
    name: newHotel.name,
    stars: newHotel.rating,
    pricePerNight: newHotel.pricePerNight,
    image: newHotel.image,
    destination: selectedDestination!
    }
    try {
      const response = await createHotel(hotel);
      if (response) {
        setHotels((prev) => [...prev, response]);
        toast({
          title: "Hotel added",
          description: `${newHotel.name} was successfully added.`,
        });
        setIsAddDialogOpen(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to add the hotel.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding hotel:", error);
      toast({
        title: "Error",
        description: "An error occurred while adding the hotel.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditHotel = async () => {
    if (!currentHotel) return;

    const hotel = {
        id : currentHotel.id,
        name: currentHotel.name,
        stars: currentHotel.stars,
        pricePerNight: currentHotel.pricePerNight,
        destination: selectedDestination!,
        image : currentHotel.image
        }
    setIsLoading(true);
    try {
      const response = await updateHotel(currentHotel.id, hotel);
      if (response) {
        setHotels((prev) =>
          prev.map((hotel) => (hotel.id === currentHotel.id ? response : hotel))
        );
        toast({
          title: "Hotel updated",
          description: `${currentHotel.name} was successfully updated.`,
        });
        setIsEditDialogOpen(false);
        setCurrentHotel(null);
      } else {
        toast({
          title: "Error",
          description: "Failed to update the hotel.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating hotel:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the hotel.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHotel = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await deleteHotel(id);
      if (response) {
        setHotels((prev) =>
          prev.filter((hotel) => hotel.id !== id)
        );
        toast({
          title: "Hotel deleted",
          description: "The hotel was successfully deleted.",
        });
      } else {
        setHotels((prev) =>
          prev.filter((hotel) => hotel.id !== id)
        );
        toast({
          title: "Hotel deleted",
          description: "The hotel was successfully deleted.",
        });
      }
    } catch (error) {
      console.error("Error deleting hotel:", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the hotel.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (hotel: Hotel) => {
    setCurrentHotel({ ...hotel });
    setIsEditDialogOpen(true);
  };

  useEffect(() => {
    fetchHotels();
    fetchDestinations();
  }, []);

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Manage Hotels</h1>
      <Button className="mb-4" onClick={() => setIsAddDialogOpen(true)}>
        Add Hotel
      </Button>
      {isLoading ? (
        <LoadingState isOpen={isLoading} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Hotels</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Price/Night</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hotels.map((hotel) => (
                  <TableRow key={hotel.id}>
                    <TableCell>{hotel.name}</TableCell>
                    <TableCell>{hotel.stars || "N/A"}</TableCell>
                    <TableCell>{hotel.pricePerNight || "N/A"}</TableCell>
                    <TableCell>{hotel.destination.city}</TableCell>
                    <TableCell>
                      <button
                        className="mr-2 text-blue-600 hover:underline"
                        onClick={() => openEditDialog(hotel)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this hotel?")) {
                            handleDeleteHotel(hotel.id);
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

      {/* Add Hotel Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Hotel</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new hotel.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Hotel Name"
              value={newHotel.name}
              onChange={(e) =>
                setNewHotel({ ...newHotel, name: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Rating"
              value={newHotel.rating || ""}
              onChange={(e) =>
                setNewHotel({ ...newHotel, rating: Number(e.target.value) })
              }
            />
            <Input
              type="number"
              placeholder="Price per Night"
              value={newHotel.pricePerNight || ""}
              onChange={(e) =>
                setNewHotel({ ...newHotel, pricePerNight: Number(e.target.value) })
              }
            />
            <Select onValueChange={handleDestinationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a destination" />
              </SelectTrigger>
              <SelectContent>
              <SelectGroup>
              <SelectLabel>Destination</SelectLabel>
                {destinations.map((destination) => (
                  <SelectItem key={destination.id} value={destination.id.toString()}>
                    {destination.city}, {destination.country}
                  </SelectItem>
                ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0]; // Access the first file
                if (file) {
                    setNewHotel({
                    ...newHotel,
                    image: file, // Set the file to the state
                  });
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddHotel} className="w-full">
              Add Hotel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Hotel Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Hotel</DialogTitle>
            <DialogDescription>
              Update the details of the hotel.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Hotel Name"
              value={currentHotel?.name || ""}
              onChange={(e) =>
                setCurrentHotel({
                  ...currentHotel!,
                  name: e.target.value,
                })
              }
            />
            <Input
              type="number"
              placeholder="Rating"
              value={currentHotel?.stars || ""}
              onChange={(e) =>
                setCurrentHotel({
                  ...currentHotel!,
                  stars: Number(e.target.value),
                })
              }
            />
            <Input
              type="number"
              placeholder="Price per Night"
              value={currentHotel?.pricePerNight || ""}
              onChange={(e) =>
                setCurrentHotel({
                  ...currentHotel!,
                  pricePerNight: Number(e.target.value),
                })
              }
            />
            <Select onValueChange={handleDestinationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a destination" />
              </SelectTrigger>
              <SelectContent>
              <SelectGroup>
              <SelectLabel>Destination</SelectLabel>
                {destinations.map((destination) => (
                  <SelectItem key={destination.id} value={destination.id.toString()}>
                    {destination.city}, {destination.country}
                  </SelectItem>
                ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={handleEditHotel} className="w-full">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
