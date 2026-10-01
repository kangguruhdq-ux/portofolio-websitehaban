const fs = require('fs');
const html = fs.readFileSync('_legacy/index.html', 'utf8');

function findCss(selector) {
  const reg = new RegExp(selector + '[^{]*\\{[^}]*\\}', 'g');
  const matches = [...html.matchAll(reg)];
  console.log('Matches for', selector, ':', matches.length);
  matches.forEach(m => console.log(m[0]));
}

findCss('nav-wrapper');
findCss('at-galaxy-gateway');
findCss('galaxy-gateway');
findCss('galaxy-title');
findCss('galaxy-sub-caption');
findCss('galaxy-scroll-cue');
