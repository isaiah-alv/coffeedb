"use client";

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { HiViewGrid, HiViewList } from 'react-icons/hi';
import { FaMugHot, FaLaptop } from 'react-icons/fa';
import RemoveBtn from './RemoveBtn';
import { useSession } from 'next-auth/react';

export default function CafeListClient({ cafes }) {
  const [singleColumn, setSingleColumn] = useState(false);
  const [tab, setTab] = useState('all'); 
  const [sortBy, setSortBy] = useState('newest'); // newest | coffee | atmosphere | nearest
  const { data: session, status } = useSession();
  const isAuthed = status === 'authenticated' && !!session?.user?.id;

  // Prevent guests from selecting 'nearest'
  useEffect(() => {
    if (!isAuthed && sortBy === 'nearest') setSortBy('newest');
  }, [isAuthed, sortBy]);
  const [userPos, setUserPos] = useState(null); // {lat,lng}
  const [geoError, setGeoError] = useState('');
  const [placeCache, setPlaceCache] = useState({}); // id -> {lat,lng}
  const geocoderRef = useRef(null);
  const mapsLoadedRef = useRef(false);

  const gridClass = singleColumn ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  //  load Google Maps when needed
  async function loadGoogleMaps() {
    if (typeof window === 'undefined') return null;
    if (window.google?.maps) return window.google;
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) {
      setGeoError('To use Nearest sorting, set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.');
      return null;
    }
    return new Promise((resolve, reject) => {
      window.__gmapsInitList = () => resolve(window.google);
      const s = document.createElement('script');
      s.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
      s.async = true; s.defer = true; s.id = 'gmaps-list';
      s.onerror = () => reject(new Error('Failed to load Google Maps'));
      document.head.appendChild(s);
      s.onload = () => resolve(window.google);
    });
  }

  // obtain user location when sorting by nearest
  useEffect(() => {
    if (!isAuthed || sortBy !== 'nearest') return;
    setGeoError('');
    if (!navigator.geolocation) {
      setGeoError('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setGeoError('Location permission denied'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [isAuthed, sortBy]);

  // build full address string for geocoding
  const addrText = (c) => {
    const a = c.address || {};
    return [a.street, [a.city, a.state].filter(Boolean).join(', '), a.postalCode, a.country].filter(Boolean).join(', ');
  };

  // goeode cafes lazily when needed
  useEffect(() => {
    const run = async () => {
      if (!isAuthed || sortBy !== 'nearest' || !userPos) return;
      if (!mapsLoadedRef.current) {
        const g = await loadGoogleMaps();
        if (!g) return;
        geocoderRef.current = new g.maps.Geocoder();
        mapsLoadedRef.current = true;
      }
      const g = window.google;
      if (!g?.maps || !geocoderRef.current) return;

      // Geocode missing ones (limit to first 15 to avoid quota)
      const missing = cafes.filter(c => !placeCache[c._id]).slice(0, 15);
      if (missing.length === 0) return;

      const entries = [];
      for (const c of missing) {
        const address = addrText(c);
        // eslint-disable-next-line no-await-in-loop
        const coords = await new Promise((resolve) => {
          geocoderRef.current.geocode({ address }, (res, status) => {
            if (status === 'OK' && res?.[0]?.geometry?.location) {
              const loc = res[0].geometry.location;
              resolve({ lat: loc.lat(), lng: loc.lng() });
            } else { resolve(null); }
          });
        });
        if (coords) entries.push([c._id, coords]);
      }
      if (entries.length) {
        setPlaceCache(prev => ({ ...prev, ...Object.fromEntries(entries) }));
      }
    };
    run();
   
  }, [isAuthed, sortBy, userPos, cafes]);

  const haversine = (a, b) => {
    if (!a || !b) return Infinity;
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const sa = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(sa));
  };

  const filtered = useMemo(() => (
    tab === 'mine' && isAuthed ? cafes.filter(c => c.ownerId === session.user.id) : cafes
  ), [tab, isAuthed, session?.user?.id, cafes]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortBy === 'coffee') {
      arr.sort((a, b) => (b.ratings?.coffee || 0) - (a.ratings?.coffee || 0));
    } else if (sortBy === 'atmosphere') {
      arr.sort((a, b) => (b.ratings?.atmosphere || 0) - (a.ratings?.atmosphere || 0));
    } else if (isAuthed && sortBy === 'nearest') {
      arr.sort((a, b) => {
        const da = haversine(userPos, placeCache[a._id]);
        const db = haversine(userPos, placeCache[b._id]);
        return da - db;
      });
    } else { // newer
      arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return arr;
  }, [filtered, isAuthed, sortBy, placeCache, userPos]);

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        {/* Tabs  */}
        {isAuthed ? (
          <div className="flex items-center gap-2">
            <button onClick={() => setTab('all')} className={`seg-btn text-sm ${tab==='all' ? 'seg-btn-active' : ''}`}>All Cafes</button>
            <button onClick={() => setTab('mine')} className={`seg-btn text-sm ${tab==='mine' ? 'seg-btn-active' : ''}`}>My Cafes</button>
          </div>
        ) : (
          <div />
        )}

    
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <label className="text-sm" style={{color:'var(--text)'}}>Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-surface text-sm"
            >
              <option value="newest">Newest</option>
              <option value="coffee">Coffee rating</option>
              <option value="atmosphere">Atmosphere rating</option>
              {isAuthed && <option value="nearest">Nearest to me</option>}
            </select>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => setSingleColumn(false)}
              className={`seg-btn flex items-center gap-2 ${singleColumn ? '' : 'seg-btn-active'}`}
              title="3-column view"
            >
              <HiViewGrid />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setSingleColumn(true)}
              className={`seg-btn flex items-center gap-2 ${singleColumn ? 'seg-btn-active' : ''}`}
              title="1-column view"
            >
              <HiViewList />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 justify-end">
            <Link href="/addCafe" className="coffee-btn">Add Cafe</Link>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className={`grid ${gridClass} gap-4`}>
        {(isAuthed ? sorted : sorted.slice(0, 9)).map((c) => {
          const isOwner = session?.user?.id && c.ownerId === session.user.id;
          const isList = singleColumn === true;
          return (
          <div key={c._id} className="coffee-card coffee-card-hover overflow-hidden">
            <div className="p-4">
              {isList ? (
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <h2 className="heading-serif text-lg mb-2" style={{color:'var(--text)'}}>{c.name}</h2>
                    <div className=" text-xs space-y-1">
                      <div className="font-medium  mb-1">Address:</div>
                      <p>{c.address.street}</p>
                      <p>{c.address.city}, {c.address.state}</p>
                      {c.address.postalCode && <p>{c.address.postalCode}, {c.address.country}</p>}
                      {!c.address.postalCode && <p>{c.address.country}</p>}
                     
                    </div>
                  </div>
                  <div className="min-w-[180px] sm:text-right">
                    <div className="space-y-1 mb-0">
                      <div className="flex sm:justify-end items-center ">
                        <FaMugHot className="icon-accent mr-2" />
                        <span className="text-sm">Coffee: {c.ratings.coffee}/10</span>
                      </div>
                      <div className="flex sm:justify-end items-center">
                        <FaLaptop className="icon-accent mr-2" />
                        <span className="text-sm">Atmosphere: {c.ratings.atmosphere}/10</span>
                        
                      </div>
                       <p className="text-xs mt-2">Added: {new Date(c.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs ">Added by: {c.ownerName || 'Unknown'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="heading-serif text-lg mb-2" style={{color:'var(--text)'}}>{c.name}</h2>
                  <div className="space-y-1 mb-3" style={{color:'var(--text)'}}>
                    <div className="flex items-center">
                      <FaMugHot className="icon-accent mr-2" />
                      <span className="text-sm">Coffee: {c.ratings.coffee}/10</span>
                    </div>
                    <div className="flex items-center">
                      <FaLaptop className="icon-accent mr-2" />
                      <span className="text-sm">Atmosphere: {c.ratings.atmosphere}/10</span>
                    </div>
                  </div>
                  <div className="text-sm space-y-1" style={{color:'var(--text)'}}>
                    <div className="font-medium text-gray-700 mb-1">Address:</div>
                    <p>{c.address.street}</p>
                    <p>{c.address.city}, {c.address.state}</p>
                    {c.address.postalCode && <p>{c.address.postalCode}, {c.address.country}</p>}
                    {!c.address.postalCode && <p>{c.address.country}</p>}
                    <p className="text-xs" style={{opacity:0.75,color:'var(--text)'}}>Added: {new Date(c.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs" style={{opacity:0.75,color:'var(--text)'}}>Added by: {c.ownerName || 'Unknown'}</p>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            {isOwner && (
              <div className="px-4 py-3 border-t border-gray-100 flex justify-end space-x-2 bg-white/70">
                <RemoveBtn id={c._id} />
                <Link 
                  href={`/editCafe/${c._id}`}
                  className="px-3 py-1.5 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors text-sm"
                >
                  Edit
                </Link>
              </div>
            )}
          </div>
        );})}
      </div>

      {cafes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-amber-500 text-6xl mb-4">☕</div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No cafes yet</h3>
          <p className="text-gray-600">Add your first cafe to get started!</p>
        </div>
      )}

      {status !== 'authenticated' && sorted.length > 9 && (
        <div className="mt-6 text-center">
          <p className="text-sm" style={{color:'var(--text)'}}>
            Showing 9 of {sorted.length} cafes. <Link href="/signin" className="link-nav">Sign in</Link> to see all and filter.
          </p>
        </div>
      )}
    </div>
  );
}
