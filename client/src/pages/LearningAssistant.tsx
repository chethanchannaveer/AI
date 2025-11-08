import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuizCard from "@/components/QuizCard";
import StudyScheduleCard from "@/components/StudyScheduleCard";
import { Sparkles, Calendar, BookOpen, Brain, Plus, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface StudySchedule {
  id: string;
  topic: string;
  date: string;
  time: string;
  duration: string;
  status: "upcoming" | "completed" | "missed";
}

export default function LearningAssistant() {
  const [topic, setTopic] = useState("");
  const [learningGoal, setLearningGoal] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizGenerated, setQuizGenerated] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  // Schedule dialog state
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [scheduleTopic, setScheduleTopic] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleDuration, setScheduleDuration] = useState("");

  // TODO: Remove mock data - replace with real quiz generation from AI agent
  const [quizQuestions] = useState<QuizQuestion[]>([
    {
      question: "What is a closure in JavaScript?",
      options: [
        "A function that has access to variables in its outer scope",
        "A method to close browser windows",
        "A CSS property for hiding elements",
        "A database transaction"
      ],
      correctAnswer: 0,
      explanation: "A closure is a function that retains access to variables from its outer (enclosing) scope, even after the outer function has finished executing."
    },
    {
      question: "Which hook is used for side effects in React?",
      options: [
        "useState",
        "useEffect",
        "useContext",
        "useMemo"
      ],
      correctAnswer: 1,
      explanation: "useEffect is the React hook specifically designed for handling side effects like data fetching, subscriptions, and manually changing the DOM."
    },
    {
      question: "What does 'npm' stand for?",
      options: [
        "New Package Manager",
        "Node Package Manager",
        "Network Protocol Module",
        "Next Programming Method"
      ],
      correctAnswer: 1,
      explanation: "npm stands for Node Package Manager. It's the default package manager for Node.js and the world's largest software registry."
    }
  ]);

  // TODO: Remove mock data - replace with real schedule data from backend
  const [schedules, setSchedules] = useState<StudySchedule[]>([
    {
      id: "schedule-1",
      topic: "JavaScript Fundamentals",
      date: "December 15, 2024",
      time: "2:00 PM",
      duration: "1 hour",
      status: "upcoming"
    },
    {
      id: "schedule-2",
      topic: "React Hooks Deep Dive",
      date: "December 14, 2024",
      time: "10:00 AM",
      duration: "2 hours",
      status: "completed"
    },
    {
      id: "schedule-3",
      topic: "Data Structures",
      date: "December 13, 2024",
      time: "3:00 PM",
      duration: "1.5 hours",
      status: "missed"
    }
  ]);

  const handleGenerateQuiz = () => {
    setIsGenerating(true);
    // TODO: Replace with actual API call to AI agent to generate quiz
    setTimeout(() => {
      setIsGenerating(false);
      setQuizGenerated(true);
      setScore({ correct: 0, total: quizQuestions.length });
    }, 2000);
  };

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
    }
  };

  const handleCreateSchedule = () => {
    if (!scheduleTopic || !scheduleDate || !scheduleTime || !scheduleDuration) return;

    const newSchedule: StudySchedule = {
      id: `schedule-${Date.now()}`,
      topic: scheduleTopic,
      date: scheduleDate,
      time: scheduleTime,
      duration: scheduleDuration,
      status: "upcoming"
    };

    // TODO: Replace with actual API call to save schedule
    setSchedules(prev => [newSchedule, ...prev]);
    setScheduleDialogOpen(false);
    setScheduleTopic("");
    setScheduleDate("");
    setScheduleTime("");
    setScheduleDuration("");
  };

  const handleCompleteSchedule = (id: string) => {
    setSchedules(prev =>
      prev.map(schedule =>
        schedule.id === id ? { ...schedule, status: "completed" as const } : schedule
      )
    );
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== id));
  };

  return (
    <div className="min-h-screen">
      <div className="py-12 px-8 border-b">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Learning Assistant</h1>
          <p className="text-muted-foreground">
            AI-powered quiz generation and personalized study schedules
          </p>
        </div>
      </div>

      <div className="py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="quiz" className="w-full">
            <TabsList>
              <TabsTrigger value="quiz">Generate Quiz</TabsTrigger>
              <TabsTrigger value="schedule">Study Schedule</TabsTrigger>
              <TabsTrigger value="progress">My Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="quiz" className="mt-6">
              {!quizGenerated ? (
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <Brain className="w-6 h-6 text-primary" />
                    Create Your Quiz
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="topic">Topic or Subject</Label>
                      <Input
                        id="topic"
                        placeholder="e.g., JavaScript, React, Python, Machine Learning"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="mt-2"
                        data-testid="input-topic"
                      />
                    </div>
                    <div>
                      <Label htmlFor="learning-goal">Learning Goals (Optional)</Label>
                      <Textarea
                        id="learning-goal"
                        placeholder="Describe what you want to learn or focus on..."
                        value={learningGoal}
                        onChange={(e) => setLearningGoal(e.target.value)}
                        className="mt-2"
                        data-testid="textarea-goals"
                      />
                    </div>
                    <Button
                      onClick={handleGenerateQuiz}
                      disabled={!topic.trim() || isGenerating}
                      className="w-full h-12"
                      data-testid="button-generate-quiz"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      {isGenerating ? "Generating Quiz..." : "Generate Quiz"}
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="space-y-6">
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-semibold">Quiz: {topic}</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          Score: {score.correct} / {score.total} correct
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setQuizGenerated(false);
                          setScore({ correct: 0, total: 0 });
                        }}
                        data-testid="button-new-quiz"
                      >
                        New Quiz
                      </Button>
                    </div>
                  </Card>

                  {quizQuestions.map((question, index) => (
                    <QuizCard
                      key={index}
                      question={question}
                      questionNumber={index + 1}
                      onAnswer={handleAnswer}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="schedule" className="mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Study Schedule</h2>
                <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-schedule">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Schedule
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Study Schedule</DialogTitle>
                      <DialogDescription>
                        Set a specific time to study a topic
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="schedule-topic">Topic</Label>
                        <Input
                          id="schedule-topic"
                          placeholder="What will you study?"
                          value={scheduleTopic}
                          onChange={(e) => setScheduleTopic(e.target.value)}
                          data-testid="input-schedule-topic"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="schedule-date">Date</Label>
                          <Input
                            id="schedule-date"
                            type="date"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            data-testid="input-schedule-date"
                          />
                        </div>
                        <div>
                          <Label htmlFor="schedule-time">Time</Label>
                          <Input
                            id="schedule-time"
                            type="time"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                            data-testid="input-schedule-time"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="schedule-duration">Duration</Label>
                        <Input
                          id="schedule-duration"
                          placeholder="e.g., 1 hour, 30 minutes"
                          value={scheduleDuration}
                          onChange={(e) => setScheduleDuration(e.target.value)}
                          data-testid="input-schedule-duration"
                        />
                      </div>
                      <Button
                        onClick={handleCreateSchedule}
                        className="w-full"
                        data-testid="button-create-schedule"
                      >
                        Create Schedule
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schedules.map((schedule) => (
                  <StudyScheduleCard
                    key={schedule.id}
                    {...schedule}
                    onComplete={() => handleCompleteSchedule(schedule.id)}
                    onDelete={() => handleDeleteSchedule(schedule.id)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="progress" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Quizzes Taken</p>
                      <p className="text-2xl font-bold">24</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-green-500/10">
                      <Brain className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Average Score</p>
                      <p className="text-2xl font-bold">87%</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-blue-500/10">
                      <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Study Hours</p>
                      <p className="text-2xl font-bold">42h</p>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Recent Topics</h3>
                <div className="space-y-2">
                  {["JavaScript ES6", "React Hooks", "TypeScript Basics", "Node.js Express"].map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-card border">
                      <span className="text-sm">{topic}</span>
                      <span className="text-sm text-muted-foreground">85% mastery</span>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
