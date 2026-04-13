import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type FaqItem = { q: string; a: string };

export default function FaqPage() {
  const faqs: FaqItem[] = [
    {
      q: 'What kind of projects do you build?',
      a: 'Mostly modern web apps and websites (Next.js/React), landing pages, small business sites, and e-commerce style builds. I can also help improve UI/UX and performance on existing projects.',
    },
    {
      q: 'How do we start working together?',
      a: 'Send a message with your goal, target deadline, and any references. I’ll reply with a quick plan, scope, and next steps.',
    },
    {
      q: 'Do you offer fixed pricing?',
      a: 'Yes for smaller scopes. For bigger builds, I prefer milestone-based pricing so the scope stays clear and flexible.',
    },
    {
      q: 'Can you deploy the project?',
      a: 'Yes. I can help deploy to Vercel (front-end) and common back-end hosts, and guide you on environment variables and basic monitoring.',
    },
    {
      q: 'Do you work with existing codebases?',
      a: 'Yes — I can jump into an existing repo, fix bugs, add features, refactor, and improve UI while keeping your current structure and details intact.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="section-container py-16">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">FAQ</h1>
          <p className="text-lg text-muted-foreground">
            Quick answers to the most common questions. If you don’t see yours, just message me.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((item) => (
            <Card key={item.q} className="border border-border bg-card rounded-2xl">
              <CardContent className="p-0">
                <details className="group px-6 py-5">
                  <summary className="cursor-pointer list-none select-none flex items-start justify-between gap-6">
                    <span className="text-base md:text-lg font-semibold text-foreground">{item.q}</span>
                    <span className="text-muted-foreground group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="pt-3 text-sm md:text-base text-muted-foreground leading-relaxed">{item.a}</div>
                </details>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/contact">Contact</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

