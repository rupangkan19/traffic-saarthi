import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Incident } from '../../types';
import { useTheme } from '../../context/ThemeContext';

const BANGALORE_CENTER: [number, number] = [12.9716, 77.5946];

const CORRIDOR_WAYPOINTS: Record<string, [number, number][]> = {
  'Mysore Road':    [[12.9766, 77.5713], [12.9600, 77.5550], [12.9450, 77.5350], [12.9200, 77.5100]],
  'Bellary Road 1': [[13.0027, 77.5800], [13.0200, 77.5830], [13.0400, 77.5815], [13.0600, 77.5780]],
  'Bellary Road 2': [[13.0600, 77.5780], [13.0800, 77.5750], [13.1000, 77.5720], [13.1300, 77.5700]],
  'Tumkur Road':    [[12.9950, 77.5560], [13.0100, 77.5400], [13.0200, 77.5250], [13.0350, 77.5100]],
  'Hosur Road':     [[12.9352, 77.6245], [12.9150, 77.6350], [12.8900, 77.6430], [12.8600, 77.6500]],
  'ORR East 1':     [[12.9352, 77.6245], [12.9450, 77.6500], [12.9600, 77.6750], [12.9716, 77.7000]],
  'ORR East 2':     [[12.9716, 77.7000], [12.9900, 77.6950], [13.0050, 77.6870], [13.0200, 77.6800]],
  'ORR North 1':    [[13.0200, 77.5800], [13.0300, 77.5950], [13.0400, 77.6100], [13.0500, 77.6200]],
  'CBD 1':          [[12.9716, 77.5946], [12.9750, 77.6010], [12.9780, 77.6060], [12.9800, 77.6100]],
  'CBD 2':          [[12.9800, 77.6100], [12.9840, 77.6140], [12.9870, 77.6170], [12.9900, 77.6200]],
};

const PRIORITY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  High:   { bg: '#2A1A1C', border: '#B03A2E', text: '#E2E8F0' },
  Medium: { bg: '#2A2015', border: '#D35400', text: '#E2E8F0' },
  Low:    { bg: '#152219', border: '#27AE60', text: '#E2E8F0' },
};

const CAUSE_SHORT: Record<string, string> = {
  vehicle_breakdown: 'Breakdown',
  accident: 'Accident',
  pot_holes: 'Pot Holes',
  construction: 'Construction',
  water_logging: 'Flooding',
  tree_fall: 'Tree Fall',
  public_event: 'Public Event',
  vip_movement: 'VIP',
  others: 'Other',
};

const routeCache = new Map<string, [number, number][]>();

async function fetchRoute(waypoints: [number, number][]): Promise<[number, number][]> {
  const key = waypoints.map(p => p.join(',')).join(';');
  if (routeCache.has(key)) return routeCache.get(key)!;
  const coords = waypoints.map(([lat, lng]) => `${lng},${lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (json.code !== 'Ok' || !json.routes?.length) return waypoints;
    const latLngs: [number, number][] = json.routes[0].geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng]
    );
    routeCache.set(key, latLngs);
    return latLngs;
  } catch {
    return waypoints;
  }
}

function makeDotIcon(inc: Incident, selected: boolean): L.DivIcon {
  const c = PRIORITY_COLORS[inc.priority] || PRIORITY_COLORS.Low;
  const size = selected ? 16 : 12;
  const border = selected ? '3px solid #2E86C1' : `2px solid ${c.border}`;
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${c.border};border:${border};box-shadow:0 1px 4px rgba(0,0,0,0.3);cursor:pointer"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function makeCalloutCard(inc: Incident, selected: boolean, theme: 'dark' | 'light'): L.DivIcon {
  const isLight = theme === 'light';
  
  const PRIORITY_THEME_COLORS = {
    High:   isLight ? { bg: '#FDEDEC', border: '#B03A2E', text: '#B03A2E' } : { bg: '#2A1A1C', border: '#B03A2E', text: '#E2E8F0' },
    Medium: isLight ? { bg: '#FEF5E7', border: '#D35400', text: '#D35400' } : { bg: '#2A2015', border: '#D35400', text: '#E2E8F0' },
    Low:    isLight ? { bg: '#EAF2F8', border: '#2E86C1', text: '#2E86C1' } : { bg: '#152219', border: '#27AE60', text: '#E2E8F0' },
  };

  const c = PRIORITY_THEME_COLORS[inc.priority as 'High' | 'Medium' | 'Low'] || PRIORITY_THEME_COLORS.Low;
  const cause = CAUSE_SHORT[inc.cause] || inc.cause;
  const borderColor = selected ? '#2E86C1' : c.border;
  const bgColor = selected ? (isLight ? '#EBF5FB' : '#1E293B') : c.bg;
  const idTextColor = isLight ? '#0F1923' : '#E2E8F0';
  const causeTextColor = isLight ? '#2C3E50' : '#E2E8F0';
  const corridorTextColor = isLight ? '#566573' : '#8896A5';

  return L.divIcon({
    className: '',
    html: `
      <div style="
        position: relative;
        background: ${bgColor};
        border: 2px solid ${borderColor};
        border-radius: 6px;
        padding: 6px 10px 6px 8px;
        min-width: 140px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.18);
        font-family: Inter, sans-serif;
        cursor: pointer;
        white-space: nowrap;
      ">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
          <div style="width:8px;height:8px;border-radius:50%;background:${c.border};flex-shrink:0"></div>
          <span style="font-size:11px;font-weight:600;color:${idTextColor};letter-spacing:0.02em">${inc.id}</span>
          <span style="font-size:10px;font-weight:500;background:${selected ? (isLight ? '#D4E6F1' : '#2C3E50') : c.bg};color:${c.text};padding:1px 5px;border-radius:3px;margin-left:auto">${inc.priority}</span>
        </div>
        <div style="font-size:11px;color:${causeTextColor};font-weight:500">${cause}</div>
        <div style="font-size:10px;color:${corridorTextColor};margin-top:1px">${inc.corridor.length > 18 ? inc.corridor.slice(0, 18) + '…' : inc.corridor}</div>
        <div style="
          position:absolute;bottom:-8px;left:14px;
          width:0;height:0;
          border-left:7px solid transparent;
          border-right:7px solid transparent;
          border-top:8px solid ${borderColor};
        "></div>
        <div style="
          position:absolute;bottom:-5px;left:16px;
          width:0;height:0;
          border-left:5px solid transparent;
          border-right:5px solid transparent;
          border-top:6px solid ${bgColor};
        "></div>
      </div>
    `,
    iconSize: [150, 68],
    iconAnchor: [20, 68],
    popupAnchor: [55, -68],
  });
}

function makeBarricadeIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;background:#E67E22;border:2px solid white;transform:rotate(45deg);box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function makeClosureEndIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="width:18px;height:18px;background:#C0392B;border:2px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:11px;font-weight:700;box-shadow:0 1px 4px rgba(0,0,0,0.3)">✕</div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

export interface IncidentClickHandler {
  (incident: Incident): void;
}

export interface BangaloreMapProps {
  incidents?: Incident[];
  selectedIncidentId?: string;
  onIncidentClick?: IncidentClickHandler;
  onMapClick?: (lat: number, lng: number) => void;
  diversionRoutes?: Array<{ from: [number, number]; to: [number, number]; label?: string; incident?: Incident }>;
  barricadePoints?: Array<[number, number]>;
  affectedCorridors?: string[];
  closedSegments?: Array<{ coords: [number, number][]; label?: string; incident?: Incident }>;
  openRoutes?: Array<{ coords: [number, number][]; label?: string; incident?: Incident }>;
  height?: string;
  interactive?: boolean;
  clickPin?: { lat: number; lng: number } | null;
}

export default function BangaloreMap({
  incidents = [],
  selectedIncidentId,
  onIncidentClick,
  onMapClick,
  diversionRoutes = [],
  barricadePoints = [],
  affectedCorridors = [],
  closedSegments = [],
  openRoutes = [],
  height = '100%',
  interactive = true,
  clickPin,
}: BangaloreMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<L.Layer[]>([]);

  let themeObj;
  try {
    themeObj = useTheme();
  } catch {
    themeObj = { theme: 'dark' as const };
  }
  const theme = themeObj?.theme ?? 'dark';

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: BANGALORE_CENTER,
      zoom: 12,
      minZoom: 10,
      maxZoom: 16,
      zoomControl: interactive,
      scrollWheelZoom: interactive,
      dragging: interactive,
      touchZoom: interactive,
      doubleClickZoom: interactive,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);
    mapRef.current = map;
    return () => { mapRef.current?.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !onMapClick) return;
    const handleClick = (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    };
    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [onMapClick]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    layersRef.current.forEach(l => map.removeLayer(l));
    layersRef.current = [];

    const add = (l: L.Layer) => { l.addTo(map); layersRef.current.push(l); };

    // Incident markers: dot by default, callout card on hover or selection
    incidents.forEach(inc => {
      const isSelected = inc.id === selectedIncidentId;
      const dotIcon = makeDotIcon(inc, isSelected);
      const cardIcon = makeCalloutCard(inc, isSelected, theme);
      const marker = L.marker([inc.lat, inc.lng], {
        icon: isSelected ? cardIcon : dotIcon,
        zIndexOffset: isSelected ? 1000 : 0,
      });
      marker.on('mouseover', () => { if (!isSelected) marker.setIcon(cardIcon); });
      marker.on('mouseout', () => { if (!isSelected) marker.setIcon(dotIcon); });
      marker.on('click', () => onIncidentClick?.(inc));
      add(marker);
    });

    // Barricade points
    barricadePoints.forEach(pt => add(L.marker(pt, { icon: makeBarricadeIcon() })));

    // Click pin (red dot for logging location)
    if (clickPin) {
      const pinIcon = L.divIcon({
        className: '',
        html: `<div style="width:20px;height:20px;border-radius:50%;background:#B03A2E;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      add(L.marker([clickPin.lat, clickPin.lng], { icon: pinIcon }));
    }

    // Async road-following polylines
    const drawRoute = async (
      waypoints: [number, number][],
      opts: L.PolylineOptions,
      tooltip?: string,
      endIcon?: L.DivIcon,
      associatedIncident?: Incident
    ) => {
      const coords = await fetchRoute(waypoints);
      if (!mapRef.current) return;
      const poly = L.polyline(coords, { ...opts, cursor: 'pointer' } as any);
      if (tooltip) poly.bindTooltip(tooltip, { sticky: true });
      if (associatedIncident && onIncidentClick) {
        poly.on('click', () => onIncidentClick(associatedIncident));
      }
      add(poly);
      if (endIcon) {
        const markerEnd = L.marker(coords[coords.length - 1], { icon: endIcon });
        if (associatedIncident && onIncidentClick) {
          markerEnd.on('click', () => onIncidentClick(associatedIncident));
        }
        add(markerEnd);
        
        const markerStart = L.marker(coords[0], { icon: makeClosureEndIcon() });
        if (associatedIncident && onIncidentClick) {
          markerStart.on('click', () => onIncidentClick(associatedIncident));
        }
        add(markerStart);
      }
    };

    affectedCorridors.forEach(c => {
      const wp = CORRIDOR_WAYPOINTS[c];
      if (wp) drawRoute(wp, { color: '#D35400', weight: 5, opacity: 0.8 }, c);
    });

    closedSegments.forEach(seg => {
      drawRoute(seg.coords, { color: '#B03A2E', weight: 7, opacity: 0.95 }, seg.label, makeClosureEndIcon(), seg.incident);
    });

    openRoutes.forEach(route => {
      const arrowIcon = L.divIcon({
        className: '',
        html: `<div style="width:14px;height:14px;background:#27AE60;border:2px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:11px">→</div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
      drawRoute(route.coords, { color: '#27AE60', weight: 6, opacity: 0.9 }, route.label, arrowIcon, route.incident);
    });

    diversionRoutes.forEach(r => {
      drawRoute([r.from, r.to], { color: '#2E86C1', weight: 4, dashArray: '10 7', opacity: 0.85 }, r.label, undefined, r.incident);
    });

  }, [incidents, selectedIncidentId, diversionRoutes, barricadePoints, affectedCorridors, closedSegments, openRoutes, clickPin, onIncidentClick, theme]);

  return <div ref={containerRef} style={{ height, width: '100%' }} />;
}
