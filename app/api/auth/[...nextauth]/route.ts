import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Authorize function called")
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing email or password")
          return null
        }

        const coach = await prisma.coach.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!coach) {
          console.log("Coach not found")
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, coach.password)

        if (!isPasswordValid) {
          console.log("Invalid password")
          return null
        }

        console.log("Authentication successful")
        return {
          id: coach.id,
          email: coach.email,
          name: coach.name,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT callback", { token, user })
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      console.log("Session callback", { session, token })
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === "development",
})

export { handler as GET, handler as POST }
export { handler as authOptions }

