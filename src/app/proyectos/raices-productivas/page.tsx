"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import heroImage from "@/assets/fap-hero.jpg";
import communityImage from "@/assets/fap-community.jpg";
import storyImage from "@/assets/fap-story.jpg";
import seedlingPhotoImage from "@/assets/fap-seedling.jpg";
import type { MapProject } from "@/components/EcuadorMap";

const EcuadorMap = dynamic(() => import("@/components/EcuadorMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[1.06/1] max-w-[780px] bg-[#eee6d8] flex items-center justify-center text-sm font-bold text-neutral-500 animate-pulse">
      Cargando mapa de zonas plantadas...
    </div>
  )
});

function getImageSrc(img: string | { src: string }): string {
  return typeof img === "string" ? img : img.src;
}

function ArrowUpRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M7 7h10v10" />
    </svg>
  );
}

// Zonas plantadas específicas del programa (Galápagos, Loja y Pichincha)
const plantedZones: (MapProject & { detail: string; species: string })[] = [
  {
    id: "galapagos",
    name: "Galápagos (Santa Cruz)",
    category: "proyectos",
    place: "Santa Cruz, Galápagos",
    tag: "Control de invasoras & Scalesia",
    lng: -90.31,
    lat: -0.74,
    detail: "Perímetro de restauración insular con control de especies invasoras y siembra vivencial de Scalesia.",
    species: "Scalesia pedunculata"
  },
  {
    id: "loja-fincas",
    name: "Loja (Fincas y Vivero Escolar)",
    category: "proyectos",
    place: "Loja / Quilanga",
    tag: "Meta ~1.400 ha afectadas",
    lng: -79.40,
    lat: -4.25,
    detail: "Recuperación de bosques afectados por tala e incendios junto a fincas locales y la U.E. Lic. Miguel Antoliano Salinas Jaramillo.",
    species: "Especies nativas andinas"
  },
  {
    id: "pichincha-zonas",
    name: "Pichincha (Varias Zonas)",
    category: "empresas",
    place: "Pichincha",
    tag: "Jornadas presenciales B2B",
    lng: -78.4678,
    lat: -0.1807,
    detail: "Cobertura nacional para jornadas corporativas presenciales, team building sostenible y seguimiento técnico.",
    species: "Bosque protector altoandino"
  }
];

const timelineMilestones = [
  {
    id: "puce",
    date: "Hito Académico & Campo",
    title: "Jornadas de Siembra junto a la PUCE",
    summary: "Estudiantes y voluntarios trabajaron en territorio aplicando hidrogel biodegradable Hidrokeeper y levantamiento técnico.",
    metric: "+450 plántulas"
  },
  {
    id: "mil-arboles",
    date: "Hito Territorial",
    title: "Superamos el Hito de Mil Árboles Georreferenciados",
    summary: "Cada árbol adoptado y compensado cuenta con fotografía, coordenada exacta en mapa y monitoreo garantizado a 5 años.",
    metric: "1.000+ árboles"
  },
  {
    id: "carbon-offset",
    date: "Reporte de Impacto",
    title: "Reportes Verificados de Carbon Offset",
    summary: "Alianzas activas con Responsible Travel, Kimkim y empresas locales para compensar huella operativa y turística.",
    metric: "416.6 ton CO₂ ref."
  }
];

export default function RaicesProductivasPage() {
  const [activeModalidad, setActiveModalidad] = useState<"b2c" | "viajeros" | "b2b">("b2c");
  const [treeCount, setTreeCount] = useState<number>(5);
  const [activeZoneId, setActiveZoneId] = useState<string>("galapagos");
  const [activeTimelineId, setActiveTimelineId] = useState<string>("puce");
  const [b2bSent, setB2bSent] = useState<boolean>(false);

  // Referencia de escala: 2.500 árboles = 416.6 toneladas métricas => ~0.16664 ton por árbol
  const co2TonsEstimated = (treeCount * 0.16664).toFixed(2);
  const activeZone = plantedZones.find(z => z.id === activeZoneId) || plantedZones[0];

  return (
    <main className="relative min-h-screen bg-[#F7F2E6] text-[#10120f] overflow-x-hidden selection:bg-[#B7D84B] selection:text-black">
      {/* Filtros difuminados ligeros de Verde Hoja y Verde Bosque sobre el Marfil */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0" aria-hidden="true">
        <div
          className="absolute top-[42%] -right-24 w-[780px] h-[780px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(117, 179, 70, 0.20) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-[74%] -left-24 w-[820px] h-[820px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(46, 107, 63, 0.15) 0%, transparent 70%)" }}
        />
      </div>
      
      {/* ============================================================== */}
      {/* BARRA SUPERIOR DE NAVEGACIÓN (SIN BORDES REDONDOS) */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 bg-[#142b1f] text-white border-b border-white/10 px-6 sm:px-12 lg:px-16 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#B7D84B] hover:text-white transition-colors"
        >
          <span>←</span> Volver al Inicio
        </Link>
        <div className="flex items-center gap-6 text-xs sm:text-sm font-medium">
          <a href="#respaldo" className="hidden md:inline hover:text-[#B7D84B] transition-colors">Respaldo Técnico</a>
          <a href="#modalidades" className="hidden md:inline hover:text-[#B7D84B] transition-colors">Modalidades</a>
          <a href="#transparencia" className="hidden md:inline hover:text-[#B7D84B] transition-colors">Transparencia</a>
          <a
            href="#modalidades"
            onClick={() => setActiveModalidad("b2c")}
            className="bg-[#B7D84B] text-[#0c0e0b] px-4 py-2 font-bold rounded-none hover:bg-[#b5e642] transition-colors inline-flex items-center gap-1.5"
          >
            Adoptar un Árbol <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 1. CABECERA DE SECCIÓN (PROPUESTA DE VALOR Y RESPALDO TÉCNICO) */}
      {/* ============================================================== */}
      <section id="respaldo" className="relative bg-[#142b1f] text-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-stretch">
          
          {/* Columna Izquierda: Propuesta de Valor */}
          <div className="lg:col-span-7 px-6 sm:px-12 lg:px-16 py-16 lg:py-24 flex flex-col justify-center space-y-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#B7D84B]">
              <span className="w-2 h-2 bg-[#B7D84B]" />
              Reforestación y Compensación de Carbono
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.06]">
              <span className="block overflow-hidden pb-1">
                <span className="animate-line-reveal">Lo que no se puede reducir,</span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span className="animate-line-reveal-delay-1 text-[#B7D84B]">se puede compensar.</span>
              </span>
            </h1>

            <p className="text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed border-l-2 border-[#B7D84B] pl-4">
              Fusión estratégica de <strong>Adopta un Árbol + Proyecto Carbon Offset</strong>. Cada intervención une ciencia forestal, retención hídrica y economía popular comunitaria en Ecuador.
            </p>

            {/* Equivalencias de Impacto (Sin bordes redondos) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="border border-white/15 bg-white/5 p-5 rounded-none space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B7D84B] block">
                  Fijación por Hectárea
                </span>
                <p className="text-2xl font-extrabold text-white">~4 a 8 ton CO₂/año</p>
                <p className="text-xs text-white/70">
                  1 ha de bosque nuevo fija ~4 ton/año; bosque establecido alcanza ~8 ton/año.
                </p>
              </div>
              <div className="border border-white/15 bg-white/5 p-5 rounded-none space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B7D84B] block">
                  Referencia de Escala
                </span>
                <p className="text-2xl font-extrabold text-white">2.500 árboles</p>
                <p className="text-xs text-white/70">
                  Equivalen a <strong>416.6 toneladas métricas</strong> de carbono compensadas.
                </p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Imagen arquitectónica recta */}
          <div className="lg:col-span-5 relative min-h-[340px] lg:min-h-full">
            <img
              src={getImageSrc(heroImage)}
              alt="Reforestación comunitaria FAP"
              className="w-full h-full object-cover rounded-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#142b1f] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#142b1f] lg:via-transparent" />
          </div>

        </div>

        {/* Garantía Técnica y Operativa (Barra inferior en 3 columnas rectas) */}
        <div className="bg-[#0c0e0b] border-t border-white/10">
          <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-l-2 border-[#75B346] pl-4 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B7D84B]">01 · Hidrokeeper</span>
              <h3 className="text-sm font-bold text-white">Polímero Biodegradable</h3>
              <p className="text-xs text-white/70">Retención óptima de agua y nutrientes en las raíces desde la siembra.</p>
            </div>
            <div className="border-l-2 border-[#75B346] pl-4 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B7D84B]">02 · Cuidado a 5 Años</span>
              <h3 className="text-sm font-bold text-white">Supervivencia Garantizada</h3>
              <p className="text-xs text-white/70">Monitoreo técnico, limpieza de malezas y resiembra durante los primeros 5 años.</p>
            </div>
            <div className="border-l-2 border-[#75B346] pl-4 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B7D84B]">03 · Economía Popular</span>
              <h3 className="text-sm font-bold text-white">Gestión Comunitaria Local</h3>
              <p className="text-xs text-white/70">Mano de obra y viveros gestionados directamente por las comunidades locales.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. LAS 3 MODALIDADES DE INTERVENCIÓN (EJE NAVEGACIONAL DINÁMICO) */}
      {/* ============================================================== */}
      <section id="modalidades" className="py-20 px-6 sm:px-12 lg:px-16 max-w-[1400px] mx-auto">
        
        <div className="mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#2E6B3F]">
            <span className="w-2 h-2 bg-[#2E6B3F]" />
            Eje de Participación
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#142b1f]">
            Elige cómo <span className="text-[#75B346]">compensar e impactar</span>
          </h2>
        </div>

        {/* Selector Dinámico de 3 Pestañas (CERO bordes redondeados) */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-r border-black/15 bg-white">
          <button
            onClick={() => setActiveModalidad("b2c")}
            className={`p-5 text-left border-b md:border-b-0 md:border-r border-black/15 transition-colors cursor-pointer rounded-none ${
              activeModalidad === "b2c"
                ? "bg-[#142b1f] text-white"
                : "bg-white text-[#142b1f] hover:bg-[#f0ece1]"
            }`}
          >
            <span className={`text-[11px] font-bold uppercase tracking-widest block mb-1 ${activeModalidad === "b2c" ? "text-[#B7D84B]" : "text-[#2E6B3F]"}`}>
              Modalidad 01
            </span>
            <span className="text-lg font-extrabold block">Adopción Individual o Regalo (B2C)</span>
          </button>

          <button
            onClick={() => setActiveModalidad("viajeros")}
            className={`p-5 text-left border-b md:border-b-0 md:border-r border-black/15 transition-colors cursor-pointer rounded-none ${
              activeModalidad === "viajeros"
                ? "bg-[#142b1f] text-white"
                : "bg-white text-[#142b1f] hover:bg-[#f0ece1]"
            }`}
          >
            <span className={`text-[11px] font-bold uppercase tracking-widest block mb-1 ${activeModalidad === "viajeros" ? "text-[#B7D84B]" : "text-[#2E6B3F]"}`}>
              Modalidad 02
            </span>
            <span className="text-lg font-extrabold block">Viajeros &amp; Turismo Sostenible</span>
          </button>

          <button
            onClick={() => setActiveModalidad("b2b")}
            className={`p-5 text-left transition-colors cursor-pointer rounded-none ${
              activeModalidad === "b2b"
                ? "bg-[#142b1f] text-white"
                : "bg-white text-[#142b1f] hover:bg-[#f0ece1]"
            }`}
          >
            <span className={`text-[11px] font-bold uppercase tracking-widest block mb-1 ${activeModalidad === "b2b" ? "text-[#B7D84B]" : "text-[#2E6B3F]"}`}>
              Modalidad 03
            </span>
            <span className="text-lg font-extrabold block">Programas Corporativos (B2B)</span>
          </button>
        </div>

        {/* Contenido Dinámico de la Modalidad Activa (Sin bordes redondeados) */}
        <div className="border border-black/15 bg-white p-6 sm:p-10 lg:p-12 rounded-none">
          
          {/* MODALIDAD 1: ADOPCIÓN INDIVIDUAL O REGALO (B2C) */}
          {activeModalidad === "b2c" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start animate-fadeIn">
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#75B346]">
                    Personas Naturales &amp; Regalos Vivos
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#142b1f]">
                    Adopción Individual o Regalo Perdurable
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                    Ideal para quienes desean aportar directamente a la restauración del país o entregar un regalo con vida y trazabilidad real.
                  </p>
                </div>

                <div className="divide-y divide-black/10 border-t border-b border-black/10">
                  <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Territorios Vinculados</span>
                    <span className="text-sm font-bold text-[#142b1f]">Loja y Galápagos</span>
                  </div>
                  <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Condiciones y Costo</span>
                    <span className="text-sm font-bold text-[#2E6B3F]">$20 USD por árbol (semilla, vivero, traslado, siembra y cuidado)</span>
                  </div>
                  <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Entregables Digitales</span>
                    <span className="text-sm font-semibold text-[#142b1f]">Certificado virtual personalizado + fotografía de la especie</span>
                  </div>
                  <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Trazabilidad y Visita</span>
                    <span className="text-sm font-semibold text-[#142b1f]">Ubicación georreferenciada en mapa web (hasta 1 mes) y visita física</span>
                  </div>
                </div>
              </div>

              {/* Simulador Interactivo B2C */}
              <div className="lg:col-span-5 bg-[#F7F2E6] border border-black/15 p-6 sm:p-8 space-y-6 rounded-none">
                <h4 className="text-lg font-extrabold text-[#142b1f] border-b border-black/10 pb-3">
                  Simula tu Adopción Viva
                </h4>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 block">
                    Cantidad de árboles:
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 3, 5, 10].map((num) => (
                      <button
                        key={num}
                        onClick={() => setTreeCount(num)}
                        className={`py-2.5 font-bold text-sm border transition-colors cursor-pointer rounded-none ${
                          treeCount === num
                            ? "bg-[#2E6B3F] text-white border-[#2E6B3F]"
                            : "bg-white text-[#142b1f] border-black/15 hover:border-[#2E6B3F]"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-black/10 p-4 space-y-2 rounded-none">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Aporte total ($20 c/u):</span>
                    <strong className="text-xl font-extrabold text-[#142b1f]">${treeCount * 20} USD</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs border-t border-black/10 pt-2">
                    <span className="text-neutral-500">Compensación estimada:</span>
                    <strong className="text-[#75B346] font-bold">~{co2TonsEstimated} ton CO₂</strong>
                  </div>
                </div>

                <a
                  href={`mailto:support@fapecuador.org?subject=Adopci%C3%B3n%20de%20${treeCount}%20%C3%A1rbol(es)%20FAP`}
                  className="w-full py-4 px-6 bg-[#B7D84B] hover:bg-[#b5e642] text-[#0c0e0b] font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors rounded-none"
                >
                  Adoptar {treeCount} {treeCount === 1 ? "Árbol" : "Árboles"} Ahora
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* MODALIDAD 2: VIAJEROS Y TURISMO SOSTENIBLE */}
          {activeModalidad === "viajeros" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start animate-fadeIn">
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#75B346]">
                    Carbon Offset Turístico
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#142b1f]">
                    Viajeros y Turismo Sostenible
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                    Para turistas nacionales, extranjeros y operadoras que transforman la huella de su viaje en restauración ecológica activa.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Zona 1: Loja */}
                  <div className="border border-black/15 p-5 bg-[#F7F2E6] space-y-3 rounded-none">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-[#2E6B3F] block">
                      Zona 1 · Loja
                    </span>
                    <h4 className="font-bold text-base text-[#142b1f]">Recuperación Post-Incendios</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Restauración de bosques afectados por tala e incendios (meta <strong>~1.400 ha</strong>). Vivero e invernadero en alianza con la <strong>U.E. &ldquo;Lic. Miguel Antoliano Salinas Jaramillo&rdquo;</strong> + talleres educativos.
                    </p>
                  </div>

                  {/* Zona 2: Galápagos */}
                  <div className="border border-black/15 p-5 bg-[#F7F2E6] space-y-3 rounded-none">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-[#2E6B3F] block">
                      Zona 2 · Galápagos (Santa Cruz)
                    </span>
                    <h4 className="font-bold text-base text-[#142b1f]">Siembra Vivencial de Scalesia</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Control de especies invasoras mediante siembra de <strong>Scalesia</strong>. Incluye <strong>experiencia vivencial</strong> donde el viajero siembra personalmente su árbol.
                    </p>
                  </div>
                </div>

                <div className="border-l-2 border-[#75B346] pl-4 py-1">
                  <span className="text-xs font-bold uppercase text-[#2E6B3F] block">Respaldo Internacional</span>
                  <p className="text-sm font-semibold text-[#142b1f]">
                    Caso de éxito junto a <strong>Responsible Travel</strong> y financiamiento de <strong>Kimkim</strong>.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-5">
                <div className="aspect-[4/3] overflow-hidden border border-black/15 rounded-none">
                  <img
                    src={getImageSrc(communityImage)}
                    alt="Turismo sostenible y siembra"
                    className="w-full h-full object-cover"
                  />
                </div>
                <a
                  href="mailto:support@fapecuador.org?subject=Compensaci%C3%B3n%20de%20Huella%20de%20Viaje%20%2F%20Operadora"
                  className="w-full py-4 px-6 bg-[#142b1f] hover:bg-[#2E6B3F] text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors rounded-none"
                >
                  Compensar Huella de Viaje / Alianza Operadoras
                  <ArrowUpRight className="w-4 h-4 text-[#B7D84B]" />
                </a>
              </div>
            </div>
          )}

          {/* MODALIDAD 3: PROGRAMAS CORPORATIVOS (B2B) */}
          {activeModalidad === "b2b" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start animate-fadeIn">
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#75B346]">
                    Empresas Locales e Internacionales
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#142b1f]">
                    Programas Corporativos (B2B)
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                    Diseñado para organizaciones que compensan su huella operativa, involucran a sus equipos y cumplen metas verificables de RSC.
                  </p>
                </div>

                <div className="divide-y divide-black/10 border-t border-b border-black/10">
                  <div className="py-3.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2E6B3F] block">Sedes Permanentes</span>
                    <p className="text-sm font-semibold text-[#142b1f]">Loja y Galápagos (aportes a distancia o patrocinio de lotes completos).</p>
                  </div>
                  <div className="py-3.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2E6B3F] block">Cobertura Nacional</span>
                    <p className="text-sm font-semibold text-[#142b1f]">Pichincha y otros sectores estratégicos para jornadas presenciales de siembra.</p>
                  </div>
                  <div className="py-3.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2E6B3F] block">Beneficios Corporativos</span>
                    <p className="text-sm font-semibold text-[#142b1f]">Paquetes por colaborador, reportes de impacto ambiental y team building sostenible.</p>
                  </div>
                </div>
              </div>

              {/* Formulario rápido B2B (Sin bordes redondos) */}
              <div className="lg:col-span-6 bg-[#F7F2E6] border border-black/15 p-6 sm:p-8 rounded-none">
                <h4 className="text-lg font-extrabold text-[#142b1f] mb-4">
                  Solicitar Cotización Corporativa a Medida
                </h4>
                {b2bSent ? (
                  <div className="p-6 bg-[#142b1f] text-white space-y-2 rounded-none">
                    <p className="font-bold text-[#B7D84B]">¡Solicitud registrada!</p>
                    <p className="text-xs text-white/80">
                      Nuestro equipo técnico se contactará contigo a la brevedad. También puedes escribir directamente a <strong>support@fapecuador.org</strong>.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setB2bSent(true);
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        required
                        placeholder="Nombre de la empresa"
                        className="w-full px-4 py-3 bg-white border border-black/15 text-sm focus:outline-none focus:border-[#2E6B3F] rounded-none"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Correo corporativo"
                        className="w-full px-4 py-3 bg-white border border-black/15 text-sm focus:outline-none focus:border-[#2E6B3F] rounded-none"
                      />
                    </div>
                    <select
                      className="w-full px-4 py-3 bg-white border border-black/15 text-sm focus:outline-none focus:border-[#2E6B3F] rounded-none"
                    >
                      <option value="lote">Patrocinio de lotes (Loja / Galápagos)</option>
                      <option value="jornada">Jornada presencial de siembra (Pichincha)</option>
                      <option value="colaboradores">Paquetes de árboles por colaborador</option>
                    </select>
                    <button
                      type="submit"
                      className="w-full py-4 px-6 bg-[#2E6B3F] hover:bg-[#142b1f] text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer rounded-none"
                    >
                      Solicitar Cotización B2B
                      <ArrowUpRight className="w-4 h-4 text-[#B7D84B]" />
                    </button>
                  </form>
                )}
                <p className="text-[11px] text-neutral-500 mt-3 text-center">
                  Contacto directo: <strong>support@fapecuador.org</strong>
                </p>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. TRANSPARENCIA Y SEGUIMIENTO (CIERRE DE PÁGINA) */}
      {/* ============================================================== */}
      <section id="transparencia" className="py-20 px-6 sm:px-12 lg:px-16 max-w-[1400px] mx-auto border-t border-black/10">
        
        <div className="mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#2E6B3F]">
            <span className="w-2 h-2 bg-[#2E6B3F]" />
            Transparencia y Seguimiento
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#142b1f]">
            Zonas plantadas &amp; <span className="text-[#75B346]">bitácora en territorio</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Mapa de las Zonas Plantadas (Galápagos, Loja y Pichincha) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap gap-2">
              {plantedZones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setActiveZoneId(zone.id)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer rounded-none ${
                    activeZoneId === zone.id
                      ? "bg-[#142b1f] text-[#B7D84B] border-[#142b1f]"
                      : "bg-white text-[#142b1f] border-black/15 hover:border-[#2E6B3F]"
                  }`}
                >
                  {zone.name}
                </button>
              ))}
            </div>

            <EcuadorMap
              projects={plantedZones}
              activeProjectId={activeZoneId}
              onSelectProject={(proj) => setActiveZoneId(proj.id)}
            />

            <div className="bg-white border border-black/15 p-5 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#75B346] block">
                  Perímetro Activo · {activeZone.place}
                </span>
                <h3 className="text-lg font-extrabold text-[#142b1f]">{activeZone.name}</h3>
                <p className="text-xs text-neutral-600">{activeZone.detail}</p>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 bg-[#F7F2E6] border border-black/10 text-[#2E6B3F] shrink-0 rounded-none">
                {activeZone.species}
              </span>
            </div>
          </div>

          {/* Bitácora de Avances (Línea de Tiempo Dinámica) */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xl font-extrabold text-[#142b1f] border-b border-black/15 pb-3">
              Bitácora de Avances
            </h3>

            <div className="border-l-2 border-[#2E6B3F]/30 pl-6 space-y-6">
              {timelineMilestones.map((item) => {
                const isActive = activeTimelineId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveTimelineId(item.id)}
                    className={`relative p-5 border transition-all cursor-pointer rounded-none ${
                      isActive
                        ? "bg-white border-[#2E6B3F] shadow-sm"
                        : "bg-transparent border-black/10 hover:bg-white/60"
                    }`}
                  >
                    {/* Indicador cuadrado en la línea de tiempo */}
                    <span
                      className={`absolute -left-[31px] top-6 w-3 h-3 border-2 transition-colors rounded-none ${
                        isActive ? "bg-[#B7D84B] border-[#142b1f]" : "bg-[#F7F2E6] border-[#2E6B3F]"
                      }`}
                    />
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#75B346]">
                        {item.date}
                      </span>
                      <span className="text-[11px] font-extrabold text-[#142b1f] bg-[#F7F2E6] px-2 py-0.5 border border-black/10">
                        {item.metric}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[#142b1f] mb-1">{item.title}</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">{item.summary}</p>
                  </div>
                );
              })}
            </div>

            {/* Galería rápida de respaldo en campo */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="aspect-square overflow-hidden rounded-none border border-black/10">
                <img src={getImageSrc(storyImage)} alt="Seguimiento en campo" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square overflow-hidden rounded-none border border-black/10">
                <img src={getImageSrc(seedlingPhotoImage)} alt="Vivero comunitario" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER MINIMALISTA */}
      <footer className="bg-[#0c0e0b] text-white/70 py-10 px-6 sm:px-12 lg:px-16 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span>&copy; {new Date().getFullYear()} Fundación Amazonía Productiva (FAP) &bull; Reforestación y Carbon Offset</span>
          <Link href="/" className="text-[#B7D84B] font-bold hover:underline">
            ← Regresar a la página principal
          </Link>
        </div>
      </footer>

    </main>
  );
}
