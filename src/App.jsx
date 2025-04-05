import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import MainPanel from "./MainPanel"
import VisitorsPanel from "./Panel"
import LoginPage from "./LoginPage"
import { AuthProvider } from "./AuthContext"
import ProtectedRoute from "./ProtectedRoute"
import  UploadPDF from './Test'


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainPanel />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <VisitorsPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>


   
  )
}

