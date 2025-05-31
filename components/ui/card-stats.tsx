import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { DivideIcon as LucideIcon } from "lucide-react";

interface CardStatsProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  className?: string;
  loading?: boolean;
}

export function CardStats({
  title,
  value,
  icon: Icon,
  trend,
  description,
  className,
  loading = false,
}: CardStatsProps) {
  return (
    <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm p-6", className)}>
      <div className="flex justify-between items-start">
        <div>
          {loading ? (
            <Skeleton className="h-5 w-24" />
          ) : (
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
          )}

          <div className="flex items-baseline gap-2 mt-2">
            {loading ? (
              <Skeleton className="h-9 w-16" />
            ) : (
              <h3 className="text-2xl font-bold">{value}</h3>
            )}

            {trend && !loading && (
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? "+" : "-"}
                {trend.value}%
              </span>
            )}
          </div>

          {description && !loading && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>

        {Icon && !loading && (
          <div className="p-2 rounded-md bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}