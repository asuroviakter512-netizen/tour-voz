
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AddDestinationPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!token || !savedUser) {
        setMessage("Please login with your admin account first.");
        return;
      }

      let user;

      try {
        user = JSON.parse(savedUser);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setMessage("Login information is invalid. Please login again.");
        return;
      }

      if (String(user.role || "").trim().toLowerCase() !== "admin") {
        setMessage("Access denied. Admin account required.");
        return;
      }

      const form = event.currentTarget;
      const formData = new FormData(form);

      const data = {
        name: String(formData.get("name") || "").trim(),
        country: String(formData.get("country") || "").trim(),
        location: String(formData.get("location") || "").trim(),
        price: Number(formData.get("price")),
        duration: String(formData.get("duration") || "").trim(),
        image: String(formData.get("image") || "").trim(),
        description: String(formData.get("description") || "").trim(),
      };

      if (
        !data.name ||
        !data.country ||
        !data.location ||
        !data.duration ||
        !data.image ||
        !data.description ||
        !Number.isFinite(data.price) ||
        data.price < 0
      ) {
        setMessage("Please enter valid information in all fields.");
        return;
      }

      const response = await fetch(
        "https://tour-voz-server.onrender.com/add-destination",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setMessage("Session expired. Please login again.");
        return;
      }

      if (response.status === 403) {
        setMessage("Access denied. Admin account required.");
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || "Failed to add destination.");
      }

      setMessage("Travel package added successfully!");
      form.reset();

      setTimeout(() => {
        router.push("/destinations");
      }, 1500);
    } catch (error) {
      console.error("Add destination error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to add travel package. Check Backend."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Add Travel Package
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Add a new destination to Tour-Voz.
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Destination Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. Bali Paradise Escape"
                  required
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    placeholder="e.g. Indonesia"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g. Ubud, Bali"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="1199"
                    min="0"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    placeholder="e.g. 7 days / 6 nights"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the travel package..."
                  rows={4}
                  required
                />
              </div>

              {message && (
                <p className="text-sm font-medium text-emerald-600">
                  {message}
                </p>
              )}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-500 text-white hover:bg-emerald-600"
                >
                  {loading ? "Adding..." : "Add Travel Package"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </main>
  );
}
