import { use } from "react"
import ClientDetails from "./ClientDetails"

export default function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  return <ClientDetails id={resolvedParams.id} />
}

