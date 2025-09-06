import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from "framer-motion";

const Solutions = () => {
  const solutions = [
    {
      title: "Smart Irrigation Systems",
      description: "AI-powered irrigation that delivers precise water amounts based on real-time soil and weather data.",
      features: ["Soil moisture sensors", "Weather integration", "Mobile app control", "Water usage analytics"],
      savings: "Save up to 50% water",
      category: "Water Management"
    },
    {
      title: "Gamification for Farmers - Crop Challenges",
      description: "Engage farmers through crop growth challenges, daily tasks, and community rewards to improve productivity.",
      features: ["Daily farming missions", "Achievement badges", "Point-based rewards", "Community crop challenges"],
      savings: "Boost engagement & yields",
      category: "Gamification"
    },
    {
      title: "AI Analytics Platform",
      description: "Machine learning platform that predicts optimal planting times, harvest schedules, and crop diseases.",
      features: ["Predictive analytics", "Disease detection", "Yield forecasting", "Market price integration"],
      savings: "Optimize planning",
      category: "Analytics"
    },
    {
      title: "Gamification for Farmers - Real-time Quiz",
      description: "Interactive quizzes to enhance farmers’ knowledge about crops, weather, and market practices with live leaderboards.",
      features: ["Real-time quizzes", "Knowledge-based rewards", "Live leaderboards", "Skill ranking system"],
      savings: "Improve knowledge & decision-making",
      category: "Gamification"
    },
    {
      title: "Connection with Top Agri Marketplaces",
      description: "Get complete assistance from industry experts and access to leading agricultural marketplaces.",
      features: ["Expert consultation", "Marketplace integration", "Fair price access", "Supply chain support"],
      savings: "Boost productivity 40%",
      category: "Market Access"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-blue-50">
      <Navigation />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Our Solutions
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Comprehensive agricultural technology solutions designed to transform your farming operations 
              and maximize both efficiency and sustainability.
            </p>
          </motion.div>

          {/* Solutions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
            {solutions.map((solution, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
              >
                <Card className="hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col rounded-2xl border border-gray-100 bg-white/70 backdrop-blur group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-xs px-3 py-1 rounded-full">{solution.category}</Badge>
                      <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white text-xs px-3 py-1 rounded-full shadow">
                        {solution.savings}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {solution.title}
                    </CardTitle>
                    <CardDescription className="text-base mt-2 leading-relaxed">
                      {solution.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col">
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3 text-sm text-gray-700">Key Features:</h4>
                      <ul className="space-y-2">
                        {solution.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="text-sm text-muted-foreground flex items-center">
                            <span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div 
            className="text-center bg-gradient-to-r from-green-100 to-blue-100 rounded-3xl shadow-lg p-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Ready to Transform Your Farm?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of farmers who have already revolutionized their operations with our smart farming solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg px-8 py-3 rounded-full">
                Get in Touch with Our Expert Team
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 py-3">
                Explore All Solutions
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Solutions;