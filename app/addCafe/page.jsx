"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCafe() {
  const [formData, setFormData] = useState({
    name: "",
    coffeeRating: 5,
    atmosphereRating: 5,
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "USA"
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const router = useRouter();

  const normalize = (s) =>
    typeof s === "string" ? s.trim().toLowerCase() : "";

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.name.trim()) {
      newErrors.name = "Café name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Café name must be at least 2 characters";
    }

    if (!formData.street.trim()) {
      newErrors.street = "Street address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    } else if (formData.state.trim().length < 2) {
      newErrors.state = "Please enter a valid state (e.g., NJ, CA)";
    }

    // Rating validation
    if (formData.coffeeRating < 1 || formData.coffeeRating > 10) {
      newErrors.coffeeRating = "Coffee rating must be between 1 and 10";
    }

    if (formData.atmosphereRating < 1 || formData.atmosphereRating > 10) {
      newErrors.atmosphereRating = "Atmosphere rating must be between 1 and 10";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      coffeeRating: 5,
      atmosphereRating: 5,
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "USA"
    });
    setErrors({});
    setSubmitSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // 1) Fetch existing cafes
      const listRes = await fetch("/api/cafes");
      if (!listRes.ok) throw new Error("Could not load existing cafés");

      const data = await listRes.json();
      const cafeList = Array.isArray(data) ? data : data.cafes || [];

      // 2) Duplicate check
      const duplicate = cafeList.some((c) => {
        const addr = c.address || {};
        return (
          normalize(c.name) === normalize(formData.name) &&
          normalize(addr.street) === normalize(formData.street) &&
          normalize(addr.city) === normalize(formData.city) &&
          normalize(addr.state) === normalize(formData.state)
        );
      });

      if (duplicate) {
        setErrors({ general: "You've already added that café." });
        setIsSubmitting(false);
        return;
      }

      // 3) Create new cafe
      const res = await fetch("/api/cafes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          coffeeRating: formData.coffeeRating,
          atmosphereRating: formData.atmosphereRating,
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          postalCode: formData.postalCode.trim(),
          country: formData.country,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add the café");
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrors({ general: err.message || "Something went wrong. Please try again." });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white">
      <h1 className="text-2xl font-light text-gray-800 mb-8 text-center">
        Add New Café
      </h1>

      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center text-green-700">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Café added successfully! Redirecting...</span>
          </div>
        </div>
      )}

      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-700 font-medium">{errors.general}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Café Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Café Name *
          </label>
          <input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            type="text"
            placeholder="Enter café name"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors ${
              errors.name ? "border-red-300" : "border-gray-200"
            }`}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Ratings Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Ratings</h3>
          
          {/* Coffee Rating */}
          <div>
            <label htmlFor="coffee-rating" className="block text-sm font-medium text-gray-700 mb-2">
              Coffee Rating: {formData.coffeeRating}/10
            </label>
            <input
              id="coffee-rating"
              type="range"
              min="1"
              max="10"
              value={formData.coffeeRating}
              onChange={(e) => handleInputChange("coffeeRating", +e.target.value)}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
              disabled={isSubmitting}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
            {errors.coffeeRating && (
              <p className="mt-1 text-sm text-red-600">{errors.coffeeRating}</p>
            )}
          </div>

          {/* Atmosphere Rating */}
          <div>
            <label htmlFor="atmosphere-rating" className="block text-sm font-medium text-gray-700 mb-2">
              Atmosphere Rating: {formData.atmosphereRating}/10
            </label>
            <input
              id="atmosphere-rating"
              type="range"
              min="1"
              max="10"
              value={formData.atmosphereRating}
              onChange={(e) => handleInputChange("atmosphereRating", +e.target.value)}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
              disabled={isSubmitting}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
            {errors.atmosphereRating && (
              <p className="mt-1 text-sm text-red-600">{errors.atmosphereRating}</p>
            )}
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Address</h3>
          
          {/* Street Address */}
          <div>
            <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
              Street Address *
            </label>
            <input
              id="street"
              value={formData.street}
              onChange={(e) => handleInputChange("street", e.target.value)}
              type="text"
              placeholder="123 Main St"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors ${
                errors.street ? "border-red-300" : "border-gray-200"
              }`}
              disabled={isSubmitting}
            />
            {errors.street && (
              <p className="mt-1 text-sm text-red-600">{errors.street}</p>
            )}
          </div>

          {/* City and State Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                type="text"
                placeholder="New York"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors ${
                  errors.city ? "border-red-300" : "border-gray-200"
                }`}
                disabled={isSubmitting}
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                type="text"
                placeholder="NY"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors ${
                  errors.state ? "border-red-300" : "border-gray-200"
                }`}
                disabled={isSubmitting}
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state}</p>
              )}
            </div>
          </div>

          {/* Postal Code and Country Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                ZIP / Postal Code
              </label>
              <input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleInputChange("postalCode", e.target.value)}
                type="text"
                placeholder="10001"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors"
                disabled={isSubmitting}
              >
                <option value="USA">United States</option>
                <option value="Canada">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <button
            type="button"
            onClick={resetForm}
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 py-3 px-4 rounded-lg text-white font-medium transition-colors ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Adding...
              </div>
            ) : (
              "Add Café"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
