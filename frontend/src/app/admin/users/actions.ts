'use server'

import { axiosInstance, User } from "@/services/api";

// Create a new user
export const createUser = async (user: {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "PASSENGER";
}) => {
  try {
    const response = await axiosInstance.post('/users', user);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Get all users
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axiosInstance.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};


export const getUserByEmail = async (email : string) => {
  try {
    const response = await axiosInstance.post("/users/by-email", {
      email: email,
    });

    return response.data;

  } catch (error) {
    console.error("Error logging in:", error);
    return null; // In case of an error
  }
};

// Get a single user by ID
export const getUserById = async (id: number): Promise<User> => {
  try {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

// Update a user
export const updateUser = async (id: number, user: User) => {
  try {
    const response = await axiosInstance.put(`/users/${id}`, user);
    return response.data;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
};
