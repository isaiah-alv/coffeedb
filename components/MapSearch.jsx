"use client";

import { useEffect, useRef, useState, useCallback } from "react";


function loadGoogleMaps(apiKey) {
  if (typeof window === "undefined") return Promise.reject(new Error("window not available"));
  if (window.google && window.google.maps && window.google.maps.places) return Promise.resolve(window.google);
  if (document.getElementById("gmaps-script")) {
    return new Promise((resolve, reject) => {
      const onLoaded = () => resolve(window.google);
      if (window.google) return resolve(window.google);
      window.__gmapsInit = onLoaded;
      setTimeout(() => (window.google ? resolve(window.google) : reject(new Error("Maps load timeout"))), 12000);
    });
  }
  return new Promise((resolve, reject) => {
    window.__gmapsInit = () => resolve(window.google);
    const s = document.createElement("script");
    s.id = "gmaps-script";
    s.async = true;
    s.defer = true;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=__gmapsInit`;
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });
}

import { useSession, signIn } from "next-auth/react";

export default function MapSearch() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [position, setPosition] = useState(null); // latitude and longitude
  const [places, setPlaces] = useState([]);
  const { status } = useSession();
  const [savingId, setSavingId] = useState("");

  //removes all markers from map
  const clearMarkers = () => {
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
  };

  //searches for cafes if maps is loaded
  const searchNearby = useCallback(async (center) => {
    if (!center) return;
    setLoading(true);
    setError("");
    try {
      const google = await loadGoogleMaps(apiKey);
      if (!mapInstanceRef.current && mapRef.current) {
        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center,
          zoom: 14,
          mapId: "cafe_finder_map",
        });
      } else if (mapInstanceRef.current) {
        mapInstanceRef.current.setCenter(center);
        mapInstanceRef.current.setZoom(14);
      }

      const service = new google.maps.places.PlacesService(mapInstanceRef.current);
      const request = {
        location: center,
        radius: 2000,
        type: "cafe",
        keyword: "coffee",
        openNow: false,
      };

      await new Promise((resolve) => setTimeout(resolve, 100)); // small yield for map readiness

      service.nearbySearch(request, (results, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !results) {
          setPlaces([]);
          setError("No cafes found nearby");
          setLoading(false);
          return;
        }
        setPlaces(results);

        clearMarkers();
        const bounds = new google.maps.LatLngBounds();
        results.forEach((place) => {
          const loc = place.geometry?.location;
          if (!loc) return;
          const marker = new google.maps.Marker({
            map: mapInstanceRef.current,
            position: loc,
            title: place.name,
          });
          markersRef.current.push(marker);
          bounds.extend(loc);
        });
        if (!bounds.isEmpty()) {
          mapInstanceRef.current.fitBounds(bounds, 64);
        }
        setLoading(false);
      });
    } catch (e) {
      console.error(e);
      setError(e.message || "Map error");
      setLoading(false);
    }
  }, [apiKey]);
 // browser geolocation for coordinates
  const useMyLocation = async () => {
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation not supported in this browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const center = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(center);
        searchNearby(center);
      },
      (err) => {
        console.warn("Geolocation error", err);
        setError("Location permission denied. Try manually searching.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    // attempt once on mount
    useMyLocation();

  }, []);

  const openInMaps = (place) => {
    const q = encodeURIComponent(place.vicinity || place.name);
    const lat = place.geometry?.location?.lat?.();
    const lng = place.geometry?.location?.lng?.();
    const url = lat && lng
      ? `https://www.google.com/maps/search/?api=1&query=${lat}%2C${lng}&query_place_id=${place.place_id}`
      : `https://www.google.com/maps/search/?api=1&query=${q}`;
    window.open(url, "_blank");
  };

  const saveToTry = async (place) => {
    if (status !== 'authenticated') {
      signIn();
      return;
    }
    setSavingId(place.place_id);
    try {
      const lat = place.geometry?.location?.lat?.();
      const lng = place.geometry?.location?.lng?.();
      const res = await fetch('/api/to-try', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeId: place.place_id,
          name: place.name,
          address: place.vicinity || place.formatted_address || '',
          lat: typeof lat === 'number' ? lat : undefined,
          lng: typeof lng === 'number' ? lng : undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save');
      }
    } catch (e) {
      console.error(e);
      alert(e.message || 'Failed to save');
    } finally {
      setSavingId("");
    }
  };

  const buildPrefillUrl = (place) => {
    const addr = place.formatted_address || place.vicinity || "";
    const name = place.name || "";
    return `/addCafe?prefillName=${encodeURIComponent(name)}&address=${encodeURIComponent(addr)}`;
  };

  if (status === 'unauthenticated') {
    return (
      <div className="max-w-md mx-auto p-6 coffee-card">
        <h1 className="text-2xl heading-serif mb-3" style={{color:'var(--text)'}}>
          Cafe Finder
        </h1>
        <p className="mb-3" style={{color:'var(--text)'}}>
          Please sign in to use the map-based cafe finder.
        </p>
        <button className="coffee-btn" onClick={() => signIn(undefined, { callbackUrl: '/search' })}>Sign in</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
        <div>
          <h1 className="text-2xl heading-serif" style={{color:'var(--text)'}}>Cafe Finder</h1>
          <p className="text-sm" style={{color:'var(--text)'}}>Find cafes near your current location.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border" style={{borderColor:'var(--card-border)'}} onClick={useMyLocation}>
            Use my location
          </button>
        </div>
      </div>

      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div ref={mapRef} className="w-full h-[380px] sm:h-[460px] rounded-xl overflow-hidden coffee-card" />
        </div>
        <div className="space-y-2 max-h-[460px] overflow-y-auto">
          {loading && <div className="text-gray-600">Searching nearby cafes…</div>}
          {!loading && places.length === 0 && <div className="text-gray-600">No results yet.</div>}
          {places.map((p) => (
            <div key={p.place_id} className="coffee-card p-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium" style={{color:'var(--text)'}}>{p.name}</div>
                  <div className="text-sm" style={{color:'var(--text)'}}>{p.vicinity || p.formatted_address}</div>
                  {p.rating && (
                    <div className="text-xs" style={{color:'var(--text)'}}>Google rating: {p.rating} ({p.user_ratings_total || 0})</div>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <button className="text-sm link-nav" onClick={() => openInMaps(p)}>Open</button>
                  <a
                    className="px-3 py-1.5 text-sm rounded-lg border"
                    style={{borderColor:'var(--card-border)'}}
                    href={buildPrefillUrl(p)}
                    title="Rate this cafe"
                  >
                    Rate
                  </a>
                  <button
                    className="px-3 py-1.5 text-sm rounded-lg coffee-btn"
                    onClick={() => saveToTry(p)}
                    disabled={savingId === p.place_id}
                    title="Save to your To-Try list"
                  >
                    {savingId === p.place_id ? 'Saving…' : 'Save' }
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
