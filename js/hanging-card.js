/**
 * HANGING PROFILE CARD RIGHT-SIDE ENTRY & PENDULUM ENGINE
 * Mahabbah Mahabban Romadhon — Suspended Identity Badge Motion
 * 
 * Mechanics:
 * 1. Starts positioned outside the right edge of the screen.
 * 2. Slides smoothly in from the RIGHT on scroll: translateX(100vw) -> overshoot -> settle.
 * 3. Subtle momentum tilt on entry: +4deg -> -2.5deg -> +1deg -> 0deg.
 * 4. Suspended from top cord and metallic grommet attachment (transform-origin: top center).
 * 5. Once settled: very gentle continuous breeze swing (-0.5deg to +0.5deg, duration 5.2s).
 * 6. Smooth re-entry if scrolled completely away and back.
 * 7. Pauses animation when off-screen to conserve CPU/battery.
 * 8. Zero horizontal page overflow guaranteed.
 */
(function() {
  function initHangingCard() {
    const track = document.getElementById('hangingCardTrack');
    const wrapper = document.getElementById('hangingCardWrapper');
    const card = document.getElementById('hangingProfileCard');
    if (!wrapper || !card) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let isEntering = false;
    let enterTimeout = null;

    function triggerEntry() {
      if (reduceMotion) {
        wrapper.classList.add('is-settled');
        card.classList.add('is-settled');
        return;
      }

      isEntering = true;
      wrapper.classList.remove('is-settled');
      card.classList.remove('is-settled');
      wrapper.classList.add('is-entering');

      // Entry momentum sequence completes in ~2.2s, then transition to gentle hanging breeze
      clearTimeout(enterTimeout);
      enterTimeout = setTimeout(() => {
        wrapper.classList.remove('is-entering');
        wrapper.classList.add('is-settled');
        card.classList.add('is-settled');
        isEntering = false;
      }, 2200);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!wrapper.classList.contains('is-settled') && !isEntering) {
            triggerEntry();
          } else {
            card.classList.remove('paused');
          }
        } else {
          card.classList.add('paused');

          // If user scrolled completely back up above the section, allow smooth re-entry
          if (entry.boundingClientRect.top > window.innerHeight * 0.5) {
            clearTimeout(enterTimeout);
            isEntering = false;
            wrapper.classList.remove('is-entering', 'is-settled');
            card.classList.remove('is-settled');
          }
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    observer.observe(track || wrapper);

    // Desktop subtle interactive mouse hover tilt
    card.addEventListener('mousemove', (e) => {
      if (reduceMotion || !card.classList.contains('is-settled')) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const tilt = x * 2.8; // subtle +/- 1.4deg
      card.style.setProperty('--hover-tilt', `${tilt}deg`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--hover-tilt');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHangingCard);
  } else {
    initHangingCard();
  }
})();
