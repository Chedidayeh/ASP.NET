'use server'

import { axiosInstance, User } from "@/services/api";

// Create a new user
export const createUser = async (user: {
    name : string,
    email : string,
    password : string,
    role: string,
}) => {
  try {
    const response = await axiosInstance.post('/users', user);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const loginUser = async (email : string, password : string) => {
  try {
    const response = await axiosInstance.post("/users/login", {
      email: email,
      password: password,
    });

    if (response.status === 200) {
      return true; // Login successful
    } else {
      return false; // Invalid credentials or other failure
    }
  } catch (error) {
    console.error("Error logging in:", error);
    return false; // In case of an error
  }
};


// check if email exist : 
export const EmailExists = async (email : string) => {
    try {
    const { data } = await axiosInstance.get<boolean>(`/users/email-exists/${email}`);
    return data; 
    } catch (error) {
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
