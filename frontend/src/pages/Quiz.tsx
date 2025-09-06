import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Trophy, Star, Flame, Target, Award, TrendingUp, Zap } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

const farmingQuiz: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the primary benefit of crop rotation in sustainable farming?",
    options: [
      "Reduces soil erosion",
      "Increases pest resistance",
      "Improves soil fertility and reduces pest buildup",
      "Saves water consumption"
    ],
    correctAnswer: 2,
    explanation: "Crop rotation improves soil fertility by alternating crops with different nutrient needs, and disrupts pest life cycles, reducing pest buildup naturally.",
    category: "Soil Management",
    difficulty: "medium",
    points: 10
  },
  {
    id: 2,
    question: "Which irrigation method is most water-efficient for row crops?",
    options: [
      "Flood irrigation",
      "Sprinkler irrigation",
      "Drip irrigation",
      "Furrow irrigation"
    ],
    correctAnswer: 2,
    explanation: "Drip irrigation delivers water directly to plant roots, minimizing evaporation and runoff, making it the most water-efficient method.",
    category: "Water Management",
    difficulty: "easy",
    points: 8
  },
  {
    id: 3,
    question: "What is the optimal pH range for most agricultural crops?",
    options: [
      "4.0-5.0",
      "5.5-7.5",
      "8.0-9.0",
      "3.0-4.0"
    ],
    correctAnswer: 1,
    explanation: "Most crops thrive in slightly acidic to neutral soil (pH 5.5-7.5). This range allows optimal nutrient availability and microbial activity.",
    category: "Soil Management",
    difficulty: "easy",
    points: 8
  },
  {
    id: 4,
    question: "Which farming practice helps reduce greenhouse gas emissions?",
    options: [
      "Conventional tillage",
      "No-till farming",
      "Monocropping",
      "Heavy fertilizer use"
    ],
    correctAnswer: 1,
    explanation: "No-till farming reduces soil disturbance, which helps sequester carbon and reduces CO2 emissions from soil organic matter decomposition.",
    category: "Climate Smart Agriculture",
    difficulty: "hard",
    points: 15
  },
  {
    id: 5,
    question: "What is the main advantage of intercropping?",
    options: [
      "Simplifies harvesting",
      "Increases biodiversity and reduces pest pressure",
      "Reduces water usage",
      "Lowers fertilizer costs"
    ],
    correctAnswer: 1,
    explanation: "Intercropping increases biodiversity, creates natural pest barriers, and can improve soil health through complementary root systems.",
    category: "Crop Management",
    difficulty: "medium",
    points: 12
  },
  {
    id: 6,
    question: "Which soil amendment is best for improving clay soil structure?",
    options: [
      "Sand",
      "Organic matter (compost)",
      "Lime",
      "Gypsum"
    ],
    correctAnswer: 1,
    explanation: "Organic matter improves clay soil by increasing porosity, water retention, and providing food for beneficial soil organisms.",
    category: "Soil Management",
    difficulty: "medium",
    points: 10
  },
  {
    id: 7,
    question: "What is the recommended timing for applying nitrogen fertilizer to maximize crop uptake?",
    options: [
      "Early spring before planting",
      "Split application: some at planting, rest during growing season",
      "Late fall after harvest",
      "Only when plants show deficiency symptoms"
    ],
    correctAnswer: 1,
    explanation: "Split application ensures nitrogen is available when crops need it most, reducing leaching and improving efficiency.",
    category: "Nutrient Management",
    difficulty: "hard",
    points: 15
  },
  {
    id: 8,
    question: "Which pest control method is most environmentally friendly?",
    options: [
      "Chemical pesticides",
      "Integrated Pest Management (IPM)",
      "Biological control only",
      "Complete crop removal"
    ],
    correctAnswer: 1,
    explanation: "IPM combines multiple strategies including biological control, cultural practices, and minimal chemical use when necessary.",
    category: "Pest Management",
    difficulty: "medium",
    points: 12
  }
];

const achievements: Achievement[] = [
  {
    id: 'first-quiz',
    name: 'First Steps',
    description: 'Complete your first quiz',
    icon: '🌱',
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'streak-3',
    name: 'Getting Hot',
    description: 'Maintain a 3-day quiz streak',
    icon: '🔥',
    unlocked: false,
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day quiz streak',
    icon: '⚡',
    unlocked: false,
    progress: 0,
    maxProgress: 7
  },
  {
    id: 'perfect-score',
    name: 'Perfect Farmer',
    description: 'Score 100% on any quiz',
    icon: '🏆',
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'category-master',
    name: 'Category Master',
    description: 'Score 90%+ in all farming categories',
    icon: '⭐',
    unlocked: false,
    progress: 0,
    maxProgress: 6
  }
];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [categoryScores, setCategoryScores] = useState<Record<string, { correct: number; total: number }>>({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [userAchievements, setUserAchievements] = useState<Achievement[]>(achievements);
  const [showAchievement, setShowAchievement] = useState<string | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);
  const [timeStarted, setTimeStarted] = useState<Date | null>(null);
  const [quizTime, setQuizTime] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  // Shuffle questions on component mount
  useEffect(() => {
    const shuffled = [...farmingQuiz].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  }, []);

  // Timer effect - only runs when quiz is started and not completed
  useEffect(() => {
    if (timeStarted && quizStarted && !quizCompleted) {
      const interval = setInterval(() => {
        setQuizTime(Math.floor((Date.now() - timeStarted.getTime()) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeStarted, quizStarted, quizCompleted]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const checkAchievements = (newScore: number, newStreak: number) => {
    const updatedAchievements = [...userAchievements];
    let newUnlocked = false;

    // First quiz achievement
    if (updatedAchievements[0].progress === 0) {
      updatedAchievements[0].progress = 1;
      updatedAchievements[0].unlocked = true;
      newUnlocked = true;
    }

    // Streak achievements
    if (newStreak >= 3 && !updatedAchievements[1].unlocked) {
      updatedAchievements[1].progress = newStreak;
      updatedAchievements[1].unlocked = true;
      newUnlocked = true;
    }
    if (newStreak >= 7 && !updatedAchievements[2].unlocked) {
      updatedAchievements[2].progress = newStreak;
      updatedAchievements[2].unlocked = true;
      newUnlocked = true;
    }

    // Perfect score achievement
    if (newScore === 100 && !updatedAchievements[3].unlocked) {
      updatedAchievements[3].progress = 1;
      updatedAchievements[3].unlocked = true;
      newUnlocked = true;
    }

    setUserAchievements(updatedAchievements);
    return newUnlocked;
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const currentQ = shuffledQuestions[currentQuestion];
      const isCorrect = selectedAnswer === currentQ.correctAnswer;
      
      if (isCorrect) {
        setScore(score + 1);
        setTotalPoints(prev => prev + currentQ.points);
      }

      // Update category scores
      const category = currentQ.category;
      setCategoryScores(prev => ({
        ...prev,
        [category]: {
          correct: (prev[category]?.correct || 0) + (isCorrect ? 1 : 0),
          total: (prev[category]?.total || 0) + 1
        }
      }));

      if (currentQuestion < shuffledQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        // Quiz completed
        const newStreak = streak + 1;
        setStreak(newStreak);
        
        const achievementUnlocked = checkAchievements(score + (isCorrect ? 1 : 0), newStreak);
        if (achievementUnlocked) {
          setShowAchievement('🎉 Achievement Unlocked! 🎉');
          setTimeout(() => setShowAchievement(null), 3000);
        }
        
        setQuizCompleted(true);
      }
    }
  };

  const handleSubmitQuiz = () => {
    setShowSubmitConfirm(true);
  };

  const confirmSubmit = () => {
    // Stop the timer
    setTimeStarted(null);
    setQuizStarted(false);
    
    // Calculate final score and achievements
    const finalScore = score;
    const newStreak = streak + 1;
    setStreak(newStreak);
    
    const achievementUnlocked = checkAchievements(finalScore, newStreak);
    if (achievementUnlocked) {
      setShowAchievement('🎉 Achievement Unlocked! 🎉');
      setTimeout(() => setShowAchievement(null), 3000);
    }
    
    setQuizCompleted(true);
    setShowSubmitConfirm(false);
  };

  const cancelSubmit = () => {
    setShowSubmitConfirm(false);
  };

  const resetQuiz = () => {
    const shuffled = [...farmingQuiz].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizCompleted(false);
    setCategoryScores({});
    setTotalPoints(0);
    setQuizTime(0);
    setTimeStarted(null);
    setQuizStarted(false);
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setTimeStarted(new Date());
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Soil Management": "bg-green-100 text-green-800",
      "Water Management": "bg-blue-100 text-blue-800",
      "Climate Smart Agriculture": "bg-purple-100 text-purple-800",
      "Crop Management": "bg-orange-100 text-orange-800",
      "Nutrient Management": "bg-yellow-100 text-yellow-800",
      "Pest Management": "bg-red-100 text-red-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      "easy": "bg-green-100 text-green-800",
      "medium": "bg-yellow-100 text-yellow-800",
      "hard": "bg-red-100 text-red-800"
    };
    return colors[difficulty] || "bg-gray-100 text-gray-800";
  };

  if (quizCompleted) {
    const percentage = Math.round((score / shuffledQuestions.length) * 100);
    const timeBonus = Math.max(0, 300 - quizTime) * 2; // Time bonus points
    const finalScore = totalPoints + timeBonus;
    
    return (
      <>
        <Navigation />
      <div className="min-h-screen pt-24 pb-20 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              Quiz Complete! 🎉
            </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 px-4">
              Great job! Here's how you performed and what you can learn from it.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Overall Score */}
              <Card className="mb-6 sm:mb-8">
                <CardHeader className="text-center p-4 sm:p-6">
                  <CardTitle className="text-2xl sm:text-3xl">Your Score</CardTitle>
                <CardDescription>Overall performance across all farming categories</CardDescription>
              </CardHeader>
                <CardContent className="p-4 sm:p-6">
                <div className="text-center">
                    <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-3 sm:mb-4">{score}/{shuffledQuestions.length}</div>
                    <div className="text-xl sm:text-2xl text-gray-600 mb-4 sm:mb-6">{percentage}%</div>
                    <Progress value={percentage} className="h-2 sm:h-3 mb-4" />
                    <div className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 px-4">
                    {percentage >= 80 ? "Excellent! You're a farming expert!" :
                     percentage >= 60 ? "Good job! You have solid farming knowledge!" :
                     percentage >= 40 ? "Not bad! There's room for improvement!" :
                     "Keep learning! Every farmer starts somewhere!"}
                  </div>
                    
                    {/* Points Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">{totalPoints}</div>
                        <div className="text-xs sm:text-sm text-blue-600">Quiz Points</div>
                      </div>
                      <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
                        <div className="text-xl sm:text-2xl font-bold text-green-600">{timeBonus}</div>
                        <div className="text-xs sm:text-sm text-green-600">Time Bonus</div>
                      </div>
                      <div className="p-3 sm:p-4 bg-purple-50 rounded-lg">
                        <div className="text-xl sm:text-2xl font-bold text-purple-600">{finalScore}</div>
                        <div className="text-xs sm:text-sm text-purple-600">Total Score</div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                      <div className="text-center">
                        <div className="text-base sm:text-lg font-bold text-gray-700">{Math.floor(quizTime / 60)}:{(quizTime % 60).toString().padStart(2, '0')}</div>
                        <div className="text-xs text-gray-500">Time Taken</div>
                      </div>
                      <div className="text-center">
                        <div className="text-base sm:text-lg font-bold text-orange-600">{streak}</div>
                        <div className="text-xs text-gray-500">Day Streak</div>
                      </div>
                      <div className="text-center">
                        <div className="text-base sm:text-lg font-bold text-blue-600">{shuffledQuestions.length}</div>
                        <div className="text-xs text-gray-500">Questions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-base sm:text-lg font-bold text-green-600">{Math.round((score / shuffledQuestions.length) * 100)}%</div>
                        <div className="text-xs text-gray-500">Accuracy</div>
                      </div>
                    </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
              <Card className="mb-6 sm:mb-8">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-xl sm:text-2xl">Performance by Category</CardTitle>
                <CardDescription>See how you did in each farming area</CardDescription>
              </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {Object.entries(categoryScores).map(([category, scores]) => (
                      <div key={category} className="p-3 sm:p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-sm sm:text-base">{category}</span>
                        <Badge className={getCategoryColor(category)}>
                          {scores.correct}/{scores.total}
                        </Badge>
                      </div>
                      <Progress 
                        value={(scores.correct / scores.total) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

              {/* Achievements */}
              <Card className="mb-6 sm:mb-8">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                    Your Achievements
                  </CardTitle>
                  <CardDescription>Track your progress and unlock new badges</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {userAchievements.map((achievement) => (
                      <div key={achievement.id} className={`p-3 sm:p-4 border rounded-lg ${
                        achievement.unlocked ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center gap-3">
                          <span className="text-xl sm:text-2xl">{achievement.icon}</span>
                          <div className="flex-1">
                            <div className="font-semibold text-sm sm:text-base">{achievement.name}</div>
                            <div className="text-xs sm:text-sm text-gray-600">{achievement.description}</div>
                            <div className="mt-2">
                              <Progress 
                                value={(achievement.progress / achievement.maxProgress) * 100} 
                                className="h-2"
                              />
                              <div className="text-xs text-gray-500 mt-1">
                                {achievement.progress}/{achievement.maxProgress}
                              </div>
                            </div>
                          </div>
                          {achievement.unlocked && (
                            <Badge className="bg-green-100 text-green-800 text-xs">Unlocked!</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            {/* Learning Resources */}
              <Card className="mb-6 sm:mb-8">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-xl sm:text-2xl">Continue Learning</CardTitle>
                <CardDescription>Resources to improve your farming knowledge</CardDescription>
              </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="text-center p-3 sm:p-4 border rounded-lg">
                      <div className="text-2xl sm:text-3xl mb-2">📚</div>
                      <h3 className="font-semibold mb-2 text-sm sm:text-base">Extension Services</h3>
                      <p className="text-xs sm:text-sm text-gray-600">Connect with local agricultural experts</p>
                    </div>
                    <div className="text-center p-3 sm:p-4 border rounded-lg">
                      <div className="text-2xl sm:text-3xl mb-2">🌱</div>
                      <h3 className="font-semibold mb-2 text-sm sm:text-base">Field Trials</h3>
                      <p className="text-xs sm:text-sm text-gray-600">Test new methods on small plots</p>
                    </div>
                    <div className="text-center p-3 sm:p-4 border rounded-lg">
                      <div className="text-2xl sm:text-3xl mb-2">👥</div>
                      <h3 className="font-semibold mb-2 text-sm sm:text-base">Farmer Groups</h3>
                      <p className="text-xs sm:text-sm text-gray-600">Learn from fellow farmers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button onClick={resetQuiz} size="lg" className="mr-0 sm:mr-4 mb-3 sm:mb-0 w-full sm:w-auto">
                  Take Quiz Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (shuffledQuestions.length === 0) {
    return <div>Loading...</div>;
  }

  // Show start screen if quiz hasn't started
  if (!quizStarted && !quizCompleted) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen pt-24 pb-20 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
                Farming Knowledge Quiz 🌾
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Test your farming knowledge and learn proven methods to enhance your crop yields, 
                improve soil health, and implement sustainable practices for better farm productivity.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              {/* Quiz Info Card */}
              <Card className="mb-8">
                <CardHeader className="text-center p-6">
                  <CardTitle className="text-2xl mb-4">Quiz Overview</CardTitle>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{shuffledQuestions.length}</div>
                      <div className="text-sm text-gray-600">Questions</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">8 Categories</div>
                      <div className="text-sm text-gray-600">Farming Topics</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">Variable</div>
                      <div className="text-sm text-gray-600">Time Limit</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4 mb-6">
                    <h3 className="font-semibold text-lg">What you'll learn:</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Soil management and fertility</li>
                      <li>• Water conservation techniques</li>
                      <li>• Climate-smart agriculture</li>
                      <li>• Crop management strategies</li>
                      <li>• Nutrient and pest management</li>
                    </ul>
                  </div>
                  
                  <div className="text-center">
                    <Button 
                      onClick={handleStartQuiz}
                      size="lg" 
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold w-full sm:w-auto"
                    >
                      🚀 Start Quiz Now
                    </Button>
                    <p className="text-sm text-gray-500 mt-3">
                      Click to begin your farming knowledge assessment
                    </p>
                </div>
              </CardContent>
            </Card>

              {/* Quiz Tips */}
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg">💡 Quiz Tips</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Read each question carefully before selecting an answer</li>
                    <li>• Pay attention to the explanation after each question</li>
                    <li>• This quiz covers essential farming practices for better yields</li>
                    <li>• Use your results to identify areas for improvement</li>
                    <li>• Complete daily to maintain your streak and earn more points!</li>
                    <li>• You can submit the quiz early anytime to see your results</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }

  const currentQ = shuffledQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / shuffledQuestions.length) * 100;

  return (
    <>
      <Navigation />
    <div className="min-h-screen pt-24 pb-20 bg-gradient-to-br from-green-50 to-blue-50">
        {/* Achievement Notification */}
        {showAchievement && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg animate-bounce mx-4 max-w-xs sm:max-w-md text-center">
            {showAchievement}
          </div>
        )}

        {/* Submit Confirmation Modal */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full mx-4">
              <div className="text-center mb-4 sm:mb-6">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">⚠️</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Submit Quiz Early?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Are you sure you want to submit the quiz now? This will:
                </p>
                <ul className="text-left text-xs sm:text-sm text-gray-600 mt-3 space-y-1">
                  <li>• Stop the timer immediately</li>
                  <li>• Calculate your final score</li>
                  <li>• Update your achievements</li>
                  <li>• End the current quiz session</li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={cancelSubmit} 
                  variant="outline" 
                  className="flex-1"
                >
                  Continue Quiz
                </Button>
                <Button 
                  onClick={confirmSubmit} 
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Submit Now
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 sm:px-6">
        {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Farming Knowledge Quiz 🌾
          </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Test your farming knowledge and learn proven methods to enhance your crop yields, 
            improve soil health, and implement sustainable practices for better farm productivity.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="text-center p-3 sm:p-4 bg-white rounded-lg shadow-sm">
                <div className="text-lg sm:text-2xl font-bold text-blue-600">{streak}</div>
                <div className="text-xs sm:text-sm text-gray-600">Day Streak</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-white rounded-lg shadow-sm">
                <div className="text-lg sm:text-2xl font-bold text-green-600">{totalPoints}</div>
                <div className="text-xs sm:text-sm text-gray-600">Total Points</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-white rounded-lg shadow-sm">
                <div className="text-lg sm:text-2xl font-bold text-purple-600">{Math.floor(quizTime / 60)}:{(quizTime % 60).toString().padStart(2, '0')}</div>
                <div className="text-xs sm:text-sm text-gray-600">Time</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-white rounded-lg shadow-sm">
                <div className="text-lg sm:text-2xl font-bold text-orange-600">{userAchievements.filter(a => a.unlocked).length}</div>
                <div className="text-xs sm:text-sm text-gray-600">Achievements</div>
              </div>
            </div>

          {/* Progress Bar */}
            <div className="mb-6 sm:mb-8">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  Question {currentQuestion + 1} of {shuffledQuestions.length}
              </span>
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                {Math.round(progress)}% Complete
              </span>
              </div>
              <Progress value={progress} className="h-2 sm:h-3" />
            </div>

            {/* Submit Quiz Button */}
            <div className="mb-4 sm:mb-6 text-center">
              <Button 
                onClick={handleSubmitQuiz}
                variant="outline" 
                size="lg"
                className="border-orange-300 text-orange-700 hover:bg-orange-50 w-full sm:w-auto"
              >
                <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Submit Quiz Early
              </Button>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 px-4">
                Submit anytime to see your results and achievements
              </p>
          </div>

          {/* Question Card */}
            <Card className="mb-6 sm:mb-8">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
                  <div className="flex flex-wrap gap-2">
                <Badge className={getCategoryColor(currentQ.category)}>
                  {currentQ.category}
                </Badge>
                    <Badge className={getDifficultyColor(currentQ.difficulty)}>
                      {currentQ.difficulty}
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800">
                      {currentQ.points} pts
                    </Badge>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">
                  Score: {score}/{currentQuestion}
                </span>
              </div>
                <CardTitle className="text-lg sm:text-xl md:text-2xl">
                {currentQ.question}
              </CardTitle>
            </CardHeader>
              <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 mb-6">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-3 sm:p-4 text-left border rounded-lg transition-all duration-200 text-sm sm:text-base ${
                      selectedAnswer === index
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                      <span className="font-medium mr-2 sm:mr-3">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </button>
                ))}
              </div>

              {selectedAnswer !== null && (
                <div className="space-y-4">
                  <Separator />
                    <div className={`p-3 sm:p-4 rounded-lg ${
                    selectedAnswer === currentQ.correctAnswer
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center mb-2">
                      {selectedAnswer === currentQ.correctAnswer ? (
                          <span className="text-sm sm:text-base text-green-600 font-semibold">✅ Correct! +{currentQ.points} points</span>
                      ) : (
                          <span className="text-sm sm:text-base text-red-600 font-semibold">❌ Incorrect</span>
                      )}
                      </div>
                      <p className="text-sm sm:text-base text-gray-700">{currentQ.explanation}</p>
                  </div>
                  
                    <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handleNextQuestion} 
                        className="flex-1"
                    size="lg"
                  >
                        {currentQuestion < shuffledQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                      </Button>
                      <Button 
                        onClick={handleSubmitQuiz}
                        variant="outline"
                        size="lg"
                        className="border-orange-300 text-orange-700 hover:bg-orange-50"
                      >
                        Submit Now
                  </Button>
                    </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quiz Tips */}
          <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">💡 Quiz Tips</CardTitle>
            </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                <li>• Read each question carefully before selecting an answer</li>
                <li>• Pay attention to the explanation after each question</li>
                <li>• This quiz covers essential farming practices for better yields</li>
                <li>• Use your results to identify areas for improvement</li>
                  <li>• Complete daily to maintain your streak and earn more points!</li>
                  <li>• You can submit the quiz early anytime to see your results</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
};

export default Quiz;