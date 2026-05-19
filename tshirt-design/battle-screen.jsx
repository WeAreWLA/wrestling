// battle-screen.jsx
// The actual print artwork — a Game Boy-style Pokémon battle screen,
// 1-bit black on white. Everything is rendered at a uniform pixel scale
// driven by CSS var --px so the whole thing reads as one consistent
// pixel grid.

// ────────────────────────────────────────────────────────────────────
// Pixel sprites (hand-drawn grids, '#' = filled, '.' = empty)
// ────────────────────────────────────────────────────────────────────

// Charizard — side 3/4 view facing left (24w × 31h). 1-bit pixel art:
// a horned dragon head with an open roaring jaw and carved eye, a
// strutted wing, a white belly, two clawed legs, and the signature
// flame riding the tail. Stylized — not the real game sprite.
const DRAGON_SPRITE = [
  '......##....##..........',
  '......##....##..........',
  '.......##..##...........',
  '.......########.....##..',
  '......##########...####.',
  '.....###########..##.###',
  '....######.#####..##.###',
  '..##############..##.###',
  '.####.....######..##.###',
  '..####....######.##.####',
  '...#####..######.##.####',
  '.....###########.##.####',
  '.......#########.##.####',
  '........########..##.##.',
  '......###########.####..',
  '.....############..###..',
  '.....############..##...',
  '.....############...#...',
  '.....###.....####.....#.',
  '.....###.....####.....##',
  '....####.....####....###',
  '....####.....#####..#.##',
  '.....#############..###.',
  '......###########.#####.',
  '......###########.####..',
  '......####...####.###...',
  '......####...####.##....',
  '.....#####...#####......',
  '.....#####...#####......',
  '....######...######.....',
  '...##.###...##.###......',
];

// "Victory" — the player's pokémon, a Machoke-like fighter seen from
// behind (24w × 32h). Long flowing hair down the back, broad muscular
// shoulders, arms held at the sides, a championship belt with a centre
// buckle, and boots. Its moveset is all wrestling moves.
const VICTORY_SPRITE = [
  '.........######.........',
  '........########........',
  '.......##########.......',
  '.......###.##.###.......',
  '.......###.##.###.......',
  '......####.##.####......',
  '.....#####.##.#####.....',
  '....######.##.######....',
  '...#######.##.#######...',
  '...###.###.##.###.###...',
  '...###.###.##.###.###...',
  '...###.###.##.###.###...',
  '...###.###.##.###.###...',
  '...###.#.#.##.#.#.###...',
  '...####...####...####...',
  '...####.########.####...',
  '...####.########.####...',
  '....##...######...##....',
  '......############......',
  '......###.####.###......',
  '.......##########.......',
  '.......##########.......',
  '.......##########.......',
  '......############......',
  '......#####..#####......',
  '......#####..#####......',
  '.......####..####.......',
  '.......####..####.......',
  '.......####..####.......',
  '.......####..####.......',
  '......#####..#####......',
  '.....######..######.....',
];

// ────────────────────────────────────────────────────────────────────
// PixelSprite — renders a string-grid as crisp SVG rects.
// ────────────────────────────────────────────────────────────────────
function PixelSprite({ grid, scale = 1, flip = false }) {
  const rows = grid.length;
  const cols = grid[0].length;
  const rects = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] !== '.') {
        rects.push(
          <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill="currentColor" />
        );
      }
    }
  }
  return (
    <svg
      width={`calc(var(--px) * ${cols * scale})`}
      height={`calc(var(--px) * ${rows * scale})`}
      viewBox={`0 0 ${cols} ${rows}`}
      shapeRendering="crispEdges"
      style={{ display: 'block', transform: flip ? 'scaleX(-1)' : 'none' }}
    >
      {rects}
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────────
// HPBar — chunky pixel bar. Filled portion = solid black,
// empty portion = white inside black outline. Bar is built from
// fixed-width pixel cells so it always reads as pixel art.
// ────────────────────────────────────────────────────────────────────
function HPBar({ current, max, cells = 24 }) {
  const filled = Math.max(0, Math.min(cells, Math.round((current / max) * cells)));
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'calc(var(--px) * 1)',
        fontFamily: '"Press Start 2P", monospace',
        fontSize: 'calc(var(--px) * 3)',
        letterSpacing: 0,
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      <span>HP:</span>
      <div
        style={{
          display: 'flex',
          gap: 0,
          padding: 'calc(var(--px) * 0.5)',
          border: 'calc(var(--px) * 0.5) solid #000',
          background: '#fff',
        }}
      >
        {Array.from({ length: cells }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 'calc(var(--px) * 1)',
              height: 'calc(var(--px) * 2.5)',
              background: i < filled ? '#000' : '#fff',
              marginRight: i === cells - 1 ? 0 : 'calc(var(--px) * 0.25)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// InfoBox — the floating name/level/HP card for each combatant.
// Classic GB rounded-rect with chunky black border.
// ────────────────────────────────────────────────────────────────────
function InfoBox({ name, level, hp, hpMax, showNumbers = false, style }) {
  return (
    <div
      style={{
        display: 'inline-block',
        border: 'calc(var(--px) * 1) solid #000',
        borderRadius: 'calc(var(--px) * 2.5)',
        background: '#fff',
        padding: 'calc(var(--px) * 2) calc(var(--px) * 3)',
        fontFamily: '"Press Start 2P", monospace',
        color: '#000',
        boxShadow: 'calc(var(--px) * 0.5) calc(var(--px) * 0.5) 0 0 #000',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 'calc(var(--px) * 3)',
          fontSize: 'calc(var(--px) * 4)',
          letterSpacing: 'calc(var(--px) * 0.2)',
          lineHeight: 1,
          marginBottom: 'calc(var(--px) * 2.5)',
        }}
      >
        <span>{name}</span>
        <span style={{ fontSize: 'calc(var(--px) * 3)' }}>{`:L${level}`}</span>
      </div>
      <HPBar current={hp} max={hpMax} />
      {showNumbers && (
        <div
          style={{
            marginTop: 'calc(var(--px) * 2)',
            textAlign: 'right',
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 'calc(var(--px) * 3.2)',
            letterSpacing: 'calc(var(--px) * 0.1)',
          }}
        >
          {hp}/{hpMax}
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// MenuBox — bottom dialog with the 4 attacks in a 2×2 grid, plus a
// selector arrow on whichever is "highlighted".
// ────────────────────────────────────────────────────────────────────
function MenuBox({ attacks, selected = 0 }) {
  return (
    <div
      style={{
        border: 'calc(var(--px) * 1) solid #000',
        borderRadius: 'calc(var(--px) * 2.5)',
        background: '#fff',
        padding: 'calc(var(--px) * 3) calc(var(--px) * 4)',
        boxShadow: 'calc(var(--px) * 0.5) calc(var(--px) * 0.5) 0 0 #000',
        fontFamily: '"Press Start 2P", monospace',
        color: '#000',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          columnGap: 'calc(var(--px) * 4)',
          rowGap: 'calc(var(--px) * 3)',
          fontSize: 'calc(var(--px) * 4)',
          letterSpacing: 'calc(var(--px) * 0.2)',
          lineHeight: 1.1,
        }}
      >
        {attacks.map((a, i) => (
          <div
            key={a}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(var(--px) * 1.5)',
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                width: 'calc(var(--px) * 4)',
                display: 'inline-block',
                opacity: i === selected ? 1 : 0,
              }}
            >
              ▶
            </span>
            <span>{a}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// BattleScreen — the entire print, composed.
// ────────────────────────────────────────────────────────────────────
function BattleScreen({
  pxSize = 6,
  selected = 2,
  showHpNumbers = true,
  enemyName = 'CHARIZARD',
  enemyLevel = 99,
  enemyHp = 71,
  enemyHpMax = 142,
  playerName = 'VICTORY',
  playerLevel = 99,
  playerHp = 120,
  playerHpMax = 129,
  attacks = ['BODY SLAM', 'CLOTHESLINE', 'TAUNT', 'SCARY FACE'],
  showFrame = true,
}) {
  // The print is laid out on a flexible vertical stack: enemy area on
  // top (info box left, sprite right with a small ground line), player
  // area in the middle (sprite left with ground line, info box right
  // showing HP numbers), menu on the bottom.
  return (
    <div
      data-battle-screen
      style={{
        '--px': `${pxSize}px`,
        boxSizing: 'border-box',
        width: 'calc(var(--px) * 90)',
        padding: showFrame ? 'calc(var(--px) * 4)' : 0,
        background: '#fff',
        color: '#000',
        border: showFrame ? 'calc(var(--px) * 1.5) solid #000' : 'none',
        borderRadius: showFrame ? 'calc(var(--px) * 1)' : 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 'calc(var(--px) * 3)',
        fontFamily: '"Press Start 2P", monospace',
      }}
    >
      {/* Enemy row: info box (left) · sprite + ground (right) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 'calc(var(--px) * 2)',
        }}
      >
        <InfoBox
          name={enemyName}
          level={enemyLevel}
          hp={enemyHp}
          hpMax={enemyHpMax}
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <PixelSprite grid={DRAGON_SPRITE} scale={1} />
          <Ground />
        </div>
      </div>

      {/* Player row: sprite + ground (left) · info box w/ HP nums (right) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 'calc(var(--px) * 2)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <PixelSprite grid={VICTORY_SPRITE} scale={1} />
          <Ground wide />
        </div>
        <InfoBox
          name={playerName}
          level={playerLevel}
          hp={playerHp}
          hpMax={playerHpMax}
          showNumbers={showHpNumbers}
        />
      </div>

      {/* Bottom menu */}
      <MenuBox attacks={attacks} selected={selected} />
    </div>
  );
}

// The little ground tick under each sprite — a row of dashes in the
// classic battle UI. Pure decoration.
function Ground({ wide = false }) {
  const cells = wide ? 28 : 22;
  return (
    <div
      style={{
        display: 'flex',
        gap: 'calc(var(--px) * 0.4)',
        marginTop: 'calc(var(--px) * 0.5)',
        marginLeft: wide ? 0 : 'calc(var(--px) * 1)',
      }}
    >
      {Array.from({ length: cells }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 'calc(var(--px) * 1.5)',
            height: 'calc(var(--px) * 0.75)',
            background: '#000',
          }}
        />
      ))}
    </div>
  );
}

Object.assign(window, { BattleScreen, PixelSprite, DRAGON_SPRITE, VICTORY_SPRITE });
