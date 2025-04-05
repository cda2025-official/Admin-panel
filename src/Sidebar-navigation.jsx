"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
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
} from "lucide-react"

export function SidebarNavigation({ className, activeItem = "dashboard", onItemClick }) {
  const [expandedMenus, setExpandedMenus] = useState({ brands: false })

  const toggleMenu = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  const handleItemClick = (id) => {
    if (onItemClick) {
      onItemClick(id)
    }
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
    <div className={cn("flex flex-col h-full bg-white", className)}>
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
                    className={cn(
                      "flex items-center justify-between w-full px-4 py-2 text-left text-sm font-medium",
                      activeItem === item.id ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-100",
                    )}
                    onClick={() => toggleMenu("brands")}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </div>
                    {expandedMenus.brands ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>

                  {expandedMenus.brands && (
                    <ul className="pl-10 space-y-1">
                      {item.submenu?.map((subitem) => (
                        <li key={subitem.id}>
                          <button
                            className={cn(
                              "w-full px-2 py-1.5 text-left text-sm",
                              activeItem === subitem.id
                                ? "text-blue-600 font-medium"
                                : "text-gray-600 hover:text-gray-900",
                            )}
                            onClick={() => handleItemClick(subitem.id)}
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
                  className={cn(
                    "flex items-center w-full px-4 py-2 text-left text-sm font-medium",
                    activeItem === item.id ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-100",
                  )}
                  onClick={() => handleItemClick(item.id)}
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
  )
}


