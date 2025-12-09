import { useState } from "react";
import { HomeScreen } from "./components/HomeScreen";
import { RideSelection } from "./components/RideSelection";
import { DeliveryScreen } from "./components/DeliveryScreen";
import { ShopsScreen } from "./components/ShopsScreen";
import { AccessibilitySettings } from "./components/AccessibilitySettings";
import { VoiceControl } from "./components/VoiceControl";
import { LiveTracking } from "./components/LiveTracking";
import { Settings } from "lucide-react";
import { Button } from "./components/ui/button";

export type Screen =
  | "home"
  | "ride"
  | "delivery"
  | "shops"
  | "tracking";

export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface AppSettings {
  highContrast: boolean;
  voiceEnabled: boolean;
  language: 'en' | 'ur';
  fontSize: number;
  colorScheme: 'emerald' | 'indigo';
}

export interface BookingDetails {
  type: "ride" | "delivery";
  vehicleType?: string;
  fare: number;
  packageType?: string;
  codAmount?: number;
  scheduledTime?: Date;
}

export default function App() {
  const [currentScreen, setCurrentScreen] =
    useState<Screen>("home");
  const [pickupLocation, setPickupLocation] =
    useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] =
    useState<Location | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    highContrast: false,
    voiceEnabled: false,
    language: 'en',
    fontSize: 16,
    colorScheme: 'emerald',
  });
  const [showSettings, setShowSettings] = useState(false);
  const [bookingDetails, setBookingDetails] =
    useState<BookingDetails | null>(null);
  const [recentLocations, setRecentLocations] = useState<
    Location[]
  >([
    {
      address: "123 Main Street, Downtown",
      lat: 40.7128,
      lng: -74.006,
    },
    {
      address: "Central Park West",
      lat: 40.7829,
      lng: -73.9654,
    },
    { address: "Times Square", lat: 40.758, lng: -73.9855 },
  ]);

  const handleServiceSelect = (
    service: "ride" | "delivery" | "shops",
  ) => {
    setCurrentScreen(service);
  };

  const handleBack = () => {
    setCurrentScreen("home");
  };

  const handleStartTracking = (details: BookingDetails) => {
    setBookingDetails(details);
    setCurrentScreen("tracking");
  };

  const addRecentLocation = (location: Location) => {
    setRecentLocations((prev) => {
      const exists = prev.some(
        (loc) => loc.address === location.address,
      );
      if (exists) return prev;
      return [location, ...prev.slice(0, 4)]; // Keep only 5 recent locations
    });
  };

  return (
    <div
      className={`min-h-screen overflow-x-hidden ${settings.highContrast ? "bg-black text-white" : "bg-white text-gray-900"} theme-${settings.colorScheme}`}
    >
      {/* Header */}
      <header
        className={`${settings.highContrast ? "bg-green-900 border-green-700" : "bg-green-600"} text-white p-4 shadow-md`}
      >
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-2xl">RideAccess</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            className="text-white hover:bg-green-700"
          >
            <Settings className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <AccessibilitySettings
          settings={settings}
          onSettingsChange={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Voice Control */}
      {settings.voiceEnabled && (
        <VoiceControl
          currentScreen={currentScreen}
          onServiceSelect={handleServiceSelect}
          onNavigate={setCurrentScreen}
        />
      )}

      {/* Main Content */}
      <main className="max-w-md mx-auto">
        {currentScreen === "home" && (
          <HomeScreen
            pickupLocation={pickupLocation}
            dropoffLocation={dropoffLocation}
            onPickupChange={setPickupLocation}
            onDropoffChange={setDropoffLocation}
            onServiceSelect={handleServiceSelect}
            highContrast={settings.highContrast}
            voiceEnabled={settings.voiceEnabled}
            language={settings.language}
            fontSize={settings.fontSize}
          />
        )}

        {currentScreen === "ride" && (
          <RideSelection
            pickupLocation={pickupLocation}
            dropoffLocation={dropoffLocation}
            onBack={handleBack}
            highContrast={settings.highContrast}
            voiceEnabled={settings.voiceEnabled}
            onStartTracking={handleStartTracking}
          />
        )}

        {currentScreen === "delivery" && (
          <DeliveryScreen
            pickupLocation={pickupLocation}
            dropoffLocation={dropoffLocation}
            onBack={handleBack}
            highContrast={settings.highContrast}
            voiceEnabled={settings.voiceEnabled}
          />
        )}

        {currentScreen === "shops" && (
          <ShopsScreen
            onBack={handleBack}
            highContrast={settings.highContrast}
            voiceEnabled={settings.voiceEnabled}
          />
        )}

        {currentScreen === "tracking" && (
          <LiveTracking
            bookingDetails={bookingDetails}
            initialStatus="accepted"
            onBack={handleBack}
            highContrast={settings.highContrast}
            voiceEnabled={settings.voiceEnabled}
          />
        )}
      </main>
    </div>
  );
}