// app/_components/SkillsSection.tsx
// This section groups skills by category so the homepage reads more clearly.
import { Skill } from "../_lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Skills({ skills }: { skills: Skill[] }) {
  // Group skills by category
  const groupedSkills = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const sortedGroups = Object.entries(groupedSkills).sort(([categoryA], [categoryB]) =>
    categoryA.localeCompare(categoryB)
  );

  return (
    <section id="skills" className="mx-auto max-w-6xl px-4">
      <div className="mb-10 space-y-3">
        <Badge variant="outline" className="w-fit">
          Skills & Expertise
        </Badge>
        <h2 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
          A practical toolkit across product delivery, web engineering, and systems.
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {sortedGroups.map(([category, categorySkills]) => (
          <Card
            key={category}
            className="hover:scale-102 hover:shadow-lg transition-transform duration-300 surface-glow border-white/40 bg-white/70 dark:bg-slate-950/45"
          >
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{category}</CardTitle>
                <Badge variant="secondary">{categorySkills.length}</Badge>
              </div>
              <CardDescription>
                Capabilities used across real delivery work and ongoing practice.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {categorySkills
                .sort((a, b) => a.order - b.order)
                .map((skill) => (
                  <Badge key={skill.id} variant="secondary">
                    {skill.name}
                  </Badge>
                ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
