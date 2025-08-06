"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppointmentDialog } from "./components/addappoinetmentdialoge";
import { Patient } from "@prisma/client";
import { useRouter } from "next/navigation";

const PatientList = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSearchByPhoneNumber = async () => {
    setIsLoading(true);
    setError(null);
    setPatients([]);

    try {
      const response = await fetch(`/api/patient?phone=${searchQuery}`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      const data = await response.json();

      let foundPatients: Patient[] = [];
      if (data && data.patient) {
        if (Array.isArray(data.patient)) {
          foundPatients = data.patient;
        } else {
          foundPatients = [data.patient];
        }
      } else if (data && Array.isArray(data)) {
        foundPatients = data;
      }

      setPatients(foundPatients);
    } catch (err: any) {
      console.error("Error fetching patient by phone number:", err);
      setError(err.message || "Failed to fetch patient data.");
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAllPatients = async () => {
    setIsLoading(true);
    setError(null);
    setSearchQuery(""); // Clear search query when viewing all patients

    try {
      const response = await fetch(`/api/patient?all=true`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      const data = await response.json();
      const fetchedPatients: Patient[] = data.patient || [];
      setPatients(fetchedPatients);
    } catch (err: any) {
      console.error("Error fetching all patients:", err);
      setError(err.message || "Failed to fetch patients.");
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Clear the search state and refresh the page
      setSearchQuery("");
      setPatients([]);
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col justify-between px-4 py-6 sm:px-10">
      <div className="flex flex-col space-y-4 pb-8">
        {/* Search Section */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Input
            type="text"
            placeholder="Search For Patient By Phone Number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow"
          />
          <Button
            onClick={handleSearchByPhoneNumber}
            disabled={isLoading || !searchQuery.trim()}
          >
            {isLoading ? "Searching..." : "Find Patient"}
          </Button>
        </div>
        
        {/* View All Patients Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleViewAllPatients}
            disabled={isLoading}
            variant="outline"
            className="px-8"
          >
            {isLoading ? "Loading..." : "View All Patients"}
          </Button>
        </div>
      </div>

      <div className="pb-4">
        {isLoading && <p className="text-center">Loading patients...</p>}
        {error && <p className="text-center text-red-600">Error: {error}</p>}
        {!isLoading &&
          !error &&
          (patients.length > 0 ? (
            <div className="flex flex-col space-y-6">
              {patients.map((patient) => (
                <Card
                  key={patient.id}
                  className="w-full rounded-2xl border border-gray-200 shadow-md transition-shadow duration-300 hover:shadow-lg"
                >
                  <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-xl font-bold">
                      {patient.firstName} {patient.lastName} {"  -  "}
                      <span className="bg-grey-100 rounded-md px-2 py-1">
                        {patient.gender || "N/A"}
                      </span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <p>
                      <strong>Phone:</strong> {patient.phone || "N/A"}
                    </p>
                    <p>
                      <strong>Email:</strong> {patient.email || "N/A"}
                    </p>
                    <p>
                      <strong>Age:</strong> {patient.age ?? "N/A"}
                    </p>
                    <p>
                      <strong>Blood Group:</strong>{" "}
                      {patient.bloodGroup || "N/A"}
                    </p>
                    <p className="sm:col-span-2">
                      <strong>Address:</strong> {patient.address || "N/A"}
                    </p>
                  </CardContent>

                  <CardFooter className="mt-2">
                    <Button
                      className="w-full"
                      onClick={() => {
                        setSelectedPatient(patient);
                        setIsDialogOpen(true);
                      }}
                    >
                      Add Appointment
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              {searchQuery
                ? "No patients found matching that phone number."
                : "Enter a phone number to search."}
            </p>
          ))}
      </div>

      {selectedPatient && (
        <AppointmentDialog
          patient={selectedPatient}
          open={isDialogOpen}
          onOpenChange={handleDialogClose}
        />
      )}
    </div>
  );
};

export default PatientList;
