"use client"

import { X, Bell, CheckCircle } from "lucide-react"
import type { Alert } from "@/lib/types"

interface AlertsPanelProps {
  alerts: Alert[]
  onClose: () => void
  onMarkAsRead: (alertId: number) => void
}

export default function AlertsPanel({ alerts, onClose, onMarkAsRead }: AlertsPanelProps) {
  // Get alert severity class
  const getAlertSeverityClass = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 border-red-200 text-red-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <Bell className="h-5 w-5 text-gray-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">Alerts & Notifications</h2>
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
          <X className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {alerts.length > 0 ? (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 border rounded-md ${getAlertSeverityClass(
                  alert.severity,
                )} ${alert.read ? "opacity-60" : ""}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium">{alert.title}</h3>
                    <p className="text-xs mt-1">{alert.message}</p>
                    <div className="flex items-center mt-2 text-xs">
                      <span>Patient: {alert.patientName}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(alert.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                  {!alert.read && (
                    <button
                      onClick={() => onMarkAsRead(alert.id)}
                      className="p-1 rounded-full hover:bg-white/50 transition-colors"
                      title="Mark as read"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Bell className="h-10 w-10 mb-2 text-gray-300" />
            <p>No alerts at this time</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium">
          Notification Settings
        </button>
      </div>
    </div>
  )
}

