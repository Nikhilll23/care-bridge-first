import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create test user
  const hashedPassword = await bcrypt.hash('123456', 10)
  
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      username: 'testuser',
      password: hashedPassword,
      role: 'USER',
    },
  })

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create test doctor
  const doctorPassword = await bcrypt.hash('doctor123', 10)
  
  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor@example.com' },
    update: {},
    create: {
      email: 'doctor@example.com',
      username: 'doctor',
      password: doctorPassword,
      role: 'DOCTOR',
    },
  })

  // Create doctor profile
  const doctorProfile = await prisma.doctor.upsert({
    where: { email: 'doctor@example.com' },
    update: {},
    create: {
      firstName: 'Dr. John',
      lastName: 'Smith',
      email: 'doctor@example.com',
      phone: '+1234567890',
      specialization: 'Cardiology',
      qualification: 'MBBS, MD',
      experience: 10,
      designation: 'Senior Consultant',
      department: 'Cardiology',
      consultationFee: 500.0,
      isAvailable: true,
    },
  })

  // Create test patient
  const testPatient = await prisma.patient.upsert({
    where: { email: 'patient@example.com' },
    update: {},
    create: {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'patient@example.com',
      phone: '+1234567891',
      age: 30,
      gender: 'Female',
      address: '123 Main St, City, State',
      bloodGroup: 'A+',
    },
  })

  console.log('✅ Seed data created successfully!')
  console.log('Test accounts:')
  console.log('User: test@example.com / 123456')
  console.log('Admin: admin@example.com / admin123')  
  console.log('Doctor: doctor@example.com / doctor123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
