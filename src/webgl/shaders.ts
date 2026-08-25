export const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

/**
 * Schwarzschild geodesic tracer.
 *
 * Units: the event horizon sits at r = 1, so every distance in here is
 * literally a Schwarzschild radius. The photon sphere (1.5) and the ISCO (3.0)
 * fall out of the integration rather than being drawn in by hand.
 */
export const FRAG = `#version 300 es
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform float uScroll;   // 0..1 page descent
uniform float uWarp;     // scroll velocity -> radial star smear
uniform vec2  uPointer;  // -1..1 parallax
uniform float uSteps;    // integration budget (quality tier)
uniform float uFade;     // opacity ramp on first paint
uniform float uOffsetX;  // pushes the hole off-centre so type has room

out vec4 fragColor;

const float R_HORIZON = 1.0;
const float R_ISCO    = 3.0;   // inner edge of the disk
const float R_OUTER   = 14.0;
const float ESCAPE    = 46.0;

// ---------------------------------------------------------------- hashing --
float hash31(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float vnoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n000 = hash31(i + vec3(0.0, 0.0, 0.0));
  float n100 = hash31(i + vec3(1.0, 0.0, 0.0));
  float n010 = hash31(i + vec3(0.0, 1.0, 0.0));
  float n110 = hash31(i + vec3(1.0, 1.0, 0.0));
  float n001 = hash31(i + vec3(0.0, 0.0, 1.0));
  float n101 = hash31(i + vec3(1.0, 0.0, 1.0));
  float n011 = hash31(i + vec3(0.0, 1.0, 1.0));
  float n111 = hash31(i + vec3(1.0, 1.0, 1.0));
  return mix(
    mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
    mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
    f.z);
}

float fbm(vec3 p) {
  float a = 0.5;
  float s = 0.0;
  for (int i = 0; i < 4; i++) {
    s += a * vnoise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return s;
}

// -------------------------------------------------------------- starfield --
vec3 starLayer(vec3 dir, float scale, float cut, float seed) {
  vec3 p    = dir * scale;
  vec3 cell = floor(p);
  vec3 frc  = fract(p) - 0.5;
  float rnd = hash31(cell + seed);
  if (rnd < cut) return vec3(0.0);

  vec3 jit = (vec3(hash31(cell + seed + 1.7),
                   hash31(cell + seed + 4.3),
                   hash31(cell + seed + 9.1)) - 0.5) * 0.66;
  float d       = length(frc - jit);
  float bright  = (rnd - cut) / (1.0 - cut);
  float twinkle = 0.72 + 0.28 * sin(uTime * 1.6 + rnd * 91.0);
  float core    = smoothstep(0.115, 0.0, d);

  // O-type blue through K-type amber, weighted toward the cool end
  float temp = hash31(cell + seed + 15.3);
  vec3 tint  = mix(vec3(0.60, 0.76, 1.00), vec3(1.00, 0.84, 0.62), temp * temp);
  return tint * core * bright * twinkle;
}

vec3 starfield(vec3 dir) {
  vec3 c = vec3(0.0);
  c += starLayer(dir,  26.0, 0.955, 0.0)  * 1.55;
  c += starLayer(dir,  58.0, 0.964, 31.7) * 0.95;
  c += starLayer(dir, 122.0, 0.972, 77.1) * 0.55;

  // faint galactic band so the void is never flat black
  float band = exp(-pow(abs(dir.y * 2.4 + dir.x * 0.5), 2.0) * 1.6);
  float dust = fbm(dir * 4.0 + 11.0);
  c += vec3(0.052, 0.045, 0.086) * band * (0.35 + dust * 0.9);
  return c;
}

// Radial smear in direction-space: falling fast turns stars into streaks.
vec3 warpedStars(vec3 dir, vec3 fwd, float amt) {
  if (amt < 0.004) return starfield(dir);
  vec3 c  = vec3(0.0);
  float w = 0.0;
  for (int i = 0; i < 5; i++) {
    float t  = float(i) / 4.0;
    float k  = 1.0 + t * amt;
    vec3  d  = normalize(fwd + (dir - fwd) * k);
    float wi = 1.0 - t * 0.62;
    c += starfield(d) * wi;
    w += wi;
  }
  return c / w;
}

// ------------------------------------------------------------------- disk --
// Blackbody ramp: the inner edge runs ~10^7 K, the rim is barely glowing.
vec3 diskTint(float t) {
  vec3 c = mix(vec3(0.78, 0.92, 1.22), vec3(1.25, 0.80, 0.30), smoothstep(0.0, 0.30, t));
  c = mix(c, vec3(0.92, 0.26, 0.10), smoothstep(0.30, 0.80, t));
  c = mix(c, vec3(0.42, 0.07, 0.04), smoothstep(0.80, 1.00, t));
  return c;
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  uv.x -= uOffsetX;   // composition: the words live left, the hole sits right

  // --- camera: a slow fall from 21 r_s to 6 r_s, flattening toward edge-on --
  float fall  = smoothstep(0.0, 1.0, uScroll);
  float dist  = mix(21.0, 6.2, fall);
  float pitch = mix(0.30, 0.055, fall) + uPointer.y * 0.055;
  float yaw   = uTime * 0.021 + uPointer.x * 0.16;

  vec3 ro = vec3(sin(yaw) * dist * cos(pitch),
                 sin(pitch) * dist,
                 cos(yaw) * dist * cos(pitch));

  vec3 fwd   = normalize(-ro);
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), fwd));
  vec3 up    = cross(fwd, right);
  vec3 rd    = normalize(fwd * 1.5 + right * uv.x + up * uv.y);

  // --- integrate the null geodesic ----------------------------------------
  vec3  pos = ro;
  vec3  dir = rd;
  vec3  L   = cross(pos, dir);
  float h2  = dot(L, L);          // conserved angular momentum, squared

  vec3  accum     = vec3(0.0);
  float minR      = 1e9;
  bool  swallowed = false;

  for (int i = 0; i < 256; i++) {
    if (float(i) >= uSteps) break;

    float r = length(pos);
    minR = min(minR, r);
    if (r < R_HORIZON) { swallowed = true; break; }
    if (r > ESCAPE && dot(pos, dir) > 0.0) break;

    float dt = clamp(r * 0.052, 0.02, 0.62);

    // Refine toward the disk crossing, measured as distance along the ray to
    // y = 0 rather than as height above it. Keying off height alone starves
    // the budget once the camera tips edge-on, because then nearly every ray
    // runs close to the plane for its whole path without ever crossing.
    if (dot(pos.xz, pos.xz) < R_OUTER * R_OUTER * 1.5 && pos.y * dir.y < 0.0) {
      float toPlane = -pos.y / dir.y;
      dt = min(dt, max(0.02, toPlane * 0.55));
    }

    // and near the horizon, or the shadow edge comes out as a staircase
    if (r < 1.6) dt = min(dt, max(0.008, (r - R_HORIZON) * 0.28 + 0.008));

    // Schwarzschild bending, Cartesian form
    vec3 acc = -1.5 * h2 * pos / pow(dot(pos, pos), 2.5);
    dir = normalize(dir + acc * dt);

    vec3 prev = pos;
    pos += dir * dt;

    // --- disk crossing ----------------------------------------------------
    if (prev.y * pos.y < 0.0) {
      float k   = prev.y / (prev.y - pos.y);
      vec3  hit = mix(prev, pos, k);
      float rr  = length(hit.xz);

      if (rr > R_ISCO && rr < R_OUTER) {
        float t   = (rr - R_ISCO) / (R_OUTER - R_ISCO);
        float ang = atan(hit.z, hit.x);

        // differential rotation: inner annuli sweep round far faster
        float omega = 1.35 / pow(rr, 1.5);
        float swirl = ang + uTime * omega * 2.6;

        float turb = fbm(vec3(cos(swirl) * rr * 0.52,
                              sin(swirl) * rr * 0.52,
                              rr * 0.34 - uTime * 0.06) * 1.5);
        float band = 0.42 + 0.58 * turb;
        band *= smoothstep(0.0, 0.16, t) * (1.0 - smoothstep(0.55, 1.0, t));

        // relativistic beaming: the approaching limb gets boosted hard
        vec3  orbit = normalize(cross(vec3(0.0, 1.0, 0.0), hit));
        float beta  = clamp(0.52 / sqrt(rr), 0.0, 0.72);
        float mu    = dot(orbit, -dir);
        float dopp  = pow(1.0 / max(1.0 - beta * mu, 0.16), 2.6);

        // gravitational redshift climbing back out of the well
        float grav = sqrt(max(1.0 - R_HORIZON / rr, 0.02));

        float emiss = band * pow(R_ISCO / rr, 2.1) * 1.55;
        accum += diskTint(t) * emiss * dopp * grav;
      }
    }
  }

  // A ray still this deep, and still heading inward, after exhausting its
  // budget is not coming back out. Kept tight: too generous a test and whole
  // bands of rays that do escape get painted black, flattening the shadow.
  if (!swallowed && length(pos) < 1.9 && dot(pos, dir) < 0.0) swallowed = true;

  vec3 col = accum;

  if (!swallowed) {
    col += warpedStars(dir, fwd, uWarp * 7.0) * 0.94;
  }

  // Photon ring: rays that grazed the sphere at 1.5 r_s pile up right here.
  // Captured rays get almost nothing — the shadow has to read as a true hole,
  // since that darkness is the only part of the object anyone has photographed.
  float graze = smoothstep(2.45, 1.5, minR) * (swallowed ? 0.10 : 1.0);
  col += vec3(1.0, 0.82, 0.54) * pow(graze, 3.0) * 0.46;

  // cheap stand-in for bloom, keyed off how close the ray came
  if (!swallowed) {
    col += vec3(0.85, 0.44, 0.16) * smoothstep(6.0, 1.6, minR) * 0.03;
  }

  // --- grade ---------------------------------------------------------------
  col *= 1.18;
  col = (col * (2.51 * col + 0.03)) / (col * (2.43 * col + 0.59) + 0.14); // ACES
  col = pow(max(col, 0.0), vec3(0.4545));

  // violet cast in the shadows so the void never reads as dead grey
  col = mix(col, col * vec3(0.86, 0.86, 1.10) + vec3(0.012, 0.008, 0.026), 0.5);

  float vig = 1.0 - 0.30 * dot(uv * 0.62, uv * 0.62);
  col *= vig;

  // dithered grain kills banding across the huge dark gradients, but never
  // inside the shadow
  float grain = hash31(vec3(gl_FragCoord.xy, floor(uTime * 24.0))) - 0.5;
  col += grain * (swallowed ? 0.004 : 0.018);

  fragColor = vec4(max(col, 0.0) * uFade, 1.0);
}
`;
