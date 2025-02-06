import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const coachId = searchParams.get("coachId")

  if (!coachId) {
    return NextResponse.json({ error: "Coach ID is required" }, { status: 400 })
  }

  const clients = await prisma.client.findMany({
    where: { coachId },
    include: { blocks: true },
  })

  return NextResponse.json(clients)
}

export async function POST(request: Request) {
  const { name, coachId } = await request.json()

  if (!name || !coachId) {
    return NextResponse.json({ error: "Name and Coach ID are required" }, { status: 400 })
  }

  const client = await prisma.client.create({
    data: { name, coachId },
  })

  return NextResponse.json(client)
}

