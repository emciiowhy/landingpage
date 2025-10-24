// app/about/page.tsx
// About page with bio, experience, skills, and tech stack

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Download, MapPin, Mail, Phone, Linkedin, Github, Twitter, Facebook } from 'lucide-react';

export default function AboutPage() {
  // Work Experience Data
  const experiences = [
    { id: 1, title: 'Web Developer (Remote)', company: 'Freelance', period: 'Present', icon: '●', active: true },
    { id: 2, title: 'Call Center Representative', company: 'Dynata', period: 'Aug 2024 - Nov 2024', icon: '○', active: false },
    { id: 3, title: 'Lead Generation', company: 'DialerPH', period: 'Oct 2023 - July 2025', icon: '○', active: false },
    { id: 4, title: 'Data Scraper', company: 'DialerPH', period: '2023 - 2025', icon: '○', active: false },
    { id: 5, title: 'ESL Teacher', company: 'First English Global Corporation', period: '2022', icon: '○', active: false },
  ];

  // Tech Stacks
  const frontendStack = ['React', 'Next.js', 'Vue', 'Nuxt', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'HTML5', 'CSS3', 'Sass', 'ShadCN', 'Vite', 'Webpack'];
  const backendStack = ['Node.js', 'Express.js', 'PHP', 'Laravel', 'DrizzleORM', 'REST'];
  const authStack = ['OAuth', 'JWT', 'Clerk', 'NextAuth'];

  // Contact Info
  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'info.mcmcyap07@gmail.com', href: 'https://mail.google.com/mail/u/0/#inbox?compose=GTvVlcRzCMtPMnBZhJFJKfkLkgdxKWCVMvtJLZHGHdbXBBsPSjFjhtvljFgphQpnBjCGHbqbSBRpr' },
    { icon: Phone, label: 'Phone', value: '+63 915 515 2314', href: 'tel:+639155152314' },
    { icon: MapPin, label: 'Location', value: 'Cebu, Philippines', href: null },
  ];

  // Social Links
  const socialLinks = [
    { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/emciiowhy/' },
    { icon: Github, label: 'GitHub', href: 'https://github.com/emciiowhy' },
    { icon: Twitter, label: 'Twitter', href: 'https://x.com/emciiowhy07' },
    { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/mckiieeyy1107' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-80 bg-gradient-to-br from-blue-500 to-purple-400">
        <div className="absolute inset-0 bg-black opacity-20">
          <Image
            src="/images/building-bg.jpg"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Profile Card */}
      <div className="section-container -mt-32 relative z-10">
        <Card className="max-w-5xl mx-auto">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Image */}
              <div className="relative w-48 h-48 mx-auto md:mx-0 flex-shrink-0">
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <Image
                    src="/images/profile-about.jpg"
                    alt="Mc Zaldy Yap"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">Mc Zaldy Yap</h1>
                <p className="text-xl text-gray-600 italic mb-6">Aspiring Full Stack Developer</p>

                <div className="space-y-4 text-gray-700 mb-6">
                  <p>
                    Hi! I'm <span className="font-semibold">Mc Zaldy Yap</span>, a passionate and dedicated
                    <span className="font-semibold"> Full-stack developer in the making</span> who’s driven by the goal of
                    building meaningful and efficient digital experiences.
                  </p>
                  <p>
                    I started honing my skills in web development while balancing both work and studies — developing a
                    strong foundation in <span className="font-semibold">front-end and back-end technologies</span> such as
                    React, Next.js, PHP, and MySQL. Over time, I’ve learned how to create user-focused systems that are not
                    only functional but also scalable and visually appealing.
                  </p>
                  <p>
                    Professionally, I’ve gained valuable experience as a
                    <span className="font-semibold"> Data Scraper</span> for over three years, where I handled web data
                    automation and organization. I also worked as a <span className="font-semibold">Telephone Interviewer</span> at Dynata,
                    developing strong communication and data-handling skills. These experiences helped shape my discipline,
                    attention to detail, and problem-solving mindset — qualities I now bring into software development.
                  </p>
                  <p>
                    Currently, I’m sharpening my skills to become a <span className="font-semibold">Full Stack Developer</span>,
                    mastering frameworks, authentication, and deployment workflows. My goal is to create projects that merge
                    innovation, usability, and performance — whether it’s through modern web apps or AI-powered features.
                  </p>
                </div>

                <Button asChild className="bg-gray-900 hover:bg-gray-800">
                  <a href="/resume.pdf" download>
                    <Download className="mr-2 h-4 w-4" />
                    Download Resume
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Experience + Contact */}
      <section className="section-container">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Experience */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Briefcase className="h-6 w-6 mr-2" />
                  <h2 className="text-2xl font-bold">Experience</h2>
                </div>

                <div className="space-y-6">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${exp.active ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                        {exp.id !== experiences.length && (
                          <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                        )}
                      </div>

                      <div className="flex-1 pb-6">
                        <h3 className="font-semibold text-lg">{exp.title}</h3>
                        <p className="text-gray-600">{exp.company}</p>
                        <p className="text-sm text-gray-500 mt-1">{exp.period}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info + Socials */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Contact</h3>
                <div className="space-y-4">
                  {contactInfo.map((info) => {
                    const Icon = info.icon;
                    const content = (
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">{info.label}</p>
                          <p className="text-sm font-medium">{info.value}</p>
                        </div>
                      </div>
                    );

                    return info.href ? (
                      <a key={info.label} href={info.href} className="block hover:bg-gray-50 -mx-2 px-2 py-1 rounded">
                        {content}
                      </a>
                    ) : (
                      <div key={info.label}>{content}</div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Socials</h3>
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Icon className="h-5 w-5 text-gray-600" />
                        <span className="text-sm font-medium">{social.label}</span>
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="section-container bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tech Stacks</h2>
          </div>

          <div className="space-y-8">
            {/* Frontend */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Frontend</h3>
              <div className="flex flex-wrap gap-2">
                {frontendStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="px-4 py-2 text-sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Backend */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Backend</h3>
              <div className="flex flex-wrap gap-2">
                {backendStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="px-4 py-2 text-sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Authentication & Security */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Authentication & Security</h3>
              <div className="flex flex-wrap gap-2">
                {authStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="px-4 py-2 text-sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
