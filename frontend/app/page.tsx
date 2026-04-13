'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, MessageCircle, Github, Linkedin, Twitter, Facebook } from 'lucide-react';

// Organized Imports
import { BentoGrid } from '@/components/features/home/BentoGrid';
import { RevealOnScroll } from '@/components/common/RevealOnScroll';

export default function HomePage() {
  // Featured experiences
  const featuredExperiences = [
    {
      id: 1,
      title: 'Data Scraper',
      company: 'Lead Generation (Facebook Engagement Analysis)',
      period: '2022 – 2025',
      description:
        'Conducted 3 years of experience scraping and analyzing Facebook engagement data, including likes, shares, comments, and reach metrics.',
      image: '/images/experience/data-scraper.png',
      tags: ['Data Scraping', 'Analytics', 'Facebook API'],
    },
    {
      id: 2,
      title: 'Telephone Interviewer',
      company: 'Dynata',
      period: 'May 2024 – November 2024',
      description:
        'Conducted outbound and inbound calls to gather opinions and feedback from US citizens for market research surveys.',
      image: '/images/experience/telephone-interviewer.png',
      tags: ['Market Research', 'Communication', 'Data Collection'],
    },
    {
      id: 3,
      title: 'On-Call ESL Teacher',
      company: 'First English Global',
      period: '2022 – 6 months',
      description:
        'Taught basic English communication skills to foreign students, focusing on grammar, vocabulary, and conversational fluency.',
      image: '/images/experience/esl-teacher.png',
      tags: ['ESL Teaching', 'Communication', 'Mentoring'],
    },
  ];

  // Featured projects
  const featuredProjects = [
    {
      id: 5,
      title: 'Carshey Philippines',
      company: 'E-Commerce Platform',
      period: '2025',
      description:
        'Modern e-commerce platform for automotive parts and accessories with catalog, cart, secure checkout, and user accounts.',
      tags: ['Next.js', 'React', 'E-Commerce', 'Web Development', 'Tailwind CSS'],
      image: '/images/projects/carshey.png',
      liveUrl: 'https://carsheyph.vercel.app/',
    },
    {
      id: 6,
      title: 'Lazapee E-Commerce',
      company: 'Online Shopping Platform',
      period: '2025',
      description:
        'Full-featured e-commerce website with search, responsive layout, cart system, and fast performance.',
      tags: ['Next.js', 'TypeScript', 'E-Commerce', 'Responsive Design', 'UI/UX'],
      image: '/images/projects/lazapee.png',
      liveUrl: 'https://lazapee-mauve.vercel.app/',
    },
  ];

  // Social links
  const socialLinks = [
    { icon: Linkedin, href: 'https://linkedin.com/in/emciiowhy', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/emciiowhy', label: 'GitHub' },
    { icon: Twitter, href: 'https://x.com/emciiowhy07', label: 'Twitter' },
    { icon: Facebook, href: 'https://facebook.com/mckiieeyy1107', label: 'Facebook' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Usually kept without Reveal for immediate impact */}
      <section className="w-full section-container py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
          {/* Left Column */}
          <div className="space-y-6 select-none">
            <Link href="/contact" className="inline-block group">
              <div className="flex items-center space-x-2 text-emerald-600 cursor-pointer">
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium group-hover:underline">Message me</span>
              </div>
            </Link>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
              Hey, I&apos;m Mc <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              Motivated and versatile professional with experience in data scraping, telephone interviewing, ESL
              teaching, and sales engagement. Currently pursuing a Bachelor of Science in Information Technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/contact">
                <Button size="lg" className="w-full sm:w-auto">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Free Consultation
                </Button>
              </Link>
              <Link href="/projects">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Explore Experience
                </Button>
              </Link>
            </div>
            <div className="flex space-x-4 pt-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right Column */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] lg:w-[450px] lg:h-[450px]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/30 dark:to-primary/10 rounded-full blur-3xl opacity-50 -z-10" />
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                <Image src="/images/profile.jpg" alt="Mc Zaldy Yap" fill className="object-cover" priority />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid with Reveal */}
      <RevealOnScroll>
        <section className="bg-background">
          <BentoGrid />
        </section>
      </RevealOnScroll>

      {/* Featured Experiences with Reveal */}
      <RevealOnScroll>
        <section className="section-container py-16 bg-muted">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Recent Experience</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              I&apos;ve worked on a variety of roles, from data analysis to teaching. Here are a few of my recent
              experiences.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {featuredExperiences.map((exp) => (
              <Card
                key={exp.id}
                className="border border-border hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden bg-card"
              >
                <div className="relative w-full h-64 bg-muted">
                  <Image src={exp.image} alt={exp.title} fill className="object-cover" />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">{exp.title}</CardTitle>
                  <p className="text-sm font-semibold text-muted-foreground">{exp.company}</p>
                  <p className="text-xs text-muted-foreground mt-1">{exp.period}</p>
                  <CardDescription className="mt-3 line-clamp-3">{exp.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/projects"
              className="inline-flex items-center text-lg font-semibold hover:opacity-70 transition-opacity"
            >
              More experience
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </RevealOnScroll>

      {/* Featured Projects with Reveal */}
      <RevealOnScroll>
        <section className="section-container py-16 bg-background">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Featured Projects</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Some of my highlighted web development projects.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {featuredProjects.map((proj) => (
              <Card
                key={proj.id}
                className="border border-border hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden bg-card"
              >
                <div className="relative w-full h-64 bg-muted">
                  <Image src={proj.image} alt={proj.title} fill className="object-cover" />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">{proj.title}</CardTitle>
                  <p className="text-sm font-semibold text-muted-foreground">{proj.company}</p>
                  <p className="text-xs text-muted-foreground mt-1">{proj.period}</p>
                  <CardDescription className="mt-3 line-clamp-3">{proj.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {proj.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {proj.liveUrl && (
                    <Link href={proj.liveUrl} target="_blank" className="block">
                      <Button className="w-full">View Live</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      {/* CTA Section with Reveal */}
      <RevealOnScroll>
        <section className="section-container py-16">
          <div className="bg-gradient-to-br from-foreground to-foreground/80 rounded-3xl p-12 md:p-16 text-center text-background">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Need help building something?</h2>
            <p className="text-lg md:text-xl text-background/80 max-w-2xl mx-auto mb-8">
              Whether you&apos;re searching for a dedicated partner to develop your project or simply need expert
              support, I&apos;m here to help.
            </p>
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-muted">
                Get in Touch
              </Button>
            </Link>
          </div>
        </section>
      </RevealOnScroll>
    </div>
  );
}

