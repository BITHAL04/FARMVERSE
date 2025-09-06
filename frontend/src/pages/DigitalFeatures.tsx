import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from "framer-motion";
import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, TestTube, Satellite, Calendar, CloudRain, Package, Users, Shield, Wheat } from 'lucide-react';
import SoilTesting from '@/components/SoilTesting';
import WeatherAlerts from '@/components/WeatherAlerts';
import CropPlanner from '@/components/CropPlanner';
import FarmTagging from '@/components/FarmTagging';
import MandiMarket from '@/components/MandiMarket';
import ExpertConnect from '@/components/ExpertConnect';
import QualityInputAccess from '@/components/QualityInputAccess';
import CropInsurance from '@/components/CropInsurance';

const DigitalFeatures = () => {
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  // Handle URL parameters to automatically open specific features
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const feature = urlParams.get('feature');
    
    if (feature) {
      const featureMap: { [key: string]: string } = {
        'soil-testing': 'soil-testing',
        'farm-tagging': 'farm-tagging',
        'crop-planner': 'crop-planner',
        'weather-alerts': 'weather-alerts',
        'quality-input': 'quality-input',
        'expert-connect': 'expert-connect',
        'crop-insurance': 'crop-insurance',
        'mandi-market': 'mandi-market'
      };
      
      const componentName = featureMap[feature];
      if (componentName) {
        setActiveComponent(componentName);
      }
    }
  }, []);

  const features = [
    {
      id: 1,
      title: "Soil Testing",
      description: "Comprehensive soil analysis to determine nutrient levels, pH, and soil health for optimal crop planning.",
      icon: TestTube,
      color: "bg-green-100 text-green-600",
      details: {
        benefits: ["Nutrient analysis", "pH level testing", "Organic matter content", "Soil texture analysis"],
        process: ["Sample collection guidance", "Lab testing", "Detailed report", "Fertilizer recommendations"],
        pricing: "Starting from ₹500 per sample"
      }
    },
    {
      id: 2,
      title: "Farm Tagging",
      description: "GPS-based farm boundary mapping and digital tagging system for precise farm management.",
      icon: Satellite,
      color: "bg-blue-100 text-blue-600",
      details: {
        benefits: ["GPS boundary mapping", "Field identification", "Area calculation", "Digital farm records"],
        process: ["GPS survey", "Boundary marking", "Digital mapping", "Farm registration"],
        pricing: "₹200 per acre mapping"
      }
    },
    {
      id: 3,
      title: "Crop Planner",
      description: "AI-powered crop planning tool that suggests optimal crops based on soil, climate, and market conditions.",
      icon: Calendar,
      color: "bg-amber-100 text-amber-600",
      details: {
        benefits: ["Seasonal planning", "Crop rotation", "Market analysis", "Yield prediction"],
        process: ["Soil analysis input", "Climate assessment", "Market research", "Plan generation"],
        pricing: "Free basic plan, Premium ₹1000/month"
      }
    },
    {
      id: 4,
      title: "Weather Alerts",
      description: "Real-time weather monitoring and alerts to protect crops from adverse weather conditions.",
      icon: CloudRain,
      color: "bg-sky-100 text-sky-600",
      details: {
        benefits: ["Real-time weather", "Storm alerts", "Rainfall prediction", "Temperature monitoring"],
        process: ["Weather station setup", "Data collection", "Alert system", "Mobile notifications"],
        pricing: "Free with basic alerts, Premium ₹500/month"
      }
    },
    {
      id: 5,
      title: "Access to Quality Input",
      description: "Direct access to certified seeds, fertilizers, and agricultural inputs from trusted suppliers.",
      icon: Package,
      color: "bg-blue-100 text-blue-600",
      details: {
        benefits: ["Certified seeds", "Quality fertilizers", "Pesticide access", "Equipment rental"],
        process: ["Supplier verification", "Quality testing", "Direct delivery", "Price comparison"],
        pricing: "Market rates with 5% discount"
      }
    },
    {
      id: 6,
      title: "Connect with Experts",
      description: "Direct access to agricultural experts, agronomists, and farming consultants for personalized advice.",
      icon: Users,
      color: "bg-orange-100 text-orange-600",
      details: {
        benefits: ["Expert consultation", "Video calls", "Field visits", "Problem diagnosis"],
        process: ["Expert selection", "Appointment booking", "Consultation", "Follow-up support"],
        pricing: "₹500-2000 per consultation"
      }
    },
    {
      id: 7,
      title: "Crop Insurance",
      description: "Comprehensive crop insurance coverage with easy claim processing and digital documentation.",
      icon: Shield,
      color: "bg-orange-100 text-orange-600",
      details: {
        benefits: ["Weather protection", "Disease coverage", "Market price protection", "Quick claims"],
        process: ["Policy selection", "Premium calculation", "Digital enrollment", "Claim processing"],
        pricing: "2-5% of crop value annually"
      }
    },
    {
      id: 8,
      title: "Mandi Rate and Market Linkage",
      description: "Real-time market prices and direct selling platform to connect farmers with buyers and mandis.",
      icon: Wheat,
      color: "bg-green-100 text-green-600",
      details: {
        benefits: ["Live price updates", "Direct selling", "Mandi connectivity", "Price forecasting"],
        process: ["Price monitoring", "Listing products", "Buyer matching", "Transaction support"],
        pricing: "2% commission on sales"
      }
    }
  ];

  const toggleExpanded = (id: number) => {
    setExpandedFeature(expandedFeature === id ? null : id);
  };

  const openComponent = (componentName: string) => {
    setActiveComponent(componentName);
  };

  const closeComponent = () => {
    setActiveComponent(null);
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'soil-testing':
        return <SoilTesting />;
      case 'weather-alerts':
        return <WeatherAlerts />;
      case 'crop-planner':
        return <CropPlanner />;
      case 'farm-tagging':
        return <FarmTagging />;
      case 'mandi-market':
        return <MandiMarket />;
      case 'quality-input':
        return <QualityInputAccess />;
      case 'expert-connect':
        return <ExpertConnect />;
      case 'crop-insurance':
        return <CropInsurance />;
      default:
        return null;
    }
  };

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
              Digital Solution For Farmers
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Comprehensive digital tools and services designed to modernize farming operations, 
              increase productivity, and connect farmers with markets and experts.
            </p>
          </motion.div>

          {/* Features List */}
          <div className="max-w-4xl mx-auto space-y-4">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const isExpanded = expandedFeature === feature.id;
              
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      isExpanded ? 'shadow-xl border-primary' : 'hover:border-primary/50'
                    }`}
                    onClick={() => toggleExpanded(feature.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-full ${feature.color}`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {feature.title}
                            </h3>
                            <p className="text-gray-600 mt-1">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="text-xs">
                            {feature.details.pricing}
                          </Badge>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-6 pt-6 border-t border-gray-200"
                        >
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Key Benefits:</h4>
                              <ul className="space-y-2">
                                {feature.details.benefits.map((benefit, idx) => (
                                  <li key={idx} className="flex items-center text-sm text-gray-600">
                                    <span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
                                    {benefit}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Process:</h4>
                              <ul className="space-y-2">
                                {feature.details.process.map((step, idx) => (
                                  <li key={idx} className="flex items-center text-sm text-gray-600">
                                    <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-semibold mr-3 flex-shrink-0">
                                      {idx + 1}
                                    </span>
                                    {step}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <Button 
                              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                              onClick={() => {
                                const componentMap: { [key: number]: string } = {
                                  1: 'soil-testing',
                                  2: 'farm-tagging',
                                  3: 'crop-planner',
                                  4: 'weather-alerts',
                                  5: 'quality-input',
                                  6: 'expert-connect',
                                  7: 'crop-insurance',
                                  8: 'mandi-market'
                                };
                                const component = componentMap[feature.id];
                                if (component) {
                                  openComponent(component);
                                }
                              }}
                            >
                              Try Now
                            </Button>
                            <Button variant="outline">
                              Learn More
                            </Button>
                            <Button variant="ghost" size="sm">
                              View Demo
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* CTA Section */}
          <motion.div 
            className="text-center mt-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-3xl shadow-lg p-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Ready to Digitize Your Farming?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of farmers who have transformed their operations with our comprehensive digital solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg px-8 py-3 rounded-full">
                Start Your Digital Journey
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 py-3">
                Schedule a Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Active Component Overlay */}
      {activeComponent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                {activeComponent === 'soil-testing' && 'Soil Testing'}
                {activeComponent === 'weather-alerts' && 'Weather Alerts'}
                {activeComponent === 'crop-planner' && 'Crop Planner'}
                {activeComponent === 'farm-tagging' && 'Farm Tagging'}
                {activeComponent === 'quality-input' && 'Quality Input Access'}
                {activeComponent === 'expert-connect' && 'Connect with Experts'}
                {activeComponent === 'crop-insurance' && 'Crop Insurance'}
                {activeComponent === 'mandi-market' && 'Mandi Rate & Market Linkage'}
              </h3>
              <Button variant="outline" onClick={closeComponent}>
                Close
              </Button>
            </div>
            <div className="p-4">
              {renderActiveComponent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalFeatures;
