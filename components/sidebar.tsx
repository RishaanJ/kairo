"use client"
import { Filter, Clock, User, Home, BarChart2, Settings, Users } from "lucide-react"
import Image from 'next/image'


interface SidebarProps {
  onSort: (criteria: string) => void
  sortBy: string
  sortOrder: "asc" | "desc"
}

export default function Sidebar({ onSort, sortBy, sortOrder }: SidebarProps) {
  const sortOptions = [
    { id: "risk", label: "Risk Level", icon: BarChart2 },
    { id: "name", label: "Patient Name", icon: User },
    { id: "room", label: "Room Number", icon: Home },
    { id: "time", label: "Time Admitted", icon: Clock },
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className=" border-b border-gray-200">
        <Image 
          alt="logo" 
          src="/kairo.png" // Use absolute path (starts from /public)
          width={250} // Adjust width
          height={50} // Adjust height
        />
      </div>

      <div className="p-4">
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Filter className="h-4 w-4 mr-2 text-gray-500" />
            <h3 className="font-medium text-gray-700">Sort Patients By</h3>
          </div>
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onSort(option.id)}
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${
                  sortBy === option.id ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <option.icon className="h-4 w-4 mr-2" />
                <span>{option.label}</span>
                {sortBy === option.id && <span className="ml-auto">{sortOrder === "desc" ? "↓" : "↑"}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">

        </div>
      </div>

      <div className="mt-auto p-4 border-t border-gray-200">
        <button className="flex items-center w-full px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100">
          <Settings className="h-4 w-4 mr-2" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  )
}

