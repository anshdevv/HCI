import { X, Volume2, Eye, Type, Languages, Palette, Minus, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Card } from './ui/card';
import { AppSettings } from '../App';
import { getTranslation } from '../translations';

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
  const t = (key: any) => getTranslation(key, settings.language);

  const handleToggleHighContrast = () => {
    const newSettings = { ...settings, highContrast: !settings.highContrast };
    onSettingsChange(newSettings);
    
    if ('speechSynthesis' in window && settings.voiceEnabled) {
      const utterance = new SpeechSynthesisUtterance(
        `${t('highContrast')} ${!settings.highContrast ? t('enabled') : t('disabled')}`
      );
      utterance.lang = settings.language === 'ur' ? 'ur-PK' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleToggleVoice = () => {
    const newSettings = { ...settings, voiceEnabled: !settings.voiceEnabled };
    onSettingsChange(newSettings);
    
    if ('speechSynthesis' in window && !settings.voiceEnabled) {
      const utterance = new SpeechSynthesisUtterance(`${t('voiceGuidance')} ${t('enabled')}`);
      utterance.lang = settings.language === 'ur' ? 'ur-PK' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleLanguageChange = (language: 'en' | 'ur') => {
    const newSettings = { ...settings, language };
    onSettingsChange(newSettings);
    
    if ('speechSynthesis' in window && settings.voiceEnabled) {
      const langName = language === 'en' ? 'English' : 'اردو';
      const utterance = new SpeechSynthesisUtterance(`${langName}`);
      utterance.lang = language === 'ur' ? 'ur-PK' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const getFontSizeLabel = () => {
    if (settings.fontSize <= 14) return t('small');
    if (settings.fontSize <= 18) return t('medium');
    if (settings.fontSize <= 22) return t('large');
    return t('extraLarge');
  };

  const updateFontSize = (delta: number) => {
    const nextSize = Math.min(28, Math.max(12, settings.fontSize + delta));
    const newSettings = { ...settings, fontSize: nextSize };
    onSettingsChange(newSettings);
    document.documentElement.style.setProperty('--font-size', `${nextSize}px`);
  };

  return (
    <div className={`fixed inset-0 z-50 ${settings.highContrast ? 'bg-black/90' : 'bg-black/50'}`}>
      <div className={`absolute right-0 top-0 h-full w-full max-w-md shadow-2xl overflow-y-auto ${
        settings.highContrast ? 'bg-black border-l-2 border-green-400' : 'bg-white'
      }`} style={{ direction: settings.language === 'ur' ? 'rtl' : 'ltr' }}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          settings.highContrast ? 'border-green-400' : 'border-gray-200'
        }`}>
          <h2 className="text-xl">{t('accessibilitySettings')}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className={settings.highContrast ? 'text-green-400 hover:bg-gray-900' : ''}
            aria-label={t('close')}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Settings Content */}
        <div className="p-4 space-y-4">
          {/* Language Selection */}
          <Card className={`p-4 ${settings.highContrast ? 'bg-gray-900 border-green-400' : ''}`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                settings.highContrast ? 'bg-green-900' : 'bg-green-100'
              }`}>
                <Languages className={`h-6 w-6 ${settings.highContrast ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg mb-2">{t('language')}</h3>
                <p className="text-sm opacity-70 mb-3">
                  {t('languageDesc')}
                </p>
                
                {/* Language Toggle Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`p-3 rounded-lg transition-all duration-300 ${
                      settings.language === 'en'
                        ? settings.highContrast
                          ? 'bg-green-900 border-2 border-green-400'
                          : 'bg-green-600 text-white'
                        : settings.highContrast
                        ? 'bg-gray-800 border border-gray-700'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageChange('ur')}
                    className={`p-3 rounded-lg transition-all duration-300 ${
                      settings.language === 'ur'
                        ? settings.highContrast
                          ? 'bg-green-900 border-2 border-green-400'
                          : 'bg-green-600 text-white'
                        : settings.highContrast
                        ? 'bg-gray-800 border border-gray-700'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    اردو
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Font Size Controls */}
          <Card className={`p-4 ${settings.highContrast ? 'bg-gray-900 border-green-400' : ''}`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                settings.highContrast ? 'bg-green-900' : 'bg-green-100'
              }`}>
                <Type className={`h-6 w-6 ${settings.highContrast ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg">{t('fontSize')}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    settings.highContrast ? 'bg-green-900 border border-green-400' : 'bg-green-100 text-green-800'
                  }`}>
                    {getFontSizeLabel()}
                  </span>
                </div>
                <p className="text-sm opacity-70 mb-4">
                  {t('fontSizeDesc')}
                </p>
                
                {/* Font Size Buttons */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateFontSize(-2)}
                      className={settings.highContrast ? 'border-green-400 text-green-400' : ''}
                      aria-label="Decrease font size"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className={`flex-1 text-center py-2 rounded-lg ${settings.highContrast ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'}`}>
                      {settings.fontSize}px
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateFontSize(2)}
                      className={settings.highContrast ? 'border-green-400 text-green-400' : ''}
                      aria-label="Increase font size"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Preview Text */}
                  <div className={`p-3 rounded-lg ${
                    settings.highContrast ? 'bg-gray-800' : 'bg-gray-50'
                  }`}>
                    <p style={{ fontSize: `${settings.fontSize}px` }}>
                      {settings.language === 'ur' ? 'یہ ایک نمونہ متن ہے' : 'This is a preview text'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

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
                  <h3 className="text-lg">{t('voiceGuidance')}</h3>
                  <Switch
                    checked={settings.voiceEnabled}
                    onCheckedChange={handleToggleVoice}
                    aria-label={t('voiceGuidance')}
                  />
                </div>
                <p className="text-sm opacity-70">
                  {t('voiceGuidanceDesc')}
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
                  <h3 className="text-lg">{t('highContrast')}</h3>
                  <Switch
                    checked={settings.highContrast}
                    onCheckedChange={handleToggleHighContrast}
                    aria-label={t('highContrast')}
                  />
                </div>
                <p className="text-sm opacity-70">
                  {t('highContrastDesc')}
                </p>
              </div>
            </div>
          </Card>

          {/* Color Blind Info */}
          <Card className={`p-4 ${settings.highContrast ? 'bg-gray-900 border-green-400' : ''}`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                settings.highContrast ? 'bg-green-900' : 'bg-green-100'
              }`}>
                <Palette className={`h-6 w-6 ${settings.highContrast ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg mb-2">{t('colorScheme')}</h3>
                <p className="text-sm opacity-70 mb-3">
                  Choose a color mood that is comfortable for you
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {['emerald', 'indigo'].map((scheme) => (
                    <button
                      key={scheme}
                      onClick={() => onSettingsChange({ ...settings, colorScheme: scheme as any })}
                      className={`p-3 rounded-lg border transition-all ${
                        settings.colorScheme === scheme
                          ? settings.highContrast
                            ? 'bg-green-900 border-green-400'
                            : 'bg-green-600 text-white'
                          : settings.highContrast
                          ? 'bg-gray-800 border-gray-700'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      {scheme === 'emerald' ? 'Emerald' : 'Indigo'}
                    </button>
                  ))}
                </div>
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
                <h3 className="text-lg mb-2">{t('colorScheme')}</h3>
                <p className="text-sm opacity-70">
                  {t('colorSchemeDesc')}
                </p>
              </div>
            </div>
          </Card>

          {/* Tips */}
          <div className={`p-4 rounded-lg ${
            settings.highContrast ? 'bg-green-900 text-white' : 'bg-green-50 text-green-800'
          }`}>
            <h3 className="mb-2">{t('accessibilityTips')}</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• {t('tip1')}</li>
              <li>• {t('tip2')}</li>
              <li>• {t('tip3')}</li>
              <li>• {t('tip4')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}