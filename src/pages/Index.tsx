import { useState, useEffect } from "react";
import { Header } from "@/components/Layout/Header";
import { Sidebar } from "@/components/Layout/Sidebar";
import { HeroSection } from "@/components/Hero/HeroSection";
import { AIBotMascot } from "@/components/AI/AIBotMascot";
import { PopupChat } from "@/components/ui/PopupChat";
import { ProgressTracker } from "@/components/Dashboard/ProgressTracker";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Home from "@/pages/Home";
import Recruiter from "@/pages/Recruiter";
import Insights from "@/pages/Insights";
import Settings from "@/pages/Settings";
import About from "@/pages/About";

interface HistoryItem {
  id: string;
  type: "resume" | "chat";
  title: string;
  timestamp: Date;
  preview?: string;
}

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useLocalStorage("aiterns-dark-mode", true);
  const [currentPage, setCurrentPage] = useState("home");
  const [currentUser] = useState<{ name: string; email: string } | null>({
    name: "John Doe",
    email: "john.doe@example.com"
  });

  useEffect(() => {
    // Apply theme class to document
    document.documentElement.className = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleChat = () => setChatOpen(!chatOpen);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };
  const handleUploadResume = () => {
    setChatOpen(true);
  };
  const handleFeatureClick = (feature: string) => {
    console.log("Feature clicked:", feature);
    setChatOpen(true);
  };

  const handleHistoryItemClick = (item: HistoryItem) => {
    // Handle opening the history item in chat
    console.log("Opening history item:", item);
    setChatOpen(true);
  };

  // Close sidebar when clicking outside on mobile
  const handleMainContentClick = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return <Home />;
      case "recruiter":
        return <Recruiter />;
      case "insights":
        return <Insights />;
      case "settings":
        return <Settings />;
      case "about":
        return <About />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <Header 
        onToggleSidebar={toggleSidebar}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onNavigate={handleNavigate}
        onUploadResume={handleUploadResume}
        currentUser={currentUser}
      />

      {/* Sidebar - Hidden by default */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onHistoryItemClick={handleHistoryItemClick}
      />

      {/* Main Content */}
      <main 
        className="min-h-screen"
        onClick={handleMainContentClick}
      >
        {currentPage === "home" ? (
          <>
            {/* Hero Section */}
            <HeroSection 
              onTryAiChat={toggleChat}
              onUploadResume={handleUploadResume}
              onFeatureClick={handleFeatureClick}
            />

            {/* Dashboard Section */}
            <section className="py-16 relative">
              <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="text-center mb-12">
                      <h2 className="text-4xl font-bold font-poppins mb-4">
                        <span className="bg-gradient-primary bg-clip-text text-transparent">
                          Your Career
                        </span>{" "}
                        <span className="text-foreground">Progress</span>
                      </h2>
                      <p className="text-xl text-muted-foreground">
                        Track your journey to career success
                      </p>
                    </div>
                  </div>
                  <div className="lg:col-span-1">
                    <ProgressTracker />
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          renderCurrentPage()
        )}
      </main>

      {/* AI Bot Mascot */}
      <AIBotMascot onChatToggle={toggleChat} />

      {/* Chat Interface */}
      <PopupChat 
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </div>
  );
};

export default Index;
