// src/app/doctors/[id]/page.tsx (Example Page)
import { DoctorProfileCard } from "./DoctorProfileCard"; // Adjust path
import { Decimal } from "@prisma/client/runtime/library"; // Or appropriate type
import { Doctor } from "@prisma/client";

// --- Mock Data ---
// In a real app, you would fetch this data based on the page params (e.g., using Prisma)
const mockDoctor: Doctor = {
  id: 1,
  firstName: "Alice",
  lastName: "Smith",
  email: "alice.smith@hospital.com",
  phone: "123-456-7890",
  specialization: "Cardiology",
  qualification: "MBBS, MD (Cardiology)",
  experience: 15,
  designation: "Senior Consultant",
  department: "Cardiology Department",
  consultationFee: 250.00, // Changed from Decimal to Float for SQLite
  isAvailable: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  // appointments: [] // Not used in the card directly
};


export default function DoctorDetailPage() {
  // In a real scenario, fetch doctor data based on params
  // const doctorData = await getDoctorById(params.id);

  return (
    <div className="container mx-auto space-y-8 p-4">
      <h1 className="mb-6 text-center text-3xl font-bold">Doctor Profiles</h1>

      {/* Example Usage 1 */}
      <DoctorProfileCard doctor={mockDoctor} />
    </div>
  );
}
