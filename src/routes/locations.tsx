import { useEffect, useMemo, useRef, useState } from "react";
import { styled } from "styled-components";
import { PlusIcon, MinusIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon, Squares2X2Icon, Bars3Icon } from "@heroicons/react/24/outline";
import { supabase } from "../supabase";

type Place = {
  id: string;
  region: string;
  city: string;
  district?: string;
  postalCode?: string;
  addressLine?: string;
  placeLabel?: string;
  latitude: number;
  longitude: number;
};

type LocationItem = {
  id: string;
  title: string;
  tagline?: string;
  imageUrl: string;
  priceKRW: number;
  activityLevel: "LIGHT" | "MODERATE" | "INTENSE";
  skillLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  maxGuestsTotal: number;
  minAge?: number;
  placeId: string;
};

const Container = styled.div<{ $expanded?: boolean }>`
  position: relative;
  display: block;
  width: 100%;
  padding: 12px 16px;
  background: #ffffff;
`;

const ListPane = styled.div<{ $expanded?: boolean; $mapRatio?: number }>`
  background: transparent;
  display: ${p => (p.$expanded ? "none" : "block")};
  margin-right: ${p => (
    p.$expanded ? 0 : `calc(${(((p.$mapRatio ?? 0.4) * 100).toFixed(3))}vw + 16px)`
  )};
`;

const MapPane = styled.div<{ $expanded?: boolean; $mapRatio?: number }>`
  position: ${p => (p.$expanded ? "fixed" : "sticky")};
  top: ${p => (p.$expanded ? 0 : "86px")};
  right: ${p => (p.$expanded ? 0 : "auto")};
  left: ${p => (p.$expanded ? 0 : "auto")};
  bottom: ${p => (p.$expanded ? 0 : "auto")};
  float: ${p => (p.$expanded ? "none" : "right")};
  margin-left: ${p => (p.$expanded ? 0 : "16px")};
  width: ${p => (
    p.$expanded ? "100%" : `calc(${(((p.$mapRatio ?? 0.4) * 100).toFixed(3))}vw)`
  )};
  height: ${p => (p.$expanded ? "100vh" : "calc(100vh - 96px - 16px)")};
  border-radius: ${p => (p.$expanded ? "0px" : "14px")};
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  z-index: ${p => (p.$expanded ? 50 : 1)};
`;

const ListHeader = styled.div`
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Count = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const CardsWrap = styled.div`
  overflow: visible;
`;

const Cards = styled.div<{ $mode: "list" | "grid" }>`
  display: grid;
  grid-template-columns: ${p => (p.$mode === "grid" ? "repeat(2, 1fr)" : "1fr")};
  gap: 12px;
  padding: 12px;
`;

const Card = styled.button<{ $active?: boolean }>`
  text-align: left;
  padding: 12px;
  border: 1px solid ${p => (p.$active ? "#111827" : "#e5e7eb")};
  border-radius: 12px;
  background: #ffffff;
  cursor: pointer;
  display: grid;
  gap: 8px;
  transition: border-color 120ms ease, transform 120ms ease;
  &:hover { border-color: #111827; transform: translateY(-1px); }
`;

const Title = styled.div`
  font-weight: 700;
  color: #111827;
`;

const Sub = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const Price = styled.div`
  font-weight: 700;
`;

const MapDiv = styled.div`
  width: 100%;
  height: 100%;
`;

const Notice = styled.div`
  padding: 12px 16px;
  background: #fffbeb;
  color: #92400e;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  margin: 12px;
`;

const CardImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
  object-position: center;
  border-radius: 12px;
  background: linear-gradient(180deg, #ede9fe 0%, #fef9c3 100%);
`;

const MapControls = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  display: grid;
  gap: 8px;
  z-index: 5;
`;

const ControlButton = styled.button`
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #ffffffee 0%, #f8fafc 100%);
  backdrop-filter: blur(6px);
  border: 1px solid #e5e7eb;
  color: #111827;
  font-weight: 700;
  border-radius: 999px;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  transition: transform 120ms ease, box-shadow 120ms ease;
  &:hover { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12); }
`;

const ViewSwitch = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const ViewBtn = styled.button<{ $active?: boolean }>`
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid ${p => (p.$active ? "#111827" : "#d1d5db")};
  background: #ffffff;
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease;
  &:hover { background: #f9fafb; }
  &:focus-visible { outline: 2px solid #111827; outline-offset: 2px; }
`;

const Resizer = styled.div<{ $mapRatio: number; $visible: boolean }>`
  position: absolute;
  top: 86px;
  bottom: 16px;
  right: ${p => `calc(${(p.$mapRatio * 100).toFixed(3)}vw + 16px)`};
  width: 8px;
  margin-left: -4px;
  cursor: col-resize;
  z-index: 10;
  display: ${p => (p.$visible ? "block" : "none")};
  background: transparent;
`;

// DB-only rendering. If no data exists, the page will show an empty state.

function formatKRW(n: number) {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(n);
}

function useGoogleMaps(apiKey?: string) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!apiKey) return;
    if (window.google && (window as any).google.maps) {
      setLoaded(true);
      return;
    }
    const id = "gmaps-sdk";
    if (document.getElementById(id)) return; // will resolve on first load
    const s = document.createElement("script");
    s.id = id;
    s.async = true;
    s.defer = true;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&libraries=marker`;
    s.onload = () => setLoaded(true);
    s.onerror = () => setLoaded(false);
    document.head.appendChild(s);
  }, [apiKey]);
  return loaded;
}

export default function Locations() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const [places, setPlaces] = useState<Place[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [mapRatio, setMapRatio] = useState<number>(0.4); // 0.3 ~ 0.5
  const placesById = useMemo(() => new Map(places.map(p => [p.id, p])), [places]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const listRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapObj = useRef<any>(null);
  const markerMap = useRef<Record<string, any>>({});
  const loaded = useGoogleMaps(apiKey);
  const pastelMapStyles = useRef<any>([
    { elementType: "geometry", stylers: [{ color: "#fffbeb" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#92400e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
    { featureType: "poi", elementType: "geometry", stylers: [{ color: "#fef3c7" }] },
    { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ color: "#fef3c7" }] },
    { featureType: "poi.business", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#fef3c7" }] },
    { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#fde68a" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#facc15" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#bae6fd" }] }
  ]);

  // Fetch from Supabase
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: places, error: placesErr } = await supabase
        .from("places")
        .select("id, region, city, district, postal_code, address_line, place_label, latitude, longitude");
      const { data: locs, error: locsErr } = await supabase
        .from("locations")
        .select("id, title, tagline, image_url, price_krw, activity_level, skill_level, max_guests_total, min_age, place_id");
      if (cancelled) return;
      if (placesErr || locsErr) {
        // Minimal logging to help production debugging
        console.error("Supabase error", { placesErr, locsErr });
      }
      if (places && places.length > 0) {
        const mappedPlaces: Place[] = places.map((p: any) => ({
          id: p.id,
          region: p.region,
          city: p.city,
          district: p.district ?? undefined,
          postalCode: p.postal_code ?? undefined,
          addressLine: p.address_line ?? undefined,
          placeLabel: p.place_label ?? undefined,
          latitude: p.latitude,
          longitude: p.longitude,
        }));
        setPlaces(mappedPlaces);
      }
      if (locs && locs.length > 0) {
        const mappedLocs: LocationItem[] = locs.map((l: any) => ({
          id: l.id,
          title: l.title,
          tagline: l.tagline ?? undefined,
          imageUrl: l.image_url,
          priceKRW: l.price_krw,
          activityLevel: l.activity_level,
          skillLevel: l.skill_level,
          maxGuestsTotal: l.max_guests_total,
          minAge: l.min_age ?? undefined,
          placeId: l.place_id,
        }));
        setLocations(mappedLocs);
      }
      if ((places?.length ?? 0) === 0 || (locs?.length ?? 0) === 0) {
        console.log("Supabase fetch counts", { places: places?.length ?? 0, locations: locs?.length ?? 0 });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Initialize map and markers when SDK and data are ready
  useEffect(() => {
    if (!loaded || !mapRef.current || !window.google) return;

    const center = { lat: 37.5665, lng: 126.978 }; // Seoul City Hall
    mapObj.current = new (window as any).google.maps.Map(mapRef.current, {
      center,
      zoom: 12,
      mapId: "d3fault",
      clickableIcons: false,
      disableDefaultUI: true,
      styles: pastelMapStyles.current,
    });

    // Clear previous markers
    markerMap.current = {};

    for (const loc of locations) {
      const place = placesById.get(loc.placeId);
      if (!place) continue;

      const priceText = formatKRW(loc.priceKRW);

      // Prefer AdvancedMarkerElement, fallback to default marker with label
      const markerLib = (window as any).google.maps.marker;
      if (markerLib && markerLib.AdvancedMarkerElement) {
        const el = document.createElement("div");
        el.style.padding = "6px 10px";
        el.style.background = "#111111";
        el.style.border = "1px solid #111111";
        el.style.borderRadius = "999px";
        el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
        el.style.fontWeight = "700";
        el.style.color = "#ffffff";
        el.style.fontSize = "12px";
        el.textContent = priceText;

        const adv = new markerLib.AdvancedMarkerElement({
          map: mapObj.current,
          position: { lat: place.latitude, lng: place.longitude },
          content: el,
        });
        adv.addListener("click", () => {
          setSelectedId(loc.id);
          listRefs.current[loc.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
        });
        markerMap.current[loc.id] = adv;
      } else {
        const marker = new (window as any).google.maps.Marker({
          map: mapObj.current,
          position: { lat: place.latitude, lng: place.longitude },
          label: { text: priceText, color: "#ffffff", fontSize: "12px", fontWeight: "700" } as any,
          icon: {
            path: (window as any).google.maps.SymbolPath.CIRCLE,
            scale: 0,
            fillColor: "#111111",
            fillOpacity: 1,
            strokeOpacity: 0
          } as any,
        });
        marker.addListener("click", () => {
          setSelectedId(loc.id);
          listRefs.current[loc.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
        });
        markerMap.current[loc.id] = marker;
      }
    }
  }, [loaded, placesById, locations]);

  // Focus selected marker
  useEffect(() => {
    if (!selectedId || !mapObj.current) return;
    const loc = locations.find(l => l.id === selectedId);
    const place = loc ? placesById.get(loc.placeId) : undefined;
    if (!place) return;
    mapObj.current.panTo({ lat: place.latitude, lng: place.longitude });
    mapObj.current.setZoom(14);
  }, [selectedId, placesById, locations]);

  return (
    <Container $expanded={expanded}>
      <Resizer
        $mapRatio={mapRatio}
        $visible={!expanded}
        onMouseDown={(e) => {
          if (expanded) return;
          const startX = e.clientX;
          const startRatio = mapRatio;
          const onMove = (ev: MouseEvent) => {
            const delta = startX - ev.clientX;
            // viewport 기준으로 근사치 변환: 1920px 화면 기준 1vw ≈ 19.2px
            const pxPerVw = Math.max(window.innerWidth, 320) / 100;
            const deltaRatio = (delta / (pxPerVw * 100));
            const next = Math.min(Math.max(startRatio + deltaRatio, 0.3), 0.5);
            setMapRatio(next);
          };
          const onUp = () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
          };
          window.addEventListener("mousemove", onMove);
          window.addEventListener("mouseup", onUp);
        }}
      />
      <MapPane $expanded={expanded} $mapRatio={mapRatio}>
        <MapControls>
          <ControlButton onClick={() => { if (mapObj.current) mapObj.current.setZoom(Math.min((mapObj.current.getZoom?.() ?? 12) + 1, 20)); }} aria-label="Zoom in">
            <PlusIcon width={18} height={18} color="#111827" />
          </ControlButton>
          <ControlButton onClick={() => { if (mapObj.current) mapObj.current.setZoom(Math.max((mapObj.current.getZoom?.() ?? 12) - 1, 3)); }} aria-label="Zoom out">
            <MinusIcon width={18} height={18} color="#111827" />
          </ControlButton>
          <ControlButton onClick={() => setExpanded(v => !v)} aria-label="Toggle expand">
            {expanded ? (
              <ArrowsPointingInIcon width={18} height={18} color="#111827" />
            ) : (
              <ArrowsPointingOutIcon width={18} height={18} color="#111827" />
            )}
          </ControlButton>
        </MapControls>
        <MapDiv ref={mapRef} />
      </MapPane>
      <ListPane $expanded={expanded} $mapRatio={mapRatio}>
        <ListHeader>
          <div>
            <div style={{ fontWeight: 700, color: "#111827" }}>Seoul stays & experiences</div>
            <Count>{locations.length} locations • {new Date().toLocaleDateString()}</Count>
          </div>
          <ViewSwitch>
            <ViewBtn onClick={() => setViewMode("list")} $active={viewMode === "list"} aria-label="List view">
              <Bars3Icon width={18} height={18} color={viewMode === "list" ? "#111827" : "#6b7280"} />
            </ViewBtn>
            <ViewBtn onClick={() => setViewMode("grid")} $active={viewMode === "grid"} aria-label="Grid view">
              <Squares2X2Icon width={18} height={18} color={viewMode === "grid" ? "#111827" : "#6b7280"} />
            </ViewBtn>
          </ViewSwitch>
        </ListHeader>
        {!apiKey && (
          <Notice>
            Set VITE_GOOGLE_MAPS_API_KEY in your environment to view the map. The list still works.
          </Notice>
        )}
        <CardsWrap>
        {locations.length === 0 ? (
          <Notice>등록된 체험이 없습니다. Supabase에 시드 데이터를 추가해 주세요.</Notice>
        ) : (
        <Cards $mode={viewMode}>
          {locations.map((loc) => {
            const place = placesById.get(loc.placeId);
            return (
              <Card
                key={loc.id}
                ref={(el) => { listRefs.current[loc.id] = el; }}
                onClick={() => setSelectedId(loc.id)}
                $active={selectedId === loc.id}
              >
                <CardImage
                  src={loc.imageUrl}
                  alt={loc.title}
                  loading="lazy"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    t.onerror = null;
                    t.src = "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=1600&auto=format&fit=crop";
                  }}
                />
                <Title>{loc.title}</Title>
                <Sub>
                  {place?.city}{place?.district ? ` · ${place.district}` : ""}
                  {loc.tagline ? ` · ${loc.tagline}` : ""}
                </Sub>
                <Price>{formatKRW(loc.priceKRW)}</Price>
              </Card>
            );
          })}
        </Cards>
        )}
        </CardsWrap>
      </ListPane>
    </Container>
  );
}


