// ==============================================
// FILE: app/projects/page.tsx (Improved Version)
// Clean, consistent, optimized UI and code structure
// ==============================================

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Briefcase, ExternalLink } from 'lucide-react';

export default function ProjectsPage() {
  // ==========================================
  // EXPERIENCES DATA
  // ==========================================
  const allExperiences = [
    {
      id: 5,
      title: 'Carshey Philippines',
      company: 'E-Commerce Platform',
      period: '2025',
      description:
        'A modern e-commerce platform for automotive parts and accessories. Includes catalog, cart, secure checkout, and user accounts.',
      tags: ['Next.js', 'React', 'E-Commerce', 'Web Development', 'Tailwind CSS'],
      image: '/images/projects/carshey.png',
      type: 'Project',
      category: 'Web Development',
      liveUrl: 'https://carsheyph.vercel.app/',
      featured: true,
    },
    {
      id: 6,
      title: 'Lazapee E-Commerce',
      company: 'Online Shopping Platform',
      period: '2025',
      description:
        'A full e-commerce website with advanced search, responsive layout, cart system, and fast performance using modern Next.js features.',
      tags: ['Next.js', 'TypeScript', 'E-Commerce', 'Responsive Design', 'UI/UX'],
      image: '/images/projects/lazapee.png',
      type: 'Project',
      category: 'Web Development',
      liveUrl: 'https://lazapee-mauve.vercel.app/',
      featured: true,
    },

    // EXPERIENCE
    {
      id: 1,
      title: 'Data Scraper',
      company: 'Lead Generation (Facebook Engagement Analysis)',
      period: '2022 – 2025',
      description:
        'Scraped and analyzed Facebook engagement data (likes, shares, comments). Produced insights supporting digital marketing campaigns.',
      tags: ['Data Scraping', 'Facebook API', 'Analytics', 'Marketing Research'],
      image: '/images/icons/data-scraper.png',
      type: 'Professional Experience',
      category: 'Data Analysis',
    },
    {
      id: 2,
      title: 'Telephone Interviewer',
      company: 'Dynata',
      period: 'May 2024 – Nov 2024',
      description:
        'Handled outbound and inbound calls to collect market research responses while maintaining script accuracy and professionalism.',
      tags: ['Market Research', 'Communication', 'Customer Service', 'Data Collection'],
      image: '/images/icons/telephone-interviewer.png',
      type: 'Professional Experience',
      category: 'Market Research',
    },
    {
      id: 3,
      title: 'On-Call ESL Teacher',
      company: 'First English Global',
      period: '2022 – 6 months',
      description:
        'Taught English basics to foreign students, focusing on communication, grammar, and tailored learning activities.',
      tags: ['ESL Teaching', 'Communication', 'Mentoring'],
      image: '/images/icons/esl-teacher.png',
      type: 'Professional Experience',
      category: 'Education',
    },
    {
      id: 4,
      title: 'Education',
      company: 'Cordova Public College',
      period: '2023 - Present',
      description:
        'Bachelor of Science in Information Technology with focus on software development and databases.',
      tags: ['Information Technology', 'Software Development', 'Web Development'],
      icon: '🎓',
      type: 'Education',
      category: 'Education',
    },
  ];

  // ==========================================
  // STATE
  // ==========================================
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Web Development', 'Data Analysis', 'Market Research', 'Education'];

  // Optimized filtering using useMemo
  const filteredExperiences = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return allExperiences.filter((exp) => {
      const matchesCategory = selectedCategory === 'All' || exp.category === selectedCategory;
      const matchesSearch =
        exp.title.toLowerCase().includes(query) ||
        exp.company.toLowerCase().includes(query) ||
        exp.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [allExperiences, selectedCategory, searchQuery]);

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="section-container py-16">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Projects & Experience</h1>
          <p className="text-lg text-gray-600">
            A curated showcase of my web development work, professional background, and continuous learning.
          </p>
        </div>

        {/* SEARCH */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search projects or experience..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 'bg-gray-900 text-white' : ''}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* FEATURED LABEL */}
        {selectedCategory === 'All' && !searchQuery && (
          <h2 className="text-2xl font-bold text-center mb-10">Featured Projects</h2>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {filteredExperiences.map((exp) => (
            <Card
              key={exp.id}
              className={`border hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden ${
                exp.featured ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {/* IMAGE */}
              <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                {exp.image ? (
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-7xl">{exp.icon}</span>
                )}
                {exp.featured && (
                  <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Featured
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary">{exp.type}</Badge>
                  {exp.liveUrl && (
                    <a
                      href={exp.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  )}
                </div>
                <CardTitle className="text-xl">{exp.title}</CardTitle>
                <p className="text-sm font-semibold text-gray-700">{exp.company}</p>
                <p className="text-xs text-gray-500 mt-1">{exp.period}</p>
                <CardDescription className="mt-3 line-clamp-4">{exp.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {exp.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {exp.liveUrl && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link href={exp.liveUrl} target="_blank" className="block w-full">
                      <Button className="w-full bg-gray-900 hover:bg-gray-800" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" /> View Live
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredExperiences.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-lg">No results found.</div>
        )}

        {/* CALL TO ACTION */}
        <div className="mt-20 text-center">
          <div className="bg-white rounded-2xl p-10 max-w-2xl mx-auto shadow-sm border border-gray-200">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-700" />
            <h3 className="text-2xl font-bold mb-3">Interested in Working Together?</h3>
            <p className="text-gray-600 mb-6">
              I’m open to opportunities in web development, data analysis, and customer service.
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800">
                Get In Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}