"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface Client {
  id: string
  name: string
  blocks: TrainingBlock[]
}

interface TrainingBlock {
  id: string
  name: string
  startDate: string
  endDate: string
}

export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([])
  const [newClientName, setNewClientName] = useState("")

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    // In a real application, you would get the coachId from the authenticated user
    const coachId = "example-coach-id"
    const response = await fetch(`/api/clients?coachId=${coachId}`)
    const data = await response.json()
    setClients(data)
  }

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would get the coachId from the authenticated user
    const coachId = "example-coach-id"
    await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newClientName, coachId }),
    })
    setNewClientName("")
    fetchClients()
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Coach Dashboard</h1>
      <form onSubmit={handleAddClient} className="mb-4">
        <input
          type="text"
          value={newClientName}
          onChange={(e) => setNewClientName(e.target.value)}
          placeholder="New client name"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Client
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client) => (
          <div key={client.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">{client.name}</h2>
            <Link href={`/client/${client.id}`} className="text-blue-500 hover:underline">
              View Details
            </Link>
            <h3 className="mt-4 mb-2 font-semibold">Training Blocks:</h3>
            <ul>
              {client.blocks.map((block) => (
                <li key={block.id} className="mb-1">
                  <Link href={`/training-block/${block.id}`} className="text-blue-500 hover:underline">
                    {block.name} ({new Date(block.startDate).toLocaleDateString()} -{" "}
                    {new Date(block.endDate).toLocaleDateString()})
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={`/create-training-block/${client.id}`}
              className="mt-2 inline-block text-green-500 hover:underline"
            >
              Create New Training Block
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

