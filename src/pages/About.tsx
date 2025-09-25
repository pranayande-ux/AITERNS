import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Target, Users, Brain, Heart, Award, Mail, Github, Twitter } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold font-poppins mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              About
            </span>{" "}
            <span className="text-foreground">AITERNS</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Empowering careers through artificial intelligence. We're building the future of career development, 
            one personalized journey at a time.
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="glass p-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              To democratize career success by providing AI-powered insights, personalized guidance, 
              and intelligent matching that helps every professional reach their full potential, 
              regardless of their background or starting point.
            </p>
          </div>
        </Card>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Brain,
              title: "Intelligence",
              description: "Leveraging cutting-edge AI to provide deep insights into career paths and market trends."
            },
            {
              icon: Heart,
              title: "Empathy",
              description: "Understanding that every career journey is unique and requires personalized support."
            },
            {
              icon: Users,
              title: "Inclusion",
              description: "Building tools that work for everyone, breaking down barriers to career advancement."
            }
          ].map((value, index) => {
            const Icon = value.icon;
            return (
              <Card key={index} className="glass p-6 text-center">
                <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            );
          })}
        </div>

        {/* Features Overview */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">What Makes Us Different</h2>
            <div className="space-y-4">
              {[
                {
                  title: "AI-Powered Resume Analysis",
                  description: "Advanced algorithms that understand context, not just keywords."
                },
                {
                  title: "Intelligent Job Matching",
                  description: "Smart recommendations based on skills, experience, and career goals."
                },
                {
                  title: "Personalized Career Coaching",
                  description: "AI assistant that learns your preferences and provides tailored advice."
                },
                {
                  title: "Real-time Market Insights",
                  description: "Stay ahead with data-driven analysis of industry trends and demands."
                }
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card className="glass p-8">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">By the Numbers</h3>
            <div className="grid grid-cols-2 gap-6 text-center">
              {[
                { number: "50K+", label: "Resumes Analyzed" },
                { number: "10K+", label: "Career Matches Made" },
                { number: "95%", label: "User Satisfaction" },
                { number: "24/7", label: "AI Assistant Available" }
              ].map((stat, index) => (
                <div key={index}>
                  <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    {stat.number}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Team Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Meet the Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Chen",
                role: "AI Research Lead",
                bio: "Former Google AI researcher with 10+ years in machine learning and career analytics."
              },
              {
                name: "Marcus Rodriguez",
                role: "Product Lead",
                bio: "Ex-LinkedIn product manager passionate about democratizing career opportunities."
              },
              {
                name: "Emma Williams",
                role: "UX Director",
                bio: "Design leader focused on creating inclusive and accessible career tools."
              }
            ].map((member, index) => (
              <Card key={index} className="glass p-6">
                <div className="w-20 h-20 bg-gradient-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{member.name}</h3>
                <Badge variant="secondary" className="mb-3">{member.role}</Badge>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Recognition */}
        <Card className="glass p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Recognition & Awards</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                award: "Best AI Innovation 2024",
                organization: "Tech Innovation Awards",
                description: "Recognized for breakthrough AI career matching technology"
              },
              {
                award: "Top HR Tech Startup",
                organization: "HR Technology Conference",
                description: "Leading innovation in AI-powered career development"
              }
            ].map((recognition, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{recognition.award}</h3>
                  <p className="text-sm text-primary font-medium">{recognition.organization}</p>
                  <p className="text-sm text-muted-foreground mt-1">{recognition.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Contact Section */}
        <Card className="glass p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Get in Touch</h2>
          <p className="text-muted-foreground mb-6">
            Have questions or want to learn more? We'd love to hear from you.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" className="glass">
              <Mail className="h-4 w-4 mr-2" />
              Contact Us
            </Button>
            <Button variant="outline" className="glass">
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
            <Button variant="outline" className="glass">
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default About;