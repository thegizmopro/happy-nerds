## Task: E-38, E-39, E-40 — Audio System (Core + Arc Tone + Sound Effects)

This is a combined task covering three engineering plan items that should be built together since they share the same foundation.

### E-38: Audio System — Core

**What to build:**
1. Web Audio API context (`AudioContext`), initialized on first user interaction (click/touch) to comply with browser autoplay policies
2. Sound manager: `SoundManager.js` that wraps the AudioContext, provides play/stop methods
3. Volume control persisted in ProgressStore (0-100, default 70)
4. Mute toggle button in the HUD (🔊/🔇)

### E-39: Dynamic Arc Tone

**What to build:**
1. An oscillator that plays continuously while the player drags a slider or control point
2. Frequency maps to arc shape: higher = tighter arc (larger |a|), lower = wider
3. Map range: |a| from 0.05 to 0.5 → frequency 220Hz to 880Hz
4. Sign change (a crosses zero) → brief tone dip/detour
5. Subtle volume — this is background texture, not annoying. Maybe 15% of master volume.
6. Stops immediately when slider/control point is released

### E-40: Sound Effects

**What to build — all synthesized with Web Audio API (no audio files needed):**
1. **Coefficient click**: Short percussive click when slider value changes. Pitch mapped to coefficient value. Duration: 30ms.
2. **Launch whoosh**: Short ascending noise burst (white noise through bandpass filter, frequency sweeps up). Duration: 300ms.
3. **Target hit**: Crash sound (noise burst) + celebratory chord (major triad, 3 oscillators). Duration: 500ms.
4. **Target miss**: Descending "wah wah" tone. Two oscillators descending in pitch with slight detune for trombone effect. Duration: 800ms.
5. **Star earn**: Ascending arpeggio (C-E-G-C, 4 quick notes). Duration: 400ms.
6. **Whistle pig tweet**: Short high-pitched chirp when whistle pig spawns. Duration: 150ms.
7. **Bonus ring chime**: Clear bell tone when passing through bonus ring. Duration: 300ms.
8. **Obstacle splat**: Short thud/impact sound when projectile hits obstacle. Duration: 200ms.

### Implementation Details

**New file: `src/audio/SoundManager.js`**

```js
export class SoundManager {
  constructor()
  init()                          // Create AudioContext on first user interaction
  get volume()                    // 0-100
  set volume(v)                   // Persist to ProgressStore
  get muted()                     // Toggle state
  set muted(m)                    // Persist to ProgressStore
  
  // Arc tone (E-39)
  startArcTone(coeffValue)        // Start oscillator at mapped frequency
  updateArcTone(coeffValue)       // Update frequency on drag
  stopArcTone()                   // Stop on release
  
  // Sound effects (E-40) — all synthesized, no files
  playClick(pitch)                // pitch 0-1 maps to frequency
  playLaunch()                    // whoosh
  playHit()                       // crash + chord
  playMiss()                      // descending wah
  playStar()                      // ascending arpeggio
  playWhistleTweet()              // chirp
  playBonusChime()                // bell
  playObstacleSplat()             // thud
}
```

**Synthesis recipes (all use OscillatorNode + GainNode, no samples):**

- **Click**: Sine oscillator at (400 + pitch*800)Hz, gain envelope: attack 0ms, decay 30ms, peak 0.3
- **Launch whoosh**: White noise (AudioBufferSourceNode with random data) through BiquadFilter (bandpass, Q=2, frequency sweeps 200→2000Hz over 300ms), gain envelope: attack 10ms, decay 290ms
- **Hit crash + chord**: 
  - Crash: white noise, 100ms, gain peak 0.4, sharp decay
  - Chord: 3 sine oscillators at C4(262), E4(330), G4(392), each with 500ms decay, gain peak 0.2
- **Miss wah**: 2 sawtooth oscillators starting at 400Hz/402Hz, descending to 150Hz/152Hz over 800ms, gain peak 0.25
- **Star arpeggio**: Sine oscillator playing C5(523)→E5(659)→G5(784)→C6(1047), 100ms per note, gain peak 0.3
- **Whistle tweet**: Sine oscillator at 2000Hz→2500Hz sweep over 150ms, gain peak 0.2
- **Bonus chime**: Sine oscillator at 1200Hz with slow decay (300ms), gain peak 0.25
- **Obstacle splat**: Sine oscillator at 150Hz, fast decay (50ms), gain peak 0.35

**Arc tone mapping:**
- |a| range: 0.05 → 0.5
- Frequency range: 220Hz → 880Hz (A3 → A5)
- Linear interpolation: freq = 220 + (|a| - 0.05) / (0.5 - 0.05) * 660
- Waveform: sine
- Volume: 15% of master

**In `src/game/GameController.js`:**
- Create SoundManager in `init()`, call `soundManager.init()` on first canvas interaction
- On coefficient change (slider or control point drag): call `startArcTone/stopArcTone`
- On launch: `playLaunch()`
- On target hit (in `_animateLaunch`): `playHit()`
- On miss (`_onLaunchComplete`): `playMiss()`
- On star earn: `playStar()`
- On obstacle splat (arc clipped by obstacle): `playObstacleSplat()`

**In `src/ui/UIController.js`:**
- Add mute button (🔊/🔇) to the HUD
- Wire mute toggle to SoundManager

**In `src/save/ProgressStore.js`:**
- Add `volume` (default 70) and `muted` (default false) to the progress object
- Load/save alongside existing data

### Files to Create/Modify
- `src/audio/SoundManager.js` — NEW: all audio logic
- `src/game/GameController.js` — wire sound triggers
- `src/ui/UIController.js` — mute button
- `src/save/ProgressStore.js` — volume/muted persistence

### Constraints
- ALL sounds must be synthesized — no audio file assets
- AudioContext must be created on user gesture (first click/touch), not on page load
- Must handle the case where AudioContext is suspended (browser policy) gracefully — resume on interaction
- Volume and mute state persist across sessions
- If Web Audio API is not available, the game should still work (silent fallback)
- Do NOT modify any level data files
- Do NOT modify the equation system, collision, or rendering

### Verification
After making changes, verify:
1. Sound plays on first interaction (not before)
2. Dragging a slider plays the arc tone, stops on release
3. Launch plays whoosh sound
4. Target hit plays crash + chord
5. Miss plays descending wah
6. Star earn plays ascending arpeggio
7. Obstacle hit plays splat
8. Mute button works and persists
9. Game works silently if AudioContext fails
