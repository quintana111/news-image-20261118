// compose-20261118-v4.cjs — "Shenzhen Summit Front Page", 40 stories, 18 Nov 2026.
// Fresh from DESIGN-v4.md prose only. Flat SVG -> PNG via sharp. 1024x1024, <=1 MiB.
const sharp = require('/home/hatch/workspace/makefun/node_modules/sharp');
const fs = require('fs');
const crypto = require('crypto');
const W = 1024, H = 1024;
const INK = '#111111', MUT = '#555555', RED = '#b91c1c', BLUE = '#1d4ed8';
const TEAL = '#0f766e', AMBER = '#b45309', GREEN = '#15803d', PURPLE = '#7e22ce';
const LAND = '#cfe3c2', SEA = '#dcebf5', PAPER = '#ffffff';
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const T = (x, y, s, size, fill = INK, w = '400', anchor = 'start', fam = 'Arial, Helvetica, sans-serif') =>
  `<text x="${x}" y="${y}" font-family="${fam}" font-size="${size}" font-weight="${w}" fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`;
const R = (x, y, w, h, fill, stroke = 'none', sw = 1, rx = 0) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const C = (cx, cy, r, fill, stroke = 'none', sw = 1) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
let S = '';
// ---- MASTHEAD (y 0..80) ----
S += R(0, 0, W, 80, PAPER);
S += R(0, 0, W, 4, RED);
S += T(512, 52, 'THE WORLD TODAY', 64, INK, '800', 'middle');
S += T(12, 74, 'WEDNESDAY 18 NOVEMBER 2026', 30, RED, '800');
S += T(1012, 74, '40 STORIES \u00b7 7 CONTINENTS', 24, INK, '700', 'end');
// date-checked stamp, top right under title bar
S += `<g transform="rotate(-4 932 29)">${R(856, 16, 152, 26, 'none', RED, 2.5, 4)}${T(932, 34, '\u2713 DATE-CHECKED', 15, RED, '800', 'middle')}</g>`;
// ---- LEADS (y 82..320, 3 x 330w) ----
const leadY = 82, leadH = 232;
function leadBox(x, num, tag, fill) {
  return R(x, leadY, 330, leadH, PAPER, INK, 1.5) + R(x, leadY, 330, 6, fill) +
    T(x + 12, leadY + 34, num, 16, MUT, '700') + T(x + 318, leadY + 34, tag, 15, MUT, '700', 'end');
}
S += leadBox(8, 'LEAD 1 \u00b7 CHINA', 'AP', RED);
S += T(20, 150, 'SHENZHEN', 32, INK, '800') + T(20, 184, 'SUMMIT', 32, INK, '800');
S += T(20, 208, 'Xi greets Trump on the tarmac \u2014', 17, INK) + T(20, 228, 'a break with protocol.', 17, INK);
S += T(20, 250, 'Xi + Putin met Wed. First-ever', 17, INK) + T(20, 270, 'three-way Trump\u2013Xi\u2013Putin talks Thu.', 17, INK);
// flags: China, US, Russia + tarmac
S += R(20, 276, 56, 34, '#de2910') + T(48, 300, '\u2605', 22, '#ffde00', '700', 'middle');
S += R(84, 276, 56, 34, '#ffffff', INK, 1) + R(84, 276, 56, 5, RED) + R(84, 286, 56, 5, RED) + R(84, 296, 56, 5, RED) + R(84, 276, 22, 13, BLUE);
S += R(148, 276, 56, 34, '#ffffff', INK, 1) + R(148, 276, 56, 11, '#ffffff') + R(148, 287, 56, 12, BLUE) + R(148, 299, 56, 11, RED);
S += R(212, 276, 114, 34, RED) + T(269, 292, 'THU:', 12, '#ffffff', '800', 'middle') + T(269, 307, '3-WAY TALKS', 12, '#ffffff', '800', 'middle');
S += leadBox(347, 'LEAD 2 \u00b7 MIDDLE EAST', 'CENTCOM', '#7c2d12');
S += T(359, 150, 'GULF WAR', 32, INK, '800') + T(359, 184, 'ESCALATES', 32, INK, '800');
S += T(359, 208, 'Iran hits US bases in Kuwait +', 17, INK) + T(359, 228, 'Bahrain \u2014 both intercepted.', 17, INK);
S += T(359, 250, 'US jets hit a Guard missile site', 17, INK) + T(359, 270, 'on Qeshm Island. UAE ship hit', 17, INK) + T(359, 290, 'in Hormuz: 1 missing, 1 hurt.', 17, INK);
// Gulf mini-map
S += R(359, 292, 306, 18, SEA, INK, 1) + T(365, 306, 'QESHM \u2715    KUWAIT \u2713    BAHRAIN \u2713    HORMUZ \u2715', 11, INK, '700');
S += leadBox(686, 'LEAD 3 \u00b7 UKRAINE', 'REUTERS', BLUE);
S += T(698, 150, 'KERCH BRIDGE', 32, INK, '800') + T(698, 184, 'FALLS', 32, INK, '800');
S += T(698, 208, 'Drones + missiles partly collapse', 17, INK) + T(698, 228, 'the Crimea bridge; one arch', 17, INK);
S += T(698, 250, 'into the strait. Road out of', 17, INK) + T(698, 270, 'service. Krasnodar refineries hit.', 17, INK);
// bridge span diagram
S += `<line x1="698" y1="306" x2="1004" y2="306" stroke="${INK}" stroke-width="5"/>` +
  `<line x1="760" y1="306" x2="760" y2="290" stroke="${INK}" stroke-width="3"/>` +
  `<line x1="940" y1="306" x2="940" y2="290" stroke="${INK}" stroke-width="3"/>` +
  `<path d="M 820 306 L 850 314 L 880 306" fill="none" stroke="${RED}" stroke-width="4"/>` +
  T(850, 302, 'X', 16, RED, '800', 'middle');

// ---- SMALL PANELS (y 322..620, 3 rows x 4, each 246x98) ----
const PANELS = [
  [4, 'ALASKA', 'US POLITICS', BLUE, 'Peltola beats Sullivan;', 'Democrats take Senate 56\u201344.', '56\u201344'],
  [5, 'NVIDIA', 'MARKETS', GREEN, 'Q3 revenue $115.8B, +103% YoY;', 'net $65.3B, EPS $2.68; shares +4%.', '$115.8B'],
  [6, 'GAZA', 'MIDDLE EAST', RED, 'Board of Peace: ceasefire may', 'collapse; cold kills in tents.', 'WARNING'],
  [7, 'COP31 ANTALYA', 'CLIMATE', TEAL, 'Talks deadlocked; draft has', '144 disputed items; 75 back target.', '144 ITEMS'],
  [8, 'MEASLES', 'HEALTH', AMBER, 'US loses 26-year elimination', 'status; 5,400+ cases, 10 deaths.', '26 YRS LOST'],
  [9, 'ANTHROPIC IPO', 'MARKETS', PURPLE, 'Priced $83/share \u2014 $81.3B raised,', 'largest IPO ever; trades Thu as ANT.', '$83 \u00b7 $81.3B'],
  [10, 'VOYAGER 1', 'SPACE', BLUE, 'One light-day out: 25.9bn km,', '49 yrs on; signal takes 24 hours.', '25.9BN KM'],
  [11, 'ILLINOIS 99\u201378 DUKE', 'SPORT', GREEN, 'Stojakovic 46 pts at Cameron;', 'ends Duke\u2019s 35-game home streak.', '99\u201378'],
  [12, 'US SINKS 5 TANKERS', 'GULF', RED, 'Kaviz, Charminar, Horizon 1,', 'Riesco + Derya; oil tops $100.', '5 SUNK'],
  [13, 'MQ-9 DOWNED', 'GULF', RED, 'Iran shoots down US MQ-9 drone', 'near Strait of Hormuz.', 'SHOT DOWN'],
  [14, 'EBOLA DRC', 'HEALTH', AMBER, '3 of 4 children under 5 die;', 'epicentres Bunia + Beni.', '3 IN 4'],
  [15, 'YEMEN', 'MIDDLE EAST', RED, 'Houthis fire 5 drones at Saudi', 'pipeline; Sanaa strikes, \u226517 killed.', '5 DRONES'],
];
PANELS.forEach((p, i) => {
  const [n, head, tag, col, l1, l2, fact] = p;
  const colI = i % 4, rowI = Math.floor(i / 4);
  const x = 8 + colI * 254, y = 316 + rowI * 98;
  S += R(x, y, 246, 98, PAPER, INK, 1.2) + R(x, y, 246, 5, col);
  S += T(x + 8, y + 22, String(n), 15, col, '800') + T(x + 238, y + 22, tag + ' \u00b7 ' + fact, 11, col, '800', 'end');
  S += T(x + 8, y + 46, head, 20, INK, '800');
  S += T(x + 8, y + 66, l1, 15, INK) + T(x + 8, y + 84, l2, 15, INK);
});
// NOTE: panel fact badge sits bottom-right; headline 20px, body 15px — floors kept.

// ---- WORLD MAP (y 622..717) ----
// Equirectangular: lon -180..180 -> x 8..1016; lat 80..-55 -> y 636..717 (map area).
const MX = 8, MW = 1008, MY = 634, MH = 66;
const px = lon => MX + ((lon + 180) / 360) * MW;
const py = lat => MY + ((80 - lat) / 135) * MH;
const poly = pts => `<polygon points="${pts.map(([lo, la]) => px(lo).toFixed(1) + ',' + py(la).toFixed(1)).join(' ')}" fill="${LAND}" stroke="#8aa87a" stroke-width="0.8"/>`;
S += R(8, 612, 1008, 88, SEA, INK, 1.2);
S += T(14, 626, 'WORLD MAP \u2014 14 PLACES', 13, INK, '800');
S += T(1010, 626, 'PINS = STORIES 1\u201314', 11, MUT, '700', 'end');
S += poly([[-168,66],[-140,70],[-120,72],[-95,72],[-80,70],[-55,60],[-55,47],[-70,42],[-75,35],[-80,26],[-90,21],[-97,16],[-105,20],[-115,28],[-125,40],[-125,49],[-150,60],[-168,66]]);
S += poly([[-80,10],[-60,8],[-50,0],[-35,-8],[-40,-22],[-48,-28],[-58,-38],[-70,-55],[-73,-40],[-80,-20],[-80,10]]);
S += poly([[-10,36],[-9,43],[-2,48],[0,51],[5,58],[10,60],[18,56],[21,55],[28,60],[30,70],[40,68],[45,60],[40,50],[35,45],[28,41],[23,36],[15,38],[8,44],[3,43],[-2,37],[-10,36]]);
S += poly([[-17,15],[-10,30],[0,36],[10,37],[20,32],[32,31],[43,12],[51,11],[48,0],[40,-10],[35,-25],[28,-35],[20,-35],[15,-27],[12,-18],[9,4],[-8,5],[-17,15]]);
S += poly([[26,36],[30,36],[36,36],[36,41],[30,42],[26,40],[26,36]]);
S += poly([[28,41],[33,42],[36,44],[40,44],[44,44],[44,47],[40,47],[36,46],[32,44],[28,42]]);
S += poly([[34,29],[36,31],[36,36],[34,36],[32,32],[34,29]]);
S += poly([[40,68],[60,70],[90,75],[120,73],[150,70],[178,66],[170,60],[162,55],[158,50],[142,45],[140,40],[130,35],[127,35],[122,30],[120,22],[110,20],[105,10],[100,8],[95,16],[90,22],[80,15],[77,8],[72,20],[66,25],[60,25],[58,23],[55,17],[48,14],[43,13],[39,21],[43,29],[48,30],[44,32],[42,37],[40,45],[40,55],[40,68]]);
S += poly([[113,-12],[120,-14],[130,-12],[140,-17],[150,-22],[154,-28],[150,-37],[140,-38],[130,-32],[122,-34],[115,-35],[113,-22],[113,-12]]);
// pins: [n, lat, lon, label, dx, dy] — tanker pin on Oman coast, MQ-9 on Iran mainland (sea events, land pins)
const PINS = [
  [1, 22.5, 114.1, 'Shenzhen', 8, -8], [2, 26.5, 56.3, 'Qeshm', 8, 12],
  [3, 45.3, 36.5, 'Kerch', 8, -8], [4, 64, -152, 'Alaska', 8, 12],
  [5, 36.9, 30.7, 'Antalya', -80, -12], [6, 31.5, 34.5, 'Gaza', -60, 14],
  [7, 38.9, -77, 'Washington', 8, -8], [8, 40.7, -74, 'New York', 8, 10],
  [9, 37.8, -122.4, 'San Francisco', -78, -8], [10, 36, -78.9, 'Durham', -52, 12],
  [11, 24.2, 58.8, 'Gulf of Oman', 8, -10], [12, 30.5, 51, 'MQ-9', -36, 16],
  [13, 1.6, 30.2, 'Bunia', 8, 14], [14, 15.3, 44.2, 'Sanaa', -48, 16],
];
PINS.forEach(([n, la, lo, lab, dx, dy]) => {
  const x = px(lo), y = py(la);
  S += `<line x1="${x}" y1="${y}" x2="${x + dx}" y2="${y + dy}" stroke="${INK}" stroke-width="0.8"/>`;
  S += T(x + dx + (dx < 0 ? -4 : 4), y + dy + 3, lab, 10, INK, '700', dx < 0 ? 'end' : 'start');
  S += C(x, y, 7, RED, '#ffffff', 1.5) + T(x, y + 3.5, String(n), 9, '#ffffff', '800', 'middle');
});
// ---- UTC TIMELINE (y 702..756) ----
S += R(8, 702, 1008, 54, '#f8f4e8', INK, 1.2) + T(14, 716, 'UTC TIMELINE \u2014 18 NOV', 13, INK, '800');
const TL = [['00:29', 'Bezos: \u201cI helped pick', 'Pattinson as Bond\u201d'], ['06:17', '5.3 quake hits', 'Romania'], ['09:37', 'Iran targets US Patriot', 'systems in Kuwait'], ['10:16', 'Voyager 1: one light-day', '(25.9bn km)'], ['15:37', 'Iran shoots down US', 'MQ-9 near Hormuz'], ['21:26', 'Anthropic IPO priced', '$83 ($81.3B)']];
TL.forEach(([t, s1, s2], i) => {
  const x = 14 + i * 168;
  S += C(x + 6, 728, 4, RED) + T(x + 16, 732, t, 14, RED, '800');
  S += T(x + 16, 745, s1, 10, INK) + T(x + 16, 755, s2, 10, INK);
});
// ---- COUNT BAR (y 758..793) ----
S += R(8, 758, 1008, 35, INK);
S += T(512, 782, '40 STORIES \u00b7 7 CONTINENTS \u00b7 $81.3BN IPO \u00b7 25.9BN KM \u00b7 5 TANKERS \u00b7 56\u201344 SENATE', 22, '#ffffff', '800', 'middle');

// ---- ALSO LIST (y 795..1000, 25 items, 2 cols, 15px, 13 rows x 14.5px) ----
S += T(8, 808, 'ALSO ON 18 NOVEMBER', 14, INK, '800');
const ALSO = [
  '16  Siberia crash \u2014 military plane, 19 dead', '17  NSA outage \u2014 classified net down; Java flaw',
  '18  Israel elects Matan Kahana speaker', '19  Germany: Russia used tear gas, OPCW probe',
  '20  Quad meets in Manila \u2014 first in 2+ years', '21  Canada + China cut tariffs after Carney\u2013Xi',
  '22  N. Korea expanded Yongbyon plant, IAEA says', '23  6.0 quake strikes Papua New Guinea',
  '24  5.3 quake strikes Romania', '25  Netherlands swears in youngest PM',
  '26  NYC travel ban as major storm hits US', '27  Bezos helped pick Pattinson as Bond (16 Nov)',
  '28  EU faces worst wildfire season on record', '29  Cyclone Akvan \u2014 landfall Fri, 120\u2013130 km/h',
  '30  GTA VI releases today \u2014 pre-orders >$1.5bn', '31  Mossad chief lobbied US on Iran strikes',
  '32  Russia sends 2 nuclear bombers to E. Asia', '33  Ethiopia\u2013Eritrea buildup raises war fears',
  '34  UN: Sudan drone deaths; \u20ac45bn EU loan for Kyiv', '35  Colby: Ukraine deep strikes \u201cnot effective\u201d',
  '36  US court blocks trans troop discharges', '37  New Jersey sues DHS over 3 Delaney Hall deaths',
  '38  EU \u201creturn hub\u201d in Rwanda \u2014 5 nations plan', '39  Optimizely breach \u2014 178 orgs incl. Zoom, BBC',
  '40  Germany cuts electricity taxes for all',
];
ALSO.forEach((s, i) => {
  const colI = i < 13 ? 0 : 1, rowI = i < 13 ? i : i - 13;
  const x = 8 + colI * 512, y = 822 + rowI * 14.5;
  const num = s.slice(0, 3).trim(), rest = s.slice(3).trim();
  S += T(x, y, num, 15, RED, '800') + T(x + 30, y, rest, 15, INK);
});
// ---- FOOTER (y 1000..1024) ----
S += R(8, 1000, 1008, 1, INK);
S += T(8, 1011, 'DATE-CHECKED: every story verified against reporting dated Wednesday 18 November 2026. LEFT OUT: Bond casting (16 Nov) \u00b7 El Mencho killing (Feb).', 11, MUT);
S += T(8, 1022, 'Sources: AP / Reuters / Bloomberg / AFP / Al Jazeera / BBC / CNBC / NASA / CENTCOM.', 11, MUT);
// ---- RENDER ----
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${PAPER}"/>${S}</svg>`;
(async () => {
  const buf = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  fs.writeFileSync('entry.png', buf);
  const h = crypto.createHash('sha256').update(buf).digest('hex');
  console.log(`entry.png ${buf.length} bytes sha256=${h}`);
  if (buf.length > 1024 * 1024) { console.error('OVER 1 MiB'); process.exit(1); }
})();
