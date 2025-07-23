"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Doctor } from "@prisma/client";

export default function DoctorList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin");
    },
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctors");
        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        setError("Error fetching doctors");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-lg font-medium">
        Loading doctor profiles...
      </div>
    );
  }

  if (error) {
    return <div className="mt-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-primary">Doctors Directory</h1>
        <Link href="/doctor/add">
          <Button className="bg-green-600 text-white hover:bg-green-700">
            Add New Doctor
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-md">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Qualification</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Consultation Fee</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor.id} className="transition hover:bg-gray-50">
                <TableCell className="font-medium">
                  {doctor.firstName} {doctor.lastName}
                </TableCell>
                <TableCell>{doctor.specialization}</TableCell>
                <TableCell>{doctor.qualification}</TableCell>
                <TableCell>{doctor.experience} years</TableCell>
                <TableCell>{doctor.department}</TableCell>
                <TableCell>
                  <div>{doctor.email}</div>
                  <div className="text-sm text-muted-foreground">
                    {doctor.phone}
                  </div>
                </TableCell>
                <TableCell>
                  ₹{doctor.consultationFee.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link href={`/doctors/${doctor.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    <Link href={`/doctors/${doctor.id}/edit`}>
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
