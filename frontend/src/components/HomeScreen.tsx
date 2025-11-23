import {
  MapPin,
  Package,
  ShoppingBag,
  Volume2,
  Bike,
  Clock
} from 'lucide-react';
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
  colorBlind: boolean;
}

// === COLOR HELPERS (MAIN FIX) ===
const color = (cb: boolean, shade: string) =>
  cb ? `blue` : `text-green-${shade}`;

// Only background changes to blue in colorBlind mode
const bg = (cb: boolean, shade: string) =>
  cb ? `bg-blue` : `bg-green`;


const border = (cb: boolean, shade: string) =>
  cb ? `bg-blue` : `border-green-${shade}`;

export function HomeScreen({
  pickupLocation,
  dropoffLocation,
  onPickupChange,
  onDropoffChange,
  onServiceSelect,
  highContrast,
  voiceEnabled,
  colorBlind
}: HomeScreenProps) {
  const [showRecentPickup, setShowRecentPickup] = useState(false);
  const [showRecentDropoff, setShowRecentDropoff] = useState(false);

  const recentLocations: Location[] = [
    { address: '123 Main Street, Downtown', lat: 40.7128, lng: -74.006 },
    { address: 'Central Park West', lat: 40.7829, lng: -73.9654 },
    { address: 'Times Square', lat: 40.758, lng: -73.9855 }
  ];

  const handlePickupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    onPickupChange({
      address,
      lat: 40.7128 + Math.random() * 0.1,
      lng: -74.006 + Math.random() * 0.1
    });
  };

  const handleDropoffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    onDropoffChange({
      address,
      lat: 40.7128 + Math.random() * 0.1,
      lng: -74.006 + Math.random() * 0.1
    });
  };

  const speak = (text: string) => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
  };

  const handleRecentLocationSelect = (
    location: Location,
    type: 'pickup' | 'dropoff'
  ) => {
    if (type === 'pickup') {
      onPickupChange(location);
      setShowRecentPickup(false);
    } else {
      onDropoffChange(location);
      setShowRecentDropoff(false);
    }
    speak(`${type} location set to ${location.address}`);
  };

  const handleServiceClick = (
    service: 'ride' | 'delivery' | 'shops',
    label: string
  ) => {
    speak(`${label} selected`);
    onServiceSelect(service);
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      {/* MAP */}
      <div className="relative flex-1">
        <MapView
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
          highContrast={highContrast}
        />

        {/* LOCATION INPUTS */}
        <div className="absolute top-4 left-4 right-4 space-y-2">
          
          {/* PICKUP */}
          <div className="relative">
            <MapPin
              className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 z-10 ${
                highContrast ? color(colorBlind, '400') : color(colorBlind, '600')
              }`}
            />

            <Input
              type="text"
              placeholder="Pickup"
              value={pickupLocation?.address || ''}
              onChange={handlePickupChange}
              onFocus={() => speak('Enter pickup location')}
              className={`pl-10 pr-10 h-12 shadow-lg ${
                highContrast
                  ? `bg-gray-900 ${border(colorBlind, '400')} text-white placeholder:text-gray-400`
                  : 'bg-white border-gray-300'
              }`}
            />

            <Clock
              className={`absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 cursor-pointer ${
                highContrast ? color(colorBlind, '400') : color(colorBlind, '600')
              }`}
              onClick={() => setShowRecentPickup(!showRecentPickup)}
            />

            {showRecentPickup && (
              <div
                className={`absolute left-0 top-full mt-1 w-full shadow-lg rounded-lg overflow-hidden z-20 ${
                  highContrast
                    ? `bg-gray-900 border ${border(colorBlind, '400')}`
                    : 'bg-white'
                }`}
              >
                {recentLocations.map((location) => (
                  <div
                    key={location.address}
                    className={`px-4 py-3 cursor-pointer ${
                      highContrast ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleRecentLocationSelect(location, 'pickup')}
                  >
                    <p className="text-sm truncate">{location.address}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DROPOFF */}
          <div className="relative">
            <MapPin
              className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 z-10 ${
                highContrast ? color(colorBlind, '400') : color(colorBlind, '600')
              }`}
            />

            <Input
              type="text"
              placeholder="Drop-off"
              value={dropoffLocation?.address || ''}
              onChange={handleDropoffChange}
              onFocus={() => speak('Enter drop-off location')}
              className={`pl-10 pr-10 h-12 shadow-lg ${
                highContrast
                  ? `bg-gray-900 ${border(colorBlind, '400')} text-white placeholder:text-gray-400`
                  : 'bg-white border-gray-300'
              }`}
            />

            <Clock
              className={`absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 cursor-pointer ${
                highContrast ? color(colorBlind, '400') : color(colorBlind, '600')
              }`}
              onClick={() => setShowRecentDropoff(!showRecentDropoff)}
            />

            {showRecentDropoff && (
              <div
                className={`absolute left-0 top-full mt-1 w-full shadow-lg rounded-lg overflow-hidden z-20 ${
                  highContrast
                    ? `bg-gray-900 border ${border(colorBlind, '400')}`
                    : 'bg-white'
                }`}
              >
                {recentLocations.map((location) => (
                  <div
                    key={location.address}
                    className={`px-4 py-3 cursor-pointer ${
                      highContrast ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }`}
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

      {/* SERVICE BUTTONS */}
{/* SERVICE BUTTONS */}
<div
  className={`p-4 ${
    highContrast
      ? `bg-black border-t-2 border-green-400`
      : 'bg-white border-t border-gray-200'
  } shadow-lg
  relative
  ` }
>
  <h2 className={`text-base mb-3 ${highContrast ? 'text-white' : 'text-gray-900'}`}>
    Choose Service
  </h2>

  <div className="grid grid-cols-3 gap-3">

    {/* RIDE */}
    <button
      onClick={() => handleServiceClick('ride', 'Ride')}
      disabled={!pickupLocation || !dropoffLocation}
      className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${
        highContrast
          ? `${colorBlind ? 'bg-blue hover:bg-blue' : 'bg-green-900 hover:bg-green-800'} text-white border-2 border-green-400 disabled:opacity-50`
          : `${colorBlind ? 'bg-blue hover:bg-blue' : 'bg-green-600 hover:bg-green-700'} text-white disabled:opacity-50`
      }`}
    >
      <Bike className="h-8 w-8" />
      <span className="text-sm">Ride</span>
    </button>

    {/* DELIVERY */}
    <button
      onClick={() => handleServiceClick('delivery', 'Delivery')}
      disabled={!pickupLocation || !dropoffLocation}
      className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${
        highContrast
          ? `${colorBlind ? 'bg-blue hover:bg-blue' : 'bg-green-900 hover:bg-green-800'} text-white border-2 border-green-400 disabled:opacity-50`
          : `${colorBlind ? 'bg-blue hover:bg-blue' : 'bg-green-600 hover:bg-green-700'} text-white disabled:opacity-50`
      }`}
    >
      <Package className="h-8 w-8" />
      <span className="text-sm">Parcel</span>
    </button>

    {/* SHOPS */}
    <button
      onClick={() => handleServiceClick('shops', 'Shops')}
      className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${
        highContrast
          ? `${colorBlind ? 'bg-blue hover:bg-blue' : 'bg-green-900 hover:bg-green-800'} text-white border-2 border-green-400`
          : `${colorBlind ? 'bg-blue hover:bg-blue' : 'bg-green-600 hover:bg-green-700'} text-white`
      }`}
    >
      <ShoppingBag className="h-8 w-8" />
      <span className="text-sm">Shops</span>
    </button>
  </div>

  {/* Voice Active */}
  {voiceEnabled && (
    <div
      className={`flex items-center gap-2 p-2 rounded-lg mt-3 ${
        highContrast
          ? `${colorBlind ? 'bg-blue-900' : 'bg-green-900'} text-white`
          : `${colorBlind ? 'bg-blue-50 text-blue-800' : 'bg-green-50 text-green-800'}`
      }`}
    >
      <Volume2 className="h-4 w-4" />
      <p className="text-xs">Voice active</p>
    </div>
  )}
</div>

    </div>
  );
}
