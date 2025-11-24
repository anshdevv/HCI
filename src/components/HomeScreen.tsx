import { MapPin, Package, ShoppingBag, Volume2, Bike, Clock, Mic, Navigation, Home, Briefcase, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MapView } from './MapView';
import { Location } from '../App';
import { useState } from 'react';
import { Card } from './ui/card';
import { getTranslation } from '../translations';

interface HomeScreenProps {
  pickupLocation: Location | null;
  dropoffLocation: Location | null;
  onPickupChange: (location: Location) => void;
  onDropoffChange: (location: Location) => void;
  onServiceSelect: (service: 'ride' | 'delivery' | 'shops') => void;
  highContrast: boolean;
  voiceEnabled: boolean;
  language?: 'en' | 'ur';
  fontSize?: number;
}

export function HomeScreen({
  pickupLocation,
  dropoffLocation,
  onPickupChange,
  onDropoffChange,
  onServiceSelect,
  highContrast,
  voiceEnabled,
  language = 'en',
  fontSize = 16,
}: HomeScreenProps) {
  const [showLocationPicker, setShowLocationPicker] = useState<'pickup' | 'dropoff' | null>(null);
  const [isListening, setIsListening] = useState(false);
  
  const t = (key: any) => getTranslation(key, language);

  // Mock recent/frequent locations with icons
  const savedLocations = [
    { 
      address: language === 'ur' ? 'گھر - 123 مین سٹریٹ' : 'Home - 123 Main Street',
      lat: 40.7128, 
      lng: -74.006,
      icon: <Home className="h-6 w-6" />,
      label: t('home'),
      emoji: '🏠'
    },
    { 
      address: language === 'ur' ? 'دفتر - ڈاؤن ٹاؤن آفس' : 'Work - Downtown Office',
      lat: 40.7829, 
      lng: -73.9654,
      icon: <Briefcase className="h-6 w-6" />,
      label: t('work'),
      emoji: '💼'
    },
    { 
      address: language === 'ur' ? 'ہسپتال - سٹی میڈیکل' : 'Hospital - City Medical',
      lat: 40.7580, 
      lng: -73.9855,
      icon: <Star className="h-6 w-6" />,
      label: t('hospital'),
      emoji: '🏥'
    },
    { 
      address: language === 'ur' ? 'بازار - سینٹرل بازار' : 'Market - Central Bazaar',
      lat: 40.7380, 
      lng: -73.9955,
      icon: <Star className="h-6 w-6" />,
      label: t('market'),
      emoji: '🛒'
    },
  ];

  const speak = (text: string) => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'ur' ? 'ur-PK' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleUseCurrentLocation = (type: 'pickup' | 'dropoff') => {
    speak(`${t('usingCurrentLocation')} ${type === 'pickup' ? t('pickup') : t('dropoff')}`);
    const location: Location = {
      address: t('currentLocation'),
      lat: 40.7128 + Math.random() * 0.05,
      lng: -74.006 + Math.random() * 0.05,
    };
    
    if (type === 'pickup') {
      onPickupChange(location);
    } else {
      onDropoffChange(location);
    }
    setShowLocationPicker(null);
  };

  const handleVoiceInput = (type: 'pickup' | 'dropoff') => {
    if (!('webkitSpeechRecognition' in window)) {
      speak(t('voiceNotSupported'));
      return;
    }

    setIsListening(true);
    speak(`${t('sayYourLocation')} ${type === 'pickup' ? t('pickup') : t('dropoff')} ${t('pickupLocation').toLowerCase()}`);

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'ur' ? 'ur-PK' : 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const location: Location = {
        address: transcript,
        lat: 40.7128 + Math.random() * 0.1,
        lng: -74.006 + Math.random() * 0.1,
      };
      
      if (type === 'pickup') {
        onPickupChange(location);
      } else {
        onDropoffChange(location);
      }
      
      speak(`${type === 'pickup' ? t('pickup') : t('dropoff')} ${t('setTo')} ${transcript}`);
      setIsListening(false);
      setShowLocationPicker(null);
    };

    recognition.onerror = () => {
      speak(t('couldNotRecognize'));
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSavedLocationSelect = (location: typeof savedLocations[0], type: 'pickup' | 'dropoff') => {
    const loc: Location = {
      address: location.address,
      lat: location.lat,
      lng: location.lng,
    };
    
    if (type === 'pickup') {
      onPickupChange(loc);
    } else {
      onDropoffChange(loc);
    }
    
    speak(`${type === 'pickup' ? t('pickup') : t('dropoff')} ${t('setTo')} ${location.label}`);
    setShowLocationPicker(null);
  };

  const handleServiceClick = (service: 'ride' | 'delivery' | 'shops', label: string) => {
    speak(`${label} ${t('selected')}`);
    onServiceSelect(service);
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col" style={{ direction: language === 'ur' ? 'rtl' : 'ltr' }}>
      {/* Map View */}
      <div className="relative flex-1 overflow-hidden">
        <MapView
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
          highContrast={highContrast}
          language={language}
        />

        {/* Location Selection Cards - Overlaying on map */}
        {!showLocationPicker && (
          <div className="absolute top-4 left-4 right-4 space-y-2">
            {/* Pickup Button */}
            <button
              onClick={() => {
                speak(t('selectPickup'));
                setShowLocationPicker('pickup');
              }}
              className={`w-full p-4 rounded-xl shadow-2xl backdrop-blur-md transition-all duration-300 transform hover:scale-102 active:scale-98 ${
                highContrast 
                  ? 'bg-gray-900/95 border-2 border-green-400 text-white' 
                  : 'bg-white/95 border border-gray-200 text-gray-900'
              } ${pickupLocation ? 'ring-2 ring-green-500' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  highContrast ? 'bg-green-900' : 'bg-green-100'
                }`}>
                  <MapPin className={`h-6 w-6 ${highContrast ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <div className="flex-1 text-left" style={{ textAlign: language === 'ur' ? 'right' : 'left' }}>
                  <p className="text-xs opacity-70">{t('pickupFrom')}</p>
                  <p className="truncate">
                    {pickupLocation?.address || t('tapToSelect')}
                  </p>
                </div>
                {pickupLocation && (
                  <div className="text-2xl">🚀</div>
                )}
              </div>
            </button>

            {/* Dropoff Button */}
            <button
              onClick={() => {
                speak(t('selectDropoff'));
                setShowLocationPicker('dropoff');
              }}
              className={`w-full p-4 rounded-xl shadow-2xl backdrop-blur-md transition-all duration-300 transform hover:scale-102 active:scale-98 ${
                highContrast 
                  ? 'bg-gray-900/95 border-2 border-green-400 text-white' 
                  : 'bg-white/95 border border-gray-200 text-gray-900'
              } ${dropoffLocation ? 'ring-2 ring-green-500' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  highContrast ? 'bg-green-900' : 'bg-green-100'
                }`}>
                  <MapPin className={`h-6 w-6 ${highContrast ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <div className="flex-1 text-left" style={{ textAlign: language === 'ur' ? 'right' : 'left' }}>
                  <p className="text-xs opacity-70">{t('dropoffAt')}</p>
                  <p className="truncate">
                    {dropoffLocation?.address || t('tapToSelect')}
                  </p>
                </div>
                {dropoffLocation && (
                  <div className="text-2xl">🎯</div>
                )}
              </div>
            </button>
          </div>
        )}

        {/* Location Picker Panel */}
        {showLocationPicker && (
          <div className={`absolute inset-0 z-20 ${
            highContrast ? 'bg-black' : 'bg-white'
          } overflow-y-auto touch-pan-y overscroll-contain`}>
            <div className="p-4 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg">
                  {showLocationPicker === 'pickup' ? `🚀 ${t('pickupLocation')}` : `🎯 ${t('dropoffLocation')}`}
                </h3>
                <Button
                  variant="ghost"
                  onClick={() => setShowLocationPicker(null)}
                  className={highContrast ? 'text-green-400' : ''}
                >
                  ✕ {t('close')}
                </Button>
              </div>

              {/* Quick Actions - Large Touch Targets */}
              <div className="grid grid-cols-2 gap-3">
                {/* Current Location */}
                <button
                  onClick={() => handleUseCurrentLocation(showLocationPicker)}
                  className={`group p-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${
                    highContrast
                      ? 'bg-gradient-to-br from-green-900 to-green-800 border-2 border-green-400'
                      : 'bg-gradient-to-br from-green-600 to-green-700'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2 text-white">
                    <div className="relative">
                      <div className="absolute inset-0 blur-lg opacity-50 bg-white" />
                      <Navigation className="h-10 w-10 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <span className="text-sm text-center">{t('currentLocation')}</span>
                  </div>
                </button>

                {/* Voice Input */}
                <button
                  onClick={() => handleVoiceInput(showLocationPicker)}
                  disabled={isListening}
                  className={`group p-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${
                    highContrast
                      ? 'bg-gradient-to-br from-green-900 to-green-800 border-2 border-green-400'
                      : 'bg-gradient-to-br from-green-600 to-green-700'
                  } ${isListening ? 'animate-pulse' : ''}`}
                >
                  <div className="flex flex-col items-center gap-2 text-white">
                    <div className="relative">
                      <div className="absolute inset-0 blur-lg opacity-50 bg-white" />
                      <Mic className={`h-10 w-10 relative z-10 transition-transform duration-300 ${isListening ? 'animate-pulse' : 'group-hover:scale-110'}`} />
                    </div>
                    <span className="text-sm text-center">
                      {isListening ? t('listening') : t('speakLocation')}
                    </span>
                  </div>
                </button>
              </div>

              {/* Saved Locations - Visual Grid */}
              <div>
                <h4 className="text-sm opacity-70 mb-2">📌 {t('savedPlaces')}</h4>
                <div className="grid grid-cols-2 gap-3">
                  {savedLocations.map((location) => (
                    <button
                      key={location.address}
                      onClick={() => handleSavedLocationSelect(location, showLocationPicker)}
                      className={`group p-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${
                        highContrast
                          ? 'bg-gray-900 border-2 border-green-400 hover:bg-gray-800'
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-4xl">{location.emoji}</div>
                        <span className="text-sm text-center">{location.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Service Options - Fixed Bottom */}
      <div className={`p-4 ${highContrast ? 'bg-black border-t-2 border-green-400' : 'bg-white border-t border-gray-200'} shadow-2xl`}>
        <h2 className={`text-base mb-3 ${highContrast ? 'text-white' : 'text-gray-900'}`}>
          {t('chooseService')}
        </h2>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleServiceClick('ride', t('ride'))}
            disabled={!pickupLocation || !dropoffLocation}
            className={`group relative aspect-square rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 active:scale-95 shadow-lg ${
              highContrast
                ? 'bg-gradient-to-br from-green-900 to-green-800 hover:from-green-800 hover:to-green-700 text-white border-2 border-green-400 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:translate-y-0'
                : 'bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white disabled:opacity-50 disabled:hover:scale-100 disabled:hover:translate-y-0 shadow-green-200'
            }`}
            aria-label={t('rideLabel')}
          >
            {/* Icon layer with shadow and glow effect */}
            <div className="relative">
              <div className={`absolute inset-0 blur-lg opacity-50 ${
                highContrast ? 'bg-green-400' : 'bg-white'
              }`} />
              <Bike className="h-10 w-10 relative z-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            </div>
            <span className="text-sm relative z-10">{t('ride')}</span>
            
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-all duration-700" />
            </div>
          </button>

          <button
            onClick={() => handleServiceClick('delivery', t('parcel'))}
            disabled={!pickupLocation || !dropoffLocation}
            className={`group relative aspect-square rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 active:scale-95 shadow-lg ${
              highContrast
                ? 'bg-gradient-to-br from-green-900 to-green-800 hover:from-green-800 hover:to-green-700 text-white border-2 border-green-400 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:translate-y-0'
                : 'bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white disabled:opacity-50 disabled:hover:scale-100 disabled:hover:translate-y-0 shadow-green-200'
            }`}
            aria-label={t('parcelLabel')}
          >
            {/* Icon layer with shadow and glow effect */}
            <div className="relative">
              <div className={`absolute inset-0 blur-lg opacity-50 ${
                highContrast ? 'bg-green-400' : 'bg-white'
              }`} />
              <Package className="h-10 w-10 relative z-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            </div>
            <span className="text-sm relative z-10">{t('parcel')}</span>
            
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-all duration-700" />
            </div>
          </button>

          <button
            onClick={() => handleServiceClick('shops', t('shops'))}
            className={`group relative aspect-square rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 active:scale-95 shadow-lg ${
              highContrast
                ? 'bg-gradient-to-br from-green-900 to-green-800 hover:from-green-800 hover:to-green-700 text-white border-2 border-green-400'
                : 'bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white shadow-green-200'
            }`}
            aria-label={t('shopsLabel')}
          >
            {/* Icon layer with shadow and glow effect */}
            <div className="relative">
              <div className={`absolute inset-0 blur-lg opacity-50 ${
                highContrast ? 'bg-green-400' : 'bg-white'
              }`} />
              <ShoppingBag className="h-10 w-10 relative z-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            </div>
            <span className="text-sm relative z-10">{t('shops')}</span>
            
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-all duration-700" />
            </div>
          </button>
        </div>

        {/* Voice Hint - Compact */}
        {voiceEnabled && (
          <div className={`flex items-center gap-2 p-2 rounded-lg mt-3 ${
            highContrast ? 'bg-green-900 text-white' : 'bg-green-50 text-green-800'
          }`}>
            <Volume2 className="h-4 w-4" />
            <p className="text-xs">{t('voiceActive')}</p>
          </div>
        )}
      </div>
    </div>
  );
}