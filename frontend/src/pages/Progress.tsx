import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';

type ProgressData = {
  sustainabilityScore: number;
  learningHours: number;
  completedModules: number;
  badges: { name: string; desc: string }[];
  weeklyYieldIndex: number[]; // last 8 weeks
};

const STORAGE_KEY = 'farmer_progress';

function loadProgress(): ProgressData {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw);
  const seeded: ProgressData = {
    sustainabilityScore: 72,
    learningHours: 14,
    completedModules: 6,
    badges: [
      { name: 'Water Saver', desc: 'Reduced irrigation by 15%' },
      { name: 'Soil Care', desc: 'Completed soil health module' },
      { name: 'Community Helper', desc: 'Posted 5 helpful replies' },
    ],
    weeklyYieldIndex: Array.from({ length: 8 }).map((_, i) => 60 + Math.round(Math.random() * 40)),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

const ProgressPage = () => {
  const [data, setData] = useState<ProgressData | null>(null);
  useEffect(() => { setData(loadProgress()); }, []);
  if (!data) return null;

  const avgYield = Math.round(data.weeklyYieldIndex.reduce((a, b) => a + b, 0) / data.weeklyYieldIndex.length);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 pt-28 pb-16 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Progress Tracker</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader><CardTitle>Sustainability Score</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{data.sustainabilityScore}</div>
              <Progress value={data.sustainabilityScore} />
              <div className="text-sm text-muted-foreground mt-2">Higher score means more sustainable practices.</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Learning</CardTitle></CardHeader>
            <CardContent>
              <div className="text-xl">Hours: <span className="font-semibold">{data.learningHours}</span></div>
              <div className="text-xl">Modules: <span className="font-semibold">{data.completedModules}</span></div>
              <div className="mt-3 flex flex-wrap gap-2">
                {data.badges.map(b => (
                  <Badge key={b.name} variant="secondary" className="text-sm">{b.name}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Yield Index (avg)</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgYield}</div>
              <div className="mt-3 grid grid-cols-8 gap-1">
                {data.weeklyYieldIndex.map((v, i) => (
                  <div key={i} title={`Week ${i+1}: ${v}`}
                    className="h-16 bg-primary/20 rounded"
                    style={{ height: `${Math.max(8, Math.min(64, v))}px` }} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Badges</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            {data.badges.map(b => (
              <div key={b.name} className="p-3 border rounded-md">
                <div className="font-semibold">{b.name}</div>
                <div className="text-sm text-muted-foreground">{b.desc}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProgressPage;


