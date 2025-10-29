'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mail, Phone, MessageSquare, Linkedin, Github, Twitter, Facebook, 
  CheckCircle, AlertCircle 
} from 'lucide-react';

// ✅ Helper: Fetch with timeout
const fetchWithTimeout = (url: string, options: RequestInit, timeout = 10000) => {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string; }>({
    type: null,
    message: '',
  });
  const [showToast, setShowToast] = useState(false);

  // ✅ Auto-switch between dev and production backend
  const backendUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://my-portfolio-e4bf.onrender.com'
      : 'http://localhost:5000';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submission with success feedback
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return; // 🧠 Prevent double submits

    setIsLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetchWithTimeout(
        `${backendUrl}/api/contact`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        },
        10000
      );

      const data = await response.json();

      if (data.success) {
        // ✅ Show success feedback
        setStatus({
          type: 'success',
          message: 'You successfully sent your message!',
        });
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
        setShowToast(true);

        // ✅ Hide toast after 4s
        setTimeout(() => setShowToast(false), 4000);
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      console.error('❌ Error submitting form:', error);
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please check your internet and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Contact details & socials
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'mcmcyap07@gmail.com',
      description: 'I usually reply within an hour.',
      href: 'mailto:mcmcyap07@gmail.com'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+63 915 515 2314',
      description: 'Available weekdays 9AM–6PM',
      href: 'tel:+639155152314'
    },
  ];

  const socialLinks = [
    { icon: Linkedin, href: 'https://linkedin.com/in/emciiowhy', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/emciiowhy', label: 'GitHub' },
    { icon: Twitter, href: 'https://x.com/emciiowhy07', label: 'Twitter' },
    { icon: Facebook, href: 'https://facebook.com/mckiieeyy1107', label: 'Facebook' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* ✅ Floating Toast Notification */}
      {showToast && (
        <div
          className="fixed top-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300 animate-fade-in"
          role="status"
          aria-live="polite"
        >
          <CheckCircle className="h-5 w-5" />
          <span>You successfully sent your message!</span>
        </div>
      )}

      <section className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Let's get in touch!</h1>
          <p className="text-lg text-gray-600">You can reach me at the following</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Contact Info */}
          <div className="space-y-6">
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

            {/* Social Links */}
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

          {/* Right Column - Form */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-2">Let's get in touch</h2>
              <p className="text-gray-600 mb-6">
                Whether you have a project or just want to connect, I'd love to hear from you.
              </p>

              {status.type && (
                <div
                  className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                    status.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {status.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  )}
                  <p className="text-sm">{status.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
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
                      disabled={isLoading}
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
                      disabled={isLoading}
                    />
                  </div>
                </div>

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
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    How can I help you?{' '}
                    <span className="text-gray-400 font-normal">Max 500 characters</span>
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
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-6 text-lg text-white ${
                    isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  {isLoading ? 'Sending...' : 'Submit'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
