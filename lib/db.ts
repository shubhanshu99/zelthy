import { promises as fs } from "fs"
import path from "path"
import type { Database, User, Appointment, Prescription } from "./types"
import { seedData } from "./seed-data"

const DB_PATH = path.join(process.cwd(), "data", "db.json") // database path

async function ensureDataDir(): Promise<void> {
  const dataDir = path.dirname(DB_PATH)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

async function readDatabase(): Promise<Database> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(DB_PATH, "utf-8")
    const parsed = JSON.parse(data) as Database
    // Validate that it has the expected structure
    if (!parsed.users || !Array.isArray(parsed.users)) {
      // Invalid structure, reseed
      await writeDatabase(seedData)
      return seedData
    }
    return parsed
  } catch {
    // If file doesn't exist or is invalid, seed with initial data
    await writeDatabase(seedData)
    return seedData
  }
}

async function writeDatabase(data: Database): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8")
}

// User operations
export async function createUser(
  name: string,
  email: string,
  password: string
): Promise<User> {
  const db = await readDatabase()

  // Check for existing user with same email
  if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("User with this email already exists")
  }

  const newUser: User = {
    id: db.users.length > 0 ? Math.max(...db.users.map((u) => u.id)) + 1 : 1,
    name,
    email,
    password,
    appointments: [],
    prescriptions: [],
  }
  db.users.push(newUser)
  await writeDatabase(db)
  return newUser
}

export async function  updateUser(userId: number, updates: Partial<Pick<User, "name" | "email" | "password">>): Promise<User | null> {
  const db = await readDatabase()
  const userIndex = db.users.findIndex((u) => u.id === userId)
  if (userIndex === -1) return null

  db.users[userIndex] = { ...db.users[userIndex], ...updates }
  await writeDatabase(db)
  return db.users[userIndex]
} 

export async function getAllUsers(): Promise<User[]> {
  const db = await readDatabase()
  return db.users || []
}

export async function getUserById(id: number): Promise<User | null> {
  const db = await readDatabase()
  return db.users.find((u) => u.id === id) || null
}

export async function getUserByCredentials(
  email: string,
  password: string
): Promise<User | null> {
  const db = await readDatabase()
  return (
    db.users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
    ) || null
  )
}

// Appointment operations
export async function getAppointmentsByUserId(
  userId: number
): Promise<Appointment[]> {
  const user = await getUserById(userId)
  return user?.appointments || []
}

export async function updateAppointment(
  userId: number,
  appointmentId: number,
  updates: Partial<Pick<Appointment,"status" | "repeat">>
): Promise<Appointment | null> {
  const db = await readDatabase()
  const userIndex = db.users.findIndex((u) => u.id === userId)
  if (userIndex === -1) return null

  const appointmentIndex = db.users[userIndex].appointments.findIndex(
    (a) => a.id === appointmentId
  )
  if (appointmentIndex === -1) return null

  db.users[userIndex].appointments[appointmentIndex] = {
    ...db.users[userIndex].appointments[appointmentIndex],
    ...updates,
  }
  await writeDatabase(db)
  return db.users[userIndex].appointments[appointmentIndex]
}

export async function createAppointment(
  userId: number,
  appointment: Omit<Appointment, "id">
): Promise<Appointment | null> {
  const db = await readDatabase()
  const userIndex = db.users.findIndex((u) => u.id === userId)
  if (userIndex === -1) return null

  // Generate new ID based on all appointments across all users
  const allAppointmentIds = db.users.flatMap((u) =>
    u.appointments.map((a) => a.id)
  )
  const newId = Math.max(...allAppointmentIds, 0) + 1

  const newAppointment: Appointment = { id: newId, ...appointment }
  db.users[userIndex].appointments.push(newAppointment)
  await writeDatabase(db)
  return newAppointment
}
export async function deleteAppointment(
  userId: number,
  appointmentId: number
): Promise<boolean> {
  const db = await readDatabase()
  const userIndex = db.users.findIndex((u) => u.id === userId)
  if (userIndex === -1) return false

  const appointmentIndex = db.users[userIndex].appointments.findIndex(
    (a) => a.id === appointmentId
  )
  if (appointmentIndex === -1) return false

  db.users[userIndex].appointments.splice(appointmentIndex, 1)
  await writeDatabase(db)
  return true
}

// Prescription operations
export async function getPrescriptionsByUserId(
  userId: number
): Promise<Prescription[]> {
  const user = await getUserById(userId)
  return user?.prescriptions || []
}

export async function createPrescription(
  userId: number,
  prescription: Omit<Prescription, "id">
): Promise<Prescription | null> {
  const db = await readDatabase()
  const userIndex = db.users.findIndex((u) => u.id === userId)
  if (userIndex === -1) return null

  // Generate new ID based on all prescriptions across all users
  const allPrescriptionIds = db.users.flatMap((u) =>
    u.prescriptions.map((p) => p.id)
  )
  const newId = Math.max(...allPrescriptionIds, 0) + 1

  const newPrescription: Prescription = { id: newId, ...prescription }
  db.users[userIndex].prescriptions.push(newPrescription)
  await writeDatabase(db)
  return newPrescription
}
export async function deletePrescription(
  userId: number,
  prescriptionId: number
): Promise<boolean> {
  const db = await readDatabase()
  const userIndex = db.users.findIndex((u) => u.id === userId)
  if (userIndex === -1) return false

  const prescriptionIndex = db.users[userIndex].prescriptions.findIndex(
    (p) => p.id === prescriptionId
  )
  if (prescriptionIndex === -1) return false

  db.users[userIndex].prescriptions.splice(prescriptionIndex, 1)
  await writeDatabase(db)
  return true
}
export async function updatePrescription(
  userId: number,
  prescriptionId: number,
  updates: Partial<Pick<Prescription, "medication" | "dosage" | "quantity" | "refill_on" | "refill_schedule">>
): Promise<Prescription | null> {
  const db = await readDatabase()
  const userIndex = db.users.findIndex((u) => u.id === userId)
  if (userIndex === -1) return null

  const prescriptionIndex = db.users[userIndex].prescriptions.findIndex(
    (p) => p.id === prescriptionId
  )
  if (prescriptionIndex === -1) return null

  db.users[userIndex].prescriptions[prescriptionIndex] = {
    ...db.users[userIndex].prescriptions[prescriptionIndex],
    ...updates,
  }
  await writeDatabase(db)
  return db.users[userIndex].prescriptions[prescriptionIndex]
} 

// Get medications and dosages lists
export async function getMedications(): Promise<string[]> {
  const db = await readDatabase()
  return db.medications
}

export async function getDosages(): Promise<string[]> {
  const db = await readDatabase()
  return db.dosages
}
