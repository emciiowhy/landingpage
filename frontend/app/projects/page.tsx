// ==============================================
// FILE: app/projects/page.tsx
// Projects/Experience page showcasing professional experience and projects
// ==============================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Briefcase, ExternalLink, Github } from 'lucide-react';

export default function ProjectsPage() {
  // ==========================================
  // PROJECTS & PROFESSIONAL EXPERIENCE DATA
  // ==========================================
  const allExperiences = [
    // RECENT PROJECTS
    {
      id: 5,
      title: 'Carshey Philippines',
      company: 'E-Commerce Platform',
      period: '2025',
      description:
        'A modern e-commerce platform for automotive parts and accessories in the Philippines. Features include product catalog, shopping cart, user authentication, and secure checkout process.',
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
        'A full-featured e-commerce website with product listings, search functionality, cart management, and checkout flow. Built with modern web technologies for optimal performance.',
      tags: ['Next.js', 'TypeScript', 'E-Commerce', 'Responsive Design', 'UI/UX'],
      image: '/images/projects/lazapee.png',
      type: 'Project',
      category: 'Web Development',
      liveUrl: 'https://lazapee-mauve.vercel.app/',
      featured: true,
    },
    
    // PROFESSIONAL EXPERIENCE
    {
      id: 1,
      title: 'Data Scraper',
      company: 'Lead Generation (Facebook Engagement Analysis)',
      period: '2022 – 2025',
      description:
        'Conducted 3 years of experience scraping and analyzing Facebook engagement data, including likes, shares, comments, and reach metrics. Generated insights to support digital marketing campaigns and audience behavior analysis.',
      tags: ['Data Scraping', 'Facebook API', 'Analytics', 'Marketing Research'],
      image: '/images/icons/data-scraper.png',
      type: 'Professional Experience',
      category: 'Data Analysis',
    },
    {
      id: 2,
      title: 'Telephone Interviewer',
      company: 'Dynata',
      period: 'May 2024 – November 2024',
      description:
        'Conducted outbound and inbound calls to gather opinions and feedback from US citizens for market research surveys. Maintained professionalism, adhered to scripts, and ensured accuracy in data collection.',
      tags: ['Market Research', 'Customer Service', 'Communication', 'Data Collection'],
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
        'Taught basic English communication skills to foreign students, focusing on grammar, vocabulary, and conversational fluency. Developed interactive lessons tailored to individual student needs to enhance confidence and learning outcomes.',
      tags: ['ESL Teaching', 'Communication', 'Curriculum Development', 'Mentoring'],
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
        'Bachelor of Science Major in Information Technology. Currently pursuing degree with focus on software development, database management, and web technologies.',
      tags: ['Information Technology', 'Software Development', 'Web Development', 'Database'],
      icon: '🎓',
      type: 'Education',
      category: 'Education',
    },
  ];

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // ==========================================
  // FILTERING LOGIC
  // ==========================================
  const categories = ['All', 'Web Development', 'Data Analysis', 'Market Research', 'Education'];

  const filteredExperiences = allExperiences.filter((exp) => {
    const matchesCategory = selectedCategory === 'All' || exp.category === selectedCategory;
    const matchesSearch =
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER SECTION */}
      <section className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Projects & Experience</h1>
          <p className="text-lg text-gray-600">
            Showcasing my recent web development projects and professional experience in data analysis,
            communication, and continuous learning.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search projects and experience..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* CATEGORY FILTER */}
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

        {/* FEATURED PROJECTS BANNER */}
        {selectedCategory === 'All' && !searchQuery && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-6">Featured Projects</h2>
          </div>
        )}

        {/* EXPERIENCE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {filteredExperiences.map((exp) => (
            <Card
              key={exp.id}
              className={`card border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                exp.featured ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {/* IMAGE OR ICON HEADER */}
              <div className="relative w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center overflow-hidden rounded-t-xl">
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

              {/* CARD CONTENT */}
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="mb-2">
                    {exp.type}
                  </Badge>
                  {exp.liveUrl && (
                    <a
                      href={exp.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      aria-label={`Visit ${exp.title}`}
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  )}
                </div>
                <CardTitle className="text-xl mb-1">{exp.title}</CardTitle>
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

                {/* PROJECT LINKS */}
                {exp.liveUrl && (
                  <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                    <a
                      href={exp.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full bg-gray-900 hover:bg-gray-800"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Live
                      </Button>
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* NO RESULTS MESSAGE */}
        {filteredExperiences.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No results found. Try adjusting your search or filter.
            </p>
          </div>
        )}

        {/* CALL TO ACTION */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 max-w-2xl mx-auto shadow-sm border border-gray-200">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-700" />
            <h3 className="text-2xl font-bold mb-3">Interested in Working Together?</h3>
            <p className="text-gray-600 mb-6">
              I'm currently looking for opportunities in web development, data analysis,
              and customer service roles.
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