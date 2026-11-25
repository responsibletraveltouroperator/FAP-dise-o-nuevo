"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import type { MapProject } from "@/components/EcuadorMap";

const accionHero = "/imagenes/Acciones%20FAP/20231028_084735.webp";
const accionVivero = "/imagenes/Acciones%20FAP/IMG_4037.webp";
const accionViajeros = "/imagenes/Acciones%20FAP/_MG_0083.webp";
const accionEmpresas = "/imagenes/Acciones%20FAP/IMG_6511.webp";
const accionPuce = "/imagenes/Acciones%20FAP/IMG_4030.webp";
const accionMilArboles = "/imagenes/Acciones%20FAP/IMG_1197.webp";
const accionScalesia = "/imagenes/Acciones%20FAP/_MG_0056.webp";
const accionOffset = "/imagenes/Acciones%20FAP/_MG_0022.webp";
const accionLoja1 = "/imagenes/Acciones%20FAP/IMG_4102.webp";
const accionLoja2 = "/imagenes/Acciones%20FAP/IMG_1029.webp";
const accionPichincha1 = "/imagenes/Acciones%20FAP/_MG_0057.webp";
const accionPichincha2 = "/imagenes/Acciones%20FAP/IMG_1207.webp";
const accionGalapagos1 = "/imagenes/Acciones%20FAP/IMG_6317.webp";
const accionGalapagos2 = "/imagenes/Acciones%20FAP/IMG-20250301-WA0016.webp";

const EcuadorMap = dynamic(() => import("@/components/EcuadorMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[1.06/1] max-w-[780px] bg-[#E6D3B8] flex items-center justify-center text-sm font-bold text-[#6B3E1F] animate-pulse">
      Cargando regiones de siembra...
    </div>
  ),
});

const IsolatedProvincesRow = dynamic(
  () => import("@/components/EcuadorMap").then((mod) => mod.IsolatedProvincesRow),
  { ssr: false }
);
const ProvinceReliefGraphic = dynamic(
  () => import("@/components/EcuadorMap").then((mod) => mod.ProvinceReliefGraphic),
  { ssr: false }
);
const EcuadorMiniLocatorMap = dynamic(
  () => import("@/components/EcuadorMap").then((mod) => mod.EcuadorMiniLocatorMap),
  { ssr: false }
);

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

type ModalidadId = "b2c" | "viajeros" | "b2b";

const modalidades: {
  id: ModalidadId;
  index: string;
  kicker: string;
  title: string;
  line: string;
  accent: string;
}[] = [
  {
    id: "b2c",
    index: "01",
    kicker: "Personas y regalos",
    title: "Adopción individual",
    line: "Un árbol con certificado, foto y coordenada.",
    accent: "#75B346",
  },
  {
    id: "viajeros",
    index: "02",
    kicker: "Turismo sostenible",
    title: "Viajeros y offset",
    line: "La huella del viaje se convierte en siembra.",
    accent: "#2E6B3F",
  },
  {
    id: "b2b",
    index: "03",
    kicker: "Empresas",
    title: "Programas corporativos",
    line: "Lotes, jornadas y reportes de impacto.",
    accent: "#6B3E1F",
  },
];

const plantedZones: (MapProject & { detail: string; species: string; short: string })[] = [
  {
    id: "galapagos",
    name: "Galápagos (Santa Cruz)",
    short: "Galápagos",
    category: "proyectos",
    place: "Santa Cruz, Galápagos",
    tag: "Control de invasoras & Scalesia",
    lng: -90.31,
    lat: -0.74,
    detail: "Perímetro de restauración insular con control de especies invasoras y siembra vivencial de Scalesia.",
    species: "Scalesia pedunculata",
  },
  {
    id: "loja-fincas",
    name: "Loja (Fincas y Vivero Escolar)",
    short: "Loja",
    category: "proyectos",
    place: "Loja / Quilanga",
    tag: "Meta ~1.400 ha afectadas",
    lng: -79.4,
    lat: -4.25,
    detail: "Recuperación de bosques afectados por tala e incendios junto a fincas locales y la U.E. Lic. Miguel Antoliano Salinas Jaramillo.",
    species: "Especies nativas andinas",
  },
  {
    id: "pichincha-zonas",
    name: "Pichincha (Varias Zonas)",
    short: "Pichincha",
    category: "empresas",
    place: "Pichincha",
    tag: "Jornadas presenciales B2B",
    lng: -78.4678,
    lat: -0.1807,
    detail: "Cobertura nacional para jornadas corporativas presenciales, team building sostenible y seguimiento técnico.",
    species: "Bosque protector altoandino",
  },
];

const highlightRegions = [
  { id: "galapagos", province: "Galápagos" },
  { id: "loja-fincas", province: "Loja" },
  { id: "pichincha-zonas", province: "Pichincha" },
];

type MapPin = { id: string; lng: number; lat: number };

function cluster(id: string, lng: number, lat: number, count: number, spread: number): MapPin[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2;
    const ring = index % 2 === 0 ? spread : spread * 0.55;
    return {
      id: `${id}-${index}`,
      lng: lng + Math.cos(angle) * ring,
      lat: lat + Math.sin(angle) * ring * 0.7,
    };
  });
}

const timelineMilestones: {
  id: string;
  date: string;
  title: string;
  summary: string;
  metric: string;
  zoneId: string;
  pins: MapPin[];
  img: string | { src: string };
}[] = [
  {
    id: "puce",
    date: "Hito académico y campo",
    title: "Jornadas de siembra\njunto a la PUCE",
    summary: "Estudiantes y voluntarios aplicaron Hidrokeeper y levantaron el registro técnico en territorio.",
    metric: "+450 plántulas",
    zoneId: "loja-fincas",
    pins: cluster("puce", -79.4, -4.25, 5, 0.22),
    img: accionPuce,
  },
  {
    id: "vivero",
    date: "Vivero escolar",
    title: "Invernadero escolar\nen Loja",
    summary: "Con la U.E. Miguel Antoliano Salinas Jaramillo producimos la planta que sale a fincas afectadas.",
    metric: "Loja",
    zoneId: "loja-fincas",
    pins: cluster("vivero", -79.32, -4.18, 4, 0.14),
    img: accionVivero,
  },
  {
    id: "mil-arboles",
    date: "Hito territorial",
    title: "Más de mil árboles\ngeorreferenciados",
    summary: "Cada árbol adoptado queda con foto, coordenada y cuidado a 5 años en las zonas marcadas.",
    metric: "1.000+ árboles",
    zoneId: "",
    pins: [
      ...cluster("mil-loja", -79.4, -4.25, 7, 0.32),
      ...cluster("mil-pichincha", -78.47, -0.18, 7, 0.2),
      ...cluster("mil-galapagos", -90.35, -0.64, 5, 0.12),
    ],
    img: accionMilArboles,
  },
  {
    id: "scalesia",
    date: "Santa Cruz",
    title: "Siembra de Scalesia\nen Galápagos",
    summary: "En Galápagos el viajero planta su propio árbol dentro del perímetro de restauración.",
    metric: "Galápagos",
    zoneId: "galapagos",
    pins: cluster("scalesia", -90.35, -0.64, 6, 0.1),
    img: accionScalesia,
  },
  {
    id: "carbon-offset",
    date: "Reporte de impacto",
    title: "Reportes verificados\nde Carbon Offset",
    summary: "Alianzas con Responsible Travel, Kimkim y empresas locales para compensar huella.",
    metric: "416.6 ton CO₂ ref.",
    zoneId: "",
    pins: [
      { id: "off-loja", lng: -79.4, lat: -4.25 },
      { id: "off-pichincha", lng: -78.47, lat: -0.18 },
      { id: "off-galapagos", lng: -90.35, lat: -0.64 },
    ],
    img: accionOffset,
  },
];

const allPlantedPins: MapPin[] = [
  ...cluster("base-loja", -79.4, -4.25, 9, 0.34),
  ...cluster("base-pichincha", -78.47, -0.18, 8, 0.22),
  ...cluster("base-galapagos", -90.35, -0.64, 7, 0.13),
];

const zoneGallery: Record<string, { img: string | { src: string }; alt: string }[]> = {
  "loja-fincas": [
    { img: accionLoja1, alt: "Recuperación en Loja" },
    { img: accionVivero, alt: "Vivero en Loja" },
    { img: accionLoja2, alt: "Jornada en Loja" },
  ],
  "pichincha-zonas": [
    { img: accionPichincha1, alt: "Jornada en Pichincha" },
    { img: accionPichincha2, alt: "Equipo en Pichincha" },
    { img: accionEmpresas, alt: "Siembra en Pichincha" },
  ],
  galapagos: [
    { img: accionGalapagos1, alt: "Siembra en Galápagos" },
    { img: accionScalesia, alt: "Plántula en Galápagos" },
    { img: accionGalapagos2, alt: "Territorio en Galápagos" },
  ],
};

const TIMELINE_VISIBLE = 3;

const guarantees = [
  {
    index: "01",
    kicker: "Hidrokeeper",
    title: "Polímero biodegradable",
    text: "Retención de agua y nutrientes en las raíces desde la siembra.",
  },
  {
    index: "02",
    kicker: "Cuidado a 5 años",
    title: "Supervivencia garantizada",
    text: "Monitoreo, limpieza de malezas y resiembra durante los primeros 5 años.",
  },
  {
    index: "03",
    kicker: "Economía popular",
    title: "Gestión comunitaria",
    text: "Mano de obra y viveros gestionados por las comunidades locales.",
  },
];

const fieldClass = "w-full px-4 py-3 bg-[#E6D3B8] text-[#142b1f] text-sm focus:outline-none";

function IconWrap({ children }: { children: ReactNode }) {
  return <span className="mt-0.5 shrink-0 text-[#2E6B3F]">{children}</span>;
}

function SvgIcon({ children }: { children: ReactNode }) {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

function IconDrop() {
  return <SvgIcon><path d="M12 3s6 7 6 11a6 6 0 1 1-12 0c0-4 6-11 6-11z" /></SvgIcon>;
}
function IconCalendar() {
  return <SvgIcon><rect x="4" y="5" width="16" height="15" /><path d="M8 3v4M16 3v4M4 10h16" /></SvgIcon>;
}
function IconPeople() {
  return <SvgIcon><path d="M9 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3zM16 11a2.5 2.5 0 1 0-2.5-2.5A2.5 2.5 0 0 0 16 11zM3.5 19a5.5 5.5 0 0 1 11 0M14 19a4.5 4.5 0 0 1 6.5-4" /></SvgIcon>;
}
function IconPin() {
  return <SvgIcon><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.2" /></SvgIcon>;
}
function IconCoin() {
  return <SvgIcon><ellipse cx="12" cy="7" rx="7" ry="3" /><path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" /></SvgIcon>;
}
function IconBadge() {
  return <SvgIcon><circle cx="12" cy="9" r="5" /><path d="M9 13.5 8 21l4-2 4 2-1-7.5" /></SvgIcon>;
}
function IconCamera() {
  return <SvgIcon><path d="M4 8h3l2-2h6l2 2h3v11H4z" /><circle cx="12" cy="13" r="3" /></SvgIcon>;
}
function IconTree() {
  return <SvgIcon><path d="M12 21V11M12 13c-4 0-6-2.2-6-4.5S9 4 12 7c3-3 6-.2 6 1.5S16 13 12 13z" /></SvgIcon>;
}
function IconSchool() {
  return <SvgIcon><path d="M3 10 12 5l9 5-9 5zM7 12v5c0 1 2.2 2.5 5 2.5s5-1.5 5-2.5v-5" /></SvgIcon>;
}
function IconLeaf() {
  return <SvgIcon><path d="M5 19C5 11 11 4 20 4 20 13 13 19 5 19z" /><path d="M9 15c2-2 4-5 6-8" /></SvgIcon>;
}
function IconHand() {
  return <SvgIcon><path d="M8 13V6.5a1.5 1.5 0 0 1 3 0V12M11 11V5.5a1.5 1.5 0 0 1 3 0V12M14 11.5V7.5a1.5 1.5 0 0 1 3 0V14c0 4-2 6.5-6 6.5-3 0-5-2-5.5-4L4 14.5a1.5 1.5 0 0 1 2.2-2L8 14" /></SvgIcon>;
}
function IconBuilding() {
  return <SvgIcon><path d="M4 20h16M6 20V6l6-3 6 3v14M10 10h.01M14 10h.01M10 14h.01M14 14h.01" /></SvgIcon>;
}
function IconChart() {
  return <SvgIcon><path d="M4 19h16M7 16v-4M12 16V8M17 16v-6" /></SvgIcon>;
}
function IconScale() {
  return <SvgIcon><path d="M12 4v16M8 20h8M12 6l6 3-6 3-6-3z" /></SvgIcon>;
}

function Fact({ icon, label, text, extra }: { icon: ReactNode; label: string; text: string; extra?: ReactNode }) {
  return (
    <div className="flex gap-3">
      <IconWrap>{icon}</IconWrap>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#75B346]">{label}</p>
        <p className="mt-1 text-sm font-semibold text-[#6B3E1F] leading-snug">{text}</p>
        {extra}
      </div>
    </div>
  );
}

function IconForm() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3h6l4 4v14H8z" />
      <path d="M14 3v4h4M10 12h6M10 16h6" />
    </svg>
  );
}

function ThemeSwap({ open, label, onOpen, copy, form }: { open: boolean; label: string; onOpen: () => void; copy: ReactNode; form: ReactNode }) {
  return (
    <div className="grid">
      <div className={`col-start-1 row-start-1 transition-all duration-[900ms] ease-in-out ${open ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100"}`}>
        {copy}
        <div className="mt-8 text-center">
          <button type="button" onClick={onOpen} className="inline-flex cursor-pointer items-center gap-2 bg-[#6B3E1F] px-6 py-3 text-sm font-extrabold uppercase tracking-widest text-white">
            <IconForm />
            {label}
          </button>
        </div>
      </div>
      <div className={`col-start-1 row-start-1 transition-all duration-[900ms] ease-in-out ${open ? "opacity-100" : "pointer-events-none -translate-y-3 opacity-0"}`}>
        {form}
      </div>
    </div>
  );
}

function MapLink({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="mt-2 text-xs font-bold uppercase tracking-wider text-[#2E6B3F] cursor-pointer">
      Ver en el mapa
    </button>
  );
}

function Photo({ src, alt, className = "", blurred = false }: { src: string | { src: string }; alt: string; className?: string; blurred?: boolean }) {
  return (
    <div className={`relative aspect-[4/3] lg:aspect-auto lg:h-full w-full overflow-hidden ${className}`}>
      <img
        src={getImageSrc(src)}
        alt={alt}
        className={`absolute inset-0 h-full w-full object-cover transition-[filter] duration-[900ms] ease-in-out ${blurred ? "blur-md" : ""}`}
      />
    </div>
  );
}

function AdopcionBlock({ onMap }: { onMap: (zoneId: string) => void }) {
  const [sent, setSent] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const co2 = (Math.max(1, qty) * 0.16664).toFixed(2);

  return (
    <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-0 min-h-[inherit]">
      <Photo src={accionVivero} alt="Plántula en vivero" blurred={formOpen} />
      <div className="px-6 sm:px-10 lg:px-12 py-8 flex flex-col justify-center">
        <ThemeSwap
          open={formOpen}
          label="Adoptar un árbol"
          onOpen={() => setFormOpen(true)}
          copy={
            <>
        <p className="text-xs font-bold uppercase tracking-wider text-[#75B346]">Personas naturales y regalos vivos</p>
        <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#6B3E1F]">Adopción individual o regalo perdurable</h3>
        <p className="mt-3 text-sm sm:text-base text-[#6B3E1F]/85 leading-relaxed">
          Para quien restaura el país de forma directa o entrega un regalo con vida y trazabilidad real.
        </p>
        <div className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-5">
          <Fact icon={<IconPin />} label="Territorios" text="Loja y Galápagos" extra={<MapLink onClick={() => onMap("loja-fincas")} />} />
          <Fact icon={<IconCoin />} label="Costo" text="$20 USD por árbol: semilla, vivero, traslado, siembra y cuidado." />
          <Fact icon={<IconBadge />} label="Certificado" text="Virtual, personalizado y con el nombre de quien adopta." />
          <Fact icon={<IconCamera />} label="Fotografía" text="Una foto de la especie que quedó sembrada." />
          <Fact icon={<IconPin />} label="En el mapa" text="La coordenada aparece en la web en hasta un mes." />
          <Fact icon={<IconHand />} label="Visita" text="También puedes ir a ver el árbol en territorio." />
        </div>
            </>
          }
          form={
            <>
          {sent ? (
            <p className="mt-3 text-sm text-[#6B3E1F]">Recibimos tus datos. El equipo escribe a tu correo para cerrar la adopción de {qty} {qty === 1 ? "árbol" : "árboles"}.</p>
          ) : (
            <form
              className="mt-4 space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                const nombre = String(data.get("nombre") || "");
                const correo = String(data.get("correo") || "");
                const nota = String(data.get("nota") || "");
                const body = `Nombre: ${nombre}\nCorreo: ${correo}\nÁrboles: ${qty}\nAporte: $${qty * 20} USD\nNota: ${nota}`;
                window.location.href = `mailto:support@fapecuador.org?subject=${encodeURIComponent(`Adopción de ${qty} árbol(es) FAP`)}&body=${encodeURIComponent(body)}`;
                setSent(true);
              }}
            >
              <input required name="nombre" type="text" placeholder="Nombre de quien adopta" className={fieldClass} />
              <input required name="correo" type="email" placeholder="Correo" className={fieldClass} />
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B3E1F]">
                Cantidad de árboles
                <input
                  required
                  name="cantidad"
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(event) => setQty(Math.max(1, Number(event.target.value) || 1))}
                  className={`${fieldClass} mt-1`}
                />
              </label>
              <p className="text-sm text-[#6B3E1F]">Aporte <strong className="text-[#142b1f]">${qty * 20} USD</strong> · ~{co2} ton CO₂</p>
              <textarea name="nota" rows={3} placeholder="Dedicatoria o mensaje" className={fieldClass} />
              <button type="submit" className="inline-flex items-center gap-2 py-3 px-5 bg-[#6B3E1F] text-white font-extrabold text-sm uppercase tracking-wider cursor-pointer">
                Enviar adopción
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          )}
            <button type="button" onClick={() => setFormOpen(false)} className="mt-4 cursor-pointer text-xs font-bold uppercase tracking-widest text-[#75B346]">
              Volver al texto
            </button>
            </>
          }
        />
      </div>
    </div>
  );
}

function ViajerosBlock({ onMap }: { onMap: (zoneId: string) => void }) {
  const [sent, setSent] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  return (
    <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-0 min-h-[inherit]">
      <div className="px-6 sm:px-10 lg:px-12 py-8 order-2 lg:order-1 flex flex-col justify-center">
        <ThemeSwap
          open={formOpen}
          label="Compensar el viaje"
          onOpen={() => setFormOpen(true)}
          copy={
            <>
        <p className="text-xs font-bold uppercase tracking-wider text-[#75B346]">Carbon offset turístico</p>
        <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#6B3E1F]">Viajeros y turismo sostenible</h3>
        <p className="mt-3 text-sm sm:text-base text-[#6B3E1F]/85 leading-relaxed">
          Para viajeros y operadoras que convierten la huella del trayecto en restauración activa.
        </p>
        <div className="mt-6 space-y-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#75B346]">Zona 1 · Loja</p>
            <div className="mt-3 grid gap-4">
              <Fact icon={<IconTree />} label="Bosques" text="Recuperación de bosques afectados por tala e incendios. Meta ~1.400 ha." />
              <Fact icon={<IconSchool />} label="Vivero escolar" text="Vivero e invernadero con la U.E. Lic. Miguel Antoliano Salinas Jaramillo, más talleres." extra={<MapLink onClick={() => onMap("loja-fincas")} />} />
            </div>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#75B346]">Zona 2 · Santa Cruz</p>
            <div className="mt-3 grid gap-4">
              <Fact icon={<IconLeaf />} label="Scalesia" text="Control de especies invasoras con siembra de Scalesia." />
              <Fact icon={<IconHand />} label="Vivencia" text="El viajero siembra personalmente su árbol." extra={<MapLink onClick={() => onMap("galapagos")} />} />
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-[#6B3E1F]/25 pt-5">
          <Fact icon={<IconBadge />} label="Respaldo externo" text="Caso de éxito con Responsible Travel y financiamiento de Kimkim. No pertenece a una zona de siembra." />
        </div>
            </>
          }
          form={
            <>
          {sent ? (
            <p className="mt-3 text-sm text-[#6B3E1F]">Recibimos tus datos. FAP escribe para coordinar la compensación del viaje.</p>
          ) : (
            <form
              className="mt-4 space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                const body = `Nombre: ${data.get("nombre")}\nCorreo: ${data.get("correo")}\nPerfil: ${data.get("perfil")}\nZona: ${data.get("zona")}\nNota: ${data.get("nota")}`;
                window.location.href = `mailto:support@fapecuador.org?subject=${encodeURIComponent("Compensación de huella de viaje")}&body=${encodeURIComponent(body)}`;
                setSent(true);
              }}
            >
              <input required name="nombre" type="text" placeholder="Nombre" className={fieldClass} />
              <input required name="correo" type="email" placeholder="Correo" className={fieldClass} />
              <select name="perfil" className={fieldClass}>
                <option value="Viajero">Viajero</option>
                <option value="Operadora">Operadora</option>
              </select>
              <select name="zona" className={fieldClass}>
                <option value="Loja">Loja</option>
                <option value="Santa Cruz">Santa Cruz, Galápagos</option>
              </select>
              <textarea name="nota" rows={3} placeholder="Fechas, grupo o ruta" className={fieldClass} />
              <button type="submit" className="inline-flex items-center gap-2 py-3 px-5 bg-[#6B3E1F] text-white font-extrabold text-sm uppercase tracking-wider cursor-pointer">
                Enviar
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          )}
            <button type="button" onClick={() => setFormOpen(false)} className="mt-4 cursor-pointer text-xs font-bold uppercase tracking-widest text-[#75B346]">
              Volver al texto
            </button>
            </>
          }
        />
      </div>
      <Photo src={accionViajeros} alt="Jornada de siembra con viajeros" className="order-1 lg:order-2" blurred={formOpen} />
    </div>
  );
}

function EmpresasBlock({ onMap }: { onMap: (zoneId: string) => void }) {
  const [sent, setSent] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  return (
    <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-0 min-h-[inherit]">
      <Photo src={accionEmpresas} alt="Jornada corporativa en territorio" blurred={formOpen} />
      <div className="px-6 sm:px-10 lg:px-12 py-8 flex flex-col justify-center">
        <ThemeSwap
          open={formOpen}
          label="Cotizar el programa"
          onOpen={() => setFormOpen(true)}
          copy={
            <>
        <p className="text-xs font-bold uppercase tracking-wider text-[#75B346]">Empresas locales e internacionales</p>
        <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#6B3E1F]">Programas corporativos</h3>
        <p className="mt-3 text-sm sm:text-base text-[#6B3E1F]/85 leading-relaxed">
          Para organizaciones que compensan su huella, involucran a sus equipos y necesitan metas verificables.
        </p>
        <div className="mt-6 grid gap-5">
          <Fact icon={<IconBuilding />} label="Sedes permanentes" text="Loja y Galápagos: aportes a distancia o patrocinio de lotes." extra={<MapLink onClick={() => onMap("galapagos")} />} />
          <Fact icon={<IconPin />} label="Cobertura nacional" text="Pichincha y otros sectores para jornadas presenciales de siembra." extra={<MapLink onClick={() => onMap("pichincha-zonas")} />} />
          <Fact icon={<IconChart />} label="Beneficios" text="Paquetes por colaborador, reportes de impacto y team building." />
        </div>
            </>
          }
          form={
            <>
          {sent ? (
            <p className="mt-3 text-sm text-[#6B3E1F]">Solicitud registrada. El equipo técnico escribe pronto. También puedes contactar a support@fapecuador.org.</p>
          ) : (
            <form
              className="mt-4 space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                const body = `Empresa: ${data.get("empresa")}\nCorreo: ${data.get("correo")}\nInterés: ${data.get("interes")}\nNota: ${data.get("nota")}`;
                window.location.href = `mailto:support@fapecuador.org?subject=${encodeURIComponent("Cotización corporativa FAP")}&body=${encodeURIComponent(body)}`;
                setSent(true);
              }}
            >
              <input required name="empresa" type="text" placeholder="Nombre de la empresa" className={fieldClass} />
              <input required name="correo" type="email" placeholder="Correo corporativo" className={fieldClass} />
              <select name="interes" className={fieldClass}>
                <option value="Patrocinio de lotes (Loja / Galápagos)">Patrocinio de lotes (Loja / Galápagos)</option>
                <option value="Jornada presencial de siembra (Pichincha)">Jornada presencial de siembra (Pichincha)</option>
                <option value="Paquetes de árboles por colaborador">Paquetes de árboles por colaborador</option>
              </select>
              <textarea required name="nota" rows={3} placeholder="Meta, equipo o plazo" className={fieldClass} />
              <button type="submit" className="py-3 px-5 bg-[#6B3E1F] text-white font-extrabold text-sm uppercase tracking-wider cursor-pointer">
                Enviar
              </button>
            </form>
          )}
            <button type="button" onClick={() => setFormOpen(false)} className="mt-4 cursor-pointer text-xs font-bold uppercase tracking-widest text-[#75B346]">
              Volver al texto
            </button>
            </>
          }
        />
      </div>
    </div>
  );
}

function guaranteeIcon(index: string) {
  if (index === "01") return <IconDrop />;
  if (index === "02") return <IconCalendar />;
  return <IconPeople />;
}

export default function RaicesProductivasPage() {
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
  const [statIndex, setStatIndex] = useState(0);
  const [openGuarantee, setOpenGuarantee] = useState<string | null>(null);
  const [focusIndex, setFocusIndex] = useState(0);
  const [hoveredHito, setHoveredHito] = useState<string | null>(null);
  const [timelinePaused, setTimelinePaused] = useState(false);
  const [dragDeltaX, setDragDeltaX] = useState(0);
  const [isDraggingTimeline, setIsDraggingTimeline] = useState(false);
  const dragStartXRef = useRef<number | null>(null);
  const dragMovedRef = useRef(false);
  const timelineBoxRef = useRef<HTMLDivElement | null>(null);

  const isolatedProvinceItems = [
    {
      id: "loja-fincas",
      title: "Loja",
      province: "Loja",
      subtitle: "Fincas locales y vivero escolar (meta ~1.400 ha).",
      treesLabel: "+450 plántulas · Meta ~1.400 ha",
      speciesLabel: "Especies nativas andinas",
      detail:
        "Recuperación de bosques afectados por tala e incendios junto a fincas locales y la U.E. Lic. Miguel Antoliano Salinas Jaramillo, con aplicación de Hidrokeeper.",
      pins: cluster("row-loja", -79.4, -4.25, 10, 0.36),
    },
    {
      id: "pichincha-zonas",
      title: "Pichincha",
      province: "Pichincha",
      subtitle: "Jornadas corporativas y restauración altoandina.",
      treesLabel: "1.000+ árboles georreferenciados",
      speciesLabel: "Bosque protector altoandino",
      detail:
        "Cobertura para jornadas corporativas presenciales, team building sostenible y seguimiento técnico con monitoreo a 5 años.",
      pins: cluster("row-pichincha", -78.47, -0.18, 9, 0.24),
    },
    {
      id: "galapagos",
      title: "Galápagos",
      province: "Galápagos",
      subtitle: "Santa Cruz: control de invasoras y siembra de Scalesia.",
      treesLabel: "Perímetro insular · Santa Cruz",
      speciesLabel: "Scalesia pedunculata",
      detail:
        "Restauración insular con control de especies invasoras y siembra vivencial donde cada viajero planta su propio árbol.",
      pins: cluster("row-galapagos", -90.35, -0.64, 8, 0.14),
    },
  ];
  const selectedZoneItem = isolatedProvinceItems.find((item) => item.id === activeZoneId) ?? null;

  useEffect(() => {
    const timer = setInterval(() => setStatIndex((current) => (current + 1) % 2), 3800);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timelinePaused) return;
    const timer = setInterval(() => {
      setFocusIndex((prev) => (prev + 1) % timelineMilestones.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [timelinePaused]);

  const openPlace = (zoneId: string) => {
    setActiveZoneId(zoneId);
    document.getElementById("transparencia")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const focusEvent = timelineMilestones[focusIndex];
  const windowStart = Math.min(
    Math.max(0, timelineMilestones.length - TIMELINE_VISIBLE),
    Math.max(0, focusIndex - 1),
  );
  const jumpToHito = (index: number) => {
    setFocusIndex(index);
  };

  return (
    <main className="relative min-h-screen bg-[#F7F2E6] text-[#10120f] selection:bg-[#B7D84B] selection:text-black">
      <SiteHeader />

      <section id="respaldo" className="relative min-h-[92vh] flex items-end overflow-hidden bg-[#142b1f] text-white">
        <img
          src={accionHero}
          alt="Bosque en restauración"
          className="absolute inset-0 h-full w-full object-cover animate-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#142b1f]/45 via-[#142b1f]/15 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#142b1f]/45 via-transparent to-transparent" />
        <div className="relative z-10 min-h-[92vh] w-full pt-36">
          <div className="absolute bottom-24 left-8 max-w-3xl sm:left-10 drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)]">
            <div className="overflow-hidden">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#E6D3B8] animate-line-reveal">
                <span className="w-2 h-2 bg-[#6B3E1F]" />
                Reforestación y compensación de carbono
              </div>
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
              <span className="block overflow-hidden pb-2">
                <span className="animate-line-reveal">Lo que no se puede reducir,</span>
              </span>
              <span className="block overflow-hidden pb-3">
                <span className="animate-line-reveal-delay-1 text-[#B7D84B]">se puede compensar.</span>
              </span>
            </h1>
          </div>
          <div className="absolute bottom-6 right-3 w-72 text-right sm:right-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
            {statIndex === 0 ? (
              <div key="fijacion" className="animate-fade-only">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E6D3B8]">Fijación por hectárea</span>
                <p className="text-3xl font-extrabold leading-tight">~4 a 8 ton CO₂/año</p>
                <p className="text-sm text-white/80">Bosque nuevo fija ~4 ton/año. Uno establecido llega a ~8.</p>
              </div>
            ) : (
              <div key="escala" className="animate-fade-only">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E6D3B8]">Referencia de escala</span>
                <p className="text-3xl sm:text-4xl font-extrabold">2.500 árboles</p>
                <p className="text-sm text-white/80">Equivalen a <strong>416.6 toneladas métricas</strong> compensadas.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 pb-6 pt-12 sm:px-10 lg:px-14 lg:pb-8 lg:pt-14">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#75B346]">
              <span className="w-2 h-2 bg-[#75B346]" />
              Garantía en territorio
            </div>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[#6B3E1F] sm:text-4xl">
              La planta crece con ciencia, cuidado y comunidad.
            </h2>
            <div className="mt-10 flex justify-center">
              {guarantees.slice(0, 1).map((item) => {
                const open = openGuarantee === item.index;
                return (
                  <article
                    key={item.index}
                    onMouseEnter={() => setOpenGuarantee(item.index)}
                    onMouseLeave={() => setOpenGuarantee(null)}
                    onClick={() => setOpenGuarantee(open ? null : item.index)}
                    className="w-full max-w-xs cursor-pointer py-2 text-center"
                  >
                    <span className="mx-auto flex justify-center text-[#2E6B3F]">{guaranteeIcon(item.index)}</span>
                    <span className="mt-2 block text-[11px] font-bold uppercase tracking-widest text-[#75B346]">{item.index} · {item.kicker}</span>
                    <h3 className={`mt-0.5 text-lg font-extrabold ${open ? "text-[#6B3E1F]" : "text-[#142b1f]"}`}>{item.title}</h3>
                    <span className={`mx-auto mt-2 block h-px bg-[#6B3E1F] transition-all duration-300 ${open ? "w-full" : "w-0"}`} />
                    <div className={`overflow-hidden transition-all duration-300 ${open ? "mt-2 max-h-32 opacity-100" : "max-h-0 opacity-0"}`}>
                      <p className="text-sm leading-relaxed text-[#6B3E1F]/85">{item.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {guarantees.slice(1).map((item) => {
                const open = openGuarantee === item.index;
                return (
                  <article
                    key={item.index}
                    onMouseEnter={() => setOpenGuarantee(item.index)}
                    onMouseLeave={() => setOpenGuarantee(null)}
                    onClick={() => setOpenGuarantee(open ? null : item.index)}
                    className="cursor-pointer py-2 text-center"
                  >
                    <span className="mx-auto flex justify-center text-[#2E6B3F]">{guaranteeIcon(item.index)}</span>
                    <span className="mt-2 block text-[11px] font-bold uppercase tracking-widest text-[#75B346]">{item.index} · {item.kicker}</span>
                    <h3 className={`mt-0.5 text-lg font-extrabold ${open ? "text-[#6B3E1F]" : "text-[#142b1f]"}`}>{item.title}</h3>
                    <span className={`mx-auto mt-2 block h-px bg-[#6B3E1F] transition-all duration-300 ${open ? "w-full" : "w-0"}`} />
                    <div className={`overflow-hidden transition-all duration-300 ${open ? "mt-2 max-h-32 opacity-100" : "max-h-0 opacity-0"}`}>
                      <p className="text-sm leading-relaxed text-[#6B3E1F]/85">{item.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
          <div className="relative flex min-h-[34rem] items-center justify-center overflow-hidden rounded-lg lg:min-h-[40rem]">
            <video
              key="planta-creciendo-mp4"
              src="/videos/planta%20creciendo.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="h-full min-h-[34rem] w-full object-cover lg:min-h-[40rem]"
            />
          </div>
        </div>
      </section>
      <section id="modalidades" className="relative z-20 pt-4 pb-12">
        <div className="px-6 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#6B3E1F]">
            <span className="w-2 h-2 bg-[#6B3E1F]" />
            Tres caminos
          </div>
        </div>

        <div className="mt-10 w-full space-y-10 pb-8">
          {modalidades.map((item, idx) => (
            <div
              key={item.id}
              className={`sticky w-full rounded-none border-2 border-[#6B3E1F]/45 bg-[#F7F2E6] shadow-[0_18px_40px_rgba(20,43,31,0.08)] flex items-stretch ${
                idx < 2
                  ? "top-20 min-h-[calc(100vh-5rem)]"
                  : "top-20 min-h-[76vh]"
              } ${idx === 0 ? "z-10" : idx === 1 ? "z-20" : "z-30"}`}
            >
              <div className="w-full min-h-[inherit]">
                {item.id === "b2c" && <AdopcionBlock onMap={openPlace} />}
                {item.id === "viajeros" && <ViajerosBlock onMap={openPlace} />}
                {item.id === "b2b" && <EmpresasBlock onMap={openPlace} />}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="transparencia"
        className="relative z-0 pt-20 pb-8"
      >
        <div className="bg-[#F7F2E6] px-4 py-4 sm:px-8 lg:px-12">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#75B346]">
                <span className="w-2 h-2 rounded-full bg-[#75B346]" />
                Zonas de siembra
              </div>
              <h2 className="mt-1 text-2xl font-extrabold leading-tight text-[#6B3E1F] sm:text-3xl">
                {selectedZoneItem
                  ? `${selectedZoneItem.title}: presencia y árboles sembrados.`
                  : "Loja, Pichincha y Galápagos en relieve · toca una región."}
              </h2>
            </div>
            {selectedZoneItem && (
              <button
                type="button"
                onClick={() => setActiveZoneId(null)}
                className="cursor-pointer border border-[#6B3E1F]/35 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-[#6B3E1F] transition-colors hover:bg-[#6B3E1F] hover:text-white"
              >
                Ver las 3 zonas
              </button>
            )}
          </div>

          {!selectedZoneItem ? (
            <IsolatedProvincesRow
              items={isolatedProvinceItems}
              activeId=""
              onSelect={(id) => setActiveZoneId(id)}
            />
          ) : selectedZoneItem.id === "loja-fincas" ? (
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3 animate-fade-only">
              <button
                type="button"
                onClick={() => setActiveZoneId(null)}
                className="flex flex-col items-center cursor-pointer"
              >
                <ProvinceReliefGraphic item={selectedZoneItem} isActive large />
                <span className="mt-2 text-xl font-extrabold text-[#142b1f]">{selectedZoneItem.title}</span>
              </button>
              <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-6 py-2">
                <EcuadorMiniLocatorMap activeProvince={selectedZoneItem.province} />
                <div className="space-y-3 text-left">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#75B346]">{selectedZoneItem.treesLabel}</p>
                  <h3 className="text-2xl font-extrabold text-[#6B3E1F]">{selectedZoneItem.title} · {selectedZoneItem.speciesLabel}</h3>
                  <p className="text-sm sm:text-base leading-relaxed text-[#6B3E1F]/85">{selectedZoneItem.detail}</p>
                </div>
              </div>
            </div>
          ) : selectedZoneItem.id === "pichincha-zonas" ? (
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3 animate-fade-only">
              <div className="flex flex-col items-center md:items-start gap-4 py-2">
                <EcuadorMiniLocatorMap activeProvince={selectedZoneItem.province} />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#75B346]">{selectedZoneItem.treesLabel}</p>
                  <p className="mt-1 text-lg font-extrabold text-[#6B3E1F]">{selectedZoneItem.speciesLabel}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveZoneId(null)}
                className="flex flex-col items-center cursor-pointer"
              >
                <ProvinceReliefGraphic item={selectedZoneItem} isActive large />
                <span className="mt-2 text-xl font-extrabold text-[#142b1f]">{selectedZoneItem.title}</span>
              </button>
              <div className="py-2 space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-[#75B346]">Cobertura territorial</p>
                <h3 className="text-2xl font-extrabold text-[#6B3E1F]">{selectedZoneItem.title}</h3>
                <p className="text-sm sm:text-base leading-relaxed text-[#6B3E1F]/85">{selectedZoneItem.detail}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3 animate-fade-only">
              <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-6 py-2 order-2 md:order-1">
                <EcuadorMiniLocatorMap activeProvince={selectedZoneItem.province} />
                <div className="space-y-3 text-left">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#75B346]">{selectedZoneItem.treesLabel}</p>
                  <h3 className="text-2xl font-extrabold text-[#6B3E1F]">{selectedZoneItem.title} · {selectedZoneItem.speciesLabel}</h3>
                  <p className="text-sm sm:text-base leading-relaxed text-[#6B3E1F]/85">{selectedZoneItem.detail}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveZoneId(null)}
                className="flex flex-col items-center cursor-pointer order-1 md:order-2"
              >
                <ProvinceReliefGraphic item={selectedZoneItem} isActive large />
                <span className="mt-2 text-xl font-extrabold text-[#142b1f]">{selectedZoneItem.title}</span>
              </button>
            </div>
          )}

          <div
            className="mt-14"
            onMouseEnter={() => setTimelinePaused(true)}
            onMouseLeave={() => setTimelinePaused(false)}
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h3 className="text-2xl font-extrabold text-[#6B3E1F]">Bitácora de avances</h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[#75B346]">
                  Línea de tiempo rotativa · pasa el ratón, toca o arrastra
                </p>
              </div>
              <div className="flex items-center gap-2">
                {timelineMilestones.map((m, idx) => (
                  <button
                    key={m.id}
                    type="button"
                    aria-label={`Ir al hito ${idx + 1}`}
                    onClick={() => jumpToHito(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === focusIndex ? "w-6 bg-[#75B346]" : "w-2 bg-[#6B3E1F]/30 hover:bg-[#6B3E1F]/60"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div
              ref={timelineBoxRef}
              className="relative mt-8 overflow-hidden select-none cursor-grab active:cursor-grabbing touch-pan-y"
              onPointerDown={(e) => {
                if ((e.target as HTMLElement).closest("button, a, input, select, textarea")) return;
                dragStartXRef.current = e.clientX;
                dragMovedRef.current = false;
                setIsDraggingTimeline(true);
                setTimelinePaused(true);
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (dragStartXRef.current === null) return;
                const delta = e.clientX - dragStartXRef.current;
                if (Math.abs(delta) > 6) dragMovedRef.current = true;
                setDragDeltaX(delta);
              }}
              onPointerUp={(e) => {
                if (dragStartXRef.current === null) return;
                const delta = e.clientX - dragStartXRef.current;
                if (delta < -45) {
                  setFocusIndex((prev) => Math.min(timelineMilestones.length - 1, prev + 1));
                } else if (delta > 45) {
                  setFocusIndex((prev) => Math.max(0, prev - 1));
                }
                dragStartXRef.current = null;
                setIsDraggingTimeline(false);
                setDragDeltaX(0);
                if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                  e.currentTarget.releasePointerCapture(e.pointerId);
                }
              }}
              onPointerCancel={() => {
                dragStartXRef.current = null;
                setIsDraggingTimeline(false);
                setDragDeltaX(0);
              }}
            >
              {/* Línea horizontal acotada entre el primer y tercer punto visible (sin tocar los bordes) */}
              <div className="pointer-events-none absolute top-1/2 left-[16.6667%] right-[16.6667%] h-px -translate-y-1/2 bg-[#6B3E1F]/25">
                <div
                  className={`h-[3px] -translate-y-[1px] bg-[#75B346] ${isDraggingTimeline ? "transition-none" : "transition-all duration-700"}`}
                  style={{
                    width: `${(() => {
                      const base = Math.min(2, Math.max(0, focusIndex - windowStart)) / 2;
                      const stepPx = (timelineBoxRef.current?.offsetWidth || 900) / 3;
                      const dragSteps = isDraggingTimeline ? -dragDeltaX / stepPx : 0;
                      const live = Math.min(1, Math.max(0, base + dragSteps * 0.5));
                      return live * 100;
                    })()}%`,
                  }}
                />
              </div>

              <div
                className={`relative flex ${isDraggingTimeline ? "transition-none" : "transition-transform duration-700 ease-out"}`}
                style={{
                  width: `${(timelineMilestones.length / TIMELINE_VISIBLE) * 100}%`,
                  transform: `translateX(calc(-${(windowStart / timelineMilestones.length) * 100}% + ${dragDeltaX}px))`,
                }}
              >
                {timelineMilestones.map((item, index) => {
                  const hovered = hoveredHito === item.id;
                  const active = index === focusIndex;
                  const showDetail = active || hovered;
                  const titleTop = index % 2 === 0;

                  const titleBlock = (
                    <div className="mx-auto max-w-[240px] text-center">
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-[#75B346]">
                        {item.date}
                      </span>
                      <p className={`mt-1 whitespace-pre-line text-base font-extrabold leading-tight transition-colors duration-300 ${showDetail ? "text-[#142b1f]" : "text-[#6B3E1F]"}`}>
                        {item.title}
                      </p>
                    </div>
                  );

                  const mediaBlock = (
                    <div className="mx-auto w-full max-w-[280px]">
                      <div className={`overflow-hidden transition-all duration-500 ${showDetail ? "scale-[1.06] shadow-lg" : "scale-95 opacity-85"}`}>
                        <img
                          src={getImageSrc(item.img)}
                          alt={item.title.replace(/\n/g, " ")}
                          className="aspect-[16/9] w-full object-cover"
                        />
                      </div>
                      <p
                        className={`overflow-hidden text-center text-xs leading-snug text-[#6B3E1F] transition-all duration-300 ${
                          showDetail ? "mt-2.5 max-h-16 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        {item.summary}
                      </p>
                    </div>
                  );

                  return (
                    <article
                      key={item.id}
                      className="flex flex-col items-center px-3 cursor-pointer"
                      style={{ width: `${100 / timelineMilestones.length}%` }}
                      onMouseEnter={() => setHoveredHito(item.id)}
                      onClick={() => {
                        if (!dragMovedRef.current) jumpToHito(index);
                      }}
                      onMouseLeave={() => setHoveredHito(null)}
                    >
                      {/* MITAD SUPERIOR (por encima de la línea centrada) */}
                      <div className="flex h-52 w-full flex-col items-center justify-end pb-4">
                        {titleTop ? titleBlock : mediaBlock}
                      </div>

                      {/* PUNTO SOBRE LA LÍNEA CENTRADA */}
                      <div className="relative z-10 flex h-6 items-center justify-center">
                        <span
                          className={`rounded-full transition-all duration-500 ${
                            active ? "h-5 w-5 ring-4 ring-[#75B346]/25" : "h-3.5 w-3.5"
                          } ${index <= focusIndex ? "bg-[#75B346]" : "bg-[#6B3E1F]"}`}
                        />
                      </div>

                      {/* MITAD INFERIOR (por debajo de la línea centrada) */}
                      <div className="flex h-52 w-full flex-col items-center justify-start pt-4">
                        {titleTop ? mediaBlock : titleBlock}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
