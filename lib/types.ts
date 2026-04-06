export interface Appointment {
  id: number
  provider: string
  datetime: string
  repeat: "weekly" |"biweekly"| "monthly"| "quarterly"|"yearly"| "none"
  status?: "Scheduled" | "Completed" | "Cancelled" | "No Show"
}

export interface Prescription {
  id: number
  medication: string
  dosage: string
  quantity: number
  refill_on: string
  refill_schedule: "weekly" | "monthly" | "quarterly"
}

export interface User {
  id: number
  name: string
  email: string
  password: string
  appointments: Appointment[]
  prescriptions: Prescription[]
}

export interface Database {
  users: User[]
  medications: string[]
  dosages: string[]
}

export type AppointmentStatus = NonNullable<Appointment["status"]>
export type AppointmentRepeat = NonNullable<Appointment["repeat"]>
export type AppointmentProvider = NonNullable<Appointment["provider"]>
