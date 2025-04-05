"use client"

import { useState } from "react"
import { SidebarNavigation } from "./sidebar-navigation"
import { Menu, X } from "lucide-react"

export function AdminLayout({ children }) {
  const [activeItem, setActiveItem] = useState("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleItemClick = (id) => {
    setActiveItem(id)
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-md shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-64 shadow-lg transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:h-screen
      `}
      >
        <SidebarNavigation activeItem={activeItem} onItemClick={handleItemClick} />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-4 md:p-6">{children}</div>
    </div>
  )
}

