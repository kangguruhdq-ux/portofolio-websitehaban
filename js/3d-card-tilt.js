/**
 * INTERACTIVE 3D CARD TILT & SPECULAR GLARE ENGINE
 * Mahabbah Mahabban Romadhon — Sci-Fi Holographic Depth System
 * 
 * Features:
 * 1. Smooth 60fps 3D card tilt based on mouse coordinates.
 * 2. Specular light glare overlay responding dynamically to cursor position.
 * 3. Multi-layer 3D depth pop for child elements (badges, logos, action buttons).
 * 4. Spring relaxation on mouse leave.
 * 5. Respects prefers-reduced-motion and passive touch for mobile safety.
 */
(function() {
  function init3DCardTilt() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      // Mobile touch devices: skip mouse tilt to prevent stutter during scrolling
      return;
    }

    const selectors = [
      '.work-flagship',
      '.lab-item',
      '.tech-card',
      '.cert-card',
      '.editorial-timeline-card',
      '.term-card',
      '.skill-card',
      '.telemetry-card',
      '.find-me-card'
    ];

    const cards = document.querySelectorAll(selectors.join(', '));

    cards.forEach(card => {
      card.classList.add('tilt-card-ready');

      // Create specular glare overlay if not present
      let glare = card.querySelector('.tilt-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'tilt-glare';
        card.appendChild(glare);
      }

      let bounds;
      let mouseX = 0, mouseY = 0;
      let isHovered = false;
      let rafId = null;

      function updateTilt() {
        if (!isHovered) return;

        const hw = bounds.width / 2;
        const hh = bounds.height / 2;
        const x = (mouseX - bounds.left - hw) / hw; // -1 to +1
        const y = (mouseY - bounds.top - hh) / hh;  // -1 to +1

        // Max tilt angles: 12 degrees on small cards, 7.5 degrees on large flagship cards
        const isLarge = bounds.width > 420;
        const maxTilt = isLarge ? 7.5 : 12.0;

        const rotX = (-y * maxTilt).toFixed(2);
        const rotY = (x * maxTilt).toFixed(2);

        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px) scale3d(1.02, 1.02, 1.02)`;

        // Update glare lighting position & opacity
        const glareX = ((x + 1) / 2 * 100).toFixed(1);
        const glareY = ((y + 1) / 2 * 100).toFixed(1);
        const glareAngle = Math.atan2(y, x) * (180 / Math.PI) + 90;

        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(0, 240, 255, 0.16) 0%, rgba(139, 92, 246, 0.08) 40%, transparent 75%)`;
        glare.style.opacity = '1';

        rafId = requestAnimationFrame(updateTilt);
      }

      card.addEventListener('mouseenter', (e) => {
        bounds = card.getBoundingClientRect();
        isHovered = true;
        mouseX = e.clientX;
        mouseY = e.clientY;
        card.style.transition = 'transform 0.15s ease-out, box-shadow 0.25s ease';
        card.style.zIndex = '5';
        card.style.boxShadow = '0 24px 48px rgba(0, 0, 0, 0.5), 0 0 24px rgba(0, 240, 255, 0.18)';
        if (!rafId) rafId = requestAnimationFrame(updateTilt);
      });

      card.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        isHovered = false;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)';
        card.style.zIndex = '';
        card.style.boxShadow = '';
        if (glare) glare.style.opacity = '0';
      });
    });
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', init3DCardTilt);
  } else {
    init3DCardTilt();
  }
})();
