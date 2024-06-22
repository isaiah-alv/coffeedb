"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCafe() {
  const [name, setName] = useState("");
  const [coffeeRating, setCoffeeRating] = useState(5);
  const [atmosphereRating, setAtmosphereRating] = useState(5);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("USA");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !street || !city || !country) {
      alert("Name, street, city, and country are required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/cafes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          ratings: {
            coffee: coffeeRating,
            atomosphre: atmosphereRating
          },
          address: {
            street,
            city,
            postalCode,
            country
          }
        }),
      });

      if (res.ok) {
        router.push("/success");
      } else {
        throw new Error("Failed to add the café");
      }
    } catch (error) {
      console.error("Error adding café: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow-md max-w-lg m-auto">
      <div className="flex flex-col">
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 rounded-md shadow-sm px-4 py-2"
          type="text"
          placeholder="Enter café name..."
          required
        />
      </div>
      
      <div className="flex flex-col">
        <label htmlFor="coffee-rating" className="mb-1 text-gray-700">Coffee Rating (1-10)</label>
        <input
          onChange={(e) => setCoffeeRating(Number(e.target.value))}
          value={coffeeRating}
          className="appearance-none bg-gray-200 h-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          type="range"
          id="coffee-rating"
          name="coffee-rating"
          min="1"
          max="10"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="atmosphere-rating" className="mb-1 text-gray-700">Cafe Atmosphere Rating (1-10)</label>
        <input
          onChange={(e) => setAtmosphereRating(Number(e.target.value))}
          value={atmosphereRating}
          className="appearance-none bg-gray-200 h-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          type="range"
          id="atmosphere-rating"
          name="atmosphere-rating"
          min="1"
          max="10"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="street-address" className="mb-1 text-gray-700">Street Address</label>
        <input
          onChange={(e) => setStreet(e.target.value)}
          value={street}
          type="text"
          id="street-address"
          name="street-address"
          autoComplete="street-address"
          required 
          className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 rounded-md shadow-sm px-4 py-2"
          placeholder="1234 Main St"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="postal-code" className="mb-1 text-gray-700">ZIP or Postal Code (optional)</label>
        <input
          onChange={(e) => setPostalCode(e.target.value)}
          value={postalCode}
          className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 rounded-md shadow-sm px-4 py-2"
          id="postal-code"
          name="postal-code"
          autoComplete="postal-code"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="city" className="mb-1 text-gray-700">City</label>
        <input
          onChange={(e) => setCity(e.target.value)}
          value={city}
          required
          type="text"
          id="city"
          name="city"
          autoComplete="address-level2"
          className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 rounded-md shadow-sm px-4 py-2"
          placeholder="City"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="country" className="mb-1 text-gray-700">Country or Region</label>
        <select
          onChange={(e) => setCountry(e.target.value)}
          value={country}
          id="country"
          name="country"
          autoComplete="country"
          required
          className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 rounded-md shadow-sm px-4 py-2"
        >
          <option value="USA">United States</option>
        </select>
      </div>
      
      <button
        type="submit"
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit Cafe
      </button>
    </form>
  );
}
