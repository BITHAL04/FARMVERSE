import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DigitalFeaturesMenu from './DigitalFeaturesMenu';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/about', label: t('nav.about') },
    { to: '/solutions', label: t('nav.solutions') },
    // { to: '/digital-features', label: 'Digital Features' },
    { to: '/forum', label: 'Forum' },
    { to: '/progress', label: 'Progress' },
    { to: '/missions', label: 'Missions' },
    { to: '/quiz', label: t('nav.quiz') },
    { to: '/impact', label: t('nav.impact') },
    { to: '/contact', label: t('nav.contact') }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/95 backdrop-blur-sm shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl sm:text-2xl font-bold text-primary hover:scale-105 transition-transform">
            {t('common.appName')} 
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.to}
                to={link.to} 
                className={`transition-colors hover:text-primary ${
                  isActive(link.to) ? 'text-primary font-semibold' : 'text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <DigitalFeaturesMenu />
            <Link to="/contact">
              <Button variant="outline" className="hover-glow">
                {t('common.getStarted')}
              </Button>
            </Link>
            <Button size="icon" variant="ghost" aria-label="Toggle language" onClick={() => i18n.changeLanguage(i18n.language === 'hi' ? 'en' : 'hi')}>
              {i18n.language === 'hi' ? 'EN' : 'हिं'}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border/20">
            <div className="flex flex-col space-y-4 pt-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  onClick={closeMobileMenu}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isActive(link.to) 
                      ? 'text-primary font-semibold bg-primary/10' 
                      : 'text-foreground hover:text-primary hover:bg-muted/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-4 pt-2 space-y-2">
                <div onClick={closeMobileMenu}>
                  <DigitalFeaturesMenu />
                </div>
                <Link to="/contact" onClick={closeMobileMenu}>
                  <Button className="w-full" size="sm">
                    {t('common.getStarted')}
                  </Button>
                </Link>
              </div>
              <div className="px-4">
                <Button className="w-full" variant="ghost" onClick={() => { i18n.changeLanguage(i18n.language === 'hi' ? 'en' : 'hi'); closeMobileMenu(); }}>
                  {t('common.continueIn')} {i18n.language === 'hi' ? t('common.english') : t('common.hindi')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;