// app.jsx
// Top-level: a DesignCanvas presenting the t-shirt mockup and the
// standalone print artwork, with a Tweaks panel for live adjustments.

const DEFAULTS = /*EDITMODE-BEGIN*/{
  "selected": 2,
  "showHpNumbers": true,
  "showFrame": true,
  "enemyHp": 71,
  "printScale": 0.55,
  "bgColor": "#d8d3c8",
  "playerLabel": "VICTORY"
}/*EDITMODE-END*/;

function App() {
  const [t, setT] = useTweaks(DEFAULTS);

  const battle = (
    <BattleScreen
      pxSize={6}
      selected={t.selected}
      showHpNumbers={t.showHpNumbers}
      showFrame={t.showFrame}
      enemyHp={t.enemyHp}
      playerName={t.playerLabel}
    />
  );

  // For the standalone print artboard we render at a larger pixel size
  // so the artwork fills the card nicely. Same component, different
  // --px scale.
  const battleLarge = (
    <BattleScreen
      pxSize={8}
      selected={t.selected}
      showHpNumbers={t.showHpNumbers}
      showFrame={t.showFrame}
      enemyHp={t.enemyHp}
      playerName={t.playerLabel}
    />
  );

  return (
    <>
      <DesignCanvas>
        <DCSection id="shirt" title="Victory vs. Charizard — Tee" subtitle="White shirt, single-color black print">
          <DCArtboard id="front" label="Front · Mockup" width={680} height={820}>
            <Tshirt bg={t.bgColor} printScale={t.printScale} printY={0.27}>
              {battle}
            </Tshirt>
          </DCArtboard>
          <DCArtboard id="front-clean" label="Front · No background" width={680} height={820}>
            <Tshirt bg="#ffffff" printScale={t.printScale} printY={0.27}>
              {battle}
            </Tshirt>
          </DCArtboard>
        </DCSection>

        <DCSection id="print" title="Print artwork" subtitle="Black on white, screen-print ready">
          <DCArtboard id="print-full" label="Full battle screen" width={820} height={900}>
            <div
              style={{
                width: '100%',
                height: '100%',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 40,
                boxSizing: 'border-box',
              }}
            >
              {battleLarge}
            </div>
          </DCArtboard>
          <DCArtboard id="print-stickers" label="Sprite details" width={680} height={900}>
            <SpriteDetail />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Print">
          <TweakSlider label="Print size on shirt" value={t.printScale} min={0.35} max={0.85} step={0.05}
            onChange={(v) => setT('printScale', v)} />
          <TweakToggle label="Outer frame around battle" value={t.showFrame}
            onChange={(v) => setT('showFrame', v)} />
          <TweakToggle label="Show HP numbers (Victory)" value={t.showHpNumbers}
            onChange={(v) => setT('showHpNumbers', v)} />
          <TweakSlider label="Charizard HP" value={t.enemyHp} min={0} max={142} step={1}
            onChange={(v) => setT('enemyHp', v)} />
        </TweakSection>
        <TweakSection label="Menu">
          <TweakSelect label="Highlighted attack" value={t.selected}
            options={[
              { label: 'BODY SLAM', value: 0 },
              { label: 'CLOTHESLINE', value: 1 },
              { label: 'TAUNT', value: 2 },
              { label: 'SCARY FACE', value: 3 },
            ]}
            onChange={(v) => setT('selected', Number(v))} />
          <TweakText label="Player name" value={t.playerLabel}
            onChange={(v) => setT('playerLabel', String(v).toUpperCase().slice(0, 10))} />
        </TweakSection>
        <TweakSection label="Mockup">
          <TweakColor label="Background" value={t.bgColor}
            options={['#d8d3c8', '#1a1a1a', '#c8b89a', '#e6e0d2', '#9aa39a']}
            onChange={(v) => setT('bgColor', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

// Bonus artboard: shows the two sprites alone at a big scale, for the
// user to see them clearly / use as a sticker / pocket print.
function SpriteDetail() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        padding: 40,
        boxSizing: 'border-box',
        fontFamily: '"Press Start 2P", monospace',
        color: '#000',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, '--px': '11px' }}>
        <PixelSprite grid={DRAGON_SPRITE} scale={0.5} />
        <div style={{ fontSize: 16, letterSpacing: 1 }}>CHARIZARD · :L99</div>
      </div>
      <div style={{ width: '60%', borderTop: '3px dashed #000' }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, '--px': '11px' }}>
        <PixelSprite grid={VICTORY_SPRITE} scale={0.5} />
        <div style={{ fontSize: 16, letterSpacing: 1 }}>VICTORY · :L99</div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
