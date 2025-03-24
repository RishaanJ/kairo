"use client"

import { useEffect, useState } from "react"
import { ArrowDown, ArrowUp } from "lucide-react"
import type { Patient } from "@/lib/types"
import { db, doc, getDoc } from "./firebase";

interface PatientListProps {
  patients: Patient[]
  onSelectPatient: (patient: Patient) => void
}

export default function PatientList({ patients, onSelectPatient }: PatientListProps) {
  // State to store risk scores for patients
  const [riskScores, setRiskScores] = useState<Map<number, number | null>>(new Map());

  // Function to determine risk level color
  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 70) return "bg-red-100 text-red-800"
    if (riskScore >= 40) return "bg-yellow-100 text-yellow-800"
    return "bg-green-100 text-green-800"
  }

  // Function to determine risk level text
  const getRiskText = (riskScore: number) => {
    if (riskScore >= 70) return "High"
    if (riskScore >= 40) return "Medium"
    return "Low"
  }

  // Function to fetch risk score and handle ID as an integer
  const getRiskScore = async (id: number) => {
    const patientDocRef = doc(db, 'patients', String(id)); // Convert id to string

    try {
      const docSnap = await getDoc(patientDocRef);  // Fetch the document
      if (docSnap.exists()) {
        const patient = docSnap.data();
        return patient.risk_score;  // Return the 'riskScore' field
      } else {
        console.error("Patient not found");
        return null;  // Handle case where patient document does not exist
      }
    } catch (err) {
      console.error("Error fetching patient:", err);
      return null;  // Handle any other errors
    }
  };

  // Use effect to fetch and store the risk scores
  useEffect(() => {
    const fetchRiskScores = async () => {
      const newRiskScores = new Map();
      for (const patient of patients) {
        const score = await getRiskScore(patient.id);
        newRiskScores.set(patient.id, score);
      }
      setRiskScores(newRiskScores);
    };

    fetchRiskScores();
  }, [patients]);

  return (
    <div> 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient) => (
          <div
            key={patient.id}
            onClick={() => onSelectPatient(patient)}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{patient.name}</h2>
                  <p className="text-sm text-gray-500">
                    ID: {patient.id} • Room: {patient.roomNumber}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(riskScores.get(patient.id) || 0)}`}>
                  {/* Use stored risk score */}
                  {getRiskText(riskScores.get(patient.id) || 0)}
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between mb-3">
                <div className="text-sm font-medium text-gray-500">Risk Score</div>
                <div className="flex items-center">
                  <span className="text-lg font-bold text-gray-800 mr-1">{(riskScores.get(patient.id) || 0).toFixed(1)}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Heart Rate:</span>
                  <span className="font-medium text-gray-800">{patient.vitals.heartRate} bpm</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Blood Pressure:</span>
                  <span className="font-medium text-gray-800">{patient.vitals.bloodPressure} mmHg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">O₂ Saturation:</span>
                  <span className="font-medium text-gray-800">{patient.vitals.oxygenSaturation}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Temperature:</span>
                  <span className="font-medium text-gray-800">{patient.vitals.temperature}°C</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Admitted:</span>
                <span className="text-gray-700">{new Date(patient.admittedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Length of Stay:</span>
                <span className="text-gray-700">{patient.lengthOfStay} days</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
