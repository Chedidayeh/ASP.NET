'use client'
import { useToast } from "@/hooks/use-toast";
import { saveUserEmail } from "@/store/actions/action";
import { RootState } from "@/store/reducers/reducers";
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from "react-redux";
import LoadingState from "./LoadingState";
import { useState } from "react";

export function SiteHeader() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const userEmail = useSelector((state: RootState) => state.email);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleLogout = () => {
    setIsLoading(true)
    // Add a timeout of 5 seconds before proceeding with logout actions
    setTimeout(() => {
      // Remove the username from localStorage
      dispatch(saveUserEmail(null));
  
      // Show the logout toast
      toast({
        title: "You've been logged out!",
        description: "Try to log in again to continue.",
      });
  
      // Redirect to the /auth page
      setIsLoading(false)
      router.push('/auth');
    }, 5000); // 5000ms = 5 seconds
  };
  

  return (
    <>
    <header className="w-full">
      {/* Main navigation */}
      <nav className="border-b text-white bg-[#1B3B64]">
        <div className="container flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <svg
              className="h-8 w-8"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 11l18-5v12L3 14v-3z" />
              <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
            </svg>
            TOURLY
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/destinations"
              className="text-sm font-medium  hover:text-gray-600"
            >
              Destinations
            </Link>
            <Link
              href="/hotels"
              className="text-sm font-medium  hover:text-gray-600"
            >
              Hotels
            </Link>
            <Link
              href="/reservations"
              className="text-sm font-medium  hover:text-gray-600"
            >
              Your Reservations
            </Link>
            {userEmail ? (
              <button
                onClick={handleLogout}
                className="text-sm font-medium hover:text-gray-600"
              >
                Log Out
              </button>
            ) : (
              <Link
                href="/auth"
                className="text-sm font-medium hover:text-gray-600"
              >
                Log In
              </Link>
            )}
          </div>
          <button className="ml-2 p-2 text-gray-500 hover:text-gray-600 md:hidden">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          <Link
            href="#"
            className="rounded-full bg-[#3575D3] px-6 py-2 text-sm font-medium cursor-none text-white hover:bg-[#2961B3]"
          >
            Enjoy shopping
          </Link>
        </div>
      </nav>
    </header>
    {isLoading && (
      <LoadingState isOpen={isLoading} />
    )}
    </>
  )
}
