import { Counter } from "@/components/shared/counter";
import { platformStats } from "@/lib/mock-data/players";

const items = [
  { value: platformStats.totalBattles, label: "Battles fought" },
  { value: platformStats.activeDevelopers, label: "Active developers" },
  { value: platformStats.problemsSolved, label: "Problems solved" },
  { value: platformStats.countries, label: "Countries represented" },
];

export function Stats() {
  return (
    <section aria-label="Platform statistics" className="border-y border-line">
      <dl className="mx-auto grid max-w-[1240px] grid-cols-2 lg:grid-cols-4">
        {items.map((s, i) => (
          <div key={s.label} className={`px-6 py-12 sm:px-10 ${i % 2 ? "border-l border-line" : ""} ${i >= 2 ? "max-lg:border-t lg:border-l" : ""}`}>
            <dt className="text-[13.5px] text-muted">{s.label}</dt>
            <dd className="mt-2 font-mono text-[clamp(26px,3.4vw,40px)] font-semibold tracking-[-0.04em] tabular">
              <Counter value={s.value} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
