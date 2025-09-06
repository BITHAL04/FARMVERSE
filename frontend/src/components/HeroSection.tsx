import { Button } from '@/components/ui/button';
import AnimatedDroneOverlay from '@/components/AnimatedDroneOverlay';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import agriculturalLandscapeBg from '@/assets/hero-bg.jpg'

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleTakeQuiz = () => {
    navigate('/quiz');
  };

  const handleExploreSolutions = () => {
    navigate('/solutions');
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Agricultural Landscape Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${agriculturalLandscapeBg})` }}
      >
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      {/* Animated Drone Overlay */}
      <AnimatedDroneOverlay />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 text-shadow animate-fade-in-up leading-tight">
          {t('hero.titleTop')} 
          <span className="block text-primary mt-2">{t('hero.titleBottom')}</span>
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto text-shadow animate-fade-in-up stagger-1 px-4">
          {t('hero.subtitle')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up stagger-2 px-4">
          <Button 
            size="lg" 
            className="hero-gradient text-primary-foreground hover:scale-105 transition-transform duration-300 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold w-full sm:w-auto"
            onClick={handleExploreSolutions}
          >
            {t('hero.exploreSolutions')}
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-white text-white hover:bg-white hover:text-primary transition-all duration-300 hover-glow px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold w-full sm:w-auto"
            onClick={handleTakeQuiz}
          >
            {t('hero.takeQuiz')}
          </Button>
        </div>
        
        <div className="mt-12 sm:mt-16 animate-bounce-gentle">
          <div className="inline-block p-2 rounded-full bg-white/10 backdrop-blur-sm">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;