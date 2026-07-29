import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useMemo, useRef } from 'react';
import { RegionSummary } from '../../api/types';
import MapLegend from './MapLegend';
import RegionLayer from './RegionLayer';
import { StateCode } from '../../config/states';

interface RegionMapProps {
  regions: RegionSummary[];
  selectedState: StateCode;
  selectedRegionId: string | null;
  onSelectRegion: (id: string) => void;
}

// A sub-component to handle map flying
function MapFlyer({ regions, selectedState }: { regions: RegionSummary[], selectedState: string }) {
  const map = useMap();
  
  useEffect(() => {
    if (!regions || regions.length === 0) return;
    
    // Extract all geojson from regions
    const geoJsonData = regions.map(r => r.geometry).filter(Boolean);
    if (geoJsonData.length > 0) {
      const group = L.geoJSON(geoJsonData);
      const bounds = group.getBounds();
      if (bounds.isValid()) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        map.flyToBounds(bounds, {
          padding: [50, 50],
          duration: prefersReducedMotion ? 0 : 1.5,
        });
      }
    }
  }, [regions, selectedState, map]);

  return null;
}

export default function RegionMap({ regions, selectedState, selectedRegionId, onSelectRegion }: RegionMapProps) {
  return (
    <div className="absolute inset-0 z-0">
      <MapContainer 
        center={[20.5937, 78.9629]} // Default India center
        zoom={5} 
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />
        <MapFlyer regions={regions} selectedState={selectedState} />
        
        {regions.map((region) => (
          <RegionLayer 
            key={region.id}
            region={region}
            isSelected={selectedRegionId === region.id}
            onClick={() => onSelectRegion(region.id)}
          />
        ))}

        <div className="absolute bottom-6 right-6 z-[400]">
          <MapLegend />
        </div>
      </MapContainer>
    </div>
  );
}
