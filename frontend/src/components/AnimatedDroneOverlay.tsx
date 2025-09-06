import { useState, useEffect } from 'react';

const AnimatedDroneOverlay = () => {
  const [dronePosition, setDronePosition] = useState({ x: -100, y: 50 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const animateDrone = () => {
      setDronePosition({ x: -100, y: Math.random() * 30 + 40 });
      setIsVisible(true);
      
      // Animate across screen
      const animation = setInterval(() => {
        setDronePosition(prev => ({
          x: prev.x + 2,
          y: prev.y + Math.sin(prev.x * 0.01) * 0.5
        }));
      }, 50);

      // Hide when off screen
      setTimeout(() => {
        setIsVisible(false);
        clearInterval(animation);
      }, 8000);
    };

    // Start first animation
    animateDrone();
    
    // Repeat every 15 seconds
    const interval = setInterval(animateDrone, 15000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      <div 
        className="absolute transition-all duration-100 ease-linear"
        style={{
          left: `${dronePosition.x}px`,
          top: `${dronePosition.y}%`,
          transform: 'translateY(-50%)'
        }}
      >
        {/* Drone Body */}
        <div className="relative">
          {/* Main Body */}
          <div className="w-8 h-4 bg-primary rounded-lg shadow-lg"></div>
          
          {/* Propellers */}
          <div className="absolute -top-1 -left-2 w-3 h-3 border-2 border-primary rounded-full animate-spin"></div>
          <div className="absolute -top-1 -right-2 w-3 h-3 border-2 border-primary rounded-full animate-spin"></div>
          <div className="absolute -bottom-1 -left-2 w-3 h-3 border-2 border-primary rounded-full animate-spin"></div>
          <div className="absolute -bottom-1 -right-2 w-3 h-3 border-2 border-primary rounded-full animate-spin"></div>
          
          {/* LED Light */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
          
          {/* Scanning Beam */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-32 bg-gradient-to-b from-primary/30 to-transparent rounded-b-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedDroneOverlay;