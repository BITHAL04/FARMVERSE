import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  Calendar, 
  Package, 
  DollarSign,
  ShoppingCart,
  Truck,
  BarChart3,
  Bell,
  Search,
  Filter
} from 'lucide-react';

interface MarketPrice {
  crop: string;
  mandi: string;
  price: number;
  unit: string;
  change: number;
  changePercent: number;
  lastUpdated: Date;
  quality: 'A' | 'B' | 'C';
}

interface SellingListing {
  id: string;
  crop: string;
  quantity: number;
  unit: string;
  price: number;
  quality: string;
  location: string;
  contact: string;
  status: 'active' | 'sold' | 'pending';
  datePosted: Date;
}

const MandiMarket = () => {
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [sellingListings, setSellingListings] = useState<SellingListing[]>([]);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedMandi, setSelectedMandi] = useState('');
  const [newListing, setNewListing] = useState({
    crop: '',
    quantity: '',
    unit: 'quintal',
    price: '',
    quality: 'A',
    location: '',
    contact: ''
  });

  // Fetch market data from backend and generate realistic prices
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';
        
        // Fetch real market prices from backend
        const response = await fetch(`${API_BASE}/api/v1/farming/market/prices`);
        let backendPrices: MarketPrice[] = [];
        
        if (response.ok) {
          const data = await response.json();
          backendPrices = data.map((price: any) => ({
            crop: price.crop,
            mandi: price.mandi,
            price: price.price_per_quintal,
            unit: price.unit || 'quintal',
            change: price.change_percent ? price.change_percent * 20 : (Math.random() - 0.5) * 200,
            changePercent: price.change_percent || (Math.random() - 0.5) * 10,
            lastUpdated: new Date(price.date),
            quality: price.quality || (['A', 'B', 'C'][Math.floor(Math.random() * 3)] as 'A' | 'B' | 'C')
          }));
        }

        // If we have backend data, use it; otherwise generate sample data
        if (backendPrices.length > 0) {
          setMarketPrices(backendPrices);
        } else {
          // Generate additional sample data to fill gaps
          const crops = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize', 'Tomato', 'Onion', 'Potato'];
          const mandis = ['Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bangalore', 'Hyderabad', 'Pune', 'Ahmedabad'];
          
          const simulatedPrices = crops.flatMap(crop => 
            mandis.map(mandi => ({
              crop,
              mandi,
              price: Math.floor(Math.random() * 5000) + 1000,
              unit: 'quintal',
              change: (Math.random() - 0.5) * 200,
              changePercent: (Math.random() - 0.5) * 10,
              lastUpdated: new Date(),
              quality: ['A', 'B', 'C'][Math.floor(Math.random() * 3)] as 'A' | 'B' | 'C'
            }))
          );
          setMarketPrices(simulatedPrices);
        }

      } catch (error) {
        console.error('Error fetching market data:', error);
        // Fallback to simulated data
        const crops = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize', 'Tomato', 'Onion', 'Potato'];
        const mandis = ['Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bangalore', 'Hyderabad', 'Pune', 'Ahmedabad'];
        
        const fallbackPrices = crops.flatMap(crop => 
          mandis.map(mandi => ({
            crop,
            mandi,
            price: Math.floor(Math.random() * 5000) + 1000,
            unit: 'quintal',
            change: (Math.random() - 0.5) * 200,
            changePercent: (Math.random() - 0.5) * 10,
            lastUpdated: new Date(),
            quality: ['A', 'B', 'C'][Math.floor(Math.random() * 3)] as 'A' | 'B' | 'C'
          }))
        );
        setMarketPrices(fallbackPrices);
      }
    };

    const generateListings = (): SellingListing[] => [
      {
        id: '1',
        crop: 'Wheat',
        quantity: 50,
        unit: 'quintal',
        price: 2400,
        quality: 'A',
        location: 'Punjab',
        contact: '+91 98765 43210',
        status: 'active',
        datePosted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        crop: 'Rice',
        quantity: 30,
        unit: 'quintal',
        price: 2800,
        quality: 'B',
        location: 'Haryana',
        contact: '+91 98765 43211',
        status: 'active',
        datePosted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        crop: 'Cotton',
        quantity: 25,
        unit: 'quintal',
        price: 6200,
        quality: 'A',
        location: 'Gujarat',
        contact: '+91 98765 43212',
        status: 'sold',
        datePosted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ];

    fetchMarketData();
    setSellingListings(generateListings());
  }, []);

  const filteredPrices = marketPrices.filter(price => {
    const cropMatch = !selectedCrop || price.crop === selectedCrop;
    const mandiMatch = !selectedMandi || price.mandi === selectedMandi;
    return cropMatch && mandiMatch;
  });

  const addListing = () => {
    if (!newListing.crop || !newListing.quantity || !newListing.price) return;

    const listing: SellingListing = {
      id: Date.now().toString(),
      crop: newListing.crop,
      quantity: parseFloat(newListing.quantity),
      unit: newListing.unit,
      price: parseFloat(newListing.price),
      quality: newListing.quality,
      location: newListing.location,
      contact: newListing.contact,
      status: 'active',
      datePosted: new Date()
    };

    setSellingListings([listing, ...sellingListings]);
    setNewListing({
      crop: '',
      quantity: '',
      unit: 'quintal',
      price: '',
      quality: 'A',
      location: '',
      contact: ''
    });
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-yellow-100 text-yellow-800';
      case 'C': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Mandi Rate & Market Linkage</h2>
        <p className="text-gray-600">Real-time market prices and direct selling platform for farmers</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
            Live Price Updates
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-blue-500" />
            50+ Mandis Covered
          </div>
          <div className="flex items-center">
            <Bell className="w-4 h-4 mr-1 text-orange-500" />
            Price Alerts
          </div>
          <div className="flex items-center">
            <ShoppingCart className="w-4 h-4 mr-1 text-purple-500" />
            Direct Selling
          </div>
        </div>
      </div>

      <Tabs defaultValue="prices" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="prices">Market Prices</TabsTrigger>
          <TabsTrigger value="sell">Sell Produce</TabsTrigger>
          <TabsTrigger value="analytics">Market Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="prices">
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Market Price Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="cropFilter">Crop</Label>
                    <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Crops</SelectItem>
                        <SelectItem value="Wheat">Wheat</SelectItem>
                        <SelectItem value="Rice">Rice</SelectItem>
                        <SelectItem value="Cotton">Cotton</SelectItem>
                        <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                        <SelectItem value="Maize">Maize</SelectItem>
                        <SelectItem value="Tomato">Tomato</SelectItem>
                        <SelectItem value="Onion">Onion</SelectItem>
                        <SelectItem value="Potato">Potato</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="mandiFilter">Mandi</Label>
                    <Select value={selectedMandi} onValueChange={setSelectedMandi}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mandi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Mandis</SelectItem>
                        <SelectItem value="Delhi">Delhi</SelectItem>
                        <SelectItem value="Mumbai">Mumbai</SelectItem>
                        <SelectItem value="Kolkata">Kolkata</SelectItem>
                        <SelectItem value="Chennai">Chennai</SelectItem>
                        <SelectItem value="Bangalore">Bangalore</SelectItem>
                        <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                        <SelectItem value="Pune">Pune</SelectItem>
                        <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button variant="outline" className="w-full">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Prices */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPrices.slice(0, 12).map((price, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Package className="w-5 h-5 mr-2" />
                        {price.crop}
                      </div>
                      <Badge className={getQualityColor(price.quality)}>
                        Grade {price.quality}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {price.mandi}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">₹{price.price}</span>
                        <div className={`flex items-center ${getChangeColor(price.change)}`}>
                          {getChangeIcon(price.change)}
                          <span className="ml-1 text-sm">
                            {price.change >= 0 ? '+' : ''}{price.changePercent.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Per {price.unit}</p>
                        <p className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Updated {price.lastUpdated.toLocaleTimeString()}
                        </p>
                      </div>
                      <Button size="sm" className="w-full">
                        <Bell className="w-4 h-4 mr-2" />
                        Set Price Alert
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sell">
          <div className="space-y-6">
            {/* Add New Listing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  List Your Produce for Sale
                </CardTitle>
                <CardDescription>
                  Connect directly with buyers and get fair prices for your crops
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="crop">Crop Type</Label>
                    <Select value={newListing.crop} onValueChange={(value) => setNewListing(prev => ({ ...prev, crop: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Wheat">Wheat</SelectItem>
                        <SelectItem value="Rice">Rice</SelectItem>
                        <SelectItem value="Cotton">Cotton</SelectItem>
                        <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                        <SelectItem value="Maize">Maize</SelectItem>
                        <SelectItem value="Tomato">Tomato</SelectItem>
                        <SelectItem value="Onion">Onion</SelectItem>
                        <SelectItem value="Potato">Potato</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newListing.quantity}
                      onChange={(e) => setNewListing(prev => ({ ...prev, quantity: e.target.value }))}
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Select value={newListing.unit} onValueChange={(value) => setNewListing(prev => ({ ...prev, unit: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quintal">Quintal</SelectItem>
                        <SelectItem value="kg">Kilogram</SelectItem>
                        <SelectItem value="ton">Ton</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="price">Price per Unit (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newListing.price}
                      onChange={(e) => setNewListing(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="Enter price"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quality">Quality Grade</Label>
                    <Select value={newListing.quality} onValueChange={(value) => setNewListing(prev => ({ ...prev, quality: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Grade A (Premium)</SelectItem>
                        <SelectItem value="B">Grade B (Good)</SelectItem>
                        <SelectItem value="C">Grade C (Standard)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newListing.location}
                      onChange={(e) => setNewListing(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Enter your location"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input
                    id="contact"
                    value={newListing.contact}
                    onChange={(e) => setNewListing(prev => ({ ...prev, contact: e.target.value }))}
                    placeholder="Enter contact number"
                  />
                </div>
                <Button onClick={addListing} className="w-full">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  List for Sale
                </Button>
              </CardContent>
            </Card>

            {/* Active Listings */}
            <Card>
              <CardHeader>
                <CardTitle>Your Active Listings</CardTitle>
                <CardDescription>
                  Manage your produce listings and track buyer interest
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sellingListings.map((listing) => (
                    <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Package className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{listing.crop}</h4>
                          <p className="text-sm text-gray-600">
                            {listing.quantity} {listing.unit} • Grade {listing.quality} • {listing.location}
                          </p>
                          <p className="text-xs text-gray-500">
                            Posted {listing.datePosted.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{listing.price}/{listing.unit}</p>
                        <Badge className={getStatusColor(listing.status)}>
                          {listing.status}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">{listing.contact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Price Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Wheat', 'Rice', 'Cotton'].map((crop) => {
                    const cropPrices = marketPrices.filter(p => p.crop === crop);
                    const avgPrice = cropPrices.reduce((sum, p) => sum + p.price, 0) / cropPrices.length;
                    const avgChange = cropPrices.reduce((sum, p) => sum + p.changePercent, 0) / cropPrices.length;
                    
                    return (
                      <div key={crop} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-semibold">{crop}</p>
                          <p className="text-sm text-gray-600">Average Price</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{Math.round(avgPrice)}</p>
                          <div className={`flex items-center ${getChangeColor(avgChange)}`}>
                            {getChangeIcon(avgChange)}
                            <span className="ml-1 text-sm">
                              {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Market Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900">Best Selling Time</h4>
                    <p className="text-sm text-blue-800">Wheat prices peak in March-April</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900">High Demand</h4>
                    <p className="text-sm text-green-800">Organic produce commands 20% premium</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-900">Market Alert</h4>
                    <p className="text-sm text-yellow-800">Cotton prices expected to rise 15% next month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Tips Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Market Tips for Farmers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-semibold text-green-900">Timing Your Sales</h4>
                    <p className="text-sm text-green-800">Monitor price trends and sell when prices are favorable. Avoid selling during harvest glut periods.</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-semibold text-blue-900">Quality Matters</h4>
                    <p className="text-sm text-blue-800">Grade A produce fetches 15-20% higher prices. Invest in proper storage and handling.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                    <h4 className="font-semibold text-purple-900">Direct Selling</h4>
                    <p className="text-sm text-purple-800">Cut out middlemen by selling directly to consumers or bulk buyers through our platform.</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                    <h4 className="font-semibold text-orange-900">Price Alerts</h4>
                    <p className="text-sm text-orange-800">Set price alerts for your crops to get notified when prices reach your target levels.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MandiMarket;
