import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    const existingCoach = await prisma.coach.findUnique({
      where: { email },
    })

    if (existingCoach) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const coach = await prisma.coach.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json({ id: coach.id, name: coach.name, email: coach.email })
  } catch (error) {
    console.error("Error creating coach:", error)
    return NextResponse.json({ error: "Failed to create coach" }, { status: 500 })
  }
}

