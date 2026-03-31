import { clsx } from "clsx";

type BadgeColor = "gray" | "blue" | "green" | "yellow" | "red" | "indigo";

interface BadgeProps {
  label: string;
  color?: BadgeColor;
  className?: string;
}

const colorClasses: Record<BadgeColor, string> = {
  gray: "bg-slate-100 text-slate-700",
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  red: "bg-red-100 text-red-700",
  indigo: "bg-indigo-100 text-indigo-700",
};

export const STATUS_COLORS: Record<string, BadgeColor> = {
  PENDING: "yellow",
  SENT: "blue",
  REVIEWING: "indigo",
  REJECTED: "red",
  ACCEPTED: "green",
};

export function Badge({ label, color = "gray", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        colorClasses[color],
        className
      )}
    >
      {label}
    </span>
  );
}
