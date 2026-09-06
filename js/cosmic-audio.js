/**
 * COSMIC AUDIO TELEMETRY SYNTHESIZER
 * Pure Web Audio API — No external audio assets needed
 * Synthesizes gentle cosmic hums, scanner sweeps, and celestial chimes
 */
(function initCosmicAudio() {
  let audioCtx = null;
  let isMuted = true; // Default muted for clean UX
  let laserOsc = null;
  let laserGain = null;

  function getContext() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  const CosmicAudio = {
    toggleMute: function() {
      isMuted = !isMuted;
      const btn = document.getElementById('audioToggle');
      if (btn) {
        btn.classList.toggle('active', !isMuted);
        btn.setAttribute('aria-pressed', !isMuted);
        btn.title = isMuted ? 'Aktifkan Audio Kosmik' : 'Matikan Audio Kosmik';
      }
      if (!isMuted) {
        getContext();
        this.playChime();
      }
      return !isMuted;
    },

    isMuted: function() { return isMuted; },

    // Gentle holographic laser sweep hum
    playLaserHum: function(ratio) {
      if (isMuted) return;
      try {
        const ctx = getContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        const baseFreq = 220 + (ratio || 0.5) * 380; // 220Hz to 600Hz

        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.2, now + 0.12);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.18);
      } catch (e) {}
    },

    // Celestial chime for clicks & navigation
    playChime: function() {
      if (isMuted) return;
      try {
        const ctx = getContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5 harmonic triad

        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + i * 0.04);

          gain.gain.setValueAtTime(0.001, now + i * 0.04);
          gain.gain.linearRampToValueAtTime(0.025, now + i * 0.04 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.55);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + i * 0.04);
          osc.stop(now + i * 0.04 + 0.6);
        });
      } catch (e) {}
    },

    // Subtle sci-fi click for filter switches
    playClick: function() {
      if (isMuted) return;
      try {
        const ctx = getContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.05);

        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.06);
      } catch (e) {}
    }
  };

  window.CosmicAudio = CosmicAudio;

  // Initialize toggle button in DOM
  function initAudioControls() {
    const btn = document.getElementById('audioToggle');
    if (btn) {
      btn.addEventListener('click', () => CosmicAudio.toggleMute());
    }

    // Attach click chime to navigation & filter buttons
    document.querySelectorAll('.filter-btn, .tech-card, .navlinks a').forEach(el => {
      el.addEventListener('click', () => CosmicAudio.playClick());
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAudioControls);
  } else {
    initAudioControls();
  }
})();
