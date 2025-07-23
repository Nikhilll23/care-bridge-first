import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// UPDATE appointment by ID (PUT)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const appointmentId = parseInt(resolvedParams.id);
    if (isNaN(appointmentId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const data = await request.json();

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        symptoms: data.symptoms || null,
        diagnosis: data.diagnosis || null,
        prescription: data.prescription || null,
        notes: data.notes || null,
        status: "Completed", // Assuming you want to set the status to completed
      },
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 },
    );
  }
}
