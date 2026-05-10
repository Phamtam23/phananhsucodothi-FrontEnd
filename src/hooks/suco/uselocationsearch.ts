import {useState, useRef} from 'react';

export interface NominatimResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

export const useLocationSearch = (OnSelect :(kinhDo: number, viDo:number, diaDiem:string)=> void) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
    const [isSerching, setIsSearching] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);    

        if(debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if(value.trim() === '') {
            setSuggestions([]);
            return;
        }

        debounceRef.current = setTimeout(async () => {
        try {
            setIsSearching(true);
           const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&addressdetails=1&limit=5&countrycodes=vn&viewbox=108.0,16.3,108.4,15.9&bounded=1`,
            { headers: { "Accept-Language": "vi" } }
            );
            const data: NominatimResult[] = await res.json();
            setSuggestions(data);
        } catch (error) {
            console.error("Nominatim error", error);
        } finally {
            setIsSearching(false);
        }
    }, 500);

    };

    const handleSelect = (result: NominatimResult) => {
        setQuery(result.display_name);
        setSuggestions([]);
        OnSelect(parseFloat(result.lon), parseFloat(result.lat), result.display_name);
    };

    const clearSuggestions = () => setSuggestions([]);
    
    return {
        query,
        suggestions,
        isSerching,
        handQueryChange,
        handleSelect,
        clearSuggestions
    }
    
}