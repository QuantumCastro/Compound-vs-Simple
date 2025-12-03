export function CyberBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050510]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(30,58,138,0.18)_0%,_rgba(5,5,16,1)_100%)]" />
      <CubePattern />
      <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-b from-transparent via-[#050510]/60 to-[#050510]" />
      <div
        className="absolute top-1/4 -left-24 h-[520px] w-[520px] rounded-full bg-red-600/10 blur-[120px] mix-blend-screen"
        style={{ animation: "pulse 6s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-1/4 -right-24 h-[520px] w-[520px] rounded-full bg-blue-600/10 blur-[120px] mix-blend-screen"
        style={{ animation: "pulse 7s ease-in-out infinite 1s" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0)_50%,rgba(0,0,0,0.28)_50%)] bg-[length:4px_100%] opacity-20" />
    </div>
  );
}

function CubePattern() {
  const cubeColors = {
    royalBlue: ["#3b82f6", "#1d4ed8", "#1e3a8a"],
    crimsonRed: ["#f87171", "#dc2626", "#991b1b"],
  } as const;

  const Cube = ({ x, y, colors }: { x: number; y: number; colors: readonly string[] }) => (
    <g transform={`translate(${x}, ${y})`}>
      <path d="M0,10 L20,0 L40,10 L20,20 Z" fill={colors[0]} stroke="none" />
      <path d="M0,10 L20,20 L20,44 L0,34 Z" fill={colors[2]} stroke="none" />
      <path d="M20,20 L40,10 L40,34 L20,44 Z" fill={colors[1]} stroke="none" />
    </g>
  );

  return (
    <svg className="absolute h-full w-full opacity-25" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision">
      <defs>
        <pattern id="cube-pattern" x="0" y="0" width="80" height="68" patternUnits="userSpaceOnUse">
          <Cube x={0} y={0} colors={cubeColors.royalBlue} />
          <Cube x={40} y={0} colors={cubeColors.crimsonRed} />
          <Cube x={20} y={34} colors={cubeColors.crimsonRed} />
          <Cube x={60} y={34} colors={cubeColors.royalBlue} />
          <Cube x={20} y={-34} colors={cubeColors.crimsonRed} />
          <Cube x={60} y={-34} colors={cubeColors.royalBlue} />
          <Cube x={-20} y={34} colors={cubeColors.royalBlue} />
          <Cube x={-20} y={-34} colors={cubeColors.royalBlue} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#cube-pattern)" />
    </svg>
  );
}
