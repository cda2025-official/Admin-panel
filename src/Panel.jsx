"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "./firebase"
import { User, Phone, Mail, Calendar, Search } from "lucide-react"

export default function VisitorsPanel() {
  const [visitors, setVisitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [visibleCount, setVisibleCount] = useState(10)

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const visitorsQuery = query(collection(db, "visitors"), orderBy("createdAt", "desc"))

        const querySnapshot = await getDocs(visitorsQuery)
        const visitorsList = []

        querySnapshot.forEach((doc) => {
          visitorsList.push({
            id: doc.id,
            ...doc.data(),
          })
        })

        setVisitors(visitorsList)
      } catch (error) {
        console.error("Error fetching visitors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVisitors()
  }, [])

  const filteredVisitors = visitors.filter(
    (visitor) =>
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.phone.includes(searchTerm) ||
      (visitor.email && visitor.email.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const displayedVisitors = filteredVisitors.slice(0, visibleCount)

  const loadMore = () => {
    setVisibleCount((prev) => prev + 10)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-600" />
          Website Visitors
        </h2>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search visitors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Loading visitors data...</p>
          </div>
        ) : visitors.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <User className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p>No visitor data available yet.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Phone
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedVisitors.map((visitor) => (
                    <tr key={visitor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-400 mr-2" />
                          <div className="text-sm font-medium text-gray-900">{visitor.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-500">{visitor.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-500">{visitor.email || "—"}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-500">{formatDate(visitor.createdAt)}</div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {visibleCount < filteredVisitors.length && (
              <div className="mt-6 text-center">
                <button
                  onClick={loadMore}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export { VisitorsPanel }