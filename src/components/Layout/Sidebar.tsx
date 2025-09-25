import { useState, useEffect } from "react";
import { ChevronRight, Clock, FileText, MessageSquare, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFocusTrap } from "@/hooks/useFocusTrap";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onHistoryItemClick?: (item: HistoryItem) => void;
}

interface HistoryItem {
  id: string;
  type: "resume" | "chat";
  title: string;
  timestamp: Date;
  preview?: string;
}

export const Sidebar = ({ isOpen, onClose, onHistoryItemClick }: SidebarProps) => {
  const [historyItems, setHistoryItems] = useLocalStorage<HistoryItem[]>("aiterns-history", [
    {
      id: "1",
      type: "resume",
      title: "Software Engineer Resume",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      preview: "Frontend Developer with 3 years experience..."
    },
    {
      id: "2",
      type: "chat",
      title: "Resume Optimization Tips",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      preview: "How can I improve my technical skills section?"
    },
    {
      id: "3",
      type: "resume",
      title: "Product Manager CV",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      preview: "Experienced PM with proven track record..."
    },
    {
      id: "4",
      type: "chat",
      title: "Job Market Analysis",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
      preview: "What are the trending skills in tech?"
    },
  ]);

  const focusTrapRef = useFocusTrap(isOpen);

  // Handle escape key and focus management
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Set aria-hidden on main content when sidebar is open
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.setAttribute('aria-hidden', 'true');
      }
    } else {
      // Remove aria-hidden when sidebar is closed
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.removeAttribute('aria-hidden');
      }
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.removeAttribute('aria-hidden');
      }
    };
  }, [isOpen, onClose]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleDeleteItem = (itemId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setHistoryItems(items => items.filter(item => item.id !== itemId));
  };

  const handleClearAll = () => {
    setHistoryItems([]);
  };

  const handleHistoryItemClick = (item: HistoryItem) => {
    onHistoryItemClick?.(item);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={onClose}
          aria-label="Close history panel"
        />
      )}

      {/* Sidebar */}
      <aside
        ref={focusTrapRef}
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } glass border-r`}
        role="complementary"
        aria-label="History panel"
        aria-hidden={!isOpen}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="font-semibold text-lg">History</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="glass-hover focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Close history panel"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          {/* History List */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3" role="list" aria-label="History items">
              {historyItems.length > 0 ? (
                historyItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="glass glass-hover p-3 rounded-lg cursor-pointer group animate-slide-up focus:outline-none focus:ring-2 focus:ring-primary/50"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    role="listitem"
                    tabIndex={0}
                    onClick={() => handleHistoryItemClick(item)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleHistoryItemClick(item);
                      }
                    }}
                    aria-label={`${item.type === 'resume' ? 'Resume' : 'Chat'}: ${item.title}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {item.type === "resume" ? (
                            <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
                          ) : (
                            <MessageSquare className="h-4 w-4 text-secondary" aria-hidden="true" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-foreground truncate">
                            {item.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {item.preview}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatTime(item.timestamp)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 ml-2 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-destructive/50"
                        onClick={(e) => handleDeleteItem(item.id, e)}
                        aria-label={`Delete ${item.title}`}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No history yet</p>
                  <p className="text-xs mt-1">Your resume uploads and chats will appear here</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-border/50">
            <Button
              variant="outline"
              className="w-full glass-hover focus:outline-none focus:ring-2 focus:ring-primary/50"
              size="sm"
              onClick={handleClearAll}
              disabled={historyItems.length === 0}
              aria-label="Clear all history items"
            >
              Clear All History
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};