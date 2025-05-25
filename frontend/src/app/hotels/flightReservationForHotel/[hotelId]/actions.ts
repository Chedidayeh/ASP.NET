'use server'

import { axiosInstance, Reservation } from "@/services/api";

export const getReservationsByDestinationId = async (destinationId: number) : Promise<Reservation[]> => {
  try {
    const response = await axiosInstance.get(`/reservations/by-destination/${destinationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};