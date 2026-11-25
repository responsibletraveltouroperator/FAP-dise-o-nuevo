"use client";

import { useEffect, useState } from "react";
import mountainFooterImage from "@/assets/fap-mountain-footer-pxl.png";
import logoColorImg from "@/assets/fap-logo-color.png";
import logoBlancoImg from "@/assets/fap-logo-blanco.webp";

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

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a className="flex items-center transition-opacity hover:opacity-90" href="/#inicio" aria-label="Fundación Amazonía Productiva, inicio">
      <img
        src={getImageSrc(light ? logoBlancoImg : logoColorImg)}
        alt="Fundación Amazonía Productiva"
        className={
          light
            ? "h-[96px] sm:h-[106px] -my-4 w-auto object-contain"
            : "h-16 sm:h-[70px] w-auto object-contain"
        }
      />
    </a>
  );
}

type MapaNavPayload = {
  category: "proyectos" | "experiencias" | "empresas";
  projectId?: string;
};

function dispatchMapaNav(payload: MapaNavPayload) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem("fap_pending_mapa_nav", JSON.stringify(payload));
  } catch {
    // ignore storage errors
  }
  window.dispatchEvent(new CustomEvent<MapaNavPayload>("fap:nav-mapa", { detail: payload }));
}

type ThemeCatKey = "conservacion" | "desarrollo" | "cultura";

const projectMenuTree: {
  key: ThemeCatKey;
  label: string;
  projects: { name: string; subtitle: string; href: string }[];
}[] = [
  {
    key: "conservacion",
    label: "Conservación, Ecosistemas y Turismo Sostenible",
    projects: [
      {
        name: "Adopta un Árbol + Proyecto Carbon Offset",
        subtitle: "Reforestación y compensación de huella",
        href: "/proyectos/raices-productivas",
      },
      {
        name: "Proyecto Loma Delgada",
        subtitle: "Reseña y enlace externo de donaciones",
        href: "/#contacto",
      },
      {
        name: "ABEJAS PURUNUMA",
        subtitle: "Adopta un apicultor",
        href: "/#contacto",
      },
    ],
  },
  {
    key: "desarrollo",
    label: "Desarrollo Social y Economía Popular",
    projects: [
      {
        name: "Apadrina un Niño + Proyecto Chaka Sucúa",
        subtitle: "Apoyo a sectores vulnerables y cadenas productivas",
        href: "/#contacto",
      },
    ],
  },
  {
    key: "cultura",
    label: "Identidad, Cultura y Comunidad",
    projects: [
      {
        name: "Proyectos Culturales",
        subtitle: "POESÍA GAONESA, libros que recaudan fondos",
        href: "/#contacto",
      },
    ],
  },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [proyectosOpen, setProyectosOpen] = useState(false);
  const [activeThemeMenu, setActiveThemeMenu] = useState<ThemeCatKey>("conservacion");
  const [voluntariadoOpen, setVoluntariadoOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentThemeNode =
    projectMenuTree.find((c) => c.key === activeThemeMenu) || projectMenuTree[0];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 sm:px-12 lg:px-16 text-white transition-all duration-300 ${
        isScrolled
          ? "bg-[#142b1f]/95 backdrop-blur-md shadow-lg py-4 border-b border-white/10"
          : "bg-transparent py-6"
      }`}
    >
      <Logo light={isScrolled} />

      <nav className={`fixed inset-0 bg-[#0c0e0b]/95 backdrop-blur-xl flex flex-col justify-center items-center gap-5 text-lg font-medium transition-all duration-300 md:static md:inset-auto md:bg-transparent md:backdrop-blur-none md:flex-row md:gap-6 md:text-sm lg:gap-8 overflow-y-auto md:overflow-visible py-16 md:py-0 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto"}`}>
        <a
          href="/#nosotros"
          onClick={() => setMenuOpen(false)}
          className="hover:text-[#B7D84B] transition-colors whitespace-nowrap"
        >
          ¿Quiénes somos?
        </a>

        {/* PROYECTOS: Desplegable en cascada con Categorías -> Proyectos */}
        <div
          className="relative flex flex-col items-center md:block"
          onMouseEnter={() => setProyectosOpen(true)}
          onMouseLeave={() => setProyectosOpen(false)}
        >
          <button
            type="button"
            onClick={() => setProyectosOpen((prev) => !prev)}
            className="inline-flex items-center gap-1 hover:text-[#B7D84B] transition-colors whitespace-nowrap cursor-pointer"
          >
            Proyectos
            <svg className="w-3.5 h-3.5 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {/* Desktop: Mega-dropdown de 2 columnas (Categorías a la izquierda, Proyectos a la derecha) */}
          <div
            className={`hidden md:block absolute left-0 top-full pt-2 transition-all duration-200 ${
              proyectosOpen ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-1"
            }`}
          >
            <div className="w-[560px] rounded-2xl bg-[#142b1f]/98 backdrop-blur-md border border-white/15 shadow-2xl p-3 grid grid-cols-12 gap-3">
              <div className="col-span-6 border-r border-white/10 pr-2 space-y-1">
                <span className="px-3 py-1 block text-[10px] font-bold uppercase tracking-widest text-[#B7D84B]/80">
                  Categorías
                </span>
                {projectMenuTree.map((cat) => {
                  const active = cat.key === activeThemeMenu;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onMouseEnter={() => setActiveThemeMenu(cat.key)}
                      onClick={() => setActiveThemeMenu(cat.key)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                        active ? "bg-white/10 text-[#B7D84B]" : "text-white/85 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>{cat.label}</span>
                      <svg className="w-3.5 h-3.5 shrink-0 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  );
                })}
              </div>

              <div className="col-span-6 pl-1 space-y-1">
                <span className="px-3 py-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Proyectos
                </span>
                {currentThemeNode.projects.map((proj) => (
                  <a
                    key={proj.name}
                    href={proj.href}
                    onClick={() => setProyectosOpen(false)}
                    className="block px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <span className="block text-xs font-bold text-white group-hover:text-[#B7D84B] transition-colors">
                      {proj.name}
                    </span>
                    <span className="block text-[11px] text-neutral-400 leading-snug mt-0.5">
                      {proj.subtitle}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile: lista expandible */}
          {proyectosOpen && (
            <div className="md:hidden mt-2 w-72 rounded-xl bg-white/5 border border-white/10 p-3 space-y-3 text-left">
              {projectMenuTree.map((cat) => (
                <div key={cat.key} className="space-y-1">
                  <span className="block text-[11px] font-bold text-[#B7D84B]">{cat.label}</span>
                  <div className="pl-2 space-y-1 border-l border-white/15">
                    {cat.projects.map((proj) => (
                      <a
                        key={proj.name}
                        href={proj.href}
                        onClick={() => {
                          setMenuOpen(false);
                          setProyectosOpen(false);
                        }}
                        className="block text-xs text-white/90 hover:text-[#B7D84B] py-0.5"
                      >
                        {proj.name}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className="relative flex flex-col items-center md:block"
          onMouseEnter={() => setVoluntariadoOpen(true)}
          onMouseLeave={() => setVoluntariadoOpen(false)}
        >
          <a
            href="/#mapa"
            onClick={() => {
              setMenuOpen(false);
              setVoluntariadoOpen(false);
              dispatchMapaNav({ category: "experiencias" });
            }}
            className="inline-flex items-center gap-1 hover:text-[#B7D84B] transition-colors whitespace-nowrap"
          >
            Voluntariado
            <svg className="w-3.5 h-3.5 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </a>

          {/* Submenú directo: San Antonio de las Aradas y Galápagos */}
          <div
            className={`md:absolute md:left-0 md:top-full md:pt-2 transition-all duration-200 ${
              voluntariadoOpen ? "md:opacity-100 md:pointer-events-auto md:translate-y-0" : "md:opacity-0 md:pointer-events-none md:-translate-y-1"
            } ${menuOpen ? "mt-2 flex flex-col items-center gap-2 text-sm text-neutral-300" : "hidden md:block"}`}
          >
            <div className="md:w-64 md:rounded-xl md:bg-[#142b1f]/95 md:backdrop-blur-md md:border md:border-white/15 md:shadow-xl md:py-2 flex flex-col">
              <a
                href="/#mapa"
                onClick={() => {
                  setMenuOpen(false);
                  setVoluntariadoOpen(false);
                  dispatchMapaNav({ category: "experiencias", projectId: "aradas" });
                }}
                className="px-4 py-2 text-left text-xs sm:text-sm text-white/90 hover:text-[#B7D84B] md:hover:bg-white/5 transition-colors"
              >
                San Antonio de las Aradas
              </a>
              <a
                href="/#mapa"
                onClick={() => {
                  setMenuOpen(false);
                  setVoluntariadoOpen(false);
                  dispatchMapaNav({ category: "experiencias", projectId: "galapagos" });
                }}
                className="px-4 py-2 text-left text-xs sm:text-sm text-white/90 hover:text-[#B7D84B] md:hover:bg-white/5 transition-colors"
              >
                Islas Galápagos
              </a>
            </div>
          </div>
        </div>

        <a
          href="/#mapa"
          onClick={() => {
            setMenuOpen(false);
            dispatchMapaNav({ category: "empresas" });
          }}
          className="hover:text-[#B7D84B] transition-colors whitespace-nowrap"
        >
          Sostenibilidad y Empresas
        </a>

        <a
          href="/#contacto"
          onClick={() => setMenuOpen(false)}
          className="hover:text-[#B7D84B] transition-colors whitespace-nowrap"
        >
          Ecotienda &amp; Blog
        </a>

        <a href="/#contacto" onClick={() => setMenuOpen(false)} className="bg-[#B7D84B] text-[#0c0e0b] px-5 py-2.5 rounded-full font-bold hover:bg-[#b5e642] shadow-sm transition-all md:inline-flex items-center gap-2 whitespace-nowrap">
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
  );
}

export function SiteFooter() {
  return (
    <footer id="contacto" className="relative bg-[#142b1f] text-white pt-14 pb-12 mt-44 sm:mt-56">
      <div className="absolute bottom-full left-0 right-0 w-full overflow-hidden pointer-events-none z-10 translate-y-[calc(18%+50px)]">
        <img
          src={getImageSrc(mountainFooterImage)}
          alt=""
          className="w-[140%] -ml-[20%] sm:w-[128%] sm:-ml-[14%] max-w-none h-auto object-bottom select-none block"
        />
        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-b from-transparent via-[#142b1f]/80 to-[#142b1f]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-white/10">
          <div className="lg:col-span-5 space-y-4">
            <Logo light={true} />
            <p className="text-sm text-neutral-300 leading-relaxed mt-2 max-w-sm">
              Súmate a nuestro boletín para recibir historias de territorio, convocatorias de voluntariado y avances de proyectos.
            </p>
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

          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#B7D84B]">Enlaces Legales &amp; Redes</h4>
            <ul className="space-y-1.5 text-sm text-neutral-300">
              <li><a href="/#inicio" className="hover:text-[#B7D84B] transition-colors">Inicio</a></li>
              <li><a href="/#nosotros" className="hover:text-[#B7D84B] transition-colors">¿Quiénes somos?</a></li>
              <li><a href="/#mapa" className="hover:text-[#B7D84B] transition-colors">Proyectos y Mapa</a></li>
              <li><a href="/#contacto" className="hover:text-[#B7D84B] transition-colors">Política de Privacidad</a></li>
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

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <p>© 2026 Fundación Amazonía Productiva. Todos los derechos reservados.</p>
          <p>Ecuador · Amazonía · Galápagos</p>
        </div>
      </div>
    </footer>
  );
}
