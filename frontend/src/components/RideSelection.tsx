import { useState } from 'react';
import { ArrowLeft, Bike, Car, Volume2, DollarSign, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Location } from '../App';

interface RideSelectionProps {
  pickupLocation: Location | null;
  dropoffLocation: Location | null;
  onBack: () => void;
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

interface RiderBid {
  riderId: string;
  riderName: string;
  rating: number;
  bidAmount: number;
  eta: string;
}

export function RideSelection({
  pickupLocation,
  dropoffLocation,
  onBack,
  highContrast,
  voiceEnabled,
}: RideSelectionProps) {
  const [selectedRide, setSelectedRide] = useState<string | null>(null);
  const [customFare, setCustomFare] = useState<number>(0);
  const [isBidding, setIsBidding] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');
  const [riderBids, setRiderBids] = useState<RiderBid[]>([]);
  const [showBids, setShowBids] = useState(false);

  const rideOptions: RideOption[] = [
    {
      id: 'bike',
      name: 'Bike',
      icon: <Bike className="h-10 w-10" />,
      suggestedFare: 50,
      eta: '5 mins',
      capacity: '1 person',
    },
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
    {
      id: 'car',
      name: 'Car',
      icon: <Car className="h-10 w-10" />,
      suggestedFare: 150,
      eta: '10 mins',
      capacity: '4 people',
    },
  ];

  const speak = (text: string) => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRideSelect = (option: RideOption) => {
    setSelectedRide(option.id);
    setCustomFare(option.suggestedFare);
    speak(`${option.name} selected. Suggested fare is ${option.suggestedFare} rupees. Estimated time ${option.eta}`);
  };

  const handleBiddingToggle = () => {
    setIsBidding(!isBidding);
    if (!isBidding) {
      speak('Bidding mode enabled. Set your price to negotiate with riders');
    }
  };

  const handleSubmitBid = () => {
    speak('Searching for riders willing to accept your offer');
    
    // Simulate rider bids after 2 seconds
    setTimeout(() => {
      const mockBids: RiderBid[] = [
        {
          riderId: '1',
          riderName: 'Ahmed Khan',
          rating: 4.8,
          bidAmount: customFare,
          eta: '5 mins',
        },
        {
          riderId: '2',
          riderName: 'Ali Raza',
          rating: 4.5,
          bidAmount: customFare + 10,
          eta: '3 mins',
        },
        {
          riderId: '3',
          riderName: 'Hassan Malik',
          rating: 4.9,
          bidAmount: customFare + 15,
          eta: '7 mins',
        },
      ];
      setRiderBids(mockBids);
      setShowBids(true);
      speak(`${mockBids.length} riders are interested. Check their bids.`);
    }, 2000);
  };

  const handleAcceptBid = (bid: RiderBid) => {
    speak(`Accepting bid from ${bid.riderName} for ${bid.bidAmount} rupees`);
    alert(`Ride confirmed with ${bid.riderName} for ₹${bid.bidAmount}`);
  };

  const handleConfirm = () => {
    const selected = rideOptions.find((r) => r.id === selectedRide);
    if (selected) {
      if (scheduledTime) {
        speak(`Scheduling ${selected.name} for ${scheduledTime}`);
        alert(`${selected.name} scheduled for ${scheduledTime} at ₹${customFare}`);
      } else {
        speak(`Booking ${selected.name} now. Please wait.`);
        alert(`Booking ${selected.name} for ₹${customFare}`);
      }
    }
  };

  const selectedOption = rideOptions.find((r) => r.id === selectedRide);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className={highContrast ? 'text-green-400 hover:bg-gray-800' : 'text-gray-700'}
          aria-label="Go back"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl">Choose Your Ride</h2>
      </div>

      {/* Route Summary */}
      <Card className={`p-4 ${highContrast ? 'bg-gray-900 border-green-400' : 'bg-gray-50'}`}>
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <div className={`mt-1 h-3 w-3 rounded-full ${highContrast ? 'bg-green-400' : 'bg-green-600'}`} />
            <div className="flex-1">
              <p className="text-sm opacity-70">Pickup</p>
              <p>{pickupLocation?.address || 'Not set'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className={`mt-1 h-3 w-3 rounded-full ${highContrast ? 'bg-green-400' : 'bg-green-600'}`} />
            <div className="flex-1">
              <p className="text-sm opacity-70">Drop-off</p>
              <p>{dropoffLocation?.address || 'Not set'}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Ride Options */}
      <div className="space-y-3">
        {rideOptions.map((option) => (
          <Card
            key={option.id}
            className={`p-4 cursor-pointer transition-all ${
              selectedRide === option.id
                ? highContrast
                  ? 'bg-green-900 border-2 border-green-400'
                  : 'bg-green-50 border-2 border-green-600'
                : highContrast
                ? 'bg-gray-900 border-green-400 hover:bg-gray-800'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleRideSelect(option)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleRideSelect(option);
              }
            }}
            aria-label={`${option.name}, suggested fare ${option.suggestedFare} rupees, ${option.eta} away, capacity ${option.capacity}`}
          >
            <div className="flex items-center gap-4">
              <div className={highContrast ? 'text-green-400' : 'text-green-600'}>
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

      {/* Bidding Section */}
      {selectedOption && (
        <Card className={`p-4 space-y-4 ${highContrast ? 'bg-gray-900 border-green-400' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className={`h-5 w-5 ${highContrast ? 'text-green-400' : 'text-green-600'}`} />
              <h3 className="text-lg">Set Your Price</h3>
            </div>
            <Switch
              checked={isBidding}
              onCheckedChange={handleBiddingToggle}
              aria-label="Toggle bidding mode"
            />
          </div>

          {isBidding && (
            <div className="space-y-3">
              <p className="text-sm opacity-70">
                Set your own fare and wait for riders to accept or counter-offer
              </p>
              
              <div className="flex gap-3 items-center">
                <Input
                  type="number"
                  value={customFare}
                  onChange={(e) => setCustomFare(Number(e.target.value))}
                  onFocus={() => speak('Enter your custom fare')}
                  className={`h-12 text-xl ${
                    highContrast ? 'bg-gray-800 border-green-400 text-white' : ''
                  }`}
                  aria-label="Custom fare amount"
                />
                <span className="text-xl">₹</span>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setCustomFare(Math.max(20, customFare - 10))}
                  variant="outline"
                  className="flex-1"
                >
                  -₹10
                </Button>
                <Button
                  onClick={() => setCustomFare(customFare + 10)}
                  variant="outline"
                  className="flex-1"
                >
                  +₹10
                </Button>
              </div>

              <Button
                onClick={handleSubmitBid}
                className={`w-full h-12 ${
                  highContrast
                    ? 'bg-green-900 hover:bg-green-800 text-white border border-green-400'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                Find Riders at ₹{customFare}
              </Button>

              {customFare < selectedOption.suggestedFare && (
                <p className="text-xs opacity-70 text-center">
                  ⚠️ Lower fares may take longer to find a rider
                </p>
              )}
              {customFare > selectedOption.suggestedFare && (
                <p className="text-xs opacity-70 text-center">
                  ✨ Higher fares attract riders faster
                </p>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Rider Bids */}
      {showBids && riderBids.length > 0 && (
        <Card className={`p-4 space-y-3 ${highContrast ? 'bg-gray-900 border-green-400' : ''}`}>
          <h3 className="text-lg">Available Riders</h3>
          {riderBids.map((bid) => (
            <div
              key={bid.riderId}
              className={`p-3 rounded-lg flex items-center justify-between ${
                highContrast ? 'bg-gray-800' : 'bg-gray-50'
              }`}
            >
              <div className="flex-1">
                <p>{bid.riderName}</p>
                <p className="text-sm opacity-70">⭐ {bid.rating} • ETA: {bid.eta}</p>
              </div>
              <div className="text-right flex items-center gap-3">
                <div>
                  <p className="text-xl">₹{bid.bidAmount}</p>
                  {bid.bidAmount > customFare && (
                    <p className="text-xs opacity-70">Counter-offer</p>
                  )}
                </div>
                <Button
                  onClick={() => handleAcceptBid(bid)}
                  size="sm"
                  className={highContrast ? 'bg-green-900 border border-green-400' : 'bg-green-600'}
                >
                  Accept
                </Button>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Schedule Ride */}
      <Card className={`p-4 space-y-3 ${highContrast ? 'bg-gray-900 border-green-400' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className={`h-5 w-5 ${highContrast ? 'text-green-400' : 'text-green-600'}`} />
            <h3 className="text-lg">Schedule for Later</h3>
          </div>
          <Switch
            checked={showSchedule}
            onCheckedChange={setShowSchedule}
            aria-label="Schedule ride"
          />
        </div>

        {showSchedule && (
          <Input
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            onFocus={() => speak('Select date and time for scheduled ride')}
            className={`h-12 ${
              highContrast ? 'bg-gray-800 border-green-400 text-white' : ''
            }`}
            aria-label="Schedule time"
          />
        )}
      </Card>

      {/* Confirm Button */}
      {!isBidding && (
        <Button
          onClick={handleConfirm}
          disabled={!selectedRide}
          className={`w-full h-14 ${
            highContrast
              ? 'bg-green-900 hover:bg-green-800 text-white border-2 border-green-400'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
          aria-label="Confirm booking"
        >
          {scheduledTime ? 'Schedule Ride' : 'Book Now'} - ₹{customFare}
        </Button>
      )}

      {/* Voice Hint */}
      {voiceEnabled && (
        <div className={`flex items-center gap-2 p-3 rounded-lg ${
          highContrast ? 'bg-green-900 text-white' : 'bg-green-50 text-green-800'
        }`}>
          <Volume2 className="h-5 w-5" />
          <p className="text-sm">Tap on options to hear details</p>
        </div>
      )}
    </div>
  );
}
