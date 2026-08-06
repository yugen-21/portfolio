import React from "react";

const PAD = 20;

const SIZES = {
  sm: { fontSize: "0.85rem", padding: "10px 22px" },
  md: { fontSize: "1rem", padding: "14px 30px" },
  lg: { fontSize: "1.15rem", padding: "18px 40px" },
};

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uCenter;
uniform vec2 uHalfSize;
uniform float uRadius;
uniform float uAngle;
uniform float uPx;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform float uShineSize;
uniform float uShineFade;
uniform float uThickness;
uniform float uBaseWidth;

out vec4 fragColor;

float sdRoundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float shapeSDF(vec2 p) { return sdRoundedRect(p, uHalfSize, uRadius); }

float gaussianLine(float d, float sigma) {
  float x = d / (sigma + 1e-6);
  float k = mix(1.0, 1.6, smoothstep(0.0, 1.5, x));
  return exp(-k * x * x);
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = shapeSDF(p);
  vec2 L = vec2(cos(uAngle), sin(uAngle));

  float base = (1.0 - smoothstep(0.0, uBaseWidth, abs(d))) * 0.45;

  vec2 nEll = normalize(p / (uHalfSize * uHalfSize) + 1e-6);
  float phi = acos(clamp(abs(dot(nEll, L)), 0.0, 1.0));
  float rim = 1.0 - smoothstep(uShineSize - uShineFade, uShineSize + uShineFade + 1e-4, phi);
  float line = gaussianLine(d, uThickness);
  float edgeClamp = 1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(d));
  float hi = line * rim * edgeClamp * uIntensity;

  vec3 col = uBaseColor * base + uLineColor * hi;
  float a = clamp(base + hi, 0.0, 1.0);
  fragColor = vec4(col, a);
}
`;

const VARIANTS = {
  solid:   { tint: "#ede4ff", tintOpacity: 1,    textColor: "#1a0630", lineColor: "#ffffff", baseColor: "#8b5cf6", intensity: 1.1 },
  violet:  { tint: "#a855f7", tintOpacity: 0.06, textColor: "#f5f0ff", lineColor: "#c4a6ff", baseColor: "#4a2d7a", intensity: 1 },
  deep:    { tint: "#6d28d9", tintOpacity: 0.92, textColor: "#f5f0ff", lineColor: "#d8b4fe", baseColor: "#3b0f7a", intensity: 1.15 },
  outline: { tint: "#a855f7", tintOpacity: 0,    textColor: "#d8b4fe", lineColor: "#a855f7", baseColor: "#5b21b6", intensity: 0.9 },
  ghost:   { tint: "#a855f7", tintOpacity: 0.04, textColor: "#8a70b0", lineColor: "#8a70b0", baseColor: "#2a1052", intensity: 0.55 },
};

const hexToRgb = (hex) => {
  let s = String(hex).trim().replace("#", "");
  if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
  if (!/^[0-9a-fA-F]{6}$/.test(s)) return [1, 1, 1];
  return [parseInt(s.slice(0, 2), 16) / 255, parseInt(s.slice(2, 4), 16) / 255, parseInt(s.slice(4, 6), 16) / 255];
};

const compile = (gl, type, source) => {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, source);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) { gl.deleteShader(sh); return null; }
  return sh;
};

export function SpecularButton({
  children = "Get Started",
  variant = "violet",
  size = "lg",
  radius = 18,
  tint,
  tintOpacity,
  blur = 0,
  textColor,
  lineColor,
  baseColor,
  intensity,
  shineSize = 10,
  shineFade = 40,
  thickness = 1,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = false,
  disabled = false,
  href,
  onClick,
  className = "",
  type = "button",
  title,
  style,
}) {
  const v = VARIANTS[variant] || VARIANTS.violet;
  const rTint = tint ?? v.tint;
  const rTintOpacity = tintOpacity ?? v.tintOpacity;
  const rTextColor = textColor ?? v.textColor;
  const rLineColor = lineColor ?? v.lineColor;
  const rBaseColor = baseColor ?? v.baseColor;
  const rIntensity = intensity ?? v.intensity;

  const btnRef = React.useRef(null);
  const fxRef = React.useRef(null);
  const propsRef = React.useRef({});
  propsRef.current = { radius, lineColor: rLineColor, baseColor: rBaseColor, intensity: rIntensity, shineSize, shineFade, thickness, speed, followMouse, proximity, autoAnimate };

  React.useEffect(() => {
    const btn = btnRef.current;
    const fx = fxRef.current;
    if (!btn || !fx) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "display:block;width:100%;height:100%";
    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: true });
    if (!gl) return undefined;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return undefined;
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.bindAttribLocation(program, 0, "position");
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return undefined;
    gl.useProgram(program);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const U = {};
    ["uCenter", "uHalfSize", "uRadius", "uAngle", "uPx", "uLineColor", "uBaseColor", "uIntensity", "uShineSize", "uShineFade", "uThickness", "uBaseWidth"]
      .forEach((n) => { U[n] = gl.getUniformLocation(program, n); });

    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform1f(U.uPx, dpr);
    gl.uniform1f(U.uBaseWidth, dpr);
    fx.appendChild(canvas);

    const sizeRef = { w: 1, h: 1 };
    const resize = () => {
      const rect = btn.getBoundingClientRect();
      const w = rect.width, h = rect.height;
      if (w <= 0 || h <= 0) return;
      sizeRef.w = w; sizeRef.h = h;
      const cw = w + PAD * 2, ch = h + PAD * 2;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(U.uCenter, (PAD + w / 2) * dpr, (PAD + h / 2) * dpr);
      gl.uniform2f(U.uHalfSize, (w / 2) * dpr, (h / 2) * dpr);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(btn);
    resize();

    let pointerAngle = null;
    let proximityT = 0;
    const onPointerMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
      const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
      const dist = Math.hypot(dx, dy);
      if (dist === 0) {
        const nx = (e.clientX - cx) / (rect.width / 2);
        const ny = (cy - e.clientY) / (rect.height / 2);
        pointerAngle = Math.atan2(2 / rect.height, -2 / rect.width) + nx * 0.3 + ny * 0.15;
      } else {
        pointerAngle = Math.atan2(cy - e.clientY, e.clientX - cx);
      }
      const t = Math.max(0, 1 - dist / Math.max(propsRef.current.proximity, 1));
      proximityT = t * t * (3 - 2 * t);
    };
    window.addEventListener("pointermove", onPointerMove);

    let angle = 2.4, idleAngle = 2.4, bright = 0;
    let last = performance.now();
    let raf = 0;

    const update = (now) => {
      raf = requestAnimationFrame(update);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const p = propsRef.current;

      idleAngle += p.speed * dt;
      const steer = p.followMouse && pointerAngle != null && (!p.autoAnimate || proximityT > 0);
      const target = steer ? pointerAngle : idleAngle;
      const diff = ((target - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      angle += diff * (1 - Math.exp(-dt * 7));

      const brightTarget = p.autoAnimate ? 1 : proximityT;
      bright += (brightTarget - bright) * (1 - Math.exp(-dt * 8));

      const lc = hexToRgb(p.lineColor), bc = hexToRgb(p.baseColor);
      gl.uniform1f(U.uAngle, angle);
      gl.uniform1f(U.uRadius, Math.min(p.radius, Math.min(sizeRef.w, sizeRef.h) / 2) * dpr);
      gl.uniform3f(U.uLineColor, lc[0], lc[1], lc[2]);
      gl.uniform3f(U.uBaseColor, bc[0], bc[1], bc[2]);
      gl.uniform1f(U.uIntensity, p.intensity * bright);
      gl.uniform1f(U.uShineSize, (p.shineSize * Math.PI) / 180);
      gl.uniform1f(U.uShineFade, (p.shineFade * Math.PI) / 180);
      gl.uniform1f(U.uThickness, p.thickness * dpr);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      if (canvas.parentNode === fx) fx.removeChild(canvas);
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
    };
  }, []);

  const s = SIZES[size] || SIZES.md;
  const rootStyle = {
    position: "relative",
    margin: 0,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    fontFamily: "var(--font-sans)",
    fontWeight: 500,
    lineHeight: 1,
    letterSpacing: "0.01em",
    textDecoration: "none",
    outline: "none",
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.55 : 1,
    color: rTextColor,
    borderRadius: radius + "px",
    background: rTintOpacity >= 1 ? rTint : `color-mix(in srgb, ${rTint} ${rTintOpacity * 100}%, transparent)`,
    backdropFilter: blur ? `blur(${blur}px)` : "none",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 24px rgba(0,0,0,0.25)",
    transition: "transform 150ms ease",
    fontSize: s.fontSize,
    padding: s.padding,
    ...style,
  };

  const inner = (
    <React.Fragment>
      <span ref={fxRef} aria-hidden="true" style={{ pointerEvents: "none", position: "absolute", inset: "-20px", zIndex: 1 }}></span>
      <span style={{ position: "relative", zIndex: 2 }}>{children}</span>
    </React.Fragment>
  );

  const press = disabled ? {} : {
    onPointerDown: (e) => { e.currentTarget.style.transform = "scale(0.97)"; },
    onPointerUp: (e) => { e.currentTarget.style.transform = "scale(1)"; },
    onPointerLeave: (e) => { e.currentTarget.style.transform = "scale(1)"; },
  };

  if (href && !disabled) {
    return <a ref={btnRef} href={href} target={/^https?:/.test(href) ? "_blank" : undefined} rel={/^https?:/.test(href) ? "noreferrer" : undefined} title={title} className={className} style={rootStyle} onClick={onClick} {...press}>{inner}</a>;
  }
  return (
    <button ref={btnRef} type={type} disabled={disabled} onClick={onClick} title={title} className={className} style={rootStyle} {...press}>
      {inner}
    </button>
  );
}
