"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import continentGeo from "@/assets/ecuador-continent.json";
import galapagosGeo from "@/assets/ecuador-galapagos.json";

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

// Clasificación de regiones para gradientes topográficos (Cordillera Sierra, Amazonía, Costa)
const SIERRA_PROVINCES = new Set([
  "Carchi", "Imbabura", "Pichincha", "Cotopaxi", "Tungurahua",
  "Bolivar", "Chimborazo", "Cañar", "Azuay", "Loja"
]);

const AMAZONIA_PROVINCES = new Set([
  "Sucumbios", "Orellana", "Napo", "Pastaza", "Morona Santiago", "Zamora Chinchipe"
]);

function getProvinceColor(name: string): string {
  if (SIERRA_PROVINCES.has(name)) {
    return "url(#grad-sierra)";
  }
  if (AMAZONIA_PROVINCES.has(name)) {
    return "url(#grad-amazonia)";
  }
  return "url(#grad-costa)";
}

export default function EcuadorMap({ projects, activeProjectId, onSelectProject }: EcuadorMapProps) {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  const galapagosProject = projects.find(p => p.id === "galapagos");
  const continentProjects = projects.filter(p => p.id !== "galapagos");

  return (
    <div className="relative w-full max-w-[860px] mx-auto select-none">
      
      {/* MAPA PRINCIPAL: ECUADOR CONTINENTAL (Más grande, con relieve + textura de curvas de nivel topográficas) */}
      <div className="relative w-full aspect-[1.06/1] drop-shadow-[0_22px_38px_rgba(20,43,31,0.18)]">
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
            {/* Gradiente Cordillera de los Andes (Sierra) */}
            <linearGradient id="grad-sierra" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c28c4e" />
              <stop offset="50%" stopColor="#a36f38" />
              <stop offset="100%" stopColor="#825324" />
            </linearGradient>

            {/* Gradiente Selva Amazónica */}
            <linearGradient id="grad-amazonia" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b7845" />
              <stop offset="55%" stopColor="#2b5d34" />
              <stop offset="100%" stopColor="#1c4223" />
            </linearGradient>

            {/* Gradiente Costa */}
            <linearGradient id="grad-costa" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#72a152" />
              <stop offset="55%" stopColor="#5c8740" />
              <stop offset="100%" stopColor="#466b2e" />
            </linearGradient>

            {/* Patrón de curvas de nivel topográficas sutiles */}
            <pattern id="topo-contours" width="60" height="60" patternUnits="userSpaceOnUse">
              <path
                d="M0 15 Q 15 5, 30 15 T 60 15 M0 35 Q 20 22, 35 35 T 60 35 M0 55 Q 15 44, 32 55 T 60 55"
                fill="none"
                stroke="rgba(255, 250, 235, 0.16)"
                strokeWidth="0.9"
              />
              <path
                d="M10 0 Q 22 18, 10 35 T 10 60 M42 0 Q 54 20, 40 38 T 42 60"
                fill="none"
                stroke="rgba(20, 43, 31, 0.12)"
                strokeWidth="0.7"
              />
            </pattern>

            {/* Filtro de textura topográfica / relieve montañoso más marcado */}
            <filter id="topo-relief" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.065"
                numOctaves="6"
                seed="11"
                result="terrainNoise"
              />
              <feDiffuseLighting
                in="terrainNoise"
                lightingColor="#fff8e8"
                surfaceScale="3.8"
                diffuseConstant="1.2"
                result="hillshade"
              >
                <feDistantLight azimuth="315" elevation="42" />
              </feDiffuseLighting>
              <feComposite
                in="hillshade"
                in2="SourceGraphic"
                operator="in"
                result="clippedHillshade"
              />
              <feBlend
                in="SourceGraphic"
                in2="clippedHillshade"
                mode="multiply"
              />
            </filter>
          </defs>

          {/* Capa base con relieve topográfico 3D */}
          <g filter="url(#topo-relief)">
            <Geographies geography={continentGeo}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const name = geo.properties?.name || "";
                  const isHovered = hoveredProvince === name;
                  const fillUrl = getProvinceColor(name);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isHovered ? "#9ecb36" : fillUrl}
                      stroke="rgba(255, 255, 255, 0.35)"
                      strokeWidth={0.8}
                      onMouseEnter={() => setHoveredProvince(name)}
                      onMouseLeave={() => setHoveredProvince(null)}
                      style={{
                        default: {
                          fill: fillUrl,
                          stroke: "rgba(255, 255, 255, 0.35)",
                          strokeWidth: 0.8,
                          outline: "none",
                          transition: "fill 220ms ease"
                        },
                        hover: {
                          fill: "#9ecb36",
                          stroke: "#ffffff",
                          strokeWidth: 1.2,
                          outline: "none",
                          cursor: "default"
                        },
                        pressed: {
                          fill: "#9ecb36",
                          outline: "none"
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </g>

          {/* Capa superpuesta de curvas de nivel topográficas */}
          <g className="pointer-events-none">
            <Geographies geography={continentGeo}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={`${geo.rsmKey}-contours`}
                    geography={geo}
                    fill="url(#topo-contours)"
                    stroke="none"
                    style={{
                      default: { fill: "url(#topo-contours)", outline: "none" },
                      hover: { fill: "url(#topo-contours)", outline: "none" },
                      pressed: { fill: "url(#topo-contours)", outline: "none" }
                    }}
                  />
                ))
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
                  opacity={isSelected ? 0.75 : 0.28}
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

        {/* ISLAS GALÁPAGOS FLOTANDO LIBRES (SIN CAJA NI CUADRADO QUE LAS CUBRA) */}
        <div className="absolute top-[2%] left-[0%] w-[28%] aspect-square pointer-events-auto drop-shadow-[0_12px_20px_rgba(20,43,31,0.16)]">
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
                <stop offset="0%" stopColor="#619149" />
                <stop offset="100%" stopColor="#3c662d" />
              </linearGradient>
              <pattern id="galapagos-contours" width="36" height="36" patternUnits="userSpaceOnUse">
                <path
                  d="M0 10 Q 10 3, 18 10 T 36 10 M0 26 Q 12 18, 22 26 T 36 26"
                  fill="none"
                  stroke="rgba(255, 250, 235, 0.22)"
                  strokeWidth="0.7"
                />
              </pattern>
              <filter id="galapagos-relief" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="5" seed="4" result="noise" />
                <feDiffuseLighting in="noise" lightingColor="#fff8e8" surfaceScale="3" result="light">
                  <feDistantLight azimuth="315" elevation="45" />
                </feDiffuseLighting>
                <feComposite in="light" in2="SourceGraphic" operator="in" result="clipped" />
                <feBlend in="SourceGraphic" in2="clipped" mode="multiply" />
              </filter>
            </defs>

            <g filter="url(#galapagos-relief)">
              <Geographies geography={galapagosGeo}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="url(#grad-galapagos)"
                      stroke="rgba(255, 255, 255, 0.5)"
                      strokeWidth={0.7}
                      style={{
                        default: {
                          fill: "url(#grad-galapagos)",
                          stroke: "rgba(255, 255, 255, 0.5)",
                          strokeWidth: 0.7,
                          outline: "none"
                        },
                        hover: {
                          fill: "#9ecb36",
                          outline: "none",
                          cursor: "pointer"
                        }
                      }}
                    />
                  ))
                }
              </Geographies>
            </g>

            {/* Curvas de nivel sobre Galápagos */}
            <g className="pointer-events-none">
              <Geographies geography={galapagosGeo}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={`${geo.rsmKey}-contours`}
                      geography={geo}
                      fill="url(#galapagos-contours)"
                      stroke="none"
                      style={{
                        default: { fill: "url(#galapagos-contours)", outline: "none" },
                        hover: { fill: "url(#galapagos-contours)", outline: "none" }
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
          <span className="w-3 h-3 bg-[#2b5d34]" />
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
