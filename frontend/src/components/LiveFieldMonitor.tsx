import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

const fieldData = [
  { id: 1, x: 20, y: 30, status: 'optimal', type: 'soil' },
  { id: 2, x: 60, y: 25, status: 'warning', type: 'moisture' },
  { id: 3, x: 80, y: 50, status: 'optimal', type: 'temperature' },
  { id: 4, x: 40, y: 70, status: 'critical', type: 'irrigation' },
  { id: 5, x: 25, y: 60, status: 'optimal', type: 'growth' },
  { id: 6, x: 70, y: 75, status: 'monitoring', type: 'pest' },
];

const LiveFieldMonitor = () => {
  const [activePoints, setActivePoints] = useState<number[]>([]);
  const [scanningLine, setScanningLine] = useState(0);

  useEffect(() => {
    // Animate scanning line
    const scanInterval = setInterval(() => {
      setScanningLine(prev => (prev >= 100 ? 0 : prev + 2));
    }, 100);

    // Randomly activate data points
    const pointInterval = setInterval(() => {
      const randomPoint = Math.floor(Math.random() * fieldData.length);
      setActivePoints(prev => {
        const newActive = [...prev, randomPoint];
        return newActive.slice(-3); // Keep only last 3 active
      });
    }, 2000);

    return () => {
      clearInterval(scanInterval);
      clearInterval(pointInterval);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-primary';
      case 'warning': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      case 'monitoring': return 'bg-blue-500';
      default: return 'bg-muted';
    }
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'soil': return '🌱';
      case 'moisture': return '💧';
      case 'temperature': return '🌡️';
      case 'irrigation': return '💦';
      case 'growth': return '🌾';
      case 'pest': return '🐛';
      default: return '📊';
    }
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Live Field Visualization
            <span className="block text-primary">IoT Sensor Network</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time monitoring of crop conditions across your entire farm
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-8 overflow-hidden" style={{ aspectRatio: '16/10' }}>
            {/* Field Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="h-full w-full" style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 20px,
                  rgba(34, 197, 94, 0.3) 20px,
                  rgba(34, 197, 94, 0.3) 22px
                ),
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 20px,
                  rgba(34, 197, 94, 0.3) 20px,
                  rgba(34, 197, 94, 0.3) 22px
                )`
              }}></div>
            </div>

            {/* Scanning Line */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-primary/60 shadow-lg transition-all duration-100"
              style={{ left: `${scanningLine}%` }}
            >
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-primary animate-bounce">
                📡
              </div>
            </div>

            {/* Data Points */}
            {fieldData.map((point, index) => (
              <div
                key={point.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
              >
                <div className={`relative ${activePoints.includes(index) ? 'animate-pulse' : ''}`}>
                  {/* Pulse Ring */}
                  {activePoints.includes(index) && (
                    <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping"></div>
                  )}
                  
                  {/* Sensor Point */}
                  <div className={`w-4 h-4 rounded-full ${getStatusColor(point.status)} border-2 border-white shadow-lg relative z-10`}>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-lg">
                      {getStatusIcon(point.type)}
                    </div>
                  </div>

                  {/* Data Popup */}
                  {activePoints.includes(index) && (
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-card border rounded-lg px-2 py-1 shadow-lg whitespace-nowrap animate-fade-in-scale">
                      <div className="text-xs font-medium capitalize">{point.type}</div>
                      <Badge className={`text-xs ${getStatusColor(point.status)} text-white`}>
                        {point.status}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Live Data Stream */}
            <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live Data Stream</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>⚡ {activePoints.length} sensors active</div>
                <div>📊 Collecting data...</div>
                <div>🔄 Auto-refresh: 2s</div>
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-3">
              <div className="text-sm font-medium mb-2">Status Legend</div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Optimal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Warning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Critical</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveFieldMonitor;