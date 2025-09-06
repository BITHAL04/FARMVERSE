import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  FileText, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  CheckCircle,
  AlertTriangle,
  Download,
  Upload,
  Clock,
  MapPin,
  Phone,
  Target
} from 'lucide-react';

interface InsurancePlan {
  id: string;
  provider: string;
  name: string;
  coverage: string[];
  premium: string;
  claimRatio: string;
  maxCoverage: number;
  subsidyAvailable: boolean;
  features: string[];
  exclusions: string[];
  popular: boolean;
}

interface Policy {
  id: string;
  policyNumber: string;
  provider: string;
  crop: string;
  area: number;
  coverage: number;
  premium: number;
  status: 'active' | 'expired' | 'claimed' | 'pending';
  startDate: Date;
  endDate: Date;
  claimAmount?: number;
}

interface Claim {
  id: string;
  policyNumber: string;
  claimType: string;
  damageType: string;
  reportedDate: Date;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'paid';
  claimAmount: number;
  assessmentDate?: Date;
}

const CropInsurance = () => {
  const [insurancePlans, setInsurancePlans] = useState<InsurancePlan[]>([]);
  const [myPolicies, setMyPolicies] = useState<Policy[]>([]);
  const [myClaims, setMyClaims] = useState<Claim[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<InsurancePlan | null>(null);
  const [applicationForm, setApplicationForm] = useState({
    crop: '',
    area: '',
    location: '',
    soilType: '',
    sowingDate: '',
    expectedHarvest: '',
    bankAccount: '',
    adhaar: ''
  });
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [claimForm, setClaimForm] = useState({
    policyNumber: '',
    damageType: '',
    damageDescription: '',
    estimatedLoss: '',
    incidentDate: ''
  });
  const [showClaimForm, setShowClaimForm] = useState(false);

  useEffect(() => {
    fetchInsurancePlans();
    loadMyPolicies();
    loadMyClaims();
  }, []);

  const fetchInsurancePlans = async () => {
    try {
      const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE}/api/v1/features/crop-insurance`);
      
      if (response.ok) {
        const data = await response.json();
        const mappedPlans: InsurancePlan[] = data.data.insurance_plans.map((plan: any, index: number) => ({
          id: index.toString(),
          provider: plan.provider,
          name: `${plan.provider} Crop Shield`,
          coverage: plan.coverage.split(', '),
          premium: plan.premium,
          claimRatio: plan.claim_ratio,
          maxCoverage: Math.floor(Math.random() * 500000) + 100000,
          subsidyAvailable: true,
          features: generateFeatures(plan.coverage),
          exclusions: ['War damage', 'Nuclear risks', 'Intentional damage'],
          popular: index === 1 // Make middle plan popular
        }));
        setInsurancePlans(mappedPlans);
      }
    } catch (error) {
      console.error('Error fetching insurance plans:', error);
      setInsurancePlans(generateDemoPlans());
    }
  };

  const generateFeatures = (coverage: string): string[] => {
    const baseFeatures = ['24/7 Claim Support', 'Quick Settlement', 'Digital Documentation'];
    if (coverage.includes('Weather')) {
      baseFeatures.push('Weather-based Claims');
    }
    if (coverage.includes('Market')) {
      baseFeatures.push('Price Protection');
    }
    return baseFeatures;
  };

  const generateDemoPlans = (): InsurancePlan[] => [
    {
      id: '1',
      provider: 'National Insurance',
      name: 'Basic Crop Protection',
      coverage: ['Drought', 'Flood', 'Hail'],
      premium: '₹500/acre/year',
      claimRatio: '85%',
      maxCoverage: 200000,
      subsidyAvailable: true,
      features: ['24/7 Support', 'Quick Settlement', 'Digital Process'],
      exclusions: ['War damage', 'Nuclear risks'],
      popular: false
    },
    {
      id: '2',
      provider: 'AgriSecure Plus',
      name: 'Comprehensive Protection',
      coverage: ['Weather', 'Disease', 'Market', 'Fire'],
      premium: '₹750/acre/year',
      claimRatio: '90%',
      maxCoverage: 350000,
      subsidyAvailable: true,
      features: ['Weather Alerts', 'Price Protection', 'Expert Support', 'Satellite Monitoring'],
      exclusions: ['War damage', 'Intentional damage'],
      popular: true
    },
    {
      id: '3',
      provider: 'FarmShield Pro',
      name: 'Premium Coverage',
      coverage: ['Comprehensive Coverage', 'Income Protection'],
      premium: '₹1000/acre/year',
      claimRatio: '95%',
      maxCoverage: 500000,
      subsidyAvailable: true,
      features: ['Income Guarantee', 'Premium Support', 'Dedicated Manager', 'Instant Payouts'],
      exclusions: ['Nuclear risks'],
      popular: false
    }
  ];

  const loadMyPolicies = () => {
    const demoPolicies: Policy[] = [
      {
        id: '1',
        policyNumber: 'AGR2024001',
        provider: 'AgriSecure Plus',
        crop: 'Wheat',
        area: 5,
        coverage: 250000,
        premium: 3750,
        status: 'active',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-12-31')
      },
      {
        id: '2',
        policyNumber: 'NAT2023002',
        provider: 'National Insurance',
        crop: 'Rice',
        area: 3,
        coverage: 150000,
        premium: 1500,
        status: 'expired',
        startDate: new Date('2023-06-01'),
        endDate: new Date('2023-12-31')
      }
    ];
    setMyPolicies(demoPolicies);
  };

  const loadMyClaims = () => {
    const demoClaims: Claim[] = [
      {
        id: '1',
        policyNumber: 'AGR2024001',
        claimType: 'Weather Damage',
        damageType: 'Flood',
        reportedDate: new Date('2024-02-15'),
        status: 'approved',
        claimAmount: 45000,
        assessmentDate: new Date('2024-02-20')
      },
      {
        id: '2',
        policyNumber: 'NAT2023002',
        claimType: 'Pest Damage',
        damageType: 'Locust Attack',
        reportedDate: new Date('2023-11-10'),
        status: 'paid',
        claimAmount: 25000,
        assessmentDate: new Date('2023-11-15')
      }
    ];
    setMyClaims(demoClaims);
  };

  const handleApplyInsurance = async () => {
    if (!selectedPlan || !applicationForm.crop || !applicationForm.area) return;

    try {
      const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');
      
      const policyPayload = {
        policy_number: `${selectedPlan.provider.substring(0, 3).toUpperCase()}${Date.now()}`,
        crop: applicationForm.crop,
        coverage_amount: selectedPlan.maxCoverage,
        premium: parseFloat(selectedPlan.premium.replace(/[^\d.]/g, '')) * parseFloat(applicationForm.area)
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE}/api/v1/farming/insurance/policies`, {
        method: 'POST',
        headers,
        body: JSON.stringify(policyPayload)
      });

      if (response.ok) {
        const data = await response.json();
        
        const newPolicy: Policy = {
          id: data.id.toString(),
          policyNumber: data.policy_number,
          provider: selectedPlan.provider,
          crop: data.crop,
          area: parseFloat(applicationForm.area),
          coverage: data.coverage_amount,
          premium: data.premium,
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        };

        setMyPolicies([newPolicy, ...myPolicies]);
        setShowApplicationForm(false);
        setApplicationForm({
          crop: '',
          area: '',
          location: '',
          soilType: '',
          sowingDate: '',
          expectedHarvest: '',
          bankAccount: '',
          adhaar: ''
        });
        alert('Insurance application submitted successfully!');
      } else if (response.status === 401) {
        alert('Please log in to apply for insurance');
      }
    } catch (error) {
      console.error('Error applying for insurance:', error);
      alert('Error submitting application. Please try again.');
    }
  };

  const handleSubmitClaim = () => {
    if (!claimForm.policyNumber || !claimForm.damageType) return;

    const newClaim: Claim = {
      id: Date.now().toString(),
      policyNumber: claimForm.policyNumber,
      claimType: 'Damage Claim',
      damageType: claimForm.damageType,
      reportedDate: new Date(),
      status: 'submitted',
      claimAmount: parseFloat(claimForm.estimatedLoss) || 0
    };

    setMyClaims([newClaim, ...myClaims]);
    setShowClaimForm(false);
    setClaimForm({
      policyNumber: '',
      damageType: '',
      damageDescription: '',
      estimatedLoss: '',
      incidentDate: ''
    });
    alert('Claim submitted successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      case 'claimed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Crop Insurance</h2>
        <p className="text-gray-600">Protect your crops against natural disasters and market risks</p>
      </div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plans">Insurance Plans</TabsTrigger>
          <TabsTrigger value="policies">My Policies</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {insurancePlans.map((plan) => (
              <Card key={plan.id} className={`relative hover:shadow-lg transition-shadow ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      {plan.name}
                    </div>
                  </CardTitle>
                  <CardDescription>{plan.provider}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{plan.premium}</p>
                    <p className="text-sm text-gray-600">Government Subsidy: 50%</p>
                  </div>

                  <div>
                    <p className="font-medium mb-2">Coverage:</p>
                    <div className="flex flex-wrap gap-1">
                      {plan.coverage.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Max Coverage</p>
                      <p className="font-semibold">₹{plan.maxCoverage.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Claim Ratio</p>
                      <p className="font-semibold">{plan.claimRatio}</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">Features:</p>
                    <ul className="text-sm space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={() => {
                      setSelectedPlan(plan);
                      setShowApplicationForm(true);
                    }}
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="policies">
          <div className="space-y-4">
            {myPolicies.map((policy) => (
              <Card key={policy.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold">Policy #{policy.policyNumber}</h4>
                      <p className="text-sm text-gray-600">{policy.provider} • {policy.crop}</p>
                    </div>
                    <Badge className={getStatusColor(policy.status)}>
                      {policy.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Area Covered</p>
                      <p className="font-semibold">{policy.area} acres</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Coverage Amount</p>
                      <p className="font-semibold">₹{policy.coverage.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Premium Paid</p>
                      <p className="font-semibold">₹{policy.premium.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Valid Until</p>
                      <p className="font-semibold">{policy.endDate.toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4 pt-4 border-t">
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-1" />
                      Download Policy
                    </Button>
                    {policy.status === 'active' && (
                      <Button 
                        size="sm"
                        onClick={() => {
                          setClaimForm(prev => ({ ...prev, policyNumber: policy.policyNumber }));
                          setShowClaimForm(true);
                        }}
                      >
                        File Claim
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {myPolicies.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No Policies Yet</h3>
                  <p className="text-gray-600">Apply for crop insurance to protect your harvest</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="claims">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">My Claims</h3>
              <Button onClick={() => setShowClaimForm(true)}>
                <FileText className="w-4 h-4 mr-2" />
                New Claim
              </Button>
            </div>

            {myClaims.map((claim) => (
              <Card key={claim.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold">Claim #{claim.id}</h4>
                      <p className="text-sm text-gray-600">
                        Policy #{claim.policyNumber} • {claim.damageType}
                      </p>
                    </div>
                    <Badge className={getStatusColor(claim.status)}>
                      {claim.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Claim Type</p>
                      <p className="font-semibold">{claim.claimType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Reported Date</p>
                      <p className="font-semibold">{claim.reportedDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Claim Amount</p>
                      <p className="font-semibold">₹{claim.claimAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Assessment</p>
                      <p className="font-semibold">
                        {claim.assessmentDate ? claim.assessmentDate.toLocaleDateString() : 'Pending'}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4 pt-4 border-t">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Upload className="w-4 h-4 mr-1" />
                      Upload Documents
                    </Button>
                    {claim.status === 'submitted' && (
                      <Button size="sm" variant="outline">
                        Track Status
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {myClaims.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No Claims Filed</h3>
                  <p className="text-gray-600">File a claim if you've experienced crop damage</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="support">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="font-medium">24/7 Helpline</p>
                  <p className="text-sm text-gray-600">1800-XXX-CROP (2767)</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-gray-600">claims@cropinsurance.gov.in</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">WhatsApp</p>
                  <p className="text-sm text-gray-600">+91 98765 43210</p>
                </div>
                <Button className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download Claim Form
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Policy Terms & Conditions
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="w-4 h-4 mr-2" />
                  Track Claim Status
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  Find Nearest Office
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Application Form Modal */}
      {showApplicationForm && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Apply for {selectedPlan.name}</CardTitle>
              <CardDescription>
                Fill in your details to apply for crop insurance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="crop">Crop Type</Label>
                  <Select 
                    value={applicationForm.crop} 
                    onValueChange={(value) => setApplicationForm(prev => ({ ...prev, crop: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Wheat">Wheat</SelectItem>
                      <SelectItem value="Rice">Rice</SelectItem>
                      <SelectItem value="Cotton">Cotton</SelectItem>
                      <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                      <SelectItem value="Maize">Maize</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="area">Area (acres)</Label>
                  <Input
                    id="area"
                    type="number"
                    value={applicationForm.area}
                    onChange={(e) => setApplicationForm(prev => ({ ...prev, area: e.target.value }))}
                    placeholder="Enter area in acres"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={applicationForm.location}
                    onChange={(e) => setApplicationForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Village, District, State"
                  />
                </div>
                <div>
                  <Label htmlFor="soilType">Soil Type</Label>
                  <Select 
                    value={applicationForm.soilType} 
                    onValueChange={(value) => setApplicationForm(prev => ({ ...prev, soilType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Clay">Clay</SelectItem>
                      <SelectItem value="Sandy">Sandy</SelectItem>
                      <SelectItem value="Loamy">Loamy</SelectItem>
                      <SelectItem value="Silty">Silty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sowingDate">Sowing Date</Label>
                  <Input
                    id="sowingDate"
                    type="date"
                    value={applicationForm.sowingDate}
                    onChange={(e) => setApplicationForm(prev => ({ ...prev, sowingDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="expectedHarvest">Expected Harvest Date</Label>
                  <Input
                    id="expectedHarvest"
                    type="date"
                    value={applicationForm.expectedHarvest}
                    onChange={(e) => setApplicationForm(prev => ({ ...prev, expectedHarvest: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankAccount">Bank Account Number</Label>
                  <Input
                    id="bankAccount"
                    value={applicationForm.bankAccount}
                    onChange={(e) => setApplicationForm(prev => ({ ...prev, bankAccount: e.target.value }))}
                    placeholder="Account number"
                  />
                </div>
                <div>
                  <Label htmlFor="adhaar">Aadhaar Number</Label>
                  <Input
                    id="adhaar"
                    value={applicationForm.adhaar}
                    onChange={(e) => setApplicationForm(prev => ({ ...prev, adhaar: e.target.value }))}
                    placeholder="XXXX-XXXX-XXXX"
                  />
                </div>
              </div>

              {applicationForm.area && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium">Premium Calculation:</p>
                  <p className="text-sm">
                    Base Premium: ₹{(parseFloat(selectedPlan.premium.replace(/[^\d.]/g, '')) * parseFloat(applicationForm.area)).toLocaleString()}/year
                  </p>
                  <p className="text-sm">
                    After 50% Subsidy: ₹{(parseFloat(selectedPlan.premium.replace(/[^\d.]/g, '')) * parseFloat(applicationForm.area) * 0.5).toLocaleString()}/year
                  </p>
                </div>
              )}

              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowApplicationForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleApplyInsurance}
                  disabled={!applicationForm.crop || !applicationForm.area}
                >
                  Submit Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Claim Form Modal */}
      {showClaimForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>File Insurance Claim</CardTitle>
              <CardDescription>
                Report crop damage or loss for claim processing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="policyNumber">Policy Number</Label>
                <Select 
                  value={claimForm.policyNumber} 
                  onValueChange={(value) => setClaimForm(prev => ({ ...prev, policyNumber: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select policy" />
                  </SelectTrigger>
                  <SelectContent>
                    {myPolicies.filter(p => p.status === 'active').map(policy => (
                      <SelectItem key={policy.id} value={policy.policyNumber}>
                        {policy.policyNumber} - {policy.crop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="damageType">Damage Type</Label>
                <Select 
                  value={claimForm.damageType} 
                  onValueChange={(value) => setClaimForm(prev => ({ ...prev, damageType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select damage type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Drought">Drought</SelectItem>
                    <SelectItem value="Flood">Flood</SelectItem>
                    <SelectItem value="Hail">Hail</SelectItem>
                    <SelectItem value="Fire">Fire</SelectItem>
                    <SelectItem value="Pest Attack">Pest Attack</SelectItem>
                    <SelectItem value="Disease">Disease</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="incidentDate">Incident Date</Label>
                <Input
                  id="incidentDate"
                  type="date"
                  value={claimForm.incidentDate}
                  onChange={(e) => setClaimForm(prev => ({ ...prev, incidentDate: e.target.value }))}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label htmlFor="estimatedLoss">Estimated Loss (₹)</Label>
                <Input
                  id="estimatedLoss"
                  type="number"
                  value={claimForm.estimatedLoss}
                  onChange={(e) => setClaimForm(prev => ({ ...prev, estimatedLoss: e.target.value }))}
                  placeholder="Enter estimated loss amount"
                />
              </div>

              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowClaimForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleSubmitClaim}
                  disabled={!claimForm.policyNumber || !claimForm.damageType}
                >
                  Submit Claim
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CropInsurance;
