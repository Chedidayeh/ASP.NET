'use server'

import { axiosInstance, Reservation } from "@/services/api";

// Get a single reservation by ID
export const getReservationsByUserEmail = async (email: number): Promise<Reservation[]> => {
  try {
    const response = await axiosInstance.post("/reservations/by-user-email", {
      email: email,
    });
    return response.data;
  } catch (error) {
    console.log(error)
    return []
  }
};