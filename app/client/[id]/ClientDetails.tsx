"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface Client {
  id: string
  name: string
}

interface TrainingBlock {
  id: string
  name: string
  startDate: string
  endDate: string
}

export default function ClientDetails({ id }: { id: string }) {
  const [client, setClient] = useState<Client | null>(null)
  const [trainingBlocks, setTrainingBlocks] = useState<TrainingBlock[]>([])
  const [newBlockName, setNewBlockName] = useState("")
  const [newBlockStart, setNewBlockStart] = useState("")
  const [newBlockEnd, setNewBlockEnd] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchClientAndBlocks()
  }, []) // Removed unnecessary dependency 'id'

  const fetchClientAndBlocks = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const clientResponse = await fetch(`/api/clients/${id}`)
      if (!clientResponse.ok) {
        throw new Error("Failed to fetch client details")
      }
      const clientData = await clientResponse.json()
      setClient(clientData)

      const blocksResponse = await fetch(`/api/training-blocks?clientId=${id}`)
      if (!blocksResponse.ok) {
        throw new Error("Failed to fetch training blocks")
      }
      const blocksData = await blocksResponse.json()
      setTrainingBlocks(blocksData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddBlock = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/training-blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newBlockName,
          startDate: newBlockStart,
          endDate: newBlockEnd,
          clientId: id,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add training block")
      }
      setNewBlockName("")
      setNewBlockStart("")
      setNewBlockEnd("")
      fetchClientAndBlocks()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add training block. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!client) {
    return <div>Client not found</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{client.name}</h1>
      <form onSubmit={handleAddBlock} className="space-y-2">
        <input
          type="text"
          value={newBlockName}
          onChange={(e) => setNewBlockName(e.target.value)}
          placeholder="New block name"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="date"
          value={newBlockStart}
          onChange={(e) => setNewBlockStart(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="date"
          value={newBlockEnd}
          onChange={(e) => setNewBlockEnd(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add Training Block"}
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trainingBlocks.map((block) => (
          <div key={block.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">{block.name}</h2>
            <p className="text-sm text-gray-600 mb-2">
              {new Date(block.startDate).toLocaleDateString()} - {new Date(block.endDate).toLocaleDateString()}
            </p>
            <Link href={`/training-block/${block.id}`} className="text-blue-500 hover:underline">
              View Block
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

