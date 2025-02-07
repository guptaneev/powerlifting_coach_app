import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import Link from "next/link"

const prisma = new PrismaClient()

export default async function Dashboard() {
  const session = await getServerSession()

  if (!session || !session.user) {
    redirect("/signin")
  }

  const coach = await prisma.coach.findUnique({
    where: { email: session.user.email as string },
    include: { clients: true },
  })

  if (!coach) {
    return <div>Coach not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {coach.name}</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Your Clients</h2>
        {coach.clients.length === 0 ? (
          <p>You don't have any clients yet.</p>
        ) : (
          <ul className="space-y-2">
            {coach.clients.map((client) => (
              <li key={client.id} className="border-b pb-2">
                <Link href={`/client/${client.id}`} className="text-blue-600 hover:underline">
                  {client.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link
          href="/add-client"
          className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Client
        </Link>
      </div>
    </div>
  )
}

