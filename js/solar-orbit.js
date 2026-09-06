/**
 * SOLAR SYSTEM TRAJECTORY & CELESTIAL PLANET ORBIT ENGINE
 * Mahabbah Mahabban Romadhon — Scientific Cinematic Motion
 * 
 * Principles:
 * - "Move the planets, don't spin the planets."
 * - Pure orbital translation: rotation = 0deg during motion.
 * - Sequence:
 *   STEP 1: All planets 100% visible and solid at initial positions (θ0).
 *   STEP 2: Trajectory lines reveal ONE BY ONE with SVG stroke-dashoffset.
 *   STEP 3: Each planet glides along its trajectory line as it draws.
 *   STEP 4: Staggered progression (Mercury -> Venus -> Earth -> Mars -> Jupiter -> Saturn).
 *   STEP 5: Smooth, graceful return to EXACT INITIAL POSITIONS (θ1 -> θ0).
 *   LOOP: Forward -> Return -> Idle (3.6s) -> Repeat.
 */
(function() {
  function initSolarOrbitEngine() {
    const svg = document.getElementById('solarSystemSvg');
    if (!svg) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // SVG ViewBox Center
    const CX = 500;
    const CY = 300;

    // Astronomical data for 6 orbiting planets (Sun is at center)
    const planetsData = [
      {
        id: 'mercury',
        name: 'Mercury',
        rx: 78,
        ry: 48,
        color: '#D4AF37',
        glow: 'rgba(212, 175, 55, 0.45)',
        radius: 4.5,
        initAngle: 0.4,
        travelArc: 1.4,
        lineColor: 'rgba(212, 175, 55, 0.55)'
      },
      {
        id: 'venus',
        name: 'Venus',
        rx: 132,
        ry: 82,
        color: '#E6B87D',
        glow: 'rgba(230, 184, 125, 0.45)',
        radius: 6.5,
        initAngle: 2.15,
        travelArc: -1.35,
        lineColor: 'rgba(230, 184, 125, 0.5)'
      },
      {
        id: 'earth',
        name: 'Earth',
        rx: 195,
        ry: 122,
        color: '#00F0FF',
        glow: 'rgba(0, 240, 255, 0.5)',
        radius: 8.0,
        hasMoon: true,
        initAngle: 4.25,
        travelArc: 1.25,
        lineColor: 'rgba(0, 240, 255, 0.6)'
      },
      {
        id: 'mars',
        name: 'Mars',
        rx: 265,
        ry: 165,
        color: '#FF6B6B',
        glow: 'rgba(255, 107, 107, 0.45)',
        radius: 6.0,
        initAngle: 0.95,
        travelArc: -1.15,
        lineColor: 'rgba(255, 107, 107, 0.5)'
      },
      {
        id: 'jupiter',
        name: 'Jupiter',
        rx: 345,
        ry: 215,
        color: '#C084FC',
        glow: 'rgba(192, 132, 252, 0.45)',
        radius: 12.0,
        hasBands: true,
        initAngle: 3.4,
        travelArc: 0.95,
        lineColor: 'rgba(192, 132, 252, 0.5)'
      },
      {
        id: 'saturn',
        name: 'Saturn',
        rx: 435,
        ry: 270,
        color: '#FDE047',
        glow: 'rgba(253, 224, 71, 0.45)',
        radius: 10.0,
        hasRings: true,
        initAngle: 5.4,
        travelArc: -0.85,
        lineColor: 'rgba(253, 224, 71, 0.55)'
      }
    ];

    const linesGroup = document.getElementById('solarTrajectoryLines');
    const planetsGroup = document.getElementById('solarPlanetsGroup');
    if (!linesGroup || !planetsGroup) return;

    // Reset groups in case of re-init
    linesGroup.innerHTML = '';
    planetsGroup.innerHTML = '';

    function getEllipsePoint(rx, ry, angle) {
      return {
        x: CX + rx * Math.cos(angle),
        y: CY + ry * Math.sin(angle)
      };
    }

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    function easeOutQuad(t) {
      return 1 - (1 - t) * (1 - t);
    }

    // Build SVG Trajectory Paths & Planet Nodes
    const activeEntities = planetsData.map((data, index) => {
      // 1. Full orbit guide line (subtle background trace)
      const guidePath = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      guidePath.setAttribute('cx', CX);
      guidePath.setAttribute('cy', CY);
      guidePath.setAttribute('rx', data.rx);
      guidePath.setAttribute('ry', data.ry);
      guidePath.setAttribute('class', 'orbit-guide-line');
      linesGroup.appendChild(guidePath);

      // 2. Active Trajectory Line (revealed one by one)
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const startPt = getEllipsePoint(data.rx, data.ry, data.initAngle);
      const steps = 40;
      let d = `M ${startPt.x.toFixed(2)} ${startPt.y.toFixed(2)}`;
      for (let i = 1; i <= steps; i++) {
        const a = data.initAngle + data.travelArc * (i / steps);
        const pt = getEllipsePoint(data.rx, data.ry, a);
        d += ` L ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;
      }
      path.setAttribute('d', d);
      path.setAttribute('class', 'trajectory-active-line');
      path.setAttribute('stroke', data.lineColor);
      path.setAttribute('stroke-width', '1.5');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke-linecap', 'round');
      linesGroup.appendChild(path);

      const pathLength = path.getTotalLength();
      path.style.strokeDasharray = pathLength;
      path.style.strokeDashoffset = pathLength;
      path.style.opacity = '0';

      // 3. Planet Node Group (STRICTLY TRANSLATED, NEVER ROTATED AROUND SELF)
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'planet-node');
      g.setAttribute('data-planet', data.id);

      // Corona Halo
      const halo = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      halo.setAttribute('r', (data.radius * 2.2).toFixed(1));
      halo.setAttribute('fill', data.glow);
      halo.setAttribute('opacity', '0.45');
      halo.setAttribute('class', 'planet-halo');
      g.appendChild(halo);

      // Solid Planet Body (ALWAYS VISIBLE, NO DISAPPEARING)
      const body = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      body.setAttribute('r', data.radius);
      body.setAttribute('fill', data.color);
      body.setAttribute('class', 'planet-body');
      body.setAttribute('filter', 'drop-shadow(0 0 6px ' + data.color + ')');
      g.appendChild(body);

      // Earth's tiny Moon
      let moonEl = null;
      if (data.hasMoon) {
        moonEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        moonEl.setAttribute('r', '2');
        moonEl.setAttribute('fill', '#D4E4FF');
        moonEl.setAttribute('cx', '14');
        moonEl.setAttribute('cy', '0');
        moonEl.setAttribute('class', 'planet-moon');
        g.appendChild(moonEl);
      }

      // Jupiter's Atmosphere Band
      if (data.hasBands) {
        const band = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        band.setAttribute('x1', -data.radius * 0.9);
        band.setAttribute('y1', 0);
        band.setAttribute('x2', data.radius * 0.9);
        band.setAttribute('y2', 0);
        band.setAttribute('stroke', '#FFFFFF');
        band.setAttribute('stroke-width', '1.5');
        band.setAttribute('opacity', '0.45');
        g.appendChild(band);
      }

      // Saturn's Ring (Static tilt for iconic look, no rotation)
      if (data.hasRings) {
        const ring = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        ring.setAttribute('cx', 0);
        ring.setAttribute('cy', 0);
        ring.setAttribute('rx', data.radius * 2.1);
        ring.setAttribute('ry', data.radius * 0.6);
        ring.setAttribute('fill', 'none');
        ring.setAttribute('stroke', data.color);
        ring.setAttribute('stroke-width', '2');
        ring.setAttribute('transform', 'rotate(-24)');
        ring.setAttribute('opacity', '0.75');
        g.appendChild(ring);
      }

      // Scientific Telemetry Label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.textContent = data.name.toUpperCase();
      label.setAttribute('class', 'planet-label');
      label.setAttribute('x', '0');
      label.setAttribute('y', (data.radius + 12).toFixed(1));
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('fill', data.color);
      label.setAttribute('font-size', '8px');
      label.setAttribute('letter-spacing', '1.5px');
      label.setAttribute('font-family', 'var(--font-mono)');
      g.appendChild(label);

      // Position planet firmly at STEP 1 INITIAL POSITION (pure translation, 0deg rotation)
      g.setAttribute('transform', `translate(${startPt.x.toFixed(2)}, ${startPt.y.toFixed(2)})`);
      planetsGroup.appendChild(g);

      return {
        data,
        path,
        pathLength,
        g,
        moonEl,
        currentProgress: 0,
        lineRevealProgress: 0
      };
    });

    // Timing Configuration (Seconds)
    const DURATION_LINE_DRAW = 1.35;    // Trajectory draw duration
    const DURATION_PLANET_GLIDE = 1.55; // Planet glide duration along trajectory
    const STAGGER_INTERVAL = 0.85;      // Stagger between sequential planets
    const RETURN_DURATION = 2.4;        // Synchronized return duration
    const IDLE_DURATION = 3.6;          // Idle rest duration before repeating

    const totalForwardTime = (activeEntities.length - 1) * STAGGER_INTERVAL + DURATION_PLANET_GLIDE;
    const returnStartTime = totalForwardTime + 0.8;
    const idleStartTime = returnStartTime + RETURN_DURATION;
    const totalCycleTime = idleStartTime + IDLE_DURATION;

    let cycleTime = 0;
    let lastTimestamp = performance.now();
    let isVisible = true;

    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
      if (isVisible) lastTimestamp = performance.now();
    });

    function animationTick(now) {
      if (!isVisible) {
        requestAnimationFrame(animationTick);
        return;
      }

      const dt = Math.min((now - lastTimestamp) / 1000, 0.1);
      lastTimestamp = now;

      if (!reduceMotion) {
        cycleTime = (cycleTime + dt) % totalCycleTime;

        activeEntities.forEach((entity, index) => {
          const planetStartTime = index * STAGGER_INTERVAL;
          const lineEndTime = planetStartTime + DURATION_LINE_DRAW;
          const planetEndTime = planetStartTime + DURATION_PLANET_GLIDE;

          let targetProgress = 0;
          let lineProgress = 0;

          if (cycleTime < planetStartTime) {
            // STEP 1: Waiting turn -> Stationary at Initial Position (θ0)
            targetProgress = 0;
            lineProgress = 0;
          } else if (cycleTime >= planetStartTime && cycleTime < returnStartTime) {
            // STEP 2 & 3: Sequential Line Draw & Smooth Glide
            const lineLocalTime = Math.min(DURATION_LINE_DRAW, cycleTime - planetStartTime);
            lineProgress = easeOutQuad(lineLocalTime / DURATION_LINE_DRAW);

            const planetLocalTime = Math.min(DURATION_PLANET_GLIDE, cycleTime - planetStartTime);
            targetProgress = easeInOutCubic(planetLocalTime / DURATION_PLANET_GLIDE);
          } else if (cycleTime >= returnStartTime && cycleTime < idleStartTime) {
            // STEP 5: Graceful Return to EXACT INITIAL POSITION (θ1 -> θ0)
            const returnLocalTime = cycleTime - returnStartTime;
            const returnT = returnLocalTime / RETURN_DURATION;
            const returnEase = easeInOutCubic(returnT);

            targetProgress = 1 - returnEase;
            lineProgress = Math.max(0, 1 - returnT * 1.3);
          } else {
            // IDLE PHASE: All planets resting at EXACT INITIAL POSITION
            targetProgress = 0;
            lineProgress = 0;
          }

          entity.currentProgress = targetProgress;
          entity.lineRevealProgress = lineProgress;

          // Update Trajectory SVG Line
          const offset = entity.pathLength * (1 - lineProgress);
          entity.path.style.strokeDashoffset = offset.toFixed(1);
          entity.path.style.opacity = (lineProgress > 0.01) ? (0.3 + lineProgress * 0.6).toFixed(2) : '0';

          // Update Planet Position: STRICT TRANSLATION ONLY (NO ROLLING, NO 360 SPINNING)
          const angle = entity.data.initAngle + entity.data.travelArc * targetProgress;
          const pt = getEllipsePoint(entity.data.rx, entity.data.ry, angle);
          entity.g.setAttribute('transform', `translate(${pt.x.toFixed(2)}, ${pt.y.toFixed(2)})`);

          // Tiny lunar orbit for Earth
          if (entity.moonEl) {
            const moonAngle = (now * 0.003) % (Math.PI * 2);
            entity.moonEl.setAttribute('cx', (Math.cos(moonAngle) * 16).toFixed(1));
            entity.moonEl.setAttribute('cy', (Math.sin(moonAngle) * 9).toFixed(1));
          }
        });
      }

      requestAnimationFrame(animationTick);
    }

    requestAnimationFrame(animationTick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSolarOrbitEngine);
  } else {
    initSolarOrbitEngine();
  }
})();
