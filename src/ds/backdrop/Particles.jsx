import React from "react";

const defaultColors = ["#ffffff", "#ffffff", "#ffffff"];

const hexToRgb = (hex) => {
  let h = String(hex).replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const int = parseInt(h.slice(0, 6), 16);
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
};

const vertex = `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;

  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;

  varying vec4 vRandom;
  varying vec3 vColor;

  void main() {
    vRandom = random;
    vColor = color;

    vec3 pos = position * uSpread;
    pos.z *= 10.0;

    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);

    vec4 mvPos = viewMatrix * mPos;

    if (uSizeRandomness == 0.0) {
      gl_PointSize = uBaseSize;
    } else {
      gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    }

    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = `
  precision highp float;

  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));

    if(uAlphaParticles < 0.5) {
      if(d > 0.5) {
        discard;
      }
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.8;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
    }
  }
`;

const mat4 = {
  identity: () => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
  perspective: (fovDeg, aspect, near, far) => {
    const f = 1 / Math.tan((fovDeg * Math.PI) / 360);
    const nf = 1 / (near - far);
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, 2 * far * near * nf, 0,
    ]);
  },
  multiply: (a, b) => {
    const o = new Float32Array(16);
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 4; r++) {
        o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
      }
    }
    return o;
  },
  translation: (x, y, z) => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]),
  rotation: (rx, ry, rz) => {
    const cx = Math.cos(rx), sx = Math.sin(rx);
    const cy = Math.cos(ry), sy = Math.sin(ry);
    const cz = Math.cos(rz), sz = Math.sin(rz);
    const rX = new Float32Array([1, 0, 0, 0, 0, cx, sx, 0, 0, -sx, cx, 0, 0, 0, 0, 1]);
    const rY = new Float32Array([cy, 0, -sy, 0, 0, 1, 0, 0, sy, 0, cy, 0, 0, 0, 0, 1]);
    const rZ = new Float32Array([cz, sz, 0, 0, -sz, cz, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    return mat4.multiply(mat4.multiply(rX, rY), rZ);
  },
};

const compile = (gl, type, src) => {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
  return s;
};

export function Particles({
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleColors,
  moveParticlesOnHover = false,
  particleHoverFactor = 1,
  alphaParticles = false,
  particleBaseSize = 100,
  sizeRandomness = 1,
  cameraDistance = 20,
  disableRotation = false,
  pixelRatio = 1,
  className,
  style,
}) {
  const containerRef = React.useRef(null);
  const mouseRef = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const canvas = document.createElement("canvas");
    canvas.style.cssText = "display:block;width:100%;height:100%";
    const gl = canvas.getContext("webgl", { alpha: true, depth: false, antialias: true, premultipliedAlpha: false });
    if (!gl) return undefined;
    container.appendChild(canvas);
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);

    const vs = compile(gl, gl.VERTEX_SHADER, vertex);
    const fs = compile(gl, gl.FRAGMENT_SHADER, fragment);
    if (!vs || !fs) return undefined;
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return undefined;
    gl.useProgram(program);

    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);
    const palette = particleColors && particleColors.length > 0 ? particleColors : defaultColors;

    for (let i = 0; i < count; i++) {
      let x, y, z, len;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x * x + y * y + z * z;
      } while (len > 1 || len === 0);
      const r = Math.cbrt(Math.random());
      positions.set([x * r, y * r, z * r], i * 3);
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      colors.set(hexToRgb(palette[Math.floor(Math.random() * palette.length)]), i * 3);
    }

    const makeAttr = (name, data, size) => {
      const loc = gl.getAttribLocation(program, name);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      if (loc >= 0) {
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      }
      return buf;
    };
    const buffers = [
      makeAttr("position", positions, 3),
      makeAttr("random", randoms, 4),
      makeAttr("color", colors, 3),
    ];

    const U = {};
    ["modelMatrix", "viewMatrix", "projectionMatrix", "uTime", "uSpread", "uBaseSize", "uSizeRandomness", "uAlphaParticles"]
      .forEach((n) => { U[n] = gl.getUniformLocation(program, n); });

    gl.uniform1f(U.uSpread, particleSpread);
    gl.uniform1f(U.uBaseSize, particleBaseSize * pixelRatio);
    gl.uniform1f(U.uSizeRandomness, sizeRandomness);
    gl.uniform1f(U.uAlphaParticles, alphaParticles ? 1 : 0);
    gl.uniformMatrix4fv(U.viewMatrix, false, mat4.translation(0, 0, -cameraDistance));

    let projection = mat4.identity();
    const resize = () => {
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      gl.viewport(0, 0, canvas.width, canvas.height);
      projection = mat4.perspective(15, canvas.width / canvas.height, 0.1, 100);
      gl.uniformMatrix4fv(U.projectionMatrix, false, projection);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -(((e.clientY - rect.top) / rect.height) * 2 - 1),
      };
    };
    if (moveParticlesOnHover) container.addEventListener("mousemove", handleMouseMove);

    let raf = 0;
    let lastTime = performance.now();
    let elapsed = 0;
    let rotZ = 0;

    const update = (t) => {
      raf = requestAnimationFrame(update);
      const delta = t - lastTime;
      lastTime = t;
      elapsed += delta * speed;

      gl.uniform1f(U.uTime, elapsed * 0.001);

      const px = moveParticlesOnHover ? -mouseRef.current.x * particleHoverFactor : 0;
      const py = moveParticlesOnHover ? -mouseRef.current.y * particleHoverFactor : 0;

      let model = mat4.translation(px, py, 0);
      if (!disableRotation) {
        rotZ += 0.01 * speed;
        model = mat4.multiply(model, mat4.rotation(
          Math.sin(elapsed * 0.0002) * 0.1,
          Math.cos(elapsed * 0.0005) * 0.15,
          rotZ
        ));
      }
      gl.uniformMatrix4fv(U.modelMatrix, false, model);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, count);
    };
    raf = requestAnimationFrame(update);

    return () => {
      ro.disconnect();
      if (moveParticlesOnHover) container.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(raf);
      buffers.forEach((b) => gl.deleteBuffer(b));
      if (container.contains(canvas)) container.removeChild(canvas);
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
    };
  }, [particleCount, particleSpread, speed, moveParticlesOnHover, particleHoverFactor, alphaParticles, particleBaseSize, sizeRandomness, cameraDistance, disableRotation, pixelRatio, (particleColors || []).join(",")]);

  return <div ref={containerRef} className={className} style={{ position: "relative", width: "100%", height: "100%", ...style }}></div>;
}
