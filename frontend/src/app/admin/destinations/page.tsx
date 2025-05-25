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
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import LoadingState from "@/components/LoadingState";
import { getDestinations, createDestination, updateDestination, deleteDestination } from "./actions";
import { Destination } from "@/services/api";

export default function Page() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentDestination, setCurrentDestination] = useState<Destination | null>(null);
  const [newDestination, setNewDestination] = useState<{
    city: string;
    country: string;
    description: string;
    image: File | null;
  }>({
    city: "",
    country: "",
    description: "",
    image: null,
  });

  
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchDestinations = async () => {
    setIsLoading(true);
    try {
      const response = await getDestinations();
      if (response) {
        setDestinations(response);
      } else {
        console.error("Failed to fetch destinations");
      }
    } catch (error) {
      console.error("Error fetching destinations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDestination = async () => {
    setIsLoading(true);
    try {
      const response = await createDestination(newDestination);
      if (response) {
        setDestinations((prev) => [...prev, response]);
        toast({
          title: "Destination added",
          description: `${newDestination.city}, ${newDestination.country} was successfully added.`,
        });
        setIsAddDialogOpen(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to add the destination.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding destination:", error);
      toast({
        title: "Error",
        description: "An error occurred while adding the destination.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditDestination = async () => {
    if (!currentDestination) return;

    setIsLoading(true);
    try {
      const response = await updateDestination(currentDestination.id, currentDestination);
      if (response) {
        setDestinations((prev) =>
          prev.map((dest) => (dest.id === currentDestination.id ? response : dest))
        );
        toast({
          title: "Destination updated",
          description: `${currentDestination.city}, ${currentDestination.country} was successfully updated.`,
        });
        setIsEditDialogOpen(false);
        setCurrentDestination(null);
      } else {
        toast({
          title: "Error",
          description: "Failed to update the destination.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating destination:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the destination.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (destination: Destination) => {
    setCurrentDestination({ ...destination });
    setIsEditDialogOpen(true);
  };

  const handleDeleteDestination = async (id: number) => {
    setIsLoading(true);
    try {
      // Make the delete request here
      const response = await deleteDestination(id);
      console.log(response)
      if (response) {
        setDestinations((prev) =>
          prev.filter((destination) => destination.id !== id)
        );
        toast({
          title: "Destination deleted",
          description: "The destination was successfully deleted.",
        });
      } else {
        setDestinations((prev) =>
          prev.filter((destination) => destination.id !== id)
        );
        toast({
          title: "Destination deleted",
          description: "The destination was successfully deleted.",
        });
      }
    } catch (error) {
      console.error("Error deleting destination:", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the destination.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    fetchDestinations();
  }, []);


  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Manage Destinations</h1>
      <Button className="mb-4" onClick={() => setIsAddDialogOpen(true)}>
        Add Destination
      </Button>
      {isLoading ? (
        <LoadingState isOpen={isLoading} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Destinations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>city</TableHead>
                  <TableHead>country</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {destinations.map((destination) => (
                  <TableRow key={destination.id}>
                    <TableCell>{destination.city}</TableCell>
                    <TableCell>{destination.country}</TableCell>
                    <TableCell>{destination.description}</TableCell>
                    <TableCell>
                      <button
                        className="mr-2 text-blue-600 hover:underline"
                        onClick={() => openEditDialog(destination)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this destination?")) {
                            handleDeleteDestination(destination.id);
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

      {/* Add Destination Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Destination</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new destination.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="city"
              value={newDestination.city}
              onChange={(e) =>
                setNewDestination({ ...newDestination, city: e.target.value })
              }
            />
            <Input
              placeholder="country"
              value={newDestination.country}
              onChange={(e) =>
                setNewDestination({ ...newDestination, country: e.target.value })
              }
            />
            <Input
              placeholder="description"
              value={newDestination.description}
              onChange={(e) =>
                setNewDestination({
                  ...newDestination,
                  description: e.target.value,
                })
              }
            />
            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0]; // Access the first file
                if (file) {
                  setNewDestination({
                    ...newDestination,
                    image: file, // Set the file to the state
                  });
                }
              }}
            />

          </div>
          <DialogFooter>
            <Button onClick={() => setIsAddDialogOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleAddDestination} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Destination"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Destination Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Destination</DialogTitle>
            <DialogDescription>
              Update the details of the destination.
            </DialogDescription>
          </DialogHeader>
          {currentDestination && (
            <div className="space-y-4">
              <Input
                placeholder="city"
                value={currentDestination.city}
                onChange={(e) =>
                  setCurrentDestination({ ...currentDestination, city: e.target.value })
                }
              />
              <Input
                placeholder="country"
                value={currentDestination.country}
                onChange={(e) =>
                  setCurrentDestination({ ...currentDestination, country: e.target.value })
                }
              />
              <Input
                placeholder="description"
                value={currentDestination.description}
                onChange={(e) =>
                  setCurrentDestination({
                    ...currentDestination,
                    description: e.target.value,
                  })
                }
              />
              
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsEditDialogOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleEditDestination} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
