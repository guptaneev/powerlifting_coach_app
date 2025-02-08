import "./globals.css"
import { Inter } from "next/font/google"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]/route"
import Link from "next/link"
import SignOutButton from "./components/SignOutButton"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              Powerlifting Coach App
            </Link>
            <div>
              {session ? (
                <>
                  <Link href="/dashboard" className="mr-4">
                    Dashboard
                  </Link>
                  <SignOutButton />
                </>
              ) : (
                <>
                  <Link href="/signin" className="mr-4">
                    Sign In
                  </Link>
                  <Link href="/signup">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  )
}

