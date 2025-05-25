'use server'

import { getHotelById } from "@/app/admin/hotels/actions"
import Reservations from "./Reservations"
import { getReservationsByDestinationId } from "./actions"

interface PageProps {
  params: {
    hotelId: string
  }
}

const Page = async ({ params }: PageProps) => {
  const { hotelId } = params
  try {
    const hotel = await getHotelById(parseInt(hotelId))
    const reservations = await getReservationsByDestinationId(hotel.destination.id)
    return <Reservations reservations={reservations} hotel={hotel} />
  } catch (error) {
    console.error('Error fetching flights:', error)
    // Optionally, you can handle the error more gracefully, e.g., by showing a fallback UI
  }

}

export default Page
