type SectionHeadingProps = {
  title: string;
  description: string;
}

export function SectionHeading({ title = "Title Here", description = "Description Here" }: SectionHeadingProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{title}</h2>
      <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto md:mx-0">
        {description}
      </p>
    </div>
  )
}
