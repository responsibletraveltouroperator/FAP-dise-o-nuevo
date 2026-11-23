"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import heroImage from "@/assets/fap-hero.jpg";
import communityImage from "@/assets/fap-community.jpg";
import ecuadorTerrainImage from "@/assets/fap-ecuador-terrain.png";
import mountainFooterImage from "@/assets/fap-mountain-footer.png";
import seedlingImage from "@/assets/fap-seedling-new.png";
import seedlingPhotoImage from "@/assets/fap-seedling.jpg";
import storyImage from "@/assets/fap-story.jpg";
import logoColorImg from "@/assets/fap-logo-color.png";
import logoBlancoImg from "@/assets/fap-logo-blanco.webp";

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

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a className="flex items-center transition-opacity hover:opacity-90" href="#inicio" aria-label="Fundación Amazonía Productiva, inicio">
      <img
        src={getImageSrc(light ? logoBlancoImg : logoColorImg)}
        alt="Fundación Amazonía Productiva"
        className={
          light
            ? "h-[68px] sm:h-[72px] -my-2.5 w-auto object-contain"
            : "h-11 sm:h-12 w-auto object-contain"
        }
      />
    </a>
  );
}

// Estructura de Proyectos y Categorías para el Mapa
interface ProjectItem {
  id: string;
  name: string;
  category: "proyectos" | "experiencias" | "empresas";
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
    bgPhoto: heroImage,
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
    bgPhoto: communityImage,
    lng: -79.40,
    lat: -4.30,
    pin: { x: 45, y: 84, label: "San Antonio de las Aradas" }
  },
  {
    id: "napo",
    name: "Raíces Productivas",
    category: "proyectos",
    place: "Tena / Napo",
    tag: "Reforestación & Carbon Offset",
    description: "Fortalecimiento de chacras familiares kichwas, reforestación y compensación de carbono con impacto territorial.",
    ctaText: "Conocer e Impulsar",
    ctaLink: "/proyectos/raices-productivas",
    bgPhoto: communityImage,
    lng: -77.8129,
    lat: -0.9938,
    pin: { x: 67, y: 35, label: "Napo" }
  },
  {
    id: "pastaza",
    name: "Mujeres que Transforman",
    category: "proyectos",
    place: "Puyo / Pastaza",
    tag: "Saberes Ancestrales",
    description: "Red de lideresas amazónicas que elaboran bio-artesanías, aceites botánicos y preservan los saberes de la selva.",
    ctaText: "Apoyar la Red",
    ctaLink: "#contacto",
    bgPhoto: storyImage,
    lng: -78.0039,
    lat: -1.4924,
    pin: { x: 70, y: 52, label: "Pastaza" }
  },
  {
    id: "morona",
    name: "Semillas de Futuro",
    category: "proyectos",
    place: "Macas / Morona Santiago",
    tag: "Juventud & Bosques",
    description: "Viveros comunitarios y formación técnica ambiental para arraigar a las nuevas generaciones en su territorio.",
    ctaText: "Donar a este Proyecto",
    ctaLink: "#contacto",
    bgPhoto: seedlingImage,
    lng: -78.1114,
    lat: -2.3087,
    pin: { x: 63, y: 68, label: "Morona Santiago" }
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
    bgPhoto: heroImage,
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
    bgPhoto: seedlingImage,
    lng: -79.8891,
    lat: -2.1894,
    pin: { x: 38, y: 55, label: "Costa" }
  }
];

const categoryLabels = {
  proyectos: "1. Conoce y Apoya nuestros Proyectos",
  experiencias: "2. Vive la Experiencia",
  empresas: "3. Soluciones para Empresas"
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

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"proyectos" | "experiencias" | "empresas" | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string>("napo");
  const [mapSelectedProjectId, setMapSelectedProjectId] = useState<string | null>(null);
  const [activeExpandedId, setActiveExpandedId] = useState<number | null>(0);
  const [collageTick, setCollageTick] = useState(0);
  const [galleryTick, setGalleryTick] = useState(0);

  const galleryPool = [
    { img: heroImage, alt: "Voluntariado en comunidad" },
    { img: communityImage, alt: "Preparación comunitaria" },
    { img: storyImage, alt: "Jornada ambiental en el bosque" },
    { img: seedlingPhotoImage, alt: "Cultivo sostenible en campo" },
    { img: seedlingImage, alt: "Siembra y crecimiento" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const collageTimer = setInterval(() => {
      setCollageTick((prev) => (prev + 1) % 5);
    }, 4200);
    const galleryTimer = setInterval(() => {
      setGalleryTick((prev) => (prev + 1) % 5);
    }, 3800);
    return () => {
      clearInterval(collageTimer);
      clearInterval(galleryTimer);
    };
  }, []);

  const currentProject = projectsList.find(p => p.id === activeProjectId) || projectsList[0];

  return (
    <main
      id="inicio"
      className="relative min-h-screen bg-[#E6D3B8] text-[#10120f] overflow-x-hidden selection:bg-[#B7D84B] selection:text-black"
    >
      
      {/* ============================================================== */}
      {/* HEADER / NAVBAR (SIEMPRE ACOMPAÑA Y SE VUELVE VERDE BOSQUE AL BAJAR) */}
      {/* ============================================================== */}
      <header
        className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 sm:px-12 lg:px-16 text-white transition-all duration-300 ${
          isScrolled
            ? "bg-[#142b1f]/95 backdrop-blur-md shadow-lg py-4 border-b border-white/10"
            : "bg-transparent py-6"
        }`}
      >
        <Logo light={isScrolled} />
        
        <nav className={`fixed inset-0 bg-[#0c0e0b]/95 backdrop-blur-xl flex flex-col justify-center items-center gap-6 text-lg font-medium transition-all duration-300 md:static md:inset-auto md:bg-transparent md:backdrop-blur-none md:flex-row md:gap-8 md:text-sm lg:gap-10 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto"}`}>
          <a href="#nosotros" onClick={() => setMenuOpen(false)} className="hover:text-[#B7D84B] transition-colors">¿Quiénes somos?</a>
          <a href="#cifras" onClick={() => setMenuOpen(false)} className="hover:text-[#B7D84B] transition-colors">Cifras</a>
          <a href="#mapa" onClick={() => setMenuOpen(false)} className="hover:text-[#B7D84B] transition-colors">Proyectos &amp; Mapa</a>
          <a href="#galeria" onClick={() => setMenuOpen(false)} className="hover:text-[#B7D84B] transition-colors">Galería</a>
          <a href="#equipo" onClick={() => setMenuOpen(false)} className="hover:text-[#B7D84B] transition-colors">Nuestro Equipo</a>
          <a href="#contacto" onClick={() => setMenuOpen(false)} className="bg-[#B7D84B] text-[#0c0e0b] px-5 py-2.5 rounded-full font-bold hover:bg-[#b5e642] shadow-sm transition-all md:inline-flex items-center gap-2">
            Quiero ayudar <ArrowUpRight className="w-4 h-4" />
          </a>
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden relative z-40 p-2 text-white hover:text-[#B7D84B] focus:outline-none"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`h-0.5 w-full bg-current transform transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`h-0.5 w-full bg-current transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-full bg-current transform transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </header>

      {/* ============================================================== */}
      {/* 1. SECCIÓN HERO / PORTADA (VIDEO DE FONDO, TEXTO A LA IZQUIERDA, CIFRA EN LA ESQUINA) */}
      {/* ============================================================== */}
      <section className="relative min-h-[92vh] flex items-center px-6 sm:px-12 lg:px-16 pt-28 pb-16 bg-[#0c0e0b] text-white overflow-hidden">
        
        {/* Video de fondo a pantalla completa */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={getImageSrc(heroImage)}
            className="w-full h-full object-cover object-center"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-dense-green-forest-42407-large.mp4" type="video/mp4" />
          </video>
          {/* Overlay sutil apenas oscurecido para resaltar textos sin tapar el video */}
          <div className="absolute inset-0 bg-black/40" />
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
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          
          {/* Lado Izquierdo: Ligeramente más compacto (-15px) y bien acomodado con transición suave */}
          <div className="lg:col-span-6 w-full pr-3 sm:pr-4 lg:pr-6">
            <div className="grid grid-cols-3 gap-1.5 w-[calc(100%-15px)]">
              
              {/* Fila 1 con self-end para que el cuadradito baje y quede pegado al rectángulo de abajo */}
              <div className="col-span-2 aspect-[16/10] rounded-none overflow-hidden shadow-md bg-neutral-200">
                <CrossfadeImage
                  src={getImageSrc(galleryPool[(0 + collageTick) % galleryPool.length].img)}
                  alt={galleryPool[(0 + collageTick) % galleryPool.length].alt}
                  className="hover:scale-[1.03] transition-transform duration-700"
                />
              </div>
              <div className="col-span-1 self-end aspect-square w-full rounded-none overflow-hidden shadow-md bg-neutral-200">
                <CrossfadeImage
                  src={getImageSrc(galleryPool[(1 + collageTick) % galleryPool.length].img)}
                  alt={galleryPool[(1 + collageTick) % galleryPool.length].alt}
                  className="hover:scale-[1.03] transition-transform duration-700"
                />
              </div>

              {/* Fila 2: Cuadrado (1 col) + Rectángulo horizontal (2 cols) pegados justo debajo */}
              <div className="col-span-1 aspect-square rounded-none overflow-hidden shadow-md bg-neutral-200">
                <CrossfadeImage
                  src={getImageSrc(galleryPool[(2 + collageTick) % galleryPool.length].img)}
                  alt={galleryPool[(2 + collageTick) % galleryPool.length].alt}
                  className="hover:scale-[1.03] transition-transform duration-700"
                />
              </div>
              <div className="col-span-2 aspect-[16/10] rounded-none overflow-hidden shadow-md bg-neutral-200">
                <CrossfadeImage
                  src={getImageSrc(galleryPool[(3 + collageTick) % galleryPool.length].img)}
                  alt={galleryPool[(3 + collageTick) % galleryPool.length].alt}
                  className="hover:scale-[1.03] transition-transform duration-700"
                />
              </div>

            </div>
          </div>

          {/* Lado Derecho: 6 cols con el texto y las 4 viñetas */}
          <div className="lg:col-span-6 px-6 sm:px-10 lg:px-12 pt-12 lg:pt-0 space-y-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#2E6B3F]">
              <span className="w-2 h-2 rounded-full bg-[#2E6B3F]" />
              Conoce a FAP
            </div>

            {/* Título afirmativo en verde oscuro/negro + Mostaza en la línea inferior */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#142b1f] leading-tight">
              El territorio florece cuando<br />
              <span className="text-[#E3A72F]">caminamos juntos.</span>
            </h2>

            {/* LISTA DIRECTA CON LAS 4 VIÑETAS (Todas visibles al mismo tiempo, icono a la izquierda) */}
            <div className="space-y-2 pt-2">
              {aboutItemsList.map((item) => {
                const isExpanded = activeExpandedId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveExpandedId(isExpanded ? null : item.id)}
                    className="border-b border-black/10 pb-5 pt-3 transition-all duration-300 cursor-pointer group hover:border-[#75B346]/40"
                  >
                    {/* Fila del Ícono y Título: SIEMPRE a la izquierda */}
                    <div className="flex items-center gap-3.5">
                      {item.icon}
                      <h3 className={`text-xl sm:text-2xl font-bold transition-colors ${isExpanded ? "text-[#75B346]" : "text-[#142b1f] group-hover:text-[#75B346]"}`}>
                        {item.title}
                      </h3>
                    </div>

                    {/* Texto explicativo conciso (máximo 2 líneas, sin flechas ni cajas) */}
                    {isExpanded && (
                      <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mt-2.5 pl-9 line-clamp-2 animate-fadeIn">
                        {item.text}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. CIFRAS DESTACADAS CON CONTADOR ANIMADO (SIN CONTENEDOR / CAJA) */}
      {/* ============================================================== */}
      <section id="cifras" className="py-16 px-6 sm:px-10 lg:px-12 max-w-[1400px] mx-auto border-t border-b border-black/5">
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
      <section id="mapa" className="relative py-24 w-full px-6 sm:px-10 lg:px-12 overflow-hidden">
        
        {/* Fondo full width: SOLO aparece cuando hay una categoría o proyecto seleccionado; al volver a lo general desaparece */}
        {(selectedCategory !== null || mapSelectedProjectId !== null) && (
          <div className="absolute inset-0 z-0 pointer-events-none w-full h-full overflow-hidden animate-fadeIn">
            <img
              key={currentProject.id}
              src={getImageSrc(currentProject.bgPhoto)}
              alt=""
              className="w-full h-full object-cover opacity-50 blur-[3px] scale-105 animate-crossfade"
            />
            <div className="absolute inset-0 bg-[#E6D3B8]/45" />
          </div>
        )}

        <div className="relative z-10 max-w-[1440px] mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* LADO IZQUIERDO: EL MAPA TOPOGRÁFICO REAL CON MAPLIBRE GL (SIN NOMBRES, LIVIANO) */}
            <div className="lg:col-span-7 relative flex items-center justify-center">
              <EcuadorMap
                projects={projectsList}
                activeProjectId={activeProjectId}
                onSelectProject={(proj) => {
                  setActiveProjectId(proj.id);
                  setSelectedCategory(proj.category);
                  setMapSelectedProjectId(proj.id);
                }}
              />
            </div>

            {/* LADO DERECHO: DISEÑO FINO Y FORMAL (SIN CÁPSULAS NI PASTILLAS, SIN PÁRRAFOS DESCRIPTIVOS) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* ENCABEZADO */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#2E6B3F]">
                    <span className="w-2 h-2 rounded-full bg-[#2E6B3F]" />
                    Territorio de Acción
                  </div>
                  {selectedCategory && (
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setMapSelectedProjectId(null);
                      }}
                      className="text-xs font-bold text-[#2E6B3F] hover:text-[#75B346] inline-flex items-center gap-1.5 transition-colors cursor-pointer group uppercase tracking-wider"
                    >
                      <span className="group-hover:-translate-x-1 transition-transform">←</span> Volver a categorías
                    </button>
                  )}
                </div>

                {/* Si se seleccionó una categoría (o se tocó un punto del mapa), la categoría pasa a ser el título */}
                {selectedCategory ? (
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#142b1f] tracking-tight leading-tight animate-fadeIn">
                    {categoryLabels[selectedCategory]}
                  </h2>
                ) : (
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#142b1f] tracking-tight leading-tight">
                    Lugares donde <span className="text-[#75B346]">ayudamos</span>
                  </h2>
                )}
              </div>

              {/* 1. VISTA INICIAL: AL ENTRAR ESTÁN SOLO LAS TRES CATEGORÍAS (FINAS, SIN PASTILLAS) */}
              {!selectedCategory ? (
                <div className="divide-y divide-black/15 pt-2 border-t border-b border-black/15">
                  {(["proyectos", "experiencias", "empresas"] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setMapSelectedProjectId(null);
                      }}
                      className="w-full py-5 text-left flex items-center justify-between text-[#142b1f] hover:text-[#75B346] transition-colors group cursor-pointer"
                    >
                      <span className="text-lg sm:text-xl font-bold tracking-tight">
                        {categoryLabels[cat]}
                      </span>
                      <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-[#75B346] group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              ) : mapSelectedProjectId ? (
                /* 2. SI ENTRÓ DESDE EL MAPA: SE MUESTRA SOLO EL PROYECTO SELECCIONADO (SIN PÁRRAFO DESCRIPTIVO NI PASTILLAS) */
                (() => {
                  const proj = projectsList.find(p => p.id === mapSelectedProjectId) || currentProject;
                  return (
                    <div className="pt-2 border-t border-b border-black/15 animate-fadeIn space-y-4">
                      <div className="py-5 flex items-center justify-between group">
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#75B346] block">
                            Punto seleccionado en el mapa
                          </span>
                          <h3 className="text-2xl sm:text-3xl font-bold text-[#142b1f]">
                            {proj.name}
                          </h3>
                          <span className="text-xs text-neutral-500 font-medium block">
                            {proj.place} &bull; {proj.tag}
                          </span>
                        </div>
                        <Link
                          href={proj.ctaLink}
                          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2E6B3F] hover:text-[#75B346] transition-colors group cursor-pointer shrink-0 ml-4"
                        >
                          <span>Conocer más</span>
                          <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-[#75B346] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </Link>
                      </div>
                      
                      <div className="py-3 flex items-center justify-between text-xs border-t border-black/10">
                        <button
                          onClick={() => setMapSelectedProjectId(null)}
                          className="text-[#2E6B3F] hover:text-[#75B346] font-bold transition-colors cursor-pointer"
                        >
                          Ver todos los proyectos de esta categoría ({projectsList.filter(p => p.category === selectedCategory).length}) →
                        </button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                /* 3. SI DIO CLIC EN UNA CATEGORÍA: SALEN DIRECTO SUS PROYECTOS (FINOS, SIN PÁRRAFOS NI PASTILLAS) */
                <div className="divide-y divide-black/15 pt-2 border-t border-b border-black/15 animate-fadeIn">
                  {projectsList
                    .filter(p => p.category === selectedCategory)
                    .map((proj) => {
                      const isMapActive = activeProjectId === proj.id;
                      return (
                        <div
                          key={proj.id}
                          onClick={() => setActiveProjectId(proj.id)}
                          className="py-4 flex items-center justify-between transition-colors group cursor-pointer"
                        >
                          <div className="space-y-0.5">
                            <span className={`text-base sm:text-lg font-bold transition-colors ${isMapActive ? "text-[#75B346]" : "text-[#142b1f] group-hover:text-[#75B346]"}`}>
                              {proj.name}
                            </span>
                            <span className="text-xs text-neutral-500 block">
                              {proj.place} &bull; {proj.tag}
                            </span>
                          </div>
                          <Link
                            href={proj.ctaLink}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E6B3F] group-hover:text-[#75B346] transition-colors shrink-0 ml-4"
                          >
                            <span>Conocer más</span>
                            <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-[#75B346] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                          </Link>
                        </div>
                      );
                    })}
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. EXPERIENCIAS: GALERÍA FULL-WIDTH ROTATIVA CON MARGEN LIGERO */}
      {/* ============================================================== */}
      <section id="galeria" className="py-24 w-full">
        {/* Título pegado al lado izquierdo de la galería */}
        <div className="w-full px-6 sm:px-10 lg:px-12 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#2E6B3F] mb-2">
              <span className="w-2 h-2 rounded-full bg-[#2E6B3F]" />
              Experiencias en Campo
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#142b1f]">
              Galería de <span className="text-[#E3A72F]">vivencias y territorio.</span>
            </h2>
            <p className="text-neutral-600 mt-2 text-base">
              Momentos reales de voluntariado, siembra, rescate de saberes y trabajo comunitario en la Amazonía ecuatoriana.
            </p>
          </div>
        </div>

        {/* MOSAICO FULL-WIDTH (Todo el ancho completo, margen mínimo gap-1, rectángulos y cuadrados con crossfade suave) */}
        <div className="w-full grid grid-cols-2 md:grid-cols-6 gap-1">
          
          {/* Bloque principal 2x2 */}
          <div className="col-span-2 row-span-2 aspect-square rounded-none overflow-hidden bg-neutral-200">
            <CrossfadeImage
              src={getImageSrc(galleryPool[(0 + galleryTick) % galleryPool.length].img)}
              alt={galleryPool[(0 + galleryTick) % galleryPool.length].alt}
              className="hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Fila superior derecha: 2 cuadrados + 1 rectángulo horizontal (2:1) */}
          <div className="col-span-1 aspect-square rounded-none overflow-hidden bg-neutral-200">
            <CrossfadeImage
              src={getImageSrc(galleryPool[(1 + galleryTick) % galleryPool.length].img)}
              alt={galleryPool[(1 + galleryTick) % galleryPool.length].alt}
              className="hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="col-span-1 aspect-square rounded-none overflow-hidden bg-neutral-200">
            <CrossfadeImage
              src={getImageSrc(galleryPool[(2 + galleryTick) % galleryPool.length].img)}
              alt={galleryPool[(2 + galleryTick) % galleryPool.length].alt}
              className="hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="col-span-2 aspect-[2/1] rounded-none overflow-hidden bg-neutral-200">
            <CrossfadeImage
              src={getImageSrc(galleryPool[(3 + galleryTick) % galleryPool.length].img)}
              alt={galleryPool[(3 + galleryTick) % galleryPool.length].alt}
              className="hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Fila inferior derecha: 1 rectángulo horizontal (2:1) + 2 cuadrados */}
          <div className="col-span-2 aspect-[2/1] rounded-none overflow-hidden bg-neutral-200">
            <CrossfadeImage
              src={getImageSrc(galleryPool[(4 + galleryTick) % galleryPool.length].img)}
              alt={galleryPool[(4 + galleryTick) % galleryPool.length].alt}
              className="hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="col-span-1 aspect-square rounded-none overflow-hidden bg-neutral-200">
            <CrossfadeImage
              src={getImageSrc(galleryPool[(1 + galleryTick) % galleryPool.length].img)}
              alt={galleryPool[(1 + galleryTick) % galleryPool.length].alt}
              className="hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="col-span-1 aspect-square rounded-none overflow-hidden bg-[#ece8dd]">
            <CrossfadeImage
              src={getImageSrc(galleryPool[(0 + galleryTick) % galleryPool.length].img)}
              alt={galleryPool[(0 + galleryTick) % galleryPool.length].alt}
              className="hover:scale-105 transition-transform duration-700"
            />
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. LOGOS DE ALIANZAS Y PATROCINADORES EN MOVIMIENTO CONTINUO */}
      {/* ============================================================== */}
      <section className="py-12 px-6 sm:px-10 lg:px-12 max-w-[1400px] mx-auto border-t border-b border-black/10">
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
      {/* 7. NUESTRO EQUIPO (DISEÑO EDITORIAL AMPLIO Y LARGO) */}
      {/* ============================================================== */}
      <section id="equipo" className="py-24 px-6 sm:px-10 lg:px-14 w-full max-w-[1680px] mx-auto">
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#2E6B3F] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#2E6B3F]" />
            Equipo de Trabajo
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#142b1f]">
            Quienes caminan <span className="text-[#75B346]">junto al territorio.</span>
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

      {/* ============================================================== */}
      {/* 7. FOOTER CON RELIEVE DE MONTAÑA REAL ESCALADO AL ANCHO COMPLETO */}
      {/* ============================================================== */}
      <footer id="contacto" className="relative bg-[#142b1f] text-white pt-12 pb-12 mt-44 sm:mt-56">
        
        {/* Silueta de montaña real apoyada exactamente sobre el borde del footer y escalada al ancho completo */}
        <div className="absolute bottom-full left-0 right-0 w-full overflow-hidden pointer-events-none z-10">
          <img
            src={getImageSrc(mountainFooterImage)}
            alt=""
            className="w-[140%] -ml-[20%] sm:w-[128%] sm:-ml-[14%] max-w-none h-auto object-bottom select-none block translate-y-[2px]"
          />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 relative z-20">
          
          {/* Fila Principal: Newsletter integrado directamente (sin contenedor separado) y Contacto */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-white/10">
            
            {/* Newsletter Integrado Directamente */}
            <div className="lg:col-span-5 space-y-4">
              <Logo light={true} />
              <p className="text-sm text-neutral-300 leading-relaxed mt-2 max-w-sm">
                Súmate a nuestro boletín para recibir historias de territorio, convocatorias de voluntariado y avances de proyectos.
              </p>
              
              {/* Formulario directo sin caja extra */}
              <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 max-w-md pt-2">
                <input
                  type="email"
                  placeholder="Tu correo electrónico..."
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-neutral-400 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#B7D84B]"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#B7D84B] hover:bg-[#b5e642] text-[#0c0e0b] font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shrink-0"
                >
                  Suscribirme
                </button>
              </form>
            </div>

            {/* Datos Oficiales de Contacto */}
            <div className="lg:col-span-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#B7D84B]">Contacto Oficial</h4>
              <p className="text-sm text-neutral-300">
                <strong className="block text-white font-semibold">Dirección:</strong>
                Mariscal Foch E4-261 y Av. Río Amazonas, Quito - Ecuador.
              </p>
              <p className="text-sm text-neutral-300">
                <strong className="block text-white font-semibold">Teléfono / WhatsApp:</strong>
                <a href="https://wa.me/593991345174" target="_blank" rel="noopener noreferrer" className="hover:text-[#B7D84B] transition-colors">
                  +593 99 134 5174
                </a>
              </p>
              <p className="text-sm text-neutral-300">
                <strong className="block text-white font-semibold">Correo Electrónico:</strong>
                <a href="mailto:support@fapecuador.org" className="hover:text-[#B7D84B] transition-colors">
                  support@fapecuador.org
                </a>
              </p>
            </div>

            {/* Enlaces y Redes Sociales */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#B7D84B]">Enlaces Legales &amp; Redes</h4>
              <ul className="space-y-1.5 text-sm text-neutral-300">
                <li><a href="#inicio" className="hover:text-[#B7D84B] transition-colors">Inicio</a></li>
                <li><a href="#nosotros" className="hover:text-[#B7D84B] transition-colors">¿Quiénes somos?</a></li>
                <li><a href="#mapa" className="hover:text-[#B7D84B] transition-colors">Proyectos y Mapa</a></li>
                <li><a href="#contacto" className="hover:text-[#B7D84B] transition-colors">Política de Privacidad</a></li>
              </ul>
              <div className="flex items-center gap-4 pt-3">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-[#B7D84B] text-sm font-semibold transition-colors">
                  Instagram
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-[#B7D84B] text-sm font-semibold transition-colors">
                  Facebook
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-[#B7D84B] text-sm font-semibold transition-colors">
                  LinkedIn
                </a>
              </div>
            </div>

          </div>

          {/* Fila Inferior: Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
            <p>© 2026 Fundación Amazonía Productiva. Todos los derechos reservados.</p>
            <p>Ecuador · Amazonía · Galápagos</p>
          </div>

        </div>
      </footer>

    </main>
  );
}
