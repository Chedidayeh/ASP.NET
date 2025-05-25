'use server'

import { axiosInstance, Destination } from "@/services/api";
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
  const uploadsDir = join(process.cwd(), 'public', 'destinations');
  const filePath = join(uploadsDir, uniqueFileName);

  // Ensure the directory exists (create if not)
  try {
    await mkdir(uploadsDir, { recursive: true }); // Creates the directory if it doesn't exist

    // Write the file to the specified path
    await writeFile(filePath, buffer);

    // Return the relative URL to the uploaded file
    return `/destinations/${uniqueFileName}`;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};


export const createDestination = async (destination: {
  city: string;
  country: string;
  description: string;
  image: File | null;
}) => {
  if (!destination.image) {
    throw new Error("Image is required for the destination.");
  }

  try {
    // Upload the Image and get its URL
    const ImageUrl = await uploadImage(destination.image);

    // Once the Image is uploaded, create the destination with the Image URL
    const destinationWithImage = {
      ...destination,
      image: ImageUrl, // Add the Image URL to the destination object
    };

    const response = await axiosInstance.post("/destinations", destinationWithImage);
    return response.data;
  } catch (error) {
    console.error("Error creating destination:", error);
    throw error;
  }
};


// Get all destinations



export const getDestinations = async (): Promise<Destination[]> => {
  try {
    const response = await axiosInstance.get('/destinations');
    return response.data;
  } catch (error) {
    console.error('Error fetching destinations:', error);
    throw error;
  }
};

// Get a single destination by ID
export const getDestinationById = async (id: number): Promise<Destination> => {
  try {
    const response = await axiosInstance.get(`/destinations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching destination with ID ${id}:`, error);
    throw error;
  }
};

// Update a destination
export const updateDestination = async (id: number, destination: Destination) => {
  try {
    const response = await axiosInstance.put(`/destinations/${id}`, destination);
    return response.data;
  } catch (error) {
    console.error(`Error updating destination with ID ${id}:`, error);
    throw error;
  }
};

// Delete a destination
export const deleteDestination = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/destinations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting destination with ID ${id}:`, error);
    throw error;
  }
};

