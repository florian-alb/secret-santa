"use client";

import { registerParticipant } from "@/app/actions/register";
import { useFormStatus } from "react-dom";
import confetti from "canvas-confetti";
import { useState } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition disabled:opacity-50"
    >
      {pending ? "Inscription..." : "S'inscrire 🎅"}
    </button>
  );
}

export default function RegistrationForm() {
  const [message, setMessage] = useState("");
  const [key, setKey] = useState(0); // To reset form

  async function action(formData: FormData) {
    const res = await registerParticipant(formData);
    setMessage(res.message);
    if (res.success) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#d32f2f", "#388e3c", "#ffffff"], // Red, Green, White
      });
      setKey((prev) => prev + 1); // Reset inputs
    }
  }

  return (
    <form
      key={key}
      action={action}
      className="space-y-4 bg-white p-6 rounded-lg shadow-md max-w-md w-full mx-auto"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Nom
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 border p-2 text-gray-900 bg-white"
          placeholder="Ton prénom"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 border p-2 text-gray-900 bg-white"
          placeholder="ton@email.com"
        />
      </div>
      <SubmitButton />
      {message && (
        <p
          className={`text-center text-sm ${
            message.includes("réussie") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
