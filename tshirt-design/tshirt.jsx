// tshirt.jsx
// T-shirt mockup — front view of a white tee on a neutral background,
// with the print component placed on the chest at a realistic size.
// Uses SVG for the shirt silhouette so it scales crisply; the print
// is a regular React child layered on top via absolute positioning.

function Tshirt({ children, bg = '#d8d3c8', printScale = 1, printY = 0.30 }) {
  // Print is positioned by left:50% + translateX(-50%) on the chest at
  // ~30% down from the top of the shirt body, which roughly matches a
  // real screen-printed front-graphic placement (a couple inches below
  // the collar). printScale lets tweaks resize it.
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* T-shirt silhouette */}
      <svg
        viewBox="0 0 600 700"
        width="92%"
        height="92%"
        style={{ position: 'absolute', filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.18))' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* very subtle fabric noise via dots pattern */}
          <pattern id="fabric" width="3" height="3" patternUnits="userSpaceOnUse">
            <rect width="3" height="3" fill="#ffffff" />
            <circle cx="0.5" cy="0.5" r="0.18" fill="#e8e4dd" />
            <circle cx="2" cy="2" r="0.14" fill="#eeeae3" />
          </pattern>
        </defs>

        {/* Body — shoulders, sleeves, and torso traced as one closed path.
            Drawn slightly asymmetric to feel hand-laid rather than CAD. */}
        <path
          d="
            M 240 80
            C 250 70, 350 70, 360 80
            C 360 95, 365 105, 375 112
            L 460 90
            C 500 110, 540 150, 565 200
            L 510 270
            L 480 250
            L 480 620
            C 480 632, 472 640, 460 640
            L 140 640
            C 128 640, 120 632, 120 620
            L 120 250
            L 90 270
            L 35 200
            C 60 150, 100 110, 140 90
            L 225 112
            C 235 105, 240 95, 240 80 Z
          "
          fill="url(#fabric)"
          stroke="#c9c3b5"
          strokeWidth="2"
        />

        {/* Collar — ribbed neckband */}
        <path
          d="
            M 240 80
            C 250 70, 350 70, 360 80
            C 358 100, 345 118, 300 122
            C 255 118, 242 100, 240 80 Z
          "
          fill="none"
          stroke="#bcb6a7"
          strokeWidth="3"
        />
        <path
          d="
            M 248 88
            C 258 80, 342 80, 352 88
          "
          fill="none"
          stroke="#bcb6a7"
          strokeWidth="1.5"
          opacity="0.7"
        />

        {/* Sleeve hems */}
        <path d="M 80 220 L 105 255" stroke="#c9c3b5" strokeWidth="2" fill="none" />
        <path d="M 520 220 L 495 255" stroke="#c9c3b5" strokeWidth="2" fill="none" />

        {/* Bottom hem */}
        <line x1="120" y1="625" x2="480" y2="625" stroke="#c9c3b5" strokeWidth="1.5" opacity="0.7" />

        {/* Side seam shading hints (very subtle, suggest a body) */}
        <path
          d="M 140 270 Q 130 440 145 620"
          fill="none"
          stroke="#e6e2d9"
          strokeWidth="14"
          opacity="0.6"
        />
        <path
          d="M 460 270 Q 470 440 455 620"
          fill="none"
          stroke="#e6e2d9"
          strokeWidth="14"
          opacity="0.6"
        />
      </svg>

      {/* Print — placed on the chest. Sized relative to the shirt body
          width. We use a wrapper div so the BattleScreen's intrinsic
          width is honoured; printScale just shrinks/grows. */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: `${printY * 100}%`,
          transform: `translateX(-50%) scale(${printScale})`,
          transformOrigin: 'top center',
        }}
      >
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { Tshirt });
