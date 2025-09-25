import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Settings, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface ModelOption {
  id: string;
  name: string;
  description: string;
  version: string;
  capabilities: string[];
}

interface ModelSelectorProps {
  selectedModel: ModelOption;
  onModelChange: (model: ModelOption) => void;
  onManageModels: () => void;
}

const availableModels: ModelOption[] = [
  {
    id: "resume-analyst-v1",
    name: "Resume Analyst v1",
    description: "Advanced resume analysis and optimization",
    version: "1.2.4",
    capabilities: ["ATS Optimization", "Skill Analysis", "Format Review"]
  },
  {
    id: "career-advisor-v2",
    name: "Career Advisor v2",
    description: "Strategic career guidance and planning",
    version: "2.0.1",
    capabilities: ["Career Path", "Industry Insights", "Growth Recommendations"]
  },
  {
    id: "job-matcher-v1",
    name: "Job Matcher v1",
    description: "Job recommendation and matching engine",
    version: "1.1.8",
    capabilities: ["Job Matching", "Skill Gap Analysis", "Market Trends"]
  },
  {
    id: "interview-prep-v1",
    name: "Interview Prep v1",
    description: "Interview preparation and practice",
    version: "1.0.5",
    capabilities: ["Mock Interviews", "Question Practice", "Feedback Analysis"]
  }
];

export const ModelSelector = ({ selectedModel, onModelChange, onManageModels }: ModelSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const filteredModels = availableModels.filter(model =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setSearchQuery("");
        triggerRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      // Focus the search input when opening
      setTimeout(() => inputRef.current?.focus(), 50);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, filteredModels.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        break;
      case "Enter":
        event.preventDefault();
        if (filteredModels[focusedIndex]) {
          onModelChange(filteredModels[focusedIndex]);
          setIsOpen(false);
          setSearchQuery("");
        }
        break;
    }
  };

  const handleModelSelect = (model: ModelOption) => {
    onModelChange(model);
    setIsOpen(false);
    setSearchQuery("");
    triggerRef.current?.focus();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        ref={triggerRef}
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Selected model: ${selectedModel.name}`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="w-full justify-between glass glass-hover min-w-[280px]"
      >
        <div className="flex flex-col items-start">
          <span className="font-medium text-sm">{selectedModel.name}</span>
          <span className="text-xs text-muted-foreground">v{selectedModel.version}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <Card className="absolute top-full mt-1 w-full z-50 glass border-primary/30 p-0 min-w-[320px]">
          {/* Search Input */}
          <div className="p-3 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setFocusedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                className="pl-10 glass border-border/50 focus:border-primary/50"
                aria-label="Search available models"
              />
            </div>
          </div>

          {/* Model List */}
          <div className="max-h-80 overflow-y-auto" role="listbox" aria-label="Available models">
            {filteredModels.length > 0 ? (
              filteredModels.map((model, index) => (
                <div
                  key={model.id}
                  role="option"
                  aria-selected={model.id === selectedModel.id}
                  className={`p-3 cursor-pointer transition-colors border-b border-border/20 last:border-b-0 ${
                    index === focusedIndex 
                      ? "bg-primary/10 border-primary/20" 
                      : "hover:bg-muted/20"
                  } ${
                    model.id === selectedModel.id ? "bg-primary/5" : ""
                  }`}
                  onClick={() => handleModelSelect(model)}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-sm">{model.name}</h4>
                        {model.id === selectedModel.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{model.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {model.capabilities.map((capability) => (
                          <span
                            key={capability}
                            className="text-xs px-2 py-1 bg-secondary/20 text-secondary rounded-full"
                          >
                            {capability}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">v{model.version}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No models found matching "{searchQuery}"
              </div>
            )}
          </div>

          {/* Manage Models Button */}
          <div className="p-3 border-t border-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onManageModels();
                setIsOpen(false);
              }}
              className="w-full glass-hover justify-start"
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage Models
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};