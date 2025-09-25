import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Target, TrendingUp, Search } from "lucide-react";

const Recruiter = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold font-poppins mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Recruiter
            </span>{" "}
            <span className="text-foreground">Dashboard</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI-powered candidate screening and matching for modern recruiters
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Users, label: "Active Candidates", value: "1,247", color: "bg-blue-500" },
            { icon: FileText, label: "Resumes Processed", value: "3,456", color: "bg-green-500" },
            { icon: Target, label: "Perfect Matches", value: "89", color: "bg-purple-500" },
            { icon: TrendingUp, label: "Placement Rate", value: "94%", color: "bg-orange-500" }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="glass p-6 text-center">
                <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Candidate Search */}
          <div className="lg:col-span-2">
            <Card className="glass p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">AI Candidate Matching</h2>
                <Button className="bg-gradient-primary">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: "Sarah Chen", role: "Senior Frontend Developer", match: 96, skills: ["React", "TypeScript", "Node.js"] },
                  { name: "Marcus Johnson", role: "Full Stack Engineer", match: 92, skills: ["Python", "React", "AWS"] },
                  { name: "Emma Rodriguez", role: "UI/UX Designer", match: 89, skills: ["Figma", "React", "Design Systems"] }
                ].map((candidate, index) => (
                  <div key={index} className="border border-border/50 rounded-lg p-4 glass-hover">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{candidate.name}</h3>
                      <Badge variant="secondary" className="bg-gradient-primary text-white">
                        {candidate.match}% Match
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{candidate.role}</p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Job Postings */}
          <div>
            <Card className="glass p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Active Job Postings</h2>
              <div className="space-y-3">
                {[
                  { title: "Senior React Developer", applicants: 23, status: "Active" },
                  { title: "DevOps Engineer", applicants: 15, status: "Active" },
                  { title: "Product Manager", applicants: 31, status: "Reviewing" }
                ].map((job, index) => (
                  <div key={index} className="border border-border/50 rounded-lg p-3">
                    <h3 className="font-medium text-foreground">{job.title}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-muted-foreground">{job.applicants} applicants</span>
                      <Badge variant={job.status === "Active" ? "default" : "secondary"}>
                        {job.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recruiter;