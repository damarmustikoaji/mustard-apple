import { FEATURE_AFFILIATE_PRODUCTS } from "@/lib/features";
import { affiliateProducts } from "@/lib/affiliate/products";
import type { AffiliateCategory } from "@/lib/affiliate/types";

export function AffiliateProducts({ category }: { category?: AffiliateCategory }) {
  if (!FEATURE_AFFILIATE_PRODUCTS) return null;
  const items = category ? affiliateProducts.filter((p) => p.category === category) : affiliateProducts;
  if (items.length === 0) return null;

  return (
    <section aria-label="Rekomendasi peralatan" className="space-y-2">
      <h2 className="font-bold">Peralatan yang bisa membantu</h2>
      <p className="text-xs text-muted">Tautan beriklan: kami bisa mendapat komisi dari pembelian tanpa menambah harga untuk Anda.</p>
      <div className="grid gap-2">
        {items.map((product) => (
          <a
            key={product.id}
            href={product.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="rounded-2xl border border-border bg-card p-4 hover:border-accent"
          >
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-muted">{product.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
