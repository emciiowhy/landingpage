// ==============================================
// FILE: app/projects/page.tsx
// Projects/Experience page showcasing professional experience
// ==============================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Briefcase } from 'lucide-react';

export default function ProjectsPage() {
  // ==========================================
  // PROFESSIONAL EXPERIENCE DATA
  // ==========================================
  const allExperiences = [
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
  const categories = ['All', 'Data Analysis', 'Market Research', 'Education'];

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Professional Journey</h1>
          <p className="text-lg text-gray-600">
            A collection of my professional experience showcasing my skills in data analysis,
            communication, and continuous learning.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search experience..."
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

        {/* EXPERIENCE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {filteredExperiences.map((exp) => (
            <Card
              key={exp.id}
              className="card border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* IMAGE OR ICON HEADER */}
              <div className="relative w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center overflow-hidden rounded-t-xl">
                {exp.image ? (
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-contain p-100 w-100 transition-transform duration-500 hover:scale-205"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-7xl">{exp.icon}</span>
                )}
              </div>

              {/* CARD CONTENT */}
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="mb-2">
                    {exp.type}
                  </Badge>
                </div>
                <CardTitle className="text-xl mb-1">{exp.title}</CardTitle>
                <p className="text-sm font-semibold text-gray-700">{exp.company}</p>
                <p className="text-xs text-gray-500 mt-1">{exp.period}</p>
                <CardDescription className="mt-3 line-clamp-4">{exp.description}</CardDescription>
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

        {/* NO RESULTS MESSAGE */}
        {filteredExperiences.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No experience found. Try adjusting your search or filter.
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
