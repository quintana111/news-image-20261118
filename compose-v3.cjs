'use strict';
const fs = require('fs'), crypto = require('crypto');
const sharp = require('/home/hatch/workspace/makefun/node_modules/sharp');
const W = 1024, H = 1024;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const T = (x, y, s, sz, fill, wt, an) => `<text x="${x}" y="${y}" font-family="DejaVu Sans, Arial, sans-serif" font-size="${sz}" font-weight="${wt || 400}" fill="${fill}" text-anchor="${an || 'start'}">${esc(s)}</text>`;
const R = (x, y, w, h, fill, rx) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx || 0}" fill="${fill}"/>`;
const INK = '#141414', RED = '#c0392b', BLUE = '#2471a3', GREEN = '#1e8449', ORANGE = '#d35400';
const NA = [[-168, 66], [-140, 70], [-120, 72], [-100, 73], [-85, 74], [-75, 72], [-65, 62], [-55, 50], [-60, 45], [-70, 42], [-76, 35], [-81, 26], [-84, 30], [-90, 29], [-97, 26], [-97, 17], [-90, 14], [-83, 9], [-79, 9], [-85, 12], [-92, 16], [-97, 16], [-105, 20], [-112, 27], [-117, 33], [-123.5, 38], [-124, 40], [-124, 48], [-132, 55], [-142, 60], [-155, 58], [-166, 61]];
const SA = [[-79, 9], [-72, 11], [-62, 10], [-52, 5], [-50, 0], [-44, -3], [-35, -8], [-39, -15], [-41, -22], [-48, -27], [-53, -33], [-58, -38], [-65, -42], [-68, -50], [-70, -54], [-73, -50], [-73, -40], [-72, -30], [-70, -18], [-77, -12], [-81, -5], [-80, 2]];
const EU = [[-10, 36], [-9, 43], [-2, 48], [2, 51], [8, 54], [8, 58], [12, 56], [18, 56], [21, 55], [24, 58], [28, 60], [30, 63], [26, 68], [22, 70], [18, 69], [12, 65], [6, 62], [5, 58], [10, 59], [14, 57], [18, 56], [21, 55], [25, 54], [30, 53], [34, 51], [38, 50], [40, 48], [38, 46], [36, 44.6], [33, 44.8], [30, 45.5], [28, 45], [26, 44], [24, 42], [23, 40], [21, 39], [19, 42], [16, 44], [14, 45], [12, 44], [8, 44], [4, 43], [2, 41], [0, 39], [-2, 37], [-6, 36], [-9, 37]];
const AF = [[-17, 15], [-16, 21], [-11, 27], [-6, 32], [0, 36], [10, 37], [19, 33], [30, 31], [32, 31], [34, 28], [37, 22], [39, 18], [43, 12], [48, 11], [51, 12], [46, 6], [41, 2], [40, -4], [37, -8], [35, -14], [33, -20], [32, -26], [28, -33], [20, -35], [16, -29], [13, -19], [12, -12], [13, -6], [9, 4], [4, 6], [-2, 5], [-8, 5], [-13, 8], [-17, 12]];
const AS = [[28, 36], [30, 42], [35, 44], [40, 46], [44, 47], [48, 48], [50, 50], [55, 55], [60, 60], [60, 68], [65, 69], [75, 72], [90, 75], [105, 77], [120, 73], [135, 72], [150, 70], [162, 66], [170, 66], [178, 65], [170, 62], [162, 60], [158, 55], [156, 52], [142, 50], [140, 44], [135, 42], [130, 38], [127, 36], [122, 38], [120, 33], [118, 28], [116, 23.5], [112, 20.5], [108, 19], [105, 11], [102, 8], [100, 10], [98, 16], [95, 17], [91, 22], [88, 22], [85, 19], [80, 15], [77, 8], [76, 12], [73, 20], [70, 23], [66, 25], [61, 25], [58.5, 23.2], [57, 26], [56, 25.5], [54, 26], [52, 27], [50, 29], [48, 30], [44, 29], [40, 27], [38, 22], [36, 28], [35, 29.5], [33, 31], [32, 31.5], [30, 31]];
const GL = [[-58, 64], [-52, 60], [-44, 60], [-40, 64], [-32, 68], [-22, 70], [-20, 74], [-25, 76], [-32, 78], [-40, 80], [-50, 80], [-58, 76], [-60, 70]];
const UK = [[-5, 50], [-3, 53], [-5, 56], [-3, 58], [-1, 57], [0, 53], [-2, 51]];
const JP = [[130, 31], [133, 34], [137, 35], [140, 37], [141, 40], [143, 42], [145, 44], [142, 44], [140, 40], [138, 37], [135, 34], [131, 32]];
const SU = [[95, 5], [98, 3], [101, 0], [104, -3], [106, -6], [103, -5], [100, -1], [97, 3]];
const BO = [[109, 1], [112, 3], [116, 6], [118, 2], [117, -2], [114, -3], [110, -2]];
const NG = [[131, -1], [136, -2], [141, -3], [146, -6], [150, -9], [147, -8], [142, -8], [137, -5], [132, -3]];
const AU = [[113, -22], [114, -30], [116, -35], [122, -34], [129, -32], [133, -32], [137, -35], [140, -38], [146, -39], [150, -37], [153, -28], [152, -24], [147, -19], [143, -15], [142, -11], [137, -12], [135, -15], [132, -12], [129, -14], [126, -14], [122, -17], [118, -20]];
const MD = [[44, -16], [47, -15], [50, -16], [49, -20], [47, -24], [45, -25], [43, -22], [43, -18]];
const NZ = [[167, -45], [170, -42], [173, -40], [176, -38], [178, -37], [175, -40], [172, -43], [168, -46]];
const TR = [[26, 36.5], [30, 36.3], [33, 36.2], [36, 36.3], [36, 38], [33, 39], [30, 39.5], [27, 39], [26, 37.5]];
const QI = [[55.6, 26.6], [56.8, 26.9], [56.5, 27.3], [55.7, 27.2]];
const LAND = [NA, SA, EU, AF, AS, GL, UK, JP, SU, BO, NG, AU, MD, NZ, TR, QI];
function inPoly(pt, poly) { let ins = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1]; if (((yi > pt[1]) !== (yj > pt[1])) && (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi)) ins = !ins; } return ins; }
const onLand = (lon, lat) => LAND.some(p => inPoly([lon, lat], p));
const MX = 10, MY = 602, MW = 1004, MH = 90;
const px = lon => MX + (lon + 180) / 360 * MW;
const py = lat => MY + (84 - lat) / 142 * MH;
const PINS = [
  { n: 1, name: 'SHENZHEN', lon: 114.1, lat: 22.5, c: ORANGE, lx: 842, ly: 646, an: 'start' },
  { n: 2, name: 'QESHM', lon: 56.2, lat: 26.9, c: RED, lx: 636, ly: 692, an: 'middle' },
  { n: 3, name: 'KERCH', lon: 36.5, lat: 45.3, c: BLUE, lx: 612, ly: 610, an: 'middle' },
  { n: 4, name: 'ALASKA', lon: -152, lat: 64, c: GREEN, lx: 88, ly: 608, an: 'middle' },
  { n: 5, name: 'ANTALYA', lon: 30.7, lat: 36.9, c: BLUE, lx: 548, ly: 610, an: 'middle' },
  { n: 6, name: 'GAZA', lon: 34.5, lat: 31.5, c: RED, lx: 590, ly: 692, an: 'middle' },
  { n: 7, name: 'WASHINGTON', lon: -77, lat: 38.9, c: GREEN, lx: 255, ly: 619, an: 'middle' },
  { n: 8, name: 'NEW YORK', lon: -74.2, lat: 40.7, c: GREEN, lx: 325, ly: 607, an: 'middle' },
  { n: 9, name: 'SAN FRANCISCO', lon: -122.7, lat: 37.8, c: GREEN, lx: 168, ly: 607, an: 'middle' },
  { n: 10, name: 'DURHAM', lon: -78.9, lat: 36, c: GREEN, lx: 296, ly: 692, an: 'middle' },
  { n: 11, name: 'GULF OF OMAN', lon: 58.6, lat: 23.6, c: RED, lx: 706, ly: 692, an: 'middle' },
  { n: 12, name: 'MQ-9', lon: 57.5, lat: 27.5, c: RED, lx: 700, ly: 616, an: 'middle' },
];
for (const p of PINS) { p.x = Math.round(px(p.lon)); p.y = Math.round(py(p.lat)); if (!onLand(p.lon, p.lat)) throw new Error('pin ' + p.n + ' ' + p.name + ' NOT on land'); }
console.log('all 12 pins on land (lon/lat check OK)');

const S = [];
S.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`);
S.push(R(0, 0, W, H, '#ffffff'));
// ---- MASTHEAD 0-84 ----
S.push(T(512, 52, 'THE WORLD TODAY', 62, INK, 800, 'middle'));
S.push(T(12, 78, 'WEDNESDAY 18 NOVEMBER 2026', 18, INK, 800));
S.push(T(560, 78, '30 STORIES · 7 CONTINENTS', 15, '#555555', 700, 'middle'));
S.push(R(856, 60, 156, 20, RED));
S.push(T(934, 75, '✓ DATE-CHECKED', 13, '#ffffff', 800, 'middle'));
S.push(R(0, 84, W, 3, RED));
// ---- LEADS y 84-336, panels x 8/347/686 w 330 ----
function lead(x, bg, kick, kc, h1, h2, body, tag) {
  const a = [];
  a.push(R(x, 88, 330, 244, bg));
  a.push(R(x, 88, 330, 4, kc));
  a.push(T(x + 14, 116, kick, 13, kc, 800));
  a.push(T(x + 14, 150, h1, 30, INK, 800));
  a.push(T(x + 14, 182, h2, 30, INK, 800));
  a.push(T(x + 14, 206, body[0], 15, '#333333'));
  a.push(T(x + 14, 224, body[1], 15, '#333333'));
  return a;
}
// Lead 1 SHENZHEN — flags + 3-way talks box
S.push(...lead(8, '#eaf1f8', 'ASIA · APEC SUMMIT', BLUE, 'XI GREETS TRUMP', 'ON THE TARMAC', ['Break with protocol at Shenzhen', 'airport; Xi + Putin met Wed.'], 'AP'));
S.push(R(22, 238, 96, 44, '#de2910')); S.push(T(70, 266, 'CHINA', 14, '#ffffff', 800, 'middle'));
S.push(R(126, 238, 96, 44, '#b22234')); S.push(T(174, 266, 'USA', 14, '#ffffff', 800, 'middle'));
S.push(R(230, 238, 96, 44, '#ffffff')); S.push(R(230, 252, 96, 15, '#0039a6')); S.push(R(230, 267, 96, 15, '#d52b1e')); S.push(T(278, 266, 'RUSSIA', 13, INK, 800, 'middle'));
S.push(R(22, 292, 302, 26, INK)); S.push(T(173, 310, 'THU: FIRST 3-WAY TALKS', 15, '#ffffff', 800, 'middle'));
S.push(T(316, 326, 'AP', 11, '#666666', 700, 'end'));
// Lead 2 GULF — mini-map with strike markers
S.push(...lead(347, '#fdeeda', 'MIDDLE EAST · WAR', RED, 'IRAN HITS US BASES', 'KUWAIT, BAHRAIN', ['Both attacks intercepted; US jets', 'hit Guard missile site on Qeshm.'], 'CENTCOM'));
S.push(R(361, 238, 302, 66, '#cfe3f2'));
S.push(`<polygon points="380,250 420,244 470,252 520,246 560,258 640,252 645,290 600,296 540,292 480,298 420,292 375,288" fill="#e6dfc8" stroke="#ffffff" stroke-width="1.5"/>`);
const mk = (x, y, l, an) => `<g><circle cx="${x}" cy="${y}" r="7" fill="${RED}" stroke="#fff" stroke-width="1.5"/><text x="${x}" y="${y + 3}" font-family="DejaVu Sans" font-size="9" font-weight="800" fill="#fff" text-anchor="middle">×</text>${T(an === 'end' ? x - 10 : x + 10, y - 6, l, 11, INK, 800, an || 'start')}</g>`;
S.push(mk(420, 262, 'KUWAIT')); S.push(mk(500, 258, 'BAHRAIN')); S.push(mk(560, 272, 'QESHM')); S.push(mk(620, 286, 'HORMUZ', 'end'));
S.push(R(361, 310, 302, 18, RED)); S.push(T(512, 323, 'BOTH STRIKES INTERCEPTED · 1 MISSING', 11, '#ffffff', 800, 'middle'));
S.push(T(655, 326, 'CENTCOM', 11, '#666666', 700, 'end'));
// Lead 3 KERCH — bridge diagram, collapsed span
S.push(...lead(686, '#eaf6ec', 'EUROPE · UKRAINE', GREEN, 'KERCH BRIDGE', 'PARTLY COLLAPSES', ['Drones + missiles drop one arch', 'into the strait; road out of service.'], 'REUTERS'));
S.push(`<line x1="700" y1="252" x2="1002" y2="252" stroke="${INK}" stroke-width="6"/>`);
S.push(`<line x1="740" y1="252" x2="740" y2="292" stroke="${INK}" stroke-width="4"/><line x1="960" y1="252" x2="960" y2="292" stroke="${INK}" stroke-width="4"/>`);
S.push(`<line x1="790" y1="252" x2="790" y2="278" stroke="${INK}" stroke-width="3"/><line x1="910" y1="252" x2="910" y2="278" stroke="${INK}" stroke-width="3"/>`);
S.push(`<line x1="820" y1="252" x2="880" y2="296" stroke="${RED}" stroke-width="6"/><line x1="880" y1="252" x2="820" y2="296" stroke="${RED}" stroke-width="6"/>`);
S.push(T(850, 316, 'SPAN DOWN — 2ND DAY OF STRIKES', 12, RED, 800, 'middle'));
S.push(T(994, 326, 'REUTERS', 11, '#666666', 700, 'end'));

// ---- SMALL PANELS: rows y 340 + 465, h 121; cols x 8/211/414/617/820, w 195 ----
function small(x, y, n, tag, tc, h1, h2, fact, icon) {
  const a = [];
  a.push(R(x, y, 195, 121, '#ffffff'));
  a.push(R(x, y, 195, 4, tc));
  a.push(T(x + 8, y + 20, n + ' · ' + tag, 10, tc, 800));
  a.push(T(x + 8, y + 44, h1, 20, INK, 800));
  a.push(T(x + 8, y + 66, h2, 20, INK, 800));
  a.push(T(x + 8, y + 86, fact, 13, '#444444'));
  a.push(icon(x, y));
  return a;
}
const icBallot = (x, y) => `<g><rect x="${x + 8}" y="${y + 94}" width="26" height="18" fill="none" stroke="${GREEN}" stroke-width="2.5"/><rect x="${x + 16}" y="${y + 90}" width="10" height="4" fill="${GREEN}"/><path d="M ${x + 44} ${y + 104} l 5 6 l 10 -12" stroke="${GREEN}" stroke-width="3" fill="none"/><text x="${x + 70}" y="${y + 110}" font-family="DejaVu Sans" font-size="16" font-weight="800" fill="${GREEN}">56–44</text></g>`;
const icChip = (x, y) => `<g><rect x="${x + 8}" y="${y + 94}" width="24" height="18" fill="${BLUE}"/><rect x="${x + 14}" y="${y + 100}" width="12" height="6" fill="#fff"/><rect x="${x + 40}" y="${y + 104}" width="7" height="8" fill="${BLUE}"/><rect x="${x + 50}" y="${y + 98}" width="7" height="14" fill="${BLUE}"/><rect x="${x + 60}" y="${y + 100}" width="7" height="12" fill="${BLUE}"/><text x="${x + 76}" y="${y + 110}" font-family="DejaVu Sans" font-size="15" font-weight="800" fill="${BLUE}">$115.8B</text></g>`;
const icTent = (x, y) => `<g><polygon points="${x + 8},${y + 112} ${x + 21},${y + 94} ${x + 34},${y + 112}" fill="none" stroke="${RED}" stroke-width="2.5"/><polygon points="${x + 48},${y + 94} ${x + 60},${y + 112} ${x + 36},${y + 112}" fill="#fde3a7" stroke="${ORANGE}" stroke-width="2"/><text x="${x + 48}" y="${y + 109}" font-family="DejaVu Sans" font-size="12" font-weight="800" fill="${ORANGE}" text-anchor="middle">!</text><text x="${x + 70}" y="${y + 110}" font-family="DejaVu Sans" font-size="13" font-weight="800" fill="${RED}">WINTER IN TENTS</text></g>`;
const icGlobe = (x, y) => `<g><circle cx="${x + 20}" cy="${y + 103}" r="10" fill="none" stroke="${BLUE}" stroke-width="2.5"/><path d="M ${x + 10} ${y + 103} h 20 M ${x + 20} ${y + 93} v 20" stroke="${BLUE}" stroke-width="1.5"/><text x="${x + 38}" y="${y + 110}" font-family="DejaVu Sans" font-size="15" font-weight="800" fill="${BLUE}">75 NATIONS</text></g>`;
const icVirus = (x, y) => `<g><circle cx="${x + 20}" cy="${y + 103}" r="8" fill="${RED}"/><g stroke="${RED}" stroke-width="2"><line x1="${x + 20}" y1="${y + 92}" x2="${x + 20}" y2="${y + 88}"/><line x1="${x + 20}" y1="${y + 114}" x2="${x + 20}" y2="${y + 118}"/><line x1="${x + 9}" y1="${y + 103}" x2="${x + 5}" y2="${y + 103}"/><line x1="${x + 31}" y1="${y + 103}" x2="${x + 35}" y2="${y + 103}"/></g><text x="${x + 42}" y="${y + 110}" font-family="DejaVu Sans" font-size="15" font-weight="800" fill="${RED}">26 YEARS LOST</text></g>`;
const icTag = (x, y) => `<g><polygon points="${x + 8},${y + 96} ${x + 30},${y + 96} ${x + 38},${y + 103} ${x + 30},${y + 110} ${x + 8},${y + 110}" fill="${ORANGE}"/><circle cx="${x + 14}" cy="${y + 103}" r="2.5" fill="#fff"/><text x="${x + 46}" y="${y + 110}" font-family="DejaVu Sans" font-size="16" font-weight="800" fill="${ORANGE}">$83 · $81.3B</text></g>`;
const icProbe = (x, y) => `<g><circle cx="${x + 16}" cy="${y + 103}" r="6" fill="${BLUE}"/><line x1="${x + 22}" y1="${y + 103}" x2="${x + 34}" y2="${y + 96}" stroke="${BLUE}" stroke-width="2"/><circle cx="${x + 36}" cy="${y + 95}" r="3" fill="none" stroke="${BLUE}" stroke-width="2"/><circle cx="${x + 52}" cy="${y + 100}" r="2.5" fill="#999"/><circle cx="${x + 64}" cy="${y + 103}" r="2.5" fill="#999"/><circle cx="${x + 76}" cy="${y + 106}" r="2.5" fill="${BLUE}"/><text x="${x + 86}" y="${y + 110}" font-family="DejaVu Sans" font-size="13" font-weight="800" fill="${BLUE}">24H SIGNAL</text></g>`;
const icScore = (x, y) => `<g><rect x="${x + 8}" y="${y + 93}" width="86" height="20" fill="${INK}"/><text x="${x + 51}" y="${y + 108}" font-family="DejaVu Sans" font-size="15" font-weight="800" fill="#fff" text-anchor="middle">99 – 78</text><text x="${x + 100}" y="${y + 110}" font-family="DejaVu Sans" font-size="15" font-weight="800" fill="${INK}">46 PTS</text></g>`;
const icTanker = (x, y) => `<g><polygon points="${x + 8},${y + 100} ${x + 52},${y + 100} ${x + 46},${y + 112} ${x + 14},${y + 112}" fill="${INK}"/><rect x="${x + 18}" y="${y + 93}" width="16" height="7" fill="${INK}"/><text x="${x + 60}" y="${y + 110}" font-family="DejaVu Sans" font-size="15" font-weight="800" fill="${RED}">5 SUNK</text></g>`;
const icDrone = (x, y) => `<g><ellipse cx="${x + 22}" cy="${y + 103}" rx="12" ry="5" fill="${INK}"/><line x1="${x + 8}" y1="${y + 96}" x2="${x + 36}" y2="${y + 96}" stroke="${INK}" stroke-width="2"/><circle cx="${x + 8}" cy="${y + 96}" r="3" fill="none" stroke="${INK}" stroke-width="2"/><circle cx="${x + 36}" cy="${y + 96}" r="3" fill="none" stroke="${INK}" stroke-width="2"/><text x="${x + 46}" y="${y + 110}" font-family="DejaVu Sans" font-size="13" font-weight="800" fill="${RED}">SHOT DOWN ×</text></g>`;
S.push(...small(8, 340, '04', 'N. AMERICA', GREEN, 'PELTOLA BEATS', 'SULLIVAN', 'Dems take Senate 56–44', icBallot));
S.push(...small(211, 340, '05', 'MARKETS', BLUE, 'NVIDIA: $115.8B', 'Q3, +103% YoY', 'Net $65.3B · shares +4%', icChip));
S.push(...small(414, 340, '06', 'MIDDLE EAST', RED, 'GAZA CEASEFIRE', 'ON THE BRINK', 'Board of Peace warns', icTent));
S.push(...small(617, 340, '07', 'CLIMATE', GREEN, 'COP31 TALKS', 'STALL', '144 disputed items', icGlobe));
S.push(...small(820, 340, '08', 'HEALTH', RED, 'MEASLES STATUS', 'LOST IN US', '26 years · 5,400+ cases', icVirus));
S.push(...small(8, 465, '09', 'MARKETS', BLUE, 'ANTHROPIC IPO', '$83 A SHARE', '$81.3B — largest IPO ever', icTag));
S.push(...small(211, 465, '10', 'SPACE', BLUE, 'VOYAGER 1:', '1 LIGHT-DAY', '25.9bn km · signal 24h', icProbe));
S.push(...small(414, 465, '11', 'SPORT', ORANGE, 'ILLINOIS 99–78', 'DUKE', 'Stojakovic 46 pts — record', icScore));
S.push(...small(617, 465, '12', 'MIDDLE EAST', RED, 'US SINKS', '5 TANKERS', 'Oil tops $100 a barrel', icTanker));
S.push(...small(820, 465, '13', 'MIDDLE EAST', RED, 'MQ-9 SHOT', 'DOWN', 'Iran downs US drone', icDrone));

// ---- WORLD MAP y 586-698: ocean bg, land polys, pins + staggered labels ----
S.push(R(0, 586, W, 112, '#cfe3f2'));
S.push(T(10, 598, 'WHERE IT HAPPENED — 12 PLACES', 12, '#1a5276', 800));
S.push(T(1014, 598, '● ASIA  ● MIDEAST  ● EUROPE  ● N. AMERICA', 11, '#1a5276', 700, 'end'));
const polyPts = poly => poly.map(p => Math.round(px(p[0])) + ',' + Math.round(py(p[1]))).join(' ');
for (const poly of LAND) S.push(`<polygon points="${polyPts(poly)}" fill="#e6dfc8" stroke="#ffffff" stroke-width="1"/>`);
for (const p of PINS) {
  S.push(`<line x1="${p.x}" y1="${p.y}" x2="${p.lx}" y2="${p.ly - 4}" stroke="#333333" stroke-width="1"/>`);
  S.push(T(p.lx, p.ly, p.name, 10, INK, 800, p.an));
  S.push(`<circle cx="${p.x}" cy="${p.y}" r="6" fill="${p.c}" stroke="#ffffff" stroke-width="1.5"/>`);
  S.push(T(p.x, p.y + 3, String(p.n), 8, '#ffffff', 800, 'middle'));
}
// ---- UTC TIMELINE y 698-754 ----
S.push(R(0, 698, W, 56, '#f4f4f4'));
S.push(T(10, 716, 'UTC TIMELINE — 18 NOVEMBER', 12, '#555555', 800));
const TL = [['00:29', 'Bezos picked Bond star'], ['06:17', '5.3 quake, Romania'], ['09:37', 'Iran targets Patriots'], ['10:16', 'Voyager 1: 1 light-day'], ['15:37', 'Iran downs MQ-9'], ['21:26', 'Anthropic IPO: $83']];
TL.forEach((t, i) => {
  const x = 10 + i * 170;
  S.push(`<circle cx="${x + 6}" cy="734" r="4" fill="${RED}"/>`);
  if (i < 5) S.push(`<line x1="${x + 12}" y1="734" x2="${x + 164}" y2="734" stroke="#bbbbbb" stroke-width="1.5"/>`);
  S.push(T(x, 730, t[0], 15, INK, 800));
  S.push(T(x, 748, t[1], 11, '#444444'));
});
// ---- DAY IN NUMBERS y 754-796 ----
S.push(R(0, 754, W, 42, INK));
S.push(T(512, 781, '30 STORIES · 7 CONTINENTS · $81.3BN IPO · 25.9BN KM · 5 TANKERS · 56–44 SENATE', 20, '#ffffff', 800, 'middle'));

// ---- ALSO LIST y 796-1000: 17 items, 2 columns ----
S.push(T(10, 814, 'ALSO ON 18 NOVEMBER', 16, INK, 800));
const ALSO = [
  ['14', 'Ebola DRC: 3 of 4 children under 5 die; Bunia + Beni.', RED],
  ['15', 'Yemen: Houthis fire 5 drones; Sanaa strikes, ≥17 killed.', RED],
  ['16', 'Siberia crash: Russian military plane, 19 dead.', BLUE],
  ['17', 'NSA outage: classified net down; Java flaw, CISA patch.', GREEN],
  ['18', 'Israel elects Matan Kahana speaker; Netanyahu setback.', RED],
  ['19', 'Germany: OPCW probe — Russia used tear gas vs troops.', BLUE],
  ['20', 'Quad meets in Manila — first leaders’ meet in 2+ yrs.', ORANGE],
  ['21', 'Canada + China cut tariffs after Carney–Xi talks.', ORANGE],
  ['22', 'N. Korea expanded Yongbyon enrichment plant — IAEA.', ORANGE],
  ['23', '6.0 quake hits Papua New Guinea.', BLUE],
  ['24', '5.3 quake hits Romania.', BLUE],
  ['25', 'Netherlands swears in youngest, first gay PM.', BLUE],
  ['26', 'NYC travel ban as major storm hits US.', GREEN],
  ['27', 'Bezos: helped pick Pattinson as Bond (16 Nov).', GREEN],
  ['28', 'EU worst wildfire season; €45bn Ukraine loan.', BLUE],
  ['29', 'Cyclone Akvan — landfall Fri, Andhra, 120–130 km/h.', ORANGE],
  ['30', 'GTA VI out today — pre-orders >$1.5bn.', GREEN],
];
ALSO.forEach((it, i) => {
  const col = i < 9 ? 0 : 1, row = i < 9 ? i : i - 9;
  const x = col === 0 ? 12 : 522, y = 836 + row * 19;
  S.push(T(x, y, it[0], 15, it[2], 800));
  S.push(T(x + 28, y, it[1], 15, INK));
});
// ---- FOOTER y 1000-1024 ----
S.push(R(0, 1000, W, 24, '#eeeeee'));
S.push(T(512, 1010, 'DATE-CHECKED: every story verified against reporting dated Wednesday 18 November 2026. LEFT OUT: Bond casting (16 Nov) · El Mencho killing (Feb).', 11, '#333333', 400, 'middle'));
S.push(T(512, 1022, 'Sources: AP / Reuters / Bloomberg / AFP / Al Jazeera / BBC / CNBC / NASA / CENTCOM.', 11, '#333333', 400, 'middle'));
S.push('</svg>');
const svg = S.join('\n');
async function main() {
  const buf1 = await sharp(Buffer.from(svg)).png().toBuffer();
  const buf2 = await sharp(Buffer.from(svg)).png().toBuffer();
  const h1 = crypto.createHash('sha256').update(buf1).digest('hex');
  const h2 = crypto.createHash('sha256').update(buf2).digest('hex');
  console.log('render1 sha256', h1, 'bytes', buf1.length);
  console.log('render2 sha256', h2, 'bytes', buf2.length);
  console.log('byte-identical:', h1 === h2, '| <=1MiB:', buf1.length <= 1048576);
  if (h1 !== h2) throw new Error('renders differ');
  if (buf1.length > 1048576) throw new Error('over 1 MiB');
  const meta = await sharp(buf1).metadata();
  console.log('dimensions', meta.width + 'x' + meta.height);
  if (meta.width !== 1024 || meta.height !== 1024) throw new Error('bad dimensions');
  fs.writeFileSync('entry.png', buf1);
  await sharp(buf1).resize(300, 300).png().toFile('/tmp/news18-v3-300.png');
  // pin pixel sampling: 8 samples on a 10px ring around each pin (pin r=6 + white stroke ends ~7.5px); need >=2 land pixels
  const raw = await sharp(buf1).raw().toBuffer({ resolveWithObject: true });
  const { data, info } = raw;
  const landPx = (x, y) => { if (x < 0 || y < 0 || x >= info.width || y >= info.height) return false; const o = (y * info.width + x) * info.channels; return Math.abs(data[o] - 230) < 14 && Math.abs(data[o + 1] - 223) < 14 && Math.abs(data[o + 2] - 200) < 14; };
  let allOk = true;
  for (const p of PINS) {
    let land = 0;
    for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; if (landPx(Math.round(p.x + 10 * Math.cos(a)), Math.round(p.y + 10 * Math.sin(a)))) land++; }
    console.log('pin', p.n, p.name, 'land samples', land + '/8', land >= 2 ? 'OK' : 'MISS');
    if (land < 2) allOk = false;
  }
  console.log('pins on land (pixel):', allOk);
  if (!allOk) throw new Error('pin land check failed');
}
main().catch(e => { console.error(e); process.exit(1); });
