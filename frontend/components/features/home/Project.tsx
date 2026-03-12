import Link from "next/link";
import { ProjectCard } from "@/components/common/ProjectCard";
import { Section } from "@/components/common/Section";
import { PROJECTS } from "@/constants/project";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";

export function Projects() {
  return (
    <Section className="space-y-12">
      {/* Section Heading */}
      <SectionHeading title="Featured Projects" description="Here are some of the projects I've worked on recently. Each one presented unique challenges and learning opportunities." />

      {/* Featured Top 3 Projects */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.slice(0, 3).map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>

      {/* CTA Button */}
      <div className="flex justify-center">
        <Link href="/projects">
          <Button variant="outline" size="lg" className="group">
            Check out all projects
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </Section>
  )
}
