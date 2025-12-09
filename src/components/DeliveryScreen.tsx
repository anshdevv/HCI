import { useState } from 'react';
import { ArrowLeft, Package, Plus, Minus, Volume2, DollarSign, FileText, Box, Smartphone } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Location } from '../App';
import { getButtonClass, getColorClasses, getHintBgClass, getIconBgClass, getIconTextClass, getBorderClass } from '../utils/colorScheme';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface DeliveryScreenProps {
  pickupLocation: Location | null;
  dropoffLocation: Location | null;
  onBack: () => void;
  highContrast: boolean;
  voiceEnabled: boolean;
  colorScheme?: 'green' | 'blue' | 'purple';
}

export function DeliveryScreen({
  pickupLocation,
  dropoffLocation,
  onBack,
  highContrast,
  voiceEnabled,
  colorScheme = 'green',
}: DeliveryScreenProps) {
  const baseFare = 120;
  const [customFare, setCustomFare] = useState(baseFare);
  const [packageDescription, setPackageDescription] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [packageType, setPackageType] = useState('');
  const [codEnabled, setCodEnabled] = useState(false);
  const [codAmount, setCodAmount] = useState(0);

  const packageTypes = [
    { value: 'documents', label: 'Documents', icon: <FileText className="h-5 w-5" /> },
    { value: 'package', label: 'Package', icon: <Box className="h-5 w-5" /> },
    { value: 'fragile', label: 'Fragile Item', icon: <Package className="h-5 w-5" /> },
    { value: 'electronics', label: 'Electronics', icon: <Smartphone className="h-5 w-5" /> },
  ];

  const speak = (text: string) => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };
  const colors = getColorClasses(colorScheme, highContrast);
  const btnClass = getButtonClass(colorScheme, highContrast);
  const iconText = getIconTextClass(colorScheme, highContrast);
  const iconBg = getIconBgClass(colorScheme, highContrast);
  const borderClass = getBorderClass(colorScheme, highContrast);
  const hintClass = getHintBgClass(colorScheme, highContrast);

  const increaseFare = () => {
    const newFare = customFare + 10;
    setCustomFare(newFare);
    speak(`Fare increased to ${newFare} rupees`);
  };

  const decreaseFare = () => {
    const newFare = Math.max(baseFare, customFare - 10);
    setCustomFare(newFare);
    speak(`Fare decreased to ${newFare} rupees`);
  };

  const handlePackageTypeSelect = (value: string) => {
    setPackageType(value);
    const selected = packageTypes.find((p) => p.value === value);
    if (selected) {
      speak(`Package type: ${selected.label}`);
    }
  };

  const handleConfirm = () => {
    speak(`Confirming parcel delivery ${codEnabled ? `with cash on delivery of ${codAmount} rupees` : ''}`);
    alert(
      `Parcel delivery booked for ₹${customFare}${codEnabled ? `\nCOD: ₹${codAmount}` : ''}`
    );
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className={`flex items-center gap-3 p-4 ${highContrast ? `bg-black border-b-2 ${borderClass}` : 'bg-white border-b border-gray-200'}`}>
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className={highContrast ? `${iconText} hover:bg-gray-800` : 'text-gray-700'}
          aria-label="Go back"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-lg">Send Parcel</h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Route Summary - Compact */}
        <Card className={`p-3 ${highContrast ? `${colors.bgDark} ${borderClass}` : colors.primaryLight}`}>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <Package className={`h-4 w-4 ${iconText}`} />
              <p className="truncate">{pickupLocation?.address || 'Not set'}</p>
            </div>
            <div className="flex items-center gap-2">
              <Package className={`h-4 w-4 ${iconText}`} />
              <p className="truncate">{dropoffLocation?.address || 'Not set'}</p>
            </div>
          </div>
        </Card>

        {/* Package Type Selection */}
        <Card className={`p-4 space-y-3 ${highContrast ? `${colors.bgDark} ${borderClass}` : ''}`}>
          <h3 className="text-lg">Package Type</h3>
          <Select value={packageType} onValueChange={handlePackageTypeSelect}>
            <SelectTrigger
              className={`h-12 ${
                highContrast ? `bg-gray-800 ${borderClass} text-white` : ''
              }`}
              onFocus={() => speak('Select package type')}
            >
              <SelectValue placeholder="Select package type" />
            </SelectTrigger>
            <SelectContent>
              {packageTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    {type.icon}
                    <span>{type.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        {/* Package Details */}
        <Card className={`p-4 space-y-4 ${highContrast ? `${colors.bgDark} ${borderClass}` : ''}`}>
          <h3 className="text-lg">Package Details</h3>

          <div className="space-y-2">
            <label htmlFor="package-desc" className="text-sm opacity-70">
              What are you sending?
            </label>
            <Textarea
              id="package-desc"
              placeholder="e.g., Documents, Food, Clothes"
              value={packageDescription}
              onChange={(e) => setPackageDescription(e.target.value)}
              onFocus={() => speak('Enter package description')}
              className={`min-h-20 ${
                highContrast ? `bg-gray-800 ${borderClass} text-white` : ''
              }`}
              aria-label="Package description"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="receiver-phone" className="text-sm opacity-70">
              Receiver's Phone Number
            </label>
            <Input
              id="receiver-phone"
              type="tel"
              placeholder="Enter phone number"
              value={receiverPhone}
              onChange={(e) => setReceiverPhone(e.target.value)}
              onFocus={() => speak('Enter receiver phone number')}
              className={`h-12 ${
                highContrast ? `bg-gray-800 ${borderClass} text-white` : ''
              }`}
              aria-label="Receiver phone number"
            />
          </div>
        </Card>

        {/* Cash on Delivery (COD) */}
        <Card className={`p-4 space-y-3 ${highContrast ? `${colors.bgDark} ${borderClass}` : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg">Cash on Delivery (COD)</h3>
              <p className="text-sm opacity-70">Collect payment from receiver</p>
            </div>
            <Switch
              checked={codEnabled}
              onCheckedChange={(checked) => {
                setCodEnabled(checked);
                speak(checked ? 'Cash on delivery enabled' : 'Cash on delivery disabled');
              }}
              aria-label="Enable cash on delivery"
            />
          </div>

          {codEnabled && (
            <div className="space-y-2">
              <label htmlFor="cod-amount" className="text-sm opacity-70">
                Amount to Collect
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xl">₹</span>
                <Input
                  id="cod-amount"
                  type="number"
                  value={codAmount}
                  onChange={(e) => setCodAmount(Number(e.target.value))}
                  onFocus={() => speak('Enter amount to collect from receiver')}
                  className={`h-12 text-xl ${
                    highContrast ? `bg-gray-800 ${borderClass} text-white` : ''
                  }`}
                  aria-label="COD amount"
                />
              </div>
              <p className="text-xs opacity-70">
                The rider will collect this amount from the receiver and return it to you
              </p>
            </div>
          )}
        </Card>

        {/* Fare Section */}
        <Card className={`p-4 space-y-4 ${highContrast ? `${colors.bgDark} ${borderClass}` : ''}`}>
          <div className="flex items-center gap-2">
            <DollarSign className={`h-5 w-5 ${iconText}`} />
            <div className="flex-1">
              <h3 className="text-lg">Delivery Fare</h3>
              <p className="text-sm opacity-70">Expected base fare: ₹{baseFare}</p>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
            highContrast ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm opacity-70">Adjust your offer</p>
              <p className="text-3xl">₹{customFare}</p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={decreaseFare}
                disabled={customFare <= baseFare}
                className={`flex-1 h-14 ${
                  highContrast
                    ? `bg-gray-700 hover:bg-gray-600 text-white ${borderClass}`
                    : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300'
                }`}
                aria-label="Decrease fare by 10 rupees"
              >
                <Minus className="h-6 w-6 mr-2" />
                Decrease ₹10
              </Button>

              <Button
                onClick={increaseFare}
                className={`flex-1 h-14 ${btnClass} text-white`}
                aria-label="Increase fare by 10 rupees"
              >
                <Plus className="h-6 w-6 mr-2" />
                Increase ₹10
              </Button>
            </div>

            <p className="text-xs opacity-70 mt-3 text-center">
              Higher fares may get you a rider faster
            </p>
          </div>
        </Card>

        {/* Delivery Status Preview */}
        <Card className={`p-4 ${highContrast ? `${colors.bgDark} ${borderClass}` : colors.primaryLight}`}>
          <h3 className="text-lg mb-3">You'll receive updates:</h3>
          <div className="space-y-2 text-sm opacity-70">
            <p>✓ When rider accepts your delivery</p>
            <p>✓ When rider picks up the package</p>
            <p>✓ Live tracking during delivery</p>
            <p>✓ When package is delivered</p>
            {codEnabled && <p>✓ COD collection confirmation</p>}
          </div>
        </Card>

        {/* Confirm Button */}
        <Button
          onClick={handleConfirm}
          disabled={!packageDescription || !receiverPhone || !packageType}
          className={`w-full h-14 ${btnClass} text-white`}
          aria-label="Confirm delivery booking"
        >
          Confirm Delivery - ₹{customFare}
        </Button>

        {/* Voice Hint */}
        {voiceEnabled && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${hintClass}`}>
            <Volume2 className="h-5 w-5" />
            <p className="text-sm">Voice guidance is active</p>
          </div>
        )}
      </div>
    </div>
  );
}