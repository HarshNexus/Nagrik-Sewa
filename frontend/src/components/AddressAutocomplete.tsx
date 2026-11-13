import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, LocateFixed, MapPin } from 'lucide-react';

export interface Place {
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  lat: number;
  lon: number;
}

// OpenStreetMap Nominatim: free, keyless geocoding. Fine for form-level usage (debounced, one request at a time).
const NOMINATIM = 'https://nominatim.openstreetmap.org';
const COMMON = 'format=jsonv2&addressdetails=1&accept-language=en';

const toPlace = (r: any): Place => {
  const a = r.address || {};
  return {
    street: [a.house_number, a.road].filter(Boolean).join(' ') || r.name || '',
    area: a.suburb || a.neighbourhood || a.village || '',
    city: a.city || a.town || a.village || a.county || a.state_district || '',
    state: a.state || '',
    pincode: a.postcode || '',
    lat: Number(r.lat),
    lon: Number(r.lon)
  };
};

const AddressAutocomplete: React.FC<{ onSelect: (place: Place) => void }> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const skipSearch = useRef(false);

  useEffect(() => {
    if (skipSearch.current) {
      skipSearch.current = false;
      return;
    }
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${NOMINATIM}/search?${COMMON}&countrycodes=in&limit=5&q=${encodeURIComponent(query)}`, { signal: controller.signal });
        setResults(await res.json());
        setOpen(true);
        setMessage('');
      } catch (err: any) {
        if (err.name !== 'AbortError') setMessage('Address search is unavailable right now. Please type the address manually.');
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const choose = (r: any) => {
    skipSearch.current = true;
    setQuery(r.display_name);
    setOpen(false);
    onSelect(toPlace(r));
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMessage('Your browser does not support location access.');
      return;
    }
    setLoading(true);
    setMessage('');
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(`${NOMINATIM}/reverse?${COMMON}&lat=${coords.latitude}&lon=${coords.longitude}`);
          const r = await res.json();
          skipSearch.current = true;
          setQuery(r.display_name || '');
          onSelect({ ...toPlace(r), lat: coords.latitude, lon: coords.longitude });
        } catch {
          setMessage('Could not look up your address. Please type it manually.');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        setMessage('Location permission denied. Please search or type the address.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          className="pl-9 pr-9"
          placeholder="Search your address, area or landmark"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          onBlur={() => setOpen(false)}
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />}
        {open && results.length > 0 && (
          <ul className="absolute z-20 mt-1 w-full rounded-md border bg-white shadow-lg max-h-64 overflow-auto">
            {results.map((r) => (
              <li
                key={r.place_id}
                // mousedown fires before the input's blur closes the list
                onMouseDown={() => choose(r)}
                className="cursor-pointer px-3 py-2 text-sm hover:bg-green-50"
              >
                {r.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={useCurrentLocation} disabled={loading}>
        <LocateFixed className="h-4 w-4 mr-2" />
        Use my current location
      </Button>
      {message && <p className="text-sm text-red-600">{message}</p>}
    </div>
  );
};

export default AddressAutocomplete;
