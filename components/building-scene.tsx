"use client";

import ArchitecturalIllustration from "@/components/architectural-illustration";

interface BuildingSceneProps {
  progress: number;
}

export default function BuildingScene({ progress }: BuildingSceneProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-none lg:rounded-[26px]">
      <ArchitecturalIllustration progress={progress} />

      <div className="pointer-events-none absolute inset-0 architecture-grid opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(120,165,212,0.14),transparent_48%),radial-gradient(circle_at_78%_8%,rgba(206,224,245,0.14),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#060910] via-[#060910]/35 to-transparent" />
    </div>
  );
}
