// scripts/seed-doctors.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedDoctors() {
  try {
    console.log('Starting to seed doctors...');

    // Sample doctors data
    const doctors = [
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@hospital.com',
        phone: '+1-555-0101',
        specialization: 'Cardiology',
        qualification: 'MBBS, MD (Cardiology)',
        experience: 15,
        designation: 'Senior Consultant',
        department: 'Cardiology Department',
        consultationFee: 250.00,
        isAvailable: true,
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@hospital.com',
        phone: '+1-555-0102',
        specialization: 'Neurology',
        qualification: 'MBBS, MD (Neurology)',
        experience: 12,
        designation: 'Consultant',
        department: 'Neurology Department',
        consultationFee: 300.00,
        isAvailable: true,
      },
      {
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.brown@hospital.com',
        phone: '+1-555-0103',
        specialization: 'Orthopedics',
        qualification: 'MBBS, MS (Orthopedics)',
        experience: 18,
        designation: 'Head of Department',
        department: 'Orthopedics Department',
        consultationFee: 350.00,
        isAvailable: true,
      },
      {
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@hospital.com',
        phone: '+1-555-0104',
        specialization: 'Pediatrics',
        qualification: 'MBBS, MD (Pediatrics)',
        experience: 10,
        designation: 'Senior Consultant',
        department: 'Pediatrics Department',
        consultationFee: 200.00,
        isAvailable: true,
      },
    ];

    // Create corresponding users for each doctor
    const defaultPassword = '123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    for (const doctorData of doctors) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: doctorData.email }
      });

      // Check if doctor already exists
      const existingDoctor = await prisma.doctor.findUnique({
        where: { email: doctorData.email }
      });

      if (!existingUser) {
        // Create user account
        await prisma.user.create({
          data: {
            email: doctorData.email,
            username: doctorData.email,
            password: hashedPassword,
            role: 'DOCTOR',
          },
        });
        console.log(`Created user account for ${doctorData.firstName} ${doctorData.lastName}`);
      } else {
        console.log(`User account already exists for ${doctorData.email}`);
      }

      if (!existingDoctor) {
        // Create doctor profile
        await prisma.doctor.create({
          data: doctorData,
        });
        console.log(`Created doctor profile for ${doctorData.firstName} ${doctorData.lastName}`);
      } else {
        console.log(`Doctor profile already exists for ${doctorData.email}`);
      }
    }

    console.log('✅ Successfully seeded doctors!');
    console.log('\nTest credentials:');
    console.log('Email: john.smith@hospital.com');
    console.log('Password: 123');
    console.log('\nOr any of the other doctor emails with password: 123');

  } catch (error) {
    console.error('❌ Error seeding doctors:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDoctors();
