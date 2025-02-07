import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const trainingBlock = await prisma.trainingBlock.findUnique({
    where: { id: params.id },
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

