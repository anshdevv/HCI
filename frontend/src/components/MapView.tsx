import { MapPin } from 'lucide-react';
import { Location } from '../App';
// 1. Import the image so the bundler can find it
// import {mapBg} from './imgs/map2.png'

interface MapViewProps {
  pickupLocation: Location | null;
  dropoffLocation: Location | null;
  highContrast: boolean;
}

export function MapView({ pickupLocation, dropoffLocation, highContrast }: MapViewProps) {
  return (
    <div
      className={`relative h-full w-full ${
        highContrast ? 'bg-gray-900' : 'bg-gray-100'
      }`}
      role="img"
      aria-label="Map showing pickup and drop-off locations"
    >
      {/* Map Background */}
      <div className={`absolute inset-0 ${highContrast ? 'opacity-20' : 'opacity-30'}`}>
         {/* 2. Use the imported variable here */}
         <img 
           src="./imgs/map2.png"
           alt="Map Background" 
           className="h-full w-full object-cover" 
         />
      </div>

      {/* Map Label */}
      <div className={`absolute top-4 left-4 px-3 py-1 rounded-md ${
        highContrast ? 'bg-green-900 text-white' : 'bg-white text-gray-700'
      } shadow-md`}>
        <p className="text-sm">Map View</p>
      </div>

      {/* Pickup Marker */}
      {pickupLocation && (
        <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
          <div className={`relative ${highContrast ? 'text-green-400' : 'text-green-600'}`}>
            <MapPin className="h-10 w-10 fill-current" />
            <div className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded text-xs ${
              highContrast ? 'bg-green-900 text-white' : 'bg-white text-gray-900'
            } shadow-md`}>
              Pickup
            </div>
          </div>
        </div>
      )}

      {/* Dropoff Marker */}
      {dropoffLocation && (
        <div className="absolute bottom-1/3 right-1/3 transform translate-x-1/2 translate-y-1/2">
          <div className={`relative ${highContrast ? 'text-green-400' : 'text-green-600'}`}>
            <MapPin className="h-10 w-10 fill-current" />
            <div className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded text-xs ${
              highContrast ? 'bg-green-900 text-white' : 'bg-white text-gray-900'
            } shadow-md`}>
              Drop-off
            </div>
          </div>
        </div>
      )}

      {/* Route Line */}
      {pickupLocation && dropoffLocation && (
        <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
          <line
            x1="33%"
            y1="33%"
            x2="66%"
            y2="66%"
            stroke={highContrast ? '#22c55e' : '#16a34a'}
            strokeWidth="3"
            strokeDasharray="10,5"
          />
        </svg>
      )}

      {/* No locations message */}
      {!pickupLocation && !dropoffLocation && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
            Enter locations to view route
          </p>
        </div>
      )}
    </div>
  );
}