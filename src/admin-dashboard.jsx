"use client"

import { useState } from "react"
import { VisitorsPanel } from "./visitors-panel"
import { MainPanel } from "./main-panel"
import {
  LayoutDashboard,
  Image,
  FileText,
  Package,
  Briefcase,
  GalleryHorizontalEnd,
  Video,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react"

export default function AdminDashboard() {
  const [activePanel, setActivePanel] = useState("dashboard")
  const [expandedMenus, setExpandedMenus] = useState({ brands: false })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMenu = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const menuItems = [
    { id: "dashboard", label: "Business Name Panel", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "hero-images", label: "Hero Images", icon: <Image className="w-5 h-5" /> },
    { id: "brochures", label: "Brochures", icon: <FileText className="w-5 h-5" /> },
    { id: "products", label: "Products", icon: <Package className="w-5 h-5" /> },
    {
      id: "brands",
      label: "Brands",
      icon: <Briefcase className="w-5 h-5" />,
      hasSubmenu: true,
      submenu: [
        { id: "brand-a", label: "Brand A" },
        { id: "brand-b", label: "Brand B" },
        { id: "brand-d", label: "Brand D" },
      ],
    },
    { id: "gallery", label: "Gallery", icon: <GalleryHorizontalEnd className="w-5 h-5" /> },
    { id: "videos", label: "Videos (gallery)", icon: <Video className="w-5 h-5" /> },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-md shadow-md"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:h-screen
      `}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.id}>
                  {item.hasSubmenu ? (
                    <div className="space-y-1">
                      <button
                        className={`flex items-center justify-between w-full px-4 py-2 text-left text-sm font-medium ${
                          activePanel === item.id ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => toggleMenu("brands")}
                      >
                        <div className="flex items-center">
                          {item.icon}
                          <span className="ml-3">{item.label}</span>
                        </div>
                        {expandedMenus.brands ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>

                      {expandedMenus.brands && (
                        <ul className="pl-10 space-y-1">
                          {item.submenu?.map((subitem) => (
                            <li key={subitem.id}>
                              <button
                                className={`w-full px-2 py-1.5 text-left text-sm ${
                                  activePanel === subitem.id
                                    ? "text-blue-600 font-medium"
                                    : "text-gray-600 hover:text-gray-900"
                                }`}
                                onClick={() => {
                                  setActivePanel(subitem.id)
                                  setIsMobileMenuOpen(false)
                                }}
                              >
                                {subitem.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-left text-sm font-medium ${
                        activePanel === item.id ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        setActivePanel(item.id)
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        {activePanel === "dashboard" && <VisitorsPanel />}
        {activePanel !== "dashboard" && <MainPanel />}
      </div>
    </div>
  )
}
