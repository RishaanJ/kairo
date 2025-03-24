"use client"

import { Search, Bell, RefreshCw, User } from "lucide-react"

interface TopBarProps {
  searchQuery: string
  onSearch: (query: string) => void
  unreadAlertsCount: number
  onToggleAlerts: () => void
  onRefreshData: () => void
}

export default function TopBar({
  searchQuery,
  onSearch,
  unreadAlertsCount,
  onToggleAlerts,
  onRefreshData,
}: TopBarProps) {
  return (
    <div className="bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between">
      <div className="relative w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search patients by name, ID, or room..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={onRefreshData}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className="h-5 w-5" />
        </button>

        <button
          onClick={onToggleAlerts}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors relative"
          title="Alerts"
        >
          <Bell className="h-5 w-5" />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadAlertsCount}
            </span>
          )}
        </button>

        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-2">
            <User className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Dr. Jain</p>
            <p className="text-xs text-gray-500">ICU Overseer</p>
          </div>
        </div>
      </div>
    </div>
  )
}

