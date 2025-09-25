import { useState, useEffect } from "react";
import { MessageCircle, Volume2, X, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import aiBotImage from "@/assets/ai-bot-mascot.png";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface AIBotMascotProps {
  onChatToggle: () => void;
}

export const AIBotMascot = ({ onChatToggle }: AIBotMascotProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [ttsEnabled, setTtsEnabled] = useLocalStorage("aiterns-tts-enabled", true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const tips = [
    "💡 Upload your resume for instant AI analysis!",
    "🚀 Get personalized job recommendations",
    "✨ Optimize your resume with AI suggestions",
    "🎯 Track your job application progress",
    "💬 Ask me anything about your career!"
  ];

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(prefersReducedMotion);

    const interval = setInterval(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const speakTip = () => {
    if (ttsEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(tips[currentTip]);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      speechSynthesis.speak(utterance);
    }
  };

  const toggleTTS = () => {
    setTtsEnabled(!ttsEnabled);
    if (!ttsEnabled) {
      speakTip();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 lg:bottom-6 lg:right-6 md:bottom-4 md:right-4 sm:bottom-20 sm:right-4">
      {/* Tooltip */}
      {showTooltip && (
        <Card 
          className={`absolute bottom-24 right-0 p-3 w-64 glass ${reducedMotion ? '' : 'animate-bounce-in'}`}
          role="tooltip"
          aria-live="polite"
        >
          <div className="flex items-start justify-between">
            <p className="text-sm text-foreground pr-2">{tips[currentTip]}</p>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTTS}
                className="p-1 h-6 w-6 focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label={ttsEnabled ? "Disable text-to-speech" : "Enable text-to-speech"}
              >
                {ttsEnabled ? 
                  <Volume2 className="h-3 w-3" aria-hidden="true" /> : 
                  <VolumeX className="h-3 w-3" aria-hidden="true" />
                }
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTooltip(false)}
                className="p-1 h-6 w-6 focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Close tip"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </Button>
            </div>
          </div>
          {/* Arrow */}
          <div className="absolute bottom-[-8px] right-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-border" aria-hidden="true"></div>
        </Card>
      )}

      {/* AI Bot */}
      <button
        className="relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onChatToggle}
        aria-label="Open AI Assistant - get help with your career"
      >
        <div 
          className={`relative w-20 h-20 rounded-full glass p-2 transition-all duration-300 ${
            reducedMotion ? '' : 'animate-float'
          } ${isHovered ? "glow-primary scale-110" : "glow-secondary"}`}
        >
          <img
            src={aiBotImage}
            alt=""
            className="w-full h-full object-contain"
            aria-hidden="true"
          />
          
          {/* Chat indicator */}
          <div 
            className={`absolute -top-1 -right-1 w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center ${
              reducedMotion ? '' : 'animate-pulse-glow'
            }`}
            aria-hidden="true"
          >
            <MessageCircle className="h-3 w-3 text-white" />
          </div>

          {/* Floating particles */}
          {isHovered && !reducedMotion && (
            <>
              <div className="absolute -top-2 -left-2 w-2 h-2 bg-primary rounded-full animate-ping opacity-75" aria-hidden="true"></div>
              <div className="absolute -bottom-1 -right-2 w-1.5 h-1.5 bg-secondary rounded-full animate-ping opacity-75" style={{ animationDelay: "0.5s" }} aria-hidden="true"></div>
              <div className="absolute top-2 -right-3 w-1 h-1 bg-accent rounded-full animate-ping opacity-75" style={{ animationDelay: "1s" }} aria-hidden="true"></div>
            </>
          )}
        </div>

        {/* Ripple effect on hover */}
        {isHovered && !reducedMotion && (
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" aria-hidden="true"></div>
        )}
      </button>
    </div>
  );
};