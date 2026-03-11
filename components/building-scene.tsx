"use client";

import { BuildStageKey } from "@/lib/site-data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

interface BuildingSceneProps {
  storyRef: React.RefObject<HTMLElement>;
  activeStage: BuildStageKey;
}

const callouts: Array<{ key: BuildStageKey; label: string; className: string }> = [
  { key: "blueprint", label: "Blueprint", className: "left-4 top-6" },
  { key: "foundation", label: "Foundation", className: "left-5 top-1/2" },
  { key: "firstFloor", label: "First Floor", className: "right-6 top-[58%]" },
  { key: "framework", label: "Structure", className: "left-4 top-[36%]" },
  { key: "upperFloors", label: "Elevation", className: "right-6 top-[30%]" },
  { key: "rooftop", label: "Rooftop", className: "right-10 top-10" }
];

export default function BuildingScene({ storyRef, activeStage }: BuildingSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const blueprintRef = useRef<SVGGElement>(null);
  const foundationRef = useRef<SVGGElement>(null);
  const firstFloorRef = useRef<SVGGElement>(null);
  const frameRef = useRef<SVGGElement>(null);
  const upperRef = useRef<SVGGElement>(null);
  const facadeRef = useRef<SVGGElement>(null);
  const roofRef = useRef<SVGGElement>(null);
  const glowRef = useRef<SVGGElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!storyRef.current || !sceneRef.current) return;

    const ctx = gsap.context(() => {
      const blueprintSegments = blueprintRef.current?.querySelectorAll<SVGPathElement>("path,line");

      if (blueprintSegments) {
        blueprintSegments.forEach((segment) => {
          if (typeof segment.getTotalLength !== "function") return;
          const length = segment.getTotalLength();
          gsap.set(segment, { strokeDasharray: length, strokeDashoffset: length * 0.42 });
        });
      }

      gsap.set(foundationRef.current, { autoAlpha: 0, scaleY: 0.15, transformOrigin: "50% 100%" });
      gsap.set(firstFloorRef.current, { autoAlpha: 0, y: 22 });
      gsap.set(frameRef.current, { autoAlpha: 0, scaleY: 0.1, transformOrigin: "50% 100%" });
      gsap.set(upperRef.current, { autoAlpha: 0, y: 40 });
      gsap.set(facadeRef.current, { autoAlpha: 0, y: 22, filter: "blur(6px)" });
      gsap.set(roofRef.current, { autoAlpha: 0, y: 24 });
      gsap.set(glowRef.current, { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: storyRef.current,
          start: "top 20%",
          end: "bottom 80%",
          scrub: 1
        }
      });

      if (blueprintSegments) {
        tl.to(blueprintSegments, { strokeDashoffset: 0, duration: 0.7, stagger: 0.03 }, 0);
      }
      tl.to(foundationRef.current, { autoAlpha: 1, scaleY: 1, duration: 0.65, ease: "power3.out" }, 0.2)
        .to(firstFloorRef.current, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out" }, 0.33)
        .to(frameRef.current, { autoAlpha: 1, scaleY: 1, duration: 0.72, ease: "power3.out" }, 0.42)
        .to(upperRef.current, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.6)
        .to(facadeRef.current, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.55, ease: "power2.out" }, 0.74)
        .to(roofRef.current, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.86)
        .to(glowRef.current, { autoAlpha: 1, duration: 0.4 }, 0.88);

      gsap.to(sceneRef.current, {
        y: -8,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, sceneRef);

    return () => ctx.revert();
  }, [storyRef]);

  return (
    <div ref={sceneRef} className="glass-panel relative rounded-[30px] p-4 lg:p-5">
      <div className="architecture-grid relative overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#0b1522_0%,#0d1826_100%)] p-3 lg:p-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(157,198,239,0.16),transparent_64%)]" />

        <svg viewBox="0 0 700 900" className="relative z-10 h-full w-full">
          <defs>
            <linearGradient id="steelStroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7a8ca4" />
              <stop offset="50%" stopColor="#d5e0ea" />
              <stop offset="100%" stopColor="#7a8ca4" />
            </linearGradient>
            <linearGradient id="glassPanel" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(179,219,255,0.44)" />
              <stop offset="100%" stopColor="rgba(94,138,183,0.09)" />
            </linearGradient>
            <linearGradient id="floorPlate" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(130,154,180,0.56)" />
              <stop offset="100%" stopColor="rgba(58,79,103,0.44)" />
            </linearGradient>
            <linearGradient id="darkPlate" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(58,74,94,0.88)" />
              <stop offset="100%" stopColor="rgba(28,40,56,0.95)" />
            </linearGradient>
            <filter id="softGlow" x="-200%" y="-200%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="18" />
            </filter>
          </defs>

          <g ref={blueprintRef} stroke="rgba(138,179,222,0.45)" strokeWidth="1.2" fill="none">
            <path d="M100 780 L620 780 L680 840 L40 840 Z" />
            <path d="M130 750 L590 750 L630 790 L90 790 Z" />
            <line x1="140" y1="720" x2="140" y2="835" />
            <line x1="210" y1="700" x2="210" y2="830" />
            <line x1="280" y1="680" x2="280" y2="826" />
            <line x1="350" y1="660" x2="350" y2="822" />
            <line x1="420" y1="680" x2="420" y2="826" />
            <line x1="490" y1="700" x2="490" y2="830" />
            <line x1="560" y1="720" x2="560" y2="834" />
            <path d="M220 640 L500 640 L560 700 L160 700 Z" />
            <path d="M250 560 L470 560 L520 610 L200 610 Z" />
            <path d="M270 490 L450 490 L492 530 L228 530 Z" />
            <path d="M286 425 L435 425 L470 458 L252 458 Z" />
            <path d="M299 365 L421 365 L450 392 L270 392 Z" />
            <path d="M309 311 L410 311 L434 334 L286 334 Z" />
          </g>

          <g ref={foundationRef}>
            <path d="M162 700 L560 700 L620 778 L102 778 Z" fill="url(#darkPlate)" />
            <path d="M220 640 L500 640 L560 700 L160 700 Z" fill="url(#floorPlate)" />
            <path d="M160 700 L560 700" stroke="url(#steelStroke)" strokeWidth="2.2" />
            <path d="M220 640 L500 640" stroke="url(#steelStroke)" strokeWidth="2.2" />
          </g>

          <g ref={firstFloorRef}>
            <path d="M200 610 L520 610 L560 650 L160 650 Z" fill="rgba(49,67,89,0.86)" />
            <path d="M250 560 L470 560 L520 610 L200 610 Z" fill="url(#floorPlate)" />
          </g>

          <g ref={frameRef} stroke="url(#steelStroke)" strokeWidth="5" fill="none">
            <line x1="230" y1="640" x2="230" y2="430" />
            <line x1="300" y1="640" x2="300" y2="365" />
            <line x1="360" y1="640" x2="360" y2="330" />
            <line x1="420" y1="640" x2="420" y2="365" />
            <line x1="490" y1="640" x2="490" y2="430" />
            <path d="M206 610 L520 610" />
            <path d="M228 530 L492 530" />
            <path d="M252 458 L470 458" />
            <path d="M270 392 L450 392" />
          </g>

          <g ref={upperRef}>
            <path d="M228 530 L492 530 L530 566 L198 566 Z" fill="rgba(47,63,84,0.95)" />
            <path d="M252 458 L470 458 L505 490 L217 490 Z" fill="rgba(44,58,77,0.95)" />
            <path d="M270 392 L450 392 L480 420 L240 420 Z" fill="rgba(39,53,70,0.95)" />
            <path d="M286 334 L434 334 L460 358 L259 358 Z" fill="rgba(33,46,63,0.95)" />
          </g>

          <g ref={facadeRef}>
            <path d="M254 456 L470 456 L470 610 L254 610 Z" fill="url(#glassPanel)" opacity="0.84" />
            <line x1="290" y1="456" x2="290" y2="610" stroke="rgba(171, 205, 237, 0.35)" />
            <line x1="326" y1="456" x2="326" y2="610" stroke="rgba(171, 205, 237, 0.35)" />
            <line x1="362" y1="456" x2="362" y2="610" stroke="rgba(171, 205, 237, 0.35)" />
            <line x1="398" y1="456" x2="398" y2="610" stroke="rgba(171, 205, 237, 0.35)" />
            <line x1="434" y1="456" x2="434" y2="610" stroke="rgba(171, 205, 237, 0.35)" />
            <line x1="254" y1="492" x2="470" y2="492" stroke="rgba(171, 205, 237, 0.2)" />
            <line x1="254" y1="528" x2="470" y2="528" stroke="rgba(171, 205, 237, 0.2)" />
            <line x1="254" y1="564" x2="470" y2="564" stroke="rgba(171, 205, 237, 0.2)" />
          </g>

          <g ref={roofRef}>
            <path d="M286 312 L410 312 L435 334 L310 334 Z" fill="rgba(196, 213, 230, 0.84)" />
            <path d="M350 312 L350 256" stroke="rgba(191, 222, 252, 0.66)" strokeWidth="2.6" />
            <circle cx="350" cy="246" r="7" fill="rgba(188, 223, 255, 0.92)" />
          </g>

          <g ref={glowRef}>
            <circle cx="350" cy="250" r="68" fill="rgba(151, 196, 240, 0.28)" filter="url(#softGlow)" />
          </g>
        </svg>

        <div className="pointer-events-none absolute inset-0 z-20">
          {callouts.map((item) => {
            const active = activeStage === item.key;
            return (
              <div key={item.key} className={`absolute ${item.className}`}>
                <p
                  className={`rounded-full px-2.5 py-1 text-[0.63rem] uppercase tracking-[0.14rem] transition ${
                    active
                      ? "border border-blue-200/60 bg-blue-200/20 text-blue-100 shadow-[0_0_18px_rgba(132,181,225,0.5)]"
                      : "border border-slate-500/30 bg-slate-700/20 text-slate-400"
                  }`}
                >
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
