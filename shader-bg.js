// Fixed-position animated gradient mesh background — plain JS, no React.
// Mounts a fullscreen canvas behind everything and renders a navy/blue mesh
// with subtle grid overlay. Tinted to match the brand.

(function() {
  const FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec3  iResolution;
uniform float iTime;

const float GRID_SCALE   = 16.0;
const float MAJOR_STEP   = 4.0;
const float THIN_WIDTH   = 0.010;
const float MAJOR_WIDTH  = 0.018;
const float SCROLL_SPEED = 0.015;

float hash21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  float a=hash21(i), b=hash21(i+vec2(1,0)), c=hash21(i+vec2(0,1)), d=hash21(i+vec2(1,1));
  vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}

float gridLineAA(vec2 uv, float scale, float width){
  vec2 g = abs(fract(uv*scale) - 0.5);
  float d = min(g.x, g.y);
  float aa = fwidth(d);
  return 1.0 - smoothstep(width, width + aa, d);
}
float majorGridAA(vec2 uv, float scale, float stepN, float width){
  float sMajor = max(1.0, scale/stepN);
  return gridLineAA(uv, sMajor, width);
}

vec3 meshGradient(vec2 uv, float t){
  // Slowly drifting anchors
  float s1 = sin(t*0.12), cs1 = cos(t*0.10);
  float s2 = sin(t*0.08 + 1.7), cs2 = cos(t*0.14 + 0.5);
  vec2 p0 = vec2(-0.70 + 0.10*s1,  -0.45 + 0.08*cs1);
  vec2 p1 = vec2( 0.75 + 0.08*cs2, -0.35 + 0.10*s2);
  vec2 p2 = vec2(-0.65 - 0.06*cs1,  0.65 + 0.08*s2);
  vec2 p3 = vec2( 0.80 - 0.10*s2,   0.55 - 0.07*cs2);

  // Navy palette with hints of teal and a warm yellow highlight (low weight)
  vec3 col0 = vec3(0.075, 0.165, 0.345); // deep navy
  vec3 col1 = vec3(0.135, 0.260, 0.490); // mid blue
  vec3 col2 = vec3(0.045, 0.110, 0.245); // darker navy
  vec3 col3 = vec3(0.220, 0.345, 0.560); // brighter blue accent
  float e=2.2;
  float w0=pow(1.0/(0.22+distance(uv,p0)),e);
  float w1=pow(1.0/(0.22+distance(uv,p1)),e);
  float w2=pow(1.0/(0.22+distance(uv,p2)),e);
  float w3=pow(1.0/(0.22+distance(uv,p3)),e);
  float ws=w0+w1+w2+w3;
  return (col0*w0+col1*w1+col2*w2+col3*w3)/ws;
}

void main()
{
  vec2 fc = gl_FragCoord.xy;
  vec2  R = iResolution.xy;
  float t = iTime;
  vec2 uv = (fc - 0.5*R) / max(R.y, 1.0);

  vec3 bg = meshGradient(uv, t);

  // Subtle warm-yellow highlight in upper right
  float yellowSpot = exp(-12.0 * length(uv - vec2(0.95, -0.55)));
  bg += vec3(0.18, 0.14, 0.04) * yellowSpot * 0.6;

  // Vignette toward edges to ground the composition
  float rad = length(uv);
  bg *= clamp(1.0 - 0.20 * rad, 0.0, 1.0);

  // Scrolling grid (very faint)
  vec2 scrollDir = normalize(vec2(1.0, -0.55));
  vec2 uvAnim = uv + SCROLL_SPEED * t * scrollDir;
  float thin  = gridLineAA (uvAnim, GRID_SCALE, THIN_WIDTH);
  float major = majorGridAA(uvAnim, GRID_SCALE, MAJOR_STEP, MAJOR_WIDTH);
  vec3 lineColor = vec3(0.45, 0.65, 0.90);
  bg += lineColor * thin  * 0.04;
  bg += lineColor * major * 0.07;

  // Film grain
  float n = vnoise(fc*0.7 + vec2(t*8.0, -t*6.0));
  bg += (n - 0.5) * 0.014;

  bg = clamp(bg, 0.0, 1.0);
  fragColor = vec4(bg, 1.0);
}
`;

  const VERT = `#version 300 es
precision highp float;
layout(location=0) in vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

  function init() {
    let canvas = document.getElementById("shader-bg");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "shader-bg";
      canvas.setAttribute("aria-hidden", "true");
      // Insert as first child of body so it sits behind everything
      document.body.insertBefore(canvas, document.body.firstChild);
    }

    const gl = canvas.getContext("webgl2", { premultipliedAlpha: false, antialias: false });
    if (!gl) {
      console.warn("[shader-bg] WebGL2 unavailable — using CSS fallback");
      canvas.style.background = "linear-gradient(135deg, #0c1d3d 0%, #1B3A6B 50%, #0c1d3d 100%)";
      return;
    }

    function compile(type, src) {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error("[shader-bg] compile error:", gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    }
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("[shader-bg] link error:", gl.getProgramInfoLog(prog));
      return;
    }

    const vao = gl.createVertexArray();
    const vbo = gl.createBuffer();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "iResolution");
    const uTime = gl.getUniformLocation(prog, "iTime");

    function resize() {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      const cssW = window.innerWidth;
      const cssH = window.innerHeight;
      const w = Math.max(1, Math.floor(cssW * dpr));
      const h = Math.max(1, Math.floor(cssH * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    }
    resize();
    window.addEventListener("resize", resize);

    const start = performance.now();
    gl.useProgram(prog);
    gl.bindVertexArray(vao);

    function frame() {
      if (gl.isContextLost()) { requestAnimationFrame(frame); return; }
      const t = (performance.now() - start) / 1000;
      gl.uniform3f(uRes, canvas.width, canvas.height, 1);
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
