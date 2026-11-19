// VICE CANVAS - Pure Cover Composition Engine

export const PANEL_LAYOUTS = {
  poster: (w, h) => {
    const isPortrait = h > w;
    const heroH = Math.round(h * (isPortrait ? 0.38 : 0.46));
    const pad = Math.round(w * 0.015);
    const bottomH = h - heroH - pad * 3;
    const bottomY = heroH + pad * 2;
    const bottomW = Math.round((w - pad * 4) / 3);

    return [
      // Hero top panel
      { x: pad, y: pad, w: w - pad * 2, h: heroH },
      // Three bottom panels
      { x: pad, y: bottomY, w: bottomW, h: bottomH },
      { x: pad * 2 + bottomW, y: bottomY, w: bottomW, h: bottomH },
      { x: pad * 3 + bottomW * 2, y: bottomY, w: w - pad * 3 - bottomW * 2, h: bottomH }
    ];
  },

  six: (w, h) => {
    const pad = Math.round(w * 0.012);
    const cols = 2;
    const rows = 3;
    const panelW = Math.round((w - pad * (cols + 1)) / cols);
    const panelH = Math.round((h - pad * (rows + 1)) / rows);
    const panels = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        panels.push({
          x: pad + c * (panelW + pad),
          y: pad + r * (panelH + pad),
          w: c === cols - 1 ? w - (pad + c * (panelW + pad)) - pad : panelW,
          h: r === rows - 1 ? h - (pad + r * (panelH + pad)) - pad : panelH
        });
      }
    }
    return panels;
  },

  duo: (w, h) => {
    const pad = Math.round(w * 0.015);
    const isPortrait = h >= w;
    if (isPortrait) {
      const halfH = Math.round((h - pad * 3) / 2);
      return [
        { x: pad, y: pad, w: w - pad * 2, h: halfH },
        { x: pad, y: pad * 2 + halfH, w: w - pad * 2, h: h - halfH - pad * 3 }
      ];
    } else {
      const halfW = Math.round((w - pad * 3) / 2);
      return [
        { x: pad, y: pad, w: halfW, h: h - pad * 2 },
        { x: pad * 2 + halfW, y: pad, w: w - halfW - pad * 3, h: h - pad * 2 }
      ];
    }
  },

  quad: (w, h) => {
    const pad = Math.round(w * 0.015);
    const halfW = Math.round((w - pad * 3) / 2);
    const halfH = Math.round((h - pad * 3) / 2);
    return [
      { x: pad, y: pad, w: halfW, h: halfH },
      { x: pad * 2 + halfW, y: pad, w: w - halfW - pad * 3, h: halfH },
      { x: pad, y: pad * 2 + halfH, w: halfW, h: h - halfH - pad * 3 },
      { x: pad * 2 + halfW, y: pad * 2 + halfH, w: w - halfW - pad * 3, h: h - halfH - pad * 3 }
    ];
  }
};

export const GRADE_RECIPES = {
  sunset: {
    name: 'Sunset Vice',
    filter: 'saturate(1.3) contrast(1.15) brightness(1.05)',
    overlay: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(255, 42, 109, 0.25)'); // Magenta top
      grad.addColorStop(0.5, 'rgba(255, 183, 3, 0.1)');   // Golden middle
      grad.addColorStop(1, 'rgba(5, 217, 232, 0.35)');    // Cyan bottom
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  },
  neon: {
    name: 'Neon Nights',
    filter: 'saturate(1.5) contrast(1.25) brightness(0.95)',
    overlay: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, 'rgba(5, 217, 232, 0.3)');
      grad.addColorStop(0.5, 'rgba(131, 56, 236, 0.2)');
      grad.addColorStop(1, 'rgba(255, 0, 110, 0.35)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  },
  golden: {
    name: 'Golden Hour',
    filter: 'saturate(1.2) contrast(1.1) brightness(1.1) sepia(0.2)',
    overlay: (ctx, w, h) => {
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.3, w * 0.1, w * 0.5, h * 0.5, w * 0.8);
      grad.addColorStop(0, 'rgba(255, 200, 50, 0.3)');
      grad.addColorStop(1, 'rgba(180, 40, 100, 0.25)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  },
  raw: {
    name: 'Raw Print',
    filter: 'saturate(1.05) contrast(1.05) brightness(1.0)',
    overlay: (ctx, w, h) => {
      ctx.fillStyle = 'rgba(20, 15, 30, 0.08)';
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

export function drawPosterLettering(ctx, w, h, title, subtitle) {
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
  const maxTextW = w * 0.92;
  let fontSize = Math.round(h * 0.085);
  ctx.font = `${fontSize}px "Anton", sans-serif`;

  const cleanTitle = (title || '').toUpperCase();
  let metrics = ctx.measureText(cleanTitle);

  // Auto-shrink to fit 92% width
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
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 4;

  ctx.lineWidth = Math.max(3, Math.round(fontSize * 0.06));
  ctx.strokeStyle = '#000000';
  ctx.strokeText(cleanTitle, titleX, titleY);

  ctx.fillStyle = '#ffffff';
  ctx.fillText(cleanTitle, titleX, titleY);

  // Subtitle
  if (subtitle) {
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    const subFontSize = Math.max(12, Math.round(fontSize * 0.32));
    // Letterspaced effect simulation or CSS letterspacing equivalent
    ctx.font = `${subFontSize}px "Anton", sans-serif`;
    const cleanSub = (subtitle || '').toUpperCase();
    const subY = titleY + Math.round(fontSize * 0.55);

    ctx.fillStyle = '#05d9e8'; // Neon cyan accent
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = Math.max(2, Math.round(subFontSize * 0.08));
    ctx.strokeText(cleanSub, titleX, subY);
    ctx.fillText(cleanSub, titleX, subY);
  }

  ctx.restore();
}

export function addFilmGrain(ctx, w, h, intensity = 0.04) {
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

    // White keylines over panel borders
    ctx.save();
    ctx.lineWidth = Math.max(2, Math.round(w * 0.008));
    ctx.strokeStyle = '#ffffff';
    for (const panel of panels) {
      ctx.strokeRect(panel.x, panel.y, panel.w, panel.h);
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

      // Panel border keyline (clean white border)
      ctx.save();
      ctx.lineWidth = Math.max(2, Math.round(w * 0.004));
      ctx.strokeStyle = '#ffffff';
      ctx.strokeRect(panel.x, panel.y, panel.w, panel.h);
      ctx.restore();
    });
  }

  // 2. Apply colour grade overlay
  applyColourGrade(ctx, w, h, state.grade);

  // 3. Vignette
  ctx.save();
  const vig = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.85);
  vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vig.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  // 4. Poster Lettering (Title & Subtitle)
  drawPosterLettering(ctx, w, h, state.title, state.subtitle);
}
