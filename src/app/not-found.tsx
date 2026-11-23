import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f8f4ec] text-[#10120f] text-center">
      <h2 className="text-4xl font-extrabold text-[#142b1f] mb-3">Página no encontrada</h2>
      <p className="text-neutral-600 mb-6">La página que buscas no existe o ha sido movida.</p>
      <Link
        href="/"
        className="bg-[#225333] hover:bg-[#142b1f] text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors"
      >
        Volver al inicio
      </Link>
    </main>
  );
}

