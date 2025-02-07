import { use } from "react"
import TrainingBlockDetails from "./TrainingBlockDetails"

export default function TrainingBlockPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  return <TrainingBlockDetails id={resolvedParams.id} />
}

