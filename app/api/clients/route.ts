import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const coachId = searchParams.get("coachId")

  if (!coachId) {
    return NextResponse.json({ error: "Coach ID is required" }, { status: 400 })
  }

  try {
    const clients = await prisma.client.findMany({
      where: { coachId },
      include: { blocks: true },
    })
    return NextResponse.json(clients)
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, coachId } = await request.json()

    if (!name || !coachId) {
      return NextResponse.json({ error: "Name and Coach ID are required" }, { status: 400 })
    }

    // Check if the coach exists
    const coach = await prisma.coach.findUnique({
      where: { id: coachId },
    })

    if (!coach) {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 })
    }

    const client = await prisma.client.create({
      data: { name, coachId },
    })

    return NextResponse.json(client)
  } catch (error) {
    console.error("Error creating client:", error)
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 })
  }
}

