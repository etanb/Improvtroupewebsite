export function StarDoodle({ size = 40, color = "#FFD93D" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 52 52"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {/* Slightly wonky hand-drawn star path — irregular points like it was drawn fast with a mouse */}
      <path
        d="M26,2 L31,17 L47,16 L35,27 L40,44 L26,35 L12,45 L16,27 L3,17 L21,17 Z"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="2.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Small inner scribble for texture — like a quick highlight scratch */}
      <path
        d="M26,11 L28,19 L36,19 L30,24"
        fill="none"
        stroke="#1a1a1a"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.25"
      />
    </svg>
  );
}
