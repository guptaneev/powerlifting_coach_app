import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

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
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const coach = await prisma.coach.findUnique({
      where: { email: session.user.email as string },
    })

    if (!coach) {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 })
    }

    const client = await prisma.client.create({
      data: { name, coachId: coach.id },
    })

    return NextResponse.json(client)
  } catch (error) {
    console.error("Error creating client:", error)
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 })
  }
}

