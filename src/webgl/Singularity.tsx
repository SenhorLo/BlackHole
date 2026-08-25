import { useEffect, useRef, useState } from "react";
import { FRAG, VERT } from "./shaders";
import { subscribeToScroll, view } from "../lib/scroll";
import { useReducedMotion } from "../hooks/useReducedMotion";

/** Integration budget / resolution scale, from best to most forgiving. */
const TIERS = [
  { steps: 240, scale: 1.0 },
  { steps: 160, scale: 0.82 },
  { steps: 120, scale: 0.66 },
  { steps: 90, scale: 0.52 },
];

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function buildProgram(gl: WebGL2RenderingContext) {
  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;

  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(prog));
    return null;
  }
  return prog;
}

export function Singularity() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [failed, setFailed] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });

    if (!gl) {
      setFailed(true);
      return;
    }

    const prog = buildProgram(gl);
    if (!prog) {
      setFailed(true);
      return;
    }

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(prog);
    const u = {
      res: gl.getUniformLocation(prog, "uRes"),
      time: gl.getUniformLocation(prog, "uTime"),
      scroll: gl.getUniformLocation(prog, "uScroll"),
      warp: gl.getUniformLocation(prog, "uWarp"),
      pointer: gl.getUniformLocation(prog, "uPointer"),
      steps: gl.getUniformLocation(prog, "uSteps"),
      fade: gl.getUniformLocation(prog, "uFade"),
      offsetX: gl.getUniformLocation(prog, "uOffsetX"),
    };

    // ---- live state ------------------------------------------------------
    // ?perf=low pins the cheapest tier. Useful for QA on software renderers
    // and for anyone whose machine the auto-detection misjudges.
    const pinned = new URLSearchParams(window.location.search).get("perf") === "low";
    let tier = pinned ? TIERS.length - 1 : window.innerWidth < 900 ? 2 : 0;
    let width = 0;
    let height = 0;
    let scroll = 0;
    let warp = 0;
    let fade = 0;
    let raf = 0;
    let disposed = false;
    let lastTs = 0;
    let clock = 0;
    let frames = 0;
    let elapsed = 0;
    let downgrades = pinned ? 3 : 0;
    let offsetX = 0;
    let window_ = 12;

    const pointer = { x: 0, y: 0 };
    const pointerTarget = { x: 0, y: 0 };

    function resize() {
      if (!gl || disposed || !canvas) return;
      const dpr = pinned ? 1 : Math.min(window.devicePixelRatio || 1, 1.75);
      const s = TIERS[tier].scale * dpr;
      const rect = canvas.getBoundingClientRect();
      const cssW = rect.width || window.innerWidth;
      const cssH = rect.height || window.innerHeight;
      const w = Math.max(1, Math.round(cssW * s));
      const h = Math.max(1, Math.round(cssH * s));
      // wide viewports get the hole pushed right; portrait keeps it centred
      offsetX = Math.min(0.55, Math.max(0, (cssW / cssH - 1) * 0.72));
      if (w === width && h === height) return;
      width = w;
      height = h;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const unsubscribe = subscribeToScroll((m) => {
      scroll = m.progress;
      warp = Math.min(1, m.velocity * 1.15);
    });

    function onPointerMove(e: PointerEvent) {
      pointerTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerTarget.y = (e.clientY / window.innerHeight) * 2 - 1;
    }

    function render(ts: number) {
      if (disposed || !gl) return;
      raf = requestAnimationFrame(render);

      // Nothing to draw once the crossing has taken the sky to black.
      if (document.hidden || view.eclipse >= 0.995) {
        lastTs = ts;
        return;
      }

      const dt = lastTs ? Math.min(0.05, (ts - lastTs) / 1000) : 0.016;
      lastTs = ts;
      clock += reducedMotion ? 0 : dt;

      // Adaptive quality. The first window is short so a weak GPU is caught
      // within the fade-in rather than after a second of slideshow.
      frames++;
      elapsed += dt;
      if (frames >= window_) {
        const avg = elapsed / frames;
        if (avg > 0.026 && tier < TIERS.length - 1 && downgrades < 3) {
          tier++;
          downgrades++;
          resize();
        }
        window_ = 50;
        frames = 0;
        elapsed = 0;
      }

      pointer.x += (pointerTarget.x - pointer.x) * 0.045;
      pointer.y += (pointerTarget.y - pointer.y) * 0.045;
      fade += (1 - fade) * 0.035;

      gl.uniform2f(u.res, width, height);
      gl.uniform1f(u.time, clock);
      gl.uniform1f(u.scroll, scroll);
      gl.uniform1f(u.warp, reducedMotion ? 0 : warp);
      gl.uniform2f(u.pointer, pointer.x, pointer.y);
      gl.uniform1f(u.steps, TIERS[tier].steps);
      gl.uniform1f(u.fade, Math.min(1, fade * 1.05));
      gl.uniform1f(u.offsetX, offsetX);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    raf = requestAnimationFrame(render);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      unsubscribe();
      ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
      gl.deleteVertexArray(vao);
    };
  }, [reducedMotion]);

  return (
    <div className="singularity" aria-hidden="true">
      {failed ? (
        <div className="singularity__fallback" />
      ) : (
        <canvas ref={canvasRef} className="singularity__canvas" />
      )}
    </div>
  );
}
