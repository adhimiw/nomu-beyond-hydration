---
name: dioramas-3d-web
description: Build cinematic, interactive 3D websites and landing pages where a choreographed 3D scene carries the whole page. Uses Three.js r186, pmndrs postprocessing, N8AO, GSAP, and Lenis smooth scroll. Use when designing, building, or reviewing 3D websites, interactive web experiences, hero canvases, camera-tracked scroll journeys, or immersive product presentations.
---

# Dioramas — Cinematic 3D Web Framework

Build immersive 3D landing pages where the 3D scene *is* the page: hyper-detailed models, real lighting, choreographed camera movements, post-processing HDR stack, and interactive touch points.

## Core Capabilities
- **Engine Core** (`core/`):
  - `engine.js`: Three.js lifecycle manager with HDR post-stack (AgX tone mapping, bloom, N8AO, noise, vignette).
  - `scroll.js`: Smooth scroll integration (Lenis + GSAP ScrollTrigger + SplitText).
  - `reflector.js`: Real-time planar reflections with roughness blur.
  - `input.js`: Damped pointer velocity, magnetic targets, and raycasting.
  - `ui.js`: Preloader, custom blended cursor states, and navigation.
- **Reference Implementation & Engine Guide**: Read [`references/engine.md`](references/engine.md) for full API details.
- **20 World Briefs**: Inspect [`references/briefs/`](references/briefs/) for inspiration and camera choreography recipes.

---

## The Build Run

### 1. Engine Initialization
Set up an `Engine` instance with canvas, post-processing stack, and environment:

```javascript
import { Engine, studioEnvironment, normalize, prepModel } from './core/engine.js';
import { Assets } from './core/assets.js';
import { smoothScroll, gsap, ScrollTrigger } from './core/scroll.js';
import { Pointer } from './core/input.js';

const engine = new Engine({
  canvas: document.getElementById('webgl-canvas'),
  fov: 40,
  near: 0.1,
  far: 100,
  post: {
    ao: { aoRadius: 1.2, intensity: 2.5 },
    bloom: { intensity: 0.4, luminanceThreshold: 0.8 },
    tone: 'agx',
    noise: 0.04
  }
});

studioEnvironment(engine.renderer, {
  top: 0x111122,
  bottom: 0x050508,
  panels: [
    { pos: [3, 4, 3], size: [4, 4], intensity: 4, color: 0xffffff },
    { pos: [-4, 2, -2], size: [3, 6], intensity: 2, color: 0x88bbff }
  ]
});
```

### 2. Loading & Preparing 3D Assets
Normalize models to scale and ground them at `y = 0`:

```javascript
const assets = new Assets();
const gltf = await assets.gltf('/models/hero.glb');
const model = normalize(gltf.scene, 3.0, { ground: true });
prepModel(model, engine.renderer, { cast: true, receive: true });
engine.scene.add(model);
```

### 3. Choreographing the Camera with Scroll
Bind camera position, rotation, and lookAt targets to GSAP ScrollTrigger timelines:

```javascript
smoothScroll(); // Initializes Lenis and connects to GSAP tick

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '#scroll-container',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1
  }
});

// Animate camera along a curve through scene chapters
tl.to(engine.camera.position, { x: 2.5, y: 1.8, z: 3.2, ease: 'none' }, 0)
  .to(model.rotation, { y: Math.PI * 0.75, ease: 'none' }, 0);
```

### 4. Interactive Moment
Give the user one signature interaction: wiping condensation, shining a flashlight/floodlight, tilting an object, or exploring layers.
