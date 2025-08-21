import Link from "next/link"
import { headers } from "next/headers"

async function fetchProduct(id: string) {
  const h = headers()
  const host = h.get("host")
  const proto = h.get("x-forwarded-proto") ?? "http"
  const baseUrl = host ? `${proto}://${host}` : "http://localhost:3000"

  const res = await fetch(`${baseUrl}/api/products/${id}`, { cache: "no-store" })
  if (!res.ok) return null
  const json = await res.json()
  return json?.data ?? null
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const product = await fetchProduct(params.id)

  if (!product) {
    return (
      <main className="container mx-auto p-8">
        <p>Produit introuvable.</p>
        <Link className="underline" href="/products">Retour</Link>
      </main>
    )
  }

  return (
    <main className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">{product.name}</h1>
      <div className="space-y-2">
        <div>Prix: {product.price?.toFixed?.(2) ?? product.price} $</div>
        <div className="text-sm text-gray-600">Créé le {new Date(product.createdAt).toLocaleString()}</div>
        <div className="text-sm text-gray-600">Mis à jour le {new Date(product.updatedAt).toLocaleString()}</div>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <Link className="underline" href={`/products/${product.id}/edit`}>Modifier</Link>
        <Link className="underline" href="/products">Retour à la liste</Link>
      </div>
    </main>
  )
}

