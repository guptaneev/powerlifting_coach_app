"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type React from "react" // Added import for React

interface Exercise {
  id: string
  name: string
  sets: Set[]
}

interface Set {
  id: string
  weight: number
  reps: number
  rpe: number | null
}

export default function EditWorkoutPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [workout, setWorkout] = useState<{ date: string; exercises: Exercise[] } | null>(null)

  useEffect(() => {
    const fetchWorkout = async () => {
      const response = await fetch(`/api/workouts/${params.id}`)
      const data = await response.json()
      setWorkout(data)
    }
    fetchWorkout()
  }, [params.id])

  const handleExerciseChange = (exerciseIndex: number, field: string, value: string) => {
    if (!workout) return
    const updatedExercises = [...workout.exercises]
    updatedExercises[exerciseIndex] = { ...updatedExercises[exerciseIndex], [field]: value }
    setWorkout({ ...workout, exercises: updatedExercises })
  }

  const handleSetChange = (exerciseIndex: number, setIndex: number, field: string, value: string) => {
    if (!workout) return
    const updatedExercises = [...workout.exercises]
    const updatedSets = [...updatedExercises[exerciseIndex].sets]
    updatedSets[setIndex] = { ...updatedSets[setIndex], [field]: Number(value) }
    updatedExercises[exerciseIndex] = { ...updatedExercises[exerciseIndex], sets: updatedSets }
    setWorkout({ ...workout, exercises: updatedExercises })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!workout) return
    const response = await fetch(`/api/workouts/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workout),
    })
    if (response.ok) {
      router.push(`/training-block/${workout.trainingBlockId}`)
    } else {
      // Handle error
      console.error("Failed to update workout")
    }
  }

  if (!workout) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Edit Workout</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="date" className="block mb-1">
            Date:
          </label>
          <input
            type="date"
            id="date"
            value={workout.date.split("T")[0]}
            onChange={(e) => setWorkout({ ...workout, date: e.target.value })}
            className="border p-2 w-full"
            required
          />
        </div>
        {workout.exercises.map((exercise, exerciseIndex) => (
          <div key={exercise.id} className="mb-6 p-4 bg-white rounded shadow">
            <input
              type="text"
              value={exercise.name}
              onChange={(e) => handleExerciseChange(exerciseIndex, "name", e.target.value)}
              className="font-semibold text-lg mb-2 w-full"
              placeholder="Exercise name"
              required
            />
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Set</th>
                  <th className="text-left">Weight (kg)</th>
                  <th className="text-left">Reps</th>
                  <th className="text-left">RPE</th>
                </tr>
              </thead>
              <tbody>
                {exercise.sets.map((set, setIndex) => (
                  <tr key={set.id}>
                    <td>{setIndex + 1}</td>
                    <td>
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) => handleSetChange(exerciseIndex, setIndex, "weight", e.target.value)}
                        className="border p-1 w-20"
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => handleSetChange(exerciseIndex, setIndex, "reps", e.target.value)}
                        className="border p-1 w-20"
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={set.rpe || ""}
                        onChange={(e) => handleSetChange(exerciseIndex, setIndex, "rpe", e.target.value)}
                        className="border p-1 w-20"
                        step="0.5"
                        min="0"
                        max="10"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Save Workout
        </button>
      </form>
    </div>
  )
}

