import { X, Volume2, Eye, Type, Languages, Plus, Minus, Palette } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import { AppSettings } from '../App';
import { getTranslation } from '../translations';
import { getButtonClass, getColorClasses, getHintBgClass, getIconBgClass, getIconTextClass, getBorderClass } from '../utils/colorScheme';

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
  const colors = getColorClasses(settings.colorScheme, settings.highContrast);
  const iconText = getIconTextClass(settings.colorScheme, settings.highContrast);
  const iconBg = getIconBgClass(settings.colorScheme, settings.highContrast);
  const btnClass = getButtonClass(settings.colorScheme, settings.highContrast);
  const borderClass = getBorderClass(settings.colorScheme, settings.highContrast);
  const hintClass = getHintBgClass(settings.colorScheme, settings.highContrast);

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

  const handleFontSizeChange = (value: number[]) => {
    const newSettings = { ...settings, fontSize: value[0] };
    onSettingsChange(newSettings);
    
    // Update CSS variable for font size
    document.documentElement.style.setProperty('--font-size', `${value[0]}px`);
  };

  const increaseFontSize = () => {
    const newSize = Math.min(28, settings.fontSize + 2);
    const newSettings = { ...settings, fontSize: newSize };
    onSettingsChange(newSettings);
    document.documentElement.style.setProperty('--font-size', `${newSize}px`);
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(12, settings.fontSize - 2);
    const newSettings = { ...settings, fontSize: newSize };
    onSettingsChange(newSettings);
    document.documentElement.style.setProperty('--font-size', `${newSize}px`);
  };

  const handleColorSchemeChange = (scheme: 'green' | 'blue' | 'purple') => {
    const newSettings = { ...settings, colorScheme: scheme };
    onSettingsChange(newSettings);
  };

  const getFontSizeLabel = () => {
    if (settings.fontSize <= 14) return t('small');
    if (settings.fontSize <= 18) return t('medium');
    if (settings.fontSize <= 22) return t('large');
    return t('extraLarge');
  };

  return (
    <div className={`fixed inset-0 z-50 ${settings.highContrast ? 'bg-black/90' : 'bg-black/50'}`}>
      <div className={`absolute right-0 top-0 h-full w-full max-w-md shadow-2xl overflow-y-auto ${
        settings.highContrast ? `bg-black border-l-2 ${borderClass}` : 'bg-white'
      }`} style={{ direction: settings.language === 'ur' ? 'rtl' : 'ltr' }}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          settings.highContrast ? borderClass : 'border-gray-200'
        }`}>
          <h2 className="text-xl">{t('accessibilitySettings')}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className={settings.highContrast ? `${iconText} hover:bg-gray-900` : ''}
            aria-label={t('close')}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Settings Content */}
        <div className="p-4 space-y-4">
          {/* Language Selection */}
          <Card className={`p-4 ${settings.highContrast ? `${colors.bgDark} ${borderClass}` : ''}`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${iconBg}`}>
                <Languages className={`h-6 w-6 ${iconText}`} />
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
                          ? `${colors.primary} border-2 ${borderClass}`
                          : `${colors.primary} text-white`
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
                          ? `${colors.primary} border-2 ${borderClass}`
                          : `${colors.primary} text-white`
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

          {/* Font Size */}
          <Card className={`p-4 ${settings.highContrast ? `${colors.bgDark} ${borderClass}` : ''}`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${iconBg}`}>
                <Type className={`h-6 w-6 ${iconText}`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3>{t('fontSize')}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    settings.highContrast ? `${colors.primary} border ${borderClass}` : `${colors.primaryLight} ${colors.textLight}`
                  }`}>
                    {settings.fontSize}px
                  </span>
                </div>
                <p className="text-sm opacity-70 mb-4">
                  {t('fontSizeDesc')}
                </p>
                
                {/* Font Size Controls */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={decreaseFontSize}
                      disabled={settings.fontSize <= 12}
                      variant="outline"
                      size="icon"
                      className={`h-12 w-12 ${
                        settings.highContrast ? borderClass : ''
                      }`}
                    >
                      <Minus className="h-5 w-5" />
                    </Button>
                    
                    <div className="flex-1 text-center">
                      <div className={`p-3 rounded-lg ${
                        settings.highContrast ? 'bg-gray-800' : 'bg-gray-50'
                      }`}>
                        <p style={{ fontSize: `${settings.fontSize}px` }}>
                          {settings.language === 'ur' ? 'نمونہ' : 'Sample'}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      onClick={increaseFontSize}
                      disabled={settings.fontSize >= 28}
                      variant="outline"
                      size="icon"
                      className={`h-12 w-12 ${
                        settings.highContrast ? borderClass : ''
                      }`}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <p className="text-xs text-center opacity-70">
                    {getFontSizeLabel()} (12px - 28px)
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Voice Guidance */}
          <Card className={`p-4 ${settings.highContrast ? `${colors.bgDark} ${borderClass}` : ''}`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${iconBg}`}>
                <Volume2 className={`h-6 w-6 ${iconText}`} />
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
          <Card className={`p-4 ${settings.highContrast ? `${colors.bgDark} ${borderClass}` : ''}`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${iconBg}`}>
                <Eye className={`h-6 w-6 ${iconText}`} />
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

          {/* Color Scheme Selector */}
          <Card className={`p-4 ${settings.highContrast ? `${colors.bgDark} ${borderClass}` : ''}`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${iconBg}`}>
                <Palette className={`h-6 w-6 ${iconText}`} />
              </div>
              
              <div className="flex-1">
                <h3 className="mb-2">{t('colorScheme')}</h3>
                <p className="text-sm opacity-70 mb-3">
                  {t('colorSchemeDesc')}
                </p>
                
                {/* Color Scheme Options */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleColorSchemeChange('green')}
                    className={`p-3 rounded-lg transition-all duration-200 ${
                      settings.colorScheme === 'green'
                        ? `ring-2 ring-offset-2 ${getBorderClass('green', false).replace('border', 'ring')}`
                        : ''
                    } ${settings.highContrast ? 'bg-gray-800' : 'bg-gray-50'}`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-green-600" />
                      <span className="text-xs">Green</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleColorSchemeChange('blue')}
                    className={`p-3 rounded-lg transition-all duration-200 ${
                      settings.colorScheme === 'blue'
                        ? `ring-2 ring-offset-2 ${getBorderClass('blue', false).replace('border', 'ring')}`
                        : ''
                    } ${settings.highContrast ? 'bg-gray-800' : 'bg-gray-50'}`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-600" />
                      <span className="text-xs">Blue</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleColorSchemeChange('purple')}
                    className={`p-3 rounded-lg transition-all duration-200 ${
                      settings.colorScheme === 'purple'
                        ? `ring-2 ring-offset-2 ${getBorderClass('purple', false).replace('border', 'ring')}`
                        : ''
                    } ${settings.highContrast ? 'bg-gray-800' : 'bg-gray-50'}`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-purple-600" />
                      <span className="text-xs">Purple</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Tips */}
          <div className={`p-4 rounded-lg ${hintClass}`}>
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