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
  stroke = "rgba(170, 208, 244, 0.18)",
  opacity = 1
}: CuboidProps) {
  const visible = clamp(reveal);
  if (visible <= 0.01) return null;

  const dx = depth * 0.58;
  const dy = depth * 0.3;
  const visibleHeight = height * visible;
  const topY = y + (height - visibleHeight);

  const front = `${x},${topY} ${x + width},${topY} ${x + width},${topY + visibleHeight} ${x},${topY + visibleHeight}`;
  const side = `${x + width},${topY} ${x + width + dx},${topY - dy} ${x + width + dx},${topY + visibleHeight - dy} ${x + width},${topY + visibleHeight}`;
  const top = `${x},${topY} ${x + dx},${topY - dy} ${x + width + dx},${topY - dy} ${x + width},${topY}`;

  return (
    <g opacity={opacity}>
      <polygon points={front} fill={frontFill} stroke={stroke} strokeWidth="1.1" />
      <polygon points={side} fill={sideFill} stroke={stroke} strokeWidth="1.1" />
      <polygon points={top} fill={topFill} stroke={stroke} strokeWidth="1.1" />
    </g>
  );
}

interface FacadeGridProps {
  x: number;
  y: number;
  width: number;
  height: number;
  cols: number;
  rows: number;
  reveal: number;
  glow: number;
}

function FacadeGrid({ x, y, width, height, cols, rows, reveal, glow }: FacadeGridProps) {
  const visible = clamp(reveal);
  if (visible <= 0.01) return null;

  const visibleHeight = height * visible;
  const topY = y + (height - visibleHeight);
  const gutterX = 7;
  const gutterY = 8;
  const cellWidth = (width - gutterX * (cols + 1)) / cols;
  const cellHeight = (visibleHeight - gutterY * (rows + 1)) / rows;

  return (
    <g>
      <rect
        x={x}
        y={topY}
        width={width}
        height={visibleHeight}
        fill="url(#glassFront)"
        opacity={0.88}
        stroke="rgba(173, 209, 242, 0.18)"
        strokeWidth="1"
      />
      {Array.from({ length: cols - 1 }).map((_, index) => (
        <line
          key={`mullion-v-${index}`}
          x1={x + ((index + 1) * width) / cols}
          y1={topY}
          x2={x + ((index + 1) * width) / cols}
          y2={topY + visibleHeight}
          stroke="rgba(181, 216, 248, 0.18)"
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
          stroke="rgba(181, 216, 248, 0.18)"
          strokeWidth="1"
        />
      ))}
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: cols }).map((__, col) => {
          const cellX = x + gutterX + col * (cellWidth + gutterX);
          const cellY = topY + gutterY + row * (cellHeight + gutterY);
          const rowActivation = clamp(glow * rows - (rows - row - 1), 0, 1);
          const lightSeed = ((row * 7 + col * 11) % 5) / 5;
          const light = clamp(rowActivation * 0.72 + lightSeed * 0.18, 0, 0.9);
          return (
            <rect
              key={`window-${row}-${col}`}
              x={cellX}
              y={cellY}
              width={cellWidth}
              height={Math.max(cellHeight, 0)}
              fill="#d7ecff"
              opacity={light}
              rx="1.2"
            />
          );
        })
      )}
    </g>
  );
}

interface SideFacadeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  reveal: number;
  glow: number;
}

function SideFacade({ x, y, width, height, depth, reveal, glow }: SideFacadeProps) {
  const visible = clamp(reveal);
  if (visible <= 0.01) return null;

  const dx = depth * 0.58;
  const dy = depth * 0.3;
  const visibleHeight = height * visible;
  const topY = y + (height - visibleHeight);

  return (
    <g>
      <polygon
        points={`${x + width},${topY} ${x + width + dx},${topY - dy} ${x + width + dx},${topY + visibleHeight - dy} ${x + width},${topY + visibleHeight}`}
        fill="url(#glassSide)"
        opacity={0.76}
        stroke="rgba(173, 209, 242, 0.16)"
        strokeWidth="1"
      />
      {Array.from({ length: 8 }).map((_, index) => {
        const t = (index + 1) / 9;
        const x1 = x + width + dx * t;
        const y1 = topY - dy * t;
        const x2 = x + width + dx * t;
        const y2 = topY + visibleHeight - dy * t;
        return <line key={`side-v-${index}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(185, 219, 249, 0.16)" strokeWidth="1" />;
      })}
      {Array.from({ length: 10 }).map((_, index) => {
        const level = (index + 1) / 11;
        const yLine = topY + visibleHeight * level;
        return (
          <line
            key={`side-h-${index}`}
            x1={x + width}
            y1={yLine}
            x2={x + width + dx}
            y2={yLine - dy}
            stroke="rgba(185, 219, 249, 0.14)"
            strokeWidth="1"
          />
        );
      })}
      <polygon
        points={`${x + width},${topY + visibleHeight * 0.22} ${x + width + dx},${topY + visibleHeight * 0.22 - dy} ${x + width + dx},${topY + visibleHeight * 0.76 - dy} ${x + width},${topY + visibleHeight * 0.76}`}
        fill="#dbf0ff"
        opacity={0.06 + glow * 0.18}
      />
    </g>
  );
}

export default function ArchitecturalIllustration({ progress }: ArchitecturalIllustrationProps) {
  const p = clamp(progress);
  const site = smoothStep(p, 0, 0.12);
  const foundation = smoothStep(p, 0.08, 0.2);
  const columns = smoothStep(p, 0.17, 0.34);
  const beams = smoothStep(p, 0.28, 0.48);
  const floors = smoothStep(p, 0.4, 0.64);
  const facade = smoothStep(p, 0.56, 0.82);
  const upper = smoothStep(p, 0.74, 0.91);
  const roof = smoothStep(p, 0.87, 1);

  const orbit = Math.sin(p * Math.PI * 1.15) * 26;
  const lift = -p * 72;
  const scale = 0.95 + p * 0.06;
  const groundGlow = 0.22 + facade * 0.25 + roof * 0.15;
  const atmosphereShiftY = -p * 32;
  const groundShiftY = p * 118;
  const gridScale = 1 + p * 0.06;
  const blueprintShiftY = -p * 48;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#05070d]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(110,156,205,0.24),transparent_38%),radial-gradient(circle_at_50%_88%,rgba(95,132,175,0.16),transparent_28%),linear-gradient(180deg,#03050b_0%,#05070d_42%,#08111b_100%)]" />

      <svg viewBox="0 0 1400 1100" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#122030" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#060b12" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="concreteFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#404b57" />
            <stop offset="100%" stopColor="#222a32" />
          </linearGradient>
          <linearGradient id="concreteTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#566474" />
            <stop offset="100%" stopColor="#313b47" />
          </linearGradient>
          <linearGradient id="metalFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8f9db0" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#536476" stopOpacity="0.88" />
          </linearGradient>
          <linearGradient id="metalSide" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#708093" />
            <stop offset="100%" stopColor="#334251" />
          </linearGradient>
          <linearGradient id="glassFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#90bee7" stopOpacity="0.42" />
            <stop offset="45%" stopColor="#5f88b2" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#18314a" stopOpacity="0.56" />
          </linearGradient>
          <linearGradient id="glassSide" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7eaed9" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#10253b" stopOpacity="0.6" />
          </linearGradient>
          <radialGradient id="skyBloom" cx="50%" cy="38%" r="48%">
            <stop offset="0%" stopColor="#8fcbff" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#8fcbff" stopOpacity="0" />
          </radialGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="18" />
          </filter>
          <filter id="shadowBlur">
            <feGaussianBlur stdDeviation="20" />
          </filter>
        </defs>

        <g transform={`translate(0 ${atmosphereShiftY})`}>
          <g opacity={0.42}>
            {Array.from({ length: 34 }).map((_, index) => {
              const cx = 120 + ((index * 97) % 1160);
              const cy = 120 + ((index * 151) % 540);
              const radius = 1.2 + (index % 3) * 0.8;
              return <circle key={`dust-${index}`} cx={cx} cy={cy} r={radius} fill="#bad9f4" opacity={0.18 + (index % 5) * 0.05} />;
            })}
          </g>

          <ellipse cx="700" cy="310" rx="360" ry="220" fill="url(#skyBloom)" filter="url(#softGlow)" opacity={0.7 + roof * 0.2} />
        </g>

        <g transform={`translate(0 ${groundShiftY}) scale(${gridScale})`}>
          <g opacity={0.5}>
            <polygon points="110,850 690,620 1290,850 690,1070" fill="url(#groundGradient)" />
            {Array.from({ length: 20 }).map((_, index) => {
              const startX = 110 + index * 58;
              const endX = 690 + index * 30;
              return <line key={`grid-a-${index}`} x1={startX} y1="850" x2={endX} y2="620" stroke="rgba(108,148,191,0.16)" strokeWidth="1" />;
            })}
            {Array.from({ length: 20 }).map((_, index) => {
              const startX = 1290 - index * 58;
              const endX = 690 - index * 30;
              return <line key={`grid-b-${index}`} x1={startX} y1="850" x2={endX} y2="620" stroke="rgba(108,148,191,0.16)" strokeWidth="1" />;
            })}
            {Array.from({ length: 12 }).map((_, index) => {
              const t = index / 11;
              const leftX = 110 + (690 - 110) * t;
              const leftY = 850 + (620 - 850) * t;
              const rightX = 1290 + (690 - 1290) * t;
              const rightY = 850 + (620 - 850) * t;
              return <line key={`grid-c-${index}`} x1={leftX} y1={leftY} x2={rightX} y2={rightY} stroke="rgba(108,148,191,0.16)" strokeWidth="1" />;
            })}
          </g>
        </g>

        <g opacity={0.75 * site} transform={`translate(0 ${blueprintShiftY})`}>
          <polygon points="470,760 730,660 910,760 645,872" fill="none" stroke="rgba(148,188,226,0.4)" strokeWidth="1.2" />
          <polygon points="520,735 720,657 855,732 650,818" fill="none" stroke="rgba(148,188,226,0.28)" strokeWidth="1" />
          {Array.from({ length: 7 }).map((_, index) => (
            <line
              key={`survey-v-${index}`}
              x1={490 + index * 58}
              y1={752 - index * 12}
              x2={650 + index * 30}
              y2={680 - index * 12}
              stroke="rgba(148,188,226,0.22)"
              strokeWidth="1"
            />
          ))}
          {Array.from({ length: 6 }).map((_, index) => (
            <line
              key={`survey-h-${index}`}
              x1={500 + index * 16}
              y1={780 - index * 26}
              x2={850 + index * 2}
              y2={780 - index * 26}
              stroke="rgba(148,188,226,0.18)"
              strokeWidth="1"
            />
          ))}
        </g>

        <g transform={`translate(${orbit} ${lift}) scale(${scale})`}>
          <ellipse cx="704" cy="812" rx="226" ry="64" fill="#8dc6ff" opacity={groundGlow} filter="url(#softGlow)" />
          <ellipse cx="704" cy="824" rx="184" ry="34" fill="#05070d" opacity="0.82" filter="url(#shadowBlur)" />

          <g opacity={0.24 + site * 0.2}>
            <polygon points="560,226 758,226 815,196 617,196" fill="none" stroke="rgba(156,194,230,0.22)" strokeWidth="1.2" />
            <polygon points="560,226 560,704 758,704 758,226" fill="none" stroke="rgba(156,194,230,0.22)" strokeWidth="1.2" />
            <polygon points="758,226 815,196 815,674 758,704" fill="none" stroke="rgba(156,194,230,0.18)" strokeWidth="1.2" />
            <line x1="620" y1="196" x2="620" y2="704" stroke="rgba(156,194,230,0.14)" />
            <line x1="684" y1="196" x2="684" y2="704" stroke="rgba(156,194,230,0.14)" />
            <line x1="560" y1="300" x2="758" y2="300" stroke="rgba(156,194,230,0.12)" />
            <line x1="560" y1="372" x2="758" y2="372" stroke="rgba(156,194,230,0.12)" />
            <line x1="560" y1="444" x2="758" y2="444" stroke="rgba(156,194,230,0.12)" />
            <line x1="560" y1="516" x2="758" y2="516" stroke="rgba(156,194,230,0.12)" />
            <line x1="560" y1="588" x2="758" y2="588" stroke="rgba(156,194,230,0.12)" />
          </g>

          <Cuboid
            x={518}
            y={746}
            width={248}
            height={58}
            depth={118}
            reveal={foundation}
            frontFill="url(#concreteFront)"
            sideFill="#222c37"
            topFill="url(#concreteTop)"
            opacity={0.98}
          />
          <Cuboid
            x={556}
            y={700}
            width={184}
            height={58}
            depth={96}
            reveal={foundation}
            frontFill="#36414d"
            sideFill="#24303d"
            topFill="#556371"
            opacity={0.96}
          />

          <g opacity={0.95}>
            {[572, 612, 652, 692, 732].map((x, index) => {
              const visible = smoothStep(columns, index * 0.08, 0.78 + index * 0.03);
              return (
                <line
                  key={`col-main-${x}`}
                  x1={x}
                  y1={700}
                  x2={x}
                  y2={700 - 410 * visible}
                  stroke="url(#metalFront)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  opacity={0.92}
                />
              );
            })}
            {[778, 808, 838].map((x, index) => {
              const visible = smoothStep(columns, 0.15 + index * 0.08, 0.88);
              return (
                <line
                  key={`col-side-${x}`}
                  x1={x}
                  y1={688 - index * 6}
                  x2={x}
                  y2={688 - 332 * visible - index * 6}
                  stroke="#798ca1"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  opacity={0.82}
                />
              );
            })}
            {[542, 572, 602].map((x, index) => {
              const visible = smoothStep(columns, 0.08 + index * 0.06, 0.82);
              return (
                <line
                  key={`col-left-${x}`}
                  x1={x}
                  y1={700}
                  x2={x}
                  y2={700 - 310 * visible}
                  stroke="#8295aa"
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity={0.78}
                />
              );
            })}
          </g>

          <g opacity={0.9}>
            {Array.from({ length: 8 }).map((_, level) => {
              const reveal = smoothStep(beams, Math.max(0, level * 0.08 - 0.08), Math.min(1, 0.36 + level * 0.08));
              const y = 688 - level * 47;
              return (
                <g key={`beam-${level}`} opacity={reveal}>
                  <line x1={560} y1={y} x2={560 + 184 * reveal} y2={y} stroke="#7a8ea4" strokeWidth="5" strokeLinecap="round" />
                  <line x1={744} y1={y} x2={744 + 56 * reveal} y2={y - 18 * reveal} stroke="#688097" strokeWidth="4" strokeLinecap="round" />
                </g>
              );
            })}
          </g>

          {Array.from({ length: 8 }).map((_, level) => {
            const reveal = smoothStep(floors, Math.max(0, level * 0.08 - 0.14), Math.min(1, 0.46 + level * 0.08));
            return (
              <Cuboid
                key={`plate-${level}`}
                x={558 + level * 2}
                y={680 - level * 47}
                width={188 - level * 4}
                height={10}
                depth={92 - level * 4}
                reveal={reveal}
                frontFill="#4d6072"
                sideFill="#334352"
                topFill="#7b92ab"
                opacity={0.9}
              />
            );
          })}

          <Cuboid
            x={560}
            y={266}
            width={194}
            height={434}
            depth={98}
            reveal={facade}
            frontFill="rgba(82, 119, 155, 0.2)"
            sideFill="rgba(39, 66, 95, 0.3)"
            topFill="rgba(116, 162, 206, 0.22)"
            opacity={0.82}
          />
          <FacadeGrid x={560} y={266} width={194} height={434} cols={6} rows={11} reveal={facade} glow={smoothStep(p, 0.8, 1)} />
          <SideFacade x={560} y={266} width={194} height={434} depth={98} reveal={facade} glow={smoothStep(p, 0.82, 1)} />

          <Cuboid
            x={516}
            y={390}
            width={52}
            height={310}
            depth={70}
            reveal={facade}
            frontFill="rgba(74, 107, 140, 0.18)"
            sideFill="rgba(33, 56, 79, 0.3)"
            topFill="rgba(116, 162, 206, 0.18)"
            opacity={0.76}
          />
          <FacadeGrid x={516} y={390} width={52} height={310} cols={2} rows={7} reveal={facade} glow={smoothStep(p, 0.84, 1)} />

          <Cuboid
            x={756}
            y={442}
            width={54}
            height={258}
            depth={54}
            reveal={facade}
            frontFill="rgba(74, 107, 140, 0.16)"
            sideFill="rgba(33, 56, 79, 0.28)"
            topFill="rgba(116, 162, 206, 0.18)"
            opacity={0.7}
          />
          <FacadeGrid x={756} y={442} width={54} height={258} cols={2} rows={6} reveal={facade} glow={smoothStep(p, 0.84, 1)} />

          <Cuboid
            x={604}
            y={204}
            width={124}
            height={70}
            depth={84}
            reveal={upper}
            frontFill="#415261"
            sideFill="#2d3c49"
            topFill="#7188a1"
            opacity={0.96}
          />
          <Cuboid
            x={618}
            y={142}
            width={94}
            height={56}
            depth={68}
            reveal={upper}
            frontFill="rgba(92, 129, 166, 0.2)"
            sideFill="rgba(39, 66, 95, 0.28)"
            topFill="rgba(123, 171, 216, 0.2)"
            opacity={0.84}
          />
          <FacadeGrid x={618} y={142} width={94} height={56} cols={3} rows={2} reveal={upper} glow={smoothStep(p, 0.9, 1)} />
          <SideFacade x={618} y={142} width={94} height={56} depth={68} reveal={upper} glow={smoothStep(p, 0.9, 1)} />

          <Cuboid
            x={632}
            y={112}
            width={68}
            height={14}
            depth={54}
            reveal={roof}
            frontFill="#d2dfed"
            sideFill="#7d93a8"
            topFill="#f2f7fc"
            opacity={1}
          />
          <line x1="666" y1="110" x2="666" y2={110 - 28 * roof} stroke="#9ecfff" strokeWidth="3" strokeLinecap="round" opacity={0.9} />
          <circle cx="666" cy={80 - roof * 2} r={5.5 * roof} fill="#d7efff" opacity={0.96} />
          <circle cx="666" cy={80 - roof * 2} r={18 * roof} fill="#8fd1ff" opacity={0.22} filter="url(#softGlow)" />

          <g opacity={0.16 + facade * 0.3 + roof * 0.18}>
            <line x1="558" y1="264" x2="754" y2="264" stroke="#bfe0ff" strokeWidth="1.2" />
            <line x1="560" y1="700" x2="754" y2="700" stroke="#bfe0ff" strokeWidth="1" />
            <line x1="754" y1="264" x2="812" y2="234" stroke="#bfe0ff" strokeWidth="1" />
            <line x1="754" y1="700" x2="812" y2="670" stroke="#bfe0ff" strokeWidth="1" />
            <line x1="812" y1="234" x2="812" y2="670" stroke="#bfe0ff" strokeWidth="1" />
          </g>
        </g>
      </svg>
    </div>
  );
}
