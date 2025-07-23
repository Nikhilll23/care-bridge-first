import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: {
        firstName: "asc",
      },
    });

    return NextResponse.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { error: "Error fetching doctors" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      specialization,
      qualification,
      experience,
      designation,
      department,
      consultationFee,
    } = body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !specialization ||
      !qualification ||
      !designation ||
      !department ||
      consultationFee === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 },
      );
    }

    // Hashing the default password before storing
    const defaultPassword = "123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        username: email,
        password: hashedPassword,
        role: "DOCTOR",
      },
    });

    const newDoctor = await prisma.doctor.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        specialization,
        qualification,
        experience: experience ? Number(experience) : null,
        designation,
        department,
        consultationFee: parseFloat(consultationFee),
      },
    });

    return NextResponse.json(
      { doctor: newDoctor, user: newUser },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating doctor and user:", error);
    return NextResponse.json(
      { error: "Error creating doctor and user" },
      { status: 500 },
    );
  }
}
