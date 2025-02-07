import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const workout = await prisma.workout.findUnique({
    where: { id: params.id },
    include: {
      exercises: {
        include: {
          sets: true,
        },
      },
    },
  })

  if (!workout) {
    return NextResponse.json({ error: "Workout not found" }, { status: 404 })
  }

  return NextResponse.json(workout)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data = await request.json()

  const updatedWorkout = await prisma.workout.update({
    where: { id: params.id },
    data: {
      date: new Date(data.date),
      exercises: {
        upsert: data.exercises.map((exercise: any) => ({
          where: { id: exercise.id },
          update: {
            name: exercise.name,
            sets: {
              upsert: exercise.sets.map((set: any) => ({
                where: { id: set.id },
                update: {
                  weight: set.weight,
                  reps: set.reps,
                  rpe: set.rpe,
                },
                create: {
                  weight: set.weight,
                  reps: set.reps,
                  rpe: set.rpe,
                },
              })),
            },
          },
          create: {
            name: exercise.name,
            sets: {
              create: exercise.sets.map((set: any) => ({
                weight: set.weight,
                reps: set.reps,
                rpe: set.rpe,
              })),
            },
          },
        })),
      },
    },
    include: {
      exercises: {
        include: {
          sets: true,
        },
      },
    },
  })

  return NextResponse.json(updatedWorkout)
}

