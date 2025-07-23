"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIPatientSummary } from "./AIPatientSummary";
import { ConsultingDialog } from "./doctors-consultation";
import { useParams } from "next/navigation";

export default function ConsultPage() {
  const [patientData, setPatientData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const routeParams = useParams(); // ✅ grab the params from the URL
  const AppointmentId = routeParams?.id as string;

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`/api/patient/${AppointmentId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch patient data");
        }

        const data = await response.json();
        setPatientData(data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [AppointmentId]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!patientData) {
    return <p>No patient data found.</p>;
  }

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="grid gap-6">
        {/* Patient Basic Info */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{patientData.name}</CardTitle>
              <CardDescription>
                ID: {patientData.id} • {patientData.age} years •{" "}
                {patientData.gender}
              </CardDescription>
            </div>
            <Button
              onClick={() => {
                setIsDialogOpen(true);
              }}
            >
              Start Consultation
            </Button>
          </CardHeader>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList>
            <TabsTrigger value="summary">AI Summary</TabsTrigger>
            <TabsTrigger value="vitals">Recent Vitals</TabsTrigger>
            <TabsTrigger value="history">Visit History</TabsTrigger>
          </TabsList>

          {/* AI Summary Tab */}
          <TabsContent value="summary">
            <AIPatientSummary
              appointments={patientData.appointments}
              vitals={patientData.recentVitals}
              patientInfo={{
                id: patientData.id,
                name: patientData.name,
                age: patientData.age,
                gender: patientData.gender,
                lastVisit: patientData.lastVisit,
              }}
            />
          </TabsContent>

          {/* Vitals Tab */}
          <TabsContent value="vitals">
            <Card>
              <CardHeader>
                <CardTitle>Recent Vitals</CardTitle>
                <CardDescription>
                  Last recorded on {patientData.lastVisit}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Blood Pressure</p>
                    <p className="text-2xl">
                      {patientData.recentVitals.bloodPressure}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Heart Rate</p>
                    <p className="text-2xl">
                      {patientData.recentVitals.heartRate}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Temperature</p>
                    <p className="text-2xl">
                      {patientData.recentVitals.temperature}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">O2 Saturation</p>
                    <p className="text-2xl">
                      {patientData.recentVitals.oxygenSaturation}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Visit History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {patientData.appointments.map(
                    (appointment: any, index: number) => (
                      <div key={index} className="border-b pb-4 last:border-0">
                        <div className="mb-2 flex items-start justify-between">
                          <h4 className="font-medium">{appointment.date}</h4>
                          <span className="text-sm text-muted-foreground">
                            {appointment.reason}
                          </span>
                        </div>
                        <p className="mb-1 text-sm">
                          Diagnosis: {appointment.diagnosis}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Rx: {appointment.prescription}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Notes: {appointment.notes}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {isDialogOpen && (
        <ConsultingDialog
          appointmentId={patientData.appointments[0]?.id}
          open={isDialogOpen}
          onOpenChange={handleDialogClose}
        />
      )}
    </div>
  );
}
