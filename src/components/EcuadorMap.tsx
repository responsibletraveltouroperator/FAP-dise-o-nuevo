"use client";

import { useState, type ComponentProps } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import continentGeo from "@/assets/ecuador-continent.json";
import galapagosGeo from "@/assets/ecuador-galapagos.json";
import ecuadorReliefImg from "@/assets/ecuador-relief-real.jpg";
import galapagosReliefImg from "@/assets/galapagos-relief-real.jpg";

type GeoProp = ComponentProps<typeof Geographies>["geography"];
const continentGeography = continentGeo as unknown as GeoProp;
const galapagosGeography = galapagosGeo as unknown as GeoProp;

function getImgSrc(img: string | { src: string }): string {
  return typeof img === "string" ? img : img.src;
}

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
      
      {/* MAPA PRINCIPAL: ECUADOR CONTINENTAL (Topografía física real recortada exactamente al territorio) */}
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
            {/* Máscara exacta de la silueta de Ecuador continental (mask sí soporta <g> de react-simple-maps) */}
            <mask id="ecuador-continent-mask">
              <rect x="0" y="0" width="800" height="760" fill="#000000" />
              <Geographies geography={continentGeography}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={`${geo.rsmKey}-mask`}
                      geography={geo}
                      fill="#ffffff"
                      stroke="#ffffff"
                      strokeWidth={0.5}
                      style={{ fill: "#ffffff", outline: "none" }}
                    />
                  ))
                }
              </Geographies>
            </mask>
          </defs>

          {/* Imagen satelital/física de relieve topográfico real recortada a la silueta de Ecuador */}
          <image
            href={getImgSrc(ecuadorReliefImg)}
            x="0"
            y="0"
            width="800"
            height="760"
            preserveAspectRatio="none"
            mask="url(#ecuador-continent-mask)"
          />

          {/* Capa interactiva de divisiones provinciales sutiles */}
          <Geographies geography={continentGeography}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = geo.properties?.name || "";
                const isHovered = hoveredProvince === name;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isHovered ? "rgba(158, 203, 54, 0.35)" : "transparent"}
                    stroke={isHovered ? "rgba(255, 255, 255, 0.85)" : "rgba(20, 43, 31, 0.22)"}
                    strokeWidth={isHovered ? 1.1 : 0.45}
                    onMouseEnter={() => setHoveredProvince(name)}
                    onMouseLeave={() => setHoveredProvince(null)}
                    style={{
                      fill: isHovered ? "rgba(158, 203, 54, 0.35)" : "transparent",
                      outline: "none",
                      transition: "fill 180ms ease"
                    }}
                  />
                );
              })
            }
          </Geographies>

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

        {/* ISLAS GALÁPAGOS CON TOPOGRAFÍA REAL RECORTADA (Sin caja cuadrada) */}
        <div className="absolute top-[3%] left-[2%] w-[18%] sm:w-[19%] aspect-square pointer-events-auto drop-shadow-[0_10px_18px_rgba(20,43,31,0.18)]">
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
              <mask id="galapagos-mask">
                <rect x="0" y="0" width="300" height="300" fill="#000000" />
                <Geographies geography={galapagosGeography}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={`${geo.rsmKey}-mask`}
                        geography={geo}
                        fill="#ffffff"
                        stroke="#ffffff"
                        strokeWidth={0.5}
                        style={{ fill: "#ffffff", outline: "none" }}
                      />
                    ))
                  }
                </Geographies>
              </mask>
            </defs>

            <image
              href={getImgSrc(galapagosReliefImg)}
              x="0"
              y="0"
              width="300"
              height="300"
              preserveAspectRatio="none"
              mask="url(#galapagos-mask)"
            />

            <Geographies geography={galapagosGeography}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={hoveredProvince === "Galápagos" ? "rgba(158, 203, 54, 0.35)" : "transparent"}
                    stroke="rgba(20, 43, 31, 0.25)"
                    strokeWidth={0.45}
                    onMouseEnter={() => setHoveredProvince("Galápagos")}
                    onMouseLeave={() => setHoveredProvince(null)}
                    style={{
                      fill: hoveredProvince === "Galápagos" ? "rgba(158, 203, 54, 0.35)" : "transparent",
                      outline: "none",
                      cursor: "pointer",
                      transition: "fill 180ms ease"
                    }}
                  />
                ))
              }
            </Geographies>

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
          <span className="w-3 h-3 bg-[#79a865]" />
          <span>Costa &amp; Llanuras</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#c98b55]" />
          <span>Cordillera de los Andes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#8fb86d]" />
          <span>Amazonía</span>
        </div>
      </div>

    </div>
  );
}
