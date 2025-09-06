import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Star, TrendingUp, Users, Award, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface TopFarmer {
  id: string;
  name: string;
  avatar: string;
  achievement: string;
  score: number;
  category: 'quiz-champion' | 'consistent-learner' | 'community-contributor';
  badge: string;
  description: string;
  stats: {
    quizzesTaken: number;
    averageScore: number;
    streakDays: number;
    totalPoints: number;
  };
}

const mockTopFarmers: TopFarmer[] = [
  {
    id: '1',
    name: 'Rajesh Patel',
    avatar: '👨‍🌾',
    achievement: 'Quiz Champion',
    score: 98,
    category: 'quiz-champion',
    badge: '🏆',
    description: 'Consistently scores above 95% and helps other farmers learn',
    stats: {
      quizzesTaken: 15,
      averageScore: 96.5,
      streakDays: 12,
      totalPoints: 1450
    }
  },
  {
    id: '2',
    name: 'Priya Sharma',
    avatar: '👩‍🌾',
    achievement: 'Most Consistent Learner',
    score: 92,
    category: 'consistent-learner',
    badge: '⭐',
    description: 'Takes quizzes daily and maintains excellent learning habits',
    stats: {
      quizzesTaken: 28,
      averageScore: 89.2,
      streakDays: 25,
      totalPoints: 2100
    }
  },
  {
    id: '3',
    name: 'Amit Kumar',
    avatar: '👨‍🌾',
    achievement: 'Community Contributor',
    score: 88,
    category: 'community-contributor',
    badge: '🌟',
    description: 'Shares farming tips and encourages fellow farmers to participate',
    stats: {
      quizzesTaken: 22,
      averageScore: 85.8,
      streakDays: 18,
      totalPoints: 1750
    }
  }
];

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'quiz-champion': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'consistent-learner': 'bg-blue-100 text-blue-800 border-blue-200',
    'community-contributor': 'bg-purple-100 text-purple-800 border-purple-200'
  };
  return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const getCategoryIcon = (category: string) => {
  const icons: Record<string, React.ReactNode> = {
    'quiz-champion': <Trophy className="w-5 h-5" />,
    'consistent-learner': <TrendingUp className="w-5 h-5" />,
    'community-contributor': <Users className="w-5 h-5" />
  };
  return icons[category] || <Star className="w-5 h-5" />;
};

const FarmerSpotlight = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleTakeQuiz = () => {
    navigate('/quiz');
  };

  const handleViewLeaderboard = () => {
    // For now, redirect to quiz page, can be updated later for leaderboard
    navigate('/quiz');
  };

  const handleViewChallenge = () => {
    // For now, redirect to quiz page, can be updated later for challenge details
    navigate('/quiz');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-yellow-500 mr-3" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              {t('farmer.title')}
            </h2>
            <Star className="w-8 h-8 text-yellow-500 ml-3" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('farmer.subtitle')}
          </p>
        </div>

        {/* Top 3 Farmers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {mockTopFarmers.map((farmer, index) => (
            <Card 
              key={farmer.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                index === 0 ? 'ring-2 ring-yellow-400 shadow-lg' : ''
              }`}
            >
              {/* Position Badge */}
              <div className={`absolute -top-2 -right-2 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                index === 0 ? 'bg-yellow-500' : 
                index === 1 ? 'bg-gray-400' : 'bg-orange-600'
              }`}>
                {index === 0 ? '1st' : index === 1 ? '2nd' : '3rd'}
              </div>

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="text-6xl">{farmer.avatar}</div>
                </div>
                <div className="flex items-center justify-center mb-2">
                  <span className="text-2xl mr-2">{farmer.badge}</span>
                  <CardTitle className="text-xl">{farmer.name}</CardTitle>
                </div>
                <Badge className={`${getCategoryColor(farmer.category)} border`}>
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(farmer.category)}
                    {t(
                      farmer.category === 'quiz-champion' ? 'farmer.achievements.quizChampion' :
                      farmer.category === 'consistent-learner' ? 'farmer.achievements.consistentLearner' :
                      'farmer.achievements.communityContributor'
                    )}
                  </div>
                </Badge>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 text-center mb-4">
                  {t(
                    farmer.category === 'quiz-champion' ? 'farmer.achievements.desc1' :
                    farmer.category === 'consistent-learner' ? 'farmer.achievements.desc2' :
                    'farmer.achievements.desc3'
                  )}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-primary">{farmer.stats.quizzesTaken}</div>
                    <div className="text-xs text-gray-600">{t('farmer.labels.quizzes')}</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{farmer.stats.averageScore}%</div>
                    <div className="text-xs text-gray-600">{t('farmer.labels.avgScore')}</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{farmer.stats.streakDays}</div>
                    <div className="text-xs text-gray-600">{t('farmer.labels.dayStreak')}</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">{farmer.stats.totalPoints}</div>
                    <div className="text-xs text-gray-600">{t('farmer.labels.totalPoints')}</div>
                  </div>
                </div>

                {/* Score Display */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {farmer.score}%
                  </div>
                  <div className="text-sm text-gray-500">{t('farmer.labels.latestQuizScore')}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Community Stats */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t('farmer.labels.communityTitle')}</CardTitle>
            <CardDescription>
              {t('farmer.labels.communitySubtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">1,247</div>
                <div className="text-gray-600">{t('farmer.labels.quizzesTaken')}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">89.3%</div>
                <div className="text-gray-600">{t('farmer.labels.averageScore')}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">342</div>
                <div className="text-gray-600">{t('farmer.labels.activeFarmers')}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">156</div>
                <div className="text-gray-600">{t('farmer.labels.dayStreaks')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('farmer.labels.readyTitle')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('farmer.labels.readySubtitle')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600" onClick={handleTakeQuiz}>
              <Target className="w-5 h-5 mr-2" />
              {t('farmer.labels.takeQuizNow')}
            </Button>
            <Button variant="outline" size="lg" onClick={handleViewLeaderboard}>
              <TrendingUp className="w-5 h-5 mr-2" />
              {t('farmer.labels.viewLeaderboard')}
            </Button>
          </div>
        </div>

        {/* Weekly Challenge */}
        <Card className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-800">{t('farmer.labels.weeklyChallenge')}</CardTitle>
            <CardDescription className="text-green-700">
              {t('farmer.labels.weeklyChallengeDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-3xl">🎯</div>
              <div className="text-2xl font-bold text-green-800">{t('farmer.labels.weeklyChallengeStats')}</div>
              <div className="text-3xl">🏆</div>
            </div>
            <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-100" onClick={handleViewChallenge}>
              {t('farmer.labels.viewChallenge')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FarmerSpotlight;
