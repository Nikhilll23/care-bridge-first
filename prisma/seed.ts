import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create test user
  const hashedPassword = await bcrypt.hash('123456', 10)
  
  let testUser;
  try {
    testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        username: 'testuser',
        password: hashedPassword,
        role: 'USER',
      },
    });
  } catch (error) {
    console.log('Test user already exists, finding existing user...');
    testUser = await prisma.user.findUnique({ where: { email: 'test@example.com' } });
  }

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  
  let adminUser;
  try {
    adminUser = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        username: 'admin',
        password: adminPassword,
        role: 'ADMIN',
      },
    });
  } catch (error) {
    console.log('Admin user already exists, finding existing user...');
    adminUser = await prisma.user.findUnique({ where: { email: 'admin@example.com' } });
  }

  // Create test doctor
  const doctorPassword = await bcrypt.hash('doctor123', 10)
  
  let doctorUser;
  try {
    doctorUser = await prisma.user.upsert({
      where: { email: 'doctor@example.com' },
      update: {},
      create: {
        email: 'doctor@example.com',
        username: 'doctor',
        password: doctorPassword,
        role: 'DOCTOR',
      },
    });
  } catch (error) {
    console.log('Doctor user already exists, finding existing user...');
    doctorUser = await prisma.user.findUnique({ where: { email: 'doctor@example.com' } });
  }

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

  // Create test appointments
  const testAppointment1 = await prisma.appointment.upsert({
    where: { id: 1 },
    update: {},
    create: {
      patientId: testPatient.id,
      doctorId: doctorProfile.id,
      date: new Date('2024-08-05'),
      time: new Date('2024-08-05T10:00:00'),
      status: 'completed',
      type: 'regular',
      duration: 30,
      bloodPressure: '120/80',
      heartRate: '72 bpm',
      Tempreture: '98.6°F',
      O2Saturation: '98%',
      symptoms: 'Chest pain, shortness of breath',
      diagnosis: 'Hypertension',
      prescription: 'Lisinopril 10mg daily',
      notes: 'Patient advised to monitor blood pressure daily',
    },
  })

  const testAppointment2 = await prisma.appointment.upsert({
    where: { id: 2 },
    update: {},
    create: {
      patientId: testPatient.id,
      doctorId: doctorProfile.id,
      date: new Date('2024-08-04'),
      time: new Date('2024-08-04T14:00:00'),
      status: 'scheduled',
      type: 'followup',
      duration: 20,
      bloodPressure: '118/75',
      heartRate: '70 bpm',
      Tempreture: '98.4°F',
      O2Saturation: '99%',
      symptoms: 'Follow-up for hypertension',
      diagnosis: 'Stable hypertension',
      prescription: 'Continue Lisinopril 10mg daily',
      notes: 'Blood pressure well controlled',
    },
  })

  console.log('✅ Seed data created successfully!')
  console.log('Test accounts:')
  console.log('User: test@example.com / 123456')
  console.log('Admin: admin@example.com / admin123')  
  console.log('Doctor: doctor@example.com / doctor123')
  console.log('Created test appointments with IDs:', testAppointment1.id, testAppointment2.id)
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
