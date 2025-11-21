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

// === COLOR HELPERS (MAIN FIX) ===
const color = (settings: AppSettings, shade: string) =>
  settings.colorBlind ? `text-blue` : `text-green-${shade}`;

const bg = (settings: AppSettings, shade: string) =>
  settings.colorBlind ? `bg-blue` : `bg-green-${shade}`;

const border = (settings: AppSettings, shade: string) =>
  settings.colorBlind ? `border-blue` : `border-green-${shade}`;

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

  const handleToggleColorBlind = () => {
    const newSettings = { ...settings, colorBlind: !settings.colorBlind };
    onSettingsChange(newSettings);

    if ('speechSynthesis' in window && settings.voiceEnabled) {
      const utterance = new SpeechSynthesisUtterance(
        `Color blind mode ${!settings.colorBlind ? 'enabled' : 'disabled'}`
      );
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${settings.highContrast ? 'bg-black/90' : 'bg-black/50'}`}>
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md shadow-2xl ${
          settings.highContrast
            ? `bg-black border-l-2 ${border(settings, '400')}`
            : 'bg-white'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 border-b ${
            settings.highContrast ? border(settings, '400') : 'border-gray-200'
          }`}
        >
          <h2 className="text-xl">Accessibility Settings</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className={
              settings.highContrast
                ? `${color(settings, '400')} hover:bg-gray-900`
                : ''
            }
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          
          {/* Voice Guidance */}
          <Card className={`p-4 ${settings.highContrast ? `bg-gray-900 ${border(settings, '400')}` : ''}`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${settings.highContrast ? bg(settings, '900') : bg(settings, '100')}`}>
                <Volume2 className={`h-6 w-6 ${settings.highContrast ? color(settings, '400') : color(settings, '600')}`} />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg">Voice Guidance</h3>
                  <Switch checked={settings.voiceEnabled} onCheckedChange={handleToggleVoice} />
                </div>
                <p className="text-sm opacity-70">
                  Hear spoken descriptions of buttons and actions.
                </p>
              </div>
            </div>
          </Card>

          {/* High Contrast */}
          <Card className={`p-4 ${settings.highContrast ? `bg-gray-900 ${border(settings, '400')}` : ''}`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${settings.highContrast ? bg(settings, '900') : bg(settings, '100')}`}>
                <Eye className={`h-6 w-6 ${settings.highContrast ? color(settings, '400') : color(settings, '600')}`} />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg">High Contrast</h3>
                  <Switch checked={settings.highContrast} onCheckedChange={handleToggleHighContrast} />
                </div>
                <p className="text-sm opacity-70">
                  Improved visibility for low-vision users.
                </p>
              </div>
            </div>
          </Card>

          {/* Color Blind Mode */}
          <Card className={`p-4 ${settings.highContrast ? 'bg-gray-900' : ''}`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${bg(settings, '100')}`}>
                <Eye className={`h-6 w-6 ${color(settings, '600')}`} />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg">Color Blind Mode</h3>
                  <Switch checked={settings.colorBlind} onCheckedChange={handleToggleColorBlind} />
                </div>
                <p className="text-sm opacity-70">
                  Replaces all green UI colors with blue for color-blind users.
                </p>
              </div>
            </div>
          </Card>

          {/* Large Text */}
          <Card className={`p-4 ${settings.highContrast ? `bg-gray-900 ${border(settings, '400')}` : bg(settings, '50')}`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${settings.highContrast ? bg(settings, '900') : bg(settings, '100')}`}>
                <Type className={`h-6 w-6 ${settings.highContrast ? color(settings, '400') : color(settings, '600')}`} />
              </div>

              <div className="flex-1">
                <h3 className="text-lg mb-2">Large Text</h3>
                <p className="text-sm opacity-70">
                  Larger fonts help elderly users read comfortably.
                </p>
              </div>
            </div>
          </Card>

          {/* Tips */}
          <div
            className={`p-4 rounded-lg ${
              settings.highContrast ? `${bg(settings, '900')} text-white` : `${bg(settings, '50')} ${color(settings, '800')}`
            }`}
          >
            <h3 className="mb-2">💡 Accessibility Tips</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Enable voice guidance</li>
              <li>• Use high contrast in bright sunlight</li>
              <li>• Visual + audio cues everywhere</li>
              <li>• Tap any button to hear its action</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
