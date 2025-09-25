import { useState } from "react";
import { Brain, Home, History, Upload, Users, User, BarChart3, Settings, Info, Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import aiternsLogo from "@/assets/aiterns-logo.png";

interface HeaderProps {
  onToggleSidebar: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onNavigate: (page: string) => void;
  onUploadResume: () => void;
  currentUser?: { name: string; email: string } | null;
}

export const Header = ({ onToggleSidebar, isDarkMode, onToggleTheme, onNavigate, onUploadResume, currentUser }: HeaderProps) => {
  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "history", label: "History", icon: History },
    { id: "upload", label: "Upload Resume", icon: Upload },
    { id: "recruiter", label: "Recruiter", icon: Users },
    { id: "user", label: "User", icon: User },
    { id: "insights", label: "Insights", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "about", label: "About", icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 glass glass-hover border-b" role="banner">
      <div className="container mx-auto px-4 py-3 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="glass-hover p-2 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo and Brand - Centered */}
          <div className="flex items-center space-x-3 absolute left-1/2 transform -translate-x-1/2 lg:relative lg:left-auto lg:transform-none">
            <img 
              src={aiternsLogo} 
              alt="AITERNS Logo" 
              className="h-8 w-8 animate-pulse-glow"
            />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent font-poppins">
              AITERNS
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isHistoryButton = item.id === "history";
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setActiveTab(item.id);
                    if (isHistoryButton) {
                      onToggleSidebar();
                    } else if (item.id === "upload") {
                      onUploadResume();
                    } else {
                      onNavigate(item.id);
                    }
                  }}
                  className={`glass-hover transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    isActive 
                      ? "bg-gradient-primary glow-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-pressed={isActive}
                  aria-label={`Navigate to ${item.label}`}
                >
                  <Icon className="h-4 w-4 mr-2" aria-hidden="true" />
                  {item.id === "user" && currentUser ? currentUser.name : item.label}
                </Button>
              );
            })}
          </nav>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleTheme}
            className="glass-hover p-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-primary" aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5 text-primary" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};