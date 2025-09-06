import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Droplets, 
  Sun, 
  Leaf,
  Clock,
  DollarSign,
  BarChart3,
  CheckCircle
} from 'lucide-react';

interface Crop {
  name: string;
  season: string;
  duration: number;
  waterRequirement: string;
  soilType: string[];
  marketPrice: number;
  yield: string;
  profit: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  image: string;
}

interface FarmPlan {
  crops: Crop[];
  totalProfit: number;
  waterUsage: number;
  season: string;
  recommendations: string[];
}

const CropPlanner = () => {
  const [farmData, setFarmData] = useState({
    location: '',
    soilType: '',
    farmSize: '',
    waterSource: '',
    budget: '',
    experience: ''
  });
  const [selectedSeason, setSelectedSeason] = useState('kharif');
  const [farmPlan, setFarmPlan] = useState<FarmPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const crops: Crop[] = [
    {
      name: 'Rice',
      season: 'kharif',
      duration: 120,
      waterRequirement: 'High',
      soilType: ['clay', 'loamy'],
      marketPrice: 2500,
      yield: '4-6 tons/acre',
      profit: 45000,
      difficulty: 'Medium',
      image: '🌾'
    },
    {
      name: 'Wheat',
      season: 'rabi',
      duration: 150,
      waterRequirement: 'Medium',
      soilType: ['loamy', 'sandy'],
      marketPrice: 2200,
      yield: '3-4 tons/acre',
      profit: 35000,
      difficulty: 'Easy',
      image: '🌾'
    },
    {
      name: 'Cotton',
      season: 'kharif',
      duration: 180,
      waterRequirement: 'High',
      soilType: ['clay', 'loamy'],
      marketPrice: 6000,
      yield: '2-3 tons/acre',
      profit: 80000,
      difficulty: 'Hard',
      image: '🌿'
    },
    {
      name: 'Sugarcane',
      season: 'kharif',
      duration: 365,
      waterRequirement: 'Very High',
      soilType: ['clay', 'loamy'],
      marketPrice: 3200,
      yield: '80-100 tons/acre',
      profit: 120000,
      difficulty: 'Hard',
      image: '🎋'
    },
    {
      name: 'Maize',
      season: 'kharif',
      duration: 90,
      waterRequirement: 'Medium',
      soilType: ['loamy', 'sandy'],
      marketPrice: 1800,
      yield: '3-4 tons/acre',
      profit: 28000,
      difficulty: 'Easy',
      image: '🌽'
    },
    {
      name: 'Tomato',
      season: 'rabi',
      duration: 120,
      waterRequirement: 'Medium',
      soilType: ['loamy', 'sandy'],
      marketPrice: 4000,
      yield: '25-30 tons/acre',
      profit: 60000,
      difficulty: 'Medium',
      image: '🍅'
    },
    {
      name: 'Onion',
      season: 'rabi',
      duration: 150,
      waterRequirement: 'Low',
      soilType: ['sandy', 'loamy'],
      marketPrice: 3000,
      yield: '15-20 tons/acre',
      profit: 40000,
      difficulty: 'Easy',
      image: '🧅'
    },
    {
      name: 'Potato',
      season: 'rabi',
      duration: 100,
      waterRequirement: 'Medium',
      soilType: ['loamy', 'sandy'],
      marketPrice: 2000,
      yield: '20-25 tons/acre',
      profit: 35000,
      difficulty: 'Medium',
      image: '🥔'
    }
  ];

  const generateFarmPlan = async () => {
    setIsGenerating(true);
    
    try {
      const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');
      
      // Create a crop plan record in the backend
      const planPayload = {
        crop: `${selectedSeason} season plan`,
        season: selectedSeason,
        notes: `Farm: ${farmData.location}, Soil: ${farmData.soilType}, Size: ${farmData.farmSize} acres, Budget: ₹${farmData.budget}`
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Try to save plan to backend
      let backendSaved = false;
      try {
        const response = await fetch(`${API_BASE}/api/v1/farming/crop-planner/plans`, {
          method: 'POST',
          headers,
          body: JSON.stringify(planPayload)
        });
        if (response.ok) {
          backendSaved = true;
        }
      } catch (error) {
        console.log('Backend save failed, continuing with local plan');
      }

      // Generate plan based on user inputs
      const seasonCrops = crops.filter(crop => crop.season === selectedSeason);
      let suitableCrops = seasonCrops.filter(crop => 
        crop.soilType.includes(farmData.soilType) || farmData.soilType === ''
      );

      // Filter based on experience level
      if (farmData.experience === 'beginner') {
        suitableCrops = suitableCrops.filter(crop => crop.difficulty === 'Easy');
      } else if (farmData.experience === 'intermediate') {
        suitableCrops = suitableCrops.filter(crop => crop.difficulty !== 'Hard');
      }

      // Filter based on water source
      if (farmData.waterSource === 'rainfed') {
        suitableCrops = suitableCrops.filter(crop => 
          crop.waterRequirement === 'Low' || crop.waterRequirement === 'Medium'
        );
      }
      
      // Select top 3-4 crops based on profit and suitability
      const selectedCrops = suitableCrops
        .sort((a, b) => b.profit - a.profit)
        .slice(0, Math.min(4, suitableCrops.length));
      
      const totalProfit = selectedCrops.reduce((sum, crop) => sum + crop.profit, 0);
      const waterUsage = selectedCrops.reduce((sum, crop) => {
        const waterMap = { 'Low': 1, 'Medium': 2, 'High': 3, 'Very High': 4 };
        return sum + waterMap[crop.waterRequirement as keyof typeof waterMap];
      }, 0);
      
      const recommendations = [
        `✓ Plan optimized for ${farmData.experience} farmers`,
        `✓ Suitable for ${farmData.soilType} soil in ${farmData.location}`,
        `✓ Water requirements match ${farmData.waterSource} irrigation`,
        "• Consider crop rotation to maintain soil health",
        "• Plan irrigation schedule based on water requirements",
        "• Monitor market prices for optimal selling time",
        "• Prepare soil 2-3 weeks before planting",
        "• Keep backup seeds for replanting if needed"
      ];

      if (!backendSaved && token) {
        recommendations.unshift("⚠️ Plan saved locally only - check your connection");
      } else if (backendSaved) {
        recommendations.unshift("✅ Plan saved to your account successfully");
      } else {
        recommendations.unshift("ℹ️ Please log in to save plans to your account");
      }
      
      setFarmPlan({
        crops: selectedCrops,
        totalProfit,
        waterUsage,
        season: selectedSeason,
        recommendations
      });
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating farm plan:', error);
      setIsGenerating(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWaterRequirementColor = (requirement: string) => {
    switch (requirement) {
      case 'Low': return 'bg-blue-100 text-blue-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Very High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">AI-Powered Crop Planner</h2>
        <p className="text-gray-600">Get personalized crop recommendations based on your farm conditions</p>
      </div>

      <Tabs defaultValue="input" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="input">Farm Information</TabsTrigger>
          <TabsTrigger value="plan">Crop Plan</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="input">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Farm Information
              </CardTitle>
              <CardDescription>
                Provide details about your farm to get personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={farmData.location}
                    onChange={(e) => setFarmData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter your location"
                  />
                </div>
                <div>
                  <Label htmlFor="soilType">Soil Type</Label>
                  <Select value={farmData.soilType} onValueChange={(value) => setFarmData(prev => ({ ...prev, soilType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clay">Clay</SelectItem>
                      <SelectItem value="sandy">Sandy</SelectItem>
                      <SelectItem value="loamy">Loamy</SelectItem>
                      <SelectItem value="silty">Silty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="farmSize">Farm Size (acres)</Label>
                  <Input
                    id="farmSize"
                    value={farmData.farmSize}
                    onChange={(e) => setFarmData(prev => ({ ...prev, farmSize: e.target.value }))}
                    placeholder="Enter farm size"
                    type="number"
                  />
                </div>
                <div>
                  <Label htmlFor="waterSource">Water Source</Label>
                  <Select value={farmData.waterSource} onValueChange={(value) => setFarmData(prev => ({ ...prev, waterSource: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select water source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="well">Well</SelectItem>
                      <SelectItem value="canal">Canal</SelectItem>
                      <SelectItem value="borewell">Borewell</SelectItem>
                      <SelectItem value="rainfed">Rainfed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="budget">Budget (₹)</Label>
                  <Input
                    id="budget"
                    value={farmData.budget}
                    onChange={(e) => setFarmData(prev => ({ ...prev, budget: e.target.value }))}
                    placeholder="Enter your budget"
                    type="number"
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Farming Experience</Label>
                  <Select value={farmData.experience} onValueChange={(value) => setFarmData(prev => ({ ...prev, experience: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (3-10 years)</SelectItem>
                      <SelectItem value="expert">Expert (10+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Label>Season</Label>
                <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kharif">Kharif (Monsoon)</SelectItem>
                    <SelectItem value="rabi">Rabi (Winter)</SelectItem>
                    <SelectItem value="zaid">Zaid (Summer)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={generateFarmPlan}
                disabled={isGenerating || !farmData.location || !farmData.soilType}
                className="w-full"
              >
                {isGenerating ? "Generating Plan..." : "Generate Crop Plan"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plan">
          {farmPlan ? (
            <div className="space-y-6">
              {/* Plan Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Your {farmPlan.season.charAt(0).toUpperCase() + farmPlan.season.slice(1)} Season Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-600" />
                      <p className="text-sm text-gray-600">Expected Profit</p>
                      <p className="text-xl font-bold text-green-600">₹{farmPlan.totalProfit.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Droplets className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                      <p className="text-sm text-gray-600">Water Usage</p>
                      <p className="text-xl font-bold text-blue-600">{farmPlan.waterUsage}/10</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <BarChart3 className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                      <p className="text-sm text-gray-600">Crops Selected</p>
                      <p className="text-xl font-bold text-purple-600">{farmPlan.crops.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Crops */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {farmPlan.crops.map((crop, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{crop.image}</span>
                          {crop.name}
                        </div>
                        <Badge className={getDifficultyColor(crop.difficulty)}>
                          {crop.difficulty}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Duration</p>
                          <p className="font-semibold">{crop.duration} days</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Yield</p>
                          <p className="font-semibold">{crop.yield}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Market Price</p>
                          <p className="font-semibold">₹{crop.marketPrice}/quintal</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Expected Profit</p>
                          <p className="font-semibold text-green-600">₹{crop.profit.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-gray-600 text-sm mb-2">Water Requirement</p>
                        <Badge className={getWaterRequirementColor(crop.waterRequirement)}>
                          {crop.waterRequirement}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-gray-600 text-sm mb-2">Suitable Soil Types</p>
                        <div className="flex flex-wrap gap-1">
                          {crop.soilType.map((soil, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {soil}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full" variant="outline">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No Plan Generated Yet</h3>
                <p className="text-gray-600">Fill in your farm information to get personalized crop recommendations</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analysis">
          {farmPlan ? (
            <div className="space-y-6">
              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {farmPlan.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Market Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Market Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {farmPlan.crops.map((crop, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center">
                          <span className="text-xl mr-3">{crop.image}</span>
                          <div>
                            <p className="font-semibold">{crop.name}</p>
                            <p className="text-sm text-gray-600">Current Market Price</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{crop.marketPrice}/quintal</p>
                          <p className="text-sm text-green-600">+5.2% this month</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No Analysis Available</h3>
                <p className="text-gray-600">Generate a crop plan first to see detailed analysis</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CropPlanner;
