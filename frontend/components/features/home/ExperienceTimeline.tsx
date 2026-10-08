import { Briefcase } from 'lucide-react';

const timeline = [
  {
    role: 'Data Scraper',
    org: 'Lead Generation — Facebook Engagement Analysis',
    period: '2022 – 2025',
    description:
      'Three years scraping and analyzing Facebook engagement data — likes, shares, comments and reach — to drive lead-generation decisions.',
    tags: ['Data Scraping', 'Analytics', 'Automation'],
  },
  {
    role: 'Telephone Interviewer',
    org: 'Dynata',
    period: 'May 2024 – Nov 2024',
    description:
      'Conducted outbound and inbound calls gathering opinions from US citizens for market-research surveys.',
    tags: ['Market Research', 'Communication', 'Data Collection'],
  },
  {
    role: 'On-Call ESL Teacher',
    org: 'First English Global',
    period: '2022 · 6 months',
    description:
      'Taught basic English communication to foreign students — grammar, vocabulary and conversational fluency.',
    tags: ['Teaching', 'Communication', 'Mentoring'],
  },
];

/**
 * Richer vertical timeline for the #experience section. These non-dev roles are
 * presented as supporting background to the developer positioning.
 */
export function ExperienceTimeline() {
  return (
    <ol className="relative space-y-6 border-l border-border pl-6">
      {timeline.map((item) => (
        <li key={item.role} className="relative">
          <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border border-border bg-secondary">
            <Briefcase className="h-3 w-3 text-muted-foreground" />
          </span>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <h4 className="text-[15px] font-bold text-foreground">{item.role}</h4>
            <span className="text-xs text-muted-foreground/70">{item.period}</span>
          </div>
          <p className="text-sm font-medium text-muted-foreground">{item.org}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}
