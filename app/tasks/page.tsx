"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Task = {
  id: number
  name: string
  price: number
  createdAt: string
  updatedAt: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    try {
      setLoading(true)
      const res = await fetch("/api/tasks", { cache: "no-store" })
      const json = await res.json()
      if (!res.ok || json.success !== true) {
        throw new Error(json.error || "Erreur lors du chargement")
      }
      setTasks(json.data as Task[])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(id: number) {
    if (!confirm("Supprimer cette tâche ?")) return
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" })
    if (res.ok) {
      await load()
    } else {
      const j = await res.json().catch(() => ({}))
      alert(j.error || "Suppression impossible")
    }
  }

  return (
    <main className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Tâches</h1>
        <Link className="underline" href="/tasks/new">Nouvelle tâche</Link>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && tasks.length === 0 && (
        <p>Aucune tâche.</p>
      )}

      <ul className="space-y-3">
        {tasks.map((t) => (
          <li key={t.id} className="flex items-center justify-between border p-3 rounded">
            <div>
              <Link className="font-medium underline" href={`/tasks/${t.id}`}>#{t.id} - {t.title}</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link className="underline" href={`/tasks/${t.id}/edit`}>Modifier</Link>
              <button onClick={() => handleDelete(t.id)} className="text-red-700">Supprimer</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}

