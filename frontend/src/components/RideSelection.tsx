// RideSelection.tsx
import { useState } from 'react';
import { ArrowLeft, Bike, Car, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Location } from '../App';

interface RideSelectionProps {
  pickupLocation: Location | null;
  dropoffLocation: Location | null;
  onBack: () => void;
  onStartFinding: (params: {
    rideType: string;
    customFare: number;
    pickupLocation: Location | null;
    dropoffLocation: Location | null;
  }) => void;
  highContrast: boolean;
  voiceEnabled: boolean;
  colorBlind: boolean; // 🔥 used below
}

interface RideOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  suggestedFare: number;
  eta: string;
  capacity: string;
}

export function RideSelection({
  pickupLocation,
  dropoffLocation,
  onBack,
  onStartFinding,
  highContrast,
  voiceEnabled,
  colorBlind,
}: RideSelectionProps) {
  const [selectedRide, setSelectedRide] = useState<string | null>(null);
  const [customFare, setCustomFare] = useState<number>(0);
  const [isBidding, setIsBidding] = useState(false);

  const rideOptions: RideOption[] = [
    { id: 'bike', name: 'Bike', icon: <Bike className="h-10 w-10" />, suggestedFare: 50, eta: '5 mins', capacity: '1 person' },
    {
      id: 'rickshaw',
      name: 'Rickshaw',
      icon: (
        <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="7" cy="19" r="2" />
          <circle cx="17" cy="19" r="2" />
          <path d="M3 7h3l2 8h8" />
          <path d="M16 7h5l-2 8" />
          <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
        </svg>
      ),
      suggestedFare: 80,
      eta: '8 mins',
      capacity: '2–3 people',
    },
    { id: 'car', name: 'Car', icon: <Car className="h-10 w-10" />, suggestedFare: 150, eta: '10 mins', capacity: '4 people' },
  ];

  const speak = (text: string) => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
  };

  // 🎨 CLASS SWITCHER — ONLY TWO COLORS
  const bgColor = colorBlind ? 'bg-blue' : 'bg-green-600';
  const textColor = colorBlind ? 'blue' : 'text-green-600';

  const handleRideSelect = (option: RideOption) => {
    setSelectedRide(option.id);
    setCustomFare(option.suggestedFare);
    speak(`${option.name} selected. Suggested fare is ${option.suggestedFare} rupees.`);
  };

  const handleStartFinding = () => {
    if (!selectedRide) {
      speak('Please select a ride type first');
      return;
    }
    speak(`Finding ${selectedRide} drivers for ₹${customFare}.`);
    onStartFinding({
      rideType: selectedRide,
      customFare,
      pickupLocation,
      dropoffLocation,
    });
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col overflow-hidden">

      {/* Header */}
      <div className={`flex items-center gap-3 p-4 ${
        highContrast ? 'bg-black border-b-2 border-gray-300' : 'bg-white border-b border-gray-300'
      }`}>
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className={highContrast ? `${colorBlind ? 'blue' : 'text-green-600'} hover:bg-gray-800` : 'text-gray-700'}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-lg">Choose Ride</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {/* Pickup / Dropoff */}
        <Card className={`p-3 ${highContrast ? 'bg-gray-900 border border-gray-300' : 'bg-gray-50'}`}>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${bgColor}`} />
              <p className="truncate">{pickupLocation?.address || 'Pickup not set'}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${bgColor}`} />
              <p className="truncate">{dropoffLocation?.address || 'Dropoff not set'}</p>
            </div>
          </div>
        </Card>

        {/* Ride Options */}
        <div className="space-y-3">
          {rideOptions.map((option) => (
            <Card
              key={option.id}
              onClick={() => handleRideSelect(option)}
              className={`
                p-4 cursor-pointer transition-all
                ${selectedRide === option.id
                  ? highContrast
                    ? `border-2 border-gray-200 ${bgColor} text-white`
                    : `${bgColor} text-white border-2 border-gray-300`
                  : highContrast
                    ? 'bg-gray-900 border border-gray-300 hover:bg-gray-800'
                    : 'hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-center gap-4">
                <div className={colorBlind ? 'blue' : 'text-green-600'}>
                  {option.icon}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg">{option.name}</h3>
                  <p className="text-sm opacity-70">{option.capacity}</p>
                  <p className="text-sm opacity-70">ETA: {option.eta}</p>
                </div>

                <div className="text-right">
                  <p className="text-2xl">₹{option.suggestedFare}</p>
                  <p className="text-xs opacity-70">Suggested</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Set Your Price */}
        <Card className={`p-4 space-y-4 ${highContrast ? 'bg-gray-900 border border-gray-300' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className={`h-5 w-5 ${colorBlind ? 'blue' : 'text-green-600'}`} />
              <h3 className="text-lg">Set Your Price</h3>
            </div>

            <Switch checked={isBidding} onCheckedChange={setIsBidding} />
          </div>

          {isBidding && (
            <div className="space-y-3">
              <p className="text-sm opacity-70">
                Set your fare and wait for drivers to accept or counter-offer.
              </p>

              <div className="flex gap-3 items-center">
                <Input
                  type="number"
                  value={customFare}
                  onChange={(e) => setCustomFare(Number(e.target.value))}
                  className={`h-12 text-xl ${highContrast ? 'bg-gray-800 text-white border border-gray-300' : ''}`}
                />
                <span className="text-xl">₹</span>
              </div>
            </div>
          )}
        </Card>

        {/* Find Riders Button */}
        <Button
          onClick={handleStartFinding}
          disabled={!selectedRide}
          className={`w-full h-14 text-white ${
            colorBlind ? 'bg-blue hover:bg-blue' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          Find Riders – ₹{customFare}
        </Button>

        {/* Tip Box */}
        <Card className={`p-3 ${colorBlind ? 'bg-blue text-white' : 'bg-green-50 text-green-800'}`}>
          <p className="text-sm">Tip: Higher bids get drivers faster.</p>
        </Card>

      </div>
    </div>
  );
}
