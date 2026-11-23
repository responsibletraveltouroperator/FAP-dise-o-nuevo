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
    <div className="relative w-full max-w-[900px] mx-auto select-none">
      
      {/* MAPA PRINCIPAL: ECUADOR CONTINENTAL (Más grande y con orientación topográfica real) */}
      <div className="relative w-full aspect-[1.04/1] drop-shadow-[0_24px_42px_rgba(20,43,31,0.22)]">
        <ComposableMap
          width={800}
          height={760}
          projection="geoMercator"
          projectionConfig={{
            center: [-78.55, -1.68],
            scale: 6150
          }}
          className="w-full h-full"
        >
          <defs>
            {/* Gradiente hipsométrico calibrado al eje real de los Andes ecuatorianos (NNE -> SSW) */}
            <linearGradient
              id="ecuador-hypsometric"
              gradientUnits="userSpaceOnUse"
              x1="150"
              y1="260"
              x2="650"
              y2="410"
            >
              {/* Costa ecuatoriana */}
              <stop offset="0%" stopColor="#5e8c42" />
              <stop offset="24%" stopColor="#6c9a4d" />
              {/* Pie de monte occidental */}
              <stop offset="33%" stopColor="#7e8842" />
              {/* Cordillera de los Andes (eje central definido, más realista y con cumbres claras) */}
              <stop offset="40%" stopColor="#9c6c39" />
              <stop offset="45%" stopColor="#b8864f" />
              <stop offset="50%" stopColor="#8f6030" />
              {/* Pie de monte amazónico */}
              <stop offset="56%" stopColor="#436e3a" />
              {/* Llanura Amazónica extensa */}
              <stop offset="68%" stopColor="#2c5d34" />
              <stop offset="100%" stopColor="#1b4022" />
            </linearGradient>

            {/* Filtro de relieve topográfico realista: cadenas montañosas orientadas N-S y textura suave de selva/llanura */}
            <filter id="topo-realistic" x="-8%" y="-8%" width="116%" height="116%">
              {/* Cadenas montañosas principales (ligeramente elongadas norte-sur como la Cordillera) */}
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.020 0.013"
                numOctaves="5"
                seed="18"
                result="ridgeNoise"
              />
              <feDiffuseLighting
                in="ridgeNoise"
                lightingColor="#fff7e2"
                surfaceScale="5.2"
                diffuseConstant="1.15"
                result="ridgeLight"
              >
                <feDistantLight azimuth="315" elevation="44" />
              </feDiffuseLighting>

              {/* Micro-textura sutil de terreno y dosel */}
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.075"
                numOctaves="3"
                seed="29"
                result="fineNoise"
              />
              <feDiffuseLighting
                in="fineNoise"
                lightingColor="#ffffff"
                surfaceScale="1.4"
                diffuseConstant="1.08"
                result="fineLight"
              >
                <feDistantLight azimuth="315" elevation="52" />
              </feDiffuseLighting>

              <feBlend in="ridgeLight" in2="fineLight" mode="multiply" result="combinedLight" />
              <feComposite in="combinedLight" in2="SourceGraphic" operator="in" result="clippedRelief" />
              <feBlend in="SourceGraphic" in2="clippedRelief" mode="multiply" />
            </filter>
          </defs>

          {/* Territorio Continental */}
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
                      stroke={isHovered ? "rgba(255,255,255,0.85)" : "rgba(255, 255, 255, 0.14)"}
                      strokeWidth={isHovered ? 1 : 0.4}
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

        {/* ISLAS GALÁPAGOS MÁS PEQUEÑAS Y PROPORCIONADAS (Sin caja cuadrada) */}
        <div className="absolute top-[3%] left-[2%] w-[18%] sm:w-[19%] aspect-square pointer-events-auto drop-shadow-[0_10px_18px_rgba(20,43,31,0.16)]">
          <ComposableMap
            width={300}
            height={300}
            projection="geoMercator"
            projectionConfig={{
              center: [-90.5, -0.55],
              scale: 6600
            }}
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="grad-galapagos" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#659148" />
                <stop offset="50%" stopColor="#527839" />
                <stop offset="100%" stopColor="#3a5a29" />
              </linearGradient>
              <filter id="galapagos-realistic" x="-12%" y="-12%" width="124%" height="124%">
                <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="4" seed="7" result="noise" />
                <feDiffuseLighting in="noise" lightingColor="#fff7e2" surfaceScale="3.8" diffuseConstant="1.15" result="light">
                  <feDistantLight azimuth="315" elevation="44" />
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
                      stroke="rgba(255, 255, 255, 0.25)"
                      strokeWidth={0.45}
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
          <span className="block text-center text-[9px] font-extrabold uppercase tracking-widest text-[#225333]/85 -mt-3 pointer-events-none">
            Islas Galápagos
          </span>
        </div>

      </div>

      {/* Leyenda sutil de regiones naturales de Ecuador */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold text-neutral-600">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#659247]" />
          <span>Costa</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#a87742]" />
          <span>Sierra (Cordillera)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#2c5d34]" />
          <span>Amazonía</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#527839]" />
          <span>Galápagos</span>
        </div>
      </div>

    </div>
  );
}
