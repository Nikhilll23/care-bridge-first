"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Building2, Stethoscope } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Doctor } from "@prisma/client";

interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  date: string;
  time: string;
  status: string;
  type: string;
  duration: number;
  diagnosis: string;
  patient: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export default function DoctorTimeline() {
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [doctorInfo, setDoctorInfo] = useState<Doctor | null>(null);

  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchDoctorInfoAndAppointments = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          // Fetch doctor info
          const doctorResponse = await fetch("/api/doctors/current", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: session.user.email }),
          });

          if (!doctorResponse.ok) {
            console.error(`Doctor API Error: ${doctorResponse.status} - ${doctorResponse.statusText}`);
            const errorData = await doctorResponse.text();
            console.error('Error Response:', errorData);
            throw new Error(`Failed to fetch doctor info: ${doctorResponse.status}`);
          }

          const doctorInfo = await doctorResponse.json();
          console.log('Doctor Info:', doctorInfo);
          setDoctorInfo(doctorInfo);

          // Fetch appointments for the doctor
          const appointmentsResponse = await fetch(
            `/api/doctors/current?doctorId=${doctorInfo.id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          if (!appointmentsResponse.ok) {
            throw new Error("Failed to fetch appointments");
          }

          const appointments = await appointmentsResponse.json();

          // Filter appointments into today's and upcoming
          const today = new Date().toISOString().split("T")[0];
          const filtered = appointments.reduce(
            (
              acc: { today: Appointment[]; upcoming: Appointment[] },
              appointment: Appointment,
            ) => {
              const appointmentDate = new Date(`${appointment.time}`)
                .toISOString()
                .split("T")[0];
              if (appointmentDate === today) {
                acc.today.push(appointment);
              } else {
                acc.upcoming.push(appointment);
              }
              return acc;
            },
            { today: [], upcoming: [] },
          );

          setTodayAppointments(filtered.today);
        } catch (error) {
          console.error("Error fetching doctor info or appointments:", error);
        }
      }
    };

    fetchDoctorInfoAndAppointments();
  }, [session, status]);

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {appointment.patient.firstName} {appointment.patient.lastName}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {new Date(`${appointment.date}`).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <Calendar className="ml-2 h-4 w-4" />
              <span>
                {new Date(`${appointment.date}`).toLocaleDateString()}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {appointment.diagnosis}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`rounded-full px-2 py-1 text-xs ${
                appointment.type === "emergency"
                  ? "bg-red-100 text-red-800"
                  : appointment.type === "follow-up"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
              }`}
            >
              {appointment.type}
            </span>
            <Link href={`/doctor/${appointment.id}/consult`}>
              <Button size="sm">Consult</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      {/* Doctor Information Card */}
      <Card className="mb-6">
        <CardContent className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-3">
          {/* Doctor Basic Info */}
          <div className="flex items-start space-x-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Stethoscope className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                {doctorInfo?.firstName} {doctorInfo?.lastName}
              </h2>
              <p className="text-sm text-muted-foreground">
                {doctorInfo?.designation}
              </p>
              <p className="text-sm text-muted-foreground">
                {doctorInfo?.department}
              </p>
            </div>
          </div>

          {/* Location Info */}
          <div className="flex items-start space-x-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Location</h3>
              <p className="text-sm text-muted-foreground">
                {doctorInfo?.phone}
              </p>
              <p className="text-sm text-muted-foreground">
                Working Hours: {doctorInfo?.experience}
              </p>
            </div>
          </div>

          {/* Current Status */}
          <div className="flex items-start space-x-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Current Status</h3>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                  doctorInfo?.isAvailable
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {doctorInfo?.isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Appointments Section */}
      <div className="grid gap-6">
        {/* Today's Appointments */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {todayAppointments.length === 0 ? (
                <p className="text-muted-foreground">
                  No appointments scheduled for today
                </p>
              ) : (
                todayAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

