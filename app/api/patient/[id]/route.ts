// File: app/api/appointment/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    // Validate and parse the appointment ID
    const appointmentId = parseInt(resolvedParams.id, 10);
    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { error: "Invalid appointment ID format" },
        { status: 400 },
      );
    }

    // Fetch the appointment to get the patient ID
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      select: { patientId: true },
    });

    if (!appointment || !appointment.patientId) {
      return NextResponse.json(
        { error: "Appointment or related patient not found" },
        { status: 404 },
      );
    }

    const patientId = appointment.patientId;

    // Fetch patient details
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        appointments: {
          orderBy: { date: "desc" }, // Fetch appointments in descending order
        },
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Fetch the most recent appointment for vitals
    const recentAppointment = await prisma.appointment.findFirst({
      where: { patientId },
      orderBy: { date: "desc" }, // Get the latest appointment
    });

    const recentVitals = recentAppointment
      ? {
          bloodPressure: recentAppointment.bloodPressure || "N/A",
          heartRate: recentAppointment.heartRate || "N/A",
          temperature: recentAppointment.Tempreture || "N/A",
          oxygenSaturation: recentAppointment.O2Saturation || "N/A",
        }
      : {
          bloodPressure: "N/A",
          heartRate: "N/A",
          temperature: "N/A",
          oxygenSaturation: "N/A",
        };

    const response = {
      id: patient.id,
      name: `${patient.firstName} ${patient.lastName}`,
      age: patient.age,
      gender: patient.gender,
      lastVisit: patient.appointments[0]?.date || "N/A",
      recentVitals,
      appointments: patient.appointments.map((appointment) => ({
        date: appointment.date,
        reason: appointment.symptoms || "N/A",
        diagnosis: appointment.diagnosis || "N/A",
        prescription: appointment.prescription || "N/A",
        notes: appointment.notes || "N/A",
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching patient data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
