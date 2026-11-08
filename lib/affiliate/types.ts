export type AffiliateCategory = "Peralatan Makan" | "Peralatan Masak" | "Penyimpanan" | "Perlengkapan Lainnya";

export type AffiliateProduct = {
  id: string;
  name: string;
  category: AffiliateCategory;
  description: string;
  url: string;
  imageUrl?: string;
  platform: "shopee";
};
