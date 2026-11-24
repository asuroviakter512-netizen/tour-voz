
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/add-destination", label: "Add destination" },
  { href: "/tours", label: "Tours" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/my-bookings", label: "My Bookings" },
  { href: "/admin", label: "Admin Dashboard" },
];

type User = {
  name?: string;
  email?: string;
  role?: string;
};

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    loadUser();

    window.addEventListener("storage", loadUser);
    window.addEventListener("userChanged", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("userChanged", loadUser);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setOpen(false);
    router.push("/login");
  };

  const isHome = pathname === "/";
  const textColor = isHome ? "text-white" : "text-black";

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-white"
          onClick={() => setOpen(false)}
        >
          Tour<span className="text-emerald-400">Voz</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-6 text-sm font-medium lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${textColor} transition-colors hover:text-emerald-400`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Login / Profile */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                href="/profile"
                className={`${textColor} font-medium hover:text-emerald-400`}
              >
                Profile
              </Link>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="rounded-full"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="outline" className="rounded-full">
                Log In
              </Button>
            </Link>
          )}

          <Link href="/booking">
            <Button className="rounded-full bg-emerald-500 px-6 text-white hover:bg-emerald-600">
              Book Now
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          className={cn(
            "inline-flex items-center justify-center rounded-md p-2 md:hidden",
            textColor
          )}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Menu</span>
          <div className="space-y-1.5">
            <span className={cn(
              "block h-0.5 w-6 transition-transform",
              isHome ? "bg-white" : "bg-black",
              open && "translate-y-2 rotate-45"
            )} />
            <span className={cn(
              "block h-0.5 w-6 transition-opacity",
              isHome ? "bg-white" : "bg-black",
              open && "opacity-0"
            )} />
            <span className={cn(
              "block h-0.5 w-6 transition-transform",
              isHome ? "bg-white" : "bg-black",
              open && "-translate-y-2 -rotate-45"
            )} />
          </div>
        </button>
      </nav>

      {/* Mobile Navigation */}
      {open && (
        <div className="border-t border-gray-200 bg-white px-6 py-4 shadow-lg md:hidden">
          <ul className="flex flex-col gap-4 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block text-black transition-colors hover:text-emerald-500"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-col gap-3">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="text-black hover:text-emerald-500"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>

                <Button onClick={handleLogout} variant="outline" className="w-full rounded-full">
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full rounded-full">
                  Log In
                </Button>
              </Link>
            )}

            <Link href="/booking" onClick={() => setOpen(false)}>
              <Button className="w-full rounded-full bg-emerald-500 text-white hover:bg-emerald-600">
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
