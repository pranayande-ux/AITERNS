import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Mic, MicOff, FileText, X, RotateCcw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModelSelector } from "@/components/ui/ModelSelector";
import { Progress } from "@/components/ui/progress";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  modelUsed?: string;
}

interface ModelOption {
  id: string;
  name: string;
  description: string;
  version: string;
  capabilities: string[];
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatInterface = ({ isOpen, onClose }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "👋 Hi there! I'm your AI career assistant. Upload your resume or ask me anything about your career journey!",
      timestamp: new Date(),
      modelUsed: "Resume Analyst v1"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelOption>({
    id: "resume-analyst-v1",
    name: "Resume Analyst v1",
    description: "Advanced resume analysis and optimization",
    version: "1.2.4",
    capabilities: ["ATS Optimization", "Skill Analysis", "Format Review"]
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Announce new AI messages to screen readers
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.type === 'ai' && !lastMessage.isTyping && liveRegionRef.current) {
      liveRegionRef.current.textContent = `AI: ${lastMessage.content}`;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim() && !uploadedFile) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: uploadedFile ? `📄 Uploaded: ${uploadedFile.name}` : inputValue,
      timestamp: new Date(),
      modelUsed: selectedModel.name
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    
    // Simulate file upload progress
    if (uploadedFile) {
      setUploadProgress(0);
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setUploadedFile(null);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }

    // Simulate AI typing
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "I'm analyzing your request...",
        timestamp: new Date(),
        isTyping: true,
        modelUsed: selectedModel.name
      };
      setMessages(prev => [...prev, aiMessage]);

      // Replace with actual response
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessage.id 
              ? { ...msg, content: getAIResponse(userMessage.content), isTyping: false }
              : msg
          )
        );
      }, 2000);
    }, 500);
  };

  const getAIResponse = (userInput: string): string => {
    if (userInput.includes("Uploaded:")) {
      return "📊 Great! I've analyzed your resume. Here are my key insights:\n\n✅ Strong technical skills section\n📈 Consider adding more quantified achievements\n🎯 Your experience aligns well with senior roles\n💡 Suggestion: Add a summary section highlighting your unique value proposition\n\nWould you like me to elaborate on any of these points?";
    }
    
    return "That's a great question! Based on current market trends and your background, I'd recommend focusing on developing skills in cloud technologies, particularly AWS or Azure, as they're highly sought after by employers. Would you like specific learning resources or career path suggestions?";
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === "application/pdf" || file.type.includes("document"))) {
      setUploadedFile(file);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.type.includes("document"))) {
      setUploadedFile(file);
      setUploadProgress(0);
    }
  };

  const handleRegenerateResponse = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: "Regenerating response...", isTyping: true }
          : msg
      )
    );

    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, content: getAIResponse("regenerate"), isTyping: false }
            : msg
        )
      );
    }, 1500);
  };

  const handleModelChange = (model: ModelOption) => {
    setSelectedModel(model);
  };

  const handleManageModels = () => {
    // Placeholder for model management
    alert("Model management coming soon!");
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording functionality
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Screen reader live region for announcements */}
      <div
        ref={liveRegionRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-4xl mx-auto px-4 z-40">
        <Card className="glass border-primary/30 animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse" aria-hidden="true"></div>
              <h3 className="font-semibold">AI Career Assistant</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="glass-hover focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Close chat interface"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          {/* Model Selector */}
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">AI Model</label>
            </div>
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={handleModelChange}
              onManageModels={handleManageModels}
            />
          </div>

          {/* Messages */}
          <ScrollArea className="h-80 p-4">
            <div className="space-y-4" role="log" aria-label="Chat messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === "user"
                        ? "bg-gradient-primary text-white"
                        : "glass border border-border/50"
                    }`}
                    role={message.type === "ai" ? "status" : undefined}
                    aria-live={message.isTyping ? "polite" : undefined}
                  >
                    <p className="text-sm whitespace-pre-line">
                      {message.isTyping ? (
                        <span className="flex items-center space-x-1" aria-label="AI is typing">
                          <span>Analyzing</span>
                          <div className="flex space-x-1" aria-hidden="true">
                            <div className="w-1 h-1 bg-primary rounded-full animate-ping"></div>
                            <div className="w-1 h-1 bg-primary rounded-full animate-ping" style={{ animationDelay: "0.2s" }}></div>
                            <div className="w-1 h-1 bg-primary rounded-full animate-ping" style={{ animationDelay: "0.4s" }}></div>
                          </div>
                        </span>
                      ) : (
                        message.content
                      )}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <p className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {message.modelUsed && (
                          <span className="text-xs opacity-60">• {message.modelUsed}</span>
                        )}
                      </div>
                      {message.type === "ai" && !message.isTyping && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRegenerateResponse(message.id)}
                          className="p-1 h-6 opacity-60 hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          aria-label="Regenerate response"
                        >
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* File Upload Preview */}
          {uploadedFile && (
            <div className="px-4 py-2 border-t border-border/50">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm bg-secondary/20 rounded-lg p-2">
                  <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="flex-1 truncate">{uploadedFile.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setUploadedFile(null);
                      setUploadProgress(0);
                    }}
                    className="p-1 h-6 w-6 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    aria-label="Remove uploaded file"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <Progress value={uploadProgress} className="h-1" />
                )}
              </div>
            </div>
          )}

          {/* Input */}
          <div 
            className={`p-4 border-t border-border/50 ${isDragOver ? 'bg-primary/10 border-primary/50' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isDragOver && (
              <div className="absolute inset-0 bg-primary/5 border-2 border-dashed border-primary/50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-primary font-medium">Drop your resume here</p>
                </div>
              </div>
            )}
            
            <div className="flex items-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="glass-hover focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Upload file"
              >
                <Paperclip className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleRecording}
                className={`glass-hover focus:outline-none focus:ring-2 focus:ring-primary/50 ${isRecording ? "glow-destructive" : ""}`}
                aria-label={isRecording ? "Stop recording" : "Start voice input"}
              >
                {isRecording ? 
                  <MicOff className="h-4 w-4 text-destructive" aria-hidden="true" /> : 
                  <Mic className="h-4 w-4" aria-hidden="true" />
                }
              </Button>
              <div className="flex-1 space-y-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me about your career or upload your resume..."
                  className="glass border-border/50 focus:border-primary/50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  aria-label="Message input"
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() && !uploadedFile}
                className="bg-gradient-primary hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
            aria-label="File upload input"
          />
        </Card>
      </div>
    </>
  );
};