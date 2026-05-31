'use client';
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'CUSTOM_LOCATION';

export type LocationState = {
  locationText: string;
  loading: boolean;
  isCustom: boolean;
  setCustomLocation: (text: string) => void;
  resetToGPS: () => void;
};

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
    { headers: { 'Accept-Language': 'en' } }
  );
  const data = await res.json();
  const a = data.address ?? {};
  const suburb = a.suburb || a.neighbourhood || a.city_district || a.quarter;
  const city   = a.city   || a.town          || a.village       || a.county;
  const parts  = [suburb, city].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : (data.display_name?.split(',')[0] ?? '');
}

export function useLocation(): LocationState {
  const [locationText, setLocationText] = useState('');
  const [loading,      setLoading]      = useState(true);
  const [isCustom,     setIsCustom]     = useState(false);
  const [gpsRevision,  setGpsRevision]  = useState(0);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      setLocationText(saved);
      setIsCustom(true);
      setLoading(false);
      return;
    }

    setIsCustom(false);
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async pos => {
        try {
          const text = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          setLocationText(text);
        } catch {
          setLocationText('');
        } finally {
          setLoading(false);
        }
      },
      () => setLoading(false),
      { timeout: 8000 }
    );
  }, [gpsRevision]);

  const setCustomLocation = (text: string) => {
    const trimmed = text.trim();
    localStorage.setItem(STORAGE_KEY, trimmed);
    setLocationText(trimmed);
    setIsCustom(true);
    setLoading(false);
  };

  const resetToGPS = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsCustom(false);
    setLocationText('');
    setLoading(true);
    setGpsRevision(r => r + 1);
  };

  return { locationText, loading, isCustom, setCustomLocation, resetToGPS };
}
