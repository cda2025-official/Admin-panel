"use client"

import { createContext, useState, useContext, useEffect } from "react"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("auth-token")
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (username, password) => {
    // This is a simple mock authentication
    // In a real app, you would validate credentials against a backend
    if (username === "Decor@123" && password === "Decor123") {
      localStorage.setItem("auth-token", "dummy-token")
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem("auth-token")
    setIsAuthenticated(false)
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}


