/* Restored original Leaflet map behavior, extended with fixed database-shaped infrastructure markers and selected-region camera focus. */
import { useEffect, useMemo, useState } from "react";
import { GeoJSON, LayerGroup, LayersControl, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import type {
  DbGeometryRegion,
  InfrastructureRecord,
  Region,
} from "@/services/groundTruthService";


type Geometry = { type: "Polygon"; coordinates: number[][][] };
type Feature<T> = { type: "Feature"; properties: Record<string, unknown>; geometry: T };
type Props = { geometries: DbGeometryRegion[]; regions: Region[]; infrastructures: InfrastructureRecord[]; activeTypes: string[]; showProjects: boolean; selectedId: string; onSelect: (regionId: string) => void };
type GeoRegion = Region & { geometry: Feature<Geometry> };

function formatINR(value: number) { return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value); }
function toGeoJsonFeature(geometry: DbGeometryRegion, linked?: Region): GeoRegion | null { if (!linked) return null; return { ...linked, geometry: { type: "Feature", properties: { name: geometry.name }, geometry: { type: "Polygon", coordinates: [geometry.path.map((point) => [point.lng, point.lat])] } } as Feature<Geometry> }; }
function linkedId(geometry: DbGeometryRegion, regions: Region[]) { const aliases: Record<string, string> = { Hanamkonda: "warangal", "Karimnagar Town": "karimnagar", "Nizamabad Town": "nizamabad", Miryalaguda: "nalgonda", "Khammam Town": "khammam", "Nalgonda Town": "nalgonda", "Mahbubnagar Town": "mahbubnagar", "Adilabad Town": "adilabad", "Sangareddy Town": "sangareddy" }; return regions.find((region) => region.name.toLowerCase() === geometry.name.toLowerCase())?.id ?? aliases[geometry.name]; }

function MapFlyer({ regions, selectedRegion }: { regions: GeoRegion[]; selectedRegion?: GeoRegion }) {
  const map = useMap();
  useEffect(() => { if (!regions.length) return; const group = L.geoJSON(regions.map((region) => region.geometry)); const bounds = group.getBounds(); if (bounds.isValid()) { const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches; map.flyToBounds(bounds, { padding: [50, 50], duration: reducedMotion ? 0 : 1.1 }); } }, [regions, map]);
  useEffect(() => { if (!selectedRegion) return; const bounds = L.geoJSON(selectedRegion.geometry).getBounds(); if (!bounds.isValid()) return; const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches; map.flyToBounds(bounds, { padding: [85, 85], maxZoom: 12, duration: reducedMotion ? 0 : 0.9 }); }, [selectedRegion, map]);
  return null;
}

function RegionLayer({ region, isSelected, onClick }: { region: GeoRegion; isSelected: boolean; onClick: () => void }) {
  const style = () => ({ fillColor: region.direction === "rise" ? "#1f6f5c" : region.direction === "fall" ? "#b23a2f" : "#c7c3b8", fillOpacity: isSelected ? 0.4 : 0.25, color: isSelected ? "var(--color-marigold, #e65e32)" : "var(--color-line, #9aa49c)", weight: isSelected ? 1.5 : 1 });
  const onEachFeature = (_feature: unknown, layer: L.Layer) => { layer.on({ click: onClick, mouseover: (event) => { const target = event.target as L.Path; target.setStyle({ weight: 1.5, color: "var(--color-marigold, #e65e32)" }); target.bringToFront(); }, mouseout: (event) => { const target = event.target as L.Path; target.setStyle({ weight: isSelected ? 1.5 : 1, color: isSelected ? "var(--color-marigold, #e65e32)" : "var(--color-line, #9aa49c)" }); } }); layer.bindTooltip(`<div class="leaflet-region-tooltip"><strong>${region.name}</strong><br/><span>${formatINR(region.value)} ${region.unit}</span><br/><em>Click to zoom into region</em></div>`, { direction: "top", opacity: 1 }); };
  return <GeoJSON data={region.geometry} style={style} onEachFeature={onEachFeature} />;
}

function infrastructureEmoji(record: InfrastructureRecord) {
  if (record.type === "Airport") return "✈";
  if (record.type === "Transit") return "🚇";
  if (record.type === "Road corridor") return "🛣";
  if (record.type === "Industrial") return "🏭";
  return "📍";
}
const iconCache = new Map<string, L.DivIcon>();
function getIcon(emoji: string) {
  let icon = iconCache.get(emoji);
  if (!icon) {
    icon = L.divIcon({ className: "infrastructure-emoji-icon", html: `<span aria-hidden="true">${emoji}</span>`, iconSize: [32, 32], iconAnchor: [16, 16] });
    iconCache.set(emoji, icon);
  }
  return icon;
}
function InfrastructureMarker({ record }: { record: InfrastructureRecord }) {
  const emoji = infrastructureEmoji(record);
  const icon = getIcon(emoji);
  return <Marker position={[record.latitude, record.longitude]} icon={icon}><Popup className="infrastructure-popup"><div className="infra-popup"><div className="infra-popup-kicker">{record.type} · {record.status}</div><h3>{emoji} {record.name}</h3><div className="infra-popup-grid"><span>OPENING YEAR<strong>{record.openingYear ?? "—"}</strong></span><span>EST. CONTRIBUTION<strong>{record.contribution[0] > 0 ? "+" : ""}{record.contribution[0]}–{record.contribution[1]} pp</strong></span></div><p>{record.summary}</p><div className="infra-popup-meta">{Math.round(record.confidence * 100)}% confidence · exact point {record.latitude.toFixed(6)}, {record.longitude.toFixed(6)}</div>{record.sourceUrl && <div className="infra-proof-links"><a href={record.sourceUrl} target="_blank" rel="noreferrer">Open source <span>↗</span></a></div>}</div></Popup></Marker>;
}

function Legend() { const [open, setOpen] = useState(false); return <div className="exact-map-legend-wrap"><button className="map-legend-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open}>Map key <span>{open ? "−" : "+"}</span></button>{open && <div className="exact-map-legend"><div><i className="legend-swatch rise" /> Projected Rise</div><div><i className="legend-swatch fall" /> Projected Fall</div><div><i className="legend-swatch none" /> No Data / Neutral</div><div><i className="legend-swatch infra" /> Upcoming infrastructure</div></div>}</div>; }

export default function ExactRegionMap({ geometries, regions, infrastructures, activeTypes, showProjects, selectedId, onSelect }: Props) {
  const geoRegions = useMemo(() => geometries.map((geometry) => toGeoJsonFeature(geometry, regions.find((region) => region.id === linkedId(geometry, regions)))).filter(Boolean) as GeoRegion[], [geometries, regions]);
  const selectedRegion = useMemo(() => geoRegions.find((region) => region.id === selectedId), [geoRegions, selectedId]);
  const visibleInfrastructure = useMemo(() => (showProjects ? infrastructures.filter((record) => activeTypes.includes(record.type)) : []), [showProjects, infrastructures, activeTypes]);
  return <div className="exact-map-shell"><MapContainer center={[20.5937, 78.9629]} zoom={5} zoomControl={true} scrollWheelZoom className="exact-leaflet-map">
    <LayersControl position="topright">
      <LayersControl.BaseLayer checked name="Satellite + Labels">
        <LayerGroup>
          <TileLayer attribution="Tiles &copy; Esri, Maxar, Earthstar Geographics" url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" maxNativeZoom={18} maxZoom={20} />
          <TileLayer pane="shadowPane" url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}" maxNativeZoom={18} maxZoom={20} />
          <TileLayer pane="shadowPane" url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}" maxNativeZoom={18} maxZoom={20} />
        </LayerGroup>
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Streets">
        <TileLayer attribution="&copy; MapTiler &copy; OpenStreetMap contributors" url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${import.meta.env.VITE_MAPTILER_KEY}`} maxZoom={20} detectRetina />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Light">
        <TileLayer attribution="&copy; MapTiler &copy; OpenStreetMap contributors" url={`https://api.maptiler.com/maps/dataviz-light/{z}/{x}/{y}.png?key=${import.meta.env.VITE_MAPTILER_KEY}`} maxZoom={20} />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="MapTiler Satellite">
        <TileLayer attribution="&copy; MapTiler &copy; OpenStreetMap contributors" url={`https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${import.meta.env.VITE_MAPTILER_KEY}`} maxZoom={20} />
      </LayersControl.BaseLayer>
    </LayersControl>
    <MapFlyer regions={geoRegions} selectedRegion={selectedRegion} />{geoRegions.map((region) => <RegionLayer key={region.id} region={region} isSelected={selectedId === region.id} onClick={() => onSelect(region.id)} />)}{visibleInfrastructure.map((record) => <InfrastructureMarker key={record.id} record={record} />)}<Legend /><div className="map-selection-stamp">{visibleInfrastructure.length} mapped infrastructure record{visibleInfrastructure.length === 1 ? "" : "s"}</div></MapContainer></div>;
}
