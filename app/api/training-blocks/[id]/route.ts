import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const trainingBlock = await prisma.trainingBlock.findUnique({
    where: { id },
    include: {
      weeks: {
        include: {
          workouts: {
            include: {
              exercises: {
                include: {
                  sets: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!trainingBlock) {
    return NextResponse.json({ error: "Training block not found" }, { status: 404 })
  }

  return NextResponse.json(trainingBlock)
}

