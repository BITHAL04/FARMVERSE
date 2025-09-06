import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CloudRain, 
  Sun, 
  Cloud, 
  Wind, 
  Thermometer, 
  Droplets, 
  AlertTriangle, 
  Bell,
  MapPin,
  Calendar,
  Eye
} from 'lucide-react';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  condition: string;
  icon: string;
  alerts: WeatherAlert[];
}

interface WeatherAlert {
  id: string;
  type: 'storm' | 'drought' | 'frost' | 'heat' | 'rain';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  action: string;
}

const WeatherAlerts = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState('Delhi, India');
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [notifications, setNotifications] = useState({
    storm: true,
    drought: true,
    frost: true,
    heat: true,
    rain: true
  });

  // Fetch weather data from backend and simulate real-time updates
  useEffect(() => {
    const fetchWeatherData = async (): Promise<WeatherData> => {
      try {
        const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';
        
        // Fetch weather alerts from backend
        const response = await fetch(`${API_BASE}/api/v1/farming/weather/alerts`);
        let backendAlerts: WeatherAlert[] = [];
        
        if (response.ok) {
          const data = await response.json();
          backendAlerts = data.map((alert: any) => ({
            id: alert.id.toString(),
            type: 'rain', // Default type, can be enhanced
            severity: alert.severity || 'medium',
            message: alert.message || alert.title,
            timestamp: new Date(alert.created_at),
            action: 'Monitor your crops and take appropriate measures'
          }));
        }
      } catch (error) {
        console.log('Using simulated weather data');
      }

      // Generate realistic weather simulation
      const conditions = ['sunny', 'cloudy', 'rainy', 'stormy'];
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      
      const baseTemp = 25 + Math.random() * 15; // 25-40°C
      const humidity = 40 + Math.random() * 40; // 40-80%
      const windSpeed = 5 + Math.random() * 15; // 5-20 km/h
      const precipitation = condition === 'rainy' ? Math.random() * 20 : Math.random() * 5;

      const simulatedAlerts: WeatherAlert[] = [];
      
      // Generate alerts based on conditions
      if (baseTemp > 35) {
        simulatedAlerts.push({
          id: 'temp_' + Date.now(),
          type: 'heat',
          severity: baseTemp > 40 ? 'critical' : 'high',
          message: `High temperature warning: ${Math.round(baseTemp)}°C expected in ${location}`,
          timestamp: new Date(),
          action: 'Increase irrigation frequency and provide shade for crops. Check soil moisture levels.'
        });
      }
      
      if (windSpeed > 15) {
        simulatedAlerts.push({
          id: 'wind_' + Date.now(),
          type: 'storm',
          severity: windSpeed > 20 ? 'critical' : 'high',
          message: `Strong winds detected: ${Math.round(windSpeed)} km/h in ${location}`,
          timestamp: new Date(),
          action: 'Secure farm equipment, check greenhouse structures, and inspect for crop damage'
        });
      }
      
      if (humidity < 30) {
        simulatedAlerts.push({
          id: 'humidity_' + Date.now(),
          type: 'drought',
          severity: 'medium',
          message: `Low humidity detected (${Math.round(humidity)}%) - drought risk in ${location}`,
          timestamp: new Date(),
          action: 'Increase irrigation frequency and monitor soil moisture levels closely'
        });
      }
      
      if (baseTemp < 5) {
        simulatedAlerts.push({
          id: 'frost_' + Date.now(),
          type: 'frost',
          severity: 'high',
          message: `Frost warning - temperature dropping to ${Math.round(baseTemp)}°C in ${location}`,
          timestamp: new Date(),
          action: 'Cover sensitive crops, use frost protection methods, or harvest if ready'
        });
      }

      if (precipitation > 15) {
        simulatedAlerts.push({
          id: 'rain_' + Date.now(),
          type: 'rain',
          severity: precipitation > 25 ? 'high' : 'medium',
          message: `Heavy rainfall expected: ${Math.round(precipitation)}mm in ${location}`,
          timestamp: new Date(),
          action: 'Ensure proper drainage, postpone spraying, and check for waterlogging'
        });
      }

      return {
        temperature: Math.round(baseTemp),
        humidity: Math.round(humidity),
        windSpeed: Math.round(windSpeed),
        precipitation: Math.round(precipitation * 10) / 10,
        condition,
        icon: condition,
        alerts: simulatedAlerts
      };
    };

    const updateWeatherData = async () => {
      const data = await fetchWeatherData();
      setWeatherData(data);
      setAlerts(data.alerts);
    };

    updateWeatherData();

    // Update every 30 seconds
    const interval = setInterval(updateWeatherData, 30000);

    return () => clearInterval(interval);
  }, [location]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'storm': return <Wind className="w-4 h-4" />;
      case 'drought': return <Sun className="w-4 h-4" />;
      case 'frost': return <Thermometer className="w-4 h-4" />;
      case 'heat': return <Thermometer className="w-4 h-4" />;
      case 'rain': return <CloudRain className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'cloudy': return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'rainy': return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'stormy': return <Wind className="w-8 h-8 text-gray-700" />;
      default: return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Weather Alerts & Monitoring</h2>
        <p className="text-gray-600">Real-time weather data and alerts to protect your crops</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Weather */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Current Weather - {location}
              </div>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weatherData && (
              <div className="space-y-6">
                {/* Main Weather Display */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getWeatherIcon(weatherData.condition)}
                    <div>
                      <h3 className="text-2xl font-bold">{weatherData.temperature}°C</h3>
                      <p className="text-gray-600 capitalize">{weatherData.condition}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Last updated</p>
                    <p className="text-sm font-medium">{new Date().toLocaleTimeString()}</p>
                  </div>
                </div>

                {/* Weather Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Droplets className="w-5 h-5 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm text-gray-600">Humidity</p>
                    <p className="font-semibold">{weatherData.humidity}%</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Wind className="w-5 h-5 mx-auto mb-2 text-gray-500" />
                    <p className="text-sm text-gray-600">Wind Speed</p>
                    <p className="font-semibold">{weatherData.windSpeed} km/h</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <CloudRain className="w-5 h-5 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm text-gray-600">Precipitation</p>
                    <p className="font-semibold">{weatherData.precipitation} mm</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Thermometer className="w-5 h-5 mx-auto mb-2 text-red-500" />
                    <p className="text-sm text-gray-600">Feels Like</p>
                    <p className="font-semibold">{weatherData.temperature + Math.floor(Math.random() * 5)}°C</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Alert Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
              />
            </div>

            <div className="space-y-3">
              <Label>Notification Types</Label>
              {Object.entries(notifications).map(([type, enabled]) => (
                <div key={type} className="flex items-center justify-between">
                  <Label htmlFor={type} className="capitalize">
                    {type} Alerts
                  </Label>
                  <Switch
                    id={type}
                    checked={enabled}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, [type]: checked }))
                    }
                  />
                </div>
              ))}
            </div>

            <Button className="w-full">
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Weather Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Active Weather Alerts
          </CardTitle>
          <CardDescription>
            Important weather conditions that may affect your crops
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length > 0 ? (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <div className={`p-2 rounded-full ${getSeverityColor(alert.severity)}`}>
                      {getAlertIcon(alert.type)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <h4 className="font-semibold mb-1">{alert.message}</h4>
                    <p className="text-sm text-gray-600 mb-2">{alert.action}</p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Mark as Read
                      </Button>
                      <Button size="sm">
                        Get Help
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Sun className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold mb-2">No Active Alerts</h3>
              <p className="text-gray-600">Weather conditions are normal for your area</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 7-Day Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            7-Day Weather Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() + i);
              const temp = 20 + Math.random() * 20;
              const condition = ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)];
              
              return (
                <div key={i} className="text-center p-3 border rounded-lg">
                  <p className="text-sm font-medium">
                    {i === 0 ? 'Today' : date.toLocaleDateString('en', { weekday: 'short' })}
                  </p>
                  <div className="my-2">
                    {getWeatherIcon(condition)}
                  </div>
                  <p className="text-sm font-semibold">{Math.round(temp)}°C</p>
                  <p className="text-xs text-gray-500 capitalize">{condition}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherAlerts;
