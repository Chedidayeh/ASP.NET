'use server'
import { axiosInstance, Destination, Flight } from "@/services/api";

// Create a new flight
export const createFlight = async (flight: {    
  flightNumber: string;
  departureCity: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  destination: Destination;}) => {
  try {
    const response = await axiosInstance.post('/flights', flight);
    return response.data;
  } catch (error) {
    console.error('Error creating flight:', error);
    throw error;
  }
};

// Get all flights
export const getFlights = async (): Promise<Flight[]> => {
  try {
    const response = await axiosInstance.get('/flights');
    return response.data;
  } catch (error) {
    console.error('Error fetching flights:', error);
    throw error;
  }
};

// Get a single flight by ID
export const getFlightById = async (id: number): Promise<Flight> => {
  try {
    const response = await axiosInstance.get(`/flights/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching flight with ID ${id}:`, error);
    throw error;
  }
};

// Update a flight
export const updateFlight = async (id: number, flight:{
  id : number ;
  flightNumber: string;
  departureCity: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  destination: Destination;
}) => {
  try {
    console.log(flight)
    const response = await axiosInstance.put(`/flights/${id}`, flight);
    return response.data;
  } catch (error) {
    console.error(`Error updating flight with ID ${id}:`, error);
    throw error;
  }
};

// Delete a flight
export const deleteFlight = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/flights/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting flight with ID ${id}:`, error);
    throw error;
  }
};
