"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import ArchitecturalIllustration from "@/components/architectural-illustration";

const ArchitecturalScene = dynamic(() => import("@/components/three/architectural-scene"), {
  ssr: false,
  loading: () => null
});

interface BuildingSceneProps {
  progress: number;
}

export default function BuildingScene({ progress }: BuildingSceneProps) {
  const [mounted, setMounted] = useState(false);
  const [webglSupported, setWebglSupported] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    setMounted(true);

    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      setWebglSupported(Boolean(gl));
    } catch {
      setWebglSupported(false);
    }
  }, []);

  useEffect(() => {
    if (!mounted || !webglSupported) {
      setSceneReady(false);
    }
  }, [mounted, webglSupported]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-none lg:rounded-[26px]">
      <ArchitecturalIllustration progress={progress} />

      {mounted && webglSupported ? (
        <div className={`absolute inset-0 transition-opacity duration-700 ${sceneReady ? "opacity-100" : "opacity-0"}`}>
          <ArchitecturalScene progress={progress} onReady={() => setSceneReady(true)} />
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-0 architecture-grid opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_82%,rgba(133,171,212,0.1),transparent_46%),radial-gradient(circle_at_82%_8%,rgba(203,223,245,0.15),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#060910] via-[#060910]/35 to-transparent" />
    </div>
  );
}
