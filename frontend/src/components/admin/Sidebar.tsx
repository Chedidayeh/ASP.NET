import Link from "next/link"
import { Home, Users, MapPin, Hotel, Plane, Calendar } from 'lucide-react'

const navItems = [
  { href: "/admin", icon: Home, label: "Dashboard" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/destinations", icon: MapPin, label: "Destinations" },
  { href: "/admin/hotels", icon: Hotel, label: "Hotels" },
  { href: "/admin/flights", icon: Plane, label: "Flights" },
  { href: "/admin/reservations", icon: Calendar, label: "Reservations" },
]

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col bg-gray-800 text-white">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>
      <nav className="flex-1">
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

