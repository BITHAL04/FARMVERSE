import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ForumTopic, createTopic, getAllTopics, relativeTime } from '@/lib/forumStore';

const Forum = () => {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [author, setAuthor] = useState('Anonymous');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories: string[] = [
    'All',
    'Announcements',
    'Farm Questions',
    'Pests and Problems',
    'Farm Showcase',
    'Farm Guides',
    'Team up',
    'News and Views',
    'Product Support',
    'Ads and Offers',
    'Price',
    'Tech',
    'Resources',
    'Products',
  ];

  useEffect(() => {
    setTopics(getAllTopics());
  }, []);

  const filtered = useMemo(() => {
    let list = topics;
    if (activeCategory !== 'All') {
      list = list.filter(t => t.category.toLowerCase() === activeCategory.toLowerCase());
    }
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.author.toLowerCase().includes(q) ||
      t.message.toLowerCase().includes(q)
    );
  }, [topics, search, activeCategory]);

  const handleCreate = () => {
    if (!title.trim() || !message.trim()) return;
    const topic = createTopic({ title, category, author, message });
    setTopics(prev => [topic, ...prev]);
    setTitle('');
    setCategory('General');
    setAuthor('Anonymous');
    setMessage('');
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 pt-28 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Community Forum</h1>
          <Button onClick={() => setIsCreating(true)}>New Topic</Button>
        </div>

        {isCreating && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create a new topic</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="E.g., Need help with bell pepper in polyhouse" />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c !== 'All').map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="author">Your name</Label>
                  <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Anonymous" />
                </div>
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder="Describe your ideas, question or solution..." />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreate}>Post Topic</Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-4 flex flex-col gap-3">
          <Input placeholder="Search topics..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                  activeCategory === cat ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Latest</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 divide-y">
              {filtered.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">No topics yet. Be the first to start a discussion!</div>
              )}
              {filtered.map(t => (
                <div key={t.id} className="py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link to={`/forum/${t.id}`} className="font-semibold hover:underline truncate max-w-[28rem]">
                        {t.title}
                      </Link>
                      <Badge variant="secondary">{t.category}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      by {t.author} • {relativeTime(t.createdAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div><span className="font-medium text-foreground">{t.replies.length}</span> replies</div>
                    <div><span className="font-medium text-foreground">{t.views}</span> views</div>
                    <div>active {relativeTime(t.updatedAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Forum;


