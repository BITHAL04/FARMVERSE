import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Star, 
  MapPin, 
  Phone, 
  Search, 
  Filter,
  ShoppingCart,
  Heart,
  CheckCircle,
  TrendingUp,
  Users
} from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  category: 'Seeds' | 'Fertilizers' | 'Equipment' | 'Pesticides';
  contact: string;
  location: string;
  rating: number;
  verified: boolean;
  specializations: string[];
  priceRange: 'Budget' | 'Mid-range' | 'Premium';
  description: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  supplier: string;
  price: number;
  unit: string;
  rating: number;
  inStock: boolean;
  organic: boolean;
  description: string;
}

const QualityInputAccess = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    fetchSuppliers();
    generateProducts();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE}/api/v1/farming/inputs/suppliers`);
      
      if (response.ok) {
        const data = await response.json();
        const mappedSuppliers: Supplier[] = data.map((supplier: any) => ({
          id: supplier.id.toString(),
          name: supplier.name,
          category: supplier.category as 'Seeds' | 'Fertilizers' | 'Equipment' | 'Pesticides',
          contact: supplier.contact,
          location: supplier.location,
          rating: supplier.rating,
          verified: supplier.verified,
          specializations: supplier.specializations,
          priceRange: supplier.price_range as 'Budget' | 'Mid-range' | 'Premium',
          description: supplier.description
        }));
        setSuppliers(mappedSuppliers);
      } else {
        // Fallback to features endpoint
        const fallbackResponse = await fetch(`${API_BASE}/api/v1/features/quality-input`);
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const mappedSuppliers: Supplier[] = fallbackData.data.suppliers.map((supplier: any, index: number) => ({
            id: index.toString(),
            name: supplier.name,
            category: supplier.category as 'Seeds' | 'Fertilizers' | 'Equipment' | 'Pesticides',
            contact: supplier.contact,
            location: supplier.location,
            rating: supplier.rating,
            verified: true,
            specializations: getSpecializations(supplier.category),
            priceRange: index % 3 === 0 ? 'Premium' : index % 3 === 1 ? 'Mid-range' : 'Budget',
            description: `Trusted supplier of quality ${supplier.category.toLowerCase()} with ${Math.floor(Math.random() * 10) + 5} years of experience.`
          }));
          setSuppliers(mappedSuppliers);
        }
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      // Fallback to demo data
      setSuppliers(generateDemoSuppliers());
    }
  };

  const getSpecializations = (category: string): string[] => {
    const specializations = {
      'Seeds': ['Hybrid Varieties', 'Organic Seeds', 'Disease Resistant'],
      'Fertilizers': ['NPK Complex', 'Organic Compost', 'Micronutrients'],
      'Equipment': ['Irrigation', 'Harvesting', 'Soil Preparation'],
      'Pesticides': ['Bio-pesticides', 'Fungicides', 'Herbicides']
    };
    return specializations[category as keyof typeof specializations] || [];
  };

  const generateDemoSuppliers = (): Supplier[] => [
    {
      id: '1',
      name: 'AgriSeeds Pro',
      category: 'Seeds',
      contact: '9876543210',
      location: 'Delhi',
      rating: 4.5,
      verified: true,
      specializations: ['Hybrid Varieties', 'Disease Resistant'],
      priceRange: 'Premium',
      description: 'Leading supplier of certified seeds with 15 years of experience.'
    },
    {
      id: '2',
      name: 'FarmTech Solutions',
      category: 'Fertilizers',
      contact: '9876543211',
      location: 'Mumbai',
      rating: 4.2,
      verified: true,
      specializations: ['NPK Complex', 'Micronutrients'],
      priceRange: 'Mid-range',
      description: 'Quality fertilizers and soil enhancement solutions.'
    }
  ];

  const generateProducts = async () => {
    try {
      const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE}/api/v1/farming/inputs/products`);
      
      if (response.ok) {
        const data = await response.json();
        const mappedProducts: Product[] = data.products.map((product: any) => ({
          id: product.id.toString(),
          name: product.name,
          category: product.category,
          supplier: product.supplier,
          price: product.price,
          unit: product.unit,
          rating: product.rating,
          inStock: product.in_stock,
          organic: product.organic,
          description: product.description
        }));
        setProducts(mappedProducts);
      } else {
        // Fallback to demo products
        const demoProducts: Product[] = [
          {
            id: '1',
            name: 'Premium Wheat Seeds (HD-2967)',
            category: 'Seeds',
            supplier: 'AgriSeeds Pro',
            price: 45,
            unit: 'kg',
            rating: 4.6,
            inStock: true,
            organic: false,
            description: 'High-yielding, disease-resistant wheat variety'
          },
          {
            id: '2',
            name: 'Organic NPK Fertilizer',
            category: 'Fertilizers',
            supplier: 'FarmTech Solutions',
            price: 1200,
            unit: '50kg bag',
            rating: 4.4,
            inStock: true,
            organic: true,
            description: 'Complete nutrition for all crops'
          },
          {
            id: '3',
            name: 'Drip Irrigation Kit',
            category: 'Equipment',
            supplier: 'Green Harvest',
            price: 15000,
            unit: 'set',
            rating: 4.7,
            inStock: true,
            organic: false,
            description: 'Water-efficient irrigation system for 1 acre'
          }
        ];
        setProducts(demoProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to demo products
      const demoProducts: Product[] = [
        {
          id: '1',
          name: 'Premium Wheat Seeds (HD-2967)',
          category: 'Seeds',
          supplier: 'AgriSeeds Pro',
          price: 45,
          unit: 'kg',
          rating: 4.6,
          inStock: true,
          organic: false,
          description: 'High-yielding, disease-resistant wheat variety'
        },
        {
          id: '2',
          name: 'Organic NPK Fertilizer',
          category: 'Fertilizers',
          supplier: 'FarmTech Solutions',
          price: 1200,
          unit: '50kg bag',
          rating: 4.4,
          inStock: true,
          organic: true,
          description: 'Complete nutrition for all crops'
        },
        {
          id: '3',
          name: 'Drip Irrigation Kit',
          category: 'Equipment',
          supplier: 'Green Harvest',
          price: 15000,
          unit: 'set',
          rating: 4.7,
          inStock: true,
          organic: false,
          description: 'Water-efficient irrigation system for 1 acre'
        }
      ];
      setProducts(demoProducts);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const categoryMatch = !selectedCategory || supplier.category === selectedCategory;
    const locationMatch = !selectedLocation || supplier.location === selectedLocation;
    const searchMatch = !searchTerm || 
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    return categoryMatch && locationMatch && searchMatch;
  });

  const filteredProducts = products.filter(product => {
    const categoryMatch = !selectedCategory || product.category === selectedCategory;
    const searchMatch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const toggleFavorite = (supplierId: string) => {
    setFavorites(prev => 
      prev.includes(supplierId) 
        ? prev.filter(id => id !== supplierId)
        : [...prev, supplierId]
    );
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getPriceRangeColor = (range: string) => {
    switch (range) {
      case 'Budget': return 'bg-green-100 text-green-800';
      case 'Mid-range': return 'bg-blue-100 text-blue-800';
      case 'Premium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Quality Input Access</h2>
        <p className="text-gray-600">Connect with certified suppliers for seeds, fertilizers, and farm equipment</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1 text-blue-500" />
            100+ Verified Suppliers
          </div>
          <div className="flex items-center">
            <Package className="w-4 h-4 mr-1 text-green-500" />
            500+ Products
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1 text-yellow-500" />
            4.5+ Average Rating
          </div>
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-1 text-purple-500" />
            96% Satisfaction
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Find Suppliers & Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="search"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search suppliers or products..."
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  <SelectItem value="Seeds">Seeds</SelectItem>
                  <SelectItem value="Fertilizers">Fertilizers</SelectItem>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                  <SelectItem value="Pesticides">Pesticides</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Locations</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Bangalore">Bangalore</SelectItem>
                  <SelectItem value="Pune">Pune</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedLocation('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="suppliers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="suppliers">Suppliers Directory</TabsTrigger>
          <TabsTrigger value="products">Product Catalog</TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSuppliers.map((supplier) => (
              <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      {supplier.name}
                      {supplier.verified && (
                        <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(supplier.id)}
                    >
                      <Heart 
                        className={`w-4 h-4 ${
                          favorites.includes(supplier.id) 
                            ? 'text-red-500 fill-current' 
                            : 'text-gray-400'
                        }`} 
                      />
                    </Button>
                  </CardTitle>
                  <CardDescription className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {supplier.location}
                    </div>
                    <Badge className={getPriceRangeColor(supplier.priceRange)}>
                      {supplier.priceRange}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{supplier.category}</Badge>
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {getRatingStars(supplier.rating)}
                      </div>
                      <span className="text-sm text-gray-600">({supplier.rating})</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">{supplier.description}</p>

                  <div>
                    <p className="text-sm font-medium mb-2">Specializations:</p>
                    <div className="flex flex-wrap gap-1">
                      {supplier.specializations.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-1" />
                      {supplier.contact}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                      <Button size="sm">
                        Contact Supplier
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSuppliers.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No Suppliers Found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="products">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="flex items-center justify-between">
                    <span>{product.supplier}</span>
                    {product.organic && (
                      <Badge className="bg-green-100 text-green-800">Organic</Badge>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{product.category}</Badge>
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {getRatingStars(product.rating)}
                      </div>
                      <span className="text-sm">({product.rating})</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">{product.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold">
                      ₹{product.price}/{product.unit}
                    </div>
                    <Badge className={product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" disabled={!product.inStock} className="flex-1">
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Buying Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Smart Buying Tips for Farmers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-900">Quality Over Price</h4>
                <p className="text-sm text-green-800">Invest in certified seeds and quality inputs for better yields and long-term profitability.</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-900">Bulk Purchasing</h4>
                <p className="text-sm text-blue-800">Buy in bulk during off-season to get better prices and ensure availability during peak season.</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-semibold text-purple-900">Verify Certifications</h4>
                <p className="text-sm text-purple-800">Always check for quality certifications and supplier verification before making purchases.</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <h4 className="font-semibold text-orange-900">Compare Prices</h4>
                <p className="text-sm text-orange-800">Compare prices across multiple suppliers to get the best deals without compromising quality.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-gray-600">Verified Suppliers</p>
            <p className="text-xl font-bold">{suppliers.filter(s => s.verified).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <p className="text-sm text-gray-600">Products Available</p>
            <p className="text-xl font-bold">{products.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
            <p className="text-sm text-gray-600">Avg. Rating</p>
            <p className="text-xl font-bold">4.5</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <p className="text-sm text-gray-600">Satisfaction Rate</p>
            <p className="text-xl font-bold">96%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QualityInputAccess;
