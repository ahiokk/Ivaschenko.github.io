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
  glow,
  glassFill = "url(#glassFront)"
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  cols: number;
  rows: number;
  reveal: number;
  glow: number;
  glassFill?: string;
}) {
  const visible = clamp(reveal);
  if (visible <= 0.01) return null;

  const visibleHeight = height * visible;
  const topY = y + (height - visibleHeight);
  const gutterX = 6;
  const gutterY = 7;
  const cellWidth = (width - gutterX * (cols + 1)) / cols;
  const cellHeight = (visibleHeight - gutterY * (rows + 1)) / rows;

  if (cellWidth <= 0 || cellHeight <= 0) return null;

  return (
    <g>
      <rect x={x} y={topY} width={width} height={visibleHeight} fill={glassFill} opacity={0.94} stroke="rgba(181, 216, 248, 0.18)" />
      <rect x={x} y={topY} width={width} height={visibleHeight} fill="url(#glassSheen)" opacity={0.16} />
      {Array.from({ length: cols - 1 }).map((_, index) => (
        <line
          key={`mullion-v-${index}`}
          x1={x + ((index + 1) * width) / cols}
          y1={topY}
          x2={x + ((index + 1) * width) / cols}
          y2={topY + visibleHeight}
          stroke="rgba(196, 225, 250, 0.22)"
          strokeWidth="1"
        />
      ))}
      {Array.from({ length: rows - 1 }).map((_, index) => (
        <line
          key={`mullion-h-${index}`}
          x1={x}
          y1={topY + ((index + 1) * visibleHeight) / rows}
          x2={x + width}
          y2={topY + ((index + 1) * visibleHeight) / rows}
          stroke="rgba(196, 225, 250, 0.18)"
          strokeWidth="1"
        />
      ))}
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: cols }).map((__, col) => {
          const rowActivation = clamp(glow * rows - (rows - row - 1), 0, 1);
          const lightSeed = ((row * 5 + col * 3) % 7) / 7;
          const light = clamp(rowActivation * 0.5 + lightSeed * 0.1, 0.06, 0.64);
          const shadow = ((row + col * 2) % 4) === 0 ? 0.28 : 0;
          const windowX = x + gutterX + col * (cellWidth + gutterX);
          const windowY = topY + gutterY + row * (cellHeight + gutterY);
          return (
            <g key={`window-${row}-${col}`}>
              <rect x={windowX} y={windowY} width={cellWidth} height={Math.max(cellHeight, 0)} fill="#dceeff" opacity={light} rx="1.2" />
              {shadow > 0 ? (
                <rect
                  x={windowX + 2}
                  y={windowY + cellHeight * 0.42}
                  width={cellWidth * 0.64}
                  height={Math.max(cellHeight * 0.22, 0)}
                  fill="#203041"
                  opacity={shadow}
                  rx="1"
                />
              ) : null}
            </g>
          );
        })
      )}
    </g>
  );
}

function VerticalFins({
  x,
  y,
  width,
  height,
  count,
  reveal,
  opacity = 0.8
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  count: number;
  reveal: number;
  opacity?: number;
}) {
  const visible = clamp(reveal);
  if (visible <= 0.01) return null;

  const visibleHeight = height * visible;
  const topY = y + (height - visibleHeight);
  const spacing = width / (count + 1);

  return (
    <g opacity={opacity}>
      {Array.from({ length: count }).map((_, index) => (
        <rect
          key={`fin-${index}`}
          x={x + spacing * (index + 1) - 1.6}
          y={topY}
          width="3.2"
          height={visibleHeight}
          fill="url(#metalEdge)"
          rx="1.4"
        />
      ))}
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
        opacity={0.82}
        stroke="rgba(181, 216, 248, 0.14)"
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
      {Array.from({ length: 10 }).map((_, index) => {
        const t = (index + 1) / 11;
        return (
          <line
            key={`side-h-${index}`}
            x1={x + width}
            y1={topY + visibleHeight * t}
            x2={x + width + dx}
            y2={topY + visibleHeight * t - dy}
            stroke="rgba(196, 225, 250, 0.1)"
            strokeWidth="1"
          />
        );
      })}
      <polygon
        points={`${x + width},${topY + visibleHeight * 0.18} ${x + width + dx},${topY + visibleHeight * 0.18 - dy} ${x + width + dx},${topY + visibleHeight * 0.78 - dy} ${x + width},${topY + visibleHeight * 0.78}`}
        fill="#ddf0ff"
        opacity={0.03 + glow * 0.12}
      />
      <line
        x1={x + width + dx * 0.18}
        y1={topY - dy * 0.18}
        x2={x + width + dx * 0.18}
        y2={topY + visibleHeight - dy * 0.18}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.2"
        opacity={0.4}
      />
    </g>
  );
}

function GhostTowerOutline({ opacity }: { opacity: number }) {
  if (opacity <= 0.01) return null;

  return (
    <g opacity={opacity}>
      <polygon points="652,166 834,166 890,140 708,140" fill="none" stroke="rgba(156,194,230,0.18)" />
      <polygon points="652,166 652,722 834,722 834,166" fill="none" stroke="rgba(156,194,230,0.18)" />
      <polygon points="834,166 890,140 890,696 834,722" fill="none" stroke="rgba(156,194,230,0.12)" />
      <polygon points="618,286 652,286 690,268 656,268" fill="none" stroke="rgba(156,194,230,0.14)" />
      <polygon points="834,370 894,370 928,352 868,352" fill="none" stroke="rgba(156,194,230,0.14)" />
      <polygon points="700,112 808,112 844,94 736,94" fill="none" stroke="rgba(156,194,230,0.18)" />
      {Array.from({ length: 14 }).map((_, index) => {
        const y = 204 + index * 36;
        return <line key={`ghost-floor-${index}`} x1="652" y1={y} x2="834" y2={y} stroke="rgba(156,194,230,0.1)" strokeDasharray="4 8" />;
      })}
    </g>
  );
}

function Tree({
  x,
  y,
  scale,
  reveal,
  tint = "url(#treeLeaf)"
}: {
  x: number;
  y: number;
  scale: number;
  reveal: number;
  tint?: string;
}) {
  const visible = clamp(reveal);
  if (visible <= 0.01) return null;

  return (
    <g opacity={0.2 + visible * 0.78} transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="6" rx="26" ry="10" fill="#070d14" opacity="0.55" />
      <rect x="-2.4" y="-28" width="4.8" height="30" rx="2" fill="#425060" />
      <circle cx="-10" cy="-38" r="17" fill={tint} opacity="0.95" />
      <circle cx="8" cy="-36" r="19" fill={tint} opacity="0.95" />
      <circle cx="0" cy="-50" r="21" fill={tint} opacity="0.98" />
      <circle cx="14" cy="-46" r="13" fill="url(#treeLeafLight)" opacity="0.55" />
    </g>
  );
}

function Lamp({
  x,
  y,
  reveal
}: {
  x: number;
  y: number;
  reveal: number;
}) {
  const visible = clamp(reveal);
  if (visible <= 0.01) return null;

  return (
    <g opacity={0.18 + visible * 0.82}>
      <line x1={x} y1={y} x2={x} y2={y - 42} stroke="#7d92aa" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx={x} cy={y - 46} r="4.2" fill="#d7efff" />
      <circle cx={x} cy={y - 46} r="18" fill="#8fd1ff" opacity="0.16" filter="url(#softGlow)" />
    </g>
  );
}

function SkylineBlock({
  x,
  y,
  width,
  height,
  depth,
  opacity = 0.18
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  opacity?: number;
}) {
  return (
    <Cuboid
      x={x}
      y={y}
      width={width}
      height={height}
      depth={depth}
      frontFill="url(#skylineFront)"
      sideFill="url(#skylineSide)"
      topFill="#27374a"
      opacity={opacity}
      stroke="rgba(152, 190, 227, 0.08)"
    />
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

  const park = smoothStep(p, 0.56, 0.84);
  const city = smoothStep(p, 0.2, 0.76);
  const nightLights = smoothStep(p, 0.7, 1);

  const anchorX = 748;
  const anchorY = 900;
  const cameraScale = 1.16 - p * 0.1;
  const orbitX = Math.sin(p * Math.PI * 0.86) * 16;
  const framingLift = -p * 8;
  const atmosphereShiftY = -p * 14;
  const skylineShiftY = p * 10;
  const gridShiftY = p * 9;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#05070d]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_46%_22%,rgba(124,171,218,0.34),transparent_32%),radial-gradient(circle_at_50%_78%,rgba(104,150,196,0.16),transparent_24%),linear-gradient(180deg,#04070d_0%,#07111c_54%,#091320_100%)]" />

      <svg viewBox="0 0 1600 1200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#17283b" stopOpacity="0.62" />
            <stop offset="100%" stopColor="#09131f" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="parkPath" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#314352" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#1e2a36" stopOpacity="0.72" />
          </linearGradient>
          <linearGradient id="grassPlane" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#20372f" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#102019" stopOpacity="0.32" />
          </linearGradient>
          <linearGradient id="concreteFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#586573" />
            <stop offset="100%" stopColor="#2a333d" />
          </linearGradient>
          <linearGradient id="concreteSide" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#394551" />
            <stop offset="100%" stopColor="#222b34" />
          </linearGradient>
          <linearGradient id="concreteTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#738296" />
            <stop offset="100%" stopColor="#42505e" />
          </linearGradient>
          <linearGradient id="podiumStoneFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4f5f6f" />
            <stop offset="45%" stopColor="#3a4653" />
            <stop offset="100%" stopColor="#232b35" />
          </linearGradient>
          <linearGradient id="podiumStoneSide" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#33404d" />
            <stop offset="100%" stopColor="#19222c" />
          </linearGradient>
          <linearGradient id="podiumStoneTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7f92a6" />
            <stop offset="100%" stopColor="#4c5d6d" />
          </linearGradient>
          <linearGradient id="podiumGlassFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d9efff" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#173149" stopOpacity="0.78" />
          </linearGradient>
          <linearGradient id="podiumGlassSide" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a8d4ff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#12283b" stopOpacity="0.82" />
          </linearGradient>
          <linearGradient id="steelFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a3b2c2" />
            <stop offset="100%" stopColor="#647387" />
          </linearGradient>
          <linearGradient id="metalEdge" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#abc0d6" />
            <stop offset="100%" stopColor="#5d7085" />
          </linearGradient>
          <linearGradient id="towerBodyFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#445465" />
            <stop offset="48%" stopColor="#2d3946" />
            <stop offset="100%" stopColor="#19232d" />
          </linearGradient>
          <linearGradient id="towerBodySide" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2e3d4b" />
            <stop offset="100%" stopColor="#121c26" />
          </linearGradient>
          <linearGradient id="towerBodyTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#75889d" />
            <stop offset="100%" stopColor="#40505f" />
          </linearGradient>
          <linearGradient id="towerGlassSkinFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9cc8ef" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#0f2436" stopOpacity="0.58" />
          </linearGradient>
          <linearGradient id="towerGlassSkinSide" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6ca5d3" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#102335" stopOpacity="0.68" />
          </linearGradient>
          <linearGradient id="towerGlassSkinTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a8d2f2" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#385069" stopOpacity="0.44" />
          </linearGradient>
          <linearGradient id="crownFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#526477" />
            <stop offset="100%" stopColor="#293645" />
          </linearGradient>
          <linearGradient id="crownSide" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#364757" />
            <stop offset="100%" stopColor="#1d2a35" />
          </linearGradient>
          <linearGradient id="crownTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8fa4b7" />
            <stop offset="100%" stopColor="#596d80" />
          </linearGradient>
          <linearGradient id="canopyMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dce8f4" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#5f758a" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="glassFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#bedfff" stopOpacity="0.24" />
            <stop offset="55%" stopColor="#4f7394" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#13273a" stopOpacity="0.82" />
          </linearGradient>
          <linearGradient id="glassFrontDeep" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b9dbf7" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0d1f30" stopOpacity="0.84" />
          </linearGradient>
          <linearGradient id="glassSide" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9ecaf0" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#102132" stopOpacity="0.76" />
          </linearGradient>
          <linearGradient id="glassSheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="36%" stopColor="#ffffff" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="skylineFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#364658" />
            <stop offset="100%" stopColor="#1b2633" />
          </linearGradient>
          <linearGradient id="skylineSide" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#283546" />
            <stop offset="100%" stopColor="#0f1924" />
          </linearGradient>
          <radialGradient id="towerBloom" cx="50%" cy="38%" r="48%">
            <stop offset="0%" stopColor="#a4d2ff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#a4d2ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lobbyGlow" cx="50%" cy="54%" r="54%">
            <stop offset="0%" stopColor="#e7f5ff" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#8bcfff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cityHaze" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9fcbf6" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#9fcbf6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="plazaGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a3d0fa" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#a3d0fa" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="treeLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#446957" />
            <stop offset="100%" stopColor="#23382c" />
          </linearGradient>
          <linearGradient id="treeLeafLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6ca186" />
            <stop offset="100%" stopColor="#314f41" />
          </linearGradient>
          <radialGradient id="waterPool" cx="50%" cy="50%" r="54%">
            <stop offset="0%" stopColor="#7fc2ff" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#7fc2ff" stopOpacity="0" />
          </radialGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="18" />
          </filter>
          <filter id="shadowBlur">
            <feGaussianBlur stdDeviation="24" />
          </filter>
          <filter id="skyBlur">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        <g transform={`translate(0 ${atmosphereShiftY})`}>
          <ellipse cx="752" cy="290" rx="382" ry="228" fill="url(#towerBloom)" filter="url(#softGlow)" opacity="0.86" />
          <ellipse cx="1130" cy="408" rx="190" ry="150" fill="url(#cityHaze)" opacity="0.4" />
          <ellipse cx="348" cy="428" rx="180" ry="140" fill="url(#cityHaze)" opacity="0.28" />
          <polygon points="512,106 652,106 808,770 668,770" fill="url(#cityHaze)" opacity="0.18" />
          <polygon points="796,86 916,86 1080,770 960,770" fill="url(#cityHaze)" opacity="0.14" />
          <g opacity={0.44}>
            {Array.from({ length: 34 }).map((_, index) => {
              const cx = 180 + ((index * 93) % 1100);
              const cy = 108 + ((index * 149) % 520);
              return <circle key={`dust-${index}`} cx={cx} cy={cy} r={1.2 + (index % 3) * 0.8} fill="#bad9f4" opacity={0.16 + (index % 5) * 0.05} />;
            })}
          </g>
        </g>

        <g opacity={0.18 + city * 0.22} transform={`translate(0 ${skylineShiftY})`} filter="url(#skyBlur)">
          <rect x="232" y="312" width="112" height="450" fill="url(#skylineFront)" opacity="0.18" />
          <rect x="326" y="268" width="86" height="494" fill="url(#skylineFront)" opacity="0.16" />
          <rect x="1064" y="296" width="126" height="466" fill="url(#skylineFront)" opacity="0.16" />
          <rect x="1180" y="252" width="94" height="510" fill="url(#skylineFront)" opacity="0.14" />
          <rect x="1330" y="360" width="74" height="408" fill="url(#skylineFront)" opacity="0.12" />
        </g>

        <g opacity={0.28 + city * 0.32} transform={`translate(0 ${skylineShiftY})`}>
          <SkylineBlock x={264} y={354} width={88} height={366} depth={62} opacity={0.18} />
          <SkylineBlock x={360} y={294} width={74} height={430} depth={50} opacity={0.16} />
          <SkylineBlock x={1104} y={326} width={98} height={394} depth={64} opacity={0.17} />
          <SkylineBlock x={1216} y={286} width={78} height={452} depth={52} opacity={0.16} />
          <SkylineBlock x={1352} y={376} width={54} height={336} depth={40} opacity={0.13} />

          <g opacity={0.12 + nightLights * 0.24}>
            {[
              [288, 394, 4, 10],
              [392, 338, 3, 12],
              [1130, 370, 4, 11],
              [1240, 324, 3, 12],
              [1368, 408, 2, 10]
            ].map(([x, y, cols, rows], blockIndex) =>
              Array.from({ length: rows }).map((_, row) =>
                Array.from({ length: cols }).map((__, col) => (
                  <rect
                    key={`skyline-window-${blockIndex}-${row}-${col}`}
                    x={Number(x) + col * 14}
                    y={Number(y) + row * 20}
                    width="5"
                    height="8"
                    rx="1"
                    fill="#d9eeff"
                    opacity={0.24 + ((row + col + blockIndex) % 3) * 0.14}
                  />
                ))
              )
            )}
          </g>
        </g>

        <g transform={`translate(0 ${gridShiftY})`}>
          <g opacity={0.58}>
            <polygon points="98,942 736,674 1512,942 736,1214" fill="url(#groundGradient)" />
            {Array.from({ length: 24 }).map((_, index) => {
              const startX = 98 + index * 58;
              const endX = 736 + index * 32;
              return <line key={`ga-${index}`} x1={startX} y1="942" x2={endX} y2="674" stroke="rgba(108,148,191,0.16)" strokeWidth="1" />;
            })}
            {Array.from({ length: 24 }).map((_, index) => {
              const startX = 1512 - index * 58;
              const endX = 736 - index * 32;
              return <line key={`gb-${index}`} x1={startX} y1="942" x2={endX} y2="674" stroke="rgba(108,148,191,0.16)" strokeWidth="1" />;
            })}
            {Array.from({ length: 13 }).map((_, index) => {
              const t = index / 12;
              const leftX = 98 + (736 - 98) * t;
              const leftY = 942 + (674 - 942) * t;
              const rightX = 1512 + (736 - 1512) * t;
              const rightY = 942 + (674 - 942) * t;
              return <line key={`gc-${index}`} x1={leftX} y1={leftY} x2={rightX} y2={rightY} stroke="rgba(108,148,191,0.16)" strokeWidth="1" />;
            })}
          </g>

          <g opacity={0.88 * site}>
            <polygon points="574,870 780,784 952,870 742,962" fill="none" stroke="rgba(160,198,233,0.38)" strokeWidth="1.2" />
            <polygon points="612,850 784,780 922,844 748,918" fill="none" stroke="rgba(160,198,233,0.24)" strokeWidth="1" />
            <line x1="742" y1="962" x2="742" y2="742" stroke="rgba(160,198,233,0.16)" strokeDasharray="5 7" />
          </g>

          <g opacity={0.12 + park * 0.7}>
            <polygon points="358,916 538,840 612,900 438,980" fill="url(#grassPlane)" />
            <polygon points="890,900 1058,838 1196,908 1018,986" fill="url(#grassPlane)" />
            <polygon points="424,924 560,866 614,908 480,970" fill="url(#parkPath)" opacity="0.72" />
            <polygon points="884,910 1014,860 1138,922 1008,970" fill="url(#parkPath)" opacity="0.72" />
            <ellipse cx="736" cy="956" rx="208" ry="48" fill="url(#plazaGlow)" opacity="0.42" />
          </g>
        </g>

        <g transform={`translate(${orbitX} ${framingLift}) translate(${anchorX} ${anchorY}) scale(${cameraScale}) translate(${-anchorX} ${-anchorY})`}>
          <ellipse cx={anchorX} cy={anchorY + 12} rx="236" ry="56" fill="#8dc6ff" opacity={0.18 + facade * 0.18 + nightLights * 0.08} filter="url(#softGlow)" />
          <ellipse cx={anchorX} cy={anchorY + 20} rx="188" ry="28" fill="#05070d" opacity="0.82" filter="url(#shadowBlur)" />

          <GhostTowerOutline opacity={0.2 + site * 0.28} />

          <Cuboid
            x={548}
            y={832}
            width={396}
            height={54}
            depth={208}
            reveal={foundation}
            frontFill="url(#podiumStoneFront)"
            sideFill="url(#podiumStoneSide)"
            topFill="url(#podiumStoneTop)"
            opacity={0.98}
          />
          <polygon
            points="560,848 904,848 1018,792 672,792"
            fill="rgba(224,236,247,0.08)"
            stroke="rgba(176,208,236,0.12)"
            opacity={foundation}
          />
          <Cuboid
            x={600}
            y={720}
            width={290}
            height={126}
            depth={174}
            reveal={foundation}
            frontFill="url(#podiumStoneFront)"
            sideFill="url(#podiumStoneSide)"
            topFill="url(#podiumStoneTop)"
            opacity={0.97}
          />
          <Cuboid
            x={638}
            y={662}
            width={232}
            height={62}
            depth={150}
            reveal={foundation}
            frontFill="rgba(188,220,248,0.1)"
            sideFill="rgba(58,83,108,0.2)"
            topFill="rgba(220,238,251,0.18)"
            opacity={0.96}
          />
          <polygon
            points="632,720 872,720 914,700 674,700"
            fill="url(#canopyMetal)"
            stroke="rgba(188,220,247,0.18)"
            opacity={foundation}
          />
          <polygon
            points="656,738 824,738 858,720 690,720"
            fill="rgba(224,241,255,0.08)"
            opacity={foundation}
          />
          <g opacity={foundation}>
            <polygon points="620,844 838,844 872,828 652,828" fill="rgba(15,24,33,0.86)" />
            <polygon points="636,830 822,830 850,816 664,816" fill="rgba(32,44,57,0.82)" />
            <polygon points="654,816 804,816 826,806 676,806" fill="rgba(56,73,91,0.76)" />
            <line x1="664" y1="828" x2="850" y2="828" stroke="rgba(170,201,228,0.12)" />
            <line x1="680" y1="816" x2="826" y2="816" stroke="rgba(170,201,228,0.1)" />
          </g>

          <polygon
            points="664,786 828,786 828,726 862,708 862,804 664,804"
            fill="url(#podiumGlassFront)"
            stroke="rgba(190,220,246,0.18)"
            opacity={0.46 + foundation * 0.16 + nightLights * 0.16}
          />
          <polygon
            points="828,786 862,768 862,804 828,804"
            fill="url(#podiumGlassSide)"
            stroke="rgba(190,220,246,0.12)"
            opacity={0.54 + foundation * 0.12}
          />
          <ellipse cx="742" cy="792" rx="104" ry="50" fill="url(#lobbyGlow)" opacity={0.14 + nightLights * 0.48} />
          <g opacity={0.1 + nightLights * 0.62}>
            {Array.from({ length: 9 }).map((_, index) => (
              <rect key={`lobby-window-${index}`} x={676 + index * 17.6} y="746" width="10" height="46" rx="1.5" fill="#def1ff" opacity={0.34 + (index % 3) * 0.1} />
            ))}
            <rect x="718" y="766" width="48" height="28" rx="3" fill="#203244" opacity="0.26" />
            <rect x="776" y="766" width="28" height="26" rx="3" fill="#203244" opacity="0.2" />
            <line x1="746" y1="736" x2="746" y2="798" stroke="rgba(210,233,251,0.22)" />
          </g>

          <g opacity={0.2 + foundation * 0.56}>
            {Array.from({ length: 7 }).map((_, index) => (
              <line
                key={`lobby-mullion-${index}`}
                x1={674 + index * 24}
                y1="738"
                x2={674 + index * 24}
                y2="804"
                stroke="rgba(196,223,248,0.12)"
              />
            ))}
          </g>

          <Cuboid
            x={616}
            y={708}
            width={44}
            height={142}
            depth={96}
            reveal={foundation}
            frontFill="url(#podiumStoneFront)"
            sideFill="url(#podiumStoneSide)"
            topFill="url(#podiumStoneTop)"
            opacity={0.92}
          />
          <Cuboid
            x={850}
            y={734}
            width={76}
            height={116}
            depth={84}
            reveal={foundation}
            frontFill="url(#podiumStoneFront)"
            sideFill="url(#podiumStoneSide)"
            topFill="url(#podiumStoneTop)"
            opacity={0.9}
          />
          <polygon
            points="848,744 926,744 970,724 892,724"
            fill="rgba(224,239,251,0.1)"
            stroke="rgba(186,217,244,0.14)"
            opacity={foundation}
          />

          <g opacity={0.16 + foundation * 0.36}>
            <line x1="624" y1="846" x2="890" y2="846" stroke="rgba(197,226,249,0.08)" />
            <line x1="624" y1="734" x2="892" y2="734" stroke="rgba(197,226,249,0.06)" />
            <line x1="650" y1="720" x2="650" y2="846" stroke="rgba(197,226,249,0.06)" />
            <line x1="842" y1="720" x2="842" y2="846" stroke="rgba(197,226,249,0.06)" />
            <line x1="616" y1="760" x2="890" y2="760" stroke="rgba(197,226,249,0.05)" />
          </g>

          <g opacity={0.92}>
            {[654, 690, 732, 774, 816, 852].map((x, index) => {
              const visible = smoothStep(columns, index * 0.05, 0.84);
              return (
                <line
                  key={`col-${x}`}
                  x1={x}
                  y1="688"
                  x2={x}
                  y2={688 - 576 * visible}
                  stroke="url(#steelFront)"
                  strokeWidth={index === 0 || index === 5 ? 7 : 9}
                  strokeLinecap="round"
                  opacity={0.88}
                />
              );
            })}
          </g>

          <g opacity={0.84}>
            {Array.from({ length: 15 }).map((_, level) => {
              const reveal = smoothStep(frame, Math.max(0, level * 0.06 - 0.08), Math.min(1, 0.34 + level * 0.05));
              const y = 680 - level * 38;
              return (
                <g key={`frame-${level}`} opacity={reveal}>
                  <line x1="652" y1={y} x2={652 + 194 * reveal} y2={y} stroke="#6f879e" strokeWidth="6.8" strokeLinecap="round" />
                  <line x1="846" y1={y} x2={904 - (1 - reveal) * 46} y2={y - 22 * reveal} stroke="#667e97" strokeWidth="5.2" strokeLinecap="round" />
                  <line x1="652" y1={y} x2={690 - 38 * (1 - reveal)} y2={y - 16 * reveal} stroke="rgba(114,136,159,0.54)" strokeWidth="2.2" strokeLinecap="round" />
                </g>
              );
            })}
          </g>

          {Array.from({ length: 15 }).map((_, level) => {
            const reveal = smoothStep(floors, Math.max(0, level * 0.055 - 0.12), Math.min(1, 0.42 + level * 0.045));
            return (
              <Cuboid
                key={`plate-${level}`}
                x={652}
                y={674 - level * 38}
                width={194}
                height={10}
                depth={118}
                reveal={reveal}
                frontFill="#50657b"
                sideFill="#314352"
                topFill="#89a1ba"
                opacity={0.92}
              />
            );
          })}

          {Array.from({ length: 8 }).map((_, level) => {
            const reveal = smoothStep(floors, Math.max(0, level * 0.08 - 0.1), Math.min(1, 0.48 + level * 0.06));
            const y = 654 - level * 74;
            return (
              <g key={`terrace-shell-${level}`} opacity={0.14 + reveal * 0.24}>
                <polygon points={`846,${y} 906,${y - 24} 906,${y - 12} 846,${y + 12}`} fill="rgba(215,236,252,0.1)" />
                <line x1="856" y1={y} x2="908" y2={y - 22} stroke="rgba(206,231,250,0.22)" strokeWidth="1.1" />
              </g>
            );
          })}

          <Cuboid
            x={686}
            y={138}
            width={160}
            height={548}
            depth={112}
            reveal={floors}
            frontFill="url(#towerBodyFront)"
            sideFill="url(#towerBodySide)"
            topFill="url(#towerBodyTop)"
            opacity={0.98}
          />
          <Cuboid
            x={646}
            y={256}
            width={40}
            height={430}
            depth={90}
            reveal={floors}
            frontFill="url(#towerBodyFront)"
            sideFill="url(#towerBodySide)"
            topFill="url(#towerBodyTop)"
            opacity={0.9}
          />
          <Cuboid
            x={846}
            y={346}
            width={56}
            height={340}
            depth={76}
            reveal={floors}
            frontFill="url(#towerBodyFront)"
            sideFill="url(#towerBodySide)"
            topFill="url(#towerBodyTop)"
            opacity={0.88}
          />

          <Cuboid
            x={686}
            y={138}
            width={160}
            height={548}
            depth={112}
            reveal={facade}
            frontFill="url(#towerGlassSkinFront)"
            sideFill="url(#towerGlassSkinSide)"
            topFill="url(#towerGlassSkinTop)"
            opacity={0.68}
          />
          <FacadeGrid x={686} y={138} width={160} height={548} cols={6} rows={15} reveal={facade} glow={nightLights} />
          <VerticalFins x={686} y={138} width={160} height={548} count={7} reveal={facade} />
          <SideGlass x={686} y={138} width={160} height={548} depth={112} reveal={facade} glow={nightLights} />
          <g opacity={0.18 + facade * 0.68}>
            <rect x="684" y="138" width="8" height="548" fill="#16212b" opacity="0.9" />
            <rect x="840" y="138" width="8" height="548" fill="#16212b" opacity="0.88" />
            <line x1="686" y1="138" x2="686" y2="686" stroke="rgba(214,235,252,0.22)" strokeWidth="1.1" />
            <line x1="846" y1="138" x2="846" y2="686" stroke="rgba(214,235,252,0.18)" strokeWidth="1" />
          </g>

          <Cuboid
            x={646}
            y={256}
            width={40}
            height={430}
            depth={90}
            reveal={facade}
            frontFill="url(#towerGlassSkinFront)"
            sideFill="url(#towerGlassSkinSide)"
            topFill="url(#towerGlassSkinTop)"
            opacity={0.6}
          />
          <FacadeGrid x={646} y={256} width={40} height={430} cols={2} rows={11} reveal={facade} glow={nightLights} glassFill="url(#glassFrontDeep)" />
          <g opacity={0.12 + facade * 0.42}>
            <rect x="644" y="256" width="6" height="430" fill="#17222c" opacity="0.84" />
          </g>

          <Cuboid
            x={846}
            y={346}
            width={56}
            height={340}
            depth={76}
            reveal={facade}
            frontFill="url(#towerGlassSkinFront)"
            sideFill="url(#towerGlassSkinSide)"
            topFill="url(#towerGlassSkinTop)"
            opacity={0.58}
          />
          <FacadeGrid x={846} y={346} width={56} height={340} cols={2} rows={9} reveal={facade} glow={nightLights} glassFill="url(#glassFrontDeep)" />
          <SideGlass x={846} y={346} width={56} height={340} depth={76} reveal={facade} glow={nightLights} />
          <g opacity={0.12 + facade * 0.4}>
            <rect x="844" y="346" width="6" height="340" fill="#17222c" opacity="0.82" />
          </g>

          {Array.from({ length: 7 }).map((_, level) => {
            const reveal = smoothStep(facade, Math.max(0, level * 0.08 - 0.06), Math.min(1, 0.46 + level * 0.06));
            const y = 690 - level * 64;
            return (
              <g key={`terrace-${level}`} opacity={reveal}>
                <polygon
                  points={`834,${y} 880,${y - 18} 880,${y - 8} 834,${y + 10}`}
                  fill="rgba(192,220,245,0.12)"
                  stroke="rgba(196,225,250,0.16)"
                />
                <line x1="844" y1={y - 1} x2="882" y2={y - 17} stroke="rgba(196,225,250,0.22)" strokeWidth="1" />
              </g>
            );
          })}

          <g opacity={0.18 + facade * 0.46}>
            <line x1="695" y1="148" x2="695" y2="684" stroke="#c7e3ff" strokeWidth="1.2" />
            <line x1="837" y1="148" x2="837" y2="684" stroke="#c7e3ff" strokeWidth="1.2" />
            <line x1="846" y1="346" x2="888" y2="328" stroke="#c9e3ff" strokeWidth="1" opacity="0.48" />
            <line x1="848" y1="684" x2="904" y2="658" stroke="#c9e3ff" strokeWidth="1" opacity="0.38" />
          </g>

          <g opacity={0.08 + nightLights * 0.44}>
            <rect x="676" y="720" width="86" height="188" fill="url(#lobbyGlow)" opacity="0.22" />
            <rect x="746" y="524" width="42" height="76" fill="url(#lobbyGlow)" opacity="0.12" />
          </g>

          <Cuboid x={708} y={72} width={112} height={78} depth={88} reveal={upper} frontFill="url(#crownFront)" sideFill="url(#crownSide)" topFill="url(#crownTop)" opacity={0.98} />
          <FacadeGrid x={716} y={88} width={96} height={54} cols={3} rows={2} reveal={upper} glow={nightLights} glassFill="url(#glassFrontDeep)" />
          <SideGlass x={716} y={88} width={96} height={54} depth={76} reveal={upper} glow={nightLights} />
          <polygon
            points="702,146 824,146 860,128 738,128"
            fill="rgba(220,237,251,0.12)"
            stroke="rgba(193,221,247,0.14)"
            opacity={upper}
          />

          <Cuboid
            x={734}
            y={44}
            width={64}
            height={28}
            depth={60}
            reveal={roof}
            frontFill="#d6e1ec"
            sideFill="#8095a9"
            topFill="#f2f7fc"
            opacity={1}
          />
          <line x1="766" y1="42" x2="766" y2={42 - 42 * roof} stroke="#a4d2ff" strokeWidth="3.2" strokeLinecap="round" opacity={0.94} />
          <circle cx="766" cy={0 + (1 - roof) * 2} r={6 * roof} fill="#e1f2ff" opacity={0.96} />
          <circle cx="766" cy={0 + (1 - roof) * 2} r={24 * roof} fill="#8fd1ff" opacity={0.2} filter="url(#softGlow)" />

          <g opacity={0.16 + park * 0.82}>
            <polygon points="546,896 640,858 690,890 596,932" fill="url(#parkPath)" opacity="0.88" />
            <polygon points="872,888 972,850 1058,894 960,936" fill="url(#parkPath)" opacity="0.88" />
            <ellipse cx="748" cy="958" rx="184" ry="42" fill="url(#waterPool)" opacity="0.84" />
            <ellipse cx="748" cy="958" rx="144" ry="24" fill="#0a1822" opacity="0.72" />
            <ellipse cx="748" cy="958" rx="184" ry="42" fill="none" stroke="rgba(168, 204, 236, 0.2)" />
            <ellipse cx="748" cy="958" rx="116" ry="15" fill="none" stroke="rgba(168, 204, 236, 0.14)" />

            <Tree x={594} y={852} scale={1.02} reveal={park} />
            <Tree x={546} y={884} scale={0.86} reveal={park} tint="url(#treeLeafLight)" />
            <Tree x={960} y={848} scale={1.02} reveal={park} />
            <Tree x={1012} y={884} scale={0.84} reveal={park} tint="url(#treeLeafLight)" />
            <Tree x={648} y={926} scale={0.7} reveal={nightLights} />
            <Tree x={888} y={926} scale={0.7} reveal={nightLights} />
            <Tree x={700} y={888} scale={0.78} reveal={park} tint="url(#treeLeafLight)" />
            <Tree x={836} y={888} scale={0.78} reveal={park} tint="url(#treeLeafLight)" />

            <Lamp x={618} y={886} reveal={nightLights} />
            <Lamp x={920} y={880} reveal={nightLights} />
            <Lamp x={704} y={930} reveal={nightLights} />
            <Lamp x={812} y={930} reveal={nightLights} />
            <Lamp x={752} y={914} reveal={nightLights} />
          </g>
        </g>
      </svg>
    </div>
  );
}
