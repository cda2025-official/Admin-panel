"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />
  }

  return <>{children}</>
}

export default ProtectedRoute

