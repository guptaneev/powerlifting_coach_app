"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface TrainingBlock {
  id: string
  name: string
  startDate: string
  endDate: string
  weeks: Week[]
}

interface Week {
  id: string
  weekNumber: number
  workouts: Workout[]
}

interface Workout {
  id: string
  date: string
  exercises: Exercise[]
}

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

export default function TrainingBlockDetails({ id }: { id: string }) {
  const [trainingBlock, setTrainingBlock] = useState<TrainingBlock | null>(null)

  useEffect(() => {
    const fetchTrainingBlock = async () => {
      const response = await fetch(`/api/training-blocks/${id}`)
      const data = await response.json()
      setTrainingBlock(data)
    }
    fetchTrainingBlock()
  }, [id])

  if (!trainingBlock) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{trainingBlock.name}</h1>
      <p className="mb-4">
        {new Date(trainingBlock.startDate).toLocaleDateString()} -{" "}
        {new Date(trainingBlock.endDate).toLocaleDateString()}
      </p>
      {trainingBlock.weeks.map((week) => (
        <div key={week.id} className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Week {week.weekNumber}</h2>
          {week.workouts.map((workout) => (
            <div key={workout.id} className="mb-4 p-4 bg-white rounded shadow">
              <h3 className="text-xl font-semibold mb-2">{new Date(workout.date).toLocaleDateString()}</h3>
              {workout.exercises.map((exercise) => (
                <div key={exercise.id} className="mb-2">
                  <h4 className="text-lg font-medium">{exercise.name}</h4>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left">Set</th>
                        <th className="text-left">Weight</th>
                        <th className="text-left">Reps</th>
                        <th className="text-left">RPE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exercise.sets.map((set, index) => (
                        <tr key={set.id}>
                          <td>{index + 1}</td>
                          <td>{set.weight} kg</td>
                          <td>{set.reps}</td>
                          <td>{set.rpe || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
              <Link href={`/workout/${workout.id}/edit`} className="text-blue-500 hover:underline">
                Edit Workout
              </Link>
            </div>
          ))}
          <Link href={`/workout/create?weekId=${week.id}`} className="text-green-500 hover:underline">
            Add Workout
          </Link>
        </div>
      ))}
    </div>
  )
}

