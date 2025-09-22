import { useEffect, useMemo, useRef, useState } from "react";
import { styled } from "styled-components";
import { PlusIcon, MinusIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon, Squares2X2Icon, Bars3Icon } from "@heroicons/react/24/outline";

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

const ListPane = styled.div<{ $expanded?: boolean }>`
  background: transparent;
  display: ${p => (p.$expanded ? "none" : "block")};
  margin-right: calc(clamp(320px, 42vw, 560px) + 16px);
`;

const MapPane = styled.div<{ $expanded?: boolean }>`
  position: ${p => (p.$expanded ? "fixed" : "sticky")};
  top: ${p => (p.$expanded ? 0 : "86px")};
  right: ${p => (p.$expanded ? 0 : "auto")};
  left: ${p => (p.$expanded ? 0 : "auto")};
  bottom: ${p => (p.$expanded ? 0 : "auto")};
  float: ${p => (p.$expanded ? "none" : "right")};
  margin-left: ${p => (p.$expanded ? 0 : "16px")};
  width: ${p => (p.$expanded ? "100%" : "clamp(320px, 42vw, 560px)")};
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
  border: 1px solid ${p => (p.$active ? "#111827" : "#e5e7eb")};
  background: #ffffff;
  cursor: pointer;
`;

const mockPlaces: Place[] = [
  { id: "p1", region: "Seoul", city: "Seoul", district: "Jung-gu", postalCode: "04620", addressLine: "Dongguk University Station exit 6", placeLabel: "Dongguk University Station", latitude: 37.5585, longitude: 127.0002 },
  { id: "p2", region: "Seoul", city: "Seoul", district: "Mapo-gu", postalCode: "04101", addressLine: "Hongdae Station exit 9", placeLabel: "Hongdae Station", latitude: 37.5572, longitude: 126.9245 },
  { id: "p3", region: "Seoul", city: "Seoul", district: "Gangnam-gu", postalCode: "06164", addressLine: "Gangnam Station exit 11", placeLabel: "Gangnam Station", latitude: 37.4979, longitude: 127.0276 },
  { id: "p4", region: "Seoul", city: "Seoul", district: "Jongno-gu", postalCode: "03154", addressLine: "Gyeongbokgung Palace", placeLabel: "Gyeongbokgung", latitude: 37.5796, longitude: 126.977 },
  { id: "p5", region: "Seoul", city: "Seoul", district: "Yongsan-gu", postalCode: "04390", addressLine: "Itaewon Station exit 3", placeLabel: "Itaewon", latitude: 37.5349, longitude: 126.9946 },
  { id: "p6", region: "Seoul", city: "Seoul", district: "Songpa-gu", postalCode: "05551", addressLine: "Lotte World Tower", placeLabel: "Jamsil", latitude: 37.5131, longitude: 127.1025 },
  { id: "p7", region: "Seoul", city: "Seoul", district: "Seodaemun-gu", postalCode: "03722", addressLine: "Sinchon Station exit 2", placeLabel: "Sinchon", latitude: 37.5599, longitude: 126.9425 },
  { id: "p8", region: "Seoul", city: "Seoul", district: "Gwangjin-gu", postalCode: "05075", addressLine: "Konkuk Univ. Station exit 6", placeLabel: "Konkuk Univ.", latitude: 37.5404, longitude: 127.0707 },
  { id: "p9", region: "Seoul", city: "Seoul", district: "Seocho-gu", postalCode: "06514", addressLine: "Express Bus Terminal", placeLabel: "Gangnam Express Bus Terminal", latitude: 37.5041, longitude: 127.0048 },
  { id: "p10", region: "Seoul", city: "Seoul", district: "Jung-gu", postalCode: "04524", addressLine: "Myeongdong Cathedral", placeLabel: "Myeongdong", latitude: 37.5637, longitude: 126.9874 },
];

const mockLocations: LocationItem[] = [
  { id: "l1", title: "Tarot Basics with Bart", tagline: "Card meanings & daily spreads.", imageUrl: "https://images.unsplash.com/photo-1599050751790-6cdaafbc1e9b?q=80&w=1600&auto=format&fit=crop", priceKRW: 63999, activityLevel: "LIGHT", skillLevel: "BEGINNER", maxGuestsTotal: 4, minAge: 18, placeId: "p1" },
  { id: "l2", title: "Night Fortune Stroll", tagline: "Street tarot and destiny talk.", imageUrl: "https://images.unsplash.com/photo-1556227701-833dc4c6b6f7?q=80&w=1600&auto=format&fit=crop", priceKRW: 45000, activityLevel: "MODERATE", skillLevel: "BEGINNER", maxGuestsTotal: 6, minAge: 12, placeId: "p2" },
  { id: "l3", title: "Korean Saju Introduction", tagline: "Four Pillars for beginners.", imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop", priceKRW: 55000, activityLevel: "MODERATE", skillLevel: "BEGINNER", maxGuestsTotal: 8, minAge: 10, placeId: "p3" },
  { id: "l4", title: "Temple Fortune Meditation", tagline: "Mindfulness for readings.", imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop", priceKRW: 30000, activityLevel: "LIGHT", skillLevel: "BEGINNER", maxGuestsTotal: 12, minAge: 16, placeId: "p4" },
  { id: "l5", title: "Itaewon Tarot Pop-up", tagline: "Fast 10-min readings.", imageUrl: "https://images.unsplash.com/photo-1519681394507-46b59cc0b4c1?q=80&w=1600&auto=format&fit=crop", priceKRW: 35000, activityLevel: "MODERATE", skillLevel: "BEGINNER", maxGuestsTotal: 10, minAge: 10, placeId: "p5" },
  { id: "l6", title: "Jamsil Astrology Circle", tagline: "Birth charts & coffee.", imageUrl: "https://images.unsplash.com/photo-1533154683836-81fddf7e8e62?q=80&w=1600&auto=format&fit=crop", priceKRW: 28000, activityLevel: "MODERATE", skillLevel: "INTERMEDIATE", maxGuestsTotal: 6, minAge: 14, placeId: "p6" },
  { id: "l7", title: "Sinchon Saju Study", tagline: "Practice with peers.", imageUrl: "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?q=80&w=1600&auto=format&fit=crop", priceKRW: 15000, activityLevel: "LIGHT", skillLevel: "BEGINNER", maxGuestsTotal: 15, minAge: 8, placeId: "p7" },
  { id: "l8", title: "K-Pop Oracle Workshop", tagline: "Use music for intuition.", imageUrl: "https://images.unsplash.com/photo-1519681391401-64d9590b6f3e?q=80&w=1600&auto=format&fit=crop", priceKRW: 40000, activityLevel: "INTENSE", skillLevel: "BEGINNER", maxGuestsTotal: 10, minAge: 10, placeId: "p8" },
  { id: "l9", title: "River Sunset Readings", tagline: "Tarot by the water.", imageUrl: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?q=80&w=1600&auto=format&fit=crop", priceKRW: 12000, activityLevel: "LIGHT", skillLevel: "BEGINNER", maxGuestsTotal: 12, minAge: 0, placeId: "p9" },
  { id: "l10", title: "Hanok Alley Omens", tagline: "Stories & symbolism.", imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop", priceKRW: 22000, activityLevel: "MODERATE", skillLevel: "BEGINNER", maxGuestsTotal: 12, minAge: 8, placeId: "p10" },
];

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
  const placesById = useMemo(() => new Map(mockPlaces.map(p => [p.id, p])), []);
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

  // Initialize map and markers when SDK is loaded
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

    for (const loc of mockLocations) {
      const place = placesById.get(loc.placeId);
      if (!place) continue;

      const priceText = formatKRW(loc.priceKRW);

      // Prefer AdvancedMarkerElement, fallback to default marker with label
      const markerLib = (window as any).google.maps.marker;
      if (markerLib && markerLib.AdvancedMarkerElement) {
        const el = document.createElement("div");
        el.style.padding = "6px 10px";
        el.style.background = "#fff";
        el.style.border = "1px solid #fde68a";
        el.style.borderRadius = "999px";
        el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
        el.style.fontWeight = "700";
        el.style.color = "#92400e";
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
          label: { text: priceText, color: "#92400e", fontSize: "12px", fontWeight: "700" } as any,
        });
        marker.addListener("click", () => {
          setSelectedId(loc.id);
          listRefs.current[loc.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
        });
        markerMap.current[loc.id] = marker;
      }
    }
  }, [loaded, placesById]);

  // Focus selected marker
  useEffect(() => {
    if (!selectedId || !mapObj.current) return;
    const loc = mockLocations.find(l => l.id === selectedId);
    const place = loc ? placesById.get(loc.placeId) : undefined;
    if (!place) return;
    mapObj.current.panTo({ lat: place.latitude, lng: place.longitude });
    mapObj.current.setZoom(14);
  }, [selectedId, placesById]);

  return (
    <Container $expanded={expanded}>
      <MapPane $expanded={expanded}>
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
      <ListPane $expanded={expanded}>
        <ListHeader>
          <div>
            <div style={{ fontWeight: 700, color: "#111827" }}>Seoul stays & experiences</div>
            <Count>{mockLocations.length} locations • {new Date().toLocaleDateString()}</Count>
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
        <Cards $mode={viewMode}>
          {mockLocations.map((loc) => {
            const place = placesById.get(loc.placeId);
            return (
              <Card
                key={loc.id}
                ref={(el) => (listRefs.current[loc.id] = el)}
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
        </CardsWrap>
      </ListPane>
    </Container>
  );
}


