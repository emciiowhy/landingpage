import { ProfileHeader } from '@/components/features/home/ProfileHeader';
import { ProfileTabs } from '@/components/features/home/ProfileTabs';
import { Sidebar } from '@/components/features/home/Sidebar';
import { ProjectsFeed } from '@/components/features/home/ProjectsFeed';
import { ExperienceTimeline } from '@/components/features/home/ExperienceTimeline';
import { ContactThread } from '@/components/features/home/ContactThread';
import { ProfileCard } from '@/components/common/ProfileCard';
import { SiteFooter } from '@/components/common/SiteFooter';
import { Award } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Full-width profile column (capped only on ultra-wide screens) */}
      <div className="mx-auto w-full max-w-[1800px]">
        <ProfileHeader />
        <ProfileTabs />

        {/* Two-column body: sticky sidebar + main feed */}
        <div className="section-container grid grid-cols-1 gap-4 py-4 lg:grid-cols-[380px_minmax(0,1fr)]">
          {/* Sidebar */}
          <div className="lg:sticky lg:top-16 lg:self-start">
            <Sidebar />
          </div>

          {/* Main column (min-w-0 lets the Netflix rows scroll instead of widening the grid) */}
          <main className="flex min-w-0 flex-col gap-4">
            {/* Projects — Netflix-style rows with live-preview modal */}
            <section id="projects" className="scroll-mt-20">
              <ProjectsFeed />
            </section>

            {/* Experience — reframed background timeline */}
            <section id="experience" className="scroll-mt-20">
              <ProfileCard title="Experience">
                <ExperienceTimeline />
              </ProfileCard>
            </section>

            {/* Certificates — tasteful in-progress state */}
            <section id="certificates" className="scroll-mt-20">
              <ProfileCard title="Certificates">
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                    <Award className="h-6 w-6 text-muted-foreground" />
                  </span>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Currently pursuing a BS in Information Technology and collecting credentials —
                    certificates will land here as they come in.
                  </p>
                </div>
              </ProfileCard>
            </section>

            {/* Contact = iMessage thread */}
            <section id="contact" className="scroll-mt-20">
              <ProfileCard title="Send me a message">
                <ContactThread />
              </ProfileCard>
            </section>
          </main>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
