import { HTMLAttributes } from "react";
import { clsx } from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function Card({ title, className, children, ...props }: CardProps) {
  return (
    <div
      className={clsx("rounded-xl border border-slate-200 bg-white shadow-sm", className)}
      {...props}
    >
      {title && (
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}
