/**
 * ============================================================================
 * HANGING PROFILE CARD INTERACTIVE SPRING & VECTOR LANYARD PHYSICS ENGINE
 * Mahabbah Mahabban Romadhon — Suspended Identity Badge Motion & Touch Physics
 * ============================================================================
 * 
 * Mechanics:
 * - Direct vector SVG connection from Anchor Pin (top) to Grommet Eyelet (badge).
 * - Dragging left, right, or down pulls the assembly in full 2D space.
 * - Cord NEVER breaks, detaches, or has a gap (mathematically locked endpoints).
 * - Releasing triggers realistic damped 2D harmonic spring recoil oscillation.
 */

(function initHangingCardPhysics() {
  'use strict';

  function setup() {
    const track = document.getElementById('hangingCardTrack');
    const wrapper = document.getElementById('hangingCardWrapper');
    const pin = document.getElementById('hangingAnchorPin');
    const grommet = document.getElementById('hangingGrommet');
    const assembly = document.getElementById('hangingBadgeAssembly');
    const card = document.getElementById('hangingProfileCard');
    const line = document.getElementById('hangingCordLine');
    const glow = document.getElementById('hangingCordGlow');

    if (!wrapper || !card || !assembly || !pin || !grommet) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let isSettled = false;
    let isEntering = false;
    let enterTimeout = null;
    let entryRaf = null;

    // Physics State Variables
    let isDragging = false;
    let startMouseX = 0;
    let startMouseY = 0;
    let currentDy = 0;
    let currentDx = 0;
    let currentAngle = 0;
    let velY = 0;
    let velX = 0;
    let velAngle = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let animPhysicsId = null;

    // Vector SVG Lanyard Updater (Locks pin center to grommet center)
    function updateLanyard() {
      if (!line || !pin || !grommet || !wrapper) return;
      const pinRect = pin.getBoundingClientRect();
      const grommetRect = grommet.getBoundingClientRect();
      const wrapRect = wrapper.getBoundingClientRect();

      if (wrapRect.width === 0 || pinRect.width === 0) return;

      const x1 = (pinRect.left + pinRect.width / 2) - wrapRect.left;
      const y1 = (pinRect.top + pinRect.height / 2) - wrapRect.top;
      const x2 = (grommetRect.left + grommetRect.width / 2) - wrapRect.left;
      const y2 = (grommetRect.top + grommetRect.height / 2) - wrapRect.top;

      line.setAttribute('x1', x1.toFixed(1));
      line.setAttribute('y1', y1.toFixed(1));
      line.setAttribute('x2', x2.toFixed(1));
      line.setAttribute('y2', y2.toFixed(1));

      if (glow) {
        glow.setAttribute('x1', x1.toFixed(1));
        glow.setAttribute('y1', y1.toFixed(1));
        glow.setAttribute('x2', x2.toFixed(1));
        glow.setAttribute('y2', y2.toFixed(1));
      }
    }

    // Apply Physical Transforms to the Badge Assembly
    function applyTransform(dy, angle, dx) {
      assembly.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) rotate(${angle.toFixed(2)}deg)`;
      updateLanyard();
    }

    function resetTransformStyles() {
      assembly.style.transform = '';
      updateLanyard();
    }

    // Entry Animation Trigger & Continuous Lanyard Tracker
    function triggerEntry() {
      if (reduceMotion) {
        wrapper.classList.add('is-settled');
        card.classList.add('is-settled');
        isSettled = true;
        updateLanyard();
        return;
      }

      isEntering = true;
      wrapper.classList.remove('is-settled');
      card.classList.remove('is-settled');
      wrapper.classList.add('is-entering');

      function trackEntry() {
        if (!isEntering) return;
        updateLanyard();
        entryRaf = requestAnimationFrame(trackEntry);
      }
      if (entryRaf) cancelAnimationFrame(entryRaf);
      entryRaf = requestAnimationFrame(trackEntry);

      clearTimeout(enterTimeout);
      enterTimeout = setTimeout(() => {
        wrapper.classList.remove('is-entering');
        wrapper.classList.add('is-settled');
        card.classList.add('is-settled');
        isEntering = false;
        isSettled = true;
        if (entryRaf) cancelAnimationFrame(entryRaf);
        updateLanyard();
      }, 2200);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!isSettled && !isEntering) {
            triggerEntry();
          } else {
            card.classList.remove('paused');
            updateLanyard();
          }
        } else {
          card.classList.add('paused');
          if (entry.boundingClientRect.top > window.innerHeight * 0.5) {
            clearTimeout(enterTimeout);
            if (entryRaf) cancelAnimationFrame(entryRaf);
            isEntering = false;
            isSettled = false;
            wrapper.classList.remove('is-entering', 'is-settled');
            card.classList.remove('is-settled');
          }
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    observer.observe(track || wrapper);

    // Damped Harmonic 2D Spring Physics Loop
    function runPhysicsLoop() {
      const kY = 0.088;     // Vertical spring stiffness
      const dY = 0.082;     // Vertical damping
      const kX = 0.092;     // Lateral spring stiffness
      const dX = 0.084;     // Lateral damping
      const kAngle = 0.048; // Pendulum restoring torque
      const dAngle = 0.072; // Angular air resistance

      function step() {
        if (isDragging) return;

        // Vertical harmonic spring
        const forceY = -kY * currentDy - dY * velY;
        velY += forceY;
        currentDy += velY;

        // Lateral harmonic spring
        const forceX = -kX * currentDx - dX * velX;
        velX += forceX;
        currentDx += velX;

        // Pendulum angular torque
        const forceAngle = -kAngle * currentAngle - dAngle * velAngle;
        velAngle += forceAngle;
        currentAngle += velAngle;

        applyTransform(currentDy, currentAngle, currentDx);

        // Check if motion settled
        if (Math.abs(currentDy) < 0.2 && Math.abs(velY) < 0.2 &&
            Math.abs(currentDx) < 0.2 && Math.abs(velX) < 0.2 &&
            Math.abs(currentAngle) < 0.15 && Math.abs(velAngle) < 0.15) {
          currentDy = 0; velY = 0;
          currentDx = 0; velX = 0;
          currentAngle = 0; velAngle = 0;
          resetTransformStyles();
          card.classList.remove('is-physics');
          if (isSettled) card.classList.add('is-settled');
          animPhysicsId = null;
          return;
        }

        animPhysicsId = requestAnimationFrame(step);
      }

      if (animPhysicsId) cancelAnimationFrame(animPhysicsId);
      animPhysicsId = requestAnimationFrame(step);
    }

    // Drag Start (Mouse & Touch)
    function onDragStart(clientX, clientY) {
      if (animPhysicsId) {
        cancelAnimationFrame(animPhysicsId);
        animPhysicsId = null;
      }
      isDragging = true;
      startMouseX = clientX;
      startMouseY = clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      card.classList.remove('is-settled');
      card.classList.add('is-physics', 'is-dragging');
      document.body.classList.add('badge-dragging');

      const hint = document.getElementById('hangingDragHint');
      if (hint) hint.classList.add('hide');
    }

    // Drag Move
    function onDragMove(clientX, clientY) {
      if (!isDragging) return;

      const rawDy = clientY - startMouseY;
      const rawDx = clientX - startMouseX;

      // Elastic stretch with pull resistance (downwards up to 160px)
      const maxPull = 160;
      currentDy = rawDy > 0 ? (rawDy * 0.72) / (1 + (rawDy * 0.0028)) : rawDy * 0.22;
      currentDy = Math.max(-15, Math.min(maxPull, currentDy));

      // Lateral pull with smooth resistance (up to 140px)
      const maxSide = 140;
      currentDx = (rawDx * 0.68) / (1 + (Math.abs(rawDx) * 0.003));
      currentDx = Math.max(-maxSide, Math.min(maxSide, currentDx));

      // Natural pendulum angle based on displacement vector
      const effectiveLength = 140 + currentDy;
      currentAngle = Math.atan2(currentDx, effectiveLength) * (180 / Math.PI);
      currentAngle = Math.max(-28, Math.min(28, currentAngle));

      velY = (clientY - prevMouseY) * 0.85;
      velX = (clientX - prevMouseX) * 0.85;
      velAngle = (clientX - prevMouseX) * 0.42;
      prevMouseX = clientX;
      prevMouseY = clientY;

      applyTransform(currentDy, currentAngle, currentDx);
    }

    // Drag End
    function onDragEnd() {
      if (!isDragging) return;
      isDragging = false;
      card.classList.remove('is-dragging');
      document.body.classList.remove('badge-dragging');
      runPhysicsLoop();
    }

    card.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      onDragStart(e.clientX, e.clientY);
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) onDragMove(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) onDragEnd();
    });

    // Touch
    card.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        onDragStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        onDragMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      if (isDragging) onDragEnd();
    });

    // Wobble on mouse sweep
    card.addEventListener('mouseenter', (e) => {
      if (isDragging) return;
      const speed = Math.abs(e.movementX || 0);
      if (speed > 5 && !animPhysicsId) {
        velAngle += (e.movementX > 0 ? 3.5 : -3.5);
        card.classList.remove('is-settled');
        card.classList.add('is-physics');
        runPhysicsLoop();
      }
    });

    // Initial and responsive lanyard alignment
    window.addEventListener('resize', updateLanyard, { passive: true });
    setTimeout(updateLanyard, 80);
    setTimeout(updateLanyard, 400);
    setTimeout(updateLanyard, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
