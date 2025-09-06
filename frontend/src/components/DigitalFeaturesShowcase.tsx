import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from "framer-motion";
import { 
  TestTube, 
  Satellite, 
  Calendar, 
  CloudRain, 
  Package, 
  Users, 
  Shield, 
  Wheat,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import DigitalFeaturesMenu from './DigitalFeaturesMenu';

const DigitalFeaturesShowcase = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      id: 1,
      title: "Soil Testing",
      description: "Get comprehensive soil analysis with personalized recommendations",
      icon: TestTube,
      color: "bg-green-100 text-green-600",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      id: 2,
      title: "Farm Tagging",
      description: "GPS-based farm field management and digital mapping",
      icon: Satellite,
      color: "bg-blue-100 text-blue-600",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      id: 3,
      title: "Crop Planner",
      description: "AI-powered crop planning with seasonal recommendations",
      icon: Calendar,
      color: "bg-amber-100 text-amber-600",
      gradient: "from-amber-500 to-orange-600"
    },
    {
      id: 4,
      title: "Weather Alerts",
      description: "Real-time weather monitoring and crop protection alerts",
      icon: CloudRain,
      color: "bg-sky-100 text-sky-600",
      gradient: "from-sky-500 to-blue-600"
    },
    {
      id: 5,
      title: "Quality Input Access",
      description: "Direct access to certified seeds, fertilizers, and equipment",
      icon: Package,
      color: "bg-blue-100 text-blue-600",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      id: 6,
      title: "Connect with Experts",
      description: "Direct access to agricultural experts and consultants",
      icon: Users,
      color: "bg-orange-100 text-orange-600",
      gradient: "from-orange-500 to-red-600"
    },
    {
      id: 7,
      title: "Crop Insurance",
      description: "Comprehensive crop insurance with easy claim processing",
      icon: Shield,
      color: "bg-orange-100 text-orange-600",
      gradient: "from-orange-500 to-amber-600"
    },
    {
      id: 8,
      title: "Mandi Rate & Market Linkage",
      description: "Real-time market prices and direct selling platform",
      icon: Wheat,
      color: "bg-green-100 text-green-600",
      gradient: "from-green-500 to-lime-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white via-green-50 to-blue-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-yellow-500 mr-3" />
            <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2">
              Digital Farming Tools
            </Badge>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Complete Digital Solution For Farmers
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Transform your farming operations with our comprehensive suite of digital tools. 
            From soil testing to market linkage, everything you need in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <DigitalFeaturesMenu />
            <Button variant="outline" size="lg" className="rounded-full px-8 py-3">
              View All Features
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <Card className={`h-full cursor-pointer transition-all duration-300 ${
                  hoveredFeature === feature.id 
                    ? 'shadow-2xl scale-105 border-primary' 
                    : 'hover:shadow-lg'
                }`}>
                  <CardHeader className="text-center pb-4">
                    <div className={`mx-auto p-4 rounded-full ${feature.color} mb-4 transition-transform duration-300 ${
                      hoveredFeature === feature.id ? 'scale-110' : ''
                    }`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-lg font-semibold">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-sm leading-relaxed mb-4">
                      {feature.description}
                    </CardDescription>
                    <Button 
                      size="sm" 
                      className={`w-full bg-gradient-to-r ${feature.gradient} hover:opacity-90 transition-opacity`}
                      onClick={() => {
                        // Navigate to the specific feature page
                        const featureRoutes: { [key: number]: string } = {
                          1: '/digital-features?feature=soil-testing',
                          2: '/digital-features?feature=farm-tagging',
                          3: '/digital-features?feature=crop-planner',
                          4: '/digital-features?feature=weather-alerts',
                          5: '/digital-features?feature=quality-input',
                          6: '/digital-features?feature=expert-connect',
                          7: '/digital-features?feature=crop-insurance',
                          8: '/digital-features?feature=mandi-market'
                        };
                        const route = featureRoutes[feature.id];
                        if (route) {
                          window.location.href = route;
                        }
                      }}
                    >
                      Try Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="p-6 bg-white/70 backdrop-blur rounded-2xl shadow-lg">
            <h3 className="text-3xl font-bold text-green-600 mb-2">8+</h3>
            <p className="text-gray-600">Digital Tools</p>
          </div>
          <div className="p-6 bg-white/70 backdrop-blur rounded-2xl shadow-lg">
            <h3 className="text-3xl font-bold text-blue-600 mb-2">24/7</h3>
            <p className="text-gray-600">Access Available</p>
          </div>
          <div className="p-6 bg-white/70 backdrop-blur rounded-2xl shadow-lg">
            <h3 className="text-3xl font-bold text-purple-600 mb-2">100%</h3>
            <p className="text-gray-600">Free to Use</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DigitalFeaturesShowcase;

