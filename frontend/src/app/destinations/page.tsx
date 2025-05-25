import Image from "next/image"
import Link from "next/link"
import { getDestinations } from "../admin/destinations/actions";



export default async function Page() {
    const destinations = await getDestinations();

  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">Famous Destinations</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {destinations.map((destination) => (
            <div key={destination.id} className="group overflow-hidden rounded-lg bg-zinc-200 shadow-lg transition-transform duration-300 hover:scale-105">
              <Image
                src={destination.image}
                alt={destination.city}
                width={300}
                height={400}
                className="h-64 w-full object-cover"
              />
              <div className="p-4">
                <h3 className=" font-semibold text-gray-900">{destination.city} <span className="text-xs">/ {destination.country}</span></h3>
                <p className="text-xs font-normal text-gray-600">{destination.description}</p>
                <Link
                  href={`/flights/${destination.id}`}
                  className="mt-2 inline-block text-sm font-medium text-[#3575D3] hover:underline"
                                >
                  Book Now !
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

