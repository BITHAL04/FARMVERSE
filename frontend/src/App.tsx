import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import KhetGuruChat from './components/KhetGuruChat';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Index from "./pages/Index";
import About from "./pages/About";
import Solutions from "./pages/Solutions";
import Quiz from "./pages/Quiz";
import Impact from "./pages/Impact";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Forum from "./pages/Forum";
import Topic from "./pages/Topic";
import ProgressPage from "./pages/Progress";
import MissionsPage from "./pages/Missions";
import DigitalFeatures from "./pages/DigitalFeatures";
// React import not required with JSX transform


const queryClient = new QueryClient();

const App = () => {
  const { i18n, t } = useTranslation();
  const [showLangDialog, setShowLangDialog] = useState(false);

  useEffect(() => {
    const hasChosen = localStorage.getItem('lang_selected');
    if (!hasChosen) {
      setShowLangDialog(true);
    }
  }, []);

  const chooseLanguage = (lng: 'en' | 'hi') => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
    localStorage.setItem('lang_selected', 'true');
    setShowLangDialog(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/:id" element={<Topic />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/missions" element={<MissionsPage />} />
            <Route path="/digital-features" element={<DigitalFeatures />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <KhetGuruChat />
        </BrowserRouter>

        <Dialog open={showLangDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('common.chooseLanguage')}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button variant="outline" onClick={() => chooseLanguage('en')}>
                {t('common.english')}
              </Button>
              <Button onClick={() => chooseLanguage('hi')}>
                {t('common.hindi')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

