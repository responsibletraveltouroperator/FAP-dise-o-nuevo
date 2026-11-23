import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FAP — Fundación Amazonía Productiva",
  description:
    "Territorios vivos, futuro compartido. Conectamos personas, saberes y oportunidades para construir una Amazonía productiva y colaborativa.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

