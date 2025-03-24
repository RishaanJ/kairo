import type { Patient, Alert } from "./types"


// Generate mock patients
export const mockPatients: Patient[] = [
  {
    id: 1001,
    name: "John Smith",
    roomNumber: "ICU-101",
    admittedAt: "2023-03-15T08:30:00",
    lengthOfStay: 5,
    vitals: {
      heartRate: 85,
      bloodPressure: "125/85",
      oxygenSaturation: 98,
      temperature: 37.2,
    },
    riskScore: 75,
    riskTrend: "up",
    notes: [
      {
        text: "Patient showing signs of respiratory distress. Increased monitoring recommended.",
        timestamp: "2023-03-19T14:30:00",
      },
      {
        text: "Administered additional oxygen therapy. Will reassess in 2 hours.",
        timestamp: "2023-03-19T12:15:00",
      },
    ],
  },
  {
    id: 1002,
    name: "Sarah Johnson",
    roomNumber: "ICU-102",
    admittedAt: "2023-03-17T14:45:00",
    lengthOfStay: 3,
    vitals: {
      heartRate: 72,
      bloodPressure: "118/75",
      oxygenSaturation: 97,
      temperature: 36.8,
    },
    riskScore: 45,
    riskTrend: "down",
    notes: [
      {
        text: "Patient stable after surgery. Pain managed with current medication.",
        timestamp: "2023-03-19T10:00:00",
      },
    ],
  },
  {
    id: 1003,
    name: "John Green",
    roomNumber: "ICU-103",
    admittedAt: "2023-03-18T09:15:00",
    lengthOfStay: 2,
    vitals: {
      heartRate: 90,
      bloodPressure: "90",
      oxygenSaturation: 94,
      temperature: 37.5,
    },
    riskScore: 5,
    riskTrend: "up",
    notes: [],
  },
]

// Generate mock alerts
export const mockAlerts: Alert[] = [
  {
    id: 1,
    title: "Critical Risk Alert",
    message: "Patient's risk score has increased to critical levels. Immediate attention required.",
    severity: "critical",
    patientName: "John Smith",
    patientId: 1001,
    timestamp: "2023-03-19T15:30:00",
    read: false,
  },
  {
    id: 2,
    title: "Oxygen Saturation Warning",
    message: "Patient's oxygen saturation has dropped below 94%. Please check.",
    severity: "warning",
    patientName: "Robert Chen",
    patientId: 1003,
    timestamp: "2023-03-19T14:45:00",
    read: false,
  },
  {
    id: 3,
    title: "High Heart Rate Alert",
    message: "Patient's heart rate has been elevated for the past 2 hours.",
    severity: "warning",
    patientName: "Michael Wilson",
    patientId: 1005,
    timestamp: "2023-03-19T13:15:00",
    read: false,
  },
  {
    id: 4,
    title: "New Patient Admitted",
    message: "A new patient has been admitted to the ICU.",
    severity: "info",
    patientName: "Michael Wilson",
    patientId: 1005,
    timestamp: "2023-03-19T07:05:00",
    read: true,
  },
  {
    id: 5,
    title: "Medication Reminder",
    message: "Time for scheduled medication administration.",
    severity: "info",
    patientName: "Sarah Johnson",
    patientId: 1002,
    timestamp: "2023-03-19T12:00:00",
    read: true,
  },
]

