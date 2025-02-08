import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  } else {
    redirect("/signin")
  }

  // This return statement will never be reached, but it's needed to satisfy TypeScript
  return null
}

