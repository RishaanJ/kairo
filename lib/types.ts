export interface Vitals {
  heartRate: number
  bloodPressure: string
  oxygenSaturation: number
  temperature: number
}

export interface Patient {
  id: number
  name: string
  roomNumber: string
  admittedAt: string
  lengthOfStay: number
  vitals: Vitals
  riskScore: number
  riskTrend: "up" | "down"
  prediction?: number
  classification?: string
  notes?: { text: string; timestamp: string }[]
}

export interface Alert {
  id: number
  title: string
  message: string
  severity: "critical" | "warning" | "info"
  patientName: string
  patientId: number
  timestamp: string
  read: boolean
}

