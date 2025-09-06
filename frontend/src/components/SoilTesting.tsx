import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TestTube, MapPin, Calendar, FileText, CheckCircle } from 'lucide-react';

interface SoilTestResult {
  pH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  recommendations: string[];
}

const SoilTesting = () => {
  const [formData, setFormData] = useState({
    farmName: '',
    location: '',
    cropType: '',
    soilType: '',
    previousCrops: '',
    notes: ''
  });
  const [testResult, setTestResult] = useState<SoilTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateTestResult = (): SoilTestResult => {
    // Simulate realistic soil test results
    const pH = 6.2 + Math.random() * 1.6; // 6.2-7.8
    const nitrogen = 15 + Math.random() * 30; // 15-45 ppm
    const phosphorus = 8 + Math.random() * 20; // 8-28 ppm
    const potassium = 80 + Math.random() * 120; // 80-200 ppm
    const organicMatter = 1.5 + Math.random() * 2.5; // 1.5-4.0%

    const recommendations = [];
    
    if (pH < 6.0) {
      recommendations.push("Apply lime to raise soil pH to optimal range (6.0-7.0)");
    } else if (pH > 7.5) {
      recommendations.push("Consider sulfur application to lower soil pH");
    }
    
    if (nitrogen < 25) {
      recommendations.push("Apply nitrogen fertilizer - soil is deficient");
    }
    
    if (phosphorus < 15) {
      recommendations.push("Add phosphorus fertilizer for better root development");
    }
    
    if (potassium < 120) {
      recommendations.push("Apply potassium fertilizer for improved plant health");
    }
    
    if (organicMatter < 2.5) {
      recommendations.push("Add organic compost or manure to improve soil structure");
    }

    if (recommendations.length === 0) {
      recommendations.push("Soil is in good condition! Continue current practices.");
    }

    return {
      pH: Math.round(pH * 10) / 10,
      nitrogen: Math.round(nitrogen),
      phosphorus: Math.round(phosphorus),
      potassium: Math.round(potassium),
      organicMatter: Math.round(organicMatter * 10) / 10,
      recommendations
    };
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';
      
      // First, create a soil test record with the form data
      const soilTestPayload = {
        ph: 6.5 + Math.random() * 1.5, // Simulate realistic values
        nitrogen: 20 + Math.random() * 20,
        phosphorus: 15 + Math.random() * 15,
        potassium: 100 + Math.random() * 100,
        notes: `Soil test for ${formData.farmName} - ${formData.cropType} cultivation`
      };

      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE}/api/v1/farming/soil/tests`, {
        method: 'POST',
        headers,
        body: JSON.stringify(soilTestPayload)
      });

      if (response.ok) {
        const data = await response.json();
        
        // Generate comprehensive test result based on backend data and form inputs
        const testResult = generateTestResult();
        testResult.pH = data.ph;
        testResult.nitrogen = data.nitrogen;
        testResult.phosphorus = data.phosphorus;
        testResult.potassium = data.potassium;
        testResult.recommendations = [data.recommendation];
        
        setTestResult(testResult);
        setStep(3);
      } else if (response.status === 401) {
        // If not authenticated, still show demo results
        const result = generateTestResult();
        result.recommendations.unshift("Note: Please log in to save your soil test results to your account.");
        setTestResult(result);
        setStep(3);
      } else {
        throw new Error('Failed to create soil test');
      }
    } catch (error) {
      console.error('Error submitting soil test:', error);
      // Show demo results on error
      const result = generateTestResult();
      result.recommendations.unshift("Note: Using demo data. Check your connection and try again.");
      setTestResult(result);
      setStep(3);
    }
    setIsLoading(false);
  };

  const getNutrientStatus = (value: number, type: string) => {
    const ranges = {
      nitrogen: { low: 25, high: 35 },
      phosphorus: { low: 15, high: 25 },
      potassium: { low: 120, high: 180 },
      organicMatter: { low: 2.5, high: 3.5 }
    };
    
    if (value < ranges[type as keyof typeof ranges].low) return { status: 'Low', color: 'bg-red-100 text-red-800' };
    if (value > ranges[type as keyof typeof ranges].high) return { status: 'High', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'Optimal', color: 'bg-green-100 text-green-800' };
  };

  const getPHStatus = (pH: number) => {
    if (pH < 6.0) return { status: 'Acidic', color: 'bg-red-100 text-red-800' };
    if (pH > 7.5) return { status: 'Alkaline', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'Optimal', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Soil Testing Service</h2>
        <p className="text-gray-600">Get comprehensive soil analysis and personalized recommendations</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3].map((stepNum) => (
          <div key={stepNum} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= stepNum ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > stepNum ? <CheckCircle className="w-5 h-5" /> : stepNum}
            </div>
            {stepNum < 3 && (
              <div className={`w-16 h-1 mx-2 ${
                step > stepNum ? 'bg-primary' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TestTube className="w-5 h-5 mr-2" />
              Farm Information
            </CardTitle>
            <CardDescription>
              Provide basic information about your farm for accurate soil testing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="farmName">Farm Name</Label>
                <Input
                  id="farmName"
                  value={formData.farmName}
                  onChange={(e) => handleInputChange('farmName', e.target.value)}
                  placeholder="Enter farm name"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, State"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cropType">Current/Planned Crop</Label>
                <Select value={formData.cropType} onValueChange={(value) => handleInputChange('cropType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="corn">Corn</SelectItem>
                    <SelectItem value="cotton">Cotton</SelectItem>
                    <SelectItem value="sugarcane">Sugarcane</SelectItem>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="fruits">Fruits</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="soilType">Soil Type</Label>
                <Select value={formData.soilType} onValueChange={(value) => handleInputChange('soilType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clay">Clay</SelectItem>
                    <SelectItem value="sandy">Sandy</SelectItem>
                    <SelectItem value="loamy">Loamy</SelectItem>
                    <SelectItem value="silty">Silty</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="previousCrops">Previous Crops (Last 2 years)</Label>
              <Input
                id="previousCrops"
                value={formData.previousCrops}
                onChange={(e) => handleInputChange('previousCrops', e.target.value)}
                placeholder="e.g., Wheat, Rice, Corn"
              />
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any specific concerns or observations about your soil..."
                rows={3}
              />
            </div>

            <Button 
              onClick={() => setStep(2)} 
              className="w-full"
              disabled={!formData.farmName || !formData.location || !formData.cropType}
            >
              Continue to Sample Collection
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Sample Collection Guide
            </CardTitle>
            <CardDescription>
              Follow these steps to collect a proper soil sample
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Collection Steps:</h4>
                <div className="space-y-3">
                  {[
                    "Use a clean shovel or soil auger",
                    "Collect samples from 6-8 inches deep",
                    "Take 10-15 samples from different areas",
                    "Mix all samples in a clean bucket",
                    "Remove stones, roots, and debris",
                    "Let soil air-dry for 24 hours"
                  ].map((step, index) => (
                    <div key={index} className="flex items-center">
                      <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                        {index + 1}
                      </span>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">What We Test:</h4>
                <div className="space-y-2">
                  {[
                    "pH Level",
                    "Nitrogen (N)",
                    "Phosphorus (P)",
                    "Potassium (K)",
                    "Organic Matter",
                    "Soil Texture"
                  ].map((test, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm">{test}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Important Notes:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Avoid sampling immediately after fertilizer application</li>
                <li>• Sample at the same time each year for consistency</li>
                <li>• Keep samples in clean, labeled containers</li>
                <li>• Results will be available within 3-5 business days</li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleSubmit} className="flex-1">
                {isLoading ? "Processing Sample..." : "Submit Sample for Testing"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && testResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Soil Test Results
            </CardTitle>
            <CardDescription>
              Analysis completed for {formData.farmName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* pH Level */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">pH Level</span>
                <Badge className={getPHStatus(testResult.pH).color}>
                  {testResult.pH} - {getPHStatus(testResult.pH).status}
                </Badge>
              </div>
              <Progress value={(testResult.pH / 8) * 100} className="h-2" />
            </div>

            {/* Nutrients */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Nitrogen (N)</span>
                  <Badge className={getNutrientStatus(testResult.nitrogen, 'nitrogen').color}>
                    {testResult.nitrogen} ppm
                  </Badge>
                </div>
                <Progress value={(testResult.nitrogen / 50) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Phosphorus (P)</span>
                  <Badge className={getNutrientStatus(testResult.phosphorus, 'phosphorus').color}>
                    {testResult.phosphorus} ppm
                  </Badge>
                </div>
                <Progress value={(testResult.phosphorus / 30) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Potassium (K)</span>
                  <Badge className={getNutrientStatus(testResult.potassium, 'potassium').color}>
                    {testResult.potassium} ppm
                  </Badge>
                </div>
                <Progress value={(testResult.potassium / 200) * 100} className="h-2" />
              </div>
            </div>

            {/* Organic Matter */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Organic Matter</span>
                <Badge className={getNutrientStatus(testResult.organicMatter, 'organicMatter').color}>
                  {testResult.organicMatter}%
                </Badge>
              </div>
              <Progress value={(testResult.organicMatter / 4) * 100} className="h-2" />
            </div>

            {/* Recommendations */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-3">Recommendations:</h4>
              <ul className="space-y-2">
                {testResult.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-green-800">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                New Test
              </Button>
              <Button className="flex-1">
                Download Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SoilTesting;
