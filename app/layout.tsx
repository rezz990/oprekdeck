import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OprekDeck",
  description:
    "Panel kontrol Android lewat ADB di browser: profil perangkat, debloat aman, tweak, dan rekomendasi optimasi.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
