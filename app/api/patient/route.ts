import prisma from "@/lib/db"; // Ensure this points to your Prisma client
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const phone = searchParams.get("phone");
    const all = searchParams.get("all");

    let patients;

    if (all === "true") {
      // Fetch all patients
      patients = await prisma.patient.findMany({
        orderBy: {
          createdAt: 'desc', // Show newest patients first
        },
      });
    } else if (phone) {
      // Fetch patient by phone number
      patients = await prisma.patient.findMany({
        where: {
          phone,
        },
      });
    } else {
      return NextResponse.json(
        { error: "Phone number is required or use ?all=true to fetch all patients" },
        { status: 400 },
      );
    }

    if (!patients || patients.length === 0) {
      return NextResponse.json({ error: "No patients found" }, { status: 404 });
    }

    // Return the patients as JSON
    return NextResponse.json({ patient: patients });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// Define the schema for patient data validation
const patientSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(), // Accept date as a string
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Gender is required",
  }),
  address: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const patientData = patientSchema.parse(body);

    // Convert dateOfBirth to a Date object if provided
    const parsedDateOfBirth = patientData.dateOfBirth
      ? new Date(patientData.dateOfBirth)
      : null;

    // Check if the date conversion was successful
    if (parsedDateOfBirth && isNaN(parsedDateOfBirth.getTime())) {
      throw new Error("Invalid date format for dateOfBirth");
    }

    // Create a new patient record in the database
    const newPatient = await prisma.patient.create({
      data: {
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        email: patientData.email,
        phone: patientData.phone || null,
        dateOfBirth: parsedDateOfBirth,
        gender: patientData.gender,
        address: patientData.address || null,
      },
    });
    console.log("Patient created:", newPatient);

    return NextResponse.json(
      { patient: newPatient, message: "Patient created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating patient:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
