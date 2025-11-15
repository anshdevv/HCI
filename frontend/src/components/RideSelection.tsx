// RideSelection.tsx
import { useState } from 'react';
import { ArrowLeft, Bike, Car, DollarSign, Clock } from 'lucide-react';
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
}: RideSelectionProps) {
  const [selectedRide, setSelectedRide] = useState<string | null>(null);
  const [customFare, setCustomFare] = useState<number>(0);
  const [isBidding, setIsBidding] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');

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
      capacity: '2-3 people',
    },
    { id: 'car', name: 'Car', icon: <Car className="h-10 w-10" />, suggestedFare: 150, eta: '10 mins', capacity: '4 people' },
  ];

  const speak = (text: string) => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
  };

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
      <div className={`flex items-center gap-3 p-4 ${highContrast ? 'bg-black border-b-2 border-green-400' : 'bg-white border-b border-gray-200'}`}>
        <Button variant="ghost" size="icon" onClick={onBack} className={highContrast ? 'text-green-400 hover:bg-gray-800' : 'text-gray-700'} aria-label="Go back">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-lg">Choose Ride</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <Card className={`p-3 ${highContrast ? 'bg-gray-900 border-green-400' : 'bg-gray-50'}`}>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${highContrast ? 'bg-green-400' : 'bg-green-600'}`} />
              <p className="truncate">{pickupLocation?.address || 'Pickup not set'}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${highContrast ? 'bg-green-400' : 'bg-green-600'}`} />
              <p className="truncate">{dropoffLocation?.address || 'Dropoff not set'}</p>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          {rideOptions.map((option) => (
            <Card
              key={option.id}
              className={`p-4 cursor-pointer transition-all ${selectedRide === option.id ? (highContrast ? 'bg-green-900 border-2 border-green-400' : 'bg-green-50 border-2 border-green-600') : highContrast ? 'bg-gray-900 border-green-400 hover:bg-gray-800' : 'hover:bg-gray-50'}`}
              onClick={() => handleRideSelect(option)}
              role="button"
              tabIndex={0}
              aria-label={`${option.name}, suggested fare ${option.suggestedFare} rupees`}
            >
              <div className="flex items-center gap-4">
                <div className={highContrast ? 'text-green-400' : 'text-green-600'}>{option.icon}</div>
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

        <Card className={`p-4 space-y-4 ${highContrast ? 'bg-gray-900 border-green-400' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className={`h-5 w-5 ${highContrast ? 'text-green-400' : 'text-green-600'}`} />
              <h3 className="text-lg">Set Your Price</h3>
            </div>
            <Switch checked={isBidding} onCheckedChange={setIsBidding} aria-label="Toggle bidding mode" />
          </div>

          {isBidding && (
            <div className="space-y-3">
              <p className="text-sm opacity-70">Set your own fare and wait for riders to accept or counter-offer</p>
              <div className="flex gap-3 items-center">
                <Input type="number" value={customFare} onChange={(e) => setCustomFare(Number(e.target.value))} onFocus={() => speak('Enter your custom fare')} className={`h-12 text-xl ${highContrast ? 'bg-gray-800 border-green-400 text-white' : ''}`} aria-label="Custom fare amount" />
                <span className="text-xl">₹</span>
              </div>
            </div>
          )}
        </Card>

        <Button onClick={handleStartFinding} disabled={!selectedRide} className={`w-full h-14 ${highContrast ? 'bg-green-900 hover:bg-green-800 text-white border-2 border-green-400' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
          Find Riders - ₹{customFare || (selectedRide ? rideOptions.find(r => r.id === selectedRide)?.suggestedFare : '')}
        </Button>

        <Card className={`p-3 ${highContrast ? 'bg-green-900 text-white' : 'bg-green-50 text-green-800'}`}>
          <p className="text-sm">Tip: Use bidding to speed up the match — higher offers get drivers faster.</p>
        </Card>
      </div>
    </div>
  );
}
