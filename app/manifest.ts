import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Teman Buku Pink Tumbuh Kembang",
    short_name: "Teman Buku Pink",
    description: "Panduan pendamping Buku KIA untuk tumbuh kembang anak.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fffafc",
    theme_color: "#d6336c",
    lang: "id",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-maskable.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
