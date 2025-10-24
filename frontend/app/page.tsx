// app/page.tsx
// Main home page matching Ariel Batoon's design with profile photo and experience images

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, MessageCircle, Github, Linkedin, Twitter, Facebook } from 'lucide-react';

export default function HomePage() {
  // Featured experiences with images - Updated with PNG support and fallback
  const featuredExperiences = [
    {
      id: 1,
      title: 'Data Scraper',
      company: 'Lead Generation (Facebook Engagement Analysis)',
      period: '2022 – 2025',
      description: 'Conducted 3 years of experience scraping and analyzing Facebook engagement data, including likes, shares, comments, and reach metrics.',
      image: '/images/experience/data-scraper.png',
      tags: ['Data Scraping', 'Analytics', 'Facebook API'],
    },
    {
      id: 2,
      title: 'Telephone Interviewer',
      company: 'Dynata',
      period: 'May 2024 – November 2024',
      description: 'Conducted outbound and inbound calls to gather opinions and feedback from US citizens for market research surveys.',
      image: '/images/experience/telephone-interviewer.png',
      tags: ['Market Research', 'Communication', 'Data Collection'],
    },
    {
      id: 3,
      title: 'On-Call ESL Teacher',
      company: 'First English Global',
      period: '2022 – 6 months',
      description: 'Taught basic English communication skills to foreign students, focusing on grammar, vocabulary, and conversational fluency.',
      image: '/images/experience/esl-teacher.png',
      tags: ['ESL Teaching', 'Communication', 'Mentoring'],
    },
  ];

  // Social media links - Updated with your actual links
  const socialLinks = [
    { icon: Linkedin, href: 'https://linkedin.com/in/emciiowhy', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/emciiowhy', label: 'GitHub' },
    { icon: Twitter, href: 'https://x.com/emciiowhy07', label: 'Twitter' },
    { icon: Facebook, href: 'https://facebook.com/mckiieeyy1107', label: 'Facebook' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Matching Ariel Batoon's layout */}
      <section className="w-full px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
          {/* Left Column - Text Content */}
          <div className="space-y-6">
            {/* Message me badge with hover effect */}
            <Link href="/contact" className="inline-block group">
              <div className="flex items-center space-x-2 text-emerald-600 cursor-pointer">
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium group-hover:underline">Message me</span>
              </div>
            </Link>

            {/* Main Heading with waving hand */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
              Hey, I'm Mc{' '}
              <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
              Motivated and versatile professional with experience in data scraping, telephone 
              interviewing, ESL teaching, and sales engagement. Currently pursuing a Bachelor of 
              Science in Information Technology.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/contact">
                <Button size="lg" className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Free Consultation
                </Button>
              </Link>
              <Link href="/projects">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-gray-900 hover:bg-gray-50">
                  Explore Experience
                </Button>
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 pt-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-900 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right Column - Profile Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] lg:w-[450px] lg:h-[450px]">
              {/* Decorative background blur - positioned behind image */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-50 -z-10"></div>

              {/* Profile Image */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/profile.jpg"
                  alt="Mc Zaldy Yap"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Experience Section */}
      <section className="section-container bg-white">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Recent Experience
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Check out my recent work
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            I've worked on a variety of roles, from data analysis to teaching. 
            Here are a few of my recent experiences.
          </p>
        </div>

        {/* Experience Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredExperiences.map((exp) => (
            <Card key={exp.id} className="border-0 shadow-md hover:shadow-xl transition-shadow duration-300">
              {/* Experience Image */}
              <div className="relative w-full h-64 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <Image
                  src={exp.image}
                  alt={exp.title}
                  fill
                  className="object-cover"
                />
              </div>

              <CardHeader>
                <CardTitle className="text-xl mb-1">{exp.title}</CardTitle>
                <p className="text-sm font-semibold text-gray-700">{exp.company}</p>
                <p className="text-xs text-gray-500 mt-1">{exp.period}</p>
                <CardDescription className="mt-3 line-clamp-3">
                  {exp.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link 
            href="/projects" 
            className="inline-flex items-center text-lg font-semibold text-gray-900 hover:text-gray-600 transition-colors"
          >
            More experience
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-container">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 md:p-16 text-center text-white">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Need help building something?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Whether you're searching for a dedicated partner to develop your project or 
            simply need expert support, I'm here to help.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100">
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}