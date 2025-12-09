import { MapPin, Package, ShoppingBag, Volume2, Bike, Mic, Navigation, Home, Briefcase, Star, Type } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MapView } from './MapView';
import { Location } from '../App';
import { useState } from 'react';
import { getTranslation } from '../translations';
import { getButtonClass, getColorClasses, getIconBgClass, getIconTextClass, getRingClass, getBorderClass, getHintBgClass } from '../utils/colorScheme';

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
  colorScheme?: 'green' | 'blue' | 'purple';
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
  colorScheme = 'green',
}: HomeScreenProps) {
  const [showLocationPicker, setShowLocationPicker] = useState<'pickup' | 'dropoff' | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textAddress, setTextAddress] = useState('');
  
  const t = (key: any) => getTranslation(key, language);
  const colors = getColorClasses(colorScheme, highContrast);
  const iconBg = getIconBgClass(colorScheme, highContrast);
  const iconText = getIconTextClass(colorScheme, highContrast);
  const btnClass = getButtonClass(colorScheme, highContrast);
  const borderClass = getBorderClass(colorScheme, highContrast);
  const hintClass = getHintBgClass(colorScheme, highContrast);
  const ringClass = getRingClass(colorScheme);

  // Mock recent/frequent locations with icons
  const savedLocations = [
    { 
      address: language === 'ur' ? 'گھر - 123 مین سٹریٹ' : 'Home - 123 Main Street',
      lat: 40.7128, 
      lng: -74.006,
      icon: <Home className="h-6 w-6" />,
      label: t('home'),
    },
    { 
      address: language === 'ur' ? 'دفتر - ڈاؤن ٹاؤن آفس' : 'Work - Downtown Office',
      lat: 40.7829, 
      lng: -73.9654,
      icon: <Briefcase className="h-6 w-6" />,
      label: t('work'),
    },
    { 
      address: language === 'ur' ? 'ہسپتال - سٹی میڈیکل' : 'Hospital - City Medical',
      lat: 40.7580, 
      lng: -73.9855,
      icon: <Star className="h-6 w-6" />,
      label: t('hospital'),
    },
    { 
      address: language === 'ur' ? 'بازار - سینٹرل بازار' : 'Market - Central Bazaar',
      lat: 40.7380, 
      lng: -73.9955,
      icon: <Star className="h-6 w-6" />,
      label: t('market'),
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

  const handleTextInputSubmit = () => {
    if (!textAddress.trim() || !showLocationPicker) return;
    
    const location: Location = {
      address: textAddress,
      lat: 40.7128 + Math.random() * 0.1,
      lng: -74.006 + Math.random() * 0.1,
    };
    
    if (showLocationPicker === 'pickup') {
      onPickupChange(location);
    } else {
      onDropoffChange(location);
    }
    
    speak(`${showLocationPicker === 'pickup' ? t('pickup') : t('dropoff')} ${t('setTo')} ${textAddress}`);
    setTextAddress('');
    setShowTextInput(false);
    setShowLocationPicker(null);
  };

  const handleServiceClick = (service: 'ride' | 'delivery' | 'shops', label: string) => {
    speak(`${label} ${t('selected')}`);
    onServiceSelect(service);
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col overflow-hidden" style={{ direction: language === 'ur' ? 'rtl' : 'ltr' }}>
      {/* Map View */}
      <div className="relative flex-1 overflow-hidden">
        <MapView
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
          highContrast={highContrast}
          language={language}
          colorScheme={colorScheme}
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
              className={`w-full p-4 rounded-xl shadow-2xl backdrop-blur-md transition-all duration-200 ${
                highContrast 
                  ? `bg-gray-900/95 border-2 ${borderClass} text-white` 
                  : 'bg-white/95 border border-gray-200 text-gray-900'
              } ${pickupLocation ? `ring-2 ${ringClass}` : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${iconBg}`}>
                  <MapPin className={`h-6 w-6 ${iconText}`} />
                </div>
                <div className="flex-1 text-left" style={{ textAlign: language === 'ur' ? 'right' : 'left' }}>
                  <p className="text-xs opacity-70">{t('pickupFrom')}</p>
                  <p className="truncate">
                    {pickupLocation?.address || t('tapToSelect')}
                  </p>
                </div>
              </div>
            </button>

            {/* Dropoff Button */}
            <button
              onClick={() => {
                speak(t('selectDropoff'));
                setShowLocationPicker('dropoff');
              }}
              className={`w-full p-4 rounded-xl shadow-2xl backdrop-blur-md transition-all duration-200 ${
                highContrast 
                  ? `bg-gray-900/95 border-2 ${borderClass} text-white` 
                  : 'bg-white/95 border border-gray-200 text-gray-900'
              } ${dropoffLocation ? `ring-2 ${ringClass}` : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${iconBg}`}>
                  <MapPin className={`h-6 w-6 ${iconText}`} />
                </div>
                <div className="flex-1 text-left" style={{ textAlign: language === 'ur' ? 'right' : 'left' }}>
                  <p className="text-xs opacity-70">{t('dropoffAt')}</p>
                  <p className="truncate">
                    {dropoffLocation?.address || t('tapToSelect')}
                  </p>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Location Picker Panel */}
        {showLocationPicker && (
          <div className={`absolute inset-0 z-20 ${
            highContrast ? 'bg-black' : 'bg-white'
          } overflow-y-auto`}>
            <div className="p-4 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <h3>
                  {showLocationPicker === 'pickup' ? t('pickupLocation') : t('dropoffLocation')}
                </h3>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowLocationPicker(null);
                    setShowTextInput(false);
                    setTextAddress('');
                  }}
                  className={highContrast ? iconText : ''}
                >
                  {t('close')}
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleUseCurrentLocation(showLocationPicker)}
                  className={`p-4 rounded-xl transition-all duration-200 shadow-md ${
                    btnClass
                  } text-white`}
                >
                  <div className="flex flex-col items-center gap-2 text-white">
                    <Navigation className="h-8 w-8" />
                    <span className="text-xs text-center">{t('currentLocation')}</span>
                  </div>
                </button>

                <button
                  onClick={() => handleVoiceInput(showLocationPicker)}
                  disabled={isListening}
                  className={`p-4 rounded-xl transition-all duration-200 shadow-md ${
                    btnClass
                  } ${isListening ? 'animate-pulse' : ''} text-white`}
                >
                  <div className="flex flex-col items-center gap-2 text-white">
                    <Mic className="h-8 w-8" />
                    <span className="text-xs text-center">
                      {isListening ? t('listening') : t('speakLocation')}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setShowTextInput(!showTextInput)}
                  className={`p-4 rounded-xl transition-all duration-200 shadow-md ${
                    btnClass
                  } text-white`}
                >
                  <div className="flex flex-col items-center gap-2 text-white">
                    <Type className="h-8 w-8" />
                    <span className="text-xs text-center">{t('typeAddress')}</span>
                  </div>
                </button>
              </div>

              {/* Text Input Section */}
              {showTextInput && (
                <div className="space-y-2">
                  <Input
                    value={textAddress}
                    onChange={(e) => setTextAddress(e.target.value)}
                    placeholder={t('enterAddress')}
                    className={`h-12 ${highContrast ? `bg-gray-800 ${borderClass} text-white` : ''}`}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleTextInputSubmit();
                      }
                    }}
                  />
                  <Button
                    onClick={handleTextInputSubmit}
                    disabled={!textAddress.trim()}
                    className={`w-full ${btnClass} text-white`}
                  >
                    {t('setLocation')}
                  </Button>
                </div>
              )}

              {/* Saved Locations */}
              <div>
                <h4 className="text-sm opacity-70 mb-2">{t('savedPlaces')}</h4>
                <div className="grid grid-cols-2 gap-3">
                  {savedLocations.map((location) => (
                    <button
                      key={location.address}
                      onClick={() => handleSavedLocationSelect(location, showLocationPicker)}
                      className={`p-4 rounded-xl transition-all duration-200 shadow-md ${
                        highContrast
                          ? `bg-gray-900 border-2 ${borderClass} hover:bg-gray-800`
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className={iconText}>
                          {location.icon}
                        </div>
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
      <div className={`p-4 ${highContrast ? `bg-black border-t-2 ${borderClass}` : 'bg-white border-t border-gray-200'} shadow-2xl`}>
        <h2 className={`text-base mb-3 ${highContrast ? 'text-white' : 'text-gray-900'}`}>
          {t('chooseService')}
        </h2>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleServiceClick('ride', t('ride'))}
            disabled={!pickupLocation || !dropoffLocation}
            className={`relative p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-200 shadow-md ${
              `${btnClass} text-white disabled:opacity-50`
            }`}
            aria-label={t('rideLabel')}
          >
            <Bike className="h-8 w-8" />
            <span className="text-sm">{t('ride')}</span>
          </button>

          <button
            onClick={() => handleServiceClick('delivery', t('parcel'))}
            disabled={!pickupLocation || !dropoffLocation}
            className={`relative p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-200 shadow-md ${
              `${btnClass} text-white disabled:opacity-50`
            }`}
            aria-label={t('parcelLabel')}
          >
            <Package className="h-8 w-8" />
            <span className="text-sm">{t('parcel')}</span>
          </button>

          <button
            onClick={() => handleServiceClick('shops', t('shops'))}
            className={`relative p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-200 shadow-md ${
              `${btnClass} text-white`
            }`}
            aria-label={t('shopsLabel')}
          >
            <ShoppingBag className="h-8 w-8" />
            <span className="text-sm">{t('shops')}</span>
          </button>
        </div>

        {/* Voice Hint */}
        {voiceEnabled && (
          <div className={`flex items-center gap-2 p-2 rounded-lg mt-3 ${hintClass}`}>
            <Volume2 className="h-4 w-4" />
            <p className="text-xs">{t('voiceActive')}</p>
          </div>
        )}
      </div>
    </div>
  );
}