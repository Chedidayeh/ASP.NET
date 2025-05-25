import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen">
      <div className="absolute inset-0">
        <img
          src="/hero.jpg"
          alt="Coastal town with mountains and harbor"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative flex min-h-screen items-center justify-center">
        <div className="container px-4 py-32 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
            JOURNEY TO
            <br />
            EXPLORE WORLD
          </h1>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/destinations"
              className="rounded-full bg-[#3575D3] px-8 py-3 text-sm font-medium text-white hover:bg-[#2961B3]"
            >
              LEARN MORE
            </Link>
            <Link
              href="/destinations"
              className="rounded-full border-2 border-white px-8 py-3 text-sm font-medium text-white hover:bg-white hover:text-gray-900"
            >
              BOOK NOW
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

