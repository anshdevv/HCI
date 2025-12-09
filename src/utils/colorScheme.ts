export type ColorScheme = 'green' | 'blue' | 'purple';

interface ColorClasses {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  primaryContrast: string;
  primaryContrastDark: string;
  bg: string;
  bgDark: string;
  text: string;
  textLight: string;
  border: string;
  borderDark: string;
}

export function getColorClasses(scheme: ColorScheme, highContrast: boolean): ColorClasses {
  const normal = {
    green: {
      primary: 'bg-green-600',
      primaryDark: 'bg-green-700',
      primaryLight: 'bg-green-50',
      primaryContrast: 'bg-green-900',
      primaryContrastDark: 'bg-green-800',
      bg: 'bg-white',
      bgDark: 'bg-green-50',
      text: 'text-green-600',
      textLight: 'text-green-800',
      border: 'border-green-600',
      borderDark: 'border-green-400',
    },
    blue: {
      primary: 'bg-blue-600',
      primaryDark: 'bg-blue-700',
      primaryLight: 'bg-blue-50',
      primaryContrast: 'bg-blue-900',
      primaryContrastDark: 'bg-blue-800',
      bg: 'bg-white',
      bgDark: 'bg-blue-50',
      text: 'text-blue-600',
      textLight: 'text-blue-800',
      border: 'border-blue-600',
      borderDark: 'border-blue-400',
    },
    purple: {
      primary: 'bg-purple-600',
      primaryDark: 'bg-purple-700',
      primaryLight: 'bg-purple-50',
      primaryContrast: 'bg-purple-900',
      primaryContrastDark: 'bg-purple-800',
      bg: 'bg-white',
      bgDark: 'bg-purple-50',
      text: 'text-purple-600',
      textLight: 'text-purple-800',
      border: 'border-purple-600',
      borderDark: 'border-purple-400',
    },
  };

  const contrast = {
    green: {
      primary: 'bg-green-900',
      primaryDark: 'bg-green-800',
      primaryLight: 'bg-green-950',
      primaryContrast: 'bg-black',
      primaryContrastDark: 'bg-green-900',
      bg: 'bg-black',
      bgDark: 'bg-green-900',
      text: 'text-green-400',
      textLight: 'text-green-200',
      border: 'border-green-400',
      borderDark: 'border-green-500',
    },
    blue: {
      primary: 'bg-blue-900',
      primaryDark: 'bg-blue-800',
      primaryLight: 'bg-blue-950',
      primaryContrast: 'bg-black',
      primaryContrastDark: 'bg-blue-900',
      bg: 'bg-black',
      bgDark: 'bg-blue-900',
      text: 'text-blue-400',
      textLight: 'text-blue-200',
      border: 'border-blue-400',
      borderDark: 'border-blue-500',
    },
    purple: {
      primary: 'bg-purple-900',
      primaryDark: 'bg-purple-800',
      primaryLight: 'bg-purple-950',
      primaryContrast: 'bg-black',
      primaryContrastDark: 'bg-purple-900',
      bg: 'bg-black',
      bgDark: 'bg-purple-900',
      text: 'text-purple-400',
      textLight: 'text-purple-200',
      border: 'border-purple-400',
      borderDark: 'border-purple-500',
    },
  };

  return (highContrast ? contrast : normal)[scheme];
}

export function getHeaderClass(scheme: ColorScheme, highContrast: boolean): string {
  const classes = {
    green: highContrast ? 'bg-green-900 border-green-700' : 'bg-green-600',
    blue: highContrast ? 'bg-blue-900 border-blue-700' : 'bg-blue-600',
    purple: highContrast ? 'bg-purple-900 border-purple-700' : 'bg-purple-600',
  };
  return classes[scheme];
}

export function getButtonClass(scheme: ColorScheme, highContrast: boolean): string {
  const classes = {
    green: highContrast 
      ? 'bg-green-900 hover:bg-green-800 border-2 border-green-400' 
      : 'bg-green-600 hover:bg-green-700',
    blue: highContrast 
      ? 'bg-blue-900 hover:bg-blue-800 border-2 border-blue-400' 
      : 'bg-blue-600 hover:bg-blue-700',
    purple: highContrast 
      ? 'bg-purple-900 hover:bg-purple-800 border-2 border-purple-400' 
      : 'bg-purple-600 hover:bg-purple-700',
  };
  return classes[scheme];
}

export function getIconBgClass(scheme: ColorScheme, highContrast: boolean): string {
  const classes = {
    green: highContrast ? 'bg-green-900' : 'bg-green-100',
    blue: highContrast ? 'bg-blue-900' : 'bg-blue-100',
    purple: highContrast ? 'bg-purple-900' : 'bg-purple-100',
  };
  return classes[scheme];
}

export function getIconTextClass(scheme: ColorScheme, highContrast: boolean): string {
  const classes = {
    green: highContrast ? 'text-green-400' : 'text-green-600',
    blue: highContrast ? 'text-blue-400' : 'text-blue-600',
    purple: highContrast ? 'text-purple-400' : 'text-purple-600',
  };
  return classes[scheme];
}

export function getRingClass(scheme: ColorScheme): string {
  const classes = {
    green: 'ring-green-500',
    blue: 'ring-blue-500',
    purple: 'ring-purple-500',
  };
  return classes[scheme];
}

export function getBorderClass(scheme: ColorScheme, highContrast: boolean): string {
  const classes = {
    green: highContrast ? 'border-green-400' : 'border-green-600',
    blue: highContrast ? 'border-blue-400' : 'border-blue-600',
    purple: highContrast ? 'border-purple-400' : 'border-purple-600',
  };
  return classes[scheme];
}

export function getHintBgClass(scheme: ColorScheme, highContrast: boolean): string {
  const classes = {
    green: highContrast ? 'bg-green-900 text-white' : 'bg-green-50 text-green-800',
    blue: highContrast ? 'bg-blue-900 text-white' : 'bg-blue-50 text-blue-800',
    purple: highContrast ? 'bg-purple-900 text-white' : 'bg-purple-50 text-purple-800',
  };
  return classes[scheme];
}
