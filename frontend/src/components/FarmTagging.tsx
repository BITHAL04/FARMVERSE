import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Satellite, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle,
  Navigation,
  Square,
  Calendar,
  User
} from 'lucide-react';

interface FarmField {
  id: string;
  name: string;
  area: number;
  coordinates: { lat: number; lng: number };
  soilType: string;
  cropType: string;
  plantingDate: string;
  status: 'active' | 'fallow' | 'harvested';
}

const FarmTagging = () => {
  const [fields, setFields] = useState<FarmField[]>([
    {
      id: '1',
      name: 'North Field',
      area: 2.5,
      coordinates: { lat: 28.6139, lng: 77.2090 },
      soilType: 'Loamy',
      cropType: 'Wheat',
      plantingDate: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'South Field',
      area: 1.8,
      coordinates: { lat: 28.6140, lng: 77.2091 },
      soilType: 'Clay',
      cropType: 'Rice',
      plantingDate: '2024-02-01',
      status: 'active'
    }
  ]);

  const [newField, setNewField] = useState({
    name: '',
    area: '',
    soilType: '',
    cropType: '',
    plantingDate: ''
  });

  const [isAddingField, setIsAddingField] = useState(false);
  const [selectedField, setSelectedField] = useState<FarmField | null>(null);

  const addField = async () => {
    if (!newField.name || !newField.area) return;

    try {
      const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');
      
      const fieldPayload = {
        name: newField.name,
        area_acres: parseFloat(newField.area),
        latitude: 28.6139 + (Math.random() - 0.5) * 0.01, // Simulate GPS coordinates
        longitude: 77.2090 + (Math.random() - 0.5) * 0.01,
        notes: `Soil: ${newField.soilType}, Crop: ${newField.cropType}, Planted: ${newField.plantingDate}`
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE}/api/v1/farming/fields`, {
        method: 'POST',
        headers,
        body: JSON.stringify(fieldPayload)
      });

      if (response.ok) {
        const data = await response.json();
        
        const field: FarmField = {
          id: data.id.toString(),
          name: data.name,
          area: data.area_acres,
          coordinates: {
            lat: data.latitude,
            lng: data.longitude
          },
          soilType: newField.soilType,
          cropType: newField.cropType,
          plantingDate: newField.plantingDate,
          status: 'active'
        };

        setFields([...fields, field]);
        setNewField({ name: '', area: '', soilType: '', cropType: '', plantingDate: '' });
        setIsAddingField(false);
      } else if (response.status === 401) {
        // If not authenticated, add field locally only
        const field: FarmField = {
          id: Date.now().toString(),
          name: newField.name,
          area: parseFloat(newField.area),
          coordinates: {
            lat: 28.6139 + (Math.random() - 0.5) * 0.01,
            lng: 77.2090 + (Math.random() - 0.5) * 0.01
          },
          soilType: newField.soilType,
          cropType: newField.cropType,
          plantingDate: newField.plantingDate,
          status: 'active'
        };

        setFields([...fields, field]);
        setNewField({ name: '', area: '', soilType: '', cropType: '', plantingDate: '' });
        setIsAddingField(false);
        alert('Field added locally. Please log in to save to your account.');
      }
    } catch (error) {
      console.error('Error adding field:', error);
      // Fallback to local storage
      const field: FarmField = {
        id: Date.now().toString(),
        name: newField.name,
        area: parseFloat(newField.area),
        coordinates: {
          lat: 28.6139 + (Math.random() - 0.5) * 0.01,
          lng: 77.2090 + (Math.random() - 0.5) * 0.01
        },
        soilType: newField.soilType,
        cropType: newField.cropType,
        plantingDate: newField.plantingDate,
        status: 'active'
      };

      setFields([...fields, field]);
      setNewField({ name: '', area: '', soilType: '', cropType: '', plantingDate: '' });
      setIsAddingField(false);
    }
  };

  const deleteField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'fallow': return 'bg-yellow-100 text-yellow-800';
      case 'harvested': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalArea = fields.reduce((sum, field) => sum + field.area, 0);
  const activeFields = fields.filter(field => field.status === 'active').length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Farm Tagging & GPS Mapping</h2>
        <p className="text-gray-600">Digitally map and manage your farm fields with GPS precision</p>
      </div>

      {/* Farm Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-gray-600">Total Fields</p>
            <p className="text-xl font-bold">{fields.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Square className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <p className="text-sm text-gray-600">Total Area</p>
            <p className="text-xl font-bold">{totalArea.toFixed(1)} acres</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <p className="text-sm text-gray-600">Active Fields</p>
            <p className="text-xl font-bold">{activeFields}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Navigation className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <p className="text-sm text-gray-600">GPS Accuracy</p>
            <p className="text-xl font-bold">±2m</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="fields" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fields">Field Management</TabsTrigger>
          <TabsTrigger value="map">GPS Map</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="fields">
          <div className="space-y-4">
            {/* Add New Field */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Field Management
                  </div>
                  <Button onClick={() => setIsAddingField(!isAddingField)}>
                    {isAddingField ? 'Cancel' : 'Add New Field'}
                  </Button>
                </CardTitle>
              </CardHeader>
              {isAddingField && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fieldName">Field Name</Label>
                      <Input
                        id="fieldName"
                        value={newField.name}
                        onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., North Field"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fieldArea">Area (acres)</Label>
                      <Input
                        id="fieldArea"
                        type="number"
                        step="0.1"
                        value={newField.area}
                        onChange={(e) => setNewField(prev => ({ ...prev, area: e.target.value }))}
                        placeholder="e.g., 2.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="soilType">Soil Type</Label>
                      <Input
                        id="soilType"
                        value={newField.soilType}
                        onChange={(e) => setNewField(prev => ({ ...prev, soilType: e.target.value }))}
                        placeholder="e.g., Loamy, Clay"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cropType">Crop Type</Label>
                      <Input
                        id="cropType"
                        value={newField.cropType}
                        onChange={(e) => setNewField(prev => ({ ...prev, cropType: e.target.value }))}
                        placeholder="e.g., Wheat, Rice"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="plantingDate">Planting Date</Label>
                    <Input
                      id="plantingDate"
                      type="date"
                      value={newField.plantingDate}
                      onChange={(e) => setNewField(prev => ({ ...prev, plantingDate: e.target.value }))}
                    />
                  </div>
                  <Button onClick={addField} className="w-full">
                    Add Field
                  </Button>
                </CardContent>
              )}
            </Card>

            {/* Fields List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field) => (
                <Card key={field.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Satellite className="w-5 h-5 mr-2" />
                        {field.name}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(field.status)}>
                          {field.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteField(field.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Area</p>
                        <p className="font-semibold">{field.area} acres</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Soil Type</p>
                        <p className="font-semibold">{field.soilType}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Crop</p>
                        <p className="font-semibold">{field.cropType}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Planting Date</p>
                        <p className="font-semibold">{new Date(field.plantingDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-gray-600 text-sm mb-1">GPS Coordinates</p>
                      <p className="text-xs font-mono bg-gray-100 p-2 rounded">
                        {field.coordinates.lat.toFixed(6)}, {field.coordinates.lng.toFixed(6)}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedField(field)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Navigation className="w-4 h-4 mr-1" />
                        Navigate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                GPS Field Map
              </CardTitle>
              <CardDescription>
                Interactive map showing your farm boundaries and field locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">Interactive GPS Map</h3>
                  <p className="text-gray-600 mb-4">
                    Map integration would show your farm fields with GPS coordinates
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    {fields.map((field) => (
                      <div key={field.id} className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>{field.name} - {field.area} acres</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Field Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fields.map((field) => (
                    <div key={field.id}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">{field.name}</span>
                        <span className="text-sm text-gray-600">{field.area} acres</span>
                      </div>
                      <Progress value={(field.area / totalArea) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crop Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from(new Set(fields.map(f => f.cropType))).map((crop) => {
                    const cropFields = fields.filter(f => f.cropType === crop);
                    const cropArea = cropFields.reduce((sum, f) => sum + f.area, 0);
                    return (
                      <div key={crop}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">{crop}</span>
                          <span className="text-sm text-gray-600">{cropArea} acres</span>
                        </div>
                        <Progress value={(cropArea / totalArea) * 100} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FarmTagging;
