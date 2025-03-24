"use client"

import { useEffect, useState, useRef} from "react"
import { ArrowLeft, ChevronDown, ChevronUp, AlertCircle, Phone, CheckCircle, MessageSquarePlus } from "lucide-react"
import type { Patient } from "@/lib/types"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { db, setDoc, doc, serverTimestamp } from "./firebase";
import { RefreshCw} from "lucide-react"


interface PatientDetailProps {
  patient: Patient
  onBack: () => void
}

export default function PatientDetail({ patient, onBack }: PatientDetailProps) {
  const [note, setNote] = useState("")
  const [notes, setNotes] = useState<{ text: string; timestamp: string }[]>(patient.notes || [])
  const [showRiskFactors, setShowRiskFactors] = useState(true)
  const [riskScore, setRiskScore] = useState(0)
  const hasFetchedData = useRef(false);

  // Generate mock data for charts
  const generateTimeSeriesData = (hours: number, baseValue: number, variance: number) => {
    return Array.from({ length: hours }, (_, i) => {
      const time = new Date()
      time.setHours(time.getHours() - (hours - i - 1))

      // Create some variation in the data
      const value = baseValue + (Math.random() * variance * 2 - variance)

      return {
        time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        value: Math.round(value * 10) / 10,
      }
    })
  }

  // Generate risk timeline data
  const riskTimelineData = generateTimeSeriesData(24, patient.riskScore / 100, 0.15)

  // Generate vitals data
  const heartRateData = generateTimeSeriesData(24, patient.vitals.heartRate, 10)
  const bloodPressureData = generateTimeSeriesData(24, Number.parseInt(patient.vitals.bloodPressure.split("/")[0]), 15)
  const oxygenData = generateTimeSeriesData(24, patient.vitals.oxygenSaturation, 3)
  const temperatureData = generateTimeSeriesData(24, patient.vitals.temperature, 0.5)
  

  // Add a note
  const handleAddNote = () => {
    if (note.trim()) {
      const newNote = {
        text: note,
        timestamp: new Date().toLocaleString(),
      }
      setNotes([newNote, ...notes])
      setNote("")
    }
  }

  const refData = async () => {

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
          blood_pressure: parseInt(patient.vitals.bloodPressure),
          oxygen_saturation: patient.vitals.oxygenSaturation,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Response from Flask:", data);
  
      // Check if the 'risk_score' exists in the response
      if (data.risk_score !== undefined) {
        setRiskScore(data.risk_score); // Update the risk score state
        console.log(patient.id)
        const patientRef = doc(db, "patients", String(patient.id)); // Document ID is patient.id
        await setDoc(patientRef, {
          risk_score: data.risk_score,
          heart_rate: patient.vitals.heartRate,
          blood_pressure: parseInt(patient.vitals.bloodPressure),
          oxygen_saturation: patient.vitals.oxygenSaturation,
          length_of_stay: patient.lengthOfStay,
        });
        
      } else {
        console.error("Unexpected response data:", data);
      }
    } catch (error) {
      // Handle any errors that occur during the fetch or data processing
      console.error("Error fetching prediction:", error);
    }
  };
  
  
  

  

  // Risk factors that might contribute to deterioration
  const riskFactors = [
    {
      factor: "Elevated Heart Rate",
      impact: "High",
      description: "Heart rate has been consistently above normal range for the past 6 hours.",
    },
    {
      factor: "Decreasing Oxygen Saturation",
      impact: "Medium",
      description: "Oxygen levels have shown a slight downward trend over the past 12 hours.",
    },
    {
      factor: "Length of ICU Stay",
      impact: "Medium",
      description: "Extended ICU stays correlate with increased risk of complications.",
    },
    {
      factor: "Blood Pressure Fluctuations",
      impact: "Low",
      description: "Minor fluctuations in blood pressure have been observed.",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{patient.name}</h1>
          <p className="text-sm text-gray-500">
            ID: {patient.id} • Room: {patient.roomNumber} • Admitted:{" "}
            {new Date(patient.admittedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="ml-auto flex space-x-2">
          <button className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors">
            <Phone className="h-4 w-4 mr-2" />
            <span>Call Nurse</span>
          </button>
          <button className="flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors" onClick={refData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column - Risk trends & AI insights */}
        <div className="space-y-6">
          {/* Risk Score Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Risk Assessment</h2>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  riskScore >= 70
                    ? "bg-red-100 text-red-800"
                    : riskScore >= 40
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                }`}
              >
                {riskScore >= 70 ? "High Risk" : riskScore >= 40 ? "Medium Risk" : "Low Risk"}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Current Risk Score</span>
                <span className="text-2xl font-bold text-gray-800">{riskScore.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    riskScore >= 70 ? "bg-red-600" : riskScore >= 40 ? "bg-yellow-500" : "bg-green-500"
                  }`}
                  style={{ width: `${riskScore}%` }}
                ></div>
              </div>
            </div>


          </div>

          {/* AI Prediction Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">AI Prediction Breakdown</h2>
              <button
                onClick={() => setShowRiskFactors(!showRiskFactors)}
                className="text-gray-500 hover:text-gray-700"
              >
                {showRiskFactors ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
            </div>

            {showRiskFactors && (
              <div className="space-y-4">
                {riskFactors.map((factor, index) => (
                  <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-sm font-medium text-gray-800">{factor.factor}</h3>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          factor.impact === "High"
                            ? "bg-red-100 text-red-800"
                            : factor.impact === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {factor.impact} Impact
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{factor.description}</p>
                  </div>
                ))}

                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">
                      This prediction is based on historical patient data and current vitals. The AI model identifies
                      patterns that may indicate potential deterioration in the next 6-12 hours.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column - Vitals & doctor notes */}
        <div className="space-y-6">
          {/* Vitals History */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Vitals History</h2>

            <div className="space-y-6">
              {/* Heart Rate Chart */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Heart Rate (bpm)</h3>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={heartRateData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                      <YAxis domain={["dataMin - 10", "dataMax + 10"]} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Blood Pressure Chart */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Systolic Blood Pressure (mmHg)</h3>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={bloodPressureData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                      <YAxis domain={["dataMin - 10", "dataMax + 10"]} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Oxygen Saturation Chart */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Oxygen Saturation (%)</h3>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={oxygenData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                      <YAxis domain={[85, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor Notes Section */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Doctor Notes</h2>

            <div className="mb-4">
              <div className="flex">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note about this patient..."
                  className="flex-1 p-3 border border-gray-300 rounded-l-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={3}
                />
                <button
                  onClick={handleAddNote}
                  className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <MessageSquarePlus className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {notes.length > 0 ? (
                notes.map((note, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-700">{note.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{note.timestamp}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No notes yet. Add the first note above.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

