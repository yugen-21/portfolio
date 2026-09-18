import React from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { drawMotif } from "./motifs.js";
import { FOV, TILT, PULL_TURN, SHELF_MAX_HEIGHT, hash, seeded, deriveLayout, frameFor, shelfBox } from "./bookLayout.js";

/**
 * The books standing on one shelf. Ported from Componentry's Newsletter
 * Bookshelf (https://componentry.dev/docs/components/newsletter-bookshelf):
 * the cloth-and-foil textures, the page-edge paper, the seeded proportions and
 * motifs, and the pull-out-and-turn motion are theirs.
 *
 * Departures from the original, all deliberate:
 * - Plain three.js rather than @react-three/fiber, which this project does not
 *   ship. One renderer per shelf, and it only draws while something moves.
 * - No shelf, camera dolly or orbit. `ShelfRail` is the shelf; a row of three
 *   or four books is framed whole, so there is nothing to scroll to.
 * - Selecting a book pulls it out in place and turns its cover to you instead
 *   of flying it to the middle of the stage — the project panel takes over
 *   from there.
 * - Hit areas are real buttons laid over each book (focus, Enter/Space, a
 *   label) instead of raycasting a canvas.
 * - Titles and meta are set in the site's Instrument Serif and Switzer, and
 *   the books are thicker so a project name reads on the spine.
 * - Every spine sits in one plane, flush with the front of the shelf.
 *
 * Layout: the component's box bottom is the books' base line — it pulls the
 * canvas's lower margin back out with a negative margin, so whatever follows
 * in flow (the rail) starts exactly where the books stand. Put it in a flex
 * column: in plain block flow that margin collapses with a following negative
 * margin instead of adding to it. The box comes from `shelfBox` in
 * bookLayout.js, so a placeholder can hold the same space before this loads.
 *
 * Pass a stable `books` array (a module constant, or memoised): a new array
 * rebuilds the scene and its textures.
 */

const SERIF = '"Instrument Serif", Georgia, serif';
const SANS = "Switzer, system-ui, sans-serif";

const HOVER_LIFT = 0.25;
const HOVER_PULL = 0.22;
const PULL_LIFT = 0.3;
const PULL_OUT = 1.1;
const PULL_SCALE = 0.96;
const BOOK_ENTER_DURATION = 520;
const BOOK_EXIT_DURATION = 400;

function addTexture(context, width, height, seed) {
  const image = context.getImageData(0, 0, width, height);
  const random = seeded(seed);
  for (let offset = 0; offset < image.data.length; offset += 4) {
    const noise = (random() - 0.5) * 5;
    image.data[offset] = Math.max(0, Math.min(255, image.data[offset] + noise));
    image.data[offset + 1] = Math.max(0, Math.min(255, image.data[offset + 1] + noise));
    image.data[offset + 2] = Math.max(0, Math.min(255, image.data[offset + 2] + noise));
  }
  context.putImageData(image, 0, 0);
}

function drawClothWeave(context, width, height, seed) {
  const random = seeded(seed);
  context.save();
  context.lineCap = "round";

  context.globalCompositeOperation = "multiply";
  for (let x = 0.5; x < width; x += 3) {
    context.strokeStyle = `rgba(18, 16, 14, ${0.03 + random() * 0.035})`;
    context.lineWidth = 0.35 + random() * 0.3;
    context.beginPath();
    context.moveTo(x + (random() - 0.5) * 0.5, 0);
    context.lineTo(x + (random() - 0.5) * 0.5, height);
    context.stroke();
  }

  context.globalCompositeOperation = "screen";
  for (let y = 0.5; y < height; y += 3) {
    context.strokeStyle = `rgba(255, 248, 232, ${0.035 + random() * 0.03})`;
    context.lineWidth = 0.3 + random() * 0.25;
    context.beginPath();
    context.moveTo(0, y + (random() - 0.5) * 0.5);
    context.lineTo(width, y + (random() - 0.5) * 0.5);
    context.stroke();
  }

  context.globalCompositeOperation = "overlay";
  for (let index = 0; index < Math.floor((width * height) / 850); index += 1) {
    const x = random() * width;
    const y = random() * height;
    const length = 3 + random() * 13;
    context.strokeStyle = `rgba(255, 255, 255, ${0.035 + random() * 0.055})`;
    context.lineWidth = 0.35 + random() * 0.4;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + (random() - 0.5) * 2, y + length);
    context.stroke();
  }

  context.globalCompositeOperation = "source-over";
  const edgeShade = context.createLinearGradient(0, 0, width, 0);
  edgeShade.addColorStop(0, "rgba(0,0,0,.16)");
  edgeShade.addColorStop(0.045, "rgba(0,0,0,.025)");
  edgeShade.addColorStop(0.5, "rgba(255,255,255,.025)");
  edgeShade.addColorStop(0.955, "rgba(0,0,0,.025)");
  edgeShade.addColorStop(1, "rgba(0,0,0,.18)");
  context.fillStyle = edgeShade;
  context.fillRect(0, 0, width, height);
  context.restore();
}

function canvasTexture(canvas) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function paperTexture(book) {
  const canvas = document.createElement("canvas");
  canvas.width = 192;
  canvas.height = 768;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const random = seeded(hash(`${book.id}-paper`));

  context.fillStyle = "#eee9dc";
  context.fillRect(0, 0, canvas.width, canvas.height);
  addTexture(context, canvas.width, canvas.height, hash(`${book.id}-paper-noise`));

  for (let y = 0.5; y < canvas.height; y += 2) {
    const warm = Math.floor(116 + random() * 35);
    context.strokeStyle = `rgba(${warm}, ${warm - 6}, ${warm - 17}, ${0.09 + random() * 0.1})`;
    context.lineWidth = random() > 0.94 ? 1 : 0.42;
    context.beginPath();
    context.moveTo((random() - 0.5) * 4, y);
    context.bezierCurveTo(canvas.width * 0.33, y + (random() - 0.5) * 0.8, canvas.width * 0.66, y + (random() - 0.5) * 0.8, canvas.width + (random() - 0.5) * 4, y);
    context.stroke();
  }

  for (let x = 0.5; x < canvas.width; x += 4) {
    context.strokeStyle = `rgba(124, 103, 72, ${0.025 + random() * 0.04})`;
    context.lineWidth = 0.35;
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x + (random() - 0.5) * 1.5, canvas.height);
    context.stroke();
  }

  for (let index = 0; index < 170; index += 1) {
    context.fillStyle = `rgba(112, 91, 59, ${0.025 + random() * 0.055})`;
    context.fillRect(random() * canvas.width, random() * canvas.height, 0.5 + random() * 1.2, 0.5 + random() * 2.5);
  }

  const edgeShade = context.createLinearGradient(0, 0, canvas.width, 0);
  edgeShade.addColorStop(0, "rgba(96,72,42,.2)");
  edgeShade.addColorStop(0.08, "rgba(138,112,72,.035)");
  edgeShade.addColorStop(0.5, "rgba(255,255,255,.16)");
  edgeShade.addColorStop(0.92, "rgba(138,112,72,.035)");
  edgeShade.addColorStop(1, "rgba(96,72,42,.18)");
  context.fillStyle = edgeShade;
  context.fillRect(0, 0, canvas.width, canvas.height);

  return canvasTexture(canvas);
}

function wrapLines(context, text, maxWidth) {
  const lines = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (context.measureText(next).width < maxWidth || !line) line = next;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function coverTexture(book, brand, face) {
  const canvas = document.createElement("canvas");
  canvas.width = face === "cover" ? 512 : Math.round((768 * book.width) / book.bookHeight);
  canvas.height = 768;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const { width, height } = canvas;

  context.fillStyle = book.color;
  context.fillRect(0, 0, width, height);
  addTexture(context, width, height, hash(`${book.id}-${face}-noise`));
  drawClothWeave(context, width, height, hash(`${book.id}-${face}-weave`));
  context.fillStyle = book.foil;
  context.strokeStyle = book.foil;
  context.textBaseline = "top";
  context.shadowColor = "rgba(0, 0, 0, .3)";
  context.shadowBlur = 1.4;
  context.shadowOffsetX = 0.8;
  context.shadowOffsetY = 1.1;

  if (face === "cover") {
    const margin = 58;
    context.font = `600 20px ${SANS}`;
    context.fillText(String(book.date).toUpperCase(), margin, 58);
    context.font = `400 70px ${SERIF}`;
    const lines = wrapLines(context, book.title, width - margin * 2).slice(0, 4);
    lines.forEach((text, index) => context.fillText(text, margin, 170 + index * 68));
    const ruleY = 170 + lines.length * 68 + 22;
    context.fillRect(margin, ruleY, 92, 5);
    if (book.subtitle) {
      context.font = `600 17px ${SANS}`;
      context.fillText(book.subtitle.toUpperCase(), margin, ruleY + 30);
    }
    drawMotif(context, book.motif, 316, 510, 130, book.foil);
    context.font = `600 18px ${SANS}`;
    context.fillText(brand.toUpperCase(), margin, 690);
  } else {
    const gradient = context.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "rgba(0,0,0,.28)");
    gradient.addColorStop(0.18, "rgba(0,0,0,0)");
    gradient.addColorStop(0.82, "rgba(0,0,0,0)");
    gradient.addColorStop(1, "rgba(0,0,0,.28)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    context.fillStyle = book.foil;
    context.fillRect(22, 26, width - 44, 3);
    context.fillRect(22, 704, width - 44, 3);

    // The year sits upright above the tail rule, the motif above that
    context.textAlign = "center";
    context.font = `600 ${Math.round(width * 0.17)}px ${SANS}`;
    context.fillText(String(book.date), width / 2, 662);
    const motifSize = Math.min(64, width * 0.5);
    const motifY = 640 - motifSize - 12;
    drawMotif(context, book.motif, width / 2 - motifSize / 2, motifY, motifSize, book.foil);

    // The title runs head to tail, shrunk until it clears the motif
    context.save();
    context.translate(width / 2, 62);
    context.rotate(Math.PI / 2);
    context.textAlign = "left";
    context.textBaseline = "middle";
    const room = motifY - 30 - 62;
    let size = Math.min(58, width * 0.4);
    context.font = `400 ${size}px ${SERIF}`;
    const measured = context.measureText(book.title).width;
    if (measured > room) {
      size *= room / measured;
      context.font = `400 ${size}px ${SERIF}`;
    }
    context.fillText(book.title, 0, 0);
    context.restore();
  }

  return canvasTexture(canvas);
}

function shadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(64, 64, 8, 64, 64, 64);
  gradient.addColorStop(0, "rgba(0,0,0,1)");
  gradient.addColorStop(0.55, "rgba(0,0,0,.55)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

function damp(current, target, speed, delta) {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-speed * delta));
}

function bezierCoordinate(t, point1, point2) {
  const inverse = 1 - t;
  return 3 * inverse * inverse * t * point1 + 3 * inverse * t * t * point2 + t * t * t;
}

function easeSmoothOut(progress) {
  let t = progress;
  for (let iteration = 0; iteration < 5; iteration += 1) {
    const x = bezierCoordinate(t, 0.22, 0.36);
    const inverse = 1 - t;
    const slope = 3 * inverse * inverse * 0.22 + 6 * inverse * t * (0.36 - 0.22) + 3 * t * t * (1 - 0.36);
    if (Math.abs(slope) < 0.0001) break;
    t = THREE.MathUtils.clamp(t - (x - progress) / slope, 0, 1);
  }
  return bezierCoordinate(t, 1, 1);
}

function easeInOutCubic(progress) {
  return progress < 0.5 ? 4 * progress * progress * progress : 1 - (-2 * progress + 2) ** 3 / 2;
}

function snapshot(node) {
  return { position: node.position.clone(), rotation: node.rotation.clone(), scale: node.scale.x, startedAt: performance.now() };
}

function buildBook(book, brand, shadowMap) {
  const textures = {
    cover: coverTexture(book, brand, "cover"),
    spine: coverTexture(book, brand, "spine"),
    paper: paperTexture(book),
  };
  const geometry = new RoundedBoxGeometry(book.width, book.bookHeight, book.depth, 2, Math.min(book.width, 0.09));
  const material = (params) => new THREE.MeshStandardMaterial(params);
  // BoxGeometry face order: +x cover, -x back board, +y head, -y tail, +z spine, -z fore-edge
  const materials = [
    material({ map: textures.cover, roughness: 0.8, metalness: 0.015, bumpMap: textures.cover, bumpScale: 0.007 }),
    material({ color: book.color, roughness: 0.84, bumpMap: textures.cover, bumpScale: 0.006 }),
    material({ map: textures.paper, color: "#f1eadc", roughness: 0.93, bumpMap: textures.paper, bumpScale: 0.008 }),
    material({ map: textures.paper, color: "#ece3d3", roughness: 0.96, bumpMap: textures.paper, bumpScale: 0.006 }),
    material({ map: textures.spine, roughness: 0.8, metalness: 0.015, bumpMap: textures.spine, bumpScale: 0.007 }),
    material({ map: textures.paper, color: "#f3eadc", roughness: 0.94, bumpMap: textures.paper, bumpScale: 0.007 }),
  ];
  const group = new THREE.Group();
  group.add(new THREE.Mesh(geometry, materials));
  group.position.set(book.x, book.bookHeight / 2, book.z);

  const shadowMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, map: shadowMap, transparent: true, opacity: 0.55, depthWrite: false, toneMapped: false });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(book.width + 0.5, book.depth + 0.4), shadowMaterial);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(book.x, 0.002, book.z);

  return {
    ...book,
    group,
    shadow,
    flight: null,
    exit: null,
    dispose() {
      Object.values(textures).forEach((texture) => texture?.dispose());
      materials.forEach((m) => m.dispose());
      geometry.dispose();
      shadow.geometry.dispose();
      shadowMaterial.dispose();
    },
  };
}

/** Advances one book toward its hover/pulled/rest pose. Returns true once it has settled. */
function stepBook(book, delta, hovered, selected, reducedMotion) {
  const node = book.group;
  const rest = book.bookHeight / 2;
  const targetY = selected ? rest + PULL_LIFT : rest + (hovered ? HOVER_LIFT : 0);
  const targetZ = book.z + (selected ? PULL_OUT : hovered ? HOVER_PULL : 0);
  const targetScale = selected ? PULL_SCALE : 1;
  const targetRotationY = selected ? PULL_TURN : 0;

  if (selected && book.flight) {
    const flight = book.flight;
    const progress = reducedMotion ? 1 : Math.min(1, (performance.now() - flight.startedAt) / BOOK_ENTER_DURATION);
    const depthProgress = easeSmoothOut(progress);
    const travelProgress = easeSmoothOut(THREE.MathUtils.clamp((progress - 0.06) / 0.94, 0, 1));
    const turnProgress = easeInOutCubic(progress);
    const depthArc = Math.sin(Math.PI * progress) * 0.12;
    node.position.set(
      THREE.MathUtils.lerp(flight.position.x, book.x, travelProgress),
      THREE.MathUtils.lerp(flight.position.y, targetY, travelProgress),
      THREE.MathUtils.lerp(flight.position.z, targetZ, depthProgress) + depthArc,
    );
    node.rotation.x = THREE.MathUtils.lerp(flight.rotation.x, 0, turnProgress);
    node.rotation.y = THREE.MathUtils.lerp(flight.rotation.y, targetRotationY, turnProgress);
    node.rotation.z = THREE.MathUtils.lerp(flight.rotation.z, 0, turnProgress);
    node.scale.setScalar(THREE.MathUtils.lerp(flight.scale, targetScale, turnProgress));
    if (progress >= 1) book.flight = null;
  } else if (!selected && book.exit) {
    const exit = book.exit;
    const progress = reducedMotion ? 1 : Math.min(1, (performance.now() - exit.startedAt) / BOOK_EXIT_DURATION);
    const alignProgress = easeSmoothOut(progress);
    const slotProgress = easeSmoothOut(THREE.MathUtils.clamp((progress - 0.3) / 0.7, 0, 1));
    node.position.set(
      THREE.MathUtils.lerp(exit.position.x, book.x, alignProgress),
      THREE.MathUtils.lerp(exit.position.y, rest, alignProgress),
      THREE.MathUtils.lerp(exit.position.z, book.z, slotProgress),
    );
    node.rotation.x = THREE.MathUtils.lerp(exit.rotation.x, 0, alignProgress);
    node.rotation.y = THREE.MathUtils.lerp(exit.rotation.y, 0, alignProgress);
    node.rotation.z = THREE.MathUtils.lerp(exit.rotation.z, 0, alignProgress);
    node.scale.setScalar(THREE.MathUtils.lerp(exit.scale, 1, alignProgress));
    if (progress >= 1) book.exit = null;
  } else {
    const motion = reducedMotion ? 1000 : selected ? 7 : 11;
    node.position.x = damp(node.position.x, book.x, motion, delta);
    node.position.y = damp(node.position.y, targetY, motion, delta);
    node.position.z = damp(node.position.z, targetZ, motion, delta);
    node.rotation.y = damp(node.rotation.y, targetRotationY, motion, delta);
    node.scale.setScalar(damp(node.scale.x, targetScale, motion, delta));
  }

  // The contact shadow thins out as the book leaves the shelf
  const lifted = THREE.MathUtils.clamp((node.position.y - rest) / 0.6, 0, 1);
  book.shadow.material.opacity = 0.55 * (1 - lifted * 0.8);

  return (
    !book.flight && !book.exit &&
    Math.abs(node.position.y - targetY) < 0.0005 &&
    Math.abs(node.position.z - targetZ) < 0.0005 &&
    Math.abs(node.rotation.y - targetRotationY) < 0.0005 &&
    Math.abs(node.scale.x - targetScale) < 0.0005
  );
}

const fontsReady = () => {
  if (typeof document === "undefined" || !document.fonts) return Promise.resolve();
  const loads = Promise.all([document.fonts.load(`400 70px ${SERIF}`), document.fonts.load(`600 20px ${SANS}`)]).catch(() => {});
  return Promise.race([loads, new Promise((resolve) => window.setTimeout(resolve, 2500))]);
};

export function ShelfBooks({
  books: items,
  brand = "",
  selectedIndex = null,
  onSelect,
  maxHeight = SHELF_MAX_HEIGHT,
}) {
  const books = React.useMemo(() => deriveLayout(items), [items]);
  const boxStyle = React.useMemo(() => shelfBox(books, maxHeight), [books, maxHeight]);

  const containerRef = React.useRef(null);
  const hostRef = React.useRef(null);
  const hoveredRef = React.useRef(null);
  const selectedRef = React.useRef(selectedIndex);
  const apiRef = React.useRef(null);

  const [hovered, setHovered] = React.useState(null);
  const [focusRing, setFocusRing] = React.useState(null);
  const [screen, setScreen] = React.useState({ rects: [], anchors: [] });
  const [fallback, setFallback] = React.useState(false);

  React.useEffect(() => {
    const container = containerRef.current;
    const host = hostRef.current;
    if (!container || !host) return undefined;

    let cancelled = false;
    let frame = null;
    let last = 0;
    let built = [];
    let shadowMap = null;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 80);
    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    scene.add(new THREE.HemisphereLight(0xffffff, 0xd7dce8, 1.2));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(5, 8, 7);
    scene.add(key);

    let renderer = null;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
      host.appendChild(renderer.domElement);
    } catch {
      renderer = null;
      setFallback(true);
    }

    const size = { width: 1, height: 1 };
    const toScreen = (x, y, z) => {
      const p = new THREE.Vector3(x, y, z).project(camera);
      return { x: ((p.x + 1) / 2) * size.width, y: ((1 - p.y) / 2) * size.height };
    };

    const frameCamera = () => {
      const { bottom, top, width } = frameFor(books);
      const center = (bottom + top) / 2;
      const aspect = size.width / size.height;
      let distance = (top - bottom) / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2));
      // The box's aspect-ratio normally makes the row fit exactly; this covers rounding
      const visible = (top - bottom) * aspect;
      if (width > visible) distance *= width / visible;
      const tilt = THREE.MathUtils.degToRad(TILT);
      camera.aspect = aspect;
      camera.position.set(0, center + Math.sin(tilt) * distance, Math.cos(tilt) * distance);
      camera.lookAt(0, center, 0);
      camera.updateProjectionMatrix();
    };

    const measure = () => {
      camera.updateMatrixWorld();
      // Hit areas: the spine's width, and the full height up to the back of the head so the page edges count
      const rects = books.map((b) => {
        const points = [];
        for (const sx of [-1, 1]) for (const sy of [0, 1]) for (const sz of [-1, 1]) {
          points.push({ ...toScreen(b.x + (sx * b.width) / 2, sy * b.bookHeight, b.z + (sz * b.depth) / 2), front: sz === 1 });
        }
        const xs = points.filter((p) => p.front).map((p) => p.x);
        const ys = points.map((p) => p.y);
        const left = Math.min(...xs);
        const topY = Math.min(...ys);
        return { left, top: topY, width: Math.max(...xs) - left, height: Math.max(...ys) - topY };
      });
      // Tooltip anchor: the back of the head edge once the book has lifted on hover
      const anchors = books.map((b) => toScreen(b.x, b.bookHeight + HOVER_LIFT, b.z - b.depth / 2 + HOVER_PULL));
      setScreen({ rects, anchors });
    };

    const render = () => { if (renderer) renderer.render(scene, camera); };

    const tick = (now) => {
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;
      let settled = true;
      built.forEach((book, index) => {
        const done = stepBook(book, delta, hoveredRef.current === index && selectedRef.current == null, selectedRef.current === index, reducedMotion);
        if (!done) settled = false;
      });
      render();
      frame = settled ? null : window.requestAnimationFrame(tick);
    };

    const wake = () => {
      if (frame != null || !renderer) return;
      last = performance.now();
      frame = window.requestAnimationFrame(tick);
    };

    const setSelected = (next) => {
      const previous = selectedRef.current;
      if (previous === next) return;
      built.forEach((book, index) => {
        if (index === next) {
          book.flight = snapshot(book.group);
          book.exit = null;
        } else if (index === previous) {
          book.exit = snapshot(book.group);
          book.flight = null;
        }
      });
      selectedRef.current = next;
      wake();
    };

    apiRef.current = { wake, setSelected };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      size.width = Math.max(1, Math.round(rect.width));
      size.height = Math.max(1, Math.round(rect.height));
      if (renderer) renderer.setSize(size.width, size.height, false);
      frameCamera();
      measure();
      render();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    fontsReady().then(() => {
      if (cancelled || !renderer) return;
      shadowMap = shadowTexture();
      built = books.map((book) => buildBook(book, brand, shadowMap));
      built.forEach((book) => {
        scene.add(book.shadow);
        scene.add(book.group);
      });
      // Books that were already pulled out before the textures were ready go straight there
      built.forEach((book, index) => { if (selectedRef.current === index) book.flight = snapshot(book.group); });
      wake();
      render();
    });

    return () => {
      cancelled = true;
      observer.disconnect();
      if (frame != null) window.cancelAnimationFrame(frame);
      built.forEach((book) => book.dispose());
      shadowMap?.dispose();
      apiRef.current = null;
      if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
      }
    };
  }, [books, brand]);

  React.useEffect(() => {
    if (apiRef.current) apiRef.current.setSelected(selectedIndex);
    else selectedRef.current = selectedIndex;
  }, [selectedIndex]);

  const hover = (index) => {
    hoveredRef.current = index;
    setHovered(index);
    apiRef.current?.wake();
  };

  const tooltipIndex = hovered != null && selectedIndex == null ? hovered : null;
  const tooltipBook = tooltipIndex != null ? books[tooltipIndex] : null;
  const anchor = tooltipIndex != null ? screen.anchors[tooltipIndex] : null;

  return (
    <div
      ref={containerRef}
      // As tall as the row needs at this width, never past maxHeight: on a narrow
      // screen the books shrink to fit rather than running off the side
      style={{ ...boxStyle, zIndex: 1 }}
    >
      <div ref={hostRef} style={{ position: "absolute", inset: 0 }} />

      {books.map((book, index) => {
        const rect = screen.rects[index];
        if (!rect) return null;
        return (
          <button
            key={book.id}
            type="button"
            aria-label={`${book.title}, ${book.date}${book.subtitle ? `, ${book.subtitle}` : ""}`}
            data-book-index={index}
            onClick={() => onSelect?.(index)}
            onPointerEnter={() => hover(index)}
            onPointerLeave={() => hover(null)}
            onFocus={(event) => {
              // Only keyboard focus lifts the book. Focus handed back by a closing dialog
              // after a mouse click would otherwise leave it hovering with no pointer on it.
              const visible = event.currentTarget.matches(":focus-visible");
              if (visible) hover(index);
              setFocusRing(visible ? index : null);
            }}
            onBlur={() => {
              hover(null);
              setFocusRing(null);
            }}
            style={{
              position: "absolute",
              left: rect.left,
              top: rect.top,
              width: rect.width,
              height: rect.height,
              zIndex: 1,
              margin: 0,
              padding: 0,
              border: 0,
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              outline: focusRing === index ? "2px solid var(--accent)" : "none",
              outlineOffset: 6,
              ...(fallback
                ? {
                    // No WebGL: flat spines in the same colours, title down the middle
                    background: book.color,
                    color: book.foil,
                    writingMode: "vertical-rl",
                    fontFamily: "var(--font-display)",
                    fontSize: Math.max(12, Math.min(22, rect.width * 0.4)),
                    overflow: "hidden",
                  }
                : { background: "transparent" }),
            }}
          >
            {fallback ? book.title : null}
          </button>
        );
      })}

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: anchor ? anchor.x : 0,
          top: anchor ? anchor.y - 12 : 0,
          zIndex: 2,
          transform: "translate(-50%, -100%)",
          opacity: tooltipBook ? 1 : 0,
          transition: "opacity var(--dur-fast) ease",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          padding: "8px 12px",
          borderRadius: "var(--radius-sm)",
          background: "var(--bg-card-dark)",
          border: "1px solid var(--border-panel)",
          boxShadow: "0 12px 30px -12px rgba(0,0,0,0.8)",
        }}
      >
        <div style={{ fontSize: "var(--text-ui)", color: "var(--text-display)" }}>{tooltipBook?.title}</div>
        <div style={{ marginTop: 2, fontSize: "var(--text-caps)", letterSpacing: "var(--track-caps)", textTransform: "uppercase", color: "var(--text-meta)" }}>
          {tooltipBook ? `${tooltipBook.date}${tooltipBook.subtitle ? ` · ${tooltipBook.subtitle}` : ""}` : ""}
        </div>
      </div>
    </div>
  );
}
