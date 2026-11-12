import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  description,
  align = "left",
  className,
  id,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <h2 id={id} className="text-[clamp(30px,4.4vw,48px)] font-bold leading-[1.02] tracking-[-0.035em]">
        {title}
      </h2>
      {description && <p className="mt-4 text-[17px] leading-relaxed text-muted">{description}</p>}
    </div>
  );
}
