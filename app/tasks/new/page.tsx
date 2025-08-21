"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewProductPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [price, setPrice] = useState<string>("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const body = { name: name.trim(), price: Number(price) }
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
      const json = await res.json()
      if (!res.ok || json.success !== true) {
        throw new Error(json.error || "Création impossible")
      }
      router.push("/products")
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="container mx-auto p-8 max-w-lg">
      <h1 className="text-2xl font-semibold mb-6">Nouveau produit</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nom</label>
          <input className="border rounded w-full p-2" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1">Prix</label>
          <input className="border rounded w-full p-2" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        {error && <p className="text-red-700">{error}</p>}
        <button disabled={submitting} className="bg-black text-white px-4 py-2 rounded">
          {submitting ? "En cours..." : "Créer"}
        </button>
      </form>
    </main>
  )
}

