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

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ModelOption {
  id: string;
  name: string;
  description: string;
  version: string;
  capabilities: string[];
}

interface PopupChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PopupChat = ({ isOpen, onClose }: PopupChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelOption>({
    id: "hyperleap-ai",
    name: "Hyperleap AI",
    description: "Advanced AI career assistant with real-time insights",
    version: "3.0.0",
    capabilities: ["Career Guidance", "Resume Optimization", "Job Matching", "Interview Prep", "Real-time Analysis"]
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const conversationIdRef = useRef<string | null>(null);

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

  // Initialize AIterns conversation when chat opens
  useEffect(() => {
    if (isOpen && !isInitialized) {
      setIsInitialized(true);
      // Send initial message to get AIterns greeting
      setTimeout(async () => {
        try {
          const greeting = await getAIResponse('Hello');
          setMessages([{
            id: "aiterns-greeting",
            type: "ai",
            content: greeting,
            timestamp: new Date(),
            modelUsed: "AIterns"
          }]);
        } catch (error) {
          console.error('Failed to get AIterns greeting:', error);
          setMessages([{
            id: "fallback-greeting",
            type: "ai",
            content: "Hello! I'm AIterns — here to help you with your career journey. What should I call you?",
            timestamp: new Date(),
            modelUsed: "AIterns"
          }]);
        }
      }, 500);
    }
  }, [isOpen, isInitialized]);

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

    // Show AI typing indicator immediately
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "ai",
      content: "I'm analyzing your request...",
      timestamp: new Date(),
      isTyping: true,
      modelUsed: selectedModel.name
    };
    setMessages(prev => [...prev, aiMessage]);

    // Get AI response with shorter delay for better UX
    setTimeout(async () => {
      try {
        const response = await getAIResponse(userMessage.content);
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessage.id 
              ? { ...msg, content: response, isTyping: false }
              : msg
          )
        );
      } catch (error) {
        console.error('Error getting AI response:', error);
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessage.id 
              ? { 
                ...msg, 
                content: "I apologize, but I'm experiencing technical difficulties. Please try asking me about career advice, resume optimization, or job search strategies!", 
                isTyping: false 
              }
              : msg
          )
        );
      }
    }, 500);
  };

  const getAIResponse = async (userInput: string): Promise<string> => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Build conversation history for potential context (not sent to API yet)
      const conversation: ChatMessage[] = messages
        .filter(msg => msg.type !== 'ai' || !msg.isTyping)
        .slice(-10)
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));
      
      console.log('Sending request to Hyperleap with:', { userInput, conversationLength: conversation.length, conversationId: conversationIdRef.current });
      
      const response = await supabase.functions.invoke('hyperleap-chat', {
        body: {
          text: userInput,
          conversationId: conversationIdRef.current || undefined,
          system: 'You are a helpful AI career assistant specializing in resume analysis, job matching, and career guidance. Provide personalized, actionable advice to help users advance their careers.',
          model: 'gpt-4o-mini',
          externalUserId: 'web-user-' + Date.now()
        }
      });

      console.log('Hyperleap response:', response);

      if (response.error) {
        console.error('Hyperleap API error:', response.error);
        const errorMsg = (response.error as any)?.message || 'Unknown error';
        
        if (errorMsg.includes('network') || errorMsg.includes('connection')) {
          return "I'm having connection issues. Let me try to help you anyway - could you tell me more about what you're looking for?";
        }
        if (errorMsg.includes('API key') || errorMsg.includes('unauthorized')) {
          return "I'm experiencing authentication issues. Please try again in a moment.";
        }
        if (errorMsg.includes('rate limit')) {
          return "I'm receiving a lot of requests right now. Please wait a moment and try again.";
        }
        return "I'm experiencing some technical difficulties. Please try rephrasing your question or try again in a moment.";
      }

      const reply = (response.data as any)?.reply as string | undefined;
      const cid = (response.data as any)?.conversationId as string | undefined;
      if (cid) conversationIdRef.current = cid;

      if (!reply || reply.trim().length === 0) {
        return "I'm having trouble generating a response. Could you try asking your question differently?";
      }

      return reply;
    } catch (error) {
      console.error('Chat integration error:', error);
      return "I'm temporarily unavailable. Please try again in a moment, or feel free to ask me about career advice, resume tips, or job search strategies!";
    }
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

  const handleRegenerateResponse = async (messageId: string) => {
    // Find the original user message that triggered this AI response
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    const lastUserMessage = messages.slice(0, messageIndex).reverse().find(msg => msg.type === 'user');
    
    if (!lastUserMessage) return;

    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: "Regenerating response...", isTyping: true }
          : msg
      )
    );

    try {
      const response = await getAIResponse(lastUserMessage.content);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, content: response, isTyping: false }
            : msg
        )
      );
    } catch (error) {
      console.error('Error regenerating response:', error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, content: "I'm having trouble generating a new response. Please try again.", isTyping: false }
            : msg
        )
      );
    }
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
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      
      {/* Screen reader live region for announcements */}
      <div
        ref={liveRegionRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      
      {/* Popup Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <Card className="glass border-primary/30 animate-scale-in w-full max-w-4xl max-h-[90vh] overflow-hidden">
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
          <ScrollArea className="h-96 p-4">
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
                    <div className="text-sm whitespace-pre-line">
                      {message.isTyping ? (
                        <span className="flex items-center space-x-1" aria-label="AI is typing">
                          <span>Analyzing</span>
                          <span className="flex space-x-1" aria-hidden="true">
                            <span className="w-1 h-1 bg-primary rounded-full animate-ping"></span>
                            <span className="w-1 h-1 bg-primary rounded-full animate-ping" style={{ animationDelay: "0.2s" }}></span>
                            <span className="w-1 h-1 bg-primary rounded-full animate-ping" style={{ animationDelay: "0.4s" }}></span>
                          </span>
                        </span>
                      ) : (
                        message.content
                      )}
                    </div>
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