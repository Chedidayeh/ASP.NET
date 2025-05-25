'use server'

import { axiosInstance, Destination, Hotel } from "@/services/api";
// Assuming you have a function to upload the image to the server
import { writeFile } from 'fs/promises';
import { extname } from 'path';
import { join } from 'path';
import { mkdir } from 'fs/promises'; // For creating the directory if it doesn't exist

export const uploadImage = async (file: File) => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Remove the file extension while preserving the file type
  const fileNameWithoutExtension = file.name.split('.').slice(0, -1).join('.');

  // Generate a unique identifier for the file name
  const uniqueFileName = `${fileNameWithoutExtension}${extname(file.name)}`;

  // Define the path where you want to store the file
  const uploadsDir = join(process.cwd(), 'public', 'hotels');
  const filePath = join(uploadsDir, uniqueFileName);

  // Ensure the directory exists (create if not)
  try {
    await mkdir(uploadsDir, { recursive: true }); // Creates the directory if it doesn't exist

    // Write the file to the specified path
    await writeFile(filePath, buffer);

    // Return the relative URL to the uploaded file
    return `/hotels/${uniqueFileName}`;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

// Create a new hotel
export const createHotel = async (hotel: {    
  name: string;
  stars?: number;
  pricePerNight?: number;
  image: File | null;
  destination: Destination;}) => {
        const imageUrl = await uploadImage(hotel.image!);
        // Once the image is uploaded, create the destination with the image URL
        const hotelWithImage = {
          ...hotel,
          image: imageUrl, // Add the image URL to the destination object
        };
  try {
    const response = await axiosInstance.post('/hotels', hotelWithImage);
    return response.data;
  } catch (error) {
    console.error('Error creating hotel:', error);
    throw error;
  }
};

// Get all hotels
export const getHotels = async (): Promise<Hotel[]> => {
  try {
    const response = await axiosInstance.get('/hotels');
    return response.data;
  } catch (error) {
    console.error('Error fetching hotels:', error);
    throw error;
  }
};

// Get a single hotel by ID
export const getHotelById = async (id: number): Promise<Hotel> => {
  try {
    const response = await axiosInstance.get(`/hotels/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching hotel with ID ${id}:`, error);
    throw error;
  }
};

// Update a hotel
export const updateHotel = async (id: number, hotel: Hotel) => {
  try {
    const response = await axiosInstance.put(`/hotels/${id}`, hotel);
    return response.data;
  } catch (error) {
    console.error(`Error updating hotel with ID ${id}:`, error);
    throw error;
  }
};

// Delete a hotel
export const deleteHotel = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/hotels/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting hotel with ID ${id}:`, error);
    throw error;
  }
};
