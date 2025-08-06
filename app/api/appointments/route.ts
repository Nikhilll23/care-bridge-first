import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all appointments
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const appointments = await prisma.appointment.findMany({
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            specialization: true,
            department: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 },
    );
  }
}

// CREATE new appointment
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const appointmentDate = new Date(data.date);
    const [hours, minutes] = data.time.split(":");
    appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const appointment = await prisma.appointment.create({
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        date: appointmentDate,
        time: appointmentDate,
        status: data.status,
        type: data.type,
        duration: data.duration,
        bloodPressure: data.bloodPressure || null,
        heartRate: data.heartRate || null,
        Tempreture: data.temperature || null,
        O2Saturation: data.o2Saturation || null,
        symptoms: data.symptoms || null,
        diagnosis: data.diagnosis || null,
        prescription: data.prescription || null,
        notes: data.notes || null,
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 },
    );
  }
}
