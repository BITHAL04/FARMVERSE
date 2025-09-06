import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const generateRandomData = () => ({
  soilMoisture: Math.floor(Math.random() * 40) + 45, // 45-85%
  temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
  humidity: Math.floor(Math.random() * 30) + 60, // 60-90%
  windSpeed: Math.floor(Math.random() * 10) + 5, // 5-15 km/h
  activeDrones: Math.floor(Math.random() * 3) + 2, // 2-4 drones
  areasScanned: Math.floor(Math.random() * 50) + 150, // 150-200 hectares
  alertsToday: Math.floor(Math.random() * 5), // 0-4 alerts
});

const fetchLiveData = async () => {
  try {
    const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';
    const response = await fetch(`${API_BASE}/api/v1/features/live-monitoring`);
    
    if (response.ok) {
      const result = await response.json();
      if (result.status === 'success') {
        return {
          soilMoisture: result.data.soil_moisture,
          temperature: result.data.temperature,
          humidity: result.data.humidity,
          windSpeed: result.data.wind_speed,
          activeDrones: result.data.active_sensors, // Using sensors as drone count
          areasScanned: Math.floor(Math.random() * 50) + 150, // Keep random for now
          alertsToday: result.data.alerts_count
        };
      }
    }
  } catch (error) {
    console.log('Using simulated data for live monitoring');
  }
  
  return generateRandomData();
};

const RealTimeDataDashboard = () => {
  const [data, setData] = useState(generateRandomData());
  const [isLive, setIsLive] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const updateData = async () => {
      const newData = await fetchLiveData();
      setData(newData);
    };

    // Initial data fetch
    updateData();

    // Update every 3 seconds
    const interval = setInterval(updateData, 3000);

    return () => clearInterval(interval);
  }, []);

  const metrics = [
    {
      label: t('dashboard.soilMoisture'),
      value: `${data.soilMoisture}%`,
      status: data.soilMoisture > 70 ? "optimal" : data.soilMoisture > 50 ? "moderate" : "low",
      icon: "💧"
    },
    {
      label: t('dashboard.temperature'),
      value: `${data.temperature}°C`,
      status: data.temperature < 30 ? "optimal" : "high",
      icon: "🌡️"
    },
    {
      label: t('dashboard.humidity'),
      value: `${data.humidity}%`,
      status: data.humidity > 70 ? "optimal" : "low",
      icon: "💨"
    },
    {
      label: t('dashboard.windSpeed'),
      value: `${data.windSpeed} km/h`,
      status: data.windSpeed < 10 ? "optimal" : "high",
      icon: "🍃"
    },
    {
      label: t('dashboard.activeDrones'),
      value: data.activeDrones,
      status: "active",
      icon: "🚁"
    },
    {
      label: t('dashboard.areasScanned'),
      value: `${data.areasScanned} ha`,
      status: "complete",
      icon: "📍"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal": return "bg-primary text-primary-foreground";
      case "active": return "hero-gradient text-white";
      case "complete": return "bg-accent text-accent-foreground";
      case "moderate": return "bg-orange-500 text-white";
      case "high": return "bg-orange-600 text-white";
      case "low": return "bg-red-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-muted'}`}></div>
            <h2 className="text-4xl md:text-5xl font-bold">
              {t('dashboard.titleTop')}
              <span className="block text-primary">{t('dashboard.titleBottom')}</span>
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {data.alertsToday > 0 && (
          <div className="mb-8 text-center">
            <Badge variant="destructive" className="text-lg px-4 py-2 animate-pulse">
              ⚠️ {data.alertsToday} {t('dashboard.alert')}{data.alertsToday > 1 ? 's' : ''} {t('dashboard.alertsToday', { count: data.alertsToday })}
            </Badge>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {metrics.map((metric, index) => (
            <Card key={index} className="text-center hover-lift animate-fade-in-scale stagger-1">
              <CardHeader className="pb-3">
                <div className="text-3xl mb-2">{metric.icon}</div>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{metric.value}</div>
                <Badge className={`text-xs ${getStatusColor(metric.status)}`}>
                  {metric.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🌾 {t('dashboard.fieldHealthAnalysis')}
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>{t('dashboard.cropHealthScore')}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full hero-gradient w-4/5 animate-pulse"></div>
                  </div>
                  <span className="text-primary font-semibold">85%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>{t('dashboard.irrigationEfficiency')}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-3/4"></div>
                  </div>
                  <span className="text-blue-600 font-semibold">78%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>{t('dashboard.pestDetection')}</span>
                <Badge className="bg-primary text-primary-foreground">{t('dashboard.lowRisk')}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 {t('dashboard.todaysActivity')}
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>{t('dashboard.flightHours')}</span>
                <span className="font-semibold">24.5 hrs</span>
              </div>
              <div className="flex justify-between">
                <span>{t('dashboard.dataPointsCollected')}</span>
                <span className="font-semibold text-primary">12,847</span>
              </div>
              <div className="flex justify-between">
                <span>{t('dashboard.imagesCaptured')}</span>
                <span className="font-semibold">1,205</span>
              </div>
              <div className="flex justify-between">
                <span>{t('dashboard.analysisComplete')}</span>
                <Badge className="hero-gradient text-white">98.2%</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RealTimeDataDashboard;