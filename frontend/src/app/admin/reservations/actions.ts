'use server'
import { axiosInstance, Flight, Hotel, Reservation, User } from "@/services/api";


// Create a new reservation
export const createReservation = async (reservation: {    
    reservationDate: string;
    user: User | null;
    flight?: Flight | null;
    hotel?: Hotel | null; }) => {
  try {
    const response = await axiosInstance.post('/reservations', reservation);
    return response.data;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};

// Get all reservations
export const getReservations = async (): Promise<Reservation[]> => {
  try {
    const response = await axiosInstance.get('/reservations');
    return response.data;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }
};

// Get a single reservation by ID
export const getReservationById = async (id: number): Promise<Reservation> => {
  try {
    const response = await axiosInstance.get(`/reservations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reservation with ID ${id}:`, error);
    throw error;
  }
};

// Update a reservation
export const updateReservation = async (id: number, reservation: Reservation) => {
  try {
    const response = await axiosInstance.put(`/reservations/${id}`, reservation);
    return response.data;
  } catch (error) {
    console.error(`Error updating reservation with ID ${id}:`, error);
    throw error;
  }
};

// Delete a reservation
export const deleteReservation = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/reservations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting reservation with ID ${id}:`, error);
    throw error;
  }
};
