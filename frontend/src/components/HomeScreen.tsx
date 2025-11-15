import { MapPin, Package, ShoppingBag, Volume2, Bike, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MapView } from './MapView';
import { Location } from '../App';
import { useState } from 'react';

interface HomeScreenProps {
  pickupLocation: Location | null;
  dropoffLocation: Location | null;
  onPickupChange: (location: Location) => void;
  onDropoffChange: (location: Location) => void;
  onServiceSelect: (service: 'ride' | 'delivery' | 'shops') => void;
  highContrast: boolean;
  voiceEnabled: boolean;
}

export function HomeScreen({
  pickupLocation,
  dropoffLocation,
  onPickupChange,
  onDropoffChange,
  onServiceSelect,
  highContrast,
  voiceEnabled,
}: HomeScreenProps) {
  const [showRecentPickup, setShowRecentPickup] = useState(false);
  const [showRecentDropoff, setShowRecentDropoff] = useState(false);

  // Mock recent/frequent locations
  const recentLocations: Location[] = [
    { address: '123 Main Street, Downtown', lat: 40.7128, lng: -74.006 },
    { address: 'Central Park West', lat: 40.7829, lng: -73.9654 },
    { address: 'Times Square', lat: 40.7580, lng: -73.9855 },
  ];

  const handlePickupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    onPickupChange({
      address,
      lat: 40.7128 + Math.random() * 0.1,
      lng: -74.006 + Math.random() * 0.1,
    });
  };

  const handleDropoffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    onDropoffChange({
      address,
      lat: 40.7128 + Math.random() * 0.1,
      lng: -74.006 + Math.random() * 0.1,
    });
  };

  const handleRecentLocationSelect = (location: Location, type: 'pickup' | 'dropoff') => {
    if (type === 'pickup') {
      onPickupChange(location);
      setShowRecentPickup(false);
    } else {
      onDropoffChange(location);
      setShowRecentDropoff(false);
    }
    speak(`${type} location set to ${location.address}`);
  };

  const speak = (text: string) => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleServiceClick = (service: 'ride' | 'delivery' | 'shops', label: string) => {
    speak(`${label} selected`);
    onServiceSelect(service);
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      {/* Map View with Overlaying Location Inputs */}
      <div className="relative flex-1">
        <MapView
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
          highContrast={highContrast}
        />

        {/* Overlaying Location Inputs */}
        <div className="absolute top-4 left-4 right-4 space-y-2">
          <div className="relative">
            <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 z-10 ${highContrast ? 'text-green-400' : 'text-green-600'}`} />
            <Input
              type="text"
              placeholder="Pickup"
              value={pickupLocation?.address || ''}
              onChange={handlePickupChange}
              onFocus={() => speak('Enter pickup location')}
              className={`pl-10 pr-10 h-12 shadow-lg ${highContrast ? 'bg-gray-900 border-green-400 text-white placeholder:text-gray-400' : 'bg-white border-gray-300'}`}
              aria-label="Pickup location"
            />
            <Clock
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 cursor-pointer ${highContrast ? 'text-green-400' : 'text-green-600'}`}
              onClick={() => setShowRecentPickup(!showRecentPickup)}
            />
            {showRecentPickup && (
              <div className={`absolute left-0 top-full mt-1 w-full shadow-lg rounded-lg overflow-hidden z-20 ${highContrast ? 'bg-gray-900 border border-green-400' : 'bg-white'}`}>
                {recentLocations.map((location) => (
                  <div
                    key={location.address}
                    className={`px-4 py-3 cursor-pointer ${highContrast ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                    onClick={() => handleRecentLocationSelect(location, 'pickup')}
                  >
                    <p className="text-sm truncate">{location.address}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 z-10 ${highContrast ? 'text-green-400' : 'text-green-600'}`} />
            <Input
              type="text"
              placeholder="Drop-off"
              value={dropoffLocation?.address || ''}
              onChange={handleDropoffChange}
              onFocus={() => speak('Enter drop-off location')}
              className={`pl-10 pr-10 h-12 shadow-lg ${highContrast ? 'bg-gray-900 border-green-400 text-white placeholder:text-gray-400' : 'bg-white border-gray-300'}`}
              aria-label="Drop-off location"
            />
            <Clock
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 cursor-pointer ${highContrast ? 'text-green-400' : 'text-green-600'}`}
              onClick={() => setShowRecentDropoff(!showRecentDropoff)}
            />
            {showRecentDropoff && (
              <div className={`absolute left-0 top-full mt-1 w-full shadow-lg rounded-lg overflow-hidden z-20 ${highContrast ? 'bg-gray-900 border border-green-400' : 'bg-white'}`}>
                {recentLocations.map((location) => (
                  <div
                    key={location.address}
                    className={`px-4 py-3 cursor-pointer ${highContrast ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                    onClick={() => handleRecentLocationSelect(location, 'dropoff')}
                  >
                    <p className="text-sm truncate">{location.address}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Service Options - Inline Square Cards */}
      <div className={`p-4 ${highContrast ? 'bg-black border-t-2 border-green-400' : 'bg-white border-t border-gray-200'} shadow-lg`}>
        <h2 className={`text-base mb-3 ${highContrast ? 'text-white' : 'text-gray-900'}`}>
          Choose Service
        </h2>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleServiceClick('ride', 'Ride')}
            disabled={!pickupLocation || !dropoffLocation}
            className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${
              highContrast
                ? 'bg-green-900 hover:bg-green-800 text-white border-2 border-green-400 disabled:opacity-50'
                : 'bg-green-600 hover:bg-green-700 text-white disabled:opacity-50'
            }`}
            aria-label="Book a ride"
          >
            <Bike className="h-8 w-8" />
            <span className="text-sm">Ride</span>
          </button>

          <button
            onClick={() => handleServiceClick('delivery', 'Delivery')}
            disabled={!pickupLocation || !dropoffLocation}
            className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${
              highContrast
                ? 'bg-green-900 hover:bg-green-800 text-white border-2 border-green-400 disabled:opacity-50'
                : 'bg-green-600 hover:bg-green-700 text-white disabled:opacity-50'
            }`}
            aria-label="Send a parcel"
          >
            <Package className="h-8 w-8" />
            <span className="text-sm">Parcel</span>
          </button>

          <button
            onClick={() => handleServiceClick('shops', 'Shops')}
            className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${
              highContrast
                ? 'bg-green-900 hover:bg-green-800 text-white border-2 border-green-400'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            aria-label="Browse shops"
          >
            <ShoppingBag className="h-8 w-8" />
            <span className="text-sm">Shops</span>
          </button>
        </div>

        {/* Voice Hint - Compact */}
        {voiceEnabled && (
          <div className={`flex items-center gap-2 p-2 rounded-lg mt-3 ${
            highContrast ? 'bg-green-900 text-white' : 'bg-green-50 text-green-800'
          }`}>
            <Volume2 className="h-4 w-4" />
            <p className="text-xs">Voice active</p>
          </div>
        )}
      </div>
    </div>
  );
}