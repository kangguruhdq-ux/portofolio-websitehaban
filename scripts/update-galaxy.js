const fs = require('fs');
let content = fs.readFileSync('src/components/galaxy-gateway.tsx', 'utf8').replace(/\r\n/g, '\n');

const hudIndex = content.indexOf('{/* Galaxy HUD Overlay Layer */}');
console.log('hudIndex:', hudIndex);
const endIndex = content.lastIndexOf('</div>\n    </div>\n  );');
console.log('endIndex:', endIndex);

const replacement = `{/* Galaxy HUD Overlay Layer */}
      <div
        style={{
          opacity: fadeOpacity,
          pointerEvents: fadeOpacity < 0.05 ? 'none' : 'auto',
        }}
        className="absolute inset-0 z-[3] w-full h-full pointer-events-none select-none transition-opacity duration-200"
      >
        {/* Top Eyebrow Coordinates */}
        <div className="absolute top-[8%] sm:top-[7%] w-full px-6 text-center">
          <div className="inline-flex items-center gap-2 font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-[#a8b8d0] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#afd7f7] shadow-[0_0_10px_#9ac9ff]" />
            <span>ASTRA // COSMIC GATEWAY 3.0 · [7.7956° S, 110.3695° E]</span>
          </div>
        </div>

        {/* Edge Titles: HABAN on left, PORTOFOLIO on right */}
        <div
          className="absolute top-[48%] -translate-y-1/2 left-0 w-full flex items-center justify-between px-6 sm:px-12 md:px-20 lg:px-28 pointer-events-none"
        >
          <a
            href="#heroSection"
            onClick={handleScrollToHero}
            style={{
              transform: \`translateX(-\${shiftY * 0.8}px)\`,
            }}
            className="pointer-events-auto text-[32px] sm:text-[54px] md:text-[68px] lg:text-[84px] font-medium tracking-[-0.045em] text-[#edf3ff] hover:text-white transition-all duration-300 drop-shadow-[0_2px_28px_#030813] hover:drop-shadow-[0_0_24px_rgba(168,207,255,0.6)] cursor-pointer"
            aria-label="Haban — Jelajahi Portofolio"
          >
            HABAN
          </a>

          {/* Central subtle singularity point */}
          <div className="w-1 h-1 rounded-full bg-cyan-400/30 blur-[1px] pointer-events-none" aria-hidden="true" />

          <a
            href="#heroSection"
            onClick={handleScrollToHero}
            style={{
              transform: \`translateX(\${shiftY * 0.8}px)\`,
            }}
            className="pointer-events-auto text-[32px] sm:text-[54px] md:text-[68px] lg:text-[84px] font-medium tracking-[-0.045em] text-[#edf3ff] hover:text-white transition-all duration-300 drop-shadow-[0_2px_28px_#030813] hover:drop-shadow-[0_0_24px_rgba(168,207,255,0.6)] cursor-pointer"
            aria-label="Portofolio — Jelajahi Portofolio"
          >
            PORTOFOLIO
          </a>
        </div>

        {/* Sub-caption below Galaxy */}
        <div className="absolute bottom-[20%] sm:bottom-[21%] left-1/2 -translate-x-1/2 w-[90%] max-w-[720px] text-center pointer-events-none">
          <div className="font-mono text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.22em] text-[#b0bfd5] uppercase font-light leading-relaxed">
            MACHINE LEARNING · FULL-STACK WEB & APP · CYBER SECURITY
          </div>
        </div>

        {/* Scroll Cue Pill Button */}
        <div className="absolute bottom-[8%] sm:bottom-[9%] left-1/2 -translate-x-1/2 pointer-events-auto">
          <a
            href="#heroSection"
            onClick={handleScrollToHero}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[#aecfff]/25 hover:border-[#aecfff]/60 bg-[#101a2b]/60 hover:bg-[#1d304b]/80 backdrop-blur-md text-[#edf3ff] font-mono text-[10px] sm:text-[11px] font-medium tracking-[0.18em] transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.4)] group cursor-pointer"
          >
            <span>JELAJAHI PORTOFOLIO</span>
            <svg
              className="w-3.5 h-3.5 text-[#afd7f7] group-hover:translate-y-1 transition-transform animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>

        {/* Bottom Interaction Hint */}
        <div className="absolute bottom-[2%] sm:bottom-[2.5%] w-full text-center pointer-events-none">
          <span className="font-mono text-[8px] sm:text-[8.5px] tracking-[0.2em] text-[#718099] uppercase">
            DRAG UNTUK MEMUTAR · SCROLL UNTUK MASUK
          </span>
        </div>

        {/* Bottom Right Floating Terminal Trigger */}
        <button
          type="button"
          onClick={() => {
            const term = document.getElementById('terminalDrawer');
            if (term) term.classList.toggle('hidden');
          }}
          className="pointer-events-auto absolute bottom-5 right-5 sm:bottom-8 sm:right-8 w-10 h-10 rounded-full bg-[#0d1424]/80 border border-cyan-400/40 hover:border-cyan-400 text-cyan-400 flex items-center justify-center backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:scale-110 transition-all cursor-pointer group"
          title="Buka Terminal Interaktif"
          aria-label="Buka Terminal"
        >
          <span className="font-mono text-xs font-bold group-hover:animate-pulse">{'>_'}</span>
        </button>
      </div>`;

if (hudIndex !== -1 && endIndex !== -1) {
  const updated = content.slice(0, hudIndex) + replacement + '\n    </div>\n  );\n}\n';
  fs.writeFileSync('src/components/galaxy-gateway.tsx', updated, 'utf8');
  console.log('Galaxy gateway updated successfully!');
} else {
  console.log('Indices not found:', hudIndex, endIndex);
}
