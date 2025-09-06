import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const stats = [
  { number: 50, label: 'stats.labels.waterSaved', suffix: '%' },
  { number: 35, label: 'stats.labels.higherYields', suffix: '%' },
  { number: 1000, label: 'stats.labels.farmsTransformed', suffix: '+' },
  { number: 25, label: 'stats.labels.costReduction', suffix: '%' }
];

const CountUpNumber = ({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * (end - startValue) + startValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, hasStarted]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-primary">
      {count}{suffix}
    </div>
  );
};

const StatsSection = () => {
  const { t } = useTranslation();
  return (
    <section className="py-16 hero-gradient">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`text-center animate-fade-in-scale stagger-${index + 1}`}
            >
              <CountUpNumber end={stat.number} suffix={stat.suffix} />
              <div className="text-white/90 font-medium mt-2">
                {t(stat.label)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;