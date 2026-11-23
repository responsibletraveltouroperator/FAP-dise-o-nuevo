"use client";

import { type ComponentProps } from "react";
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
  const galapagosProject = projects.find(p => p.id === "galapagos");
  const continentProjects = projects.filter(p => p.id !== "galapagos");

  const continentImgUrl = getImgSrc(ecuadorReliefImg);
  const galapagosImgUrl = getImgSrc(galapagosReliefImg);

  return (
    <div className="relative w-full max-w-[900px] mx-auto select-none">
      
      {/* MAPA PRINCIPAL: ECUADOR CONTINENTAL (Sin efecto hover en provincias; solo los pines son interactivos) */}
      <div className="relative w-full aspect-[1.04/1] drop-shadow-[0_24px_42px_rgba(20,43,31,0.24)]">
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
            {/* Patrón de imagen topográfica real de Ecuador calibrado 1:1 con el viewBox */}
            <pattern
              id="ecuador-topo-pattern"
              patternUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="800"
              height="760"
            >
              <image
                href={continentImgUrl}
                x="0"
                y="0"
                width="800"
                height="760"
                preserveAspectRatio="none"
                style={{ filter: "brightness(1.12) contrast(1.08) saturate(1.22)" }}
              />
            </pattern>
          </defs>

          {/* Provincias pintadas directamente con el patrón del relieve real de Ecuador (sin hover) */}
          <Geographies geography={continentGeography}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="url(#ecuador-topo-pattern)"
                  stroke="rgba(255, 255, 255, 0.25)"
                  strokeWidth={0.55}
                  style={{
                    fill: "url(#ecuador-topo-pattern)",
                    outline: "none",
                    pointerEvents: "none"
                  }}
                />
              ))
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
                  fill={isSelected ? "#B7D84B" : "#ffffff"}
                  opacity={isSelected ? 0.75 : 0.4}
                  className={isSelected ? "animate-pulse-pin" : "group-hover:opacity-75 transition-opacity"}
                />

                <circle
                  r={isSelected ? 7.5 : 5.5}
                  fill={isSelected ? "#0c0e0b" : "#2E6B3F"}
                  stroke={isSelected ? "#B7D84B" : "#ffffff"}
                  strokeWidth={isSelected ? 2 : 1.5}
                  className="transition-transform duration-300 group-hover:scale-125"
                />

                <circle
                  r={isSelected ? 3 : 2}
                  fill={isSelected ? "#B7D84B" : "#ffffff"}
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

        {/* ISLAS GALÁPAGOS CON RELIEVE REAL (Sin efecto hover en islas; solo el pin interactúa) */}
        <div className="absolute top-[3%] left-[2%] w-[18%] sm:w-[19%] aspect-square pointer-events-auto drop-shadow-[0_10px_18px_rgba(20,43,31,0.2)]">
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
              <pattern
                id="galapagos-topo-pattern"
                patternUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="300"
                height="300"
              >
                <image
                  href={galapagosImgUrl}
                  x="0"
                  y="0"
                  width="300"
                  height="300"
                  preserveAspectRatio="none"
                  style={{ filter: "brightness(1.18) contrast(1.1) saturate(1.25)" }}
                />
              </pattern>
            </defs>

            <Geographies geography={galapagosGeography}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="url(#galapagos-topo-pattern)"
                    stroke="rgba(255, 255, 255, 0.4)"
                    strokeWidth={0.5}
                    style={{
                      fill: "url(#galapagos-topo-pattern)",
                      outline: "none",
                      pointerEvents: "none"
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
                  fill={activeProjectId === "galapagos" ? "#B7D84B" : "#ffffff"}
                  opacity={activeProjectId === "galapagos" ? 0.75 : 0.4}
                  className={activeProjectId === "galapagos" ? "animate-pulse-pin" : "group-hover:opacity-75"}
                />
                <circle
                  r={activeProjectId === "galapagos" ? 6.5 : 5}
                  fill={activeProjectId === "galapagos" ? "#0c0e0b" : "#2E6B3F"}
                  stroke={activeProjectId === "galapagos" ? "#B7D84B" : "#ffffff"}
                  strokeWidth={activeProjectId === "galapagos" ? 2 : 1.5}
                />
                <circle
                  r={activeProjectId === "galapagos" ? 2.5 : 2}
                  fill={activeProjectId === "galapagos" ? "#B7D84B" : "#ffffff"}
                />
              </Marker>
            )}
          </ComposableMap>

          {/* Etiqueta sutil sin contenedor */}
          <span className="block text-center text-[9px] font-extrabold uppercase tracking-widest text-[#2E6B3F]/85 -mt-3 pointer-events-none">
            Islas Galápagos
          </span>
        </div>

      </div>

      {/* Leyenda sutil de regiones naturales de Ecuador */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold text-neutral-600">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#75B346]" />
          <span>Costa &amp; Bosques</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#C97B3F]" />
          <span>Cordillera de los Andes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#2E6B3F]" />
          <span>Amazonía</span>
        </div>
      </div>

    </div>
  );
}
