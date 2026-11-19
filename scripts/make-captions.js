// Builds app/captions.js: 20,000 unique captions made from the base text
//   Use code "UMNZQ2H5" on CrownCards to get a free pack worth up to $1,000!
// Every caption keeps the same offer (a pack worth up to $1,000 on CrownCards) and never contains the word "free"
// and contains {CODE}, which the app replaces with the referral code typed in the box.
// Run: node scripts/make-captions.js
const fs = require('fs');
const path = require('path');

const COUNT = 20000;
const MAX_LEN = 88;             // + an 8-12 letter code stays under YouTube's 100-character title limit

// --- building blocks (all keep the offer exactly: a pack worth UP TO $1,000, never the word "free") ---
const CODE = ['{CODE}', '"{CODE}"'];
const SITE = ['CrownCards', 'Crown Cards'];
const PRIZE = [
  'a pack worth up to $1,000',
  'a pack worth up to $1000',
  'a pack that can be worth up to $1,000',
  'a pack valued at up to $1,000',
  'a pack (worth up to $1,000)',
  'a pack worth as much as $1,000',
  'a bonus pack worth up to $1,000',
  'a welcome pack worth up to $1,000',
  'a bonus pack that can be worth up to $1,000',
  'a welcome pack valued at up to $1,000',
];
const PRIZE_SHORT = [         // used where the sentence starts with the prize
  'A pack worth up to $1,000',
  'Pack worth up to $1,000',
  'A pack that can be worth up to $1,000',
  'Pack valued at up to $1,000',
  'Bonus pack worth up to $1,000',
  'Welcome pack worth up to $1,000',
  'A bonus pack worth up to $1,000',
];
const USE = ['Use code', 'Enter code', 'Apply code', 'Type in code', 'Redeem code', 'Use my code', 'Enter my code', 'Use referral code', 'Enter referral code', 'Grab code'];
const USE_LOW = USE.map(s => s[0].toLowerCase() + s.slice(1));
const ON = ['on', 'at'];
const TO_GET = ['to get', 'to claim', 'to unlock', 'to grab', 'for', 'and get', 'and claim', 'and open'];
const OPEN = ['', '', 'New on CrownCards? ', 'Quick tip: ', 'Heads up: ', 'Pack opening time! ', 'Don\'t miss this: ', 'Card collectors: ', 'Just signed up? ', 'Pro tip: ', 'Try your luck: ', 'Opening packs? '];
const END = ['!', '!', '!!', ' 🔥', '! 🔥', ' 🎁', '! 🎁', ' 👑', '! 👑', ' ✅', '! ✨', ' 🃏', '.'];
const WANT = ['Want', 'Looking for', 'Who wants', 'Ready for', 'Up for', 'Want to open'];
const CTA = ['', ' and start opening', ' and good luck', ' and rip it open', ' and see what you pull', ' right now', ' today'];

// --- sentence patterns ---
const patterns = [
  // "Use code X on CrownCards to get a pack worth up to $1,000!"
  () => `${pick(OPEN)}${pick(USE)} ${pick(CODE)} ${pick(ON)} ${pick(SITE)} ${pick(TO_GET)} ${pick(PRIZE)}${pick(END)}`,
  // "Get a pack worth up to $1,000 on CrownCards with code X!"
  () => `${pick(['Get', 'Claim', 'Grab', 'Unlock', 'Open'])} ${pick(PRIZE)} ${pick(ON)} ${pick(SITE)} with ${pick(['code', 'my code', 'referral code', 'the code'])} ${pick(CODE)}${pick(END)}`,
  // "Want a pack worth up to $1,000? Use code X on CrownCards!"
  () => `${pick(WANT)} ${pick(PRIZE)}? ${pick(USE)} ${pick(CODE)} ${pick(ON)} ${pick(SITE)}${pick(CTA)}${pick(END)}`,
  // "Pack worth up to $1,000 on CrownCards — use code X!"
  () => `${pick(PRIZE_SHORT)} ${pick(ON)} ${pick(SITE)} ${pick(['—', '-', '|', '👉'])} ${pick(USE_LOW)} ${pick(CODE)}${pick(END)}`,
  // "CrownCards code X = a pack worth up to $1,000!"
  () => `${pick(SITE)} ${pick(['code', 'referral code', 'promo code'])} ${pick(CODE)} ${pick(['=', 'gets you', 'gives you', 'unlocks', '→'])} ${pick(PRIZE)}${pick(END)}`,
  // "Sign up on CrownCards with code X and get a pack worth up to $1,000!"
  () => `${pick(['Sign up on', 'Sign up at', 'Join', 'Register on', 'Register at', 'Create an account on'])} ${pick(SITE)} ${pick(['with code', 'using code', 'with my code', 'using referral code'])} ${pick(CODE)} ${pick(['and get', 'to get', 'for', 'and claim', 'and unlock'])} ${pick(PRIZE)}${pick(END)}`,
  // "Code X on CrownCards gets you a pack worth up to $1,000!"
  () => `${pick(['Code', 'My code', 'Referral code'])} ${pick(CODE)} ${pick(ON)} ${pick(SITE)} ${pick(['gets you', 'gives you', 'unlocks', '='])} ${pick(PRIZE)}${pick(END)}`,
];

// --- seeded random so the list is the same every build ---
let seed = 0x5eed1234;
function rnd() { seed = (seed + 0x6D2B79F5) | 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
function pick(a) { return a[Math.floor(rnd() * a.length)]; }

const tidy = s => s.replace(/\s+/g, ' ').replace(/\s+([!?.,])/g, '$1').trim();
const seen = new Set();
const out = [];
let tries = 0;
while (out.length < COUNT && tries < 5e6) {
  tries++;
  const s = tidy(patterns[out.length % patterns.length]());        // spread evenly over all patterns
  if (s.length > MAX_LEN || seen.has(s.toLowerCase())) continue;
  if (/free/i.test(s)) throw new Error('caption contains "free": ' + s);
  if (!s.includes('{CODE}') || !/up to \$1,?000|as much as \$1,000/.test(s) || !/Crown ?Cards/.test(s)) throw new Error('bad caption: ' + s);
  seen.add(s.toLowerCase());
  out.push(s);
}
if (out.length < COUNT) throw new Error(`only ${out.length} unique captions could be made`);
for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }

const file = path.join(__dirname, '..', 'app', 'captions.js');
fs.writeFileSync(file, '// Generated by scripts/make-captions.js. {CODE} is replaced with the referral code.\nwindow.CAPTIONS = ' + JSON.stringify(out) + ';\nwindow.CAPTIONS_ID = ' + JSON.stringify(require('crypto').createHash('sha1').update(out.join('\n')).digest('hex').slice(0, 10)) + ';\n');
console.log(`Wrote ${out.length} captions to app/captions.js (${tries} tries). Samples:`);
for (const s of out.slice(0, 12)) console.log('  ' + s.replace(/\{CODE\}/g, 'UMNZQ2H5'));
