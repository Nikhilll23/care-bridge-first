import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password must be at most 100 characters long" }),
  // Ensure role is a string if present, or defaults later
  role: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Parse the body with Zod schema, which will throw if validation fails
    const { email, username, password, role } = userSchema.parse(body);

    // Check if email already exists
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 409 }, // 409 Conflict for existing resource
      );
    }

    // Check if username already exists (assuming username is also unique)
    const existingUserByUsername = await prisma.user.findUnique({
      where: { username: username },
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        { message: "Username is already taken." },
        { status: 409 }, // 409 Conflict for existing resource
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        // Ensure role is always defined, defaulting to 'USER' if not provided or valid
        role: role || "USER",
      },
    });

    // Destructure password to avoid sending it to the client in the response
    const { password: _, ...user } = newUser;

    return NextResponse.json(
      { user: user, message: "User created successfully" },
      { status: 201 }, // 201 Created for successful resource creation
    );
  } catch (error: any) {
    // Explicitly typing 'error' as 'any' for comprehensive logging
    console.error("--- Backend Error (User Creation) ---");
    console.error("Error object:", error);
    console.error("Error message:", error.message);
    if (error.stack) console.error("Error stack:", error.stack);

    // Handle Zod validation errors specifically
    if (error instanceof z.ZodError) {
      // Check if it's a ZodError instance
      console.error("Zod Validation Issues:", error.issues);
      return NextResponse.json(
        { message: "Validation failed", errors: error.issues },
        { status: 400 }, // 400 Bad Request for client-side input errors
      );
    }

    // Handle Prisma unique constraint errors (e.g., P2002 for unique constraint violations)
    // This is a fallback if the above existingUser checks somehow miss a concurrent creation
    if (
      error.code &&
      typeof error.code === "string" &&
      error.code.startsWith("P")
    ) {
      console.error("Prisma Error Code:", error.code);
      if (error.meta) console.error("Prisma Error Meta:", error.meta);
      if (error.code === "P2002") {
        const target = Array.isArray(error.meta?.target)
          ? error.meta.target.join(", ")
          : error.meta?.target || "unknown field";
        return NextResponse.json(
          { message: `Duplicate entry for ${target}.` },
          { status: 409 }, // 409 Conflict
        );
      }
    }

    // Generic internal server error for all other unhandled exceptions
    console.error("--- End of Backend Error ---");
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
