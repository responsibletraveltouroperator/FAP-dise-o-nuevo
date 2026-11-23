"use client";

import { useState, type ComponentProps } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import continentGeo from "@/assets/ecuador-continent.json";
import galapagosGeo from "@/assets/ecuador-galapagos.json";

type GeoProp = ComponentProps<typeof Geographies>["geography"];
const continentGeography = continentGeo as unknown as GeoProp;
const galapagosGeography = galapagosGeo as unknown as GeoProp;

export interface MapProject {
  id: string;
  name: string;
  category: "proyectos" | "experiencias" | "empresas";
  place: string;
  tag: string;
  lng: number;
  lat: number;
}

interface EcuadorMapProps {
  projects: MapProject[];
  activeProjectId: string;
  onSelectProject: (proj: MapProject) => void;
}

export default function EcuadorMap({ projects, activeProjectId, onSelectProject }: EcuadorMapProps) {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  const galapagosProject = projects.find(p => p.id === "galapagos");
  const continentProjects = projects.filter(p => p.id !== "galapagos");

  return (
    <div className="relative w-full max-w-[860px] mx-auto select-none">
      
      {/* MAPA PRINCIPAL: ECUADOR CONTINENTAL (Relieve hipsométrico continuo + sombreado 3D multifrecuencia realista) */}
      <div className="relative w-full aspect-[1.06/1] drop-shadow-[0_24px_40px_rgba(20,43,31,0.22)]">
        <ComposableMap
          width={800}
          height={740}
          projection="geoMercator"
          projectionConfig={{
            center: [-78.45, -1.65],
            scale: 5500
          }}
          className="w-full h-full"
        >
          <defs>
            {/* Gradiente hipsométrico continuo Oeste -> Centro -> Este (Costa -> Cordillera de los Andes -> Amazonía) */}
            <linearGradient
              id="ecuador-hypsometric"
              gradientUnits="userSpaceOnUse"
              x1="130"
              y1="140"
              x2="660"
              y2="290"
            >
              <stop offset="0%" stopColor="#56823e" />
              <stop offset="22%" stopColor="#659148" />
              <stop offset="33%" stopColor="#8a6c3a" />
              <stop offset="44%" stopColor="#a9753c" />
              <stop offset="53%" stopColor="#8b6233" />
              <stop offset="63%" stopColor="#3b6e3e" />
              <stop offset="82%" stopColor="#285630" />
              <stop offset="100%" stopColor="#1b4022" />
            </linearGradient>

            {/* Filtro de relieve topográfico realista multifrecuencia (macro-cordilleras + micro-textura de terreno) */}
            <filter id="topo-realistic" x="-8%" y="-8%" width="116%" height="116%">
              {/* Macro relieve (grandes cadenas montañosas y valles) */}
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.022 0.028"
                numOctaves="5"
                seed="14"
                result="macroNoise"
              />
              <feDiffuseLighting
                in="macroNoise"
                lightingColor="#fff6e0"
                surfaceScale="6.5"
                diffuseConstant="1.25"
                result="macroLight"
              >
                <feDistantLight azimuth="315" elevation="38" />
              </feDiffuseLighting>

              {/* Micro relieve (rugosidad natural de quebradas, bosques y suelo) */}
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.095"
                numOctaves="4"
                seed="29"
                result="microNoise"
              />
              <feDiffuseLighting
                in="microNoise"
                lightingColor="#ffffff"
                surfaceScale="2.6"
                diffuseConstant="1.1"
                result="microLight"
              >
                <feDistantLight azimuth="310" elevation="45" />
              </feDiffuseLighting>

              {/* Combinar macro + micro relieve */}
              <feBlend in="macroLight" in2="microLight" mode="multiply" result="combinedLight" />

              {/* Recortar exactamente al territorio y multiplicar sobre el color hipsométrico */}
              <feComposite in="combinedLight" in2="SourceGraphic" operator="in" result="clippedRelief" />
              <feBlend in="SourceGraphic" in2="clippedRelief" mode="multiply" />
            </filter>
          </defs>

          {/* Territorio Continental con textura topográfica realista continua */}
          <g filter="url(#topo-realistic)">
            <Geographies geography={continentGeography}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const name = geo.properties?.name || "";
                  const isHovered = hoveredProvince === name;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isHovered ? "#9ecb36" : "url(#ecuador-hypsometric)"}
                      stroke={isHovered ? "rgba(255,255,255,0.85)" : "rgba(255, 255, 255, 0.16)"}
                      strokeWidth={isHovered ? 1 : 0.45}
                      onMouseEnter={() => setHoveredProvince(name)}
                      onMouseLeave={() => setHoveredProvince(null)}
                      style={{
                        fill: isHovered ? "#9ecb36" : "url(#ecuador-hypsometric)",
                        outline: "none",
                        transition: "fill 220ms ease"
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </g>

          {/* MARCADORES / PINES INTERACTIVOS POR COORDENADAS REALES [longitud, latitud] */}
          {continentProjects.map((proj) => {
            const isSelected = activeProjectId === proj.id;
            return (
              <Marker
                key={proj.id}
                coordinates={[proj.lng, proj.lat]}
                onClick={() => onSelectProject(proj)}
                className="cursor-pointer group"
              >
                <circle
                  r={isSelected ? 18 : 10}
                  fill={isSelected ? "#9ecb36" : "#225333"}
                  opacity={isSelected ? 0.75 : 0.3}
                  className={isSelected ? "animate-pulse-pin" : "group-hover:opacity-65 transition-opacity"}
                />

                <circle
                  r={isSelected ? 7.5 : 5.5}
                  fill={isSelected ? "#0c0e0b" : "#142b1f"}
                  stroke={isSelected ? "#9ecb36" : "#ffffff"}
                  strokeWidth={isSelected ? 2 : 1.2}
                  className="transition-transform duration-300 group-hover:scale-125"
                />

                <circle
                  r={isSelected ? 3 : 2}
                  fill={isSelected ? "#9ecb36" : "#ffffff"}
                />

                <text
                  textAnchor="middle"
                  y={-15}
                  className={`text-[12px] font-bold tracking-tight pointer-events-none transition-opacity duration-200 fill-[#10120f] ${
                    isSelected ? "opacity-100 font-extrabold" : "opacity-0 group-hover:opacity-100"
                  }`}
                  style={{
                    paintOrder: "stroke",
                    stroke: "#ffffff",
                    strokeWidth: 3.5,
                    strokeLinejoin: "round"
                  }}
                >
                  {proj.place}
                </text>
              </Marker>
            );
          })}
        </ComposableMap>

        {/* ISLAS GALÁPAGOS FLOTANDO LIBRES (Con relieve volcánico realista, sin caja cuadrada) */}
        <div className="absolute top-[2%] left-[0%] w-[28%] aspect-square pointer-events-auto drop-shadow-[0_14px_22px_rgba(20,43,31,0.18)]">
          <ComposableMap
            width={300}
            height={300}
            projection="geoMercator"
            projectionConfig={{
              center: [-90.5, -0.55],
              scale: 7200
            }}
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="grad-galapagos" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6b964c" />
                <stop offset="50%" stopColor="#587b3c" />
                <stop offset="100%" stopColor="#3c5e2c" />
              </linearGradient>
              <filter id="galapagos-realistic" x="-12%" y="-12%" width="124%" height="124%">
                <feTurbulence type="fractalNoise" baseFrequency="0.065" numOctaves="5" seed="7" result="noise" />
                <feDiffuseLighting in="noise" lightingColor="#fff6e0" surfaceScale="5" diffuseConstant="1.2" result="light">
                  <feDistantLight azimuth="315" elevation="38" />
                </feDiffuseLighting>
                <feComposite in="light" in2="SourceGraphic" operator="in" result="clipped" />
                <feBlend in="SourceGraphic" in2="clipped" mode="multiply" />
              </filter>
            </defs>

            <g filter="url(#galapagos-realistic)">
              <Geographies geography={galapagosGeography}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={hoveredProvince === "Galápagos" ? "#9ecb36" : "url(#grad-galapagos)"}
                      stroke="rgba(255, 255, 255, 0.3)"
                      strokeWidth={0.5}
                      onMouseEnter={() => setHoveredProvince("Galápagos")}
                      onMouseLeave={() => setHoveredProvince(null)}
                      style={{
                        fill: hoveredProvince === "Galápagos" ? "#9ecb36" : "url(#grad-galapagos)",
                        outline: "none",
                        cursor: "pointer",
                        transition: "fill 220ms ease"
                      }}
                    />
                  ))
                }
              </Geographies>
            </g>

            {/* Pin de Galápagos */}
            {galapagosProject && (
              <Marker
                coordinates={[galapagosProject.lng, galapagosProject.lat]}
                onClick={() => onSelectProject(galapagosProject)}
                className="cursor-pointer group"
              >
                <circle
                  r={activeProjectId === "galapagos" ? 16 : 9}
                  fill={activeProjectId === "galapagos" ? "#9ecb36" : "#225333"}
                  opacity={activeProjectId === "galapagos" ? 0.75 : 0.35}
                  className={activeProjectId === "galapagos" ? "animate-pulse-pin" : "group-hover:opacity-65"}
                />
                <circle
                  r={activeProjectId === "galapagos" ? 6.5 : 5}
                  fill={activeProjectId === "galapagos" ? "#0c0e0b" : "#142b1f"}
                  stroke={activeProjectId === "galapagos" ? "#9ecb36" : "#ffffff"}
                  strokeWidth={activeProjectId === "galapagos" ? 2 : 1}
                />
                <circle
                  r={activeProjectId === "galapagos" ? 2.5 : 2}
                  fill={activeProjectId === "galapagos" ? "#9ecb36" : "#ffffff"}
                />
              </Marker>
            )}
          </ComposableMap>

          {/* Etiqueta sutil sin contenedor */}
          <span className="block text-center text-[10px] font-extrabold uppercase tracking-widest text-[#225333]/85 -mt-4 pointer-events-none">
            Islas Galápagos
          </span>
        </div>

      </div>

      {/* Leyenda sutil de regiones naturales de Ecuador */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold text-neutral-600">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#5c8740]" />
          <span>Costa</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#a36f38]" />
          <span>Sierra (Cordillera)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#285630]" />
          <span>Amazonía</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#4c7939]" />
          <span>Galápagos</span>
        </div>
      </div>

    </div>
  );
}
