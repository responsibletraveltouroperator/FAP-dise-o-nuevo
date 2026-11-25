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

export interface HighlightRegion {
  id: string;
  province: string;
}

interface EcuadorMapProps {
  projects: MapProject[];
  activeProjectId: string;
  onSelectProject: (proj: MapProject) => void;
  /** Si llega, el mapa ilumina provincias enteras y oculta los puntos. */
  highlightRegions?: HighlightRegion[];
  showLegend?: boolean;
  /** Puntos extra que el mapa puede mostrar encima de las regiones, por ejemplo desde la línea de tiempo. */
  scatterPins?: { id: string; lng: number; lat: number }[];
  /** Encaja el país completo, con Galápagos, en el alto de la pantalla. */
  fitViewport?: boolean;
  /** Cuando hay foto de fondo oscura detrás del mapa, cambia etiquetas como Islas Galápagos a blanco. */
  darkBg?: boolean;
  /** Secuencia opcional: full -> lit (se iluminan y agrandan las 3) -> isolated (desaparece el resto del mapa y quedan sin iluminación con puntos). */
  isolatedStage?: "full" | "lit" | "isolated";
}

function normalizeName(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export default function EcuadorMap({
  projects,
  activeProjectId,
  onSelectProject,
  highlightRegions,
  showLegend = true,
  scatterPins,
  fitViewport = false,
  darkBg = false,
  isolatedStage = "full",
}: EcuadorMapProps) {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const regionMode = Boolean(highlightRegions?.length);
  const galapagosProject = projects.find(p => p.id === "galapagos");
  const continentProjects = projects.filter(p => p.id !== "galapagos");
  const galapagosRegion = highlightRegions?.find((region) => normalizeName(region.province).includes("galapagos"));

  const regionForProvince = (name: string) => {
    if (!highlightRegions) return undefined;
    const normalized = normalizeName(name);
    return highlightRegions.find((region) => normalizeName(region.province) === normalized);
  };

  const regionsForProvince = (name: string) => {
    if (!highlightRegions) return [];
    const normalized = normalizeName(name);
    return highlightRegions.filter((region) => normalizeName(region.province) === normalized);
  };

  // Provincias que tienen 2 o más proyectos: además de iluminarse, muestran sus puntos
  const multiProjectIds = new Set<string>();
  if (highlightRegions) {
    const byProvince = new Map<string, string[]>();
    for (const r of highlightRegions) {
      const key = normalizeName(r.province);
      const arr = byProvince.get(key) ?? [];
      arr.push(r.id);
      byProvince.set(key, arr);
    }
    for (const ids of byProvince.values()) {
      if (ids.length > 1) {
        ids.forEach((id) => multiProjectIds.add(id));
      }
    }
  }

  const selectRegion = (regionId: string) => {
    const project = projects.find((item) => item.id === regionId);
    if (project) onSelectProject(project);
  };

  const continentImgUrl = getImgSrc(ecuadorReliefImg);
  const galapagosImgUrl = getImgSrc(galapagosReliefImg);

  return (
    <div className={`relative mx-auto lg:mx-0 w-full select-none ${fitViewport ? "max-w-none" : "max-w-[900px]"}`}>
      
      {/* MAPA PRINCIPAL: ECUADOR CONTINENTAL (Sin efecto hover en provincias; solo los pines son interactivos) */}
      <div className={`relative mx-auto aspect-[1.04/1] w-full ${darkBg ? "drop-shadow-[0_0_18px_rgba(255,255,255,0.42)]" : "drop-shadow-[0_24px_42px_rgba(20,43,31,0.24)]"}`}>
        <ComposableMap
          width={800}
          height={760}
          projection="geoMercator"
          projectionConfig={{
            center: [-78.55, -1.68],
            scale: 6150
          }}
          className="h-full w-full overflow-visible"
        >
          <defs>
            {/* Patrón de imagen topográfica real de Ecuador calibrado 1:1 con el viewBox */}
            <filter id="region-light" x="-25%" y="-25%" width="150%" height="150%">
              <feComponentTransfer>
                <feFuncR type="linear" slope="1.12" intercept="0.03" />
                <feFuncG type="linear" slope="1.45" intercept="0.08" />
                <feFuncB type="linear" slope="0.85" intercept="0" />
              </feComponentTransfer>
            </filter>
            <filter id="region-light-active" x="-35%" y="-35%" width="170%" height="170%">
              <feComponentTransfer>
                <feFuncR type="linear" slope="1.25" intercept="0.06" />
                <feFuncG type="linear" slope="1.78" intercept="0.13" />
                <feFuncB type="linear" slope="0.92" intercept="0" />
              </feComponentTransfer>
            </filter>
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

          {/* Provincias: relieve en el home; en modo región se iluminan Loja, Pichincha, etc. */}
          <Geographies geography={continentGeography}>
            {({ geographies }) =>
              [...geographies]
                .sort((a, b) => {
                  const nameOf = (geo: (typeof geographies)[number]) =>
                    String((geo.properties as { name?: string } | undefined)?.name ?? "");
                  const aActive = regionsForProvince(nameOf(a)).some((r) => r.id === activeProjectId);
                  const bActive = regionsForProvince(nameOf(b)).some((r) => r.id === activeProjectId);
                  return Number(aActive) - Number(bActive);
                })
                .map((geo) => {
                const provinceName = String((geo.properties as { name?: string } | undefined)?.name ?? "");
                const provinceRegions = regionsForProvince(provinceName);
                const region = provinceRegions[0];
                const isPlanted = provinceRegions.length > 0;
                const isActive = provinceRegions.some((r) => r.id === activeProjectId);
                const isLitStage = isolatedStage === "lit";
                const isIsolatedStage = isolatedStage === "isolated";
                const fill = "url(#ecuador-topo-pattern)";
                const stroke = !regionMode
                  ? "rgba(255, 255, 255, 0.25)"
                  : isIsolatedStage
                    ? isPlanted
                      ? isActive
                        ? "#6B3E1F"
                        : "rgba(107, 62, 31, 0.55)"
                      : "transparent"
                    : isLitStage && isPlanted
                      ? "#B7D84B"
                      : isActive
                        ? "#B7D84B"
                        : isPlanted
                          ? "#75B346"
                          : "rgba(255, 255, 255, 0.28)";
                const strokeWidth = !regionMode ? 0.55 : isIsolatedStage ? (isActive ? 2.1 : isPlanted ? 1.3 : 0) : isActive || (isLitStage && isPlanted) ? 2.1 : isPlanted ? 1.4 : 0.5;
                const interactive = regionMode && isPlanted;
                const hovered = hoveredProvince === provinceName;
                const light = isIsolatedStage
                  ? undefined
                  : isLitStage && isPlanted
                    ? "url(#region-light-active)"
                    : isActive
                      ? "url(#region-light-active)"
                      : isPlanted
                        ? "url(#region-light)"
                        : undefined;
                const provinceOpacity = isIsolatedStage && !isPlanted ? 0 : 1;
                const provinceScale = isIsolatedStage && isPlanted
                  ? isActive
                    ? 1.32
                    : 1.24
                  : isLitStage && isPlanted
                    ? 1.14
                    : isActive
                      ? 1.07
                      : hovered
                        ? 1.03
                        : 1;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    filter={light}
                    onClick={() => {
                      if (region) selectRegion(region.id);
                    }}
                    onMouseEnter={() => {
                      if (interactive) setHoveredProvince(provinceName);
                    }}
                    onMouseLeave={() => setHoveredProvince(null)}
                    style={{
                      outline: "none",
                      cursor: interactive ? "pointer" : "default",
                      pointerEvents: (isIsolatedStage && !isPlanted) || (regionMode && !isPlanted) ? "none" : regionMode ? "auto" : "none",
                      opacity: provinceOpacity,
                      transform: `scale(${provinceScale})`,
                      transformBox: "fill-box",
                      transformOrigin: "center",
                      transition: "transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.85s ease-out",
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* MARCADORES / PINES DE UBICACIÓN BLANCOS */}
          {isolatedStage !== "isolated" && continentProjects.map((proj) => {
            const isSelected = activeProjectId === proj.id;
            return (
              <Marker
                key={proj.id}
                coordinates={[proj.lng, proj.lat]}
                onClick={() => onSelectProject(proj)}
                className="cursor-pointer group"
              >
                <g transform="translate(-12, -24)">
                  <g
                    className="transition-transform duration-300"
                    style={{
                      transform: `scale(${isSelected ? 1.24 : 0.96})`,
                      transformOrigin: "12px 24px",
                      filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.45))",
                    }}
                  >
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                      fill="#ffffff"
                      stroke={isSelected ? "#B7D84B" : "#142b1f"}
                      strokeWidth={isSelected ? 1.8 : 1.1}
                    />
                    <circle
                      cx="12"
                      cy="9"
                      r="2.6"
                      fill={isSelected ? "#2E6B3F" : "#142b1f"}
                    />
                  </g>
                </g>

                <text
                  textAnchor="middle"
                  y={14}
                  className={`text-[11px] font-bold tracking-tight pointer-events-none transition-opacity duration-200 fill-[#10120f] ${
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
          {scatterPins?.filter((pin) => pin.lng > -84).map((pin) => (
            <Marker key={pin.id} coordinates={[pin.lng, pin.lat]}>
              <circle r={4.2} fill="#E6D3B8" opacity={0.45} style={{ animation: "fadeOnly 0.55s ease both" }} />
              <circle r={2.3} fill="#F7F2E6" stroke="#6B3E1F" strokeWidth={0.8} />
            </Marker>
          ))}
        </ComposableMap>

        {/* ISLAS GALÁPAGOS CON RELIEVE REAL (Sin efecto hover en islas; solo el pin interactúa) */}
        <div
          className={`absolute top-[3%] left-[2%] w-[22%] sm:w-[24%] aspect-square pointer-events-auto origin-center transition-transform duration-700 ${darkBg ? "drop-shadow-[0_0_14px_rgba(255,255,255,0.55)]" : "drop-shadow-[0_10px_18px_rgba(20,43,31,0.2)]"} ${
            isolatedStage === "isolated"
              ? galapagosRegion?.id === activeProjectId
                ? "z-10 scale-[1.32]"
                : "z-10 scale-[1.24]"
              : isolatedStage === "lit" && galapagosRegion
                ? "z-10 scale-[1.14]"
                : galapagosRegion && galapagosRegion.id === activeProjectId
                  ? "z-10 scale-125"
                  : "scale-100"
          }`}
        >
          {galapagosRegion && (
            <button
              type="button"
              aria-label="Ver Galápagos"
              className="absolute inset-0 z-20 cursor-pointer"
              onClick={() => selectRegion(galapagosRegion.id)}
            />
          )}
          <ComposableMap
            width={300}
            height={300}
            projection="geoMercator"
            projectionConfig={{
              center: [-90.5, -0.55],
              scale: 6600
            }}
            className="h-full w-full overflow-visible"
          >
            <defs>
              <filter id="galapagos-light" x="-25%" y="-25%" width="150%" height="150%">
                <feComponentTransfer>
                  <feFuncR type="linear" slope="1.2" intercept="0.05" />
                  <feFuncG type="linear" slope="1.7" intercept="0.12" />
                  <feFuncB type="linear" slope="0.92" intercept="0" />
                </feComponentTransfer>
              </filter>
              <filter id="galapagos-light-active" x="-35%" y="-35%" width="170%" height="170%">
                <feComponentTransfer>
                  <feFuncR type="linear" slope="1.45" intercept="0.08" />
                  <feFuncG type="linear" slope="1.9" intercept="0.16" />
                  <feFuncB type="linear" slope="0.8" intercept="0" />
                </feComponentTransfer>
              </filter>
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
                geographies.map((geo) => {
                  const galapagosActive = galapagosRegion?.id === activeProjectId;
                  const isLitStage = isolatedStage === "lit";
                  const isIsolatedStage = isolatedStage === "isolated";
                  const fill = "url(#galapagos-topo-pattern)";
                  const stroke = isIsolatedStage
                    ? galapagosActive
                      ? "#6B3E1F"
                      : "rgba(107, 62, 31, 0.55)"
                    : galapagosRegion
                      ? galapagosActive || isLitStage
                        ? "#B7D84B"
                        : "#75B346"
                      : "rgba(255, 255, 255, 0.4)";

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={isIsolatedStage ? (galapagosActive ? 2.8 : 2) : galapagosRegion ? (galapagosActive || isLitStage ? 3.6 : 3) : 0.5}
                      filter={isIsolatedStage ? undefined : galapagosRegion ? (galapagosActive || isLitStage ? "url(#galapagos-light-active)" : "url(#galapagos-light)") : undefined}
                      style={{
                        outline: "none",
                        pointerEvents: "none",
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* Pin blanco de ubicación para Galápagos */}
            {isolatedStage !== "isolated" && galapagosProject && (
              <Marker
                coordinates={[galapagosProject.lng, galapagosProject.lat]}
                onClick={() => onSelectProject(galapagosProject)}
                className="cursor-pointer group"
              >
                <g transform="translate(-12, -24)">
                  <g
                    className="transition-transform duration-300"
                    style={{
                      transform: `scale(${activeProjectId === "galapagos" ? 1.22 : 0.92})`,
                      transformOrigin: "12px 24px",
                      filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.45))",
                    }}
                  >
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                      fill="#ffffff"
                      stroke={activeProjectId === "galapagos" ? "#B7D84B" : "#142b1f"}
                      strokeWidth={activeProjectId === "galapagos" ? 1.8 : 1.1}
                    />
                    <circle
                      cx="12"
                      cy="9"
                      r="2.6"
                      fill={activeProjectId === "galapagos" ? "#2E6B3F" : "#142b1f"}
                    />
                  </g>
                </g>
              </Marker>
            )}
            {scatterPins?.filter((pin) => pin.lng <= -84).map((pin) => (
              <Marker key={pin.id} coordinates={[pin.lng, pin.lat]}>
                <circle r={5} fill="#E6D3B8" opacity={0.5} style={{ animation: "fadeOnly 0.55s ease both" }} />
                <circle r={2.6} fill="#F7F2E6" stroke="#6B3E1F" strokeWidth={0.8} />
              </Marker>
            ))}
          </ComposableMap>

          {/* Etiqueta sutil sin contenedor */}
          <span className={`relative z-30 block text-center text-[11px] font-extrabold uppercase tracking-widest pointer-events-none -mt-1 ${darkBg ? "text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]" : galapagosRegion?.id === activeProjectId ? "text-[#B7D84B]" : "text-[#75B346]"}`}>
            Islas Galápagos
          </span>
        </div>

      </div>

      {showLegend && (
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
      )}

    </div>
  );
}

export interface IsolatedProvinceItem {
  id: string;
  title: string;
  province: string;
  subtitle: string;
  pins: { id: string; lng: number; lat: number }[];
}

export function EcuadorMiniLocatorMap({ activeProvince }: { activeProvince: string }) {
  const continentImgUrl = getImgSrc(ecuadorReliefImg);
  const galapagosImgUrl = getImgSrc(galapagosReliefImg);
  const normActive = normalizeName(activeProvince);
  const isGalapagosActive = normActive.includes("galapagos");

  return (
    <div className="relative w-36 sm:w-44 aspect-[1.04/1] shrink-0 select-none">
      <ComposableMap
        width={800}
        height={760}
        projection="geoMercator"
        projectionConfig={{
          center: [-78.55, -1.68],
          scale: 6150,
        }}
        className="h-full w-full overflow-visible"
      >
        <defs>
          <filter id="mini-bw" colorInterpolationFilters="sRGB">
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncR type="linear" slope="1.05" intercept="0.04" />
              <feFuncG type="linear" slope="1.05" intercept="0.04" />
              <feFuncB type="linear" slope="1.05" intercept="0.04" />
            </feComponentTransfer>
          </filter>
          <filter id="mini-color" colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncR type="linear" slope="1.15" intercept="0.04" />
              <feFuncG type="linear" slope="1.55" intercept="0.08" />
              <feFuncB type="linear" slope="0.88" intercept="0" />
            </feComponentTransfer>
          </filter>
          <pattern id="mini-topo-pattern" patternUnits="userSpaceOnUse" x="0" y="0" width="800" height="760">
            <image href={continentImgUrl} x="0" y="0" width="800" height="760" preserveAspectRatio="none" />
          </pattern>
        </defs>
        <Geographies geography={continentGeography}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const pName = String((geo.properties as { name?: string } | undefined)?.name ?? "");
              const active = !isGalapagosActive && normalizeName(pName) === normActive;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="url(#mini-topo-pattern)"
                  filter={active ? "url(#mini-color)" : "url(#mini-bw)"}
                  stroke={active ? "#2E6B3F" : "rgba(20, 43, 31, 0.25)"}
                  strokeWidth={active ? 3.2 : 0.9}
                  style={{
                    outline: "none",
                    pointerEvents: "none",
                    opacity: active ? 1 : 0.45,
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <div className="absolute top-[4%] left-[2%] w-[28%] aspect-square">
        <ComposableMap
          width={300}
          height={300}
          projection="geoMercator"
          projectionConfig={{
            center: [-90.5, -0.55],
            scale: 6600,
          }}
          className="h-full w-full overflow-visible"
        >
          <defs>
            <pattern id="mini-galapagos-pattern" patternUnits="userSpaceOnUse" x="0" y="0" width="300" height="300">
              <image href={galapagosImgUrl} x="0" y="0" width="300" height="300" preserveAspectRatio="none" />
            </pattern>
          </defs>
          <Geographies geography={galapagosGeography}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="url(#mini-galapagos-pattern)"
                  filter={isGalapagosActive ? "url(#mini-color)" : "url(#mini-bw)"}
                  stroke={isGalapagosActive ? "#2E6B3F" : "rgba(20, 43, 31, 0.25)"}
                  strokeWidth={isGalapagosActive ? 4 : 1}
                  style={{
                    outline: "none",
                    pointerEvents: "none",
                    opacity: isGalapagosActive ? 1 : 0.45,
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>
      </div>
    </div>
  );
}

export function ProvinceReliefGraphic({
  item,
  isActive,
  large = false,
}: {
  item: IsolatedProvinceItem;
  isActive: boolean;
  large?: boolean;
}) {
  const continentImgUrl = getImgSrc(ecuadorReliefImg);
  const galapagosImgUrl = getImgSrc(galapagosReliefImg);
  const norm = normalizeName(item.province);
  const isGalapagos = norm.includes("galapagos");
  const viewBoxByProvince: Record<string, string> = {
    loja: "165 535 200 200",
    pichincha: "295 119 200 200",
  };
  const viewBox = viewBoxByProvince[norm] ?? "0 0 800 760";

  return (
    <div
      className={`relative aspect-square w-full transition-all duration-500 ${
        large ? "max-w-[390px]" : "max-w-[350px]"
      } ${
        isActive
          ? "drop-shadow-[0_30px_42px_rgba(12,14,11,0.55)]"
          : "drop-shadow-[0_24px_34px_rgba(12,14,11,0.42)]"
      }`}
    >
      {isGalapagos ? (
        <ComposableMap
          width={300}
          height={300}
          projection="geoMercator"
          projectionConfig={{
            center: [-90.5, -0.55],
            scale: 6400,
          }}
          className="h-full w-full overflow-visible"
        >
          <defs>
            <filter id={`relief-3d-gal-${item.id}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="10" stdDeviation="6" floodColor="#0c0e0b" floodOpacity="0.48" />
            </filter>
            <pattern id={`iso-galapagos-${item.id}`} patternUnits="userSpaceOnUse" x="0" y="0" width="300" height="300">
              <image
                href={galapagosImgUrl}
                x="0"
                y="0"
                width="300"
                height="300"
                preserveAspectRatio="none"
                style={{ filter: "brightness(1.08) contrast(1.24) saturate(1.34)" }}
              />
            </pattern>
          </defs>
          <Geographies geography={galapagosGeography}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={`url(#iso-galapagos-${item.id})`}
                  filter={`url(#relief-3d-gal-${item.id})`}
                  stroke="none"
                  strokeWidth={0}
                  style={{ outline: "none", pointerEvents: "none" }}
                />
              ))
            }
          </Geographies>
          {item.pins.map((pin) => (
            <Marker key={pin.id} coordinates={[pin.lng, pin.lat]}>
              <circle r={5.5} fill="#E6D3B8" opacity={0.55} />
              <circle r={3} fill="#F7F2E6" stroke="#6B3E1F" strokeWidth={1} />
            </Marker>
          ))}
        </ComposableMap>
      ) : (
        <ComposableMap
          width={800}
          height={760}
          viewBox={viewBox}
          projection="geoMercator"
          projectionConfig={{
            center: [-78.55, -1.68],
            scale: 6150,
          }}
          className="h-full w-full overflow-visible"
        >
          <defs>
            <filter id={`relief-3d-${item.id}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="4.5" floodColor="#0c0e0b" floodOpacity="0.48" />
            </filter>
            <pattern id={`iso-continent-${item.id}`} patternUnits="userSpaceOnUse" x="0" y="0" width="800" height="760">
              <image
                href={continentImgUrl}
                x="0"
                y="0"
                width="800"
                height="760"
                preserveAspectRatio="none"
                style={{ filter: "brightness(1.06) contrast(1.24) saturate(1.35)" }}
              />
            </pattern>
          </defs>
          <Geographies geography={continentGeography}>
            {({ geographies }) =>
              geographies
                .filter((geo) => {
                  const pName = String((geo.properties as { name?: string } | undefined)?.name ?? "");
                  return normalizeName(pName) === norm;
                })
                .map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={`url(#iso-continent-${item.id})`}
                    filter={`url(#relief-3d-${item.id})`}
                    stroke="none"
                    strokeWidth={0}
                    style={{ outline: "none", pointerEvents: "none" }}
                  />
                ))
            }
          </Geographies>
          {item.pins.map((pin) => (
            <Marker key={pin.id} coordinates={[pin.lng, pin.lat]}>
              <circle r={3.6} fill="#E6D3B8" opacity={0.6} />
              <circle r={2.0} fill="#F7F2E6" stroke="#6B3E1F" strokeWidth={0.75} />
            </Marker>
          ))}
        </ComposableMap>
      )}
    </div>
  );
}

export function IsolatedProvincesRow({
  items,
  activeId,
  onSelect,
}: {
  items: IsolatedProvinceItem[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`group flex flex-col items-center text-center cursor-pointer transition-transform duration-500 ${
              isActive ? "scale-[1.04]" : "hover:scale-[1.03]"
            }`}
          >
            <ProvinceReliefGraphic item={item} isActive={isActive} />
            <p className={`mt-2 text-xl font-extrabold ${isActive ? "text-[#142b1f]" : "text-[#6B3E1F]"}`}>
              {item.title}
            </p>
            <p className="mt-0.5 max-w-xs text-xs text-[#6B3E1F]/80">{item.subtitle}</p>
          </button>
        );
      })}
    </div>
  );
}
