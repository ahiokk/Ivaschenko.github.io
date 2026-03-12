"use client";

import ArchitecturalIllustration from "@/components/architectural-illustration";

interface BuildingSceneProps {
  progress: number;
}

export default function BuildingScene({ progress }: BuildingSceneProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-none lg:rounded-[26px]">
      <ArchitecturalIllustration progress={progress} />

      <div className="pointer-events-none absolute inset-0 architecture-grid opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_82%,rgba(133,171,212,0.1),transparent_46%),radial-gradient(circle_at_82%_8%,rgba(203,223,245,0.15),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#060910] via-[#060910]/35 to-transparent" />
    </div>
  );
}
