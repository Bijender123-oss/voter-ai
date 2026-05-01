import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Search, Navigation, AlertCircle, ExternalLink } from 'lucide-react';
import { GOOGLE_MAPS_API_KEY } from '../config/firebase';

const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1a2744' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a2744' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2d3a5e' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1a2744' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f1924' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

const DEMO_BOOTHS = [
  { id: 1, name: "Primary School, Sector 14", address: "Sector 14, Near Water Tank", ward: "Ward 7", lat: 28.6139, lng: 77.2090 },
  { id: 2, name: "Community Hall, Block B", address: "Block B, Main Road", ward: "Ward 8", lat: 28.6162, lng: 77.2118 },
  { id: 3, name: "Govt. Higher Secondary School", address: "Civil Lines, Opp. Park", ward: "Ward 9", lat: 28.6098, lng: 77.2068 },
];

function BoothCard({ booth, onClick, active }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all ${
        active ? 'border-teal-400 bg-teal-500/10 shadow-[0_0_10px_rgba(20,184,166,0.2)]' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'
      }`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          active ? 'bg-teal-500' : 'bg-slate-700'
        }`}>
          <MapPin size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white text-sm">{booth.name}</p>
          <p className="text-xs text-slate-400 mt-0.5">{booth.address}</p>
          <span className="inline-block mt-1 text-[10px] px-2 py-0.5 bg-slate-700 text-teal-300 rounded-full border border-slate-600">
            {booth.ward}
          </span>
        </div>
      </div>
    </motion.button>
  );
}

export default function BoothLocatorPage() {
  const [location, setLocation] = useState('');
  const [searched, setSearched] = useState(false);
  const [center, setCenter] = useState({ lat: 28.6139, lng: 77.2090 });
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const mapRef = useRef(null);

  const hasApiKey = GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== '';

  const { isLoaded } = useJsApiLoader({
    id: 'vs-map',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY || 'DEMO',
    libraries: ['places'],
  });

  const onMapLoad = useCallback(map => { mapRef.current = map; }, []);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!location.trim()) return;
    setSearched(true);

    if (hasApiKey && window.google) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: location + ', India' }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const loc = results[0].geometry.location;
          const newCenter = { lat: loc.lat(), lng: loc.lng() };
          setCenter(newCenter);
          mapRef.current?.panTo(newCenter);
        }
      });
    }
  };

  const handleGPS = () => {
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const newCenter = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCenter(newCenter);
        mapRef.current?.panTo(newCenter);
        setSearched(true);
        setGpsLoading(false);
      },
      () => {
        alert('Could not access your location. Please allow location access.');
        setGpsLoading(false);
      }
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full overflow-hidden"
    >
      <div className="p-4 md:p-6 border-b border-slate-800 flex-shrink-0 bg-slate-900/50 backdrop-blur-md relative z-10 shadow-md">
        <h1 className="section-title mb-1">Polling Booth Locator</h1>
        <p className="text-slate-400 text-sm">Find your nearest polling booth 🗺️</p>

        <form onSubmit={handleSearch} className="flex gap-2 mt-4 max-w-2xl">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input-field pl-9 bg-slate-800 border-slate-700" placeholder="Enter your area, city, or pincode..."
              value={location} onChange={e => setLocation(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary px-6">Search</button>
          <button type="button" onClick={handleGPS} disabled={gpsLoading}
            className="btn-secondary px-4 flex items-center gap-1 bg-slate-800 border-slate-700 hover:bg-slate-700" title="Use my location">
            <Navigation size={18} className={gpsLoading ? 'animate-spin text-teal-400' : 'text-slate-300'} />
          </button>
        </form>

        {!hasApiKey && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-start gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 max-w-2xl"
          >
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>
              <strong>Demo Mode:</strong> Add your Google Maps API key to <code>.env</code> to enable real booth search.
              You can find your booth at{' '}
              <a href="https://electoralsearch.eci.gov.in/" target="_blank" rel="noopener noreferrer"
                className="underline hover:text-amber-300">electoralsearch.eci.gov.in <ExternalLink size={10} className="inline" /></a>
            </span>
          </motion.div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0 border-r border-slate-800 bg-slate-900/50 backdrop-blur-md overflow-y-auto p-4 space-y-3 hidden md:block z-10 shadow-lg">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">
            {searched ? `Nearby Booths (Demo)` : 'Enter location to search'}
          </p>
          {(searched ? DEMO_BOOTHS : []).map((booth, i) => (
            <motion.div 
              key={booth.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <BoothCard booth={booth}
                active={selectedBooth?.id === booth.id}
                onClick={() => { setSelectedBooth(booth); setCenter({ lat: booth.lat, lng: booth.lng }); }} />
            </motion.div>
          ))}
          {!searched && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-10"
            >
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 border border-slate-700 shadow-inner">
                <MapPin size={24} className="text-slate-500" />
              </div>
              <p className="text-slate-400 text-sm">Enter your location above to find nearby polling booths</p>
            </motion.div>
          )}

          {/* ECI Link */}
          <a href="https://electoralsearch.eci.gov.in/" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm text-teal-400 hover:text-teal-300 mt-6 p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl transition-all hover:bg-teal-500/20 shadow-sm">
            <ExternalLink size={14} /> Search on ECI Portal
          </a>
        </div>

        {/* Map */}
        <div className="flex-1 relative z-0">
          {hasApiKey && isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={center}
              zoom={14}
              onLoad={onMapLoad}
              options={{ styles: mapStyle, disableDefaultUI: false, zoomControl: true }}>
              {DEMO_BOOTHS.map(booth => (
                <Marker key={booth.id}
                  position={{ lat: booth.lat, lng: booth.lng }}
                  title={booth.name}
                  onClick={() => setSelectedBooth(booth)}
                  icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' }} />
              ))}
              {selectedBooth && (
                <InfoWindow position={{ lat: selectedBooth.lat, lng: selectedBooth.lng }}
                  onCloseClick={() => setSelectedBooth(null)}>
                  <div className="text-dark p-1">
                    <strong className="block text-sm mb-1">{selectedBooth.name}</strong>
                    <p className="text-xs text-gray-600 leading-tight">{selectedBooth.address}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            // Fallback map placeholder
            <div className="w-full h-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #14b8a6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center z-10 p-8 glass-card border-slate-700 bg-slate-800/80 shadow-2xl max-w-sm"
              >
                <div className="text-6xl mb-4 animate-float">🗺️</div>
                <h3 className="text-white font-bold text-xl mb-3">Interactive Map</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Add your Google Maps API key to see the real interactive map with animated polling booth markers.
                </p>
                <a href="https://electoralsearch.eci.gov.in/" target="_blank" rel="noopener noreferrer"
                  className="btn-primary w-full flex items-center justify-center gap-2 shadow-lg">
                  <ExternalLink size={18} /> Find Booth on ECI
                </a>
                {searched && (
                  <div className="mt-8 space-y-3 md:hidden text-left">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider text-center mb-2">Demo Results</p>
                    {DEMO_BOOTHS.map(booth => (
                      <BoothCard key={booth.id} booth={booth}
                        active={selectedBooth?.id === booth.id}
                        onClick={() => setSelectedBooth(booth)} />
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
