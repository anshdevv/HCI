import { useEffect, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from './ui/button';
import { Screen } from '../App';

interface VoiceControlProps {
  currentScreen: Screen;
  onServiceSelect: (service: 'ride' | 'delivery' | 'shops') => void;
  onNavigate: (screen: Screen) => void;
}

export function VoiceControl({
  currentScreen,
  onServiceSelect,
  onNavigate,
}: VoiceControlProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log('Speech recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript.toLowerCase();
      setTranscript(speechResult);
      handleVoiceCommand(speechResult);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  const handleVoiceCommand = (command: string) => {
    const speak = (text: string) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
      }
    };

    if (command.includes('ride') || command.includes('book')) {
      onServiceSelect('ride');
      speak('Opening ride booking');
    } else if (command.includes('delivery') || command.includes('parcel') || command.includes('send')) {
      onServiceSelect('delivery');
      speak('Opening parcel delivery');
    } else if (command.includes('shop') || command.includes('store')) {
      onServiceSelect('shops');
      speak('Opening shops');
    } else if (command.includes('home') || command.includes('back')) {
      onNavigate('home');
      speak('Going to home screen');
    } else {
      speak('Sorry, I did not understand that command. Try saying ride, delivery, or shops.');
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      const utterance = new SpeechSynthesisUtterance('Listening. Say ride, delivery, or shops.');
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={toggleListening}
        size="lg"
        className={`h-16 w-16 rounded-full shadow-lg ${
          isListening
            ? 'bg-red-600 hover:bg-red-700 animate-pulse'
            : 'bg-green-600 hover:bg-green-700'
        } text-white`}
        aria-label={isListening ? 'Stop listening' : 'Start voice control'}
      >
        {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
      </Button>
      
      {transcript && (
        <div className="absolute bottom-20 right-0 bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg max-w-xs">
          <p className="text-sm">You said: "{transcript}"</p>
        </div>
      )}
    </div>
  );
}
