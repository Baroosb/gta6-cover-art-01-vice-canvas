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

export function drawPosterLettering(ctx, w, h, title, subtitle, gradeKey = 'sunset') {
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

  const titleX = w / 2;
  const titleY = bannerY + Math.round(bannerH * 0.52);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Hard shadow & outline
  ctx.shadowColor = 'rgba(0, 0, 0, 1)';
  ctx.shadowBlur = 0;
  const shadowOffset = Math.max(1, Math.round(fontSize / 20));
  ctx.shadowOffsetX = shadowOffset;
  ctx.shadowOffsetY = shadowOffset;

  ctx.lineWidth = Math.max(3, Math.round(fontSize / 14));
  ctx.strokeStyle = '#000000';
  ctx.strokeText(cleanTitle, titleX, titleY);

  ctx.fillStyle = '#ffffff';
  ctx.fillText(cleanTitle, titleX, titleY);

  // Reset shadow for subtitle plate
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

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

    // Solid black plate
    ctx.fillStyle = '#000000';
    ctx.fillRect(plateX, plateY, plateW, plateH);

    // 4px accent-colour bar on plate's left edge
    const accentColors = {
      sunset: '#ff9e3d',
      neon: '#22d3ee',
      golden: '#fbbf24',
      raw: '#e5e7eb'
    };
    const accentColor = accentColors[gradeKey] || '#ff9e3d';
    ctx.fillStyle = accentColor;
    ctx.fillRect(plateX, plateY, 4, plateH);

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

  // 4. Poster Lettering (Title & Subtitle)
  drawPosterLettering(ctx, w, h, state.title, state.subtitle, state.grade);
}
