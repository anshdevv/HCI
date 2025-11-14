import { X, Volume2, Eye, Type } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Card } from './ui/card';
import { AppSettings } from '../App';

interface AccessibilitySettingsProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  onClose: () => void;
}

export function AccessibilitySettings({
  settings,
  onSettingsChange,
  onClose,
}: AccessibilitySettingsProps) {
  const handleToggleHighContrast = () => {
    const newSettings = { ...settings, highContrast: !settings.highContrast };
    onSettingsChange(newSettings);
    
    if ('speechSynthesis' in window && settings.voiceEnabled) {
      const utterance = new SpeechSynthesisUtterance(
        `High contrast mode ${!settings.highContrast ? 'enabled' : 'disabled'}`
      );
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleToggleVoice = () => {
    const newSettings = { ...settings, voiceEnabled: !settings.voiceEnabled };
    onSettingsChange(newSettings);
    
    if ('speechSynthesis' in window && !settings.voiceEnabled) {
      const utterance = new SpeechSynthesisUtterance('Voice guidance enabled');
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${settings.highContrast ? 'bg-black/90' : 'bg-black/50'}`}>
      <div className={`absolute right-0 top-0 h-full w-full max-w-md shadow-2xl ${
        settings.highContrast ? 'bg-black border-l-2 border-green-400' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          settings.highContrast ? 'border-green-400' : 'border-gray-200'
        }`}>
          <h2 className="text-xl">Accessibility Settings</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className={settings.highContrast ? 'text-green-400 hover:bg-gray-900' : ''}
            aria-label="Close settings"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Settings Content */}
        <div className="p-4 space-y-4">
          {/* Voice Guidance */}
          <Card className={`p-4 ${settings.highContrast ? 'bg-gray-900 border-green-400' : ''}`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                settings.highContrast ? 'bg-green-900' : 'bg-green-100'
              }`}>
                <Volume2 className={`h-6 w-6 ${settings.highContrast ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg">Voice Guidance</h3>
                  <Switch
                    checked={settings.voiceEnabled}
                    onCheckedChange={handleToggleVoice}
                    aria-label="Toggle voice guidance"
                  />
                </div>
                <p className="text-sm opacity-70">
                  Hear spoken descriptions of buttons and actions. Perfect for users who cannot read or have difficulty reading.
                </p>
              </div>
            </div>
          </Card>

          {/* High Contrast Mode */}
          <Card className={`p-4 ${settings.highContrast ? 'bg-gray-900 border-green-400' : ''}`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                settings.highContrast ? 'bg-green-900' : 'bg-green-100'
              }`}>
                <Eye className={`h-6 w-6 ${settings.highContrast ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg">High Contrast</h3>
                  <Switch
                    checked={settings.highContrast}
                    onCheckedChange={handleToggleHighContrast}
                    aria-label="Toggle high contrast mode"
                  />
                </div>
                <p className="text-sm opacity-70">
                  Enhanced contrast between text and background for better visibility. Helpful for users with vision issues.
                </p>
              </div>
            </div>
          </Card>

          {/* Font Size Info */}
          <Card className={`p-4 ${settings.highContrast ? 'bg-gray-900 border-green-400' : 'bg-green-50'}`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                settings.highContrast ? 'bg-green-900' : 'bg-green-100'
              }`}>
                <Type className={`h-6 w-6 ${settings.highContrast ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg mb-2">Large Text</h3>
                <p className="text-sm opacity-70">
                  This app uses larger fonts by default to improve readability for elderly users.
                </p>
              </div>
            </div>
          </Card>

          {/* Color Blind Info */}
          <Card className={`p-4 ${settings.highContrast ? 'bg-gray-900 border-green-400' : 'bg-green-50'}`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                settings.highContrast ? 'bg-green-900' : 'bg-green-100'
              }`}>
                <div className={`h-6 w-6 rounded-full ${
                  settings.highContrast ? 'bg-green-400' : 'bg-green-600'
                }`} />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg mb-2">Color Scheme</h3>
                <p className="text-sm opacity-70">
                  Green and white colors are used throughout the app, designed to be accessible for color-blind users.
                </p>
              </div>
            </div>
          </Card>

          {/* Tips */}
          <div className={`p-4 rounded-lg ${
            settings.highContrast ? 'bg-green-900 text-white' : 'bg-green-50 text-green-800'
          }`}>
            <h3 className="mb-2">💡 Accessibility Tips</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Enable voice guidance to hear button descriptions</li>
              <li>• Use high contrast mode in bright sunlight</li>
              <li>• All important information is also shown visually</li>
              <li>• Tap any button to hear what it does (when voice is on)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
