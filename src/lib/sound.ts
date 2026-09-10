export type SoundName =
  | 'tap'
  | 'play'
  | 'error'
  | 'power'
  | 'success'
  | 'slide'
  | 'select'
  | 'thud'
  | 'slam'
  | 'riffle'
  | 'draw'
  | 'tick'
  | 'timer'
  | 'heartbeat'
  | 'tension'
  | 'fanfare'
  | 'victory'

let sharedAudioContext: AudioContext | null = null

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null
  if (!sharedAudioContext) {
    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (AudioContextClass) {
      sharedAudioContext = new AudioContextClass()
    }
  }
  if (sharedAudioContext && sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume().catch(() => {})
  }
  return sharedAudioContext
}

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem('wahala-sound') !== 'off'
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem('wahala-sound', enabled ? 'on' : 'off')
}

// Generate buffer of filtered white noise for tactile paper & card friction
function createNoiseBuffer(context: AudioContext, duration: number): AudioBuffer {
  const sampleRate = context.sampleRate
  const buffer = context.createBuffer(1, Math.floor(sampleRate * duration), sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1
  }
  return buffer
}

export function playUiSound(name: SoundName): void {
  if (!isSoundEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    switch (name) {
      case 'slide':
      case 'select':
      case 'tap': {
        // Paper slide on card select: filtered friction noise + subtle tactile transient
        const noise = ctx.createBufferSource()
        noise.buffer = createNoiseBuffer(ctx, 0.08)
        const filter = ctx.createBiquadFilter()
        filter.type = 'bandpass'
        filter.frequency.setValueAtTime(2200, now)
        filter.Q.setValueAtTime(2.0, now)

        const noiseGain = ctx.createGain()
        noiseGain.gain.setValueAtTime(0.04, now)
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.075)

        noise.connect(filter)
        filter.connect(noiseGain)
        noiseGain.connect(ctx.destination)
        noise.start(now)
        noise.stop(now + 0.08)

        // Soft sine transient
        const osc = ctx.createOscillator()
        const oscGain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(360, now)
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.05)
        oscGain.gain.setValueAtTime(0.03, now)
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
        osc.connect(oscGain)
        oscGain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.05)
        break
      }

      case 'play':
      case 'thud':
      case 'slam': {
        // Solid table thud on card play: punchy wooden impact + card slap
        const sub = ctx.createOscillator()
        const subGain = ctx.createGain()
        sub.type = 'triangle'
        sub.frequency.setValueAtTime(140, now)
        sub.frequency.exponentialRampToValueAtTime(42, now + 0.16)
        subGain.gain.setValueAtTime(0.12, now)
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)
        sub.connect(subGain)
        subGain.connect(ctx.destination)
        sub.start(now)
        sub.stop(now + 0.18)

        // Card slap transient
        const snap = ctx.createBufferSource()
        snap.buffer = createNoiseBuffer(ctx, 0.04)
        const snapFilter = ctx.createBiquadFilter()
        snapFilter.type = 'highpass'
        snapFilter.frequency.setValueAtTime(1400, now)
        const snapGain = ctx.createGain()
        snapGain.gain.setValueAtTime(0.06, now)
        snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035)
        snap.connect(snapFilter)
        snapFilter.connect(snapGain)
        snapGain.connect(ctx.destination)
        snap.start(now)
        snap.stop(now + 0.04)
        break
      }

      case 'riffle':
      case 'draw': {
        // Market riffle on draw: 3 micro-clicks simulating card drawn from deck
        [0, 0.032, 0.065].forEach((offset, idx) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'triangle'
          const freq = 650 + idx * 220
          osc.frequency.setValueAtTime(freq, now + offset)
          osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + offset + 0.03)
          gain.gain.setValueAtTime(0.045, now + offset)
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.03)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(now + offset)
          osc.stop(now + offset + 0.035)
        })
        break
      }

      case 'tick':
      case 'timer': {
        // Tension clock tick for reaction timer: crisp high wood click
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(1600, now)
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.02)
        gain.gain.setValueAtTime(0.05, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.025)
        break
      }

      case 'heartbeat':
      case 'tension': {
        // High-tension check-up heartbeat: rhythmic sub-bass "lub-dub" thumps
        [0, 0.12].forEach((offset, idx) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          const startFreq = idx === 0 ? 82 : 72
          osc.frequency.setValueAtTime(startFreq, now + offset)
          osc.frequency.exponentialRampToValueAtTime(36, now + offset + 0.14)
          gain.gain.setValueAtTime(0.14, now + offset)
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.15)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(now + offset)
          osc.stop(now + offset + 0.16)
        })
        break
      }

      case 'fanfare':
      case 'victory':
      case 'success': {
        // Victory fanfare: ascending harmonic major chord C5 -> E5 -> G5 -> C6
        const chordNotes = [523.25, 659.25, 783.99, 1046.5]
        chordNotes.forEach((freq, idx) => {
          const noteTime = now + idx * 0.075
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = idx === chordNotes.length - 1 ? 'triangle' : 'sawtooth'
          osc.frequency.setValueAtTime(freq, noteTime)
          gain.gain.setValueAtTime(0.07, noteTime)
          gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.4)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(noteTime)
          osc.stop(noteTime + 0.42)
        })
        break
      }

      case 'power': {
        // Mystical class ability resonance shimmer
        const freqs = [380, 570, 760]
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sawtooth'
          osc.frequency.setValueAtTime(freq, now)
          osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.28)
          gain.gain.setValueAtTime(0.035 / (idx + 1), now)
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(now)
          osc.stop(now + 0.36)
        })
        break
      }

      case 'error': {
        // Muted double-knock thud
        [0, 0.07].forEach((offset) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'triangle'
          osc.frequency.setValueAtTime(110, now + offset)
          osc.frequency.exponentialRampToValueAtTime(55, now + offset + 0.06)
          gain.gain.setValueAtTime(0.06, now + offset)
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.06)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(now + offset)
          osc.stop(now + offset + 0.065)
        })
        break
      }
    }
  } catch {
    // Audio is non-blocking enhancement
  }
}

// Procedural Afrobeat / Parlor Lounge Lobby Sound Engine
let lobbyMusicTimer: number | null = null
let lobbyMasterGain: GainNode | null = null
let lobbyMusicPlaying = false

export function isLobbyMusicPlaying(): boolean {
  return lobbyMusicPlaying
}

export function startLobbyMusic(): void {
  if (typeof window === 'undefined') return
  if (!isSoundEnabled()) return
  if (lobbyMusicPlaying) return

  try {
    const ctx = getAudioContext()
    if (!ctx) return

    lobbyMusicPlaying = true
    lobbyMasterGain = ctx.createGain()
    lobbyMasterGain.gain.setValueAtTime(0.045, ctx.currentTime)
    lobbyMasterGain.connect(ctx.destination)

    // Pentatonic scale: D3, F3, G3, A3, C4, D4, F4, G4, A4
    const kalimbaNotes = [293.66, 349.23, 392.0, 440.0, 523.25, 587.33, 698.46]
    // 8-step groove pattern
    const pattern = [
      { note: 0, bass: 146.83, shaker: true }, // D
      { note: 3, bass: null, shaker: false },  // A
      { note: 4, bass: null, shaker: true },   // C
      { note: 1, bass: 174.61, shaker: false }, // F
      { note: 5, bass: null, shaker: true },   // D5
      { note: 2, bass: null, shaker: false },  // G
      { note: 3, bass: 220.0, shaker: true },  // A
      { note: 6, bass: null, shaker: false },  // F5
    ]

    let step = 0
    const stepDurationMs = 290 // ~103 BPM chill groove

    const tick = () => {
      if (!lobbyMusicPlaying || !lobbyMasterGain) return
      const now = ctx.currentTime
      const current = pattern[step % pattern.length]
      step++

      // 1. Play Kalimba note
      if (current.note !== null && kalimbaNotes[current.note]) {
        const osc = ctx.createOscillator()
        const noteGain = ctx.createGain()
        osc.type = 'sine'
        const freq = kalimbaNotes[current.note]
        osc.frequency.setValueAtTime(freq, now)

        // Overtone for woody kalimba ping
        const overtone = ctx.createOscillator()
        const overGain = ctx.createGain()
        overtone.type = 'triangle'
        overtone.frequency.setValueAtTime(freq * 2.75, now)

        noteGain.gain.setValueAtTime(0.045, now)
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35)

        overGain.gain.setValueAtTime(0.012, now)
        overGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08)

        osc.connect(noteGain)
        noteGain.connect(lobbyMasterGain)
        overtone.connect(overGain)
        overGain.connect(lobbyMasterGain)

        osc.start(now)
        osc.stop(now + 0.38)
        overtone.start(now)
        overtone.stop(now + 0.1)
      }

      // 2. Play Sub bass note
      if (current.bass !== null) {
        const bassOsc = ctx.createOscillator()
        const bassGain = ctx.createGain()
        bassOsc.type = 'triangle'
        bassOsc.frequency.setValueAtTime(current.bass / 2, now)
        bassGain.gain.setValueAtTime(0.055, now)
        bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5)

        bassOsc.connect(bassGain)
        bassGain.connect(lobbyMasterGain)

        bassOsc.start(now)
        bassOsc.stop(now + 0.52)
      }

      // 3. Play Soft Shaker pulse
      if (current.shaker) {
        const shakerSource = ctx.createBufferSource()
        shakerSource.buffer = createNoiseBuffer(ctx, 0.04)
        const filter = ctx.createBiquadFilter()
        filter.type = 'highpass'
        filter.frequency.setValueAtTime(3200, now)

        const shakerGain = ctx.createGain()
        shakerGain.gain.setValueAtTime(0.015, now)
        shakerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035)

        shakerSource.connect(filter)
        filter.connect(shakerGain)
        shakerGain.connect(lobbyMasterGain)

        shakerSource.start(now)
        shakerSource.stop(now + 0.04)
      }
    }

    tick()
    lobbyMusicTimer = window.setInterval(tick, stepDurationMs)
  } catch {
    // Non-blocking
  }
}

export function stopLobbyMusic(): void {
  if (lobbyMusicTimer) {
    window.clearInterval(lobbyMusicTimer)
    lobbyMusicTimer = null
  }
  if (lobbyMasterGain) {
    try {
      lobbyMasterGain.disconnect()
    } catch {}
    lobbyMasterGain = null
  }
  lobbyMusicPlaying = false
}

export function toggleLobbyMusic(): boolean {
  if (lobbyMusicPlaying) {
    stopLobbyMusic()
    return false
  } else {
    startLobbyMusic()
    return true
  }
}
