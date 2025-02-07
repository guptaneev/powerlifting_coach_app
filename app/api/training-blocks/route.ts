import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const clientId = searchParams.get("clientId")

  if (!clientId) {
    return NextResponse.json({ error: "Client ID is required" }, { status: 400 })
  }

  const trainingBlocks = await prisma.trainingBlock.findMany({
    where: { clientId },
    orderBy: { startDate: "desc" },
  })

  return NextResponse.json(trainingBlocks)
}

export async function POST(request: Request) {
  const { name, startDate, endDate, clientId } = await request.json()

  if (!name || !startDate || !endDate || !clientId) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 })
  }

  const trainingBlock = await prisma.trainingBlock.create({
    data: {
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      clientId,
    },
  })

  return NextResponse.json(trainingBlock)
}

