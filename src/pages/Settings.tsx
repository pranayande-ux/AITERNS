import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Database } from "lucide-react";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold font-poppins mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Settings
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Customize your AITERNS experience
          </p>
        </div>

        <div className="space-y-8">
          {/* Profile Settings */}
          <Card className="glass p-6">
            <div className="flex items-center mb-6">
              <User className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-xl font-semibold text-foreground">Profile Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" className="glass" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" className="glass" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" className="glass" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Current Job Title</Label>
                <Input id="jobTitle" placeholder="Senior Software Engineer" className="glass" />
              </div>
              
              <Button className="bg-gradient-primary">
                Save Profile
              </Button>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="glass p-6">
            <div className="flex items-center mb-6">
              <Bell className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { label: "Email notifications for job matches", description: "Get notified when we find relevant opportunities" },
                { label: "Resume analysis updates", description: "Receive insights when your resume score improves" },
                { label: "Weekly career insights", description: "Get market trends and recommendations" },
                { label: "AI chat reminders", description: "Periodic reminders to engage with your AI assistant" }
              ].map((setting, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{setting.label}</p>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                  <Switch defaultChecked={index < 2} />
                </div>
              ))}
            </div>
          </Card>

          {/* Privacy & Security */}
          <Card className="glass p-6">
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-xl font-semibold text-foreground">Privacy & Security</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Two-factor authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Badge variant="outline">Not enabled</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Data sharing with recruiters</p>
                  <p className="text-sm text-muted-foreground">Allow verified recruiters to view your profile</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Anonymous usage analytics</p>
                  <p className="text-sm text-muted-foreground">Help us improve AITERNS with anonymous data</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>

          {/* Appearance */}
          <Card className="glass p-6">
            <div className="flex items-center mb-6">
              <Palette className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-xl font-semibold text-foreground">Appearance</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Dark mode</p>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Reduce motion</p>
                  <p className="text-sm text-muted-foreground">Minimize animations for better accessibility</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">AI bot voice responses</p>
                  <p className="text-sm text-muted-foreground">Enable text-to-speech for AI responses</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>

          {/* Data Management */}
          <Card className="glass p-6">
            <div className="flex items-center mb-6">
              <Database className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-xl font-semibold text-foreground">Data Management</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="glass">
                  Export Data
                </Button>
                <Button variant="outline" className="glass">
                  Clear History
                </Button>
                <Button variant="destructive">
                  Delete Account
                </Button>
              </div>
              
              <div className="p-4 bg-muted/20 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Data retention:</strong> Your resume data and chat history are stored securely and can be deleted at any time. 
                  We never share your personal information without explicit consent.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;