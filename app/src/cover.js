// VICE CANVAS - Pure Cover Composition Engine

export const PANEL_LAYOUTS = {
  poster: (w, h) => {
    const isPortrait = h > w;
    const heroH = Math.round(h * (isPortrait ? 0.38 : 0.50));
    const bottomH = h - heroH;
    const x0 = 0;
    const x1 = Math.round(w / 3);
    const x2 = Math.round((2 * w) / 3);
    const x3 = w;

    if (isPortrait) {
      // Portrait poster: a full-height character column on the left and two
      // stacked landscape bands on the right, so a wide photo (the car)
      // gets a band it can fill nose-to-tail instead of a narrow column
      // that crops it to a front clip.
      const midY = heroH + Math.round(bottomH / 2);
      return [
        // Hero top panel
        { x: 0, y: 0, w: w, h: heroH },
        // Character column, full bottom height
        { x: x0, y: heroH, w: x1 - x0, h: bottomH },
        // Wide band, upper right
        { x: x1, y: heroH, w: x3 - x1, h: midY - heroH },
        // Wide band, lower right
        { x: x1, y: midY, w: x3 - x1, h: h - midY }
      ];
    }

    return [
      // Hero top panel
      { x: 0, y: 0, w: w, h: heroH },
      // Three bottom panels
      { x: x0, y: heroH, w: x1 - x0, h: bottomH },
      { x: x1, y: heroH, w: x2 - x1, h: bottomH },
      { x: x2, y: heroH, w: x3 - x2, h: bottomH }
    ];
  },

  six: (w, h) => {
    const cols = 2;
    const rows = 3;
    const panels = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x0 = Math.round((c * w) / cols);
        const x1 = Math.round(((c + 1) * w) / cols);
        const y0 = Math.round((r * h) / rows);
        const y1 = Math.round(((r + 1) * h) / rows);
        panels.push({
          x: x0,
          y: y0,
          w: x1 - x0,
          h: y1 - y0
        });
      }
    }
    return panels;
  },

  duo: (w, h) => {
    const isPortrait = h >= w;
    if (isPortrait) {
      const midY = Math.round(h / 2);
      return [
        { x: 0, y: 0, w: w, h: midY },
        { x: 0, y: midY, w: w, h: h - midY }
      ];
    } else {
      const midX = Math.round(w / 2);
      return [
        { x: 0, y: 0, w: midX, h: h },
        { x: midX, y: 0, w: w - midX, h: h }
      ];
    }
  },

  quad: (w, h) => {
    const cols = 2;
    const rows = 2;
    const panels = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x0 = Math.round((c * w) / cols);
        const x1 = Math.round(((c + 1) * w) / cols);
        const y0 = Math.round((r * h) / rows);
        const y1 = Math.round(((r + 1) * h) / rows);
        panels.push({
          x: x0,
          y: y0,
          w: x1 - x0,
          h: y1 - y0
        });
      }
    }
    return panels;
  },

  trio: (w, h) => {
    // Three full-height vertical panels side by side.
    const panels = [];
    for (let c = 0; c < 3; c++) {
      const x0 = Math.round((c * w) / 3);
      const x1 = Math.round(((c + 1) * w) / 3);
      panels.push({ x: x0, y: 0, w: x1 - x0, h });
    }
    return panels;
  },

  split: (w, h) => {
    // One large hero panel on the left, two panels stacked on the right.
    const leftW = Math.round(w * 0.58);
    const midY = Math.round(h / 2);
    return [
      { x: 0, y: 0, w: leftW, h },
      { x: leftW, y: 0, w: w - leftW, h: midY },
      { x: leftW, y: midY, w: w - leftW, h: h - midY }
    ];
  },

  collage8: (w, h) => {
    // Eight-panel collage: 4 x 2 on landscape and square canvases,
    // 2 x 4 on portrait ones so no panel turns into a sliver.
    const portrait = h > w;
    const cols = portrait ? 2 : 4;
    const rows = portrait ? 4 : 2;
    const panels = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x0 = Math.round((c * w) / cols);
        const x1 = Math.round(((c + 1) * w) / cols);
        const y0 = Math.round((r * h) / rows);
        const y1 = Math.round(((r + 1) * h) / rows);
        panels.push({
          x: x0,
          y: y0,
          w: x1 - x0,
          h: y1 - y0
        });
      }
    }
    return panels;
  }
};

export const GRADE_RECIPES = {
  sunset: {
    name: 'Sunset Vice',
    filter: 'saturate(1.06) contrast(1.04) brightness(1.0)',
    overlay: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(255, 90, 50, 0.16)');
      grad.addColorStop(0.18, 'rgba(255, 90, 50, 0)');
      grad.addColorStop(0.88, 'rgba(255, 90, 50, 0)');
      grad.addColorStop(1, 'rgba(255, 183, 3, 0.16)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  },
  neon: {
    name: 'Neon Nights',
    filter: 'saturate(1.12) contrast(1.05) brightness(1.0)',
    overlay: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(5, 217, 232, 0.16)');
      grad.addColorStop(0.18, 'rgba(5, 217, 232, 0)');
      grad.addColorStop(0.88, 'rgba(5, 217, 232, 0)');
      grad.addColorStop(1, 'rgba(255, 0, 110, 0.16)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  },
  golden: {
    name: 'Golden Hour',
    filter: 'saturate(1.08) contrast(1.04) brightness(1.05)',
    overlay: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(255, 200, 50, 0.16)');
      grad.addColorStop(0.18, 'rgba(255, 200, 50, 0)');
      grad.addColorStop(0.88, 'rgba(255, 200, 50, 0)');
      grad.addColorStop(1, 'rgba(255, 140, 0, 0.16)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  },
  raw: {
    name: 'Raw Print',
    filter: 'none',
    overlay: () => {}
  },
  midnight: {
    name: 'Midnight Palms',
    filter: 'saturate(1.1) contrast(1.07) brightness(0.94)',
    overlay: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(4, 80, 92, 0.22)');
      grad.addColorStop(0.3, 'rgba(4, 80, 92, 0)');
      grad.addColorStop(0.85, 'rgba(255, 0, 128, 0)');
      grad.addColorStop(1, 'rgba(255, 0, 128, 0.2)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  },
  chromeheat: {
    name: 'Chrome Heat',
    filter: 'saturate(1.18) contrast(1.08) brightness(1.02)',
    overlay: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(255, 60, 0, 0.2)');
      grad.addColorStop(0.2, 'rgba(255, 60, 0, 0)');
      grad.addColorStop(0.85, 'rgba(214, 0, 0, 0)');
      grad.addColorStop(1, 'rgba(214, 0, 0, 0.22)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  },
  vapor: {
    name: 'Vapor Dawn',
    filter: 'saturate(0.96) contrast(0.98) brightness(1.06)',
    overlay: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(255, 183, 197, 0.2)');
      grad.addColorStop(0.25, 'rgba(255, 183, 197, 0)');
      grad.addColorStop(0.8, 'rgba(103, 232, 249, 0)');
      grad.addColorStop(1, 'rgba(103, 232, 249, 0.2)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  }
};

export function applyColourGrade(ctx, w, h, gradeKey) {
  const recipe = GRADE_RECIPES[gradeKey] || GRADE_RECIPES.sunset;
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  recipe.overlay(ctx, w, h);
  ctx.restore();
}

/**
 * Cover-fit math with pan, zoom, and focal rule:
 * When crop removes vertical overflow, portrait source photo (h > w) biases crop window to 22% from top,
 * while landscape/square keeps window centered at 50%. Horizontal overflow always centered.
 * Pan shifts window, clamped inside photo.
 */
export function coverFitSourceRect(imgW, imgH, panelW, panelH, zoom = 1, panX = 0, panY = 0) {
  const panelAspect = panelW / panelH;
  const imgAspect = imgW / imgH;

  let sw, sh, sx, sy;

  if (imgAspect > panelAspect) {
    // Image is wider than panel: height fits, width overflows
    sh = imgH;
    sw = imgH * panelAspect;
    sy = 0;
    sx = (imgW - sw) / 2;
  } else {
    // Image is taller than panel: width fits, height overflows
    sw = imgW;
    sh = imgW / panelAspect;
    sx = 0;

    // Focal rule for vertical overflow
    const isPortraitSource = imgH > imgW;
    const baseAnchorRatio = isPortraitSource ? 0.22 : 0.5;
    sy = (imgH - sh) * baseAnchorRatio;
  }

  // Apply zoom
  const zoomedW = sw / zoom;
  const zoomedH = sh / zoom;
  const zoomedSx = sx + (sw - zoomedW) / 2;
  const zoomedSy = sy + (sh - zoomedH) / 2;

  // Apply pan offsets (panX, panY normalized -1 to 1)
  const maxPanX = (sw - zoomedW) / 2;
  const maxPanY = (sh - zoomedH) / 2;
  const finalSx = Math.max(0, Math.min(imgW - zoomedW, zoomedSx - panX * (sw * 0.4)));
  const finalSy = Math.max(0, Math.min(imgH - zoomedH, zoomedSy - panY * (sh * 0.4)));

  return { sx: finalSx, sy: finalSy, sw: zoomedW, sh: zoomedH };
}

// Accent colour per grade, shared by the subtitle plate, role tags and seal.
export const GRADE_ACCENTS = {
  sunset: '#ff9e3d',
  neon: '#22d3ee',
  golden: '#fbbf24',
  raw: '#e5e7eb',
  midnight: '#ff4d9d',
  chromeheat: '#ff6d1f',
  vapor: '#f9a8d4'
};

// Width of a string drawn letter by letter with fixed spacing between glyphs.
export function spacedTextWidth(ctx, text, spacing) {
  let width = 0;
  for (let i = 0; i < text.length; i++) {
    width += ctx.measureText(text[i]).width + (i < text.length - 1 ? spacing : 0);
  }
  return width;
}

// Draw letterspaced text from a left origin (ctx.textAlign is forced to 'left').
// Returns the drawn width so callers can centre or plate the text.
export function drawSpacedText(ctx, text, x, y, spacing) {
  const prevAlign = ctx.textAlign;
  ctx.textAlign = 'left';
  let curX = x;
  for (let i = 0; i < text.length; i++) {
    ctx.fillText(text[i], curX, y);
    curX += ctx.measureText(text[i]).width + spacing;
  }
  ctx.textAlign = prevAlign;
  return curX - x - (text.length ? spacing : 0);
}

// A five-pointed star path centred on (cx, cy).
export function starPath(ctx, cx, cy, outerR, innerR, rotation = -Math.PI / 2) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = rotation + (i * Math.PI) / 5;
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

/**
 * Render the title once onto an offscreen canvas with the retro-chrome
 * treatment: a sunset gradient (pale gold -> gold -> orange -> hot pink)
 * split by a dark chrome seam, fine horizontal striping across the lower
 * half and a soft gloss over the top. The caller strokes a heavy dark
 * outline on the main canvas and lays this on top.
 */
export function buildChromeTitle(text, fontSize) {
  const pad = Math.ceil(fontSize * 0.35);
  const meas = document.createElement('canvas').getContext('2d');
  meas.font = `${fontSize}px "Anton", sans-serif`;
  const textW = meas.measureText(text).width;

  const c = document.createElement('canvas');
  c.width = Math.ceil(textW + pad * 2);
  c.height = Math.ceil(fontSize * 1.6);
  const g = c.getContext('2d');
  g.font = `${fontSize}px "Anton", sans-serif`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';

  const top = c.height / 2 - fontSize * 0.5;
  const bottom = c.height / 2 + fontSize * 0.5;
  const grad = g.createLinearGradient(0, top, 0, bottom);
  grad.addColorStop(0, '#fff6c9');
  grad.addColorStop(0.28, '#ffd23d');
  grad.addColorStop(0.46, '#ff9e3d');
  grad.addColorStop(0.495, '#7a2d0e');
  grad.addColorStop(0.52, '#ff7847');
  grad.addColorStop(0.74, '#ff2a6d');
  grad.addColorStop(1, '#d1105a');
  g.fillStyle = grad;
  g.fillText(text, c.width / 2, c.height / 2);

  g.globalCompositeOperation = 'source-atop';

  // Retro striping across the lower half of the glyphs.
  g.fillStyle = 'rgba(70, 0, 24, 0.16)';
  const stripeH = Math.max(1.5, fontSize * 0.03);
  const stripeGap = fontSize * 0.105;
  for (let y = c.height / 2 + fontSize * 0.03; y < bottom + fontSize * 0.08; y += stripeGap) {
    g.fillRect(0, y, c.width, stripeH);
  }

  // Soft gloss sheen over the top of the glyphs.
  const gloss = g.createLinearGradient(0, top, 0, top + fontSize * 0.45);
  gloss.addColorStop(0, 'rgba(255, 255, 255, 0.38)');
  gloss.addColorStop(1, 'rgba(255, 255, 255, 0)');
  g.fillStyle = gloss;
  g.fillRect(0, top, c.width, fontSize * 0.45);

  g.globalCompositeOperation = 'source-over';
  return c;
}

export function drawPosterLettering(ctx, w, h, state) {
  const title = state.title;
  const subtitle = state.subtitle;
  const accent = state.accent;
  const gradeKey = state.grade || 'sunset';
  // Caption FX: 'none' | 'outline' | 'glow', applied to the title, the
  // script accent and the subtitle plate in the grade's accent colour.
  const fx = state.captionFx || 'none';
  const fxAccent = GRADE_ACCENTS[gradeKey] || '#ff9e3d';
  if (!title && !subtitle) return;

  ctx.save();

  // Soft dark title banner / backing near top
  const bannerH = Math.round(h * 0.18);
  const bannerY = Math.round(h * 0.03);
  const grad = ctx.createLinearGradient(0, bannerY, 0, bannerY + bannerH);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
  grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.35)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, bannerY, w, bannerH);

  // Title styling in Anton
  const maxTextW = w * 0.94;
  let fontSize = Math.round(h * 0.12);
  ctx.font = `${fontSize}px "Anton", sans-serif`;

  const cleanTitle = (title || '').toUpperCase();
  let metrics = ctx.measureText(cleanTitle);

  // Auto-shrink to fit 94% width
  while (metrics.width > maxTextW && fontSize > 20) {
    fontSize -= 2;
    ctx.font = `${fontSize}px "Anton", sans-serif`;
    metrics = ctx.measureText(cleanTitle);
  }
  const titleW = metrics.width;

  const titleX = w / 2;
  const titleY = bannerY + Math.round(bannerH * 0.52);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Heavy dark outline with a hard offset shadow, stroked twice so the
  // rim stays solid where the chrome fill will sit on top of it.
  ctx.shadowColor = 'rgba(0, 0, 0, 1)';
  ctx.shadowBlur = 0;
  const shadowOffset = Math.max(1, Math.round(fontSize / 20));
  ctx.shadowOffsetX = shadowOffset;
  ctx.shadowOffsetY = shadowOffset;

  ctx.lineWidth = Math.max(4, Math.round(fontSize / 8));
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#160409';
  ctx.strokeText(cleanTitle, titleX, titleY);
  ctx.strokeText(cleanTitle, titleX, titleY);

  // Sunset-chrome fill, pre-rendered with its striping and gloss.
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  const chrome = buildChromeTitle(cleanTitle, fontSize);
  const chromeX = titleX - chrome.width / 2;
  const chromeY = titleY - chrome.height / 2;

  // Caption FX "glow": a halo of accent light behind the chrome letters,
  // laid down by drawing the pre-rendered title with a soft shadow.
  if (fx === 'glow') {
    ctx.save();
    ctx.shadowColor = fxAccent;
    ctx.shadowBlur = Math.round(fontSize * 0.45);
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.drawImage(chrome, chromeX, chromeY);
    ctx.drawImage(chrome, chromeX, chromeY);
    ctx.restore();
  }
  ctx.drawImage(chrome, chromeX, chromeY);

  // Caption FX "outline": a bright accent rim traced over the chrome.
  if (fx === 'outline') {
    ctx.save();
    ctx.lineWidth = Math.max(2, Math.round(fontSize / 22));
    ctx.lineJoin = 'round';
    ctx.strokeStyle = fxAccent;
    ctx.strokeText(cleanTitle, titleX, titleY);
    ctx.restore();
  }

  // Script accent word, signed across the top-left of the title.
  if (accent) {
    const accentSize = Math.round(fontSize * 0.44);
    ctx.font = `${accentSize}px "Kaushan Script", cursive`;
    const accentW = ctx.measureText(accent).width;
    const accentX = titleX - titleW / 2 + accentW * 0.34;
    const accentY = titleY - Math.round(fontSize * 0.60);

    ctx.save();
    ctx.translate(accentX, accentY);
    ctx.rotate(-0.07);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = Math.max(1, Math.round(accentSize / 22));
    ctx.shadowOffsetY = Math.max(1, Math.round(accentSize / 22));
    ctx.lineWidth = Math.max(2, Math.round(accentSize / 13));
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#160409';
    ctx.strokeText(accent, 0, 0);
    const accentGrad = ctx.createLinearGradient(0, -accentSize / 2, 0, accentSize / 2);
    accentGrad.addColorStop(0, '#fff3b0');
    accentGrad.addColorStop(0.55, '#ffb703');
    accentGrad.addColorStop(1, '#ff5e62');
    ctx.fillStyle = accentGrad;
    ctx.fillText(accent, 0, 0);

    // Caption FX on the script accent: an accent rim, or a halo redrawn
    // over the gradient fill.
    if (fx === 'outline') {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.lineWidth = Math.max(1.5, Math.round(accentSize / 18));
      ctx.strokeStyle = fxAccent;
      ctx.strokeText(accent, 0, 0);
    } else if (fx === 'glow') {
      ctx.shadowColor = fxAccent;
      ctx.shadowBlur = Math.round(accentSize * 0.55);
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillText(accent, 0, 0);
      ctx.fillText(accent, 0, 0);
    }
    ctx.restore();

    ctx.font = `${fontSize}px "Anton", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
  }

  // Subtitle on solid black plate with accent bar
  if (subtitle) {
    const subFontSize = Math.max(12, Math.round(fontSize * 0.32));
    ctx.font = `${subFontSize}px "Anton", sans-serif`;
    const cleanSub = (subtitle || '').toUpperCase();
    const subY = titleY + Math.round(fontSize * 0.58);

    // Letterspaced effect simulation
    const letterSpacing = Math.round(subFontSize * 0.12);
    let totalTextW = 0;
    for (let i = 0; i < cleanSub.length; i++) {
      totalTextW += ctx.measureText(cleanSub[i]).width + (i < cleanSub.length - 1 ? letterSpacing : 0);
    }

    const padX = Math.round(subFontSize * 0.6);
    const padY = Math.round(subFontSize * 0.32);
    const plateW = totalTextW + padX * 2 + 4; // +4 for accent bar on left edge
    const plateH = subFontSize + padY * 2;
    const plateX = titleX - plateW / 2;
    const plateY = subY - plateH / 2;

    // Solid black plate; the glow FX lights it from behind in the accent.
    const accentColor = GRADE_ACCENTS[gradeKey] || '#ff9e3d';
    if (fx === 'glow') {
      ctx.save();
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = Math.round(subFontSize * 0.9);
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillStyle = '#000000';
      ctx.fillRect(plateX, plateY, plateW, plateH);
      ctx.fillRect(plateX, plateY, plateW, plateH);
      ctx.restore();
    } else {
      ctx.fillStyle = '#000000';
      ctx.fillRect(plateX, plateY, plateW, plateH);
    }

    // 4px accent-colour bar on plate's left edge
    ctx.fillStyle = accentColor;
    ctx.fillRect(plateX, plateY, 4, plateH);

    // Caption FX "outline": the plate is framed in the accent colour.
    if (fx === 'outline') {
      ctx.save();
      ctx.lineWidth = 2;
      ctx.strokeStyle = accentColor;
      ctx.strokeRect(plateX + 1, plateY + 1, plateW - 2, plateH - 2);
      ctx.restore();
    }

    // Subtitle text in white letterspaced uppercase
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    let curX = plateX + 4 + padX;
    for (let i = 0; i < cleanSub.length; i++) {
      const char = cleanSub[i];
      ctx.fillText(char, curX, subY);
      curX += ctx.measureText(char).width + letterSpacing;
    }
  }

  ctx.restore();
}

export function addFilmGrain(ctx, w, h, intensity = 0.02) {
  ctx.save();
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;
  const len = data.length;
  const step = 4; // every pixel or sampled

  for (let i = 0; i < len; i += step) {
    const noise = (Math.random() - 0.5) * intensity * 255;
    data[i]     = Math.min(255, Math.max(0, data[i] + noise));     // R
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise)); // G
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise)); // B
  }

  ctx.putImageData(imgData, 0, 0);
  ctx.restore();
}

/**
 * Breakout hero: the first panel's photo is redrawn larger, spilling over
 * its inner edge onto the neighbouring panels with a slanted far edge, a
 * white keyline border and a drop shadow — the pop-out poster treatment.
 * Applies to the poster layout, to duo (stacked or side by side) and to
 * split, whose full-height left hero spills onto the two stacked panels.
 */
export function drawBreakoutHero(ctx, state, panels, keylineWidth) {
  if (state.spread || state.breakout === false) return;
  if (state.layout !== 'poster' && state.layout !== 'duo' && state.layout !== 'split') return;

  const hero = panels[0];
  const photos = state.photos || [];
  if (!hero || photos.length === 0) return;

  const panelState = state.panelStates && state.panelStates[0]
    ? state.panelStates[0]
    : { photoIdx: 0, zoom: 1, panX: 0, panY: 0 };
  const img = photos[(panelState.photoIdx || 0) % photos.length];
  if (!img || !img.complete || !img.naturalWidth) return;

  const { width: w, height: h } = ctx.canvas;
  const stacked = state.layout === 'poster' || hero.w >= w - 1;
  let pts;
  let bbox;
  if (stacked) {
    const over = Math.round(hero.h * 0.17);
    pts = [
      [hero.x, hero.y],
      [hero.x + hero.w, hero.y],
      [hero.x + hero.w, hero.y + hero.h + Math.round(over * 0.4)],
      [hero.x, hero.y + hero.h + over]
    ];
    bbox = { x: hero.x, y: hero.y, w: hero.w, h: hero.h + over };
  } else {
    const over = Math.round(hero.w * 0.15);
    pts = [
      [hero.x, hero.y],
      [hero.x + hero.w + over, hero.y],
      [hero.x + hero.w + Math.round(over * 0.4), hero.y + hero.h],
      [hero.x, hero.y + hero.h]
    ];
    bbox = { x: hero.x, y: hero.y, w: hero.w + over, h: hero.h };
  }

  const tracePath = () => {
    ctx.beginPath();
    pts.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
    ctx.closePath();
  };

  // Shadow pass: a filled silhouette casts the drop shadow.
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = Math.round(w * 0.018);
  ctx.shadowOffsetY = Math.round(w * 0.007);
  tracePath();
  ctx.fillStyle = '#000000';
  ctx.fill();
  ctx.restore();

  // The hero photo, cover-fitted to the breakout's bounding box.
  ctx.save();
  tracePath();
  ctx.clip();
  ctx.fillStyle = '#111';
  ctx.fillRect(bbox.x, bbox.y, bbox.w, bbox.h);
  const recipe = GRADE_RECIPES[state.grade] || GRADE_RECIPES.sunset;
  const rect = coverFitSourceRect(
    img.naturalWidth,
    img.naturalHeight,
    bbox.w,
    bbox.h,
    panelState.zoom || 1,
    panelState.panX || 0,
    panelState.panY || 0
  );
  ctx.filter = recipe.filter;
  ctx.drawImage(img, rect.sx, rect.sy, rect.sw, rect.sh, bbox.x, bbox.y, bbox.w, bbox.h);
  ctx.restore();

  // Keyline border: dark outer rim, then the white keyline.
  ctx.save();
  tracePath();
  ctx.lineWidth = keylineWidth * 1.5 + 3;
  ctx.strokeStyle = 'rgba(10, 4, 8, 0.85)';
  ctx.stroke();
  tracePath();
  ctx.lineWidth = keylineWidth * 1.5;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();
  ctx.restore();
}

/**
 * Cast/role tags: small tilted plates pinned to the lower-left of a panel
 * ("THE DRIVER", "THE SIREN"). state.tags is a list of {panel, label};
 * when unset, the poster layout tags its two character panels.
 */
export function drawRoleTags(ctx, state, panels) {
  let tags = state.tags;
  if (!tags) {
    tags = state.layout === 'poster'
      ? [
          { panel: 1, label: 'THE DRIVER' },
          { panel: 2, label: 'THE SIREN' }
        ]
      : [];
  }
  if (!tags.length) return;

  const { width: w, height: h } = ctx.canvas;
  const accentColor = GRADE_ACCENTS[state.grade] || '#ff9e3d';
  const fontSize = Math.max(12, Math.round(Math.min(w, h) * 0.024));

  for (const tag of tags) {
    const panel = panels[tag.panel];
    if (!panel || !tag.label) continue;

    ctx.save();
    ctx.font = `${fontSize}px "Anton", sans-serif`;
    ctx.textBaseline = 'middle';
    const spacing = Math.round(fontSize * 0.14);
    const textW = spacedTextWidth(ctx, tag.label, spacing);
    const plateW = Math.ceil(textW + fontSize * 1.15);
    const plateH = Math.round(fontSize * 1.55);
    const px = panel.x + Math.round(w * 0.012) + 4;
    // Panels that end at the canvas's bottom edge share that band with the
    // billing block, so their tags ride above it instead of colliding.
    const atCanvasBottom = panel.y + panel.h >= h - 2;
    const lift = atCanvasBottom && state.furniture !== false ? Math.round(h * 0.088) : 0;
    const py = panel.y + panel.h - plateH - Math.round(h * 0.014) - 4 - lift;
    if (plateW > panel.w - 8) {
      ctx.restore();
      continue;
    }

    ctx.translate(px + plateW / 2, py + plateH / 2);
    ctx.rotate(-0.03);
    ctx.translate(-plateW / 2, -plateH / 2);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = Math.round(fontSize * 0.35);
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = 'rgba(8, 4, 10, 0.9)';
    ctx.fillRect(0, 0, plateW, plateH);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    ctx.fillStyle = accentColor;
    ctx.fillRect(0, 0, 4, plateH);
    ctx.fillStyle = '#ffffff';
    drawSpacedText(ctx, tag.label, 4 + fontSize * 0.38, plateH / 2 + 1, spacing);
    ctx.restore();
  }
}

/**
 * The circular seal: a gold-rimmed badge in the lower-right with the
 * studio name curved around a star. Static text, drawn fresh each render.
 */
export function drawSeal(ctx, w, h, gradeKey = 'sunset') {
  const r = Math.round(Math.min(w, h) * 0.082);
  if (r < 26) return;
  const cx = w - r - Math.round(w * 0.02);
  const cy = h - r - Math.round(h * 0.075);
  const accentColor = GRADE_ACCENTS[gradeKey] || '#ff9e3d';

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.1);

  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = Math.round(r * 0.22);
  ctx.shadowOffsetY = Math.round(r * 0.06);
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = '#12060d';
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Gold rim and inner disc.
  ctx.lineWidth = Math.max(2, Math.round(r * 0.05));
  ctx.strokeStyle = '#ffd23d';
  ctx.beginPath();
  ctx.arc(0, 0, r - ctx.lineWidth / 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.7, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(24, 8, 18, 0.95)';
  ctx.fill();
  ctx.lineWidth = Math.max(1, Math.round(r * 0.025));
  ctx.strokeStyle = accentColor;
  ctx.stroke();

  // Curved studio text around the band.
  const ringText = 'VICE CANVAS ★ ORIGINAL COVER ART ★ ';
  const bandFont = Math.round(r * 0.225);
  ctx.font = `${bandFont}px "Anton", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffd23d';
  const textRadius = r * 0.845;
  const step = (Math.PI * 2) / ringText.length;
  for (let i = 0; i < ringText.length; i++) {
    ctx.save();
    ctx.rotate(-Math.PI / 2 + i * step);
    ctx.translate(0, -textRadius);
    ctx.fillText(ringText[i], 0, 0);
    ctx.restore();
  }

  // Star and year in the middle.
  starPath(ctx, 0, -r * 0.14, r * 0.3, r * 0.135);
  ctx.fillStyle = '#ffd23d';
  ctx.fill();
  ctx.font = `${Math.round(r * 0.17)}px "Anton", sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText('EST. 2026', 0, r * 0.36);

  ctx.restore();
}

/**
 * The movie-poster billing block: two lines of tiny letterspaced credits
 * along the bottom edge, over a soft dark strip so they stay legible.
 */
export function drawBillingBlock(ctx, w, h, state) {
  const title = (state.title || 'UNTITLED').toUpperCase();
  const lines = [
    `VICE CANVAS PICTURES PRESENTS A VESPER BAY STORY "${title}" STARRING THE DRIVER AND THE SIREN`,
    'MUSIC BY THE NEON PALMS · COSTUMES CHROME & GRAIN · EDITED BY A. CUTTER · MADE WITH VICE CANVAS'
  ];

  ctx.save();
  const stripH = Math.round(h * 0.085);
  const stripGrad = ctx.createLinearGradient(0, h - stripH, 0, h);
  stripGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  stripGrad.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
  ctx.fillStyle = stripGrad;
  ctx.fillRect(0, h - stripH, w, stripH);

  let fontSize = Math.max(10, Math.round(w * 0.0115));
  ctx.textBaseline = 'middle';
  const spacingFor = (fs) => Math.max(1, Math.round(fs * 0.12));
  const fitFont = (text) => {
    let fs = fontSize;
    ctx.font = `${fs}px "Anton", sans-serif`;
    while (spacedTextWidth(ctx, text, spacingFor(fs)) > w * 0.96 && fs > 8) {
      fs -= 1;
      ctx.font = `${fs}px "Anton", sans-serif`;
    }
    return fs;
  };

  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 2;

  const lineGap = Math.round(fontSize * 1.45);
  const lastLineY = h - Math.round(h * 0.016) - Math.round(fontSize * 0.5);
  lines.forEach((line, i) => {
    const fs = fitFont(line);
    const y = lastLineY - (lines.length - 1 - i) * lineGap;
    const lineW = spacedTextWidth(ctx, line, spacingFor(fs));
    drawSpacedText(ctx, line, (w - lineW) / 2, y, spacingFor(fs));
  });

  ctx.restore();
}

export function drawCover(ctx, state) {
  const { width: w, height: h } = ctx.canvas;

  // 1. Fill background white
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);

  // Get layout panels
  const layoutFn = PANEL_LAYOUTS[state.layout] || PANEL_LAYOUTS.poster;
  const panels = layoutFn(w, h);

  const photos = state.photos || [];

  if (state.spread && photos.length > 0) {
    // Spread mode: one photo drawn once across the whole canvas
    ctx.save();
    const photoIdx = state.spreadPhotoIdx || 0;
    const img = photos[photoIdx % photos.length];
    if (img && img.complete && img.naturalWidth) {
      const rect = coverFitSourceRect(img.naturalWidth, img.naturalHeight, w, h, state.spreadZoom || 1, state.spreadPanX || 0, state.spreadPanY || 0);
      const recipe = GRADE_RECIPES[state.grade] || GRADE_RECIPES.sunset;
      ctx.filter = recipe.filter;
      ctx.drawImage(img, rect.sx, rect.sy, rect.sw, rect.sh, 0, 0, w, h);
    }
    ctx.restore();
  } else {
    // Normal panel mode
    const recipe = GRADE_RECIPES[state.grade] || GRADE_RECIPES.sunset;

    panels.forEach((panel, idx) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(panel.x, panel.y, panel.w, panel.h);
      ctx.clip();

      // Background inside panel incase photo loading
      ctx.fillStyle = '#111';
      ctx.fillRect(panel.x, panel.y, panel.w, panel.h);

      const panelState = state.panelStates && state.panelStates[idx] ? state.panelStates[idx] : { photoIdx: idx, zoom: 1, panX: 0, panY: 0 };
      const photoIdx = panelState.photoIdx !== undefined ? panelState.photoIdx : idx;
      const img = photos[photoIdx % photos.length];

      if (img && img.complete && img.naturalWidth) {
        const sourceRect = coverFitSourceRect(
          img.naturalWidth,
          img.naturalHeight,
          panel.w,
          panel.h,
          panelState.zoom || 1,
          panelState.panX || 0,
          panelState.panY || 0
        );

        ctx.filter = recipe.filter;
        ctx.drawImage(
          img,
          sourceRect.sx, sourceRect.sy, sourceRect.sw, sourceRect.sh,
          panel.x, panel.y, panel.w, panel.h
        );
      }
      ctx.restore();
    });
  }

  // Keylines (white panel separators bold, scaling with canvas width: ~0.6% canvas width, min 4px)
  ctx.save();
  const keylineWidth = Math.max(4, Math.round(w * 0.006));
  ctx.lineWidth = keylineWidth;
  ctx.strokeStyle = '#ffffff';
  for (const panel of panels) {
    ctx.strokeRect(panel.x, panel.y, panel.w, panel.h);
  }
  ctx.restore();

  // Breakout hero panel pops over the grid before the grade unifies it.
  drawBreakoutHero(ctx, state, panels, keylineWidth);

  // 2. Apply colour grade overlay (Edge grade)
  applyColourGrade(ctx, w, h, state.grade);

  // Film grain (half strength: 0.02)
  addFilmGrain(ctx, w, h, 0.02);

  // 3. Vignette (lightened to peak alpha ~0.18 at corners)
  ctx.save();
  const vig = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.85);
  vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vig.addColorStop(1, 'rgba(0, 0, 0, 0.18)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  // Cast/role tags on the character panels
  drawRoleTags(ctx, state, panels);

  // 4. Poster Lettering (chrome title, script accent, subtitle plate)
  drawPosterLettering(ctx, w, h, state);

  // 5. Poster furniture: circular seal + billing block
  if (state.furniture !== false) {
    drawSeal(ctx, w, h, state.grade);
    drawBillingBlock(ctx, w, h, state);
  }
}
