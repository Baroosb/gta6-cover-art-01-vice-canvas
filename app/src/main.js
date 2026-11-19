// VICE CANVAS - Editor Wiring & App Logic

import { drawCover, PANEL_LAYOUTS } from './cover.js';

const SAMPLE_FILES = [
  'boulevard-car.jpg',
  'neon-man.jpg',
  'neon-woman.jpg',
  'pier-sunset.jpg'
];

// App State
const state = {
  photos: [],
  photoNames: [],
  panelStates: [
    { photoIdx: 0, zoom: 1, panX: 0, panY: 0 },
    { photoIdx: 1, zoom: 1, panX: 0, panY: 0 },
    { photoIdx: 2, zoom: 1, panX: 0, panY: 0 },
    { photoIdx: 3, zoom: 1, panX: 0, panY: 0 }
  ],
  selectedPanel: 0,
  layout: 'poster',
  grade: 'sunset',
  spread: false,
  spreadPhotoIdx: 0,
  spreadZoom: 1,
  spreadPanX: 0,
  spreadPanY: 0,
  title: 'VICE HEAT',
  subtitle: 'ONE CITY, FOUR STORIES',
  width: 1080,
  height: 1350
};

// DOM Elements
const canvas = document.getElementById('cover-canvas');
const ctx = canvas.getContext('2d');
const thumbnailsContainer = document.getElementById('thumbnails');
const layoutButtons = document.querySelectorAll('#layout-buttons .ctrl-btn');
const gradeButtons = document.querySelectorAll('#grade-buttons .ctrl-btn');
const sizeButtons = document.querySelectorAll('#size-buttons .ctrl-btn');
const titleInput = document.getElementById('title-input');
const subtitleInput = document.getElementById('subtitle-input');
const spreadToggle = document.getElementById('spread-toggle');
const zoomSlider = document.getElementById('zoom-slider');
const zoomValueLabel = document.getElementById('zoom-value');
const exportBtn = document.getElementById('export-btn');
const photoInput = document.getElementById('photo-input');
const statusLine = document.getElementById('status');
const panelHint = document.getElementById('panel-hint');

function setStatus(msg) {
  if (statusLine) {
    statusLine.textContent = msg;
    statusLine.style.opacity = '1';
  }
}

function render() {
  canvas.width = state.width;
  canvas.height = state.height;
  drawCover(ctx, state);
  updateThumbnailsUI();
}

function updateThumbnailsUI() {
  if (!thumbnailsContainer) return;
  thumbnailsContainer.innerHTML = '';
  state.photos.forEach((img, idx) => {
    const item = document.createElement('div');
    item.className = 'thumb-item';

    // Check if assigned to selected panel or spread photo
    const activeIdx = state.spread ? state.spreadPhotoIdx : (state.panelStates[state.selectedPanel]?.photoIdx ?? 0);
    if (activeIdx === idx) {
      item.classList.add('active');
    }

    const imageEl = document.createElement('img');
    imageEl.src = img.src;
    imageEl.alt = state.photoNames[idx] || `Photo ${idx + 1}`;
    item.appendChild(imageEl);

    item.addEventListener('click', () => {
      if (state.spread) {
        state.spreadPhotoIdx = idx;
        setStatus(`Spread photo assigned to sample #${idx + 1}`);
      } else {
        if (!state.panelStates[state.selectedPanel]) {
          state.panelStates[state.selectedPanel] = { photoIdx: idx, zoom: 1, panX: 0, panY: 0 };
        } else {
          state.panelStates[state.selectedPanel].photoIdx = idx;
        }
        setStatus(`Assigned photo to panel #${state.selectedPanel + 1}`);
      }
      render();
    });

    thumbnailsContainer.appendChild(item);
  });
}

function updateZoomSliderUI() {
  const currentZoom = state.spread ? state.spreadZoom : (state.panelStates[state.selectedPanel]?.zoom || 1);
  if (zoomSlider) zoomSlider.value = currentZoom;
  if (zoomValueLabel) zoomValueLabel.textContent = `${currentZoom.toFixed(2)}x`;
}

// Load Bundled Samples
async function loadSamples() {
  const promises = SAMPLE_FILES.map(filename => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ img, name: filename });
      img.onerror = () => resolve(null);
      img.src = `./samples/${filename}`;
    });
  });

  const results = await Promise.all(promises);
  results.forEach(res => {
    if (res) {
      state.photos.push(res.img);
      state.photoNames.push(res.name);
    }
  });

  render();
}

// Canvas Interaction (Click to select panel, Drag to pan, Wheel to zoom)
let isDragging = false;
let startX = 0;
let startY = 0;

canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  if (state.spread) {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    return;
  }

  // Find clicked panel
  const layoutFn = PANEL_LAYOUTS[state.layout] || PANEL_LAYOUTS.poster;
  const panels = layoutFn(canvas.width, canvas.height);
  let clickedIdx = -1;
  panels.forEach((p, idx) => {
    if (x >= p.x && x <= p.x + p.w && y >= p.y && y <= p.y + p.h) {
      clickedIdx = idx;
    }
  });

  if (clickedIdx !== -1) {
    state.selectedPanel = clickedIdx;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;

    if (panelHint) {
      const panelNames = state.layout === 'poster' ? ['Hero Top', 'Bottom Left', 'Bottom Center', 'Bottom Right'] : panels.map((_, i) => `Panel #${i+1}`);
      panelHint.textContent = `Selected: ${panelNames[clickedIdx] || 'Panel #' + (clickedIdx+1)} (Drag to pan, Scroll to zoom)`;
    }

    updateZoomSliderUI();
    render();
    setStatus(`Selected panel #${clickedIdx + 1}`);
  }
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  startX = e.clientX;
  startY = e.clientY;

  const panScale = 0.005;
  if (state.spread) {
    state.spreadPanX = (state.spreadPanX || 0) - dx * panScale;
    state.spreadPanY = (state.spreadPanY || 0) - dy * panScale;
  } else {
    const pState = state.panelStates[state.selectedPanel];
    if (pState) {
      pState.panX = (pState.panX || 0) - dx * panScale;
      pState.panY = (pState.panY || 0) - dy * panScale;
    }
  }
  render();
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const zoomDelta = e.deltaY < 0 ? 0.05 : -0.05;

  if (state.spread) {
    state.spreadZoom = Math.max(1, Math.min(3, (state.spreadZoom || 1) + zoomDelta));
  } else {
    const pState = state.panelStates[state.selectedPanel];
    if (pState) {
      pState.zoom = Math.max(1, Math.min(3, (pState.zoom || 1) + zoomDelta));
    }
  }
  updateZoomSliderUI();
  render();
}, { passive: false });

// Wire UI controls
function loadFiles(files) {
  if (!files || files.length === 0) return;
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = new Image();
      img.onload = () => {
        state.photos.push(img);
        state.photoNames.push(file.name);
        render();
        setStatus(`Loaded uploaded photo: ${file.name}`);
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  });
}

if (photoInput) {
  photoInput.addEventListener('change', (e) => {
    loadFiles(e.target.files);
  });
}

const stageEl = document.querySelector('.stage');
if (stageEl) {
  stageEl.addEventListener('dragover', (e) => {
    e.preventDefault();
    stageEl.classList.add('drop-ready');
  });
  stageEl.addEventListener('dragleave', (e) => {
    stageEl.classList.remove('drop-ready');
  });
  stageEl.addEventListener('drop', (e) => {
    e.preventDefault();
    stageEl.classList.remove('drop-ready');
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      loadFiles(files);
      setStatus(`Added ${files.length} photo(s) by drop`);
    }
  });
}

layoutButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    layoutButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.layout = btn.getAttribute('data-layout');
    // Ensure panelStates has enough entries
    const layoutFn = PANEL_LAYOUTS[state.layout] || PANEL_LAYOUTS.poster;
    const count = layoutFn(state.width, state.height).length;
    while (state.panelStates.length < count) {
      state.panelStates.push({ photoIdx: 0, zoom: 1, panX: 0, panY: 0 });
    }
    if (state.selectedPanel >= count) state.selectedPanel = 0;
    render();
    setStatus(`Switched layout to ${state.layout}`);
  });
});

gradeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    gradeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.grade = btn.getAttribute('data-grade');
    render();
    setStatus(`Applied colour grade: ${btn.textContent}`);
  });
});

sizeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    sizeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.width = parseInt(btn.getAttribute('data-w'), 10);
    state.height = parseInt(btn.getAttribute('data-h'), 10);
    render();
    setStatus(`Canvas size set to ${state.width}x${state.height}`);
  });
});

if (titleInput) {
  titleInput.addEventListener('input', () => {
    state.title = titleInput.value;
    render();
  });
}

if (subtitleInput) {
  subtitleInput.addEventListener('input', () => {
    state.subtitle = subtitleInput.value;
    render();
  });
}

if (spreadToggle) {
  spreadToggle.addEventListener('change', () => {
    state.spread = spreadToggle.checked;
    updateZoomSliderUI();
    render();
    setStatus(state.spread ? 'Spread mode enabled (full image across canvas)' : 'Panel mode enabled');
  });
}

if (zoomSlider) {
  zoomSlider.addEventListener('input', () => {
    const val = parseFloat(zoomSlider.value);
    if (state.spread) {
      state.spreadZoom = val;
    } else {
      const pState = state.panelStates[state.selectedPanel];
      if (pState) pState.zoom = val;
    }
    updateZoomSliderUI();
    render();
  });
}

if (exportBtn) {
  exportBtn.addEventListener('click', () => {
    const offCanvas = document.createElement('canvas');
    offCanvas.width = state.width;
    offCanvas.height = state.height;
    const offCtx = offCanvas.getContext('2d');
    drawCover(offCtx, state);

    const link = document.createElement('a');
    link.download = `vice-canvas-${state.width}x${state.height}.png`;
    link.href = offCanvas.toDataURL('image/png');
    link.click();
    setStatus(`Exported PNG cover (${state.width}x${state.height})`);
  });
}

// Query Parameter & Shot Contract Parsing
async function initFromQuery() {
  const params = new URLSearchParams(window.location.search);

  // Shot mode
  const shot = params.get('shot');
  if (shot === 'cover') {
    document.body.classList.add('shot-cover');
  }

  // Size
  const sizeParam = params.get('size');
  if (sizeParam) {
    const [wStr, hStr] = sizeParam.split('x');
    const w = parseInt(wStr, 10);
    const h = parseInt(hStr, 10);
    if (w && h) {
      state.width = w;
      state.height = h;
      sizeButtons.forEach(b => {
        if (b.getAttribute('data-w') === wStr && b.getAttribute('data-h') === hStr) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
    }
  }

  // Layout
  const layoutParam = params.get('layout');
  if (layoutParam && PANEL_LAYOUTS[layoutParam]) {
    state.layout = layoutParam;
    layoutButtons.forEach(b => {
      if (b.getAttribute('data-layout') === layoutParam) b.classList.add('active');
      else b.classList.remove('active');
    });
  }

  // Grade
  const gradeParam = params.get('grade');
  if (gradeParam) {
    state.grade = gradeParam;
    gradeButtons.forEach(b => {
      if (b.getAttribute('data-grade') === gradeParam) b.classList.add('active');
      else b.classList.remove('active');
    });
  }

  // Caption / Title
  const captionParam = params.get('caption');
  if (captionParam) {
    state.title = captionParam;
    if (titleInput) titleInput.value = captionParam;
  }

  // Load samples first
  await loadSamples();

  // Specific photo featured in hero
  const photoParam = params.get('photo');
  if (photoParam) {
    const idx = state.photoNames.findIndex(n => n.includes(photoParam));
    if (idx !== -1) {
      state.panelStates[0].photoIdx = idx;
    }
  }

  render();

  // Signal shot readiness for tests / scoring
  window.__shotReady = true;
  setStatus('Ready');
}

// Wait for Anton font to load before rendering
if (document.fonts && document.fonts.load) {
  document.fonts.load('1em Anton').then(() => {
    initFromQuery();
  }).catch(() => {
    initFromQuery();
  });
} else {
  window.addEventListener('load', () => {
    initFromQuery();
  });
}
