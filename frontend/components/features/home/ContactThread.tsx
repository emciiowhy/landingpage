'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUp, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type Sender = 'them' | 'me';
interface Message {
  id: number;
  from: Sender;
  text: string;
}
type Step = 'name' | 'email' | 'message' | 'sending' | 'done';

const backendUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://my-portfolio-backend-rv94.onrender.com'
    : 'http://localhost:5000';

let nextId = 0;
const mkId = () => ++nextId;

/**
 * Contact section styled as an iMessage thread. A short guided conversation
 * collects name → email → message, then POSTs to the existing contact backend.
 * "Sent" bubbles use the Netflix-red accent (our single accent) in place of
 * iMessage blue to stay on-palette.
 */
export function ContactThread() {
  const [messages, setMessages] = useState<Message[]>([
    { id: mkId(), from: 'them', text: 'Hey there! Thanks for scrolling all the way down.' },
    { id: mkId(), from: 'them', text: "I'm Mc. What's your name?" },
  ]);
  const [step, setStep] = useState<Step>('name');
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const draft = useRef<{ name: string; email: string }>({ name: '', email: '' });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const push = (from: Sender, text: string) =>
    setMessages((m) => [...m, { id: mkId(), from, text }]);

  // "Mc" replies after a short typing delay for realism.
  const botSay = (text: string, delay = 1000) =>
    new Promise<void>((resolve) => {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        push('them', text);
        resolve();
      }, delay);
    });

  const sendToBackend = async () => {
    const [firstName, ...rest] = draft.current.name.trim().split(' ');
    const res = await fetch(`${backendUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: draft.current.name,
        firstName,
        lastName: rest.join(' '),
        email: draft.current.email,
        phone: '',
        company: '',
        message: messages.filter((m) => m.from === 'me').slice(-1)[0]?.text ?? '',
      }),
    });
    const data = await res.json().catch(() => ({ success: res.ok }));
    if (!data.success) throw new Error(data.error || 'send failed');
  };

  const handleSend = async () => {
    const value = input.trim();
    if (!value || typing || step === 'sending' || step === 'done') return;
    push('me', value);
    setInput('');

    if (step === 'name') {
      draft.current.name = value;
      setStep('email');
      await botSay(`Nice to meet you, ${value.split(' ')[0]}!`);
      await botSay("What's the best email to reach you at?");
      return;
    }

    if (step === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        await botSay("Hmm, that doesn't look like an email — mind trying again?");
        return;
      }
      draft.current.email = value;
      setStep('message');
      await botSay('Perfect. What would you like to talk about?');
      return;
    }

    if (step === 'message') {
      setStep('sending');
      await botSay('Sending that over…', 500);
      try {
        await sendToBackend();
        setStep('done');
        await botSay(
          `Got it, ${draft.current.name.split(' ')[0]} — I'll reply to ${draft.current.email} soon.`
        );
      } catch {
        setStep('message');
        await botSay(
          `Something went wrong sending that. You can email me directly at mcmcyap07@gmail.com`
        );
      }
    }
  };

  const placeholder =
    step === 'name'
      ? 'Type your name…'
      : step === 'email'
        ? 'Type your email…'
        : step === 'done'
          ? 'Conversation sent'
          : 'Type your message…';

  return (
    <div className="mx-auto flex h-[520px] max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-[#0d0d0d]">
      {/* Thread header */}
      <div className="flex items-center gap-3 border-b border-border bg-card/80 px-4 py-2.5 backdrop-blur">
        <div className="relative h-9 w-9 overflow-hidden rounded-full">
          <Image src="/images/profile.jpg" alt="Mc Zaldy Yap" fill className="object-cover" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-foreground">Mc Zaldy Yap</p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Active now
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="no-scrollbar flex-1 space-y-2 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <div key={m.id} className={cn('flex', m.from === 'me' ? 'justify-end' : 'justify-start')}>
            <div
              className={cn(
                'max-w-[78%] rounded-2xl px-3.5 py-2 text-sm leading-snug',
                m.from === 'me'
                  ? 'rounded-br-md bg-primary text-primary-foreground'
                  : 'rounded-bl-md bg-secondary text-secondary-foreground'
              )}
            >
              {m.text}
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-secondary px-3.5 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="flex items-center justify-center gap-1.5 pt-2 text-xs text-muted-foreground">
            <Check className="h-3.5 w-3.5 text-primary" />
            Delivered
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="flex items-center gap-2 border-t border-border bg-card/60 px-3 py-2.5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={typing || step === 'sending' || step === 'done'}
          placeholder={placeholder}
          className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/60 disabled:opacity-60"
          type={step === 'email' ? 'email' : 'text'}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || typing || step === 'sending' || step === 'done'}
          aria-label="Send"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
