import Navigation from '@/components/Navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useEffect, useMemo, useState } from 'react';

type Mission = {
  id: string;
  title: string;
  desc: string;
  xp: number;
  category: 'Organic Inputs' | 'Mixed Cropping' | 'Soil Health' | 'Water' | 'Pest Management';
  completed: boolean;
};

type MissionState = {
  missions: Mission[];
  totalXp: number;
};

const STORAGE_KEY = 'farmer_missions';

function generateId(): string {
  return 'm-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function seedMissions(): Mission[] {
  return [
    { id: generateId(), title: 'Prepare 20L Jivamrit', desc: 'Brew and apply on 0.25 acre', xp: 30, category: 'Organic Inputs', completed: false },
    { id: generateId(), title: 'Compost Pit Check', desc: 'Turn compost and record moisture', xp: 20, category: 'Soil Health', completed: false },
    { id: generateId(), title: 'Mixed Bed Plan', desc: 'Design 3-bed rotation with legumes', xp: 25, category: 'Mixed Cropping', completed: false },
    { id: generateId(), title: 'Mulch Coverage', desc: 'Mulch 50% of vegetable beds', xp: 25, category: 'Water', completed: false },
    { id: generateId(), title: 'Sticky Trap Setup', desc: 'Place 10 traps for leaf miner', xp: 20, category: 'Pest Management', completed: false },
  ];
}

function loadState(): MissionState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw);
  const missions = seedMissions();
  const state = { missions, totalXp: 0 };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

const MissionsPage = () => {
  const [state, setState] = useState<MissionState | null>(null);
  const [filter, setFilter] = useState<'All' | Mission['category']>('All');

  useEffect(() => { setState(loadState()); }, []);

  const progress = useMemo(() => {
    if (!state) return 0;
    const done = state.missions.filter(m => m.completed).length;
    return Math.round((done / state.missions.length) * 100);
  }, [state]);

  const toggleMission = (id: string) => {
    if (!state) return;
    const missions = state.missions.map(m => m.id === id ? { ...m, completed: !m.completed } : m);
    const gained = missions.filter(m => m.completed).reduce((s, m) => s + m.xp, 0);
    const next = { missions, totalXp: gained };
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  if (!state) return null;
  const visible = state.missions.filter(m => filter === 'All' ? true : m.category === filter);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 pt-28 pb-16 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold">Learning Through Play</h1>
          <div className="flex gap-2 flex-wrap">
            {(['All','Organic Inputs','Mixed Cropping','Soil Health','Water','Pest Management'] as const).map(c => (
              <Button key={c} variant={filter===c? 'default':'outline'} size="sm" onClick={() => setFilter(c as any)}>{c}</Button>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg mb-2">XP: <span className="font-semibold">{state.totalXp}</span></div>
            <Progress value={progress} />
            <div className="text-sm text-muted-foreground mt-2">Complete missions to earn XP and badges.</div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visible.map(m => (
            <Card key={m.id} className={m.completed ? 'opacity-80' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{m.title}</span>
                  <Badge variant={m.completed ? 'default' : 'secondary'}>{m.xp} XP</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-3">{m.desc}</div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{m.category}</div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => toggleMission(m.id)}>{m.completed ? 'Mark Incomplete' : 'Complete Mission'}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MissionsPage;


