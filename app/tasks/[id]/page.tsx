import Link from "next/link"
import { headers } from "next/headers"

async function fetchTask(id: string) {
  const h = headers()
  const host = h.get("host")
  const proto = h.get("x-forwarded-proto") ?? "http"
  const baseUrl = host ? `${proto}://${host}` : "http://localhost:3000"

  const res = await fetch(`${baseUrl}/api/tasks/${id}`, { cache: "no-store" })
  if (!res.ok) return null
  const json = await res.json()
  return json?.data ?? null
}

export default async function TaskDetail({ params }: { params: { id: string } }) {
  const task = await fetchTask(params.id)

  if (!task) {
    return (
      <main className="container mx-auto p-8">
        <p>Tâche introuvable.</p>
        <Link className="underline" href="/tasks">Retour</Link>
      </main>
    )
  }

  return (
    <main className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">{task.title}</h1>
      <div className="space-y-2">
        <div>{task.description}</div>
        <div>{task.status}</div>
        <div>{task.priority}</div>
        <div className="text-sm">Due le {new Date(task.dueDate).toLocaleString()}</div>
        <div className="text-sm text-gray-600">Créé le {new Date(task.createdAt).toLocaleString()}</div>
        {/* <div className="text-sm text-gray-600">Mis à jour le {new Date(task.updatedAt).toLocaleString()}</div> */}
      </div>
      <div className="mt-6 flex items-center gap-3">
        <Link className="underline" href={`/tasks/${task.id}/edit`}>Modifier</Link>
        <Link className="underline" href="/tasks">Retour à la liste</Link>
      </div>
    </main>
  )
}

