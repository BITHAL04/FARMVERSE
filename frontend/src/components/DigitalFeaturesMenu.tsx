import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  X, 
  TestTube, 
  Satellite, 
  Calendar, 
  CloudRain, 
  Package, 
  Users, 
  Shield, 
  Wheat,
  ChevronRight
} from 'lucide-react';
import SoilTesting from './SoilTesting';
import WeatherAlerts from './WeatherAlerts';
import CropPlanner from './CropPlanner';
import FarmTagging from './FarmTagging';
import MandiMarket from './MandiMarket';
import QualityInputAccess from './QualityInputAccess';
import ExpertConnect from './ExpertConnect';
import CropInsurance from './CropInsurance';

const DigitalFeaturesMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const features = [
    {
      id: 'soil-testing',
      title: 'Soil Testing',
      description: 'Comprehensive soil analysis and recommendations',
      icon: TestTube,
      color: 'bg-green-100 text-green-600',
      component: SoilTesting
    },
    {
      id: 'farm-tagging',
      title: 'Farm Tagging',
      description: 'GPS-based farm field management',
      icon: Satellite,
      color: 'bg-blue-100 text-blue-600',
      component: FarmTagging
    },
    {
      id: 'crop-planner',
      title: 'Crop Planner',
      description: 'AI-powered crop planning and recommendations',
      icon: Calendar,
      color: 'bg-amber-100 text-amber-600',
      component: CropPlanner
    },
    {
      id: 'weather-alerts',
      title: 'Weather Alerts',
      description: 'Real-time weather monitoring and alerts',
      icon: CloudRain,
      color: 'bg-sky-100 text-sky-600',
      component: WeatherAlerts
    },
    {
      id: 'quality-input',
      title: 'Quality Input Access',
      description: 'Access to certified seeds and fertilizers',
      icon: Package,
      color: 'bg-blue-100 text-blue-600',
      component: QualityInputAccess
    },
    {
      id: 'expert-connect',
      title: 'Connect with Experts',
      description: 'Direct access to agricultural experts',
      icon: Users,
      color: 'bg-orange-100 text-orange-600',
      component: ExpertConnect
    },
    {
      id: 'crop-insurance',
      title: 'Crop Insurance',
      description: 'Comprehensive crop insurance coverage',
      icon: Shield,
      color: 'bg-orange-100 text-orange-600',
      component: CropInsurance
    },
    {
      id: 'mandi-market',
      title: 'Mandi Rate & Market Linkage',
      description: 'Real-time market prices and selling platform',
      icon: Wheat,
      color: 'bg-green-100 text-green-600',
      component: MandiMarket
    }
  ];

  const openFeature = (featureId: string) => {
    setActiveFeature(featureId);
    setIsMenuOpen(false);
  };

  const closeFeature = () => {
    setActiveFeature(null);
  };

  const renderActiveFeature = () => {
    const feature = features.find(f => f.id === activeFeature);
    if (!feature || !feature.component) return null;
    
    const Component = feature.component;
    return <Component />;
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsMenuOpen(true)}
        className="flex items-center space-x-2"
      >
        <Menu className="w-4 h-4" />
        <span>Digital Tools</span>
      </Button>

      {/* Hamburger Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Digital Farming Tools</h2>
              <Button variant="outline" onClick={() => setIsMenuOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature) => {
                  const IconComponent = feature.icon;
                  return (
                    <Card 
                      key={feature.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => openFeature(feature.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-full ${feature.color}`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Click on any tool above to start using it immediately
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature Component Overlay */}
      {activeFeature && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                {features.find(f => f.id === activeFeature)?.title}
              </h3>
              <Button variant="outline" onClick={closeFeature}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4">
              {renderActiveFeature()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DigitalFeaturesMenu;
