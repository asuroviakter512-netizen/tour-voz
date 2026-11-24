"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const columns = [
  {
    title: "Company",
    links: ["About", "Careers", "Press", "Blog"],
  },
  {
    title: "Support",
    links: ["Help Center", "Contact", "Privacy", "Terms"],
  },
  {
    title: "Destinations",
    links: ["Bali", "Greece", "Japan", "Switzerland"],
  },
];

export function Footer() {
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => setYear(new Date().getFullYear()), []);

  return (
    <footer className="bg-gray-900 px-6 py-16 text-gray-300">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link href="/" className="text-xl font-bold text-white">
              Tour<span className="text-emerald-400">Voz</span>
            </Link>
            <p className="mt-3 text-sm text-gray-400">
              Curated travel experiences for the modern explorer.
            </p>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="font-semibold text-white">{column.title}</h4>
              <ul className="mt-3 space-y-2 text-sm">
                {column.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="transition hover:text-white">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          &copy; {year ?? ""} TourVoz. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
