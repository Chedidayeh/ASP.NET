'use server'
import axios from "axios";
import https from "https";

// Define the base URL for your API
const API_URL = "https://localhost:44334/api";  // Change this if needed

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 5000, // Maximum wait time of 5 seconds
  httpsAgent: new https.Agent({
    rejectUnauthorized: false, // Allow self-signed certificates
  }),
});


export interface Destination {
  id: number;
  city: string;
  country: string;
  image : string;
  description?: string;
  hotels?: Hotel[]; // Array of hotels (optional if not eager-loaded)
  flights?: Flight[]; // Array of flights (optional if not eager-loaded)
}

export interface Flight {
  id: number;
  flightNumber: string;
  departureCity: string;
  departureTime: string; // ISO string format for datetime
  arrivalTime: string; // ISO string format for datetime
  price:number;
  destination: Destination;
  reservations?: Reservation[]; // Array of reservations (optional if not eager-loaded)
}

export interface Hotel {
  id: number;
  name: string;
  image : string;
  stars?: number; // Optional rating
  pricePerNight?: number; // Optional price per night
  destination: Destination;
  reservations?: Reservation[]; // Array of reservations (optional if not eager-loaded)
}

export interface Reservation {
  id: number;
  reservationDate: string; // ISO string format for datetime
  user: User;
  flight?: Flight; // Optional flight if not booked
  hotel?: Hotel; // Optional hotel if not booked
}


export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'PASSENGER'; // Enum for roles
  reservations?: Reservation[]; // Array of reservations (optional if not eager-loaded)
}





