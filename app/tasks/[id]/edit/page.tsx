"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Product = {
  id: number
  name: string
  price: number
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [name, setName] = useState("")
  const [price, setPrice] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/products/${params.id}`)
        const json = await res.json()
        if (!res.ok || json.success !== true) throw new Error(json.error || "Produit introuvable")
        setProduct(json.data)
        setName(json.data.name)
        setPrice(String(json.data.price))
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), price: Number(price) })
      })
      const json = await res.json()
      if (!res.ok || json.success !== true) throw new Error(json.error || "Modification impossible")
      router.push(`/products/${params.id}`)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <main className="container mx-auto p-8">Chargement...</main>
  if (error) return <main className="container mx-auto p-8 text-red-700">{error}</main>
  if (!product) return null

  return (
    <main className="container mx-auto p-8 max-w-lg">
      <h1 className="text-2xl font-semibold mb-6">Modifier le produit</h1>
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
        <button disabled={saving} className="bg-black text-white px-4 py-2 rounded">
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </main>
  )
}

