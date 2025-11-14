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
    <div className="p-4 space-y-4">
      {/* Map View */}
      <MapView
        pickupLocation={pickupLocation}
        dropoffLocation={dropoffLocation}
        highContrast={highContrast}
      />

      {/* Location Inputs */}
      <div className="space-y-3">
        <div className="relative">
          <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 ${highContrast ? 'text-green-400' : 'text-green-600'}`} />
          <Input
            type="text"
            placeholder="Enter pickup location"
            value={pickupLocation?.address || ''}
            onChange={handlePickupChange}
            onFocus={() => speak('Enter pickup location')}
            className={`pl-12 h-14 ${highContrast ? 'bg-gray-900 border-green-400 text-white placeholder:text-gray-400' : 'border-gray-300'}`}
            aria-label="Pickup location"
          />
          {showRecentPickup && (
            <div className="absolute left-0 top-full w-full bg-white shadow-lg z-10">
              {recentLocations.map((location) => (
                <div
                  key={location.address}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleRecentLocationSelect(location, 'pickup')}
                >
                  {location.address}
                </div>
              ))}
            </div>
          )}
          <Clock
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 ${highContrast ? 'text-green-400' : 'text-green-600'}`}
            onClick={() => setShowRecentPickup(!showRecentPickup)}
          />
        </div>

        <div className="relative">
          <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 ${highContrast ? 'text-green-400' : 'text-green-600'}`} />
          <Input
            type="text"
            placeholder="Enter drop-off location"
            value={dropoffLocation?.address || ''}
            onChange={handleDropoffChange}
            onFocus={() => speak('Enter drop-off location')}
            className={`pl-12 h-14 ${highContrast ? 'bg-gray-900 border-green-400 text-white placeholder:text-gray-400' : 'border-gray-300'}`}
            aria-label="Drop-off location"
          />
          {showRecentDropoff && (
            <div className="absolute left-0 top-full w-full bg-white shadow-lg z-10">
              {recentLocations.map((location) => (
                <div
                  key={location.address}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleRecentLocationSelect(location, 'dropoff')}
                >
                  {location.address}
                </div>
              ))}
            </div>
          )}
          <Clock
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 ${highContrast ? 'text-green-400' : 'text-green-600'}`}
            onClick={() => setShowRecentDropoff(!showRecentDropoff)}
          />
        </div>
      </div>

      {/* Service Options */}
      <div className="space-y-3">
        <h2 className={`text-xl ${highContrast ? 'text-white' : 'text-gray-900'}`}>
          Choose Service
        </h2>

        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={() => handleServiceClick('ride', 'Ride')}
            disabled={!pickupLocation || !dropoffLocation}
            className={`h-20 flex items-center justify-start gap-4 ${
              highContrast
                ? 'bg-green-900 hover:bg-green-800 text-white border-2 border-green-400'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            aria-label="Book a ride"
          >
            <Bike className="h-8 w-8" />
            <div className="text-left">
              <div className="text-lg">Book a Ride</div>
              <div className="text-sm opacity-90">Travel to your destination</div>
            </div>
          </Button>

          <Button
            onClick={() => handleServiceClick('delivery', 'Delivery')}
            disabled={!pickupLocation || !dropoffLocation}
            className={`h-20 flex items-center justify-start gap-4 ${
              highContrast
                ? 'bg-green-900 hover:bg-green-800 text-white border-2 border-green-400'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            aria-label="Send a parcel"
          >
            <Package className="h-8 w-8" />
            <div className="text-left">
              <div className="text-lg">Send Parcel</div>
              <div className="text-sm opacity-90">Deliver packages & items</div>
            </div>
          </Button>

          <Button
            onClick={() => handleServiceClick('shops', 'Shops')}
            className={`h-20 flex items-center justify-start gap-4 ${
              highContrast
                ? 'bg-green-900 hover:bg-green-800 text-white border-2 border-green-400'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            aria-label="Browse shops"
          >
            <ShoppingBag className="h-8 w-8" />
            <div className="text-left">
              <div className="text-lg">Shops</div>
              <div className="text-sm opacity-90">Order from nearby stores</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Voice Hint */}
      {voiceEnabled && (
        <div className={`flex items-center gap-2 p-3 rounded-lg ${
          highContrast ? 'bg-green-900 text-white' : 'bg-green-50 text-green-800'
        }`}>
          <Volume2 className="h-5 w-5" />
          <p className="text-sm">Voice guidance is active</p>
        </div>
      )}
    </div>
  );
}