import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Brain, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import waterImage from '@/assets/water-irrigation.jpg';
import pesticideImage from '@/assets/pesticide-spray.jpg';
import dataImage from '@/assets/data-dashboard.jpg';
import istockImage from '@/assets/istockphoto-990892396-1024x1024.jpg';
import { useTranslation } from 'react-i18next';

const challenges = [
	{
		title: 'challenges.items.0.title',
		description:
			'challenges.items.0.description',
		image: waterImage,
		impact: 'challenges.items.0.impact',
	},
	{
		title: 'challenges.items.1.title',
		description:
			'challenges.items.1.description',
		image: pesticideImage,
		impact: 'challenges.items.1.impact',
	},
	{
		title: 'challenges.items.2.title',
		description:
			'challenges.items.2.description',
		image: dataImage,
		impact: 'challenges.items.2.impact',
	},
	{
		title: 'challenges.items.3.title',
		description: 'challenges.items.3.description',
		image: istockImage,
		impact: 'challenges.items.3.impact',
	},
];

const ChallengesSection = () => {
	const navigate = useNavigate();
  const { t } = useTranslation();

	const handleTakeQuiz = () => {
		navigate('/quiz');
	};

	return (
		<section className="py-20 bg-muted/30">
			<div className="container mx-auto px-6">
				<div className="text-center mb-16 animate-fade-in-up">
					<h2 className="text-4xl md:text-5xl font-bold mb-6">
						{t('challenges.titleTop')}
						<span className="block text-primary">{t('challenges.titleBottom')}</span>
					</h2>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
						{t('challenges.subtitle')}
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8 mb-16">
					{challenges.map((challenge, index) => (
						<Card
							key={index}
							className={`hover-lift animate-fade-in-scale group stagger-${index + 1} overflow-hidden`}
						>
							<div className="relative h-48 overflow-hidden">
								<img
									src={challenge.image}
									alt={t(challenge.title)}
									className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
								/>
								<div className="absolute inset-0 bg-black/40"></div>
								<div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-semibold">
									{t(challenge.impact)}
								</div>
							</div>

							<CardHeader>
								<CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
									{t(challenge.title)}
								</CardTitle>
							</CardHeader>

							<CardContent>
								<CardDescription className="text-base leading-relaxed">
									{t(challenge.description)}
								</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Quiz Challenge Section */}
				<div className="text-center">
					<Card className="max-w-3xl mx-auto bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
						<CardHeader className="text-center">
							<div className="flex items-center justify-center mb-4">
								<Brain className="w-8 h-8 text-green-600 mr-3" />
								<Target className="w-8 h-8 text-blue-600 mr-3" />
								<Trophy className="w-8 h-8 text-yellow-600" />
							</div>
							<CardTitle className="text-3xl text-green-800 mb-4">
								Test Your Farming Knowledge! 🌾
							</CardTitle>
							<CardDescription className="text-green-700 text-lg">
								Think you know how to solve these farming challenges? Take our comprehensive quiz to test your knowledge and learn proven solutions!
							</CardDescription>
						</CardHeader>
						<CardContent className="text-center">
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
								<div className="text-center p-3 bg-white/50 rounded-lg">
									<div className="text-2xl font-bold text-blue-600">8</div>
									<div className="text-sm text-gray-600">Categories</div>
								</div>
								<div className="text-center p-3 bg-white/50 rounded-lg">
									<div className="text-2xl font-bold text-green-600">25+</div>
									<div className="text-sm text-gray-600">Questions</div>
								</div>
								<div className="text-center p-3 bg-white/50 rounded-lg">
									<div className="text-2xl font-bold text-purple-600">Instant</div>
									<div className="text-sm text-gray-600">Results</div>
								</div>
							</div>
							<Button 
								size="lg" 
								className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold"
								onClick={handleTakeQuiz}
							>
								🚀 Start Quiz Challenge
							</Button>
							<p className="text-sm text-gray-600 mt-3">
								Challenge yourself and compete with fellow farmers!
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
};

export default ChallengesSection;