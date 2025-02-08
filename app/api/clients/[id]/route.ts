import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const client = await prisma.client.findUnique({
    where: { id },
  })

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 })
  }

  return NextResponse.json(client)
}

