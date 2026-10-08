import { cn } from '@/lib/utils';

interface ProfileCardProps {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

/**
 * Facebook-profile style surface card: dark raised surface, 12px radius,
 * hairline border + soft shadow. The structural building block of the
 * sidebar and the main feed.
 */
export function ProfileCard({ title, action, children, className, bodyClassName }: ProfileCardProps) {
  return (
    <section className={cn('rounded-xl border border-border/70 bg-card shadow-card', className)}>
      {title && (
        <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-2">
          <h2 className="text-[17px] font-bold tracking-tight text-foreground">{title}</h2>
          {action}
        </div>
      )}
      <div className={cn('px-4 pb-4', !title && 'pt-4', bodyClassName)}>{children}</div>
    </section>
  );
}
