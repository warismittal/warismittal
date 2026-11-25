// Serves the profile artwork that matches the current time in India (IST).
// /api/sky?a=header | about-dark | about-light | footer   (add &mode=sunrise|day|sunset|night to preview one)
const BASE = 'https://raw.githubusercontent.com/warismittal/warismittal/main/assets/';
const ASSETS = {
  'header': (m) => `scenes/header-${m}.svg`,
  'about-dark': (m) => `about/about-dark-${m}.svg`,
  'about-light': (m) => `about/about-light-${m}.svg`,
  'footer': (m) => `footer/footer-${m}.svg`,
};
const MODES = ['sunrise', 'day', 'sunset', 'night'];

function istMode(now = new Date()) {
  const mins = (now.getUTCHours() * 60 + now.getUTCMinutes() + 330) % 1440; // UTC+5:30
  const h = mins / 60;
  if (h >= 5 && h < 8) return 'sunrise';
  if (h >= 8 && h < 16) return 'day';
  if (h >= 16 && h < 19) return 'sunset';
  return 'night';
}

module.exports = async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const pick = ASSETS[url.searchParams.get('a') || 'header'];
  if (!pick) { res.statusCode = 404; return res.end('unknown asset'); }
  const forced = url.searchParams.get('mode');
  const mode = MODES.includes(forced) ? forced : istMode();
  try {
    const r = await fetch(BASE + pick(mode), { cache: 'no-store' });
    if (!r.ok) { res.statusCode = 502; return res.end(`upstream ${r.status}`); }
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    res.setHeader('Vercel-CDN-Cache-Control', 'max-age=300');
    res.setHeader('X-Sky-Mode', mode);
    res.end(await r.text());
  } catch (e) {
    res.statusCode = 500; res.end('error');
  }
};
