import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ChatItem { role: 'user' | 'assistant'; content: string; timestamp: string; }

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const BACKEND_URL = `${API_BASE}/api/v1/features/chat`;

const KhetGuruChat: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatItem[]>([{
    role: 'assistant',
    content: 'Namaste! I\'m KhetGuru. Ask me about soil, weather, crops, mandi rates or insurance.',
    timestamp: new Date().toISOString()
  }]);
  const viewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.scrollTop = viewRef.current.scrollHeight;
    }
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatItem = { role: 'user', content: input.trim(), timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content })
      });
      const data = await res.json();
      if (res.ok) {
        const assistantMsg: ChatItem = { role: 'assistant', content: data.reply, timestamp: data.timestamp };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + (data.detail || 'Failed to respond'), timestamp: new Date().toISOString() }]);
      }
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error contacting KhetGuru.', timestamp: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition"
          aria-label="Open KhetGuru Chat"
        >
          <span className="text-2xl" role="img" aria-label="chatbot">🌾</span>
        </button>
      )}
      {open && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 z-50">
          <Card className="shadow-xl border-green-200">
            <CardHeader className="flex flex-row items-center justify-between py-3 pb-2 space-y-0">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                KhetGuru
              </CardTitle>
              <Button size="icon" variant="ghost" onClick={() => setOpen(false)} aria-label="Close">
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <div ref={viewRef} className="h-72 overflow-y-auto pr-1 space-y-3 scroll-smooth">
                {messages.map((m, i) => (
                  <div key={i} className={`text-sm flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-lg px-3 py-2 shadow-sm ${m.role === 'user' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                      {m.content}
                      <div className="mt-1 text-[10px] opacity-60 text-right">
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                {loading && <div className="text-xs text-gray-500">KhetGuru is thinking...</div>}
              </div>
              <div className="mt-3 flex gap-2">
                <Input
                  placeholder="Ask KhetGuru..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  disabled={loading}
                />
                <Button onClick={sendMessage} disabled={loading || !input.trim()} className="bg-green-600 hover:bg-green-700" aria-label="Send">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="mt-2 text-[10px] text-gray-400">KhetGuru gives illustrative guidance. Verify before critical decisions.</p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default KhetGuruChat;
