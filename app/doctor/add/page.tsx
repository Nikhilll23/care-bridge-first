"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AddDoctorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialization: "",
    qualification: "",
    experience: "",
    designation: "",
    department: "",
    consultationFee: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          experience: Number(form.experience),
          consultationFee: parseFloat(form.consultationFee),
        }),
      });

      if (!res.ok) throw new Error("Failed to add doctor");

      router.push("/doctors");
    } catch {
      // Error handling could be added here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-primary">Add New Doctor</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2"
      >
        {[
          { name: "firstName", label: "First Name" },
          { name: "lastName", label: "Last Name" },
          { name: "email", label: "Email", type: "email" },
          { name: "phone", label: "Phone", type: "tel" },
          { name: "specialization", label: "Specialization" },
          { name: "qualification", label: "Qualification" },
          { name: "experience", label: "Experience (Years)", type: "number" },
          { name: "designation", label: "Designation" },
          { name: "department", label: "Department" },
          {
            name: "consultationFee",
            label: "Consultation Fee (₹)",
            type: "number",
          },
        ].map(({ name, label, type = "text" }) => (
          <div key={name}>
            <Label htmlFor={name}>{label}</Label>
            <Input
              id={name}
              name={name}
              type={type}
              value={form[name as keyof typeof form]}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>
        ))}

        <div className="flex justify-end pt-4 sm:col-span-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Doctor"}
          </Button>
        </div>
      </form>
    </div>
  );
}
