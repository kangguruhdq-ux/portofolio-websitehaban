const fs = require('fs');
const html = fs.readFileSync('_legacy/index.html', 'utf8');

const habanIdx = html.indexOf('HABAN');
console.log('habanIdx:', habanIdx);
if (habanIdx !== -1) {
  console.log(html.slice(Math.max(0, habanIdx - 300), habanIdx + 1200));
}

// Search for navbar scroll behavior
const navMatches = [...html.matchAll(/(?:nav|navbar|scroll)[\s\S]{0,100}(?:transform|opacity|translate|hidden|visible)/gi)];
console.log('Nav matches count:', navMatches.length);

