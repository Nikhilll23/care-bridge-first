"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"; // Import Label
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Import Card components
import { z } from "zod"; // Import Zod for client-side validation (optional but recommended)

// Define the Zod schema for client-side validation (matches backend schema)
// This improves UX by catching errors before submitting
const clientPatientSchema = z.object({
  firstName: z.string().trim().min(1, { message: "First name is required" }),
  lastName: z.string().trim().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().trim().optional(), // Assuming phone is optional based on previous schema discussions
  dateOfBirth: z.string().optional(), // Keep as string for input type='date'
  gender: z.enum(["Male", "Female", "Other"], {
    errorMap: () => ({ message: "Gender is required" }), // Custom error message
  }),
  address: z.string().trim().optional(),
});

// Infer the TypeScript type from the schema
type PatientFormData = z.infer<typeof clientPatientSchema>;

const AddPatientPage = () => {
  const router = useRouter(); // Initialize router
  const [formData, setFormData] = useState<PatientFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "" as "Male" | "Female" | "Other", // Initialize with type assertion or default
    address: "",
  });
  const [errors, setErrors] = useState<z.ZodError<PatientFormData> | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Generic handler for most inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear errors when user starts typing in a field
    if (errors) {
      setErrors(null); // Clear Zod errors
    }
    setApiError(null); // Clear API errors
    setSuccessMessage(null); // Clear success message
  };

  // Specific handler for Select component (shadcn UI)
  const handleGenderChange = (value: "Male" | "Female" | "Other") => {
    setFormData((prev) => ({ ...prev, gender: value }));
    if (errors) {
      setErrors(null); // Clear Zod errors
    }
    setApiError(null); // Clear API errors
    setSuccessMessage(null); // Clear success message
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(null); // Clear previous errors
    setApiError(null);
    setSuccessMessage(null);

    // 1. Client-side validation
    const validationResult = clientPatientSchema.safeParse(formData);
    if (!validationResult.success) {
      setErrors(validationResult.error);
      console.log(
        "Client-side validation errors:",
        validationResult.error.flatten(),
      );
      return; // Stop submission if validation fails
    }

    setIsLoading(true); // Start loading state

    // 2. API Submission
    try {
      // Use validated data
      const response = await fetch("/api/patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validationResult.data), // Send validated data
      });

      const result = await response.json();

      if (!response.ok) {
        // Use message from API response if available, otherwise use default
        throw new Error(
          result.message || `Failed to add patient (${response.status})`,
        );
      }

      console.log("Patient added successfully:", result);
      setSuccessMessage("Patient added successfully! Redirecting to dashboard...");

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/patient'); // Redirect to patient dashboard
      }, 1500);
    } catch (error: any) {
      console.error("Error adding patient:", error);
      setApiError(error.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  // Helper to get Zod errors for a specific field path
  const getError = (path: (keyof PatientFormData)[]) => {
    return errors?.flatten().fieldErrors[path[0]]?.[0];
  };

  return (
    // Center the card on the page
<div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
<Card className="w-full max-w-3xl shadow-lg rounded-lg hover:shadow-xl transition-shadow">
        {" "}
        {/* Max width for the card */}
        <CardHeader>
<CardTitle className="text-2xl font-bold text-blue-600">Add New Patient</CardTitle>
          <CardDescription>
            Enter the patient's details below. Required fields are marked with
            *.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Grid layout for form fields */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="e.g., John"
                  value={formData.firstName}
                  onChange={handleChange}
                  aria-invalid={!!getError(["firstName"])}
                  aria-describedby="firstName-error"
                />
                {getError(["firstName"]) && (
                  <p id="firstName-error" className="text-sm text-red-600">
                    {getError(["firstName"])}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="e.g., Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  aria-invalid={!!getError(["lastName"])}
                  aria-describedby="lastName-error"
                />
                {getError(["lastName"]) && (
                  <p id="lastName-error" className="text-sm text-red-600">
                    {getError(["lastName"])}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="e.g., john.doe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={!!getError(["email"])}
                  aria-describedby="email-error"
                />
                {getError(["email"]) && (
                  <p id="email-error" className="text-sm text-red-600">
                    {getError(["email"])}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone </Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="e.g., +1234567890"
                  value={formData.phone || ""} // Ensure value is not null/undefined
                  onChange={handleChange}
                  aria-invalid={!!getError(["phone"])}
                  aria-describedby="phone-error"
                />
                {getError(["phone"]) && (
                  <p id="phone-error" className="text-sm text-red-600">
                    {getError(["phone"])}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth (Optional)</Label>
                <Input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth || ""}
                  onChange={handleChange}
                  aria-invalid={!!getError(["dateOfBirth"])}
                  aria-describedby="dateOfBirth-error"
                />
                {getError(["dateOfBirth"]) && (
                  <p id="dateOfBirth-error" className="text-sm text-red-600">
                    {getError(["dateOfBirth"])}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  name="gender" // Keep name for potential future generic handlers
                  value={formData.gender || ""} // Ensure controlled component
                  onValueChange={handleGenderChange} // Use specific handler
                  // required // Not needed when using Zod validation
                >
                  <SelectTrigger
                    id="gender"
                    aria-invalid={!!getError(["gender"])}
                    aria-describedby="gender-error"
                  >
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {getError(["gender"]) && (
                  <p id="gender-error" className="text-sm text-red-600">
                    {getError(["gender"])}
                  </p>
                )}
              </div>

              {/* Address - Spans full width */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address (Optional)</Label>
                <Input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="e.g., 123 Main St, Anytown"
                  value={formData.address || ""}
                  onChange={handleChange}
                  aria-invalid={!!getError(["address"])}
                  aria-describedby="address-error"
                />
                {getError(["address"]) && (
                  <p id="address-error" className="text-sm text-red-600">
                    {getError(["address"])}
                  </p>
                )}
              </div>
            </div>

            {/* API Error Message */}
            {apiError && (
              <p className="mt-4 text-center text-sm text-red-600">
                {apiError}
              </p>
            )}

            {/* Success Message */}
            {successMessage && (
              <p className="mt-4 text-center text-sm text-green-600">
                {successMessage}
              </p>
            )}
          </CardContent>
          <CardFooter>
<Button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors" disabled={isLoading}>
              {isLoading ? "Adding Patient..." : "Add Patient"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddPatientPage;
