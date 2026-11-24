
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Destination = {
  _id: string;
  name: string;
  country: string;
  location: string;
  price: number;
  duration: string;
  image: string;
  description: string;
};

export default function EditDestinationPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchDestination() {
      try {
        const res = await fetch(
          `http://localhost:8000/destinations/${id}`
        );

        if (!res.ok) {
          throw new Error("Destination not found");
        }

        const data: Destination = await res.json();

        setName(data.name || "");
        setCountry(data.country || "");
        setLocation(data.location || "");
        setPrice(String(data.price ?? ""));
        setDuration(data.duration || "");
        setImage(data.image || "");
        setDescription(data.description || "");
      } catch (error) {
        setMessage("Failed to load destination.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchDestination();
    }
  }, [id]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(
        `http://localhost:8000/destinations/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            country,
            location,
            price: Number(price),
            duration,
            image,
            description,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to update destination"
        );
      }

      setMessage("Destination updated successfully!");

      setTimeout(() => {
        router.push(`/destinations/${id}`);
        router.refresh();
      }, 1000);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong!"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading destination...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-lg sm:p-10">

        <Link
          href={`/destinations/${id}`}
          className="font-semibold text-orange-500"
        >
          ← Back to Destination
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Edit Destination
        </h1>

        <p className="mt-2 text-gray-500">
          Update destination information below.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="mb-2 block font-semibold">
              Destination Name
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Country
            </label>
            <input
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Location
            </label>
            <input
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block font-semibold">
                Price
              </label>
              <input
                required
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Duration
              </label>
              <input
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Image URL
            </label>
            <input
              required
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Description
            </label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border p-3"
            />
          </div>

          {message && (
            <p className="rounded-lg bg-gray-100 p-3 text-center text-sm font-semibold">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-orange-500 py-4 font-bold text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {saving ? "Updating..." : "Update Destination"}
          </button>
        </form>
      </div>
    </main>
  );
}
