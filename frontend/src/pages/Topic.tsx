import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ForumTopic, addReply, getTopicById, incrementViews, relativeTime } from '@/lib/forumStore';

const Topic = () => {
  const { id } = useParams();
  const [topic, setTopic] = useState<ForumTopic | undefined>();
  const [author, setAuthor] = useState('Anonymous');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    const t = incrementViews(id);
    setTopic(t ?? getTopicById(id));
  }, [id]);

  const postReply = () => {
    if (!id || !message.trim()) return;
    const updated = addReply(id, { author, message });
    setTopic(updated);
    setAuthor('Anonymous');
    setMessage('');
  };

  if (!topic) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 sm:px-6 pt-28 pb-16">
          <Card>
            <CardContent className="py-12 text-center">
              Topic not found. <Link to="/forum" className="text-primary underline">Back to forum</Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 pt-28 pb-16">
        <div className="mb-6">
          <Link to="/forum" className="text-sm text-muted-foreground hover:underline">← Back to forum</Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>{topic.title}</span>
              <span className="text-sm font-normal text-muted-foreground">{topic.views} views • {topic.replies.length} replies • posted {relativeTime(topic.createdAt)}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-2">by {topic.author}</div>
            <p className="whitespace-pre-wrap">{topic.message}</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Replies ({topic.replies.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topic.replies.length === 0 && (
              <div className="text-muted-foreground">No replies yet.</div>
            )}
            {topic.replies.map(r => (
              <div key={r.id} className="p-4 rounded-md border">
                <div className="mb-1 text-sm text-muted-foreground">{r.author} • {relativeTime(r.createdAt)}</div>
                <div className="whitespace-pre-wrap">{r.message}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Post a reply</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <Label htmlFor="author">Your name</Label>
                <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Anonymous" />
              </div>
              <div className="md:col-span-3">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Write your reply..." />
              </div>
            </div>
            <Button onClick={postReply}>Reply</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Topic;


