import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InfoCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
}

export default function InfoCard({ title, description, icon, className, children, onClick }: InfoCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border bg-card p-5 card-shadow transition-all',
        onClick && 'cursor-pointer hover:card-shadow-hover hover:-translate-y-0.5',
        className
      )}
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-card-foreground">{title}</h3>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
