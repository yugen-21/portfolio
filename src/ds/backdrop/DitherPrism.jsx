import React from "react";

/**
 * A dithered, slowly flowing gradient for the hero ground. Ported from
 * Componentry's Dither Prism Hero
 * (https://componentry.dev/docs/components/dither-prism-hero). The layers —
 * noise flow, prism edges, iridescence, morphing crystal grid, Bayer + blue
 * noise dither, scanlines, vignette — are the original's. Departures:
 *
 * - Plain WebGL2 instead of @react-three/fiber, so the hero does not pull
 *   three.js into the main bundle. The original's camera only sees the middle
 *   of its plane; UV_SPAN reproduces that framing so the pattern scale matches.
 * - Background only: the headline block and its framer-motion entrance are
 *   dropped, the page brings its own content.
 * - Kept to the palette. The original's prism, iridescence and cursor aura are
 *   rainbow; here they are tinted between `color2`, `color3` and `glow`.
 * - The cursor effect follows the real pointer (the original pins it to the
 *   centre at full strength) and fades out when the pointer leaves;
 *   `mouseIntensity={0}` turns it off and skips the listeners entirely.
 * - Dark pixels are transparent, so whatever sits behind — the site's
 *   starfield — shows through the black.
 * - The floating particles are dropped for the same reason: the stars are
 *   already there.
 * - Stops drawing when scrolled out of view; prefers-reduced-motion draws one
 *   frame and holds it.
 */

const UV_SPAN = 0.3837; // 2·tan(37.5°) / 4 — the slice of the 4×4 plane a fov-75 camera at z=1 sees

const VERTEX_SHADER = `#version 300 es
in vec2 position;
out vec2 vScreen;
void main() {
  vScreen = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
precision highp int;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uMouseIntensity;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uGlow;
uniform float uDitherIntensity;
uniform float uPrismIntensity;
uniform float uSpan;
in vec2 vScreen;
out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0))
  + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 6; i++) {
    if (i >= octaves) break;
    value += amplitude * snoise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

float bayer8x8(vec2 uv) {
  ivec2 p = ivec2(mod(uv, 8.0));
  int matrix[64];
  matrix[0] = 0;  matrix[1] = 32; matrix[2] = 8;  matrix[3] = 40; matrix[4] = 2;  matrix[5] = 34; matrix[6] = 10; matrix[7] = 42;
  matrix[8] = 48; matrix[9] = 16; matrix[10] = 56; matrix[11] = 24; matrix[12] = 50; matrix[13] = 18; matrix[14] = 58; matrix[15] = 26;
  matrix[16] = 12; matrix[17] = 44; matrix[18] = 4; matrix[19] = 36; matrix[20] = 14; matrix[21] = 46; matrix[22] = 6; matrix[23] = 38;
  matrix[24] = 60; matrix[25] = 28; matrix[26] = 52; matrix[27] = 20; matrix[28] = 62; matrix[29] = 30; matrix[30] = 54; matrix[31] = 22;
  matrix[32] = 3;  matrix[33] = 35; matrix[34] = 11; matrix[35] = 43; matrix[36] = 1;  matrix[37] = 33; matrix[38] = 9;  matrix[39] = 41;
  matrix[40] = 51; matrix[41] = 19; matrix[42] = 59; matrix[43] = 27; matrix[44] = 49; matrix[45] = 17; matrix[46] = 57; matrix[47] = 25;
  matrix[48] = 15; matrix[49] = 47; matrix[50] = 7; matrix[51] = 39; matrix[52] = 13; matrix[53] = 45; matrix[54] = 5; matrix[55] = 37;
  matrix[56] = 63; matrix[57] = 31; matrix[58] = 55; matrix[59] = 23; matrix[60] = 61; matrix[61] = 29; matrix[62] = 53; matrix[63] = 21;
  return float(matrix[p.y * 8 + p.x]) / 64.0;
}

float blueNoise(vec2 uv, float time) {
  float n1 = hash(uv + vec2(time * 0.1, 0.0));
  float n2 = hash(uv * 2.1 + vec2(0.0, time * 0.13));
  float n3 = hash(uv * 4.3 + vec2(time * 0.07, time * 0.11));
  return fract(n1 + n2 * 0.5 + n3 * 0.25);
}

// Palette-tinted prism: the original's rotating RGB split, swept between color2 and glow
vec3 prism(vec2 uv, float time, float intensity) {
  float angle = atan(uv.y - 0.5, uv.x - 0.5);
  float dist = length(uv - 0.5);
  float prismAngle = angle + time * 0.3 + dist * 3.0;
  float a = 0.5 + 0.5 * sin(prismAngle);
  float b = 0.5 + 0.5 * sin(prismAngle + 2.094);
  vec3 sweep = mix(uColor2, uColor3, a);
  sweep = mix(sweep, uGlow, b * 0.5);
  return sweep * intensity;
}

// Iridescence as a single brightness field, tinted rather than grey
vec3 iridescence(vec2 uv, float time) {
  float t = time * 0.5;
  vec2 p = uv * 3.0;
  float n1 = snoise(p + vec2(t, 0.0));
  float n2 = snoise(p * 1.3 + vec2(0.0, t * 0.7));
  float n3 = snoise(p * 0.7 + vec2(t * 0.5, t * 0.3));
  float v = (0.5 + 0.5 * sin(n1 * 3.14159 + t)
           + 0.5 + 0.5 * sin(n2 * 3.14159 + t * 1.3 + 2.0)
           + 0.5 + 0.5 * sin(n3 * 3.14159 + t * 0.7 + 4.0)) / 3.0;
  return mix(uColor2, uGlow, v) * v;
}

float diamond(vec2 p) {
  return abs(p.x) + abs(p.y);
}

float morphShape(vec2 uv, float time) {
  float morph = sin(time * 0.4) * 0.5 + 0.5;
  vec2 p = uv * 4.0 - 2.0;
  p = p + vec2(sin(time * 0.3), cos(time * 0.4)) * 0.5;
  float circle = length(p) - 1.0;
  float diam = diamond(p) - 1.4;
  float shape = mix(circle, diam, morph);
  vec2 q = mod(uv * 8.0, 2.0) - 1.0;
  float multiShape = mix(length(q), diamond(q), morph) - 0.3;
  return min(shape, multiShape);
}

float mouseRipple(vec2 uv, vec2 mouse, float time, float intensity) {
  float dist = length(uv - mouse);
  float ripple1 = sin(dist * 40.0 - time * 5.0) * exp(-dist * 3.0);
  float ripple2 = sin(dist * 25.0 - time * 3.5 + 1.0) * exp(-dist * 4.0);
  float ripple3 = sin(dist * 60.0 - time * 7.0) * exp(-dist * 5.0);
  return (ripple1 + ripple2 * 0.5 + ripple3 * 0.3) * intensity;
}

vec3 mouseGlow(vec2 uv, vec2 mouse, float time, float intensity) {
  float dist = length(uv - mouse);
  float core = exp(-dist * 15.0) * 1.5;
  float outer = exp(-dist * 5.0) * 0.8;
  float pulse = 0.8 + 0.2 * sin(time * 3.0);
  float chromatic = sin(dist * 30.0 + time * 2.0) * exp(-dist * 8.0);
  vec3 glow = uGlow * (core + outer) * pulse * intensity;
  glow += uColor3 * chromatic * intensity * 0.5;
  return glow;
}

vec2 mouseLensDistort(vec2 uv, vec2 mouse, float intensity) {
  vec2 delta = uv - mouse;
  float dist = length(delta);
  float distortion = exp(-dist * 6.0) * intensity * 0.15;
  return uv + normalize(delta + 0.001) * distortion;
}

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 uv = 0.5 + (vScreen - 0.5) * vec2(uSpan * aspect, uSpan);
  vec2 pixelCoord = gl_FragCoord.xy;
  float time = uTime;

  vec2 distortedUv = mouseLensDistort(uv, uMouse, uMouseIntensity);

  float noise1 = fbm(distortedUv * 2.0 + vec2(time * 0.05, time * 0.03), 4);
  float noise2 = fbm(distortedUv * 3.0 + vec2(-time * 0.04, time * 0.06), 3);
  float diagonal = (distortedUv.x + distortedUv.y) * 0.5;
  float flow = diagonal + noise1 * 0.3 + noise2 * 0.2;
  flow += sin(time * 0.2) * 0.1;

  float t1 = smoothstep(0.0, 0.5, flow);
  float t2 = smoothstep(0.5, 1.0, flow);
  vec3 col = mix(uColor1, uColor2, t1);
  col = mix(col, uColor3, t2);

  vec3 prismColor = prism(distortedUv, time, uPrismIntensity);
  float edgeMask = abs(fract(flow * 5.0) - 0.5) * 2.0;
  edgeMask = smoothstep(0.3, 0.7, edgeMask);
  col += prismColor * edgeMask * 0.4;

  vec3 iris = iridescence(distortedUv, time);
  float irisMask = snoise(distortedUv * 5.0 + time * 0.1);
  irisMask = smoothstep(-0.2, 0.8, irisMask) * 0.15;
  col = mix(col, iris, irisMask);

  float shape = morphShape(distortedUv, time);
  float shapeMask = 1.0 - smoothstep(-0.1, 0.1, shape);
  col = mix(col, col * 1.15 + uColor3 * 0.12, shapeMask * 0.3);

  float ripple = mouseRipple(uv, uMouse, time, uMouseIntensity);
  col += ripple * prismColor * 1.2;
  col += ripple * vec3(0.3, 0.2, 0.4);
  col += mouseGlow(uv, uMouse, time, uMouseIntensity);
  float mouseDist = length(uv - uMouse);
  float proximityBoost = exp(-mouseDist * 4.0) * uMouseIntensity;
  col = mix(col, col * 1.5 + prismColor * 0.3, proximityBoost);

  float bayer = bayer8x8(pixelCoord);
  float blue = blueNoise(pixelCoord * 0.1, time);
  float ditherPattern = mix(bayer, blue, 0.3 + 0.2 * sin(time * 0.5));
  vec3 ditherOffset = (vec3(ditherPattern) - 0.5) * uDitherIntensity;
  col += ditherOffset;
  float levels = 16.0;
  vec3 quantized = floor(col * levels + ditherPattern) / levels;
  col = mix(col, quantized, uDitherIntensity * 0.5);

  float scanline = sin(pixelCoord.y * 2.0 + time * 2.0) * 0.02;
  col += scanline * uDitherIntensity;

  vec2 screenUv = vScreen;
  float vignette = 1.0 - length((screenUv - 0.5) * 1.2);
  vignette = smoothstep(0.0, 0.7, vignette);
  col *= 0.85 + vignette * 0.15;

  col = clamp(col, 0.0, 1.0);
  // Black reads as see-through, so the page behind (the starfield) survives
  float alpha = clamp(max(col.r, max(col.g, col.b)) * 4.0, 0.0, 1.0);
  fragColor = vec4(col * alpha, alpha);
}
`;

const hexToRgb01 = (hex) => {
  const h = String(hex).replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return [0, 0, 0];
  return [parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255];
};

export function DitherPrism({
  color1 = "#000000",
  color2 = "#1a0630",
  color3 = "#5b21b6",
  glow = "#c4a6ff",
  speed = 1,
  ditherIntensity = 0.15,
  prismIntensity = 0.5,
  mouseIntensity = 0.3,
  className,
  style,
}) {
  const hostRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (failed || !host || !canvas) return undefined;

    const gl = canvas.getContext("webgl2", { antialias: false, alpha: true, premultipliedAlpha: true });
    if (!gl) { setFailed(true); return undefined; }

    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
      gl.deleteShader(shader);
      return null;
    };
    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (vs && fs) {
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
    }
    if (!vs || !fs || !gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      setFailed(true);
      return undefined;
    }
    gl.useProgram(program);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const u = (name) => gl.getUniformLocation(program, name);
    const uTime = u("uTime");
    const uResolution = u("uResolution");
    const uMouse = u("uMouse");
    const uMouseIntensity = u("uMouseIntensity");
    gl.uniform3fv(u("uColor1"), hexToRgb01(color1));
    gl.uniform3fv(u("uColor2"), hexToRgb01(color2));
    gl.uniform3fv(u("uColor3"), hexToRgb01(color3));
    gl.uniform3fv(u("uGlow"), hexToRgb01(glow));
    gl.uniform1f(u("uDitherIntensity"), ditherIntensity);
    gl.uniform1f(u("uPrismIntensity"), prismIntensity);
    gl.uniform1f(u("uSpan"), UV_SPAN);

    let width = 1, height = 1;
    const resize = () => {
      // Match device pixels exactly so the Bayer pattern stays crisp
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = host.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
    };

    // Pointer, in the shader's framed UV space, eased toward its target
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, on: 0, target: 0 };
    const onMove = (e) => {
      const rect = host.getBoundingClientRect();
      const sx = (e.clientX - rect.left) / rect.width;
      const sy = 1 - (e.clientY - rect.top) / rect.height;
      const inside = sx >= 0 && sx <= 1 && sy >= 0 && sy <= 1;
      pointer.target = inside ? 1 : 0;
      if (!inside) return;
      const aspect = rect.width / Math.max(rect.height, 1);
      pointer.tx = 0.5 + (sx - 0.5) * UV_SPAN * aspect;
      pointer.ty = 0.5 + (sy - 0.5) * UV_SPAN;
      if (pointer.on < 0.01) { pointer.x = pointer.tx; pointer.y = pointer.ty; }
    };
    const onLeave = () => { pointer.target = 0; };

    const draw = (seconds) => {
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
      pointer.on += (pointer.target - pointer.on) * 0.05;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, seconds * speed);
      gl.uniform2f(uMouse, pointer.x, pointer.y);
      gl.uniform1f(uMouseIntensity, pointer.on * mouseIntensity);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = true;
    const start = performance.now();
    const frame = (now) => {
      draw((now - start) / 1000);
      raf = visible ? requestAnimationFrame(frame) : 0;
    };

    const ro = new ResizeObserver(() => { resize(); if (reduced) draw(8); });
    ro.observe(host);
    resize();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf && !reduced) raf = requestAnimationFrame(frame);
    });

    if (reduced) draw(8);
    else {
      io.observe(host);
      if (mouseIntensity > 0) {
        window.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeave);
      }
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gl.deleteBuffer(quad);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [failed, color1, color2, color3, glow, speed, ditherIntensity, prismIntensity, mouseIntensity]);

  return (
    <div ref={hostRef} aria-hidden="true" className={className} style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", ...style }}>
      {failed ? (
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(45deg, ${color1} 30%, ${color2} 65%, ${color3} 110%)` }} />
      ) : (
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, display: "block", width: "100%", height: "100%" }} />
      )}
    </div>
  );
}
