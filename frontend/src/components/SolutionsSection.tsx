import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const solutions = [
  {
    title: 'solutionsPage.items.0.title',
    description: 'solutionsPage.items.0.description',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    benefit: 'solutionsPage.items.0.benefit'
  },
  {
    title: 'solutionsPage.items.1.title',
    description: 'solutionsPage.items.1.description',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    benefit: 'solutionsPage.items.1.benefit'
  },
  {
    title: 'solutionsPage.items.2.title',
    description: 'solutionsPage.items.2.description',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    benefit: 'solutionsPage.items.2.benefit'
  },
  {
    title: 'solutionsPage.items.3.title',
    description: 'solutionsPage.items.3.description',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    benefit: 'solutionsPage.items.3.benefit'
  }
];

const SolutionsSection = () => {
  const { t } = useTranslation();
  return (
    <section id="solutions" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('solutionsPage.titleTop')} 
            <span className="block text-primary">{t('solutionsPage.titleBottom')}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('solutionsPage.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {solutions.map((solution, index) => (
            <Card 
              key={index} 
              className={`hover-lift animate-fade-in-scale group soft-gradient border-primary/20 stagger-${index + 1} text-center p-6`}
            >
              <CardHeader className="pb-4">
                <div className="mx-auto mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
                  {solution.icon}
                </div>
                <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                  {t(solution.title)}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription className="text-sm leading-relaxed">
                  {t(solution.description)}
                </CardDescription>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold inline-block">
                  {t(solution.benefit)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-card rounded-2xl p-8 shadow-lg border border-primary/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">{t('solutionsPage.ctaTitle')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('solutionsPage.ctaSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="hero-gradient text-primary-foreground hover:scale-105 transition-transform duration-300">
                {t('solutionsPage.startTrial')}
              </Button>
              <Button variant="outline" className="hover-glow">
                {t('solutionsPage.scheduleConsult')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;