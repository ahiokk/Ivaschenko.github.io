"use client";

interface ArchitecturalIllustrationProps {
  progress: number;
}

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const smoothStep = (progress: number, start: number, end: number) => {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  const t = (progress - start) / (end - start);
  return t * t * (3 - 2 * t);
};

interface CuboidProps {
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  reveal?: number;
  frontFill: string;
  sideFill: string;
  topFill: string;
  stroke?: string;
  opacity?: number;
}

function Cuboid({
  x,
  y,
  width,
  height,
  depth,
  reveal = 1,
  frontFill,
  sideFill,
  topFill,
  stroke = "rgba(168, 204, 236, 0.16)",
  opacity = 1
}: CuboidProps) {
  const visible = clamp(reveal);
  if (visible <= 0.01) return null;

  const dx = depth * 0.56;
  const dy = depth * 0.28;
  const visibleHeight = height * visible;
  const topY = y + (height - visibleHeight);

  const front = `${x},${topY} ${x + width},${topY} ${x + width},${topY + visibleHeight} ${x},${topY + visibleHeight}`;
  const side = `${x + width},${topY} ${x + width + dx},${topY - dy} ${x + width + dx},${topY + visibleHeight - dy} ${x + width},${topY + visibleHeight}`;
  const top = `${x},${topY} ${x + dx},${topY - dy} ${x + width + dx},${topY - dy} ${x + width},${topY}`;

  return (
    <g opacity={opacity}>
      <polygon points={front} fill={frontFill} stroke={stroke} strokeWidth="1" />
      <polygon points={side} fill={sideFill} stroke={stroke} strokeWidth="1" />
      <polygon points={top} fill={topFill} stroke={stroke} strokeWidth="1" />
    </g>
  );
}

function FacadeGrid({
  x,
  y,
  width,
  height,
  cols,
  rows,
  reveal,
  glow
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  cols: number;
  rows: number;
  reveal: number;
  glow: number;
}) {
  const visible = clamp(reveal);
  if (visible <= 0.01) return null;

  const visibleHeight = height * visible;
  const topY = y + (height - visibleHeight);
  const gutterX = 6;
  const gutterY = 7;
  const cellWidth = (width - gutterX * (cols + 1)) / cols;
  const cellHeight = (visibleHeight - gutterY * (rows + 1)) / rows;

  return (
    <g>
      <rect x={x} y={topY} width={width} height={visibleHeight} fill="url(#glassFront)" opacity={0.82} stroke="rgba(181, 216, 248, 0.14)" />
      {Array.from({ length: cols - 1 }).map((_, index) => (
        <line
          key={`grid-v-${index}`}
          x1={x + ((index + 1) * width) / cols}
          y1={topY}
          x2={x + ((index + 1) * width) / cols}
          y2={topY + visibleHeight}
          stroke="rgba(196, 225, 250, 0.15)"
          strokeWidth="1"
        />
      ))}
      {Array.from({ length: rows - 1 }).map((_, index) => (
        <line
          key={`grid-h-${index}`}
          x1={x}
          y1={topY + ((index + 1) * visibleHeight) / rows}
          x2={x + width}
          y2={topY + ((index + 1) * visibleHeight) / rows}
          stroke="rgba(196, 225, 250, 0.13)"
          strokeWidth="1"
        />
      ))}
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: cols }).map((__, col) => {
          const rowActivation = clamp(glow * rows - (rows - row - 1), 0, 1);
          const lightSeed = ((row * 5 + col * 3) % 7) / 7;
          const light = clamp(rowActivation * 0.72 + lightSeed * 0.14, 0, 0.85);
          return (
            <rect
              key={`window-${row}-${col}`}
              x={x + gutterX + col * (cellWidth + gutterX)}
              y={topY + gutterY + row * (cellHeight + gutterY)}
              width={cellWidth}
              height={Math.max(cellHeight, 0)}
              fill="#dceeff"
              opacity={light}
              rx="1.2"
            />
          );
        })
      )}
    </g>
  );
}

function SideGlass({
  x,
  y,
  width,
  height,
  depth,
  reveal,
  glow
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  reveal: number;
  glow: number;
}) {
  const visible = clamp(reveal);
  if (visible <= 0.01) return null;

  const dx = depth * 0.56;
  const dy = depth * 0.28;
  const visibleHeight = height * visible;
  const topY = y + (height - visibleHeight);

  return (
    <g>
      <polygon
        points={`${x + width},${topY} ${x + width + dx},${topY - dy} ${x + width + dx},${topY + visibleHeight - dy} ${x + width},${topY + visibleHeight}`}
        fill="url(#glassSide)"
        opacity={0.72}
        stroke="rgba(181, 216, 248, 0.12)"
      />
      {Array.from({ length: 8 }).map((_, index) => {
        const t = (index + 1) / 9;
        return (
          <line
            key={`side-v-${index}`}
            x1={x + width + dx * t}
            y1={topY - dy * t}
            x2={x + width + dx * t}
            y2={topY + visibleHeight - dy * t}
            stroke="rgba(196, 225, 250, 0.14)"
            strokeWidth="1"
          />
        );
      })}
      <polygon
        points={`${x + width},${topY + visibleHeight * 0.18} ${x + width + dx},${topY + visibleHeight * 0.18 - dy} ${x + width + dx},${topY + visibleHeight * 0.78 - dy} ${x + width},${topY + visibleHeight * 0.78}`}
        fill="#ddf0ff"
        opacity={0.04 + glow * 0.18}
      />
    </g>
  );
}

export default function ArchitecturalIllustration({ progress }: ArchitecturalIllustrationProps) {
  const p = clamp(progress);
  const site = smoothStep(p, 0.0, 0.12);
  const foundation = smoothStep(p, 0.12, 0.24);
  const columns = smoothStep(p, 0.24, 0.38);
  const frame = smoothStep(p, 0.38, 0.52);
  const floors = smoothStep(p, 0.52, 0.68);
  const facade = smoothStep(p, 0.68, 0.82);
  const upper = smoothStep(p, 0.82, 0.94);
  const roof = smoothStep(p, 0.94, 1);

  const anchorX = 735;
  const anchorY = 882;
  const cameraScale = 1.08 - p * 0.16;
  const orbitX = Math.sin(p * Math.PI * 0.9) * 18;
  const framingLift = -p * 18;
  const atmosphereShiftY = -p * 18;
  const gridShiftY = p * 16;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#05070d]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_24%,rgba(118,165,212,0.28),transparent_32%),radial-gradient(circle_at_52%_88%,rgba(98,142,188,0.15),transparent_24%),linear-gradient(180deg,#04070d_0%,#06101a_52%,#08111c_100%)]" />

      <svg viewBox="0 0 1500 1200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#142334" stopOpacity="0.62" />
            <stop offset="100%" stopColor="#08111b" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="concreteFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#485361" />
            <stop offset="100%" stopColor="#252d35" />
          </linearGradient>
          <linearGradient id="concreteTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5f6d7e" />
            <stop offset="100%" stopColor="#35414f" />
          </linearGradient>
          <linearGradient id="steelFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#94a5b8" />
            <stop offset="100%" stopColor="#5b6b7c" />
          </linearGradient>
          <linearGradient id="glassFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9fd0ff" stopOpacity="0.42" />
            <stop offset="55%" stopColor="#4e7aa4" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#17324a" stopOpacity="0.58" />
          </linearGradient>
          <linearGradient id="glassSide" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7db4e8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#12283f" stopOpacity="0.58" />
          </linearGradient>
          <radialGradient id="towerBloom" cx="50%" cy="38%" r="48%">
            <stop offset="0%" stopColor="#a4d2ff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#a4d2ff" stopOpacity="0" />
          </radialGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="18" />
          </filter>
          <filter id="shadowBlur">
            <feGaussianBlur stdDeviation="22" />
          </filter>
        </defs>

        <g transform={`translate(0 ${atmosphereShiftY})`}>
          <ellipse cx="735" cy="308" rx="320" ry="210" fill="url(#towerBloom)" filter="url(#softGlow)" opacity={0.82} />
          <g opacity={0.42}>
            {Array.from({ length: 28 }).map((_, index) => {
              const cx = 180 + ((index * 91) % 980);
              const cy = 120 + ((index * 143) % 510);
              return <circle key={`dust-${index}`} cx={cx} cy={cy} r={1.3 + (index % 3) * 0.7} fill="#bad9f4" opacity={0.18 + (index % 4) * 0.05} />;
            })}
          </g>
        </g>

        <g transform={`translate(0 ${gridShiftY})`}>
          <g opacity={0.56}>
            <polygon points="120,930 735,670 1385,930 735,1180" fill="url(#groundGradient)" />
            {Array.from({ length: 22 }).map((_, index) => {
              const startX = 120 + index * 58;
              const endX = 735 + index * 30;
              return <line key={`ga-${index}`} x1={startX} y1="930" x2={endX} y2="670" stroke="rgba(108,148,191,0.16)" strokeWidth="1" />;
            })}
            {Array.from({ length: 22 }).map((_, index) => {
              const startX = 1385 - index * 58;
              const endX = 735 - index * 30;
              return <line key={`gb-${index}`} x1={startX} y1="930" x2={endX} y2="670" stroke="rgba(108,148,191,0.16)" strokeWidth="1" />;
            })}
            {Array.from({ length: 12 }).map((_, index) => {
              const t = index / 11;
              const leftX = 120 + (735 - 120) * t;
              const leftY = 930 + (670 - 930) * t;
              const rightX = 1385 + (735 - 1385) * t;
              const rightY = 930 + (670 - 930) * t;
              return <line key={`gc-${index}`} x1={leftX} y1={leftY} x2={rightX} y2={rightY} stroke="rgba(108,148,191,0.16)" strokeWidth="1" />;
            })}
          </g>

          <g opacity={0.8 * site}>
            <polygon points="560,856 770,770 940,856 726,946" fill="none" stroke="rgba(160,198,233,0.34)" strokeWidth="1.2" />
            <polygon points="600,840 774,770 912,834 734,908" fill="none" stroke="rgba(160,198,233,0.22)" strokeWidth="1" />
          </g>
        </g>

        <g transform={`translate(${orbitX} ${framingLift}) translate(${anchorX} ${anchorY}) scale(${cameraScale}) translate(${-anchorX} ${-anchorY})`}>
          <ellipse cx={anchorX} cy={anchorY + 12} rx="214" ry="48" fill="#8dc6ff" opacity={0.18 + facade * 0.16 + roof * 0.12} filter="url(#softGlow)" />
          <ellipse cx={anchorX} cy={anchorY + 18} rx="168" ry="24" fill="#05070d" opacity="0.82" filter="url(#shadowBlur)" />

          <g opacity={0.26 + site * 0.2}>
            <polygon points="636,140 818,140 862,118 680,118" fill="none" stroke="rgba(156,194,230,0.16)" />
            <polygon points="636,140 636,812 818,812 818,140" fill="none" stroke="rgba(156,194,230,0.18)" />
            <polygon points="818,140 862,118 862,790 818,812" fill="none" stroke="rgba(156,194,230,0.14)" />
            {Array.from({ length: 12 }).map((_, index) => {
              const y = 190 + index * 48;
              return <line key={`outline-level-${index}`} x1="636" y1={y} x2="818" y2={y} stroke="rgba(156,194,230,0.1)" />;
            })}
          </g>

          <Cuboid
            x={594}
            y={812}
            width={282}
            height={32}
            depth={132}
            reveal={foundation}
            frontFill="url(#concreteFront)"
            sideFill="#26323d"
            topFill="url(#concreteTop)"
            opacity={0.98}
          />
          <Cuboid
            x={628}
            y={742}
            width={214}
            height={72}
            depth={110}
            reveal={foundation}
            frontFill="#384451"
            sideFill="#263240"
            topFill="#5f6f81"
            opacity={0.96}
          />

          <g opacity={0.92}>
            {[652, 690, 732, 774, 812].map((x, index) => {
              const visible = smoothStep(columns, index * 0.05, 0.84);
              return (
                <line
                  key={`main-col-${x}`}
                  x1={x}
                  y1="742"
                  x2={x}
                  y2={742 - 534 * visible}
                  stroke="url(#steelFront)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity={0.88}
                />
              );
            })}
            {[636, 670].map((x, index) => {
              const visible = smoothStep(columns, 0.08 + index * 0.08, 0.82);
              return (
                <line
                  key={`blade-col-${x}`}
                  x1={x}
                  y1="742"
                  x2={x}
                  y2={742 - 412 * visible}
                  stroke="#7e91a6"
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity={0.74}
                />
              );
            })}
          </g>

          <g opacity={0.84}>
            {Array.from({ length: 11 }).map((_, level) => {
              const reveal = smoothStep(frame, Math.max(0, level * 0.08 - 0.08), Math.min(1, 0.34 + level * 0.08));
              const y = 734 - level * 46;
              return (
                <g key={`frame-${level}`} opacity={reveal}>
                  <line x1="636" y1={y} x2={636 + 182 * reveal} y2={y} stroke="#7d93a9" strokeWidth="4.5" strokeLinecap="round" />
                  <line x1="818" y1={y} x2={862 - (1 - reveal) * 44} y2={y - 22 * reveal} stroke="#6f879e" strokeWidth="3.5" strokeLinecap="round" />
                </g>
              );
            })}
          </g>

          {Array.from({ length: 11 }).map((_, level) => {
            const reveal = smoothStep(floors, Math.max(0, level * 0.07 - 0.12), Math.min(1, 0.46 + level * 0.06));
            return (
              <Cuboid
                key={`plate-${level}`}
                x={634 + level}
                y={724 - level * 46}
                width={186 - level * 1.5}
                height={9}
                depth={96 - level * 2}
                reveal={reveal}
                frontFill="#485d71"
                sideFill="#324454"
                topFill="#7d95af"
                opacity={0.9}
              />
            );
          })}

          <Cuboid
            x={688}
            y={210}
            width={118}
            height={532}
            depth={84}
            reveal={floors}
            frontFill="rgba(74, 89, 108, 0.16)"
            sideFill="rgba(34, 49, 63, 0.28)"
            topFill="rgba(121, 147, 172, 0.16)"
            opacity={0.72}
          />
          <Cuboid
            x={636}
            y={330}
            width={50}
            height={412}
            depth={62}
            reveal={floors}
            frontFill="rgba(74, 89, 108, 0.14)"
            sideFill="rgba(34, 49, 63, 0.24)"
            topFill="rgba(121, 147, 172, 0.16)"
            opacity={0.66}
          />
          <Cuboid
            x={808}
            y={418}
            width={38}
            height={324}
            depth={42}
            reveal={floors}
            frontFill="rgba(74, 89, 108, 0.12)"
            sideFill="rgba(34, 49, 63, 0.22)"
            topFill="rgba(121, 147, 172, 0.14)"
            opacity={0.62}
          />

          <Cuboid
            x={688}
            y={210}
            width={118}
            height={532}
            depth={84}
            reveal={facade}
            frontFill="rgba(84, 120, 156, 0.16)"
            sideFill="rgba(24, 44, 67, 0.28)"
            topFill="rgba(132, 176, 220, 0.18)"
            opacity={0.84}
          />
          <FacadeGrid x={688} y={210} width={118} height={532} cols={4} rows={13} reveal={facade} glow={smoothStep(p, 0.8, 1)} />
          <SideGlass x={688} y={210} width={118} height={532} depth={84} reveal={facade} glow={smoothStep(p, 0.82, 1)} />

          <Cuboid
            x={636}
            y={330}
            width={50}
            height={412}
            depth={62}
            reveal={facade}
            frontFill="rgba(84, 120, 156, 0.15)"
            sideFill="rgba(24, 44, 67, 0.24)"
            topFill="rgba(132, 176, 220, 0.16)"
            opacity={0.76}
          />
          <FacadeGrid x={636} y={330} width={50} height={412} cols={2} rows={10} reveal={facade} glow={smoothStep(p, 0.82, 1)} />

          <Cuboid
            x={808}
            y={418}
            width={38}
            height={324}
            depth={42}
            reveal={facade}
            frontFill="rgba(84, 120, 156, 0.13)"
            sideFill="rgba(24, 44, 67, 0.2)"
            topFill="rgba(132, 176, 220, 0.14)"
            opacity={0.72}
          />
          <FacadeGrid x={808} y={418} width={38} height={324} cols={2} rows={8} reveal={facade} glow={smoothStep(p, 0.82, 1)} />

          <Cuboid
            x={704}
            y={136}
            width={88}
            height={70}
            depth={70}
            reveal={upper}
            frontFill="#445564"
            sideFill="#2f3f4e"
            topFill="#7289a2"
            opacity={0.98}
          />
          <Cuboid
            x={712}
            y={108}
            width={72}
            height={24}
            depth={58}
            reveal={roof}
            frontFill="#d6e1ec"
            sideFill="#8095a9"
            topFill="#f2f7fc"
            opacity={1}
          />
          <line x1="748" y1="106" x2="748" y2={106 - 34 * roof} stroke="#a4d2ff" strokeWidth="3" strokeLinecap="round" opacity={0.94} />
          <circle cx="748" cy={70 - roof * 2} r={6 * roof} fill="#e1f2ff" opacity={0.96} />
          <circle cx="748" cy={70 - roof * 2} r={20 * roof} fill="#8fd1ff" opacity={0.18} filter="url(#softGlow)" />

          <g opacity={0.14 + facade * 0.26 + roof * 0.18}>
            <line x1="688" y1="210" x2="806" y2="210" stroke="#c8e5ff" strokeWidth="1" />
            <line x1="688" y1="742" x2="806" y2="742" stroke="#c8e5ff" strokeWidth="1" />
            <line x1="806" y1="210" x2="852" y2="186" stroke="#c8e5ff" strokeWidth="1" />
            <line x1="806" y1="742" x2="852" y2="718" stroke="#c8e5ff" strokeWidth="1" />
            <line x1="852" y1="186" x2="852" y2="718" stroke="#c8e5ff" strokeWidth="1" />
          </g>
        </g>
      </svg>
    </div>
  );
}
