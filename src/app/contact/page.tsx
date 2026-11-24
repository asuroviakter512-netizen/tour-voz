
"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const messageText = formData.get("message");

    const emailBody = `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${messageText}`;

    const mailtoLink = `mailto:info@tourvoz.com?subject=${encodeURIComponent(
      String(subject)
    )}&body=${encodeURIComponent(emailBody)}`;

    window.location.href = mailtoLink;

    setMessage("Your email application is opening.");
    form.reset();
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="bg-emerald-600 px-6 py-16 text-center text-white">
        <h1 className="text-4xl font-bold md:text-5xl">
          Contact Us
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg">
          Have questions about your next trip? We would love
          to hear from you.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2">
        <div>
          <h2 className="mb-6 text-3xl font-bold">
            Get in Touch
          </h2>

          <p className="mb-8 leading-7 text-muted-foreground">
            Contact our team for travel information, booking
            support, or any questions about Tour-Voz.
          </p>

          <div className="space-y-5">
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-muted-foreground">
                info@tourvoz.com
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Website</h3>
              <p className="text-muted-foreground">
                www.tourvoz.com
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Support</h3>
              <p className="text-muted-foreground">
                We are here to help you plan your journey.
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Send Us a Message
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="Enter subject"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Write your message..."
                  rows={5}
                  required
                />
              </div>

              {message && (
                <p className="text-sm text-emerald-600">
                  {message}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </main>
  );
}
