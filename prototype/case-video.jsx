// case-video.jsx — Open Indexing case video.
// ~60s, light background, blog-driven framing.
//
// Scenes:
//   0  Intro slate           0–4s
//   1  Problem (MSCI/S&P)    4–22s
//   2  Lifecycle states     22–36s
//   3  Savings UI (unit ec.)36–54s
//   4  Outro / Open Indexing 54–60s

const { useMemo: VM } = React;

// ─── Tokens ───────────────────────────────────────────────────────
const T = {
  paper:     '#F4F1EA',
  paperDeep: '#E8E2D2',
  ink:       '#0A0A0B',
  inkMid:    '#3D3D42',
  inkDim:    '#7A7A80',
  inkFaint:  '#B8B4A8',
  rule:      'rgba(10,10,11,0.12)',
  panel:     '#101014',
  panelSub:  '#1B1B1F',
  panelLine: '#26262C',
  pos:       '#15803D',
  neg:       '#B91C1C',
  posDark:   '#4ADE80',
  serif:     '"Fraunces", "Georgia", serif',
  sans:      '"Geist", -apple-system, sans-serif',
  mono:      '"Geist Mono", ui-monospace, monospace',
};

const fmtE = (n, dec = 2) => n.toLocaleString('de-DE', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + ' €';

function fade(p, easeIn = 0.15, easeOut = 0.15) {
  if (p < easeIn) return p / easeIn;
  if (p > 1 - easeOut) return (1 - p) / easeOut;
  return 1;
}

// ─── Scene 0 · Intro slate (0–4s) ─────────────────────────────────
function SceneIntro() {
  const { progress } = useSprite();
  const opacity = fade(progress, 0.22, 0.18);
  const sub = interpolate([0, 0.5, 1], [0, 1, 1])(progress);
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity }}>
      <div style={{
        fontFamily: T.mono, fontSize: 11, color: T.inkDim, letterSpacing: 2.5, textTransform: 'uppercase',
        marginBottom: 20,
      }}>A case for</div>
      <div style={{
        fontFamily: T.serif, fontSize: 104, fontWeight: 400, color: T.ink,
        letterSpacing: -3, lineHeight: 0.95,
      }}>Open <em style={{ fontStyle: 'italic' }}>Indexing</em></div>
      <div style={{
        marginTop: 24, fontFamily: T.sans, fontSize: 18, color: T.inkMid,
        opacity: sub, letterSpacing: 0.1,
      }}>Retail direct indexing, savings-native. No advisory wrap.</div>
    </div>
  );
}

// ─── Scene 1 · The problem (4–22s) ────────────────────────────────
// Blog hook: MSCI World is 71.9% US; S&P 500 top-10 = 40.7% (vs ~19% 1990–2015).
function SceneProblem() {
  const { localTime, progress } = useSprite();
  const opacity = fade(progress, 0.06, 0.10);
  const lt = localTime;

  // Phase 1: 0-6s → MSCI World pie unraveling
  // Phase 2: 6-13s → S&P 500 concentration bar (~19% → 40.7%)
  // Phase 3: 13-18s → "This is not passive" conclusion

  const ph1 = clamp((lt - 0.0) / 0.5, 0, 1);
  const ph1Out = clamp((lt - 6.0) / 0.5, 0, 1);
  const ph2 = clamp((lt - 6.5) / 0.5, 0, 1);
  const ph2Out = clamp((lt - 13.5) / 0.5, 0, 1);
  const ph3 = clamp((lt - 14.0) / 0.6, 0, 1);

  // S&P bar animation: 19% → 40.7%
  const sp500P = clamp((lt - 7.0) / 4.5, 0, 1);
  const sp500Eased = Easing.easeOutCubic(sp500P);
  const sp500Pct = 19 + (40.7 - 19) * sp500Eased;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity }}>
      {/* ── Phase 1: MSCI World breakdown ── */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: ph1 * (1 - ph1Out),
        transform: `translateY(${(1 - ph1) * 12}px)`,
      }}>
        <div style={{ position: 'absolute', top: 80, left: 90, width: 720 }}>
          <div style={{ fontFamily: T.mono, fontSize: 12, color: T.inkDim, letterSpacing: 2, textTransform: 'uppercase' }}>The saver's problem</div>
          <div style={{
            fontFamily: T.serif, fontSize: 52, color: T.ink,
            letterSpacing: -1.4, lineHeight: 1.05, marginTop: 14, fontWeight: 400,
          }}>
            What you bought as <em style={{ fontStyle: 'italic', color: T.inkMid }}>passive</em><br/>
            isn't passive anymore.
          </div>
          <div style={{ fontFamily: T.sans, fontSize: 15, color: T.inkMid, marginTop: 18, lineHeight: 1.5, maxWidth: 560 }}>
            MSCI World, marketed as the global default, today is one country's index dressed up as the world's.
          </div>
        </div>

        {/* Country breakdown bar */}
        <div style={{
          position: 'absolute', top: 380, left: 90, right: 90,
        }}>
          <div style={{ fontFamily: T.mono, fontSize: 11, color: T.inkDim, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
            MSCI World · country weights · 30 Apr 2026
          </div>
          <CountryBar progress={ph1}/>
        </div>
      </div>

      {/* ── Phase 2: S&P concentration animation ── */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: ph2 * (1 - ph2Out),
        transform: `translateY(${(1 - ph2) * 12}px)`,
      }}>
        <div style={{ position: 'absolute', top: 80, left: 90, width: 760 }}>
          <div style={{ fontFamily: T.mono, fontSize: 12, color: T.inkDim, letterSpacing: 2, textTransform: 'uppercase' }}>And inside the US slice</div>
          <div style={{
            fontFamily: T.serif, fontSize: 52, color: T.ink,
            letterSpacing: -1.4, lineHeight: 1.05, marginTop: 14, fontWeight: 400,
          }}>
            Ten names. <em style={{ fontStyle: 'italic', color: T.inkMid }}>Forty&nbsp;percent</em> of the S&P&nbsp;500.
          </div>
          <div style={{ fontFamily: T.sans, fontSize: 15, color: T.inkMid, marginTop: 18, lineHeight: 1.5, maxWidth: 560 }}>
            Top-10 weight has more than doubled since 2015. The "diversified" benchmark became a momentum-tilted bet on a handful of names.
          </div>
        </div>

        {/* Concentration counter & comparison */}
        <div style={{ position: 'absolute', top: 410, left: 90, right: 90 }}>
          <div style={{
            display: 'flex', alignItems: 'flex-end', gap: 80, marginBottom: 14,
          }}>
            <div>
              <div style={{ fontFamily: T.mono, fontSize: 11, color: T.inkDim, letterSpacing: 1.5, textTransform: 'uppercase' }}>1990 – 2015</div>
              <div style={{ fontFamily: T.serif, fontSize: 56, color: T.inkMid, fontWeight: 400, letterSpacing: -1.4, marginTop: 6, lineHeight: 1 }}>
                ~19&nbsp;%
              </div>
              <div style={{ fontFamily: T.sans, fontSize: 12, color: T.inkDim, marginTop: 6 }}>stable for 25 years</div>
            </div>
            <div style={{ fontFamily: T.serif, fontSize: 40, color: T.inkFaint, fontWeight: 300, lineHeight: 1, paddingBottom: 8 }}>→</div>
            <div>
              <div style={{ fontFamily: T.mono, fontSize: 11, color: T.inkDim, letterSpacing: 1.5, textTransform: 'uppercase' }}>Year-end 2025</div>
              <div style={{ fontFamily: T.serif, fontSize: 88, color: T.ink, fontWeight: 500, letterSpacing: -3, marginTop: 6, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                {sp500Pct.toFixed(1).replace('.', ',')}&nbsp;%
              </div>
              <div style={{ fontFamily: T.sans, fontSize: 12, color: T.inkDim, marginTop: 6 }}>top-10 of 500</div>
            </div>
          </div>

          <ConcentrationBar progress={sp500Eased}/>

          <div style={{ fontFamily: T.mono, fontSize: 10, color: T.inkFaint, letterSpacing: 1, textTransform: 'uppercase', marginTop: 14 }}>
            Source · RBC Wealth Management / FactSet
          </div>
        </div>
      </div>

      {/* ── Phase 3: Conclusion ── */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: ph3,
        transform: `translateY(${(1 - ph3) * 16}px)`,
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      }}>
        <div style={{ fontFamily: T.mono, fontSize: 12, color: T.inkDim, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 18 }}>
          The category needs a name
        </div>
        <div style={{
          fontFamily: T.serif, fontSize: 72, color: T.ink, letterSpacing: -2,
          lineHeight: 1.02, fontWeight: 400, textAlign: 'center', maxWidth: 1100,
        }}>
          What if a saver could<br/>
          <em style={{ fontStyle: 'italic', color: T.inkMid }}>declare</em> the index?
        </div>
      </div>
    </div>
  );
}

// ─── Country breakdown bar ───────────────────────────────────────
function CountryBar({ progress }) {
  const segments = [
    { country: 'US',     pct: 71.9, color: '#3D3D42' },
    { country: 'Japan',  pct: 5.7,  color: '#7A7A80' },
    { country: 'UK',     pct: 3.7,  color: '#A8A4A0' },
    { country: 'Canada', pct: 3.5,  color: '#BFBAB2' },
    { country: 'France', pct: 2.5,  color: '#CFCAC0' },
    { country: 'Other',  pct: 12.7, color: '#E0DCD2' },
  ];
  return (
    <div>
      <div style={{
        display: 'flex', height: 28, borderRadius: 6, overflow: 'hidden',
        boxShadow: 'inset 0 0 0 1px rgba(10,10,11,0.06)',
      }}>
        {segments.map((s, i) => (
          <div key={s.country} style={{
            width: `${s.pct * progress}%`,
            background: s.color,
            transition: 'width 700ms ease',
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: i < 2 ? '#FFF' : T.ink,
            fontFamily: T.sans, fontWeight: 600, fontSize: i === 0 ? 13 : 10,
            opacity: progress,
            overflow: 'hidden',
          }}>
            {s.pct >= 3 && s.country}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, display: 'flex', gap: 22, flexWrap: 'wrap' }}>
        {segments.map(s => (
          <div key={s.country} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color }}/>
            <span style={{ fontFamily: T.sans, fontSize: 12, color: T.inkMid }}>
              <strong style={{ color: T.ink, fontWeight: 600 }}>{s.pct}%</strong> {s.country}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── S&P concentration bar — animated 19% → 40.7% ────────────────
function ConcentrationBar({ progress }) {
  const value = 19 + (40.7 - 19) * progress;
  return (
    <div style={{
      position: 'relative', height: 32, borderRadius: 6,
      background: T.paperDeep, overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: `${value}%`,
        background: T.ink,
        transition: 'width 50ms linear',
      }}/>
      {/* Reference markers */}
      <div style={{
        position: 'absolute', left: '19%', top: -4, bottom: -4,
        width: 1, background: 'rgba(10,10,11,0.4)',
      }}/>
      <div style={{
        position: 'absolute', left: '19%', top: -22, fontFamily: T.mono,
        fontSize: 9, color: T.inkDim, letterSpacing: 0.5, transform: 'translateX(-50%)',
      }}>1990</div>
      <div style={{
        position: 'absolute', left: '40.7%', top: -22, fontFamily: T.mono,
        fontSize: 9, color: T.ink, letterSpacing: 0.5, transform: 'translateX(-50%)',
        opacity: progress,
      }}>2025</div>
    </div>
  );
}

// ─── Scene 2 · Lifecycle states (22–36s) ─────────────────────────
function SceneStates() {
  const { localTime, progress } = useSprite();
  const opacity = fade(progress, 0.08, 0.10);
  const lt = localTime;

  const states = [
    { name: 'Ghost',    key: 'ghost',    t: 0.4,  glyph: '○○○', desc: 'A named idea.',                 detail: 'No weights · No trades' },
    { name: 'Passive',  key: 'passive',  t: 3.6,  glyph: '●●●', desc: 'Tracked, not yet sized.',       detail: 'Watchlist behaviour' },
    { name: 'Weighted', key: 'weighted', t: 6.8,  glyph: '●●●', desc: 'Allocations declared.',         detail: '40 · 30 · 20 · 10 %' },
    { name: 'Active',   key: 'active',   t: 10.0, glyph: '●●●', desc: 'Funded · saving on a cadence.', detail: '€ 1.247,30 · ▲ 1,11 %' },
  ];

  const cur = states.reduce((acc, s, i) => lt >= s.t ? i : acc, -1);
  const inP = cur >= 0 ? clamp((lt - states[cur].t) / 0.5, 0, 1) : 0;
  const eased = Easing.easeOutCubic(inP);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity }}>
      <div style={{ position: 'absolute', top: 80, left: 90, right: 90 }}>
        <div style={{ fontFamily: T.mono, fontSize: 12, color: T.inkDim, letterSpacing: 2, textTransform: 'uppercase' }}>The primitive</div>
        <div style={{
          fontFamily: T.serif, fontSize: 56, color: T.ink,
          letterSpacing: -1.4, lineHeight: 1.05, marginTop: 12, fontWeight: 400,
        }}>
          One object. <em style={{ fontStyle: 'italic', color: T.inkMid }}>Four states.</em>
        </div>
        <div style={{ fontFamily: T.sans, fontSize: 15, color: T.inkMid, marginTop: 14, maxWidth: 720 }}>
          Every Open Index lives somewhere on this gradient. The UI knows where, and only shows the moves that make sense from here.
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 110, left: 90, right: 90,
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
      }}>
        {states.map((s, i) => {
          const active = i === cur;
          const visited = i < cur;
          const tileScale = active ? (1 + 0.04 * eased) : 1;
          const dim = !active && !visited;
          return (
            <div key={s.key} style={{
              padding: 22,
              background: active ? T.ink : (visited ? T.paperDeep : T.paper),
              border: dim ? `1px dashed ${T.rule}` : 'none',
              borderRadius: 18,
              transform: `scale(${tileScale})`,
              transition: 'background 400ms ease, transform 400ms ease',
              minHeight: 200,
              display: 'flex', flexDirection: 'column',
              color: active ? T.paper : T.ink,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: active ? '#26262C' : (visited ? T.ink : 'transparent'),
                  border: dim ? `1px dashed ${T.inkFaint}` : 'none',
                  fontFamily: T.mono, fontSize: 14, fontWeight: 600,
                  color: active ? T.paper : (visited ? T.paper : T.inkFaint),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{s.glyph.slice(0, 2)}</div>
                <span style={{
                  fontFamily: T.mono, fontSize: 10, letterSpacing: 1.5,
                  color: active ? T.inkFaint : T.inkDim,
                  textTransform: 'uppercase',
                }}>0{i + 1}</span>
              </div>
              <div style={{
                fontFamily: T.sans, fontSize: 22, fontWeight: 600,
                marginTop: 16, letterSpacing: -0.5,
              }}>{s.name}</div>
              <div style={{
                fontFamily: T.sans, fontSize: 13,
                color: active ? '#9A9AA3' : T.inkDim,
                marginTop: 6, lineHeight: 1.4, flex: 1,
              }}>{s.desc}</div>
              <div style={{
                fontFamily: T.mono, fontSize: 11, marginTop: 10,
                color: active ? T.paper : T.inkMid,
                fontWeight: 500,
              }}>{s.detail}</div>
            </div>
          );
        })}
      </div>

      <div style={{
        position: 'absolute', left: 90, right: 90, bottom: 78,
        display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: T.mono, fontSize: 11, color: T.inkDim, letterSpacing: 2, textTransform: 'uppercase',
      }}>
        <span>Ghost</span>
        <div style={{ flex: 1, height: 1, background: T.rule, position: 'relative' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: `${((cur + 1) / 4) * 100}%`,
            background: T.ink, transition: 'width 400ms ease',
          }}/>
        </div>
        <span>Active</span>
      </div>
    </div>
  );
}

// ─── Scene 3 · Savings UI + unit economics (36–54s) ──────────────
function SceneSavings() {
  const { localTime, progress } = useSprite();
  const opacity = fade(progress, 0.08, 0.10);
  const lt = localTime;

  // Amount counts up 0 → 100, then frequency cycles to weekly,
  // then allocation table fans in showing 25 names × ~4€ each.
  const amount = Math.round(interpolate([0.5, 2.5], [0, 100], Easing.easeOutCubic)(lt));

  // 25 names equal-weight — show first 6 in phone, rest implied
  const composition = [
    { ticker: 'NVDA', bg: '#76B900', fg: '#000' },
    { ticker: 'AAPL', bg: '#FFFFFF', fg: '#000' },
    { ticker: 'MSFT', bg: '#F25022', fg: '#FFF' },
    { ticker: 'GOOGL', bg: '#4285F4', fg: '#FFF' },
    { ticker: 'AMZN', bg: '#FF9900', fg: '#000' },
    { ticker: 'META', bg: '#1877F2', fg: '#FFF' },
  ];
  const eurEach = amount / 25;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity }}>
      {/* Headline */}
      <div style={{ position: 'absolute', top: 80, left: 90, width: 640 }}>
        <div style={{ fontFamily: T.mono, fontSize: 12, color: T.inkDim, letterSpacing: 2, textTransform: 'uppercase' }}>The unit economics</div>
        <div style={{
          fontFamily: T.serif, fontSize: 50, color: T.ink,
          letterSpacing: -1.4, lineHeight: 1.05, marginTop: 12, fontWeight: 400,
        }}>
          One mandate.<br/>
          <em style={{ fontStyle: 'italic', color: T.inkMid }}>Twenty-five</em> fills a week.
        </div>
        <div style={{ fontFamily: T.sans, fontSize: 15, color: T.inkMid, marginTop: 18, lineHeight: 1.55, maxWidth: 540 }}>
          A 100&nbsp;€ weekly mandate against a 25-name basket produces ~1,300 fills per user per year — roughly an order of magnitude more than a Sparplan in one ETF.
        </div>

        {/* Year stat card */}
        <div style={{
          marginTop: 28,
          padding: '20px 22px', background: T.paperDeep, borderRadius: 16,
          opacity: clamp((lt - 4.0) / 0.6, 0, 1),
          transform: `translateY(${clamp((lt - 4.0) / 0.6, 0, 1) > 0 ? 0 : 8}px)`,
          transition: 'opacity 400ms, transform 400ms',
          maxWidth: 420,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
            <div>
              <div style={{ fontFamily: T.mono, fontSize: 10, color: T.inkDim, letterSpacing: 1.5, textTransform: 'uppercase' }}>Fills / year</div>
              <div style={{ fontFamily: T.serif, fontSize: 44, color: T.ink, fontWeight: 500, letterSpacing: -1.4, marginTop: 4, lineHeight: 1 }}>
                ~1.300
              </div>
            </div>
            <div style={{ fontFamily: T.sans, fontSize: 11, color: T.inkDim, letterSpacing: 0.5, paddingBottom: 4 }}>
              vs. ~50–150<br/>for a single-ETF Sparplan
            </div>
          </div>
        </div>

        {/* Annotations */}
        <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Annotation visible={lt > 0.6} text="One amount, one cadence" tone={T.ink}/>
          <Annotation visible={lt > 3.0} text="Fans out across the index" tone={T.ink}/>
          <Annotation visible={lt > 8.0} text="Saver doesn't see 25 tickets" tone={T.pos}/>
        </div>
      </div>

      {/* Phone */}
      <div style={{
        position: 'absolute', right: 110, top: 70,
        width: 380, height: 720,
        borderRadius: 38, background: T.panel,
        padding: '22px 18px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.20)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: T.sans, color: '#FFF', fontSize: 15, fontWeight: 600 }}>Sparplan starten</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 18, marginBottom: 6 }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: '#1F1F23',
            fontFamily: T.mono, fontSize: 12, color: '#FFF', fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>●●</div>
          <div>
            <div style={{ fontFamily: T.sans, fontSize: 10, color: '#9A9AA3' }}>Index</div>
            <div style={{ fontFamily: T.sans, fontSize: 13, color: '#FFF', fontWeight: 600 }}>Global Equal-Weight 25</div>
          </div>
        </div>

        {/* Amount hero */}
        <div style={{ textAlign: 'center', padding: '24px 0 4px' }}>
          <div style={{ fontFamily: T.sans, fontSize: 12, color: '#9A9AA3' }}>Every week</div>
          <div style={{
            fontFamily: T.sans, fontSize: 64, fontWeight: 700, color: '#FFF',
            letterSpacing: -1.8, marginTop: 14, lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {amount.toLocaleString('de-DE')}
            <span style={{ color: '#9A9AA3', fontSize: 36, fontWeight: 700 }}>,00</span>
            <span style={{ color: '#9A9AA3', fontSize: 32, fontWeight: 600, marginLeft: 8 }}>€</span>
          </div>
          <div style={{ fontFamily: T.sans, fontSize: 11, color: '#5E5E68', marginTop: 10 }}>
            ≈ {(amount * 52).toLocaleString('de-DE')} € per year
          </div>
        </div>

        {/* Frequency seg — fixed at weekly */}
        <div style={{ marginTop: 18, display: 'flex', gap: 2, padding: 3,
          background: '#13131A', borderRadius: 10 }}>
          {[
            { v: 'weekly', label: 'Weekly', active: true },
            { v: 'biweekly', label: '2 wk' },
            { v: 'monthly', label: 'Monthly' },
          ].map(f => (
            <div key={f.v} style={{
              flex: 1, height: 32, borderRadius: 8,
              background: f.active ? '#26262C' : 'transparent',
              color: f.active ? '#FFF' : '#9A9AA3',
              fontFamily: T.sans, fontSize: 12, fontWeight: f.active ? 600 : 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{f.label}</div>
          ))}
        </div>

        {/* Allocation preview */}
        <div style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 600, color: '#9A9AA3' }}>Per execution</span>
            <span style={{ fontFamily: T.mono, fontSize: 11, color: '#FFF', fontWeight: 500 }}>25 fills</span>
          </div>
          <div style={{ background: '#13131A', borderRadius: 12, padding: '4px 12px' }}>
            {composition.map((c, i) => {
              const appearAt = 3.0 + i * 0.18;
              const p = clamp((lt - appearAt) / 0.4, 0, 1);
              const eased = Easing.easeOutCubic(p);
              return (
                <div key={c.ticker} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '7px 0',
                  borderBottom: i < composition.length - 1 ? '1px solid #161619' : 'none',
                  opacity: eased,
                  transform: `translateX(${(1 - eased) * 16}px)`,
                }}>
                  <div style={{
                    width: 26, fontFamily: T.mono, fontSize: 10, color: '#9A9AA3',
                  }}>4,00&nbsp;%</div>
                  <div style={{
                    width: 22, height: 22, borderRadius: 5,
                    background: c.bg, color: c.fg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: T.sans, fontWeight: 700, fontSize: 9,
                  }}>{c.ticker.slice(0, 2)}</div>
                  <div style={{ flex: 1, fontFamily: T.sans, fontSize: 11, color: '#FFF', fontWeight: 500 }}>
                    {c.ticker}
                  </div>
                  <div style={{ fontFamily: T.mono, fontSize: 11, color: '#FFF', fontWeight: 500 }}>
                    {fmtE(eurEach)}
                  </div>
                </div>
              );
            })}
            {/* …and N more */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '8px 0',
              fontFamily: T.mono, fontSize: 10, color: '#5E5E68', letterSpacing: 1,
              opacity: clamp((lt - 4.5) / 0.5, 0, 1),
            }}>
              + 19 weitere
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}/>

        <div style={{
          height: 48, borderRadius: 24,
          background: '#FFF', color: '#000',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontFamily: T.sans, fontWeight: 600, fontSize: 14,
          marginTop: 12,
          boxShadow: lt > 6.0 ? '0 0 0 8px rgba(255,255,255,0.18)' : 'none',
          transition: 'box-shadow 250ms',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M17 2l4 4-4 4M21 6H7a4 4 0 00-4 4v2M7 22l-4-4 4-4M3 18h14a4 4 0 004-4v-2"
              stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {amount.toLocaleString('de-DE')} € sparen
        </div>
      </div>
    </div>
  );
}

function Annotation({ visible, text, tone }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      opacity: visible ? 1 : 0,
      transform: `translateY(${visible ? 0 : 6}px)`,
      transition: 'opacity 320ms ease, transform 320ms ease',
    }}>
      <div style={{
        width: 6, height: 6, borderRadius: 99,
        background: tone,
      }}/>
      <span style={{ fontFamily: T.sans, fontSize: 14, color: T.ink, fontWeight: 500 }}>{text}</span>
    </div>
  );
}

// ─── Scene 4 · Outro / Open Indexing (54–60s) ─────────────────────
function SceneOutro() {
  const { progress } = useSprite();
  const opacity = fade(progress, 0.25, 0.10);
  return (
    <div style={{
      position: 'absolute', inset: 0, opacity,
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
    }}>
      <div style={{
        fontFamily: T.mono, fontSize: 11, color: T.inkDim,
        letterSpacing: 3, textTransform: 'uppercase', marginBottom: 24,
      }}>The empty quadrant</div>

      {/* 2x2 quadrant */}
      <div style={{
        display: 'grid', gridTemplateColumns: '120px 1fr 1fr',
        gridTemplateRows: '40px 1fr 1fr',
        gap: 0, width: 720, height: 280,
        fontFamily: T.sans, fontSize: 13, color: T.ink,
        marginBottom: 44,
      }}>
        <div/>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.mono, fontSize: 10, color: T.inkDim, letterSpacing: 1.5, textTransform: 'uppercase' }}>DIY</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.mono, fontSize: 10, color: T.inkDim, letterSpacing: 1.5, textTransform: 'uppercase' }}>Advised</div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 14, fontFamily: T.mono, fontSize: 10, color: T.inkDim, letterSpacing: 1.5, textTransform: 'uppercase' }}>Active</div>
        <QuadCell label="Trading apps"/>
        <QuadCell label="Wealth mgmt"/>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 14, fontFamily: T.mono, fontSize: 10, color: T.inkDim, letterSpacing: 1.5, textTransform: 'uppercase' }}>Passive</div>
        <QuadCell label="Open Indexing" highlight/>
        <QuadCell label="Robo / target-date"/>
      </div>

      <div style={{
        fontFamily: T.serif, fontSize: 64, color: T.ink, letterSpacing: -1.8,
        lineHeight: 1.02, fontWeight: 400, textAlign: 'center', maxWidth: 1000,
      }}>
        The category needs <em style={{ fontStyle: 'italic', color: T.inkMid }}>a name.</em>
      </div>
      <div style={{
        marginTop: 18, fontFamily: T.sans, fontSize: 16, color: T.inkMid,
      }}>
        Open Indexing — retail direct indexing, savings-native.
      </div>
    </div>
  );
}

function QuadCell({ label, highlight }) {
  return (
    <div style={{
      border: highlight ? `2px solid ${T.ink}` : `1px solid ${T.rule}`,
      background: highlight ? T.paperDeep : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-sans, system-ui)',
      fontSize: highlight ? 18 : 14,
      fontWeight: highlight ? 700 : 500,
      color: highlight ? '#0A0A0B' : '#3D3D42',
      letterSpacing: highlight ? -0.4 : 0,
      padding: 16, textAlign: 'center',
    }}>{label}</div>
  );
}

// ─── Schedule ─────────────────────────────────────────────────────
const SCHEDULE = [
  { component: SceneIntro,    start: 0,  end: 4  },
  { component: SceneProblem,  start: 4,  end: 22 },
  { component: SceneStates,   start: 22, end: 36 },
  { component: SceneSavings,  start: 36, end: 54 },
  { component: SceneOutro,    start: 54, end: 60 },
];

function CaseDeck() {
  return (
    <>
      {SCHEDULE.map(({ component: C, start, end }, i) => (
        <Sprite key={i} start={start} end={end}>
          <C/>
        </Sprite>
      ))}
      <SceneCounter/>
    </>
  );
}

function SceneCounter() {
  const time = useTime();
  const idx = SCHEDULE.findIndex(s => time >= s.start && time < s.end);
  const total = SCHEDULE.length;
  const cur = idx < 0 ? total : idx + 1;
  return (
    <div style={{
      position: 'absolute', top: 40, right: 60,
      fontFamily: T.mono, fontSize: 11, color: T.inkDim,
      letterSpacing: 2, textTransform: 'uppercase',
      display: 'flex', gap: 8,
    }}>
      <span>Scene {String(cur).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      <span style={{ width: 1, background: T.rule }}/>
      <span>{time.toFixed(1)}s</span>
    </div>
  );
}

function Root() {
  return (
    <Stage width={1440} height={900} duration={60} background={T.paper}
      persistKey="openindex-case-v1" loop autoplay>
      <CaseDeck/>
    </Stage>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root/>);
