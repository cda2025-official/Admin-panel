"use client"

import { useState } from "react"
import { AdminLayout } from "./admin-layout"
import { VisitorsPanel } from "./Panel"
import { MainPanel } from "./MainPanel"

export default function AdminPage() {
  const [activePanel, setActivePanel] = useState("dashboard")

  const handlePanelChange = (panelId) => {
    setActivePanel(panelId)
  }

  return (
    <AdminLayout>
      {activePanel === "dashboard" && <VisitorsPanel />}
      {activePanel !== "dashboard" && <MainPanel />}
    </AdminLayout>
  )
}

