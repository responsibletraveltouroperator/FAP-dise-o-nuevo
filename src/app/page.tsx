"use client";

import { useState, useEffect, useRef, memo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import heroImage from "@/assets/fap-hero.jpg";
import communityImage from "@/assets/fap-community.jpg";
import seedlingImage from "@/assets/fap-seedling-new.png";
import seedlingPhotoImage from "@/assets/fap-seedling.jpg";
import storyImage from "@/assets/fap-story.jpg";
import nosotrosImg1 from "@/assets/fap-nosotros-1.webp";
import nosotrosImg2 from "@/assets/fap-nosotros-2.webp";
import nosotrosImg3 from "@/assets/fap-nosotros-3.webp";
import nosotrosImg4 from "@/assets/fap-nosotros-4.webp";
import nosotrosImg5 from "@/assets/fap-nosotros-5.webp";
import mapaEmpresasImg from "@/assets/fap-mapa-empresas.webp";
import mapaExperienciasImg from "@/assets/fap-mapa-experiencias.webp";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

const EcuadorMap = dynamic(() => import("@/components/EcuadorMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[1.12/1] max-w-[720px] flex items-center justify-center text-sm font-bold text-neutral-400 animate-pulse">
      Cargando relieve topográfico...
    </div>
  )
});

function getImageSrc(img: string | { src: string }): string {
  return typeof img === "string" ? img : img.src;
}

function AnimatedCounter({
  end,
  prefix = "",
  suffix = "",
  useDots = false,
  duration = 1600,
}: {
  end: number;
  prefix?: string;
  suffix?: string;
  useDots?: boolean;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime: number | null = null;
    let rafId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [hasStarted, end, duration]);

  const formatted = useDots
    ? count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    : count.toString();

  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

// Iconos directos en verde (SIN círculo de fondo)
function IconUser() {
  return (
    <svg className="w-6 h-6 text-[#75B346] shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg className="w-6 h-6 text-[#75B346] shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg className="w-6 h-6 text-[#75B346] shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 19h2V12H5v7zm4 0h2V9H9v10zm4 0h2V5h-2v14zm4 0h2v-8h-2v8z" />
    </svg>
  );
}

function IconLeaf() {
  return (
    <svg className="w-6 h-6 text-[#75B346] shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A9.45 9.45 0 0 0 17 8zm-7.5 5.5c2.3 0 4.2-1.9 4.2-4.2 0-.4-.1-.8-.2-1.1A8.9 8.9 0 0 0 9.5 13.5z" />
    </svg>
  );
}

function ChevronRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function ArrowUpRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M7 7h10v10" />
    </svg>
  );
}

function ArrowRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function CrossfadeImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [layers, setLayers] = useState<{ src: string; alt: string; id: number }[]>([
    { src, alt, id: 0 },
  ]);

  useEffect(() => {
    setLayers((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.src === src) return prev;
      return [...prev.slice(-1), { src, alt, id: Date.now() + Math.random() }];
    });
  }, [src, alt]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {layers.map((layer, idx) => (
        <img
          key={layer.id}
          src={layer.src}
          alt={layer.alt}
          className={`absolute inset-0 w-full h-full object-cover ${
            idx > 0 ? "animate-crossfade" : ""
          } ${className}`}
        />
      ))}
    </div>
  );
}

// Estructura de Proyectos y Categorías para el Mapa
type ThemeCategory = "conservacion" | "desarrollo" | "cultura";

interface ProjectItem {
  id: string;
  name: string;
  category: "proyectos" | "experiencias" | "empresas";
  themeCategory?: ThemeCategory;
  place: string;
  tag: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  bgPhoto: any;
  // Coordenadas geográficas reales [longitud, latitud] para MapLibre
  lng: number;
  lat: number;
  // Coordenadas relativas (%) sobre el mapa topográfico
  pin: { x: number; y: number; label: string };
}

const themeCategoryLabels: Record<ThemeCategory, string> = {
  conservacion: "Conservación, Ecosistemas y Turismo Sostenible",
  desarrollo: "Desarrollo Social y Economía Popular",
  cultura: "Identidad, Cultura y Comunidad",
};

const projectsList: ProjectItem[] = [
  {
    id: "galapagos",
    name: "Voluntariado en Galápagos",
    category: "experiencias",
    place: "Islas Galápagos",
    tag: "Conservación Insular",
    description: "Inmersión en limpieza de playas, monitoreo de especies nativas y educación ambiental con comunidades locales.",
    ctaText: "Postular al Voluntariado",
    ctaLink: "#contacto",
    bgPhoto: mapaExperienciasImg,
    lng: -90.31,
    lat: -0.74,
    pin: { x: 14, y: 38, label: "Galápagos" }
  },
  {
    id: "aradas",
    name: "Voluntariado en San Antonio de las Aradas",
    category: "experiencias",
    place: "San Antonio de las Aradas (Loja)",
    tag: "Agroecología Comunitaria",
    description: "Convivencia directa en huertos agroforestales, bioconstrucción y proyectos de soberanía hídrica.",
    ctaText: "Unirme a la Brigada",
    ctaLink: "#contacto",
    bgPhoto: mapaExperienciasImg,
    lng: -79.40,
    lat: -4.30,
    pin: { x: 45, y: 84, label: "San Antonio de las Aradas" }
  },
  {
    id: "napo",
    name: "Adopta un Árbol + Proyecto Carbon Offset",
    category: "proyectos",
    themeCategory: "conservacion",
    place: "Tena / Napo",
    tag: "Reforestación y compensación de huella",
    description: "Reforestación de especies nativas y compensación de huella de carbono junto a familias y comunidades locales.",
    ctaText: "Conocer e Impulsar",
    ctaLink: "/proyectos/raices-productivas",
    bgPhoto: "/imagenes/Acciones%20FAP/_DSC0943.webp",
    lng: -77.85,
    lat: -0.68,
    pin: { x: 67, y: 35, label: "Adopta un Árbol" }
  },
  {
    id: "loma-delgada",
    name: "Proyecto Loma Delgada",
    category: "proyectos",
    themeCategory: "conservacion",
    place: "Loma Delgada / Amazonía",
    tag: "Reseña y enlace al sitio externo de donaciones",
    description: "Iniciativa de conservación territorial en Loma Delgada. Consulta la reseña del proyecto y su portal externo de donaciones y detalles.",
    ctaText: "Ir a Donaciones y Detalles",
    ctaLink: "#contacto",
    bgPhoto: "/imagenes/Paisajes%20FAP/20230824_142358.webp",
    lng: -77.15,
    lat: -1.72,
    pin: { x: 69, y: 50, label: "Loma Delgada" }
  },
  {
    id: "abejas-purunuma",
    name: "ABEJAS PURUNUMA (Adopta un apicultor)",
    category: "proyectos",
    themeCategory: "conservacion",
    place: "Purunuma / Gonzanamá (Loja)",
    tag: "Apicultura sostenible y polinizadores",
    description: "Programa de apicultura sostenible que protege ecosistemas andino-amazónicos y fortalece el ingreso de apicultores locales.",
    ctaText: "Adoptar un apicultor",
    ctaLink: "#contacto",
    bgPhoto: "/imagenes/Paisajes%20FAP/20230825_153557.webp",
    lng: -79.68,
    lat: -4.18,
    pin: { x: 46, y: 80, label: "Purunuma" }
  },
  {
    id: "chaka-sucua",
    name: "Apadrina un Niño + Proyecto Chaka Sucúa",
    category: "proyectos",
    themeCategory: "desarrollo",
    place: "Sucúa / Morona Santiago",
    tag: "Apoyo a sectores vulnerables y cadenas productivas",
    description: "Acompañamiento integral a la niñez y fortalecimiento de cadenas productivas para el desarrollo social y economía popular.",
    ctaText: "Apadrinar y Apoyar",
    ctaLink: "#contacto",
    bgPhoto: "/imagenes/Acciones%20FAP/20230825_101038.webp",
    lng: -78.12,
    lat: -2.42,
    pin: { x: 62, y: 69, label: "Sucúa" }
  },
  {
    id: "poesia-gaonesa",
    name: "Proyectos Culturales (POESÍA GAONESA)",
    category: "proyectos",
    themeCategory: "cultura",
    place: "Loja / Sur del Ecuador",
    tag: "Libros que recaudan fondos",
    description: "Publicaciones literarias y proyectos culturales cuyos fondos recaudados impulsan iniciativas comunitarias y educativas.",
    ctaText: "Conocer publicaciones",
    ctaLink: "#contacto",
    bgPhoto: "/imagenes/Paisajes%20FAP/20230825_153557.webp",
    lng: -79.45,
    lat: -3.96,
    pin: { x: 49, y: 76, label: "Poesía Gaonesa" }
  },
  {
    id: "quito",
    name: "Consultoría en Sostenibilidad",
    category: "empresas",
    place: "Pichincha / Quito",
    tag: "Soluciones ESG",
    description: "Acompañamiento a empresas en medición de huella de carbono, certificaciones y valor compartido.",
    ctaText: "Solicitar Asesoría",
    ctaLink: "#contacto",
    bgPhoto: mapaEmpresasImg,
    lng: -78.4678,
    lat: -0.1807,
    pin: { x: 53, y: 24, label: "Quito" }
  },
  {
    id: "costa",
    name: "Alianzas de Comercio Justo",
    category: "empresas",
    place: "Costa Ecuatoriana (Guayas)",
    tag: "Cadenas de Valor",
    description: "Conexión transparente entre asociaciones agroecológicas costeras y empresas compradoras responsables.",
    ctaText: "Ver Opciones de Alianza",
    ctaLink: "#contacto",
    bgPhoto: mapaEmpresasImg,
    lng: -79.8891,
    lat: -2.1894,
    pin: { x: 38, y: 55, label: "Costa" }
  }
];

const categoryLabels = {
  proyectos: "Conoce y Apoya nuestros Proyectos",
  experiencias: "Vive la Experiencia",
  empresas: "Soluciones para Empresas"
};

const aboutItemsList = [
  {
    id: 0,
    title: "Nuestra Identidad",
    icon: <IconUser />,
    text: "Integramos armónicamente recursos humanos, ambientales y económicos en proyectos sostenibles junto a las comunidades."
  },
  {
    id: 1,
    title: "Áreas de Intervención",
    icon: <IconHeart />,
    text: "Reforestación de bosques nativos, desarrollo comunitario participativo, soberanía hídrica y comercio justo en territorio."
  },
  {
    id: 2,
    title: "Modelo de Acción",
    icon: <IconChart />,
    text: "Implementamos proyectos avalados directamente por las comunidades, fortaleciendo sus cadenas productivas locales."
  },
  {
    id: 3,
    title: "Formas de Contribuir",
    icon: <IconLeaf />,
    text: "Participa a través de voluntariado activo en campo, alianzas de sostenibilidad corporativa o donaciones directas."
  }
];

const galleryMosaicSlides = [
  {
    main: { src: "/imagenes/Acciones%20FAP/IMG_1083.webp", alt: "Trabajo en comunidad" },
    topSq1: { src: "/imagenes/Acciones%20FAP/0e312d84-762d-4031-a0b0-bdbe32523d1b.webp", alt: "Actividad territorial" },
    topSq2: { src: "/imagenes/Acciones%20FAP/762fff4f-dbcf-48ef-9aa8-c7e9c50d999b.webp", alt: "Siembra comunitaria" },
    topRect: { src: "/imagenes/Acciones%20FAP/20231028_084735.webp", alt: "Brigada ambiental" },
    botRect: { src: "/imagenes/Acciones%20FAP/IMG_20251215_114154.webp", alt: "Acción en campo" },
    botSq1: { src: "/imagenes/Acciones%20FAP/IMG_3377.webp", alt: "Vivero y plántulas" },
    botSq2: { src: "/imagenes/Acciones%20FAP/IMG_1029.webp", alt: "Reforestación en territorio" },
  },
  {
    main: { src: "/imagenes/Acciones%20FAP/IMG_1155.webp", alt: "Participación comunitaria" },
    topSq1: { src: "/imagenes/Acciones%20FAP/IMG_3378.webp", alt: "Cuidado de especies nativas" },
    topSq2: { src: "/imagenes/Acciones%20FAP/IMG_1107.webp", alt: "Jornada en vivero" },
    topRect: { src: "/imagenes/Acciones%20FAP/20230824_102414.webp", alt: "Encuentro territorial" },
    botRect: { src: "/imagenes/Acciones%20FAP/IMG_1158.webp", alt: "Trabajo junto a la comunidad" },
    botSq1: { src: "/imagenes/Acciones%20FAP/IMG_1182.webp", alt: "Jornada de siembra" },
    botSq2: { src: "/imagenes/Acciones%20FAP/IMG_1207.webp", alt: "Voluntariado activo" },
  },
];

const GalleryCarousel = memo(function GalleryCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const halfWidthRef = useRef(0);
  const dragRef = useRef<{ active: boolean; startX: number; startPos: number }>({
    active: false,
    startX: 0,
    startPos: 0,
  });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      halfWidthRef.current = track.scrollWidth / 2;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    let rafId: number;
    let lastTime: number | null = null;
    const speedPxPerSec = 42;

    const step = (time: number) => {
      const halfWidth = halfWidthRef.current;
      if (lastTime !== null && !dragRef.current.active && halfWidth > 0) {
        const dt = Math.min((time - lastTime) / 1000, 0.05);
        posRef.current = (posRef.current + speedPxPerSec * dt) % halfWidth;
        track.style.transform = `translate3d(${-posRef.current}px, 0, 0)`;
      }
      lastTime = time;
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      className="w-full overflow-hidden select-none cursor-grab active:cursor-grabbing touch-pan-y"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        dragRef.current = {
          active: true,
          startX: e.clientX,
          startPos: posRef.current,
        };
      }}
      onPointerMove={(e) => {
        if (!dragRef.current.active || !trackRef.current) return;
        const halfWidth = halfWidthRef.current;
        if (halfWidth <= 0) return;
        const delta = dragRef.current.startX - e.clientX;
        let next = (dragRef.current.startPos + delta) % halfWidth;
        if (next < 0) next += halfWidth;
        posRef.current = next;
        trackRef.current.style.transform = `translate3d(${-next}px, 0, 0)`;
      }}
      onPointerUp={() => {
        dragRef.current.active = false;
      }}
      onPointerCancel={() => {
        dragRef.current.active = false;
      }}
    >
      <div
        ref={trackRef}
        className="flex w-max gap-0.5 bg-[#0c0e0b]"
        style={{ willChange: "transform", backfaceVisibility: "hidden" }}
      >
        {[...galleryMosaicSlides, ...galleryMosaicSlides].map((slide, idx) => (
          <div
            key={idx}
            className="w-screen shrink-0 grid grid-cols-2 md:grid-cols-6 gap-0.5 bg-[#0c0e0b]"
          >
            <div className="col-span-2 row-span-2 aspect-square rounded-none overflow-hidden bg-[#0c0e0b]" style={{ contain: "layout paint" }}>
              <img src={slide.main.src} alt={slide.main.alt} draggable={false} loading="eager" fetchPriority={idx === 0 ? "high" : "auto"} decoding="async" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-1 aspect-square rounded-none overflow-hidden bg-[#0c0e0b]" style={{ contain: "layout paint" }}>
              <img src={slide.topSq1.src} alt={slide.topSq1.alt} draggable={false} loading="eager" fetchPriority={idx === 0 ? "high" : "auto"} decoding="async" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-1 aspect-square rounded-none overflow-hidden bg-[#0c0e0b]" style={{ contain: "layout paint" }}>
              <img src={slide.topSq2.src} alt={slide.topSq2.alt} draggable={false} loading="eager" fetchPriority={idx === 0 ? "high" : "auto"} decoding="async" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-2 aspect-[2/1] rounded-none overflow-hidden bg-[#0c0e0b]" style={{ contain: "layout paint" }}>
              <img src={slide.topRect.src} alt={slide.topRect.alt} draggable={false} loading="eager" fetchPriority={idx === 0 ? "high" : "auto"} decoding="async" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-2 aspect-[2/1] rounded-none overflow-hidden bg-[#0c0e0b]" style={{ contain: "layout paint" }}>
              <img src={slide.botRect.src} alt={slide.botRect.alt} draggable={false} loading="eager" fetchPriority={idx === 0 ? "high" : "auto"} decoding="async" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-1 aspect-square rounded-none overflow-hidden bg-[#0c0e0b]" style={{ contain: "layout paint" }}>
              <img src={slide.botSq1.src} alt={slide.botSq1.alt} draggable={false} loading="eager" fetchPriority={idx === 0 ? "high" : "auto"} decoding="async" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-1 aspect-square rounded-none overflow-hidden bg-[#0c0e0b]" style={{ contain: "layout paint" }}>
              <img src={slide.botSq2.src} alt={slide.botSq2.alt} draggable={false} loading="eager" fetchPriority={idx === 0 ? "high" : "auto"} decoding="async" className="w-full h-full object-cover" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<"proyectos" | "experiencias" | "empresas" | null>(null);
  const [selectedThemeFilter, setSelectedThemeFilter] = useState<"all" | ThemeCategory>("all");
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const [activeProjectId, setActiveProjectId] = useState<string>("");
  const [mapSelectedProjectId, setMapSelectedProjectId] = useState<string | null>(null);
  const [autoCycleMap, setAutoCycleMap] = useState(true);
  const [isProyectosPaused, setIsProyectosPaused] = useState(false);
  const projHoverIntentRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeExpandedId, setActiveExpandedId] = useState<number | null>(0);
  const [isNosotrosPaused, setIsNosotrosPaused] = useState(false);
  const hoverIntentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [collageTick, setCollageTick] = useState(0);
  const [galleryTick, setGalleryTick] = useState(0);

  useEffect(() => {
    const applyNavPayload = (payload: { category: "proyectos" | "experiencias" | "empresas"; projectId?: string }) => {
      setAutoCycleMap(false);
      setSelectedCategory(payload.category);
      setSelectedThemeFilter("all");
      if (payload.projectId) {
        setActiveProjectId(payload.projectId);
        setMapSelectedProjectId(payload.projectId);
      } else {
        setActiveProjectId("");
        setMapSelectedProjectId(null);
      }
    };

    try {
      const pending = sessionStorage.getItem("fap_pending_mapa_nav");
      if (pending) {
        sessionStorage.removeItem("fap_pending_mapa_nav");
        applyNavPayload(JSON.parse(pending));
      }
    } catch {
      // ignore storage errors
    }

    const handleMapaNav = (e: Event) => {
      const customEvent = e as CustomEvent<{ category: "proyectos" | "experiencias" | "empresas"; projectId?: string }>;
      if (customEvent.detail) {
        applyNavPayload(customEvent.detail);
      }
    };

    window.addEventListener("fap:nav-mapa", handleMapaNav);
    return () => window.removeEventListener("fap:nav-mapa", handleMapaNav);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target as Node)) {
        setThemeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const nosotrosGalleryPool = [
    { img: nosotrosImg1, alt: "Siembra directa de plántula en territorio" },
    { img: nosotrosImg2, alt: "Invernadero escolar y comunitario" },
    { img: nosotrosImg3, alt: "Producción sostenible de café" },
    { img: nosotrosImg4, alt: "Reforestación con especies nativas" },
    { img: nosotrosImg5, alt: "Brigada comunitaria en territorio" },
  ];

  // Precarga silenciosa de las fotos del collage de #nosotros para evitar demoras al rotar
  useEffect(() => {
    nosotrosGalleryPool.forEach((item) => {
      const img = new Image();
      img.src = getImageSrc(item.img);
    });
  }, []);

  // Las fotos del collage rotan siempre de forma independiente (no se detienen al pasar el mouse)
  useEffect(() => {
    const collageTimer = setInterval(() => {
      setCollageTick((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(collageTimer);
  }, []);

  // Los textos rotan cada 3s; si el usuario se queda sobre uno, se pausa y al salir continúa desde ese
  useEffect(() => {
    if (isNosotrosPaused) return;
    const textTimer = setInterval(() => {
      setActiveExpandedId((prev) => ((prev ?? -1) + 1) % 4);
    }, 3000);
    return () => clearInterval(textTimer);
  }, [isNosotrosPaused]);

  // Auto-recorrido inicial en el mapa: llega en vista general marfil y luego va seleccionando cada proyecto como si se tocara su pin
  useEffect(() => {
    if (!autoCycleMap) return;
    const projectIds = projectsList.filter((p) => p.category === "proyectos").map((p) => p.id);
    if (projectIds.length === 0) return;

    let step = -1;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const startTimer = setTimeout(() => {
      const advance = () => {
        step = (step + 1) % projectIds.length;
        const nextId = projectIds[step];
        setActiveProjectId(nextId);
        setSelectedCategory("proyectos");
        setMapSelectedProjectId(nextId);
      };
      advance();
      intervalId = setInterval(advance, 4200);
    }, 3200);

    return () => {
      clearTimeout(startTimer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoCycleMap]);

  // Cuando está abierta la lista de Proyectos (marfil), va rotando suavemente cada proyecto
  useEffect(() => {
    if (mapSelectedProjectId !== null) return;
    if (selectedCategory !== "proyectos" || isProyectosPaused) return;

    const visibleIds = projectsList
      .filter(
        (p) =>
          p.category === "proyectos" &&
          (selectedThemeFilter === "all" || p.themeCategory === selectedThemeFilter)
      )
      .map((p) => p.id);

    if (visibleIds.length === 0) return;

    const cycleTimer = setInterval(() => {
      setActiveProjectId((prev) => {
        const idx = visibleIds.indexOf(prev);
        return visibleIds[(idx + 1) % visibleIds.length];
      });
    }, 2600);

    return () => clearInterval(cycleTimer);
  }, [selectedCategory, mapSelectedProjectId, selectedThemeFilter, isProyectosPaused]);

  const visibleMapProjects = selectedCategory
    ? projectsList.filter(
        (p) =>
          p.category === selectedCategory &&
          (selectedCategory !== "proyectos" ||
            selectedThemeFilter === "all" ||
            p.themeCategory === selectedThemeFilter)
      )
    : projectsList.filter((p) => p.category === "proyectos");

  const provinceByProjectId: Record<string, string> = {
    napo: "Napo",
    "loma-delgada": "Pastaza",
    "abejas-purunuma": "Loja",
    "chaka-sucua": "Morona Santiago",
    "poesia-gaonesa": "Loja",
    galapagos: "Galápagos",
    aradas: "Loja",
    quito: "Pichincha",
    costa: "Guayas",
  };

  const mapHighlightRegions = visibleMapProjects
    .filter((p) => provinceByProjectId[p.id])
    .map((p) => ({ id: p.id, province: provinceByProjectId[p.id] }));
  const currentProject = projectsList.find(p => p.id === activeProjectId);
  const mapaEdgeMask =
    "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.04) 2%, rgba(0,0,0,0.16) 4.5%, rgba(0,0,0,0.42) 7.5%, rgba(0,0,0,0.75) 10.5%, black 14%, black 90%, rgba(0,0,0,0.75) 92.2%, rgba(0,0,0,0.42) 94.5%, rgba(0,0,0,0.16) 96.8%, rgba(0,0,0,0.04) 98.5%, transparent 100%)";
  const hasDarkPhotoBg =
    selectedCategory !== null || mapSelectedProjectId !== null;
  const activeBgPhoto =
    selectedCategory === "proyectos" && !mapSelectedProjectId
      ? "/imagenes/Paisajes%20FAP/20230825_153557.webp"
      : currentProject?.bgPhoto ||
        (selectedCategory === "experiencias"
          ? mapaExperienciasImg
          : selectedCategory === "empresas"
            ? mapaEmpresasImg
            : "/imagenes/Paisajes%20FAP/20230825_153557.webp");

  return (
    <main
      id="inicio"
      className="relative min-h-screen bg-[#F7F2E6] text-[#10120f] selection:bg-[#B7D84B] selection:text-black"
    >
      
      {/* ============================================================== */}
      {/* HEADER / NAVBAR (SIEMPRE ACOMPAÑA Y SE VUELVE VERDE BOSQUE AL BAJAR) */}
      {/* ============================================================== */}
      <SiteHeader />

      {/* ============================================================== */}
      {/* 1. SECCIÓN HERO / PORTADA (VIDEO DE FONDO, TEXTO A LA IZQUIERDA, CIFRA EN LA ESQUINA) */}
      {/* ============================================================== */}
      <section className="relative min-h-[92vh] flex items-center px-6 sm:px-12 lg:px-16 pt-28 pb-16 bg-[#0c0e0b] text-white overflow-hidden">
        
        {/* Imagen de portada a pantalla completa (lista para reemplazar por video de portada cuando esté disponible) */}
        <div className="absolute inset-0 z-0">
          <img
            src="/imagenes/Paisajes%20FAP/_DSC2678.webp"
            alt="Equipo de Fundación Amazonía Productiva en territorio"
            className="w-full h-full object-cover object-[center_68%] contrast-[1.03] saturate-[1.04]"
          />
          {/* Overlay sutil y tenue (solo suaviza el lado izquierdo para leer el título sin oscurecer el paisaje) */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/15 to-transparent" />
        </div>

        {/* LADO IZQUIERDO: PEGADO AL BORDE IZQUIERDO, SOLO TÍTULO Y BOTÓN CON APARICIÓN DESDE SU PROPIA LÍNEA */}
        <div className="relative z-10 w-full max-w-4xl text-left space-y-8">
          {/* Título en dos tonos: cada línea emerge desde su propia base sin venir desde abajo */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.08] text-white">
            <span className="block overflow-hidden pb-1">
              <span className="animate-line-reveal">Territorios vivos,</span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="animate-line-reveal-delay-1 text-[#B7D84B]">futuro compartido.</span>
            </span>
          </h1>

          {/* Único Botón de Acción */}
          <div className="overflow-hidden pt-1">
            <div className="animate-line-reveal-delay-2">
              <a
                href="#contacto"
                className="inline-flex items-center gap-2 bg-[#B7D84B] text-[#0c0e0b] px-8 py-4 rounded-xl font-bold text-base hover:bg-[#b5e642] shadow-xl hover:shadow-[#B7D84B]/25 transition-all"
              >
                Quiero ayudar / Donar
                <ArrowUpRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* CIFRA EN LA ESQUINITA (EN BLANCO, SIN CAJA/CONTENEDOR NEGRO) */}
        <div className="absolute right-6 sm:right-10 lg:right-14 bottom-8 z-20 text-white select-none drop-shadow-md">
          <div className="flex items-baseline gap-2.5">
            <strong className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none">
              +1.200
            </strong>
            <span className="text-xs sm:text-sm text-white/90 leading-tight font-medium">
              personas conectadas<br />por un mismo propósito
            </span>
          </div>
        </div>

      </section>

      {/* ============================================================== */}
      {/* 2. QUIÉNES SOMOS (COLLAGE MITAD IZQUIERDA GRANDE Y ROTATIVO + 4 VIÑETAS) */}
      {/* ============================================================== */}
      <section id="nosotros" className="py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center lg:gap-x-4">
          
          {/* Lado izquierdo: collage un poco más ancho, pegado al borde */}
          <div className="lg:col-span-7 w-full lg:pr-2">
            <div className="grid grid-cols-3 gap-1.5 w-full">
              
              {/* Fila 1 con self-end para que el cuadradito baje y quede pegado al rectángulo de abajo */}
              <div className="col-span-2 aspect-[16/10] rounded-none overflow-hidden shadow-md bg-neutral-200">
                <CrossfadeImage
                  src={getImageSrc(nosotrosGalleryPool[(0 + collageTick) % nosotrosGalleryPool.length].img)}
                  alt={nosotrosGalleryPool[(0 + collageTick) % nosotrosGalleryPool.length].alt}
                  className="hover:scale-[1.03] transition-transform duration-700"
                />
              </div>
              <div className="col-span-1 self-end aspect-square w-full rounded-none overflow-hidden shadow-md bg-neutral-200">
                <CrossfadeImage
                  src={getImageSrc(nosotrosGalleryPool[(1 + collageTick) % nosotrosGalleryPool.length].img)}
                  alt={nosotrosGalleryPool[(1 + collageTick) % nosotrosGalleryPool.length].alt}
                  className="hover:scale-[1.03] transition-transform duration-700"
                />
              </div>

              {/* Fila 2: Cuadrado (1 col) + Rectángulo horizontal (2 cols) pegados justo debajo */}
              <div className="col-span-1 aspect-square rounded-none overflow-hidden shadow-md bg-neutral-200">
                <CrossfadeImage
                  src={getImageSrc(nosotrosGalleryPool[(2 + collageTick) % nosotrosGalleryPool.length].img)}
                  alt={nosotrosGalleryPool[(2 + collageTick) % nosotrosGalleryPool.length].alt}
                  className="hover:scale-[1.03] transition-transform duration-700"
                />
              </div>
              <div className="col-span-2 aspect-[16/10] rounded-none overflow-hidden shadow-md bg-neutral-200">
                <CrossfadeImage
                  src={getImageSrc(nosotrosGalleryPool[(3 + collageTick) % nosotrosGalleryPool.length].img)}
                  alt={nosotrosGalleryPool[(3 + collageTick) % nosotrosGalleryPool.length].alt}
                  className="hover:scale-[1.03] transition-transform duration-700"
                />
              </div>

            </div>
          </div>

          {/* Lado derecho: bloque centrado en su columna para que no quede pegado a las imágenes */}
          <div className="lg:col-span-5 px-6 sm:px-10 lg:px-10 xl:px-14 pt-12 lg:pt-0 flex justify-center">
            <div className="w-full max-w-md space-y-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#2E6B3F]">
              <span className="w-2 h-2 rounded-full bg-[#2E6B3F]" />
              Conoce a FAP
            </div>

            {/* Título afirmativo en verde bosque + Mostaza en la línea inferior */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#142b1f] leading-tight">
              El territorio florece cuando<br />
              <span className="text-[#E3A72F]">caminamos juntos.</span>
            </h2>

            {/* Las líneas no se estiran hasta el borde: el texto abierto sigue dentro de este ancho y rota en sincronía con las fotos */}
            <div
              className="space-y-2 pt-2 lg:max-w-md"
              onMouseLeave={() => {
                if (hoverIntentTimerRef.current) {
                  clearTimeout(hoverIntentTimerRef.current);
                  hoverIntentTimerRef.current = null;
                }
                setIsNosotrosPaused(false);
              }}
            >
              {aboutItemsList.map((item) => {
                const isExpanded = activeExpandedId === item.id;
                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => {
                      if (hoverIntentTimerRef.current) clearTimeout(hoverIntentTimerRef.current);
                      hoverIntentTimerRef.current = setTimeout(() => {
                        setIsNosotrosPaused(true);
                        setActiveExpandedId(item.id);
                      }, 350);
                    }}
                    onMouseLeave={() => {
                      if (hoverIntentTimerRef.current) {
                        clearTimeout(hoverIntentTimerRef.current);
                        hoverIntentTimerRef.current = null;
                      }
                    }}
                    onClick={() => {
                      if (hoverIntentTimerRef.current) {
                        clearTimeout(hoverIntentTimerRef.current);
                        hoverIntentTimerRef.current = null;
                      }
                      setIsNosotrosPaused(true);
                      setActiveExpandedId(isExpanded ? null : item.id);
                    }}
                    className="pt-3 pb-1 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5">
                      {item.icon}
                      <h3 className={`text-xl sm:text-2xl font-bold transition-colors ${isExpanded ? "text-[#2E6B3F]" : "text-[#142b1f] group-hover:text-[#2E6B3F]"}`}>
                        {item.title}
                      </h3>
                    </div>
                    <span className={`mt-2 block h-px bg-[#2E6B3F] transition-all duration-300 ${isExpanded ? "w-full" : "w-0 group-hover:w-16"}`} />
                    <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-24 opacity-100 mt-2.5" : "max-h-0 opacity-0"}`}>
                      <p className="text-sm sm:text-base text-neutral-600 leading-relaxed pl-9 line-clamp-2">
                        {item.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. CIFRAS DESTACADAS CON CONTADOR ANIMADO (SIN CONTENEDOR / CAJA) */}
      {/* ============================================================== */}
      <section id="cifras" className="py-16 px-6 sm:px-10 lg:px-12 max-w-[1400px] mx-auto border-t border-black/20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
          
          <div className="space-y-1">
            <span className="block text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#2E6B3F] tracking-tight tabular-nums">
              <AnimatedCounter end={150} prefix="+" suffix="K" />
            </span>
            <p className="text-sm sm:text-base font-bold text-[#10120f]">Árboles Protegidos</p>
            <p className="text-xs text-neutral-500">Reforestación y conservación activa</p>
          </div>

          <div className="space-y-1">
            <span className="block text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#75B346] tracking-tight tabular-nums">
              <AnimatedCounter end={42} />
            </span>
            <p className="text-sm sm:text-base font-bold text-[#10120f]">Comunidades Activas</p>
            <p className="text-xs text-neutral-500">Acompañadas en territorio</p>
          </div>

          <div className="space-y-1">
            <span className="block text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#E3A72F] tracking-tight tabular-nums">
              <AnimatedCounter end={1200} prefix="+" useDots />
            </span>
            <p className="text-sm sm:text-base font-bold text-[#10120f]">Infantes y Familias</p>
            <p className="text-xs text-neutral-500">Con oportunidades directas</p>
          </div>

          <div className="space-y-1">
            <span className="block text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#2E6B3F] tracking-tight tabular-nums">
              <AnimatedCounter end={38} />
            </span>
            <p className="text-sm sm:text-base font-bold text-[#10120f]">Emprendimientos</p>
            <p className="text-xs text-neutral-500">Sostenibles en marcha</p>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. MAPA TOPOGRÁFICO DE ECUADOR CON GALÁPAGOS & FILTROS (FONDO FULL WIDTH) */}
      {/* ============================================================== */}
      <section id="mapa" className="relative mt-10 sm:mt-14 mb-0 pt-32 pb-40 sm:pt-36 sm:pb-44 w-full px-4 sm:px-8 lg:pl-0 lg:pr-10 overflow-hidden">
        
        {/* Fondo full width: fusión progresiva hacia marfil opaco en bordes superior e inferior + cortina marfil */}
        <div
          className={`absolute inset-0 z-0 pointer-events-none w-full h-full overflow-hidden transition-opacity duration-700 ease-out ${
            hasDarkPhotoBg ? "opacity-100" : "opacity-0"
          }`}
        >
          <CrossfadeImage
            src={getImageSrc(activeBgPhoto)}
            alt=""
            className="opacity-90"
          />
          <div
            className="absolute inset-y-0 left-0 w-[64%] backdrop-blur-[3.5px]"
            style={{
              maskImage: "linear-gradient(to right, black 50%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, black 50%, transparent 100%)",
            }}
          />
          <div className="absolute inset-0 bg-[#0c0e0b]/35 lg:bg-transparent lg:bg-gradient-to-r lg:from-[#0c0e0b]/45 lg:via-[#0c0e0b]/15 lg:to-transparent" />
          {/* Fusión progresiva a marfil opaco (#F7F2E6) en borde superior e inferior */}
          <div
            className="absolute inset-x-0 top-0 h-28 sm:h-36"
            style={{
              background:
                "linear-gradient(to bottom, #F7F2E6 0%, rgba(247,242,230,0.88) 22%, rgba(247,242,230,0.52) 52%, rgba(247,242,230,0.18) 78%, rgba(247,242,230,0) 100%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-28 sm:h-36"
            style={{
              background:
                "linear-gradient(to top, #F7F2E6 0%, rgba(247,242,230,0.88) 22%, rgba(247,242,230,0.52) 52%, rgba(247,242,230,0.18) 78%, rgba(247,242,230,0) 100%)",
            }}
          />
          {/* Cortina suave marfil que entra de derecha a izquierda para cubrir la imagen al regresar a categorías */}
          <div
            className={`absolute inset-0 bg-gradient-to-l from-[#F7F2E6] via-[#F7F2E6]/95 to-[#F7F2E6]/75 transition-all duration-700 ease-out ${
              hasDarkPhotoBg ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
            }`}
          />
        </div>

        <div className="relative z-10 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
            
            {/* LADO IZQUIERDO: EL MAPA TOPOGRÁFICO REAL CON MARGEN LIGERO AL BORDE IZQUIERDO */}
            <div className="lg:col-span-7 relative flex flex-col items-start justify-center lg:pl-[70px]">
              <EcuadorMap
                projects={visibleMapProjects}
                activeProjectId={activeProjectId}
                highlightRegions={mapHighlightRegions}
                showLegend={false}
                darkBg={hasDarkPhotoBg}
                onSelectProject={(proj) => {
                  setAutoCycleMap(false);
                  setActiveProjectId(proj.id);
                  setSelectedCategory(proj.category);
                  setMapSelectedProjectId(proj.id);
                }}
              />
            </div>

            {/* LADO DERECHO: DISEÑO FINO Y FORMAL (CENTRADO ENTRE EL MAPA Y EL BORDE DERECHO) */}
            <div className={`lg:col-span-5 space-y-5 ${mapSelectedProjectId ? "lg:self-end lg:pb-24 lg:pl-12 lg:pr-8" : "lg:pl-0 lg:pr-12 xl:pr-16"} ${hasDarkPhotoBg ? "drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]" : ""}`}>
              
              {/* ENCABEZADO (se oculta en vista de punto seleccionado para dejar solo la ficha limpia abajo) */}
              {!mapSelectedProjectId && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase ${hasDarkPhotoBg ? "text-white/90" : "text-[#2E6B3F]"}`}>
                      <span className={`w-2 h-2 rounded-full ${hasDarkPhotoBg ? "bg-[#75B346]" : "bg-[#2E6B3F]"}`} />
                      Territorio de Acción
                    </div>
                    {selectedCategory && (
                      <button
                        onClick={() => {
                          setAutoCycleMap(false);
                          setSelectedCategory(null);
                          setMapSelectedProjectId(null);
                          setActiveProjectId("");
                        }}
                        className={`text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer group uppercase tracking-wider ${
                          hasDarkPhotoBg ? "text-white/90 hover:text-[#75B346]" : "text-[#2E6B3F] hover:text-[#142b1f]"
                        }`}
                      >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Volver a categorías
                      </button>
                    )}
                  </div>

                  {selectedCategory ? (
                    <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight animate-fadeIn ${hasDarkPhotoBg ? "text-white" : "text-[#142b1f]"}`}>
                      {categoryLabels[selectedCategory]}
                    </h2>
                  ) : (
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#142b1f] tracking-tight leading-tight">
                      Formas de<br />
                      <span className="text-[#75B346]">sumarte al cambio</span>
                    </h2>
                  )}
                </div>
              )}

              {/* 1. VISTA INICIAL: AL ENTRAR ESTÁN SOLO LAS TRES CATEGORÍAS (FINAS, SIN PASTILLAS) */}
              {!selectedCategory ? (
                <div className="divide-y divide-black/15 pt-2 border-t border-b border-black/15">
                  {(["proyectos", "experiencias", "empresas"] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setAutoCycleMap(false);
                        setSelectedCategory(cat);
                        setSelectedThemeFilter("all");
                        setMapSelectedProjectId(null);
                        setActiveProjectId("");
                      }}
                      className="w-full py-5 text-left flex items-center justify-between text-[#142b1f] hover:text-[#2E6B3F] transition-colors group cursor-pointer"
                    >
                      <span className="text-lg sm:text-xl font-bold tracking-tight">
                        {categoryLabels[cat]}
                      </span>
                      <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-[#2E6B3F] group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              ) : mapSelectedProjectId ? (
                /* 2. SI ENTRÓ DESDE EL MAPA: ESTILO MINIMALISTA (BARRA VERTICAL + CATEGORÍA EN PEQUEÑO + TÍTULO DEL PROYECTO + TEXTO ABAJO + FLECHA) */
                (() => {
                  const proj = projectsList.find(p => p.id === mapSelectedProjectId) || currentProject || projectsList[0];
                  const projCategoryTitle = proj.themeCategory
                    ? themeCategoryLabels[proj.themeCategory]
                    : categoryLabels[proj.category];
                  return (
                    <div key={proj.id} className="pt-1 animate-fadeIn space-y-4">
                      <Link
                        href={proj.ctaLink}
                        onClick={() => setAutoCycleMap(false)}
                        className="block border-l-2 border-[#B7D84B] pl-3.5 py-0.5 group cursor-pointer"
                      >
                        <span className="block text-[10px] font-bold uppercase tracking-widest text-[#B7D84B]">
                          {projCategoryTitle}
                        </span>
                        <div className="mt-1 flex items-center justify-start gap-2.5">
                          <h3 className="text-xl sm:text-2xl lg:text-[26px] font-extrabold text-white group-hover:text-[#B7D84B] transition-colors leading-snug">
                            {proj.name}
                          </h3>
                          <svg
                            className="w-7 h-7 text-white group-hover:text-[#B7D84B] group-hover:translate-x-1.5 transition-all shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </div>
                      </Link>

                      <div className="pt-2 pl-3.5 flex flex-wrap items-center justify-start gap-2.5 text-xs">
                        <button
                          onClick={() => {
                            setAutoCycleMap(false);
                            setSelectedCategory(null);
                            setMapSelectedProjectId(null);
                            setActiveProjectId("");
                          }}
                          className="border border-white/75 bg-black/20 hover:bg-white text-white hover:text-[#142b1f] px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
                        >
                          Volver a categorías
                        </button>
                        <button
                          onClick={() => {
                            setAutoCycleMap(false);
                            setMapSelectedProjectId(null);
                            setSelectedThemeFilter("all");
                            setIsProyectosPaused(false);
                            setActiveProjectId("");
                          }}
                          className="border border-white/75 bg-black/20 hover:bg-white text-white hover:text-[#142b1f] px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
                        >
                          Ver proyectos
                        </button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                /* 3. SI DIO CLIC EN UNA CATEGORÍA: SALEN DIRECTO SUS PROYECTOS (EN PROYECTOS: FONDO MARFIL, NUMERADOS, ROTANDO COMO EL TEXTO DE NOSOTROS) */
                <div className="space-y-4 animate-fadeIn">
                  {selectedCategory === "proyectos" && (
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <span className={`text-[11px] font-bold uppercase tracking-widest shrink-0 ${hasDarkPhotoBg ? "text-[#B7D84B]" : "text-[#2E6B3F]"}`}>
                        Filtrar por categoría
                      </span>

                      <div ref={themeDropdownRef} className="relative">
                        <button
                          type="button"
                          onClick={() => setThemeDropdownOpen((prev) => !prev)}
                          className={`inline-flex items-center gap-2.5 border-b py-1.5 text-sm font-bold transition-colors cursor-pointer ${
                            hasDarkPhotoBg
                              ? "border-white/40 hover:border-[#B7D84B] text-white"
                              : "border-black/25 hover:border-[#2E6B3F] text-[#142b1f]"
                          }`}
                        >
                          <span className="truncate max-w-[230px] sm:max-w-[270px]">
                            {selectedThemeFilter === "all"
                              ? "Todas las categorías"
                              : themeCategoryLabels[selectedThemeFilter]}
                          </span>
                          <svg
                            className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                              hasDarkPhotoBg ? "text-[#B7D84B]" : "text-[#2E6B3F]"
                            } ${themeDropdownOpen ? "rotate-180" : ""}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </button>

                        {themeDropdownOpen && (
                          <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-xl bg-[#F7F2E6]/98 backdrop-blur-md border border-black/15 shadow-xl py-1.5 z-30 animate-fadeIn">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedThemeFilter("all");
                                setThemeDropdownOpen(false);
                                setActiveProjectId("");
                              }}
                              className={`w-full text-left px-4 py-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                                selectedThemeFilter === "all"
                                  ? "bg-[#142b1f] text-[#B7D84B]"
                                  : "text-[#142b1f] hover:bg-[#142b1f]/10"
                              }`}
                            >
                              <span>Todas las categorías</span>
                              {selectedThemeFilter === "all" && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#B7D84B] shrink-0" />
                              )}
                            </button>
                            {(["conservacion", "desarrollo", "cultura"] as const).map((theme) => {
                              const isSelected = selectedThemeFilter === theme;
                              return (
                                <button
                                  key={theme}
                                  type="button"
                                  onClick={() => {
                                    setSelectedThemeFilter(theme);
                                    setThemeDropdownOpen(false);
                                    setActiveProjectId("");
                                  }}
                                  className={`w-full text-left px-4 py-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                                    isSelected
                                      ? "bg-[#142b1f] text-[#B7D84B]"
                                      : "text-[#142b1f] hover:bg-[#142b1f]/10"
                                  }`}
                                >
                                  <span>{themeCategoryLabels[theme]}</span>
                                  {isSelected && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#B7D84B] shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div
                    className="space-y-1 pt-2"
                    onMouseLeave={() => {
                      if (projHoverIntentRef.current) {
                        clearTimeout(projHoverIntentRef.current);
                        projHoverIntentRef.current = null;
                      }
                      setIsProyectosPaused(false);
                    }}
                  >
                    {projectsList
                      .filter(
                        (p) =>
                          p.category === selectedCategory &&
                          (selectedCategory !== "proyectos" ||
                            selectedThemeFilter === "all" ||
                            p.themeCategory === selectedThemeFilter)
                      )
                      .map((proj, index) => {
                        const isMapActive = activeProjectId === proj.id;
                        return (
                          <div
                            key={proj.id}
                            onMouseEnter={() => {
                              if (selectedCategory !== "proyectos") return;
                              if (projHoverIntentRef.current) clearTimeout(projHoverIntentRef.current);
                              projHoverIntentRef.current = setTimeout(() => {
                                setIsProyectosPaused(true);
                                setActiveProjectId(proj.id);
                              }, 350);
                            }}
                            onMouseLeave={() => {
                              if (projHoverIntentRef.current) {
                                clearTimeout(projHoverIntentRef.current);
                                projHoverIntentRef.current = null;
                              }
                            }}
                            onClick={() => {
                              setIsProyectosPaused(true);
                              setActiveProjectId(proj.id);
                            }}
                            className={`transition-all duration-300 group cursor-pointer ${isMapActive ? "py-3" : "py-2"}`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className={`min-w-0 pl-3 transition-all duration-300 ${
                                isMapActive
                                  ? hasDarkPhotoBg ? "border-l-[3px] border-[#B7D84B]" : "border-l-[3px] border-[#2E6B3F]"
                                  : hasDarkPhotoBg ? "border-l-2 border-white/25 group-hover:border-[#B7D84B]" : "border-l-2 border-black/15 group-hover:border-[#2E6B3F]"
                              }`}>
                                {proj.themeCategory && (
                                  <span
                                    className={`block overflow-hidden text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                                      isMapActive
                                        ? hasDarkPhotoBg
                                          ? "max-h-6 opacity-100 mb-0.5 text-[#B7D84B]"
                                          : "max-h-6 opacity-100 mb-0.5 text-[#2E6B3F]"
                                        : "max-h-0 opacity-0"
                                    }`}
                                  >
                                    {themeCategoryLabels[proj.themeCategory]}
                                  </span>
                                )}
                                <div className="flex items-center gap-2.5">
                                  <span
                                    className={`text-xs font-extrabold tabular-nums shrink-0 transition-colors ${
                                      hasDarkPhotoBg
                                        ? "text-white"
                                        : isMapActive ? "text-[#2E6B3F]" : "text-[#2E6B3F]/80"
                                    }`}
                                  >
                                    {index + 1}.
                                  </span>
                                  <span
                                    className={`font-bold transition-all duration-300 ${
                                      isMapActive
                                        ? hasDarkPhotoBg
                                          ? "text-lg sm:text-xl text-white"
                                          : "text-lg sm:text-xl text-[#142b1f]"
                                        : hasDarkPhotoBg
                                          ? "text-base sm:text-lg text-white"
                                          : "text-base sm:text-lg text-[#142b1f]"
                                    }`}
                                  >
                                    {proj.name}
                                  </span>
                                </div>
                              </div>
                              <Link
                                href={proj.ctaLink}
                                onClick={(e) => e.stopPropagation()}
                                aria-label={`Ir a ${proj.name}`}
                                className={`inline-flex items-center gap-0.5 transition-colors shrink-0 ml-2 ${
                                  hasDarkPhotoBg
                                    ? "text-white"
                                    : "text-[#2E6B3F]"
                                }`}
                              >
                                <svg
                                  className={`transition-transform group-hover:translate-x-1 ${isMapActive ? "w-7 h-7" : "w-5 h-5"}`}
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={isMapActive ? "3" : "2.5"}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M9 18l6-6-6-6" />
                                </svg>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. LOGOS DE ALIANZAS Y PATROCINADORES EN MOVIMIENTO CONTINUO */}
      {/* ============================================================== */}
      <section className="py-16 px-6 sm:px-10 lg:px-12 max-w-[1400px] mx-auto border-b border-black/20">
        <p className="text-xs uppercase font-bold tracking-wider text-neutral-400 mb-6 text-center">
          Alianzas y Patrocinadores
        </p>
        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee flex items-center gap-12 sm:gap-16 text-lg sm:text-xl font-bold tracking-tight text-[#142b1f]/80">
            <span className="hover:text-[#75B346] transition-colors cursor-default">Responsible Travel</span>
            <span className="text-[#75B346]">•</span>
            <span className="hover:text-[#75B346] transition-colors cursor-default">Sandberg Santana</span>
            <span className="text-[#75B346]">•</span>
            <span className="hover:text-[#75B346] transition-colors cursor-default">Sandberg Eco Consulting</span>
            <span className="text-[#75B346]">•</span>
            <span className="hover:text-[#75B346] transition-colors cursor-default">Responsible Travel</span>
            <span className="text-[#75B346]">•</span>
            <span className="hover:text-[#75B346] transition-colors cursor-default">Sandberg Santana</span>
            <span className="text-[#75B346]">•</span>
            <span className="hover:text-[#75B346] transition-colors cursor-default">Sandberg Eco Consulting</span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. EXPERIENCIAS: GALERÍA CARRUSEL FULL-WIDTH CON ORIENTACIÓN RESPETADA */}
      {/* ============================================================== */}
      <section id="galeria" className="pt-24 sm:pt-28 pb-10 sm:pb-12 w-full overflow-hidden">
        {/* Título pegado al lado izquierdo de la galería */}
        <div className="w-full px-6 sm:px-10 lg:px-12 mb-10">
          <div className="w-full">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#2E6B3F] mb-2">
              <span className="w-2 h-2 rounded-full bg-[#2E6B3F]" />
              Experiencias en Campo
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#142b1f]">
              Galería de <span className="text-[#E3A72F]">vivencias y territorio</span>
            </h2>
          </div>
        </div>

        {/* CARRUSEL CON EL MOSAICO ORIGINAL (aislado en memo para evitar parpadeo, sin pausa en hover y arrastrable) */}
        <GalleryCarousel />
      </section>

      {/* ============================================================== */}
      {/* 7. NUESTRO EQUIPO (DISEÑO EDITORIAL AMPLIO Y LARGO) */}
      {/* ============================================================== */}
      <section id="equipo" className="pt-10 sm:pt-12 pb-24 px-6 sm:px-10 lg:px-14 w-full max-w-[1680px] mx-auto">
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#2E6B3F] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#2E6B3F]" />
            Equipo de Trabajo
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#142b1f]">
            Conoce a <span className="text-[#75B346]">nuestro equipo</span>
          </h2>
        </div>

        {/* Personas del equipo: Más largas y anchas ocupando más ancho de página */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 lg:gap-6">
          {[
            {
              name: "Dra. Elena Santillán",
              role: "Dirección Ejecutiva",
              bio: "Lidera la estrategia territorial y las alianzas institucionales de conservación en la Amazonía y Galápagos.",
              img: storyImage
            },
            {
              name: "Ing. Carlos Grefa",
              role: "Coordinación de Territorio",
              bio: "Acompaña directamente a las comunidades kichwas y proyectos agroforestales sostenibles en campo.",
              img: heroImage
            },
            {
              name: "Sofía Alvarado",
              role: "Responsable de Voluntariado",
              bio: "Coordina brigadas de reforestación, educación ambiental y experiencias vivenciales de viajeros.",
              img: communityImage
            },
            {
              name: "Mateo Jaramillo",
              role: "Alianzas & Sostenibilidad",
              bio: "Impulsa programas corporativos de Carbon Offset y comercio justo junto al sector privado.",
              img: seedlingPhotoImage
            }
          ].map((member) => (
            <div
              key={member.name}
              className="group relative aspect-[3/4.3] overflow-hidden bg-neutral-900 rounded-none shadow-md cursor-default"
            >
              <img
                src={getImageSrc(member.img)}
                alt={member.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Degradado oscuro inferior para lectura nítida */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-90 group-hover:from-black/95 group-hover:via-black/50 transition-all duration-300" />

              {/* Contenido abajo: Nombre y cargo sin cápsulas + descripción corta al pasar el ratón */}
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <h4 className="font-extrabold text-lg leading-snug tracking-tight text-white">
                  {member.name}
                </h4>
                <p className="text-xs font-bold uppercase tracking-wider text-[#B7D84B] mt-0.5">
                  {member.role}
                </p>
                <div className="max-h-0 opacity-0 group-hover:max-h-28 group-hover:opacity-100 overflow-hidden transition-all duration-300 ease-out">
                  <p className="text-xs text-white/85 leading-relaxed pt-2.5 border-t border-white/20 mt-2.5">
                    {member.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      <SiteFooter />

    </main>
  );
}
