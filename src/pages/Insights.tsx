import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Target, BarChart3, Briefcase, Clock } from "lucide-react";

const Insights = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold font-poppins mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Career
            </span>{" "}
            <span className="text-foreground">Insights</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Data-driven insights to accelerate your career growth
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: TrendingUp, label: "Resume Score", value: "87/100", trend: "+12%" },
            { icon: Target, label: "Match Rate", value: "92%", trend: "+8%" },
            { icon: Briefcase, label: "Job Opportunities", value: "156", trend: "+23%" }
          ].map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="glass p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {metric.trend}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </Card>
            );
          })}
        </div>

        {/* Insights Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Skills Analysis */}
          <Card className="glass p-6">
            <div className="flex items-center mb-6">
              <BarChart3 className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-xl font-semibold text-foreground">Skills Analysis</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { skill: "React", level: 90, demand: "High" },
                { skill: "TypeScript", level: 85, demand: "High" },
                { skill: "Node.js", level: 75, demand: "Medium" },
                { skill: "AWS", level: 60, demand: "High" },
                { skill: "Docker", level: 45, demand: "Medium" }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">{item.skill}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant={item.demand === "High" ? "default" : "secondary"}>
                        {item.demand} Demand
                      </Badge>
                      <span className="text-sm text-muted-foreground">{item.level}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Market Trends */}
          <Card className="glass p-6">
            <div className="flex items-center mb-6">
              <TrendingUp className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-xl font-semibold text-foreground">Market Trends</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { 
                  title: "AI/ML Engineering", 
                  growth: "+45%", 
                  description: "Highest growth in tech sector",
                  icon: "🤖"
                },
                { 
                  title: "Cloud Architecture", 
                  growth: "+38%", 
                  description: "Remote-first companies driving demand",
                  icon: "☁️"
                },
                { 
                  title: "DevOps/SRE", 
                  growth: "+32%", 
                  description: "Infrastructure automation focus",
                  icon: "⚙️"
                },
                { 
                  title: "Frontend Development", 
                  growth: "+25%", 
                  description: "React/Vue.js specialization in demand",
                  icon: "💻"
                }
              ].map((trend, index) => (
                <div key={index} className="border border-border/50 rounded-lg p-4 glass-hover">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{trend.icon}</span>
                      <div>
                        <h3 className="font-semibold text-foreground">{trend.title}</h3>
                        <p className="text-sm text-muted-foreground">{trend.description}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {trend.growth}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="glass p-6 mt-8">
          <div className="flex items-center mb-6">
            <Target className="h-6 w-6 text-primary mr-3" />
            <h2 className="text-xl font-semibold text-foreground">AI Recommendations</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Skill Development</h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm text-muted-foreground">Learn AWS Cloud Practitioner certification</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm text-muted-foreground">Practice system design interviews</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm text-muted-foreground">Build portfolio with Next.js projects</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Career Moves</h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span className="text-sm text-muted-foreground">Target senior roles at mid-size companies</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span className="text-sm text-muted-foreground">Consider remote-first opportunities</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span className="text-sm text-muted-foreground">Network at React conferences</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Insights;