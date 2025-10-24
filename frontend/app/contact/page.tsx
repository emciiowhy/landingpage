// app/contact/page.tsx
// Contact page with contact form and information

'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MessageSquare, Linkedin, Github, Twitter, Facebook } from 'lucide-react';

export default function ContactPage() {
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Add your form submission logic here
    // This will be connected to your backend API later
    console.log('Form submitted:', formData);
    
    // Show success message (you can add a toast notification here)
    alert('Thank you for your message! I\'ll get back to you soon.');
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      message: ''
    });
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Contact methods
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'info.mcmcyap07@gmail.com',
      description: 'I usually email you back within an hour.',
      href: 'https://mail.google.com/mail/u/0/#inbox?compose=GTvVlcRzCMtPMnBZhJFJKfkLkgdxKWCVMvtJLZHGHdbXBBsPSjFjhtvljFgphQpnBjCGHbqbSBRpr'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+63 (915) 515 2314',
      description: 'I\'m available weekdays from 9AM to 6PM',
      href: 'tel:+639155152314'
    },
  ];

  // Social media links
  const socialLinks = [
    { icon: Linkedin, href: 'https://www.linkedin.com/in/emciiowhy/', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/emciiowhy', label: 'GitHub' },
    { icon: Twitter, href: 'https://x.com/emciiowhy07', label: 'Twitter' },
    { icon: Facebook, href: 'https://www.facebook.com/mckiieeyy1107', label: 'Facebook' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Let's get in touch!</h1>
          <p className="text-lg text-gray-600">
            You can reach me at the following
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Contact Information */}
          <div className="space-y-6">
            {/* Contact Methods */}
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <Card key={method.title} className="bg-gray-900 text-white border-0">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-gray-800 p-3 rounded-lg">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{method.title}</h3>
                        <a 
                          href={method.href}
                          className="text-white hover:text-gray-300 transition-colors block mb-2"
                        >
                          {method.value}
                        </a>
                        <p className="text-sm text-gray-400 flex items-center">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Social Media Card */}
<Card className="bg-gray-900 text-white border-0">
  <CardContent className="p-6">
    <div className="flex items-start gap-4">
      <div className="bg-gray-800 p-3 rounded-lg">
        <MessageSquare className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-lg mb-4">Connect with me</h3>
        <div className="flex gap-4">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-colors"
                aria-label={social.label}
              >
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  </CardContent>
</Card>

          </div>

          {/* Right Column - Contact Form */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-2">Let's get in touch</h2>
              <p className="text-gray-600 mb-6">
                Whether you have a project in mind or just want to connect, I'd love to hear 
                from you. Feel free to reach out for any inquiries or collaborations.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    How can I help you? <span className="text-gray-400 font-normal">Max 500 characters</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    maxLength={500}
                    rows={5}
                    placeholder="Write your message here..."
                    className="w-full resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6 text-lg"
                >
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
