// RideFinding.tsx
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Star, Volume2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface RideFindingProps {
  rideType: string;
  customFare: number;
  pickupLocation: any | null;
  dropoffLocation: any | null;
  onBack: () => void;
  onBidAccepted: (booking: {
    driverId: string;
    name: string;
    rating: number;
    vehicle: string;
    fare: number;
    eta: string;
    pickupLocation?: any;
    dropoffLocation?: any;
  }) => void;
  highContrast: boolean;
  voiceEnabled: boolean;
}

interface DriverBid {
  id: string;
  name: string;
  rating: number;
  vehicle: string;
  bidAmount: number;
  eta: string;
  photo?: string;
}

const randomNames = ['Ahmed Khan', 'Ali Raza', 'Hassan Malik', 'Sara B', 'Zain Q', 'Mona R', 'Bilal S'];
const randomVehicles = ['Bike - KAR 123', 'Rickshaw - RCK 778', 'Car - ABC 321'];

function randFrom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function RideFinding({
  rideType,
  customFare,
  pickupLocation,
  dropoffLocation,
  onBack,
  onBidAccepted,
  highContrast,
  voiceEnabled,
}: RideFindingProps) {
  const [bids, setBids] = useState<DriverBid[]>([]);
  const [searching, setSearching] = useState(true);
  const indexRef = useRef(0);
  const intervalRef = useRef<number | null>(null);

  const speak = (t: string) => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(t));
    }
  };

  useEffect(() => {
    speak(`Finding ${rideType} drivers near you. Your offer is ${customFare} rupees.`);
    // generate 6 random bids over time
    intervalRef.current = window.setInterval(() => {
      const base = Math.max(10, Math.round(customFare || 50));
      const fluctuation = Math.floor(Math.random() * 31) - 10; // -10 .. +20
      const amount = Math.max(20, base + fluctuation);
      const newBid: DriverBid = {
        id: `${Date.now()}-${indexRef.current}`,
        name: randFrom(randomNames),
        rating: +( (Math.random() * 1.2 + 4.2).toFixed(1) ), // 4.2 - 5.4
        vehicle: randFrom(randomVehicles),
        bidAmount: amount,
        eta: `${Math.floor(Math.random() * 8) + 2} mins`,
        photo: '👤',
      };
      indexRef.current += 1;
      setBids((prev) => [newBid, ...prev]); // newest tiles on top
      speak(`New bid from ${newBid.name} for ${newBid.bidAmount} rupees`);
      // stop after 6 bids
      if (indexRef.current >= 6 && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setSearching(false);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const accept = (driver: DriverBid) => {
    speak(`Accepted ${driver.name}'s bid for ${driver.bidAmount} rupees`);
    onBidAccepted({
      driverId: driver.id,
      name: driver.name,
      rating: driver.rating,
      vehicle: driver.vehicle,
      fare: driver.bidAmount,
      eta: driver.eta,
      pickupLocation,
      dropoffLocation,
    });
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className={highContrast ? 'text-green-400 hover:bg-gray-800' : 'text-gray-700'} aria-label="Go back">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl">Finding Riders</h2>
      </div>

      <Card className={`p-4 ${highContrast ? 'bg-green-900 border-green-400' : 'bg-green-50'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-lg ${highContrast ? 'text-white' : 'text-gray-800'}`}>Finding drivers for {rideType}</p>
            <p className="text-sm opacity-70">Your offer: ₹{customFare}</p>
          </div>
          <div>
            {searching ? <p className="text-sm opacity-70">Searching…</p> : <p className="text-sm opacity-70">Search complete</p>}
          </div>
        </div>
      </Card>

      <div className="flex-1 overflow-y-auto space-y-3">
        {bids.map((b) => (
          <Card key={b.id} className={`p-4 flex items-center justify-between ${highContrast ? 'bg-gray-900' : ''}`}>
            <div className="flex items-center gap-4">
              <div className={`h-16 w-16 rounded-full flex items-center justify-center text-3xl ${highContrast ? 'bg-green-900' : 'bg-green-100'}`}>{b.photo}</div>
              <div>
                <p className="text-lg">{b.name}</p>
                <div className="flex items-center gap-2 text-sm opacity-70">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{b.rating}</span>
                  <span>•</span>
                  <span>{b.eta}</span>
                </div>
                <p className="text-sm opacity-70">{b.vehicle}</p>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-2">
              <p className="text-2xl font-semibold">₹{b.bidAmount}</p>
              <Button size="sm" onClick={() => accept(b)} className={`${highContrast ? 'bg-green-900 border border-green-400' : 'bg-green-600 text-white'}`} aria-label={`Accept ${b.name}`}>
                Accept
              </Button>
            </div>
          </Card>
        ))}

        {bids.length === 0 && (
          <Card className={`p-6 text-center ${highContrast ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <p className="text-sm opacity-70">No bids yet — searching for nearby drivers</p>
          </Card>
        )}
      </div>

      <div className={`flex items-center gap-2 p-3 rounded-lg ${highContrast ? 'bg-green-900 text-white' : 'bg-green-50 text-green-800'}`}>
        <Volume2 className="h-5 w-5" />
        <p className="text-sm">New bids will appear automatically</p>
      </div>
    </div>
  );
}
