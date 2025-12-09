import { MapPin } from 'lucide-react';
import { Location } from '../App';
import { getTranslation } from '../translations';
import { getColorClasses, getIconTextClass, getBorderClass } from '../utils/colorScheme';

interface MapViewProps {
  pickupLocation: Location | null;
  dropoffLocation: Location | null;
  highContrast: boolean;
  language?: 'en' | 'ur';
  colorScheme?: 'green' | 'blue' | 'purple';
}

export function MapView({
  pickupLocation,
  dropoffLocation,
  highContrast,
  language = 'en',
  colorScheme = 'green',
}: MapViewProps) {
  const t = (key: any) => getTranslation(key, language);
  const colors = getColorClasses(colorScheme, highContrast);
  const iconText = getIconTextClass(colorScheme, highContrast);
  const borderClass = getBorderClass(colorScheme, highContrast);
  const accentHex = {
    green: '#22c55e',
    blue: '#2563eb',
    purple: '#9333ea',
  }[colorScheme];
  const accentBgClass = iconText.replace('text-', 'bg-');
  
  return (
    <div
      className={`relative h-full w-full overflow-auto touch-pan-x touch-pan-y overscroll-contain scroll-smooth ${
        highContrast ? 'bg-gray-900' : 'bg-gray-100'
      }`}
      style={{
        WebkitOverflowScrolling: 'touch',
      }}
      role="img"
      aria-label={t('interactiveMap')}
    >
      {/* Scrollable Map Container */}
      <div className="min-w-[200%] min-h-[200%] relative">
        {/* Map Background - Enhanced grid pattern */}
        <div className={`absolute inset-0 ${highContrast ? 'opacity-20' : 'opacity-30'}`}>
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke={highContrast ? accentHex : '#9ca3af'}
                  strokeWidth="1"
                />
              </pattern>
              <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill={highContrast ? accentHex : '#9ca3af'} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <rect width="100%" height="100%" fill="url(#dots)" opacity="0.3" />
          </svg>
        </div>

        {/* Simulated Roads */}
        <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
          {/* Horizontal Roads */}
          <line x1="0" y1="33%" x2="100%" y2="33%" stroke={highContrast ? '#374151' : '#d1d5db'} strokeWidth="4" />
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke={highContrast ? '#374151' : '#d1d5db'} strokeWidth="6" />
          <line x1="0" y1="66%" x2="100%" y2="66%" stroke={highContrast ? '#374151' : '#d1d5db'} strokeWidth="4" />
          
          {/* Vertical Roads */}
          <line x1="33%" y1="0" x2="33%" y2="100%" stroke={highContrast ? '#374151' : '#d1d5db'} strokeWidth="4" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke={highContrast ? '#374151' : '#d1d5db'} strokeWidth="6" />
          <line x1="66%" y1="0" x2="66%" y2="100%" stroke={highContrast ? '#374151' : '#d1d5db'} strokeWidth="4" />
        </svg>

        {/* Simulated Buildings/Blocks */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-lg ${
                highContrast ? 'bg-gray-800' : 'bg-gray-200'
              }`}
              style={{
                left: `${15 + (i % 3) * 28}%`,
                top: `${20 + Math.floor(i / 3) * 25}%`,
                width: '12%',
                height: '15%',
                opacity: 0.5,
              }}
            />
          ))}
        </div>

        {/* Map Label */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-md ${
          highContrast ? `${colors.primary} text-white ${borderClass}` : 'bg-white text-gray-700'
        } shadow-lg backdrop-blur-sm`}>
          <p className="text-sm">📍 {t('interactiveMap')}</p>
        </div>

        {/* Pickup Marker with enhanced styling */}
        {pickupLocation && (
          <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 animate-bounce-slow">
            <div className="relative">
              {/* Pulsing circle background */}
              <div className={`absolute inset-0 rounded-full ${
                accentBgClass
              } opacity-20 animate-ping`} style={{ width: '60px', height: '60px', top: '-10px', left: '-10px' }} />
              
              {/* Main marker */}
              <div className={`relative ${iconText} drop-shadow-2xl`}>
                <MapPin className="h-12 w-12 fill-current drop-shadow-lg" />
              </div>
              
              {/* Label */}
              <div className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
                highContrast ? `${colors.primary} text-white border-2 ${borderClass}` : 'bg-white text-gray-900 shadow-lg'
              }`}>
                🚀 {t('pickup')}
              </div>
            </div>
          </div>
        )}

        {/* Dropoff Marker with enhanced styling */}
        {dropoffLocation && (
          <div className="absolute bottom-1/3 right-1/3 transform translate-x-1/2 translate-y-1/2 animate-bounce-slow" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              {/* Pulsing circle background */}
              <div className={`absolute inset-0 rounded-full ${
                accentBgClass
              } opacity-20 animate-ping`} style={{ width: '60px', height: '60px', top: '-10px', left: '-10px', animationDelay: '0.2s' }} />
              
              {/* Main marker */}
              <div className={`relative ${iconText} drop-shadow-2xl`}>
                <MapPin className="h-12 w-12 fill-current drop-shadow-lg" />
              </div>
              
              {/* Label */}
              <div className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
                highContrast ? `${colors.primary} text-white border-2 ${borderClass}` : 'bg-white text-gray-900 shadow-lg'
              }`}>
                🎯 {t('dropoff')}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Route Line */}
        {pickupLocation && dropoffLocation && (
          <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={accentHex} stopOpacity="0.8" />
                <stop offset="100%" stopColor={accentHex} stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <line
              x1="33%"
              y1="33%"
              x2="66%"
              y2="66%"
              stroke="url(#routeGradient)"
              strokeWidth="4"
              strokeDasharray="10,5"
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* No locations message */}
        {!pickupLocation && !dropoffLocation && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-center p-6 rounded-lg ${
              highContrast ? 'bg-gray-800 border-2 border-gray-700' : 'bg-white shadow-lg'
            }`}>
              <p className={`text-lg ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                📍 {t('enterLocations')}
              </p>
              <p className={`text-sm mt-2 ${highContrast ? 'text-gray-500' : 'text-gray-400'}`}>
                {t('scrollMap')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}