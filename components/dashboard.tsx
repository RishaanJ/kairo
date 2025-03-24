"use client"

import { useState, useEffect } from "react"
import Sidebar from "./sidebar"
import TopBar from "./top-bar"
import PatientList from "./patient-list"
import PatientDetail from "./patient-detail"
import AlertsPanel from "./alerts-panel"
import type { Patient, Alert } from "@/lib/types"
import { mockPatients, mockAlerts } from "@/lib/mock-data"

export default function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>(mockPatients)
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(mockPatients)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [showAlertsPanel, setShowAlertsPanel] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<string>("risk")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Handle patient selection
  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient)
  }

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredPatients(patients)
      return
    }

    const filtered = patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(query.toLowerCase()) ||
        patient.id.toString().includes(query) ||
        patient.roomNumber.toLowerCase().includes(query.toLowerCase()),
    )
    setFilteredPatients(filtered)
  }

  // Handle sorting
  const handleSort = (criteria: string) => {
    if (criteria === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(criteria)
      setSortOrder("desc")
    }
  }

  // Apply sorting
  useEffect(() => {
    const sorted = [...filteredPatients].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "risk":
          comparison = a.riskScore - b.riskScore
          break
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "room":
          comparison = a.roomNumber.localeCompare(b.roomNumber)
          break
        case "time":
          comparison = new Date(a.admittedAt).getTime() - new Date(b.admittedAt).getTime()
          break
        default:
          comparison = a.riskScore - b.riskScore
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    setFilteredPatients(sorted)
  }, [sortBy, sortOrder])

  // Fetch predictions for all patients
  const fetchPredictionsForAll = async () => {
    const updatedPatients = await Promise.all(
      patients.map(async (patient) => {
        try {
          const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subject_id: patient.id,
              los: patient.lengthOfStay,
              heart_rate: patient.vitals.heartRate,
              blood_pressure: patient.vitals.bloodPressure,
              oxygen_saturation: patient.vitals.oxygenSaturation,
            }),
          })

          if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`)
          }

          const data = await response.json()

          return {
            ...patient,
            prediction: data.prediction,
            riskScore: data.probability_of_deterioration * 100,
            classification: data.classification,
            riskTrend: Math.random() > 0.5 ? "up" : "down", // Simulated trend
          }
        } catch (error) {
          console.error(`Error fetching prediction for patient ${patient.id}:`, error)
          return patient
        }
      }),
    )

    setPatients(updatedPatients)
    setFilteredPatients(updatedPatients)
  }

  // Toggle alerts panel
  const toggleAlertsPanel = () => {
    setShowAlertsPanel(!showAlertsPanel)
  }

  // Mark alert as read
  const markAlertAsRead = (alertId: number) => {
    setAlerts(alerts.map((alert) => (alert.id === alertId ? { ...alert, read: true } : alert)))
  }

  // Get unread alerts count
  const unreadAlertsCount = alerts.filter((alert) => !alert.read).length

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar onSort={handleSort} sortBy={sortBy} sortOrder={sortOrder} />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <TopBar
          searchQuery={searchQuery}
          onSearch={handleSearch}
          unreadAlertsCount={unreadAlertsCount}
          onToggleAlerts={toggleAlertsPanel}
          onRefreshData={fetchPredictionsForAll}
        />

        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            {selectedPatient ? (
              <PatientDetail patient={selectedPatient} onBack={() => setSelectedPatient(null)} />
            ) : (
              <PatientList patients={filteredPatients} onSelectPatient={handlePatientSelect} />
            )}
          </div>

          {/* Alerts panel (conditionally rendered) */}
          {showAlertsPanel && (
            <div className="w-80 border-l border-gray-200 overflow-y-auto bg-white shadow-lg">
              <AlertsPanel alerts={alerts} onClose={toggleAlertsPanel} onMarkAsRead={markAlertAsRead} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

