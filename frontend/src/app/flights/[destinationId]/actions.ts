'use server'

import { axiosInstance } from "@/services/api";


// Get a single flight by ID
export const getFlightsByDestination = async (destinationId: number) => {
  try {
    const response = await axiosInstance.get(`/flights/by-destination/${destinationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
