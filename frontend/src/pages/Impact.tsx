import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Impact = () => {
  const impactStats = [
    { number: "2.5M", label: "Hectares Monitored", icon: "🌾" },
    { number: "15,000+", label: "Farmers Served", icon: "👨‍🌾" },
    { number: "40%", label: "Average Yield Increase", icon: "📈" },
    { number: "50%", label: "Water Usage Reduction", icon: "💧" },
    { number: "60%", label: "Pesticide Reduction", icon: "🌱" },
    { number: "25M", label: "Tons CO₂ Saved", icon: "🌍" }
  ];
const caseStudies = [
  {
    title: "Punjab - India",
    challenge: "Excess irrigation, high costs, and low yields.",
    solution: `🌾 Problem:
Farmers in Punjab were facing excessive irrigation, rising costs, and declining yields.

🎯 Solution:
Adopted sustainable irrigation practices, optimized resource allocation, and implemented cost-efficient farming techniques with digital monitoring.

🌍 Impact:
- 50% reduction in water usage
- 35% increase in crop yields
- $150,000 annual savings`,
    results: [
      "50% reduction in water usage",
      "35% increase in crop yields",
      "$150,000 annual savings"
    ],
    farmSize: "500 hectares",
    crops: ["Wheat", "Rice"]
  },
  {
    title: "Odisha - India",
    challenge: "Inconsistent yields and unsustainable practices.",
    solution: `🌾 Problem:
Farmers in Odisha continued to use unsustainable practices—excessive chemicals, over-irrigation, and mono-cropping—due to habit, limited training, and lack of engaging learning methods.

🎯 Solution:
Built a gamified digital platform that motivates farmers to adopt sustainable practices through interactive challenges, rewards, and community participation.

🌍 Impact:
- 40% improvement in pest detection
- 25% increase in overall yields
- 30% reduction in pesticide use`,
    results: [
      "40% improvement in pest detection",
      "25% increase in overall yields",
      "30% reduction in pesticide use"
    ],
    farmSize: "2,000 hectares",
    crops: ["Sugarcane", "Paddy"]
  },
  {
    title: "Uttar Pradesh - India",
    challenge: "Resource inefficiency and environmental degradation.",
    solution: `🌾 Problem:
Farmers in Uttar Pradesh were experiencing resource inefficiency and increasing environmental degradation.

🎯 Solution:
Introduced interactive quizzes and awareness programs to educate farmers on sustainable agricultural practices and environmental care.

🌍 Impact:
- 60% improvement in resource efficiency
- 45% reduction in environmental impact
- 20% increase in profitability`,
    results: [
      "60% improvement in resource efficiency",
      "45% reduction in environmental impact",
      "20% increase in profitability"
    ],
    farmSize: "5,000 hectares",
    crops: ["Wheat", "Mustard"]
  }
];

  const sustainabilityGoals = [
    {
      goal: "Education of farmers ",
      progress: 75,
      description: "Helping farmers to get a high pay"
    },
    {
      goal: "50% Water Conservation",
      progress: 85,
      description: "Achieving significant water savings across all partner farms"
    },
    {
      goal: "Zero Waste Agriculture",
      progress: 60,
      description: "Implementing circular economy principles in farming operations"
    },
    {
      goal: "Biodiversity Protection",
      progress: 70,
      description: "Supporting ecosystem health through sustainable practices"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our Global <span className="text-primary">Impact</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Measuring success through environmental sustainability, farmer prosperity, and global food security. 
              See how our technology is creating positive change worldwide.
            </p>
          </div>

          {/* Impact Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-20">
            {impactStats.map((stat, index) => (
              <Card key={index} className="text-center hover-lift animate-fade-in-scale">
                <CardContent className="p-6">
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Case Studies */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12">Success Stories</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {caseStudies.map((study, index) => (
                <Card key={index} className="hover-lift animate-fade-in-scale">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{study.farmSize}</Badge>
                      <Badge className="bg-green-100 text-green-800">{study.crops}</Badge>
                    </div>
                    <CardTitle className="text-xl">{study.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Challenge:</h4>
                      <p className="text-sm">{study.challenge}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Solution:</h4>
                      <p className="text-sm">{study.solution}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Results:</h4>
                      <ul className="space-y-1">
                        {study.results.map((result, resultIndex) => (
                          <li key={resultIndex} className="text-sm text-muted-foreground flex items-center">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0"></span>
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sustainability Goals */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12">Sustainability Goals</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {sustainabilityGoals.map((goal, index) => (
                <Card key={index} className="hover-lift animate-fade-in-scale">
                  <CardHeader>
                    <CardTitle className="text-xl">{goal.goal}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-muted-foreground">Progress</span>
                        <span className="text-sm font-bold text-primary">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{goal.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Future Vision */}
          <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Building a Sustainable Future</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our commitment to environmental stewardship and farmer prosperity drives everything we do. 
              Together, we're creating a more sustainable and productive agricultural future.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl mb-2">🌱</div>
                <h3 className="font-semibold mb-2">Environmental Impact</h3>
                <p className="text-sm text-muted-foreground">Reducing carbon footprint and preserving natural resources</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">👨‍🌾</div>
                <h3 className="font-semibold mb-2">Farmer Success</h3>
                <p className="text-sm text-muted-foreground">Increasing yields and profitability for farming communities</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🌍</div>
                <h3 className="font-semibold mb-2">Global Food Security</h3>
                <p className="text-sm text-muted-foreground">Feeding the world through sustainable agriculture</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Impact;