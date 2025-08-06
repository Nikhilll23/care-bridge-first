import bcrypt from "bcryptjs";
import prisma from "../lib/db";

async function main() {
  try {
    // Create a test user
    const hashedPassword = await bcrypt.hash("password123", 12);
    
    const testUser = await prisma.user.upsert({
      where: { email: "test@automed.com" },
      update: {},
      create: {
        username: "testuser",
        email: "test@automed.com",
        password: hashedPassword,
        role: "USER",
      },
    });

    console.log("Test user created:", {
      id: testUser.id,
      username: testUser.username,
      email: testUser.email,
      role: testUser.role,
    });

    // Create an admin user
    const adminHashedPassword = await bcrypt.hash("admin123", 12);
    
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@automed.com" },
      update: {},
      create: {
        username: "admin",
        email: "admin@automed.com",
        password: adminHashedPassword,
        role: "ADMIN",
      },
    });

    console.log("Admin user created:", {
      id: adminUser.id,
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role,
    });

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
