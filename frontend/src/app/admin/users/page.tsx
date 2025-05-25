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
import { getUsers, createUser, updateUser, deleteUser } from "./actions";
import { User } from "@/services/api";

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<{
    name: string;
    email: string;
    password: string;
    role: "ADMIN" | "PASSENGER";
  }>({
    name: "",
    email: "",
    password: "",
    role: "PASSENGER",
  });

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getUsers();
      if (response) {
        setUsers(response);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async () => {
    setIsLoading(true);
    try {
      const response = await createUser(newUser);
      if (response) {
        setUsers((prev) => [...prev, response]);
        toast({
          title: "User added",
          description: `${newUser.name} was successfully added.`,
        });
        setIsAddDialogOpen(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to add the user.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description: "An error occurred while adding the user.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const response = await updateUser(currentUser.id, currentUser);
      if (response) {
        setUsers((prev) =>
          prev.map((user) => (user.id === currentUser.id ? response : user))
        );
        toast({
          title: "User updated",
          description: `${currentUser.name} was successfully updated.`,
        });
        setIsEditDialogOpen(false);
        setCurrentUser(null);
      } else {
        toast({
          title: "Error",
          description: "Failed to update the user.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the user.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (user: User) => {
    setCurrentUser({ ...user });
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = async (id: number) => {
    setIsLoading(true);
    try {
      // Make the delete request here
      const response = await deleteUser(id);
      if (response) {
        setUsers((prev) =>
          prev.filter((user) => user.id !== id)
        );
        toast({
          title: "User deleted",
          description: "The user was successfully deleted.",
        });
      } else {
        setUsers((prev) =>
          prev.filter((user) => user.id !== id)
        );
        toast({
          title: "User deleted",
          description: "The user was successfully deleted.",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the user.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Manage Users</h1>
      <Button className="mb-4" onClick={() => setIsAddDialogOpen(true)}>
        Add User
      </Button>
      {isLoading ? (
        <LoadingState isOpen={isLoading} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <button
                        className="mr-2 text-blue-600 hover:underline"
                        onClick={() => openEditDialog(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this user?")) {
                            handleDeleteUser(user.id);
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

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new user.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Username"
              value={newUser.name}
              onChange={(e) =>
                setNewUser({ ...newUser, name: e.target.value })
              }
            />
            <Input
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <Input
              placeholder="Password"
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
            <select
              value={newUser.role}
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value as "ADMIN" | "PASSENGER" })
              }
            >
              <option value="ADMIN">Admin</option>
              <option value="PASSENGER">Passenger</option>
            </select>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsAddDialogOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleAddUser} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the details of the user.
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="space-y-4">
              <Input
                placeholder="Username"
                value={currentUser.name}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, name: e.target.value })
                }
              />
              <Input
                placeholder="Email"
                value={currentUser.email}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, email: e.target.value })
                }
              />
              <Input
                placeholder="Password"
                type="password"
                value={currentUser.password}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, password: e.target.value })
                }
              />
              <select
                value={currentUser.role}
                onChange={(e) =>
                  setCurrentUser({
                    ...currentUser,
                    role: e.target.value as "ADMIN" | "PASSENGER",
                  })
                }
              >
                <option value="ADMIN">Admin</option>
                <option value="PASSENGER">Passenger</option>
              </select>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsEditDialogOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleEditUser} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
