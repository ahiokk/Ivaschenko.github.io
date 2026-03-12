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
      <rect x={x} y={topY} width={width} height={visibleHeight} fill="url(#glassFront)" opacity={0.84} stroke="rgba(181, 216, 248, 0.16)" />
      {Array.from({ length: cols - 1 }).map((_, index) => (
        <line
          key={`mullion-v-${index}`}
          x1={x + ((index + 1) * width) / cols}
          y1={topY}
          x2={x + ((index + 1) * width) / cols}
          y2={topY + visibleHeight}
          stroke="rgba(196, 225, 250, 0.14)"
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
          stroke="rgba(196, 225, 250, 0.12)"
          strokeWidth="1"
        />
      ))}
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: cols }).map((__, col) => {
          const rowActivation = clamp(glow * rows - (rows - row - 1), 0, 1);
          const lightSeed = ((row * 5 + col * 3) % 7) / 7;
          const light = clamp(rowActivation * 0.72 + lightSeed * 0.14, 0, 0.88);
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
      <polygon
        points={`${x + width},${topY + visibleHeight * 0.18} ${x + width + dx},${topY + visibleHeight * 0.18 - dy} ${x + width + dx},${topY + visibleHeight * 0.78 - dy} ${x + width},${topY + visibleHeight * 0.78}`}
        fill="#ddf0ff"
        opacity={0.04 + glow * 0.18}
      />
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

  const park = smoothStep(p, 0.56, 0.82);
  const city = smoothStep(p, 0.26, 0.72);
  const nightLights = smoothStep(p, 0.72, 1);

  const anchorX = 736;
  const anchorY = 898;
  const cameraScale = 1.14 - p * 0.12;
  const orbitX = Math.sin(p * Math.PI * 0.88) * 14;
  const framingLift = -p * 10;
  const atmosphereShiftY = -p * 12;
  const skylineShiftY = p * 8;
  const gridShiftY = p * 10;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#05070d]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_44%_24%,rgba(120,168,214,0.3),transparent_34%),radial-gradient(circle_at_50%_82%,rgba(102,150,197,0.14),transparent_22%),linear-gradient(180deg,#04070d_0%,#07111c_52%,#09131f_100%)]" />

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
            <stop offset="0%" stopColor="#4f5c69" />
            <stop offset="100%" stopColor="#2a333d" />
          </linearGradient>
          <linearGradient id="concreteTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#627183" />
            <stop offset="100%" stopColor="#3c4857" />
          </linearGradient>
          <linearGradient id="steelFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a3b2c2" />
            <stop offset="100%" stopColor="#647387" />
          </linearGradient>
          <linearGradient id="glassFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a9d7ff" stopOpacity="0.44" />
            <stop offset="55%" stopColor="#537fa8" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#18344e" stopOpacity="0.58" />
          </linearGradient>
          <linearGradient id="glassSide" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8bc1f4" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#122b43" stopOpacity="0.58" />
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
            <stop offset="0%" stopColor="#a4d2ff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#a4d2ff" stopOpacity="0" />
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
        </defs>

        <g transform={`translate(0 ${atmosphereShiftY})`}>
          <ellipse cx="746" cy="292" rx="360" ry="220" fill="url(#towerBloom)" filter="url(#softGlow)" opacity="0.84" />
          <g opacity={0.44}>
            {Array.from({ length: 34 }).map((_, index) => {
              const cx = 180 + ((index * 93) % 1100);
              const cy = 108 + ((index * 149) % 520);
              return <circle key={`dust-${index}`} cx={cx} cy={cy} r={1.2 + (index % 3) * 0.8} fill="#bad9f4" opacity={0.16 + (index % 5) * 0.05} />;
            })}
          </g>
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
          </g>
        </g>

        <g transform={`translate(${orbitX} ${framingLift}) translate(${anchorX} ${anchorY}) scale(${cameraScale}) translate(${-anchorX} ${-anchorY})`}>
          <ellipse cx={anchorX} cy={anchorY + 10} rx="228" ry="54" fill="#8dc6ff" opacity={0.18 + facade * 0.18 + nightLights * 0.08} filter="url(#softGlow)" />
          <ellipse cx={anchorX} cy={anchorY + 18} rx="178" ry="26" fill="#05070d" opacity="0.82" filter="url(#shadowBlur)" />

          <g opacity={0.22 + site * 0.18}>
            <polygon points="684,122 834,122 876,100 726,100" fill="none" stroke="rgba(156,194,230,0.16)" />
            <polygon points="684,122 684,788 834,788 834,122" fill="none" stroke="rgba(156,194,230,0.16)" />
            <polygon points="834,122 876,100 876,766 834,788" fill="none" stroke="rgba(156,194,230,0.12)" />
            {Array.from({ length: 13 }).map((_, index) => {
              const y = 164 + index * 48;
              return <line key={`outline-${index}`} x1="684" y1={y} x2="834" y2={y} stroke="rgba(156,194,230,0.1)" />;
            })}
          </g>

          <Cuboid
            x={560}
            y={834}
            width={360}
            height={48}
            depth={186}
            reveal={foundation}
            frontFill="url(#concreteFront)"
            sideFill="#26323d"
            topFill="url(#concreteTop)"
            opacity={0.98}
          />
          <Cuboid
            x={612}
            y={770}
            width={254}
            height={74}
            depth={146}
            reveal={foundation}
            frontFill="#394653"
            sideFill="#25313f"
            topFill="#627387"
            opacity={0.96}
          />
          <Cuboid
            x={646}
            y={718}
            width={186}
            height={56}
            depth={124}
            reveal={foundation}
            frontFill="#41505d"
            sideFill="#2a3845"
            topFill="#73869a"
            opacity={0.92}
          />
          <Cuboid
            x={664}
            y={700}
            width={150}
            height={16}
            depth={118}
            reveal={foundation}
            frontFill="rgba(170, 208, 244, 0.16)"
            sideFill="rgba(64, 95, 126, 0.22)"
            topFill="rgba(204, 229, 251, 0.2)"
            opacity={0.9}
          />

          <g opacity={0.08 + nightLights * 0.42}>
            <rect x="678" y="732" width="118" height="34" fill="#d9eeff" opacity="0.24" />
            {Array.from({ length: 5 }).map((_, index) => (
              <rect key={`lobby-window-${index}`} x={686 + index * 22} y="738" width="14" height="22" rx="1.5" fill="#d9eeff" opacity="0.56" />
            ))}
          </g>

          <g opacity={0.92}>
            {[650, 684, 724, 764, 804, 836].map((x, index) => {
              const visible = smoothStep(columns, index * 0.05, 0.84);
              return (
                <line
                  key={`col-${x}`}
                  x1={x}
                  y1="718"
                  x2={x}
                  y2={718 - 538 * visible}
                  stroke="url(#steelFront)"
                  strokeWidth={index === 0 || index === 5 ? 5 : 6}
                  strokeLinecap="round"
                  opacity={0.88}
                />
              );
            })}
          </g>

          <g opacity={0.84}>
            {Array.from({ length: 13 }).map((_, level) => {
              const reveal = smoothStep(frame, Math.max(0, level * 0.07 - 0.08), Math.min(1, 0.34 + level * 0.06));
              const y = 710 - level * 40;
              return (
                <g key={`frame-${level}`} opacity={reveal}>
                  <line x1="646" y1={y} x2={646 + 186 * reveal} y2={y} stroke="#7d93a9" strokeWidth="4.5" strokeLinecap="round" />
                  <line x1="832" y1={y} x2={878 - (1 - reveal) * 42} y2={y - 21 * reveal} stroke="#6f879e" strokeWidth="3.5" strokeLinecap="round" />
                </g>
              );
            })}
          </g>

          {Array.from({ length: 13 }).map((_, level) => {
            const reveal = smoothStep(floors, Math.max(0, level * 0.06 - 0.1), Math.min(1, 0.42 + level * 0.05));
            return (
              <Cuboid
                key={`plate-${level}`}
                x={646}
                y={704 - level * 40}
                width={188}
                height={9}
                depth={104}
                reveal={reveal}
                frontFill="#4d6277"
                sideFill="#314352"
                topFill="#7f98b2"
                opacity={0.9}
              />
            );
          })}

          <Cuboid
            x={684}
            y={182}
            width={150}
            height={536}
            depth={98}
            reveal={floors}
            frontFill="rgba(79, 95, 114, 0.14)"
            sideFill="rgba(34, 49, 63, 0.24)"
            topFill="rgba(121, 147, 172, 0.16)"
            opacity={0.74}
          />
          <Cuboid
            x={646}
            y={326}
            width={40}
            height={392}
            depth={78}
            reveal={floors}
            frontFill="rgba(79, 95, 114, 0.12)"
            sideFill="rgba(34, 49, 63, 0.2)"
            topFill="rgba(121, 147, 172, 0.14)"
            opacity={0.68}
          />
          <Cuboid
            x={834}
            y={428}
            width={46}
            height={290}
            depth={54}
            reveal={floors}
            frontFill="rgba(79, 95, 114, 0.12)"
            sideFill="rgba(34, 49, 63, 0.2)"
            topFill="rgba(121, 147, 172, 0.14)"
            opacity={0.64}
          />

          <Cuboid
            x={684}
            y={182}
            width={150}
            height={536}
            depth={98}
            reveal={facade}
            frontFill="rgba(84, 120, 156, 0.16)"
            sideFill="rgba(24, 44, 67, 0.26)"
            topFill="rgba(132, 176, 220, 0.18)"
            opacity={0.84}
          />
          <FacadeGrid x={684} y={182} width={150} height={536} cols={5} rows={14} reveal={facade} glow={nightLights} />
          <SideGlass x={684} y={182} width={150} height={536} depth={98} reveal={facade} glow={nightLights} />

          <Cuboid
            x={646}
            y={326}
            width={40}
            height={392}
            depth={78}
            reveal={facade}
            frontFill="rgba(84, 120, 156, 0.15)"
            sideFill="rgba(24, 44, 67, 0.22)"
            topFill="rgba(132, 176, 220, 0.16)"
            opacity={0.76}
          />
          <FacadeGrid x={646} y={326} width={40} height={392} cols={2} rows={10} reveal={facade} glow={nightLights} />

          <Cuboid
            x={834}
            y={428}
            width={46}
            height={290}
            depth={54}
            reveal={facade}
            frontFill="rgba(84, 120, 156, 0.15)"
            sideFill="rgba(24, 44, 67, 0.22)"
            topFill="rgba(132, 176, 220, 0.16)"
            opacity={0.72}
          />
          <FacadeGrid x={834} y={428} width={46} height={290} cols={2} rows={7} reveal={facade} glow={nightLights} />

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

          <g opacity={0.18 + facade * 0.34}>
            <line x1="694" y1="190" x2="694" y2="710" stroke="#c7e3ff" strokeWidth="1" />
            <line x1="824" y1="190" x2="824" y2="710" stroke="#c7e3ff" strokeWidth="1" />
            <line x1="684" y1="182" x2="834" y2="182" stroke="#c7e3ff" strokeWidth="1" />
            <line x1="684" y1="718" x2="834" y2="718" stroke="#c7e3ff" strokeWidth="1" />
          </g>

          <Cuboid
            x={706}
            y={120}
            width={102}
            height={56}
            depth={78}
            reveal={upper}
            frontFill="#445564"
            sideFill="#2f3f4e"
            topFill="#7289a2"
            opacity={0.98}
          />
          <FacadeGrid x={714} y={132} width={86} height={44} cols={3} rows={2} reveal={upper} glow={nightLights} />
          <SideGlass x={714} y={132} width={86} height={44} depth={68} reveal={upper} glow={nightLights} />

          <Cuboid
            x={724}
            y={92}
            width={66}
            height={24}
            depth={58}
            reveal={roof}
            frontFill="#d6e1ec"
            sideFill="#8095a9"
            topFill="#f2f7fc"
            opacity={1}
          />
          <line x1="757" y1="90" x2="757" y2={90 - 40 * roof} stroke="#a4d2ff" strokeWidth="3" strokeLinecap="round" opacity={0.94} />
          <circle cx="757" cy={46 - roof * 1.5} r={6 * roof} fill="#e1f2ff" opacity={0.96} />
          <circle cx="757" cy={46 - roof * 1.5} r={22 * roof} fill="#8fd1ff" opacity={0.18} filter="url(#softGlow)" />

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
