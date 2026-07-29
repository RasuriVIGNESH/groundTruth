import { GeoJSON } from 'react-leaflet';
import { RegionSummary } from '../../api/types';
import L from 'leaflet';
import { formatCurrency } from '../../utils/formatCurrency';

interface RegionLayerProps {
  region: RegionSummary;
  isSelected: boolean;
  onClick: () => void;
}

export default function RegionLayer({ region, isSelected, onClick }: RegionLayerProps) {
  if (!region.geometry) return null;

  const style = () => {
    let fillColor = 'var(--color-line)';
    
    if (region.direction === 'rise') {
      fillColor = 'var(--color-rise-tint)';
    } else if (region.direction === 'fall') {
      fillColor = 'var(--color-fall-tint)';
    }

    return {
      fillColor,
      fillOpacity: isSelected ? 0.8 : 0.6,
      color: isSelected ? 'var(--color-marigold)' : 'var(--color-line)',
      weight: isSelected ? 2 : 1,
    };
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    layer.on({
      click: onClick,
      mouseover: (e) => {
        const target = e.target;
        target.setStyle({
          weight: 2,
          color: 'var(--color-ink)',
        });
        target.bringToFront();
      },
      mouseout: (e) => {
        const target = e.target;
        if (!isSelected) {
          target.setStyle({
            weight: 1,
            color: 'var(--color-line)'
          });
        } else {
          target.setStyle({
            weight: 2,
            color: 'var(--color-marigold)'
          });
        }
      }
    });

    const valStr = formatCurrency(region.currentValue, region.valueUnit);
    layer.bindTooltip(`
      <div style="font-family: var(--font-body); color: var(--color-ink);">
        <strong style="font-family: var(--font-display); font-size: var(--text-body);">${region.name}</strong><br/>
        <span style="font-family: var(--font-data); font-size: var(--text-body-sm);">${valStr}</span>
      </div>
    `, {
      className: 'bg-[var(--color-paper)] border border-[var(--color-line)] rounded-sm shadow-sm p-2',
      direction: 'top',
      opacity: 1
    });
  };

  return (
    <GeoJSON 
      data={region.geometry} 
      style={style} 
      onEachFeature={onEachFeature} 
    />
  );
}
