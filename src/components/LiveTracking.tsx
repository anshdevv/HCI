import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Phone, MessageSquare, User, Star, Volume2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { BookingDetails } from '../App';
import { getButtonClass, getColorClasses, getHintBgClass, getIconTextClass, getBorderClass } from '../utils/colorScheme';

interface LiveTrackingProps {
  bookingDetails: BookingDetails | null;
  onBack: () => void;
  highContrast: boolean;
  voiceEnabled: boolean;
  colorScheme?: 'green' | 'blue' | 'purple';
}

type DeliveryStatus = 'searching' | 'accepted' | 'arriving' | 'picked_up' | 'in_transit' | 'delivered';

interface DriverInfo {
  name: string;
  rating: number;
  phone: string;
  vehicleNumber: string;
  photo: string;
}

export function LiveTracking({
  bookingDetails,
  onBack,
  highContrast,
  voiceEnabled,
  colorScheme = 'green',
}: LiveTrackingProps) {
  const [status, setStatus] = useState<DeliveryStatus>('searching');
  const [eta, setEta] = useState(5);
  const [driverPosition, setDriverPosition] = useState({ x: 10, y: 10 });
  const colors = getColorClasses(colorScheme, highContrast);
  const iconText = getIconTextClass(colorScheme, highContrast);
  const btnClass = getButtonClass(colorScheme, highContrast);
  const borderClass = getBorderClass(colorScheme, highContrast);
  const hintClass = getHintBgClass(colorScheme, highContrast);
  const accentBgClass = iconText.replace('text-', 'bg-');

  const driverInfo: DriverInfo = {
    name: 'Ahmed Khan',
    rating: 4.8,
    phone: '+92 300 1234567',
    vehicleNumber: 'ABC-123',
    photo: '👤',
  };

  const speak = (text: string) => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    // Simulate status changes
    const statusTimeline: DeliveryStatus[] = [
      'searching',
      'accepted',
      'arriving',
      'picked_up',
      'in_transit',
      'delivered',
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < statusTimeline.length - 1) {
        currentIndex++;
        setStatus(statusTimeline[currentIndex]);
        
        const statusMessages: { [key in DeliveryStatus]: string } = {
          searching: 'Searching for a rider',
          accepted: 'Rider accepted your request',
          arriving: 'Rider is arriving at pickup location',
          picked_up: bookingDetails?.type === 'delivery' ? 'Package picked up' : 'Rider has arrived',
          in_transit: bookingDetails?.type === 'delivery' ? 'Package is on the way' : 'Trip started',
          delivered: bookingDetails?.type === 'delivery' ? 'Package delivered' : 'Trip completed',
        };
        
        speak(statusMessages[statusTimeline[currentIndex]]);
      }
    }, 5000); // Change status every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Simulate driver movement
    const moveInterval = setInterval(() => {
      setDriverPosition((prev) => ({
        x: Math.min(90, prev.x + 2),
        y: Math.min(90, prev.y + 2),
      }));
      
      setEta((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(moveInterval);
  }, []);

  const getStatusMessage = () => {
    const messages: { [key in DeliveryStatus]: string } = {
      searching: 'Finding the best rider for you...',
      accepted: 'Rider accepted your request',
      arriving: 'Rider is on the way to pickup',
      picked_up: bookingDetails?.type === 'delivery' ? 'Package picked up' : 'Rider has arrived',
      in_transit: bookingDetails?.type === 'delivery' ? 'Package is on the way' : 'Enjoy your ride',
      delivered: bookingDetails?.type === 'delivery' ? 'Package delivered successfully!' : 'Trip completed',
    };
    return messages[status];
  };

  const getProgressPercentage = () => {
    const statusOrder: DeliveryStatus[] = ['searching', 'accepted', 'arriving', 'picked_up', 'in_transit', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className={highContrast ? `${iconText} hover:bg-gray-800` : 'text-gray-700'}
          aria-label="Go back"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl">Live Tracking</h2>
      </div>

      {/* Status Banner */}
      <Card className={`p-4 ${
        highContrast ? `${colors.primary} ${borderClass} text-white` : colors.primaryLight
      }`}>
        <div className="text-center">
          <p className={`text-lg ${highContrast ? 'text-white' : colors.textLight}`}>
            {getStatusMessage()}
          </p>
          {status !== 'searching' && status !== 'delivered' && (
            <p className="text-sm opacity-70 mt-1">ETA: {eta} minutes</p>
          )}
        </div>
      </Card>

      {/* Progress Bar */}
      <div className={`h-2 rounded-full ${highContrast ? 'bg-gray-800' : 'bg-gray-200'}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${accentBgClass}`}
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>

      {/* Live Map */}
      <Card className={`p-4 ${highContrast ? `${colors.bgDark} ${borderClass}` : ''}`}>
        <div
          className={`relative h-64 rounded-lg overflow-hidden ${
            highContrast ? 'bg-gray-800' : 'bg-gray-100'
          }`}
        >
          {/* Map Grid */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="tracking-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke={highContrast ? '#22c55e' : '#9ca3af'}
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#tracking-grid)" />
            </svg>
          </div>

          {/* Pickup Location */}
          <div className="absolute" style={{ left: '10%', top: '10%' }}>
            <MapPin className={`h-8 w-8 ${iconText} fill-current`} />
          </div>

          {/* Dropoff Location */}
          <div className="absolute" style={{ left: '90%', top: '90%' }}>
            <MapPin className={`h-8 w-8 ${iconText} fill-current`} />
          </div>

          {/* Driver Position */}
          {status !== 'searching' && status !== 'delivered' && (
            <div
              className="absolute transition-all duration-1000"
              style={{ left: `${driverPosition.x}%`, top: `${driverPosition.y}%` }}
            >
              <div className={`relative ${iconText}`}>
                <div className="animate-pulse">
                  <div className="h-6 w-6 rounded-full bg-current flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Route Line */}
          {status !== 'searching' && (
            <svg className="absolute inset-0 pointer-events-none">
              <line
                x1="10%"
                y1="10%"
                x2="90%"
                y2="90%"
                stroke={highContrast ? '#22c55e' : '#16a34a'}
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>
          )}
        </div>
      </Card>

      {/* Driver Info */}
      {status !== 'searching' && (
        <Card className={`p-4 ${highContrast ? `${colors.bgDark} ${borderClass}` : ''}`}>
          <div className="flex items-center gap-4">
            <div className={`h-16 w-16 rounded-full flex items-center justify-center text-3xl ${
              highContrast ? colors.primary : colors.primaryLight
            }`}>
              {driverInfo.photo}
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg">{driverInfo.name}</h3>
              <div className="flex items-center gap-2 text-sm opacity-70">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <span>{driverInfo.rating}</span>
                <span>•</span>
                <span>{driverInfo.vehicleNumber}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => speak('Calling rider')}
                className={highContrast ? borderClass : ''}
                aria-label="Call driver"
              >
                <Phone className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => speak('Opening chat')}
                className={highContrast ? borderClass : ''}
                aria-label="Message driver"
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Booking Details */}
      <Card className={`p-4 ${highContrast ? `${colors.bgDark} ${borderClass}` : 'bg-gray-50'}`}>
        <h3 className="text-lg mb-3">Booking Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="opacity-70">Type</span>
            <span className="capitalize">{bookingDetails?.type}</span>
          </div>
          {bookingDetails?.vehicleType && (
            <div className="flex justify-between">
              <span className="opacity-70">Vehicle</span>
              <span className="capitalize">{bookingDetails.vehicleType}</span>
            </div>
          )}
          {bookingDetails?.packageType && (
            <div className="flex justify-between">
              <span className="opacity-70">Package Type</span>
              <span className="capitalize">{bookingDetails.packageType}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="opacity-70">Fare</span>
            <span>₹{bookingDetails?.fare}</span>
          </div>
          {bookingDetails?.codAmount && (
            <div className="flex justify-between">
              <span className="opacity-70">COD Amount</span>
              <span>₹{bookingDetails.codAmount}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Status Updates */}
      <Card className={`p-4 ${highContrast ? `${colors.bgDark} ${borderClass}` : ''}`}>
        <h3 className="text-lg mb-3">Status Updates</h3>
        <div className="space-y-3">
          <div className={`flex items-start gap-3 ${status === 'searching' ? 'opacity-50' : ''}`}>
            <div className={`mt-1 h-3 w-3 rounded-full ${status === 'searching' ? 'bg-gray-400' : accentBgClass}`} />
            <div className="flex-1">
              <p>Rider Assigned</p>
              <p className="text-sm opacity-70">
                {status === 'searching' ? 'Pending...' : 'Completed'}
              </p>
            </div>
          </div>

          <div className={`flex items-start gap-3 ${['searching', 'accepted'].includes(status) ? 'opacity-50' : ''}`}>
            <div className={`mt-1 h-3 w-3 rounded-full ${['searching', 'accepted'].includes(status) ? 'bg-gray-400' : accentBgClass}`} />
            <div className="flex-1">
              <p>{bookingDetails?.type === 'delivery' ? 'Package Pickup' : 'Rider Arrival'}</p>
              <p className="text-sm opacity-70">
                {['searching', 'accepted'].includes(status) ? 'Pending...' : 'Completed'}
              </p>
            </div>
          </div>

          <div className={`flex items-start gap-3 ${!['in_transit', 'delivered'].includes(status) ? 'opacity-50' : ''}`}>
            <div className={`mt-1 h-3 w-3 rounded-full ${!['in_transit', 'delivered'].includes(status) ? 'bg-gray-400' : accentBgClass}`} />
            <div className="flex-1">
              <p>{bookingDetails?.type === 'delivery' ? 'In Transit' : 'Trip Started'}</p>
              <p className="text-sm opacity-70">
                {!['in_transit', 'delivered'].includes(status) ? 'Pending...' : 'Completed'}
              </p>
            </div>
          </div>

          <div className={`flex items-start gap-3 ${status !== 'delivered' ? 'opacity-50' : ''}`}>
            <div className={`mt-1 h-3 w-3 rounded-full ${status !== 'delivered' ? 'bg-gray-400' : accentBgClass}`} />
            <div className="flex-1">
              <p>{bookingDetails?.type === 'delivery' ? 'Delivered' : 'Trip Completed'}</p>
              <p className="text-sm opacity-70">
                {status !== 'delivered' ? 'Pending...' : 'Completed'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Voice Hint */}
      {voiceEnabled && (
        <div className={`flex items-center gap-2 p-3 rounded-lg ${hintClass}`}>
          <Volume2 className="h-5 w-5" />
          <p className="text-sm">You'll hear updates as status changes</p>
        </div>
      )}
    </div>
  );
}
