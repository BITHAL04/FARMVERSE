import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Star, 
  Calendar, 
  Phone, 
  Mail, 
  MessageSquare,
  Video,
  Clock,
  Award,
  BookOpen,
  CheckCircle,
  User,
  Filter
} from 'lucide-react';

interface Expert {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  contact: string;
  rating: number;
  reviews: number;
  availability: 'Available' | 'Busy' | 'Offline';
  languages: string[];
  consultationFee: number;
  image: string;
  description: string;
  achievements: string[];
}

interface Consultation {
  id: string;
  expertName: string;
  topic: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  date: Date;
  type: 'Call' | 'Video' | 'Chat';
}

const ExpertConnect = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [bookingForm, setBookingForm] = useState({
    topic: '',
    description: '',
    preferredDate: '',
    preferredTime: '',
    consultationType: 'Call'
  });
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    fetchExperts();
    loadConsultations();
  }, []);

  const fetchExperts = async () => {
    try {
      const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE}/api/v1/farming/experts/available`);
      
      if (response.ok) {
        const data = await response.json();
        const mappedExperts: Expert[] = data.experts.map((expert: any) => ({
          id: expert.id.toString(),
          name: expert.name,
          specialization: expert.specialization,
          experience: expert.experience,
          contact: expert.contact,
          rating: expert.rating,
          reviews: Math.floor(Math.random() * 200) + 50,
          availability: expert.availability as 'Available' | 'Busy' | 'Offline',
          languages: expert.languages,
          consultationFee: expert.consultation_fee,
          image: '👨‍🌾', // Could be replaced with actual image URLs
          description: expert.description,
          achievements: expert.achievements
        }));
        setExperts(mappedExperts);
      } else {
        // Fallback to features endpoint
        const fallbackResponse = await fetch(`${API_BASE}/api/v1/features/connect-experts`);
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const mappedExperts: Expert[] = fallbackData.data.experts.map((expert: any, index: number) => ({
            id: index.toString(),
            name: expert.name,
            specialization: expert.specialization,
            experience: expert.experience,
            contact: expert.contact,
            rating: expert.rating,
            reviews: Math.floor(Math.random() * 200) + 50,
            availability: ['Available', 'Busy', 'Offline'][Math.floor(Math.random() * 3)] as 'Available' | 'Busy' | 'Offline',
            languages: ['English', 'Hindi', ...(Math.random() > 0.5 ? ['Regional'] : [])],
            consultationFee: Math.floor(Math.random() * 1500) + 500,
            image: '👨‍🌾',
            description: `Expert in ${expert.specialization.toLowerCase()} with extensive field experience and proven track record.`,
            achievements: getAchievements(expert.specialization)
          }));
          setExperts(mappedExperts);
        }
      }
    } catch (error) {
      console.error('Error fetching experts:', error);
      setExperts(generateDemoExperts());
    }
  };

  const getAchievements = (specialization: string): string[] => {
    const achievements = {
      'Soil Science': ['PhD in Soil Science', '100+ Soil Reports', 'Research Publications'],
      'Crop Protection': ['IPM Certified', 'Pesticide Expert', 'Disease Diagnostics'],
      'Water Management': ['Irrigation Engineer', 'Water Conservation', 'Drip Systems'],
      'Organic Farming': ['Organic Certified', 'Bio-inputs Expert', 'Sustainable Methods']
    };
    return achievements[specialization as keyof typeof achievements] || ['Certified Expert', 'Field Experience', 'Proven Results'];
  };

  const generateDemoExperts = (): Expert[] => [
    {
      id: '1',
      name: 'Dr. Rajesh Sharma',
      specialization: 'Soil Science',
      experience: '15 years',
      contact: 'expert1@agri.com',
      rating: 4.8,
      reviews: 156,
      availability: 'Available',
      languages: ['English', 'Hindi'],
      consultationFee: 800,
      image: '👨‍🌾',
      description: 'Leading soil scientist with expertise in soil health assessment and fertility management.',
      achievements: ['PhD in Soil Science', '100+ Soil Reports', 'Research Publications']
    },
    {
      id: '2',
      name: 'Ms. Priya Patel',
      specialization: 'Crop Protection',
      experience: '12 years',
      contact: 'expert2@agri.com',
      rating: 4.6,
      reviews: 142,
      availability: 'Available',
      languages: ['English', 'Hindi', 'Gujarati'],
      consultationFee: 650,
      image: '👩‍🌾',
      description: 'Expert in integrated pest management and sustainable crop protection strategies.',
      achievements: ['IPM Certified', 'Pesticide Expert', 'Disease Diagnostics']
    }
  ];

  const loadConsultations = () => {
    const demoConsultations: Consultation[] = [
      {
        id: '1',
        expertName: 'Dr. Rajesh Sharma',
        topic: 'Soil pH Management',
        status: 'completed',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        type: 'Video'
      },
      {
        id: '2',
        expertName: 'Ms. Priya Patel',
        topic: 'Pest Control Strategy',
        status: 'scheduled',
        date: new Date(Date.now() + 48 * 60 * 60 * 1000),
        type: 'Call'
      }
    ];
    setConsultations(demoConsultations);
  };

  const filteredExperts = experts.filter(expert => {
    return !selectedSpecialization || expert.specialization === selectedSpecialization;
  });

  const handleBookConsultation = async () => {
    if (!selectedExpert || !bookingForm.topic) return;

    try {
      const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');
      
      const consultationPayload = {
        expert_name: selectedExpert.name,
        topic: bookingForm.topic
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE}/api/v1/farming/experts/consultations`, {
        method: 'POST',
        headers,
        body: JSON.stringify(consultationPayload)
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add to local consultations list
        const newConsultation: Consultation = {
          id: data.id.toString(),
          expertName: selectedExpert.name,
          topic: bookingForm.topic,
          status: 'pending',
          date: new Date(bookingForm.preferredDate + 'T' + bookingForm.preferredTime),
          type: bookingForm.consultationType as 'Call' | 'Video' | 'Chat'
        };

        setConsultations([newConsultation, ...consultations]);
        setShowBookingForm(false);
        setBookingForm({
          topic: '',
          description: '',
          preferredDate: '',
          preferredTime: '',
          consultationType: 'Call'
        });
        alert('Consultation booked successfully!');
      } else if (response.status === 401) {
        alert('Please log in to book consultations');
      }
    } catch (error) {
      console.error('Error booking consultation:', error);
      alert('Error booking consultation. Please try again.');
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Busy': return 'bg-yellow-100 text-yellow-800';
      case 'Offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Connect with Agricultural Experts</h2>
        <p className="text-gray-600">Get professional advice from certified agriculture experts</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1 text-blue-500" />
            50+ Certified Experts
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1 text-yellow-500" />
            4.7+ Average Rating
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-green-500" />
            &lt; 2hr Response Time
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1 text-purple-500" />
            95% Success Rate
          </div>
        </div>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Find Experts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="specialization">Specialization</Label>
              <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                <SelectTrigger>
                  <SelectValue placeholder="All Specializations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Specializations</SelectItem>
                  <SelectItem value="Soil Science">Soil Science</SelectItem>
                  <SelectItem value="Crop Protection">Crop Protection</SelectItem>
                  <SelectItem value="Water Management">Water Management</SelectItem>
                  <SelectItem value="Organic Farming">Organic Farming</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={() => setSelectedSpecialization('')}>
                Clear Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="experts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="experts">Available Experts</TabsTrigger>
          <TabsTrigger value="consultations">My Consultations</TabsTrigger>
        </TabsList>

        <TabsContent value="experts">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredExperts.map((expert) => (
              <Card key={expert.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{expert.image}</span>
                      <div>
                        <h3 className="font-semibold">{expert.name}</h3>
                        <p className="text-sm text-gray-600">{expert.specialization}</p>
                      </div>
                    </div>
                    <Badge className={getAvailabilityColor(expert.availability)}>
                      {expert.availability}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {getRatingStars(expert.rating)}
                      </div>
                      <span className="text-sm">({expert.rating}) • {expert.reviews} reviews</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Experience</p>
                      <p className="font-semibold">{expert.experience}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">{expert.description}</p>

                  <div>
                    <p className="text-sm font-medium mb-2">Achievements:</p>
                    <div className="flex flex-wrap gap-1">
                      {expert.achievements.map((achievement, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Award className="w-3 h-3 mr-1" />
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Languages</p>
                      <p className="text-sm">{expert.languages.join(', ')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Consultation Fee</p>
                      <p className="font-semibold">₹{expert.consultationFee}/session</p>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4 border-t">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setSelectedExpert(expert);
                        setShowBookingForm(true);
                      }}
                      disabled={expert.availability === 'Offline'}
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      Book Consultation
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="consultations">
          <div className="space-y-4">
            {consultations.map((consultation) => (
              <Card key={consultation.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{consultation.topic}</h4>
                        <p className="text-sm text-gray-600">with {consultation.expertName}</p>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          {consultation.date.toLocaleDateString()} at {consultation.date.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(consultation.status)}>
                        {consultation.status}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">{consultation.type}</p>
                    </div>
                  </div>
                  
                  {consultation.status === 'scheduled' && (
                    <div className="flex space-x-2 mt-4 pt-4 border-t">
                      <Button size="sm" variant="outline">
                        Reschedule
                      </Button>
                      <Button size="sm" variant="outline">
                        Cancel
                      </Button>
                      <Button size="sm">
                        {consultation.type === 'Video' ? <Video className="w-4 h-4 mr-1" /> : <Phone className="w-4 h-4 mr-1" />}
                        Join {consultation.type}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {consultations.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No Consultations Yet</h3>
                  <p className="text-gray-600">Book your first consultation with an expert</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Booking Form Modal */}
      {showBookingForm && selectedExpert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Book Consultation</CardTitle>
              <CardDescription>
                Book a consultation with {selectedExpert.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  value={bookingForm.topic}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder="What would you like to discuss?"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={bookingForm.description}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide more details about your query..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Preferred Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={bookingForm.preferredDate}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, preferredDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Preferred Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={bookingForm.preferredTime}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, preferredTime: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="consultationType">Consultation Type</Label>
                <Select 
                  value={bookingForm.consultationType} 
                  onValueChange={(value) => setBookingForm(prev => ({ ...prev, consultationType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Call">Phone Call</SelectItem>
                    <SelectItem value="Video">Video Call</SelectItem>
                    <SelectItem value="Chat">Text Chat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Consultation Fee: ₹{selectedExpert.consultationFee}</p>
              </div>

              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowBookingForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleBookConsultation}
                  disabled={!bookingForm.topic}
                >
                  Book Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Expert Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Expert Consultation Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-900">Prepare Your Questions</h4>
                <p className="text-sm text-blue-800">List specific questions about your crop, soil, or farming challenges before the consultation.</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-900">Share Field Photos</h4>
                <p className="text-sm text-green-800">Visual evidence helps experts provide more accurate diagnosis and recommendations.</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-semibold text-purple-900">Be Specific</h4>
                <p className="text-sm text-purple-800">Mention crop variety, planting date, soil type, and any treatments already applied.</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <h4 className="font-semibold text-orange-900">Follow Up</h4>
                <p className="text-sm text-orange-800">Implement recommendations and share results for continuous improvement.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-gray-600">Available Experts</p>
            <p className="text-xl font-bold">{experts.filter(e => e.availability === 'Available').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
            <p className="text-sm text-gray-600">Avg Rating</p>
            <p className="text-xl font-bold">4.7</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <p className="text-sm text-gray-600">Response Time</p>
            <p className="text-xl font-bold">&lt; 2 hrs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <p className="text-sm text-gray-600">Success Rate</p>
            <p className="text-xl font-bold">95%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpertConnect;
