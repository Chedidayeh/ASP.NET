'use server'

import { getFlightsByDestination } from "./actions"
import Flights from "./Flights"

interface PageProps {
  params: {
    destinationId: string
  }
}

const Page = async ({ params }: PageProps) => {
  const { destinationId } = params
  let flights = []

  try {
    flights = await getFlightsByDestination(parseInt(destinationId))
    
    return <Flights flights={flights} />

  } catch (error) {
    console.error('Error fetching flights:', error)
    // Optionally, you can handle the error more gracefully, e.g., by showing a fallback UI
  }

}

export default Page
