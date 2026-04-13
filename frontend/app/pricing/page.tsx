import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Plan = {
  name: string;
  price: string;
  tagline: string;
  highlights: string[];
  ctaLabel: string;
  ctaHref: string;
  popular?: boolean;
};

export default function PricingPage() {
  const plans: Plan[] = [
    {
      name: 'Free',
      price: '₱0',
      tagline: 'Quick consult + roadmap',
      highlights: ['15–30 min discovery call', 'High-level solution outline', 'Next steps + estimate range'],
      ctaLabel: 'Get Started',
      ctaHref: '/contact',
    },
    {
      name: 'Standard',
      price: '₱2k',
      tagline: 'Design + build sprint',
      highlights: ['1 focused feature/screen', 'Responsive layout', 'Progress updates + handoff notes'],
      ctaLabel: 'Most Popular',
      ctaHref: '/contact',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '₱5k',
      tagline: 'Full solution support',
      highlights: ['Multi-page / multi-feature scope', 'Auth / dashboard options', 'Deployment + maintenance guidance'],
      ctaLabel: 'Contact',
      ctaHref: '/contact',
    },
  ];

  const comparisonRows = [
    { label: 'Discovery + planning', free: true, standard: true, enterprise: true },
    { label: 'Responsive UI', free: false, standard: true, enterprise: true },
    { label: 'Deployment help', free: false, standard: false, enterprise: true },
    { label: 'Priority support', free: false, standard: false, enterprise: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="section-container py-16">
        {/* Page hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Pricing</h1>
          <p className="text-lg text-muted-foreground">
            Simple plans to match your project stage — from a quick consult to a full build.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`border border-border rounded-2xl overflow-hidden bg-card ${
                plan.popular ? 'ring-2 ring-primary shadow-lg' : ''
              }`}
            >
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-2xl text-foreground">{plan.name}</CardTitle>
                  {plan.popular ? <Badge>Most Popular</Badge> : null}
                </div>
                <div className="text-4xl font-bold text-foreground">{plan.price}</div>
                <CardDescription className="text-muted-foreground">{plan.tagline}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {plan.highlights.map((h) => (
                    <li key={h} className="flex gap-2">
                      <span className="mt-0.5 text-foreground">✓</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <Button asChild className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                  <Link href={plan.ctaHref}>{plan.ctaLabel}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison */}
        <div className="max-w-6xl mx-auto mt-14">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Package Feature Comparison</h2>
          </div>

          <Card className="border border-border bg-card rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-4 gap-0">
                <div className="p-4 font-semibold border-b border-border text-foreground">Feature</div>
                <div className="p-4 font-semibold border-b border-border text-foreground text-center">Free</div>
                <div className="p-4 font-semibold border-b border-border text-foreground text-center">Standard</div>
                <div className="p-4 font-semibold border-b border-border text-foreground text-center">Enterprise</div>

                {comparisonRows.map((row) => (
                  <div key={row.label} className="contents">
                    <div className="p-4 border-b border-border text-muted-foreground">{row.label}</div>
                    <div className="p-4 border-b border-border text-center">
                      {row.free ? (
                        <span className="text-foreground">✓</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                    <div className="p-4 border-b border-border text-center">
                      {row.standard ? (
                        <span className="text-foreground">✓</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                    <div className="p-4 border-b border-border text-center">
                      {row.enterprise ? (
                        <span className="text-foreground">✓</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-10">
            <Button asChild size="lg">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

