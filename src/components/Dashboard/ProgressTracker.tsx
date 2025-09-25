import { useState } from "react";
import { Trophy, Star, TrendingUp, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Level {
  name: string;
  icon: React.ElementType;
  color: string;
  description: string;
  threshold: number;
}

export const ProgressTracker = () => {
  const [currentScore] = useState(72);

  const levels: Level[] = [
    { name: "Bronze", icon: Trophy, color: "text-orange-500", description: "Getting Started", threshold: 0 },
    { name: "Silver", icon: Star, color: "text-gray-400", description: "Making Progress", threshold: 25 },
    { name: "Gold", icon: Award, color: "text-yellow-500", description: "Strong Profile", threshold: 60 },
    { name: "Platinum", icon: TrendingUp, color: "text-purple-500", description: "Career Ready", threshold: 85 },
  ];

  const currentLevel = levels.reduce((prev, curr) => 
    currentScore >= curr.threshold ? curr : prev
  );

  const nextLevel = levels.find(level => level.threshold > currentScore);
  const progressToNext = nextLevel 
    ? ((currentScore - currentLevel.threshold) / (nextLevel.threshold - currentLevel.threshold)) * 100
    : 100;

  const improvements = [
    { category: "Skills Match", current: 85, target: 90, color: "bg-primary" },
    { category: "Experience", current: 78, target: 85, color: "bg-secondary" },
    { category: "Keywords", current: 65, target: 80, color: "bg-accent" },
    { category: "Format", current: 90, target: 95, color: "bg-success" },
    { category: "Achievements", current: 55, target: 75, color: "bg-warning" },
  ];

  return (
    <div className="space-y-6">
      {/* Level Progress Card */}
      <Card className="glass glass-hover p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <currentLevel.icon className={`h-8 w-8 ${currentLevel.color}`} />
            <div>
              <h2 className="text-2xl font-bold">{currentLevel.name} Level</h2>
              <p className="text-muted-foreground">{currentLevel.description}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Resume Score</span>
              <span className="text-2xl font-bold text-primary">{currentScore}/100</span>
            </div>
            <Progress value={currentScore} className="h-3" />
          </div>

          {nextLevel && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Progress to {nextLevel.name}
                </span>
                <span className="text-sm font-medium">
                  {Math.round(progressToNext)}%
                </span>
              </div>
              <Progress value={progressToNext} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {nextLevel.threshold - currentScore} points to next level
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Improvement Areas */}
      <Card className="glass glass-hover p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
          Top 5 Improvements
        </h3>
        <div className="space-y-4">
          {improvements.map((item, index) => (
            <div
              key={item.category}
              className="space-y-2 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{item.category}</span>
                <span className="text-sm text-muted-foreground">
                  {item.current}% / {item.target}%
                </span>
              </div>
              <div className="relative">
                <Progress value={(item.current / item.target) * 100} className="h-2" />
                <div
                  className="absolute top-0 h-2 bg-primary/30 rounded-full"
                  style={{ width: "100%" }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                +{item.target - item.current} points potential
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Achievement Badges */}
      <Card className="glass glass-hover p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
        <div className="grid grid-cols-3 gap-4">
          {["Resume Uploaded", "Skills Optimized", "Profile Viewed"].map((achievement, index) => (
            <div
              key={achievement}
              className="text-center space-y-2 animate-bounce-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto glow-primary">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs font-medium">{achievement}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};