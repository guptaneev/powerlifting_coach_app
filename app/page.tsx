"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface Client {
  id: string
  name: string
}

interface Coach {
  id: string
  name: string
  email: string
}

export default function Home() {
  const [clients, setClients] = useState<Client[]>([])
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [selectedCoachId, setSelectedCoachId] = useState<string>("")
  const [newClientName, setNewClientName] = useState("")
  const [newCoachName, setNewCoachName] = useState("")
  const [newCoachEmail, setNewCoachEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchCoaches()
  }, [])

  useEffect(() => {
    if (selectedCoachId) {
      fetchClients()
    }
  }, [selectedCoachId])

  const fetchCoaches = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/coaches")
      if (!response.ok) {
        throw new Error("Failed to fetch coaches")
      }
      const data = await response.json()
      setCoaches(data)
      if (data.length > 0) {
        setSelectedCoachId(data[0].id)
      }
    } catch (err) {
      setError("Failed to load coaches. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchClients = async () => {
    if (!selectedCoachId) return
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/clients?coachId=${selectedCoachId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch clients")
      }
      const data = await response.json()
      setClients(data)
    } catch (err) {
      setError("Failed to load clients. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCoachId) {
      setError("Please select a coach first")
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newClientName, coachId: selectedCoachId }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add client")
      }
      setNewClientName("")
      fetchClients()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add client. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCoach = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/coaches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCoachName, email: newCoachEmail }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add coach")
      }
      setNewCoachName("")
      setNewCoachEmail("")
      fetchCoaches()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add coach. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Powerlifting Coach Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Add New Coach</h2>
        <form onSubmit={handleAddCoach} className="space-y-4">
          <div>
            <label htmlFor="coach-name" className="block mb-1">
              Coach Name:
            </label>
            <input
              id="coach-name"
              type="text"
              value={newCoachName}
              onChange={(e) => setNewCoachName(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="coach-email" className="block mb-1">
              Coach Email:
            </label>
            <input
              id="coach-email"
              type="email"
              value={newCoachEmail}
              onChange={(e) => setNewCoachEmail(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded w-full disabled:bg-green-300"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Coach"}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Manage Clients</h2>
        <div className="mb-4">
          <label htmlFor="coach-select" className="block mb-2">
            Select Coach:
          </label>
          <select
            id="coach-select"
            value={selectedCoachId}
            onChange={(e) => setSelectedCoachId(e.target.value)}
            className="border p-2 rounded w-full"
          >
            {coaches.map((coach) => (
              <option key={coach.id} value={coach.id}>
                {coach.name}
              </option>
            ))}
          </select>
        </div>
        <form onSubmit={handleAddClient} className="space-y-4">
          <div>
            <label htmlFor="client-name" className="block mb-1">
              New Client Name:
            </label>
            <input
              id="client-name"
              type="text"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              className="border p-2 rounded w-full"
              disabled={isLoading}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full disabled:bg-blue-300"
            disabled={isLoading || !selectedCoachId}
          >
            {isLoading ? "Adding..." : "Add Client"}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Clients</h2>
        {isLoading && <p>Loading...</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <div key={client.id} className="border p-4 rounded shadow">
              <h3 className="text-xl font-semibold mb-2">{client.name}</h3>
              <Link href={`/client/${client.id}`} className="text-blue-500 hover:underline">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

