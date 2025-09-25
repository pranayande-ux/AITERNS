import { useState, useEffect } from "react";
import { Upload, Sparkles, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface HeroSectionProps {
  onTryAiChat: () => void;
  onUploadResume: () => void;
  onFeatureClick: (feature: string) => void;
}

export const HeroSection = ({ onTryAiChat, onUploadResume, onFeatureClick }: HeroSectionProps) => {
  const [currentOrb, setCurrentOrb] = useState(0);

  const features = [
    {
      icon: Upload,
      title: "Upload & Analyze",
      description: "AI-powered resume analysis in seconds"
    },
    {
      icon: Target,
      title: "Smart Matching",
      description: "Find perfect job opportunities for you"
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Track and optimize your career journey"
    },
    {
      icon: Sparkles,
      title: "AI Guidance",
      description: "Personal career coaching powered by AI"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOrb((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-secondary opacity-20"></div>
      
      {/* Floating Orbs - Enhanced */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-float ${
              i % 3 === 0 
                ? "w-24 h-24 opacity-40 bg-gradient-primary" 
                : i % 3 === 1 
                ? "w-32 h-32 opacity-30 bg-gradient-accent" 
                : "w-20 h-20 opacity-35 bg-gradient-secondary"
            }`}
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${20 + (i % 4) * 20}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${6 + (i % 3) * 2}s`,
              filter: "blur(30px)",
              transform: `scale(${0.8 + (i % 3) * 0.3})`,
            }}
          />
        ))}
        
        {/* Additional floating particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-2 h-2 rounded-full bg-primary/40 animate-float"
            style={{
              left: `${5 + (i * 8)}%`,
              top: `${15 + (i % 5) * 18}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + (i % 4)}s`,
              filter: "blur(1px)",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-6xl lg:text-7xl font-bold font-poppins">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Your AI
                </span>
                <br />
                <span className="text-foreground">Career</span>
                <br />
                <span className="bg-gradient-accent bg-clip-text text-transparent">
                  Navigator
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Transform your career journey with AI-powered resume analysis, 
                smart job matching, and personalized guidance. Your future starts here.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={onUploadResume}
                className="bg-gradient-primary hover:scale-105 transition-transform duration-300 glow-primary font-semibold"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Resume
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={onTryAiChat}
                className="glass glass-hover border-primary/30"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Try AI Chat
              </Button>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={index}
                    onClick={() => onFeatureClick(feature.title)}
                    className={`glass glass-hover p-4 transition-all duration-500 cursor-pointer ${
                      currentOrb === index ? "glow-primary scale-105" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{feature.title}</h3>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Right Side - Hero Orb Animation */}
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="hero-orb"></div>
          </div>
        </div>
      </div>
    </section>
  );
};