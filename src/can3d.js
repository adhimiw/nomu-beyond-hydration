import * as THREE from 'three';

export const FLAVORS = {
  lemongrass: {
    id: 'lemongrass',
    name: 'Lemongrass',
    kanjiMark: '野武',
    flavorKanji: '檸檬草',
    subtitle: 'Crisp, Citrusy & Uplifting',
    tagline: 'Restorative small-batch infusion for mental clarity, focus, and clean energy.',
    primaryColor: '#8EB021',
    secondaryColor: '#658212',
    bgColor: '#121708',
    glowColor: 0x8EB021,
    liquidColor: 0x9ACD32,
    accentHex: '#E9F3D0',
    tag: 'LEMONGRASS',
    price: 95,
    tastingNotes: {
      top: 'Cold-pressed Nilgiri lemongrass stalks',
      heart: 'Citrus peel & wild holy basil (Tulsi)',
      base: 'Bioavailable electrolyte salts & prebiotic fiber'
    },
    meters: {
      citrus: 92,
      sweetness: 18,
      effervescence: 76,
      botanical: 94
    },
    nutrition: {
      calories: 10,
      carbs: '2g',
      sugars: '0g',
      electrolytes: '520mg',
      prebiotics: '2g'
    }
  },
  chamomile: {
    id: 'chamomile',
    name: 'Chamomile',
    kanjiMark: '花',
    flavorKanji: 'カモミール',
    subtitle: 'Gentle, Floral & Soothing',
    tagline: 'Calming botanical infusion crafted for evening relaxation, mindful stress relief, and deep rest.',
    primaryColor: '#D99B26',
    secondaryColor: '#B47B16',
    bgColor: '#1A1408',
    glowColor: 0xD99B26,
    liquidColor: 0xF59E0B,
    accentHex: '#FDF3D6',
    tag: 'CHAMOMILE',
    price: 95,
    tastingNotes: {
      top: 'Whole sun-dried Roman chamomile blossoms',
      heart: 'Subtle sweet lavender & elderflower',
      base: 'Natural magnesium chelate & Himalayan minerals'
    },
    meters: {
      citrus: 20,
      sweetness: 35,
      effervescence: 62,
      botanical: 88
    },
    nutrition: {
      calories: 12,
      carbs: '2g',
      sugars: '0g',
      electrolytes: '500mg',
      prebiotics: '2g'
    }
  },
  vetiver: {
    id: 'vetiver',
    name: 'Vetiver',
    kanjiMark: '根',
    flavorKanji: '香根草',
    subtitle: 'Earthy, Cooling & Deeply Grounding',
    tagline: 'Traditional Indian Ayurvedic cooling root for internal heat balance, gut ease, and deep restorative calm.',
    primaryColor: '#4A6B52',
    secondaryColor: '#2F4B36',
    bgColor: '#0D140E',
    glowColor: 0x4A6B52,
    liquidColor: 0x556B2F,
    accentHex: '#E1ECE4',
    tag: 'VETIVER',
    price: 95,
    tastingNotes: {
      top: 'Organic South Indian vetiver (khus) roots',
      heart: 'Cooling cucumber rind & mint leaf',
      base: 'Potassium citrate & restorative sea trace minerals'
    },
    meters: {
      citrus: 24,
      sweetness: 15,
      effervescence: 70,
      botanical: 96
    },
    nutrition: {
      calories: 8,
      carbs: '1.5g',
      sugars: '0g',
      electrolytes: '540mg',
      prebiotics: '2g'
    }
  },
  grapefruit: {
    id: 'grapefruit',
    name: 'Grapefruit',
    kanjiMark: '果',
    flavorKanji: 'グレープフルーツ',
    subtitle: 'Zesty, Ruby Pink & Effervescent',
    tagline: 'Invigorating citrus antioxidant infusion with natural ruby red grapefruit extract for all-day revival.',
    primaryColor: '#E05A47',
    secondaryColor: '#B83827',
    bgColor: '#1A0B09',
    glowColor: 0xE05A47,
    liquidColor: 0xE11D48,
    accentHex: '#FDE7E3',
    tag: 'GRAPEFRUIT',
    price: 95,
    tastingNotes: {
      top: 'Cold-pressed Ruby Red grapefruit essence',
      heart: 'Hibiscus calyx & pink peppercorn touch',
      base: 'Electrolyte blend & zinc picolinate'
    },
    meters: {
      citrus: 90,
      sweetness: 26,
      effervescence: 84,
      botanical: 86
    },
    nutrition: {
      calories: 12,
      carbs: '2.5g',
      sugars: '0g',
      electrolytes: '510mg',
      prebiotics: '2g'
    }
  }
};

export class NomuCanScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.currentFlavor = FLAVORS.lemongrass;
    this.viewMode = 'normal'; // 'normal' | 'frost' | 'exploded'
    this.finishMode = 'matte'; // 'matte' (Signature Ceramic White) | 'glass' (Botanical Fluid)
    this.isAutoRotating = true;
    this.isDragging = false;
    this.pointer = { x: 0, y: 0, prevX: 0, prevY: 0, targetRotY: 0, targetRotX: 0 };
    this.explodedFactor = 0; // 0 to 1

    // Preload authentic brand image assets
    this.logoImg = new Image();
    this.logoImg.src = '/img/nomu/nomu_logo_clean.png';
    this.wordmarkImg = new Image();
    this.wordmarkImg.src = '/img/nomu/nomu_wordmark_dark.png';

    let assetsLoaded = 0;
    const onAssetLoad = () => {
      assetsLoaded++;
      if (this.labelCanvas && this.labelTexture) {
        this.renderLabelContent();
        this.labelTexture.needsUpdate = true;
      }
    };
    this.logoImg.onload = onAssetLoad;
    this.wordmarkImg.onload = onAssetLoad;

    this.initScene();
    this.createBottle();
    this.createParticles();
    this.setupEvents();
    this.animate();
  }

  initScene() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight || 560;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(34, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0.05, 6.4);

    // WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // Studio 3-Point & Rim Lighting
    this.ambientLight = new THREE.AmbientLight(0xfff8f0, 0.9);
    this.scene.add(this.ambientLight);

    // Key Light (Warm soft directional)
    this.keyLight = new THREE.DirectionalLight(0xfff5e8, 2.4);
    this.keyLight.position.set(3.5, 5.0, 4.0);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.scene.add(this.keyLight);

    // Fill Light (Gentle diffuse cool light)
    this.fillLight = new THREE.DirectionalLight(0xe8f0ff, 1.2);
    this.fillLight.position.set(-4.0, 2.5, 3.0);
    this.scene.add(this.fillLight);

    // Rim / Backlight for Glass Edge Brilliance
    this.rimLight = new THREE.DirectionalLight(0xffffff, 2.8);
    this.rimLight.position.set(0.0, 4.0, -4.5);
    this.scene.add(this.rimLight);

    // Bottom Bounce Light
    this.bounceLight = new THREE.DirectionalLight(0xffeedd, 0.6);
    this.bounceLight.position.set(0.0, -3.0, 2.0);
    this.scene.add(this.bounceLight);
  }

  // Generate 2048x1024 Authentic Japanese Craft Label
  createLabelTexture(flavor) {
    this.labelCanvas = document.createElement('canvas');
    this.labelCanvas.width = 2048;
    this.labelCanvas.height = 1024;
    this.labelCtx = this.labelCanvas.getContext('2d');

    this.renderLabelContent();

    this.labelTexture = new THREE.CanvasTexture(this.labelCanvas);
    this.labelTexture.anisotropy = 16;
    return this.labelTexture;
  }

  renderLabelContent() {
    const canvas = this.labelCanvas;
    const ctx = this.labelCtx;
    const flavor = this.currentFlavor;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Washi Paper Matte Background
    ctx.fillStyle = '#FAF9F6'; // Warm Japanese ecru washi paper
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle washi organic texture grain
    ctx.fillStyle = 'rgba(0, 0, 0, 0.015)';
    for (let i = 0; i < 4000; i++) {
      const rx = Math.random() * canvas.width;
      const ry = Math.random() * canvas.height;
      ctx.fillRect(rx, ry, 2, 2);
    }

    // 2. Flavor Gradient Splay at Label Base (as seen on real bottles)
    const grad = ctx.createLinearGradient(0, 520, 0, 1024);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    grad.addColorStop(0.35, flavor.primaryColor + '44');
    grad.addColorStop(0.85, flavor.primaryColor + 'EE');
    grad.addColorStop(1.0, flavor.secondaryColor);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 520, canvas.width, 504);

    // Top hairline framing rule
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 2;
    ctx.strokeRect(120, 60, canvas.width - 240, canvas.height - 120);

    // Left Panel: Craft Botanical Provenance (x ~ 260)
    const leftX = 260;
    ctx.textAlign = 'left';

    ctx.save();
    ctx.fillStyle = '#18181B';
    ctx.font = '700 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '5px';
    ctx.fillText('HERB-INFUSED WATER', leftX, 180);

    ctx.font = '500 20px "Noto Serif JP", serif';
    ctx.letterSpacing = '8px';
    ctx.fillStyle = '#52525B';
    ctx.fillText('機能性天然ハーブ飲料', leftX, 230);
    ctx.fillText('純国産ボタニカル水', leftX, 270);
    ctx.fillText('飲む · BEYOND HYDRATION', leftX, 310);

    ctx.font = '400 18px monospace';
    ctx.fillStyle = '#71717A';
    ctx.fillText('ORIGIN: CHENNAI, INDIA', leftX, 380);
    ctx.fillText('BATCH: SMALL BATCH 01', leftX, 410);
    ctx.fillText('NO PRESERVATIVES · ZERO SUGAR', leftX, 440);
    ctx.restore();

    // CENTER PANEL: Authentic Kanji Frame + Logo + Wordmark (x = 1024)
    const centerX = 1024;

    // 1. Framed Kanji Square Badge (Direct from @drinkitnomu real bottles)
    const boxSize = 150;
    const boxX = centerX - boxSize / 2;
    const boxY = 130;

    ctx.strokeStyle = '#18181B';
    ctx.lineWidth = 5;
    ctx.strokeRect(boxX, boxY, boxSize, boxSize);

    // Kanji Character inside Box
    ctx.fillStyle = '#18181B';
    ctx.font = '700 88px "Noto Serif JP", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(flavor.kanjiMark, centerX, boxY + boxSize / 2 + 6);
    ctx.textBaseline = 'alphabetic'; // reset

    // 2. Authentic NOMU Wordmark (Clean extracted typography)
    if (this.wordmarkImg && this.wordmarkImg.complete && this.wordmarkImg.naturalWidth > 0) {
      const wmWidth = 360;
      const wmHeight = wmWidth * (this.wordmarkImg.naturalHeight / this.wordmarkImg.naturalWidth);
      ctx.drawImage(this.wordmarkImg, centerX - wmWidth / 2, 330, wmWidth, wmHeight);
    } else {
      ctx.font = '900 76px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.letterSpacing = '10px';
      ctx.fillText('NOMU', centerX, 390);
    }

    // 3. Authentic Japanese Logo Brushmark (loaded from real Instagram profile)
    if (this.logoImg && this.logoImg.complete && this.logoImg.naturalWidth > 0) {
      const logoSize = 110;
      ctx.drawImage(this.logoImg, centerX - logoSize / 2, 450, logoSize, logoSize);
    }

    // "BEYOND HYDRATION"
    ctx.font = '700 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#18181B';
    ctx.letterSpacing = '8px';
    ctx.fillText('BEYOND HYDRATION', centerX, 610);

    // Flavor Capsule Label
    ctx.fillStyle = flavor.primaryColor || '#18181B';
    const pillW = 440;
    const pillH = 64;
    const pillX = centerX - pillW / 2;
    const pillY = 660;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, 32);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText(flavor.name.toUpperCase(), centerX, 702);

    // Japanese flavor kanji subtitle
    ctx.font = '600 26px "Noto Serif JP", serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.letterSpacing = '6px';
    ctx.fillText(flavor.flavorKanji + ' · 飲む', centerX, 780);

    // Volume declaration
    ctx.font = '600 20px monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.letterSpacing = '3px';
    ctx.fillText('330ml · 11.2 FL OZ', centerX, 830);

    // RIGHT PANEL: Formulation Ledger & Barcode (x ~ 1640)
    const rightX = 1620;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#18181B';
    ctx.font = '700 22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('ELECTROLYTE MATRIX', rightX, 180);

    ctx.font = '500 17px monospace';
    ctx.fillStyle = '#3F3F46';
    ctx.fillText('POTASSIUM CITRATE ..... 320mg', rightX, 230);
    ctx.fillText('HIMALAYAN SODIUM ...... 180mg', rightX, 265);
    ctx.fillText('MAGNESIUM CHELATE ..... 20mg', rightX, 300);
    ctx.fillText('PREBIOTIC INULIN ...... 2.0g', rightX, 335);
    ctx.fillText('L-THEANINE EXTRACT .... 100mg', rightX, 370);
    ctx.fillText('CALORIES .............. 12 kcal', rightX, 405);
    ctx.fillText('REFINED SUGAR ......... 0.0g', rightX, 440);

    // Barcode Block
    ctx.fillStyle = '#18181B';
    for (let x = rightX; x < rightX + 240; x += 5) {
      if (Math.random() > 0.3) {
        ctx.fillRect(x, 500, Math.random() > 0.5 ? 3 : 2, 60);
      }
    }
    ctx.font = '400 14px monospace';
    ctx.fillText('4 582194 003182', rightX + 45, 580);
  }

  // Create procedural surface condensation droplet bump texture
  createFrostBumpTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 480; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = 1.5 + Math.random() * 6;
      const radGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
      radGrad.addColorStop(0, '#FFFFFF');
      radGrad.addColorStop(0.7, '#B0B0B0');
      radGrad.addColorStop(1, '#808080');
      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    return tex;
  }

  // Build the authentic NOMU glass beverage bottle with white cap & liquid core
  createBottle() {
    this.bottleGroup = new THREE.Group();
    this.scene.add(this.bottleGroup);

    const segments = 64;

    // 1. OUTER GLASS BOTTLE PROFILE (Continuous Lathe Spline)
    // Modeled faithfully to the real Japanese electrolyte bottles in the tasting room
    const glassPoints = [
      new THREE.Vector2(0.01, -1.80),
      new THREE.Vector2(0.68, -1.80),
      new THREE.Vector2(0.78, -1.74),
      new THREE.Vector2(0.80, -1.60),
      new THREE.Vector2(0.80, 0.50),   // Cylindrical body
      new THREE.Vector2(0.77, 0.80),   // Elegant shoulder taper
      new THREE.Vector2(0.66, 1.10),
      new THREE.Vector2(0.50, 1.30),
      new THREE.Vector2(0.36, 1.42),
      new THREE.Vector2(0.35, 1.68),   // Threaded neck
      new THREE.Vector2(0.37, 1.69),
      new THREE.Vector2(0.34, 1.72),
      new THREE.Vector2(0.28, 1.72)    // Lip
    ];

    const glassGeom = new THREE.LatheGeometry(glassPoints, segments);
    this.frostBumpTexture = this.createFrostBumpTexture();

    // Matte Porcelain Material (Matches client video hero bottle aesthetic)
    this.matteMaterial = new THREE.MeshStandardMaterial({
      color: 0xFAFAFD,
      roughness: 0.32,
      metalness: 0.02
    });

    // Translucent Glass Material
    this.glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.94,
      opacity: 1.0,
      transparent: true,
      roughness: 0.08,
      ior: 1.52,
      thickness: 0.85,
      specularIntensity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    });

    // Default to sleek matte porcelain bottle (matches client video hero bottle aesthetic)
    this.glassMesh = new THREE.Mesh(glassGeom, this.matteMaterial);
    this.glassMesh.castShadow = true;
    this.glassMesh.receiveShadow = true;
    this.bottleGroup.add(this.glassMesh);

    // 2. INNER LIQUID VOLUME
    // Translucent fluid volume filling up to shoulder level (y = 0.85)
    const liquidPoints = [
      new THREE.Vector2(0.01, -1.72),
      new THREE.Vector2(0.66, -1.72),
      new THREE.Vector2(0.76, -1.58),
      new THREE.Vector2(0.76, 0.50),
      new THREE.Vector2(0.73, 0.76),
      new THREE.Vector2(0.62, 0.86),
      new THREE.Vector2(0.01, 0.86)    // Meniscus surface
    ];

    const liquidGeom = new THREE.LatheGeometry(liquidPoints, segments);
    this.liquidMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(this.currentFlavor.glowColor),
      transmission: 0.68,
      roughness: 0.06,
      ior: 1.33,
      thickness: 1.2,
      specularIntensity: 0.8
    });

    this.liquidMesh = new THREE.Mesh(liquidGeom, this.liquidMaterial);
    this.liquidMesh.visible = false; // Hidden in default matte finish
    this.bottleGroup.add(this.liquidMesh);

    // 3. AUTHENTIC WRAP-AROUND BOTANICAL CRAFT LABEL
    // Cylindrical label fitted snugly against the glass body
    const labelRadius = 0.804;
    const labelHeight = 1.75;
    const labelGeom = new THREE.CylinderGeometry(labelRadius, labelRadius, labelHeight, segments, 1, true);
    // Align front label center panel directly facing the camera
    labelGeom.rotateY(Math.PI);

    this.labelTexture = this.createLabelTexture(this.currentFlavor);

    this.labelMaterial = new THREE.MeshStandardMaterial({
      map: this.labelTexture,
      roughness: 0.65,
      metalness: 0.02,
      side: THREE.DoubleSide
    });

    this.labelMesh = new THREE.Mesh(labelGeom, this.labelMaterial);
    this.labelMesh.position.y = -0.42;
    this.bottleGroup.add(this.labelMesh);

    // 4. MINIMALIST WHITE SCREW CAP & SEAL RING
    this.capGroup = new THREE.Group();
    this.capGroup.position.y = 1.70;

    const capMaterial = new THREE.MeshStandardMaterial({
      color: 0xFAFAFA,
      roughness: 0.32,
      metalness: 0.04
    });

    // Ribbed screw cap cylinder
    const capGeom = new THREE.CylinderGeometry(0.38, 0.38, 0.34, 48);
    this.capMesh = new THREE.Mesh(capGeom, capMaterial);
    this.capMesh.position.y = 0.17;
    this.capMesh.castShadow = true;
    this.capGroup.add(this.capMesh);

    // Top cap bevel bevel lid
    const capTopGeom = new THREE.CylinderGeometry(0.36, 0.38, 0.04, 48);
    const capTop = new THREE.Mesh(capTopGeom, capMaterial);
    capTop.position.y = 0.35;
    this.capGroup.add(capTop);

    // Tamper-evident seal ring at base
    const ringGeom = new THREE.TorusGeometry(0.375, 0.03, 16, 48);
    ringGeom.rotateX(Math.PI / 2);
    this.sealRing = new THREE.Mesh(ringGeom, capMaterial);
    this.sealRing.position.y = 0.01;
    this.capGroup.add(this.sealRing);

    this.bottleGroup.add(this.capGroup);

    // Ground Shadow Plate (Soft Studio Contact Shadow)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    const sGrad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
    sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
    sGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.18)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0.85 });
    const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.6), shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.82;
    this.scene.add(shadowPlane);
  }

  // Floating Micro-Bubbles / Botanical Effervescence inside the bottle
  createParticles() {
    const count = 90;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * 0.65;
      positions[i * 3 + 0] = Math.cos(theta) * r;
      positions[i * 3 + 1] = -1.6 + Math.random() * 2.3;
      positions[i * 3 + 2] = Math.sin(theta) * r;
      speeds[i] = 0.004 + Math.random() * 0.008;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particleSpeeds = speeds;

    const pMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.045,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geom, pMat);
    this.bottleGroup.add(this.particles);
  }

  // Interactive mouse/touch orbit & gyro tilt
  setupEvents() {
    const el = this.container;

    const onPointerDown = (e) => {
      this.isDragging = true;
      this.pointer.prevX = e.clientX || (e.touches && e.touches[0].clientX);
      this.pointer.prevY = e.clientY || (e.touches && e.touches[0].clientY);
      this.isAutoRotating = false;
    };

    const onPointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      if (this.isDragging) {
        const deltaX = clientX - this.pointer.prevX;
        const deltaY = clientY - this.pointer.prevY;
        this.pointer.targetRotY += deltaX * 0.008;
        this.pointer.targetRotX += deltaY * 0.005;
        this.pointer.targetRotX = Math.max(-0.4, Math.min(0.4, this.pointer.targetRotX));
        this.pointer.prevX = clientX;
        this.pointer.prevY = clientY;
      }

      // Parallax hover tilt when not dragging
      const rect = el.getBoundingClientRect();
      const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);
      this.pointer.x = normX;
      this.pointer.y = normY;
    };

    const onPointerUp = () => {
      this.isDragging = false;
    };

    el.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    el.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    window.addEventListener('resize', () => {
      if (!this.container) return;
      this.width = this.container.clientWidth;
      this.height = this.container.clientHeight || 560;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    });
  }

  setFlavor(flavorKey) {
    if (!FLAVORS[flavorKey]) return;
    this.currentFlavor = FLAVORS[flavorKey];

    // Smoothly transition liquid color
    if (this.liquidMaterial) {
      this.liquidMaterial.color.set(this.currentFlavor.glowColor);
    }

    // Re-render label texture with new flavor palette & kanji
    this.renderLabelContent();
    if (this.labelTexture) {
      this.labelTexture.needsUpdate = true;
    }
  }

  setViewMode(mode) {
    this.viewMode = mode;
    if (mode === 'frost') {
      this.glassMesh.material = this.glassMaterial;
      this.liquidMesh.visible = true;
      if (this.particlesMesh) this.particlesMesh.visible = true;
      this.glassMaterial.roughness = 0.38;
      this.glassMaterial.bumpMap = this.frostBumpTexture;
      this.glassMaterial.bumpScale = 0.035;
      this.glassMaterial.needsUpdate = true;
    } else {
      if (this.finishMode === 'glass') {
        this.glassMesh.material = this.glassMaterial;
        this.liquidMesh.visible = true;
        if (this.particlesMesh) this.particlesMesh.visible = true;
        this.glassMaterial.roughness = 0.08;
        this.glassMaterial.bumpMap = null;
        this.glassMaterial.needsUpdate = true;
      } else {
        this.glassMesh.material = this.matteMaterial;
        this.liquidMesh.visible = false;
        if (this.particlesMesh) this.particlesMesh.visible = false;
      }
    }
  }

  setFinishMode(finish) {
    this.finishMode = finish;
    if (finish === 'glass') {
      this.glassMesh.material = this.glassMaterial;
      this.liquidMesh.visible = true;
      if (this.particlesMesh) this.particlesMesh.visible = true;
    } else {
      this.glassMesh.material = this.matteMaterial;
      this.liquidMesh.visible = false;
      if (this.particlesMesh) this.particlesMesh.visible = false;
    }
  }

  toggleAutoRotate() {
    this.isAutoRotating = !this.isAutoRotating;
    return this.isAutoRotating;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const time = performance.now() * 0.001;

    // Smooth continuous auto-rotation
    if (this.isAutoRotating) {
      this.pointer.targetRotY += 0.005;
    }

    // Inertia damping
    this.bottleGroup.rotation.y += (this.pointer.targetRotY - this.bottleGroup.rotation.y) * 0.08;
    this.bottleGroup.rotation.x += (this.pointer.targetRotX + this.pointer.y * 0.08 - this.bottleGroup.rotation.x) * 0.08;
    this.bottleGroup.rotation.z = Math.sin(time * 0.8) * 0.015;

    // Gentle floating bob
    this.bottleGroup.position.y = Math.sin(time * 1.5) * 0.04;

    // Exploded View Mode Animation
    const targetExploded = this.viewMode === 'exploded' ? 1.0 : 0.0;
    this.explodedFactor += (targetExploded - this.explodedFactor) * 0.08;

    if (this.capGroup) {
      this.capGroup.position.y = 1.70 + this.explodedFactor * 1.2;
      this.sealRing.position.y = 0.01 + this.explodedFactor * 0.4;
    }
    if (this.labelMesh) {
      this.labelMesh.position.z = this.explodedFactor * 0.35;
      const scale = 1.0 + this.explodedFactor * 0.12;
      this.labelMesh.scale.set(scale, scale, scale);
    }
    if (this.liquidMesh) {
      this.liquidMesh.position.y = this.explodedFactor * 0.18;
    }
    if (this.glassMesh) {
      this.glassMesh.position.y = -this.explodedFactor * 0.15;
    }

    // Micro-bubbles rising simulation inside liquid
    if (this.particles) {
      const pos = this.particles.geometry.attributes.position.array;
      for (let i = 0; i < this.particleSpeeds.length; i++) {
        pos[i * 3 + 1] += this.particleSpeeds[i];
        pos[i * 3 + 0] += Math.sin(time * 2 + i) * 0.0005;
        // Reset when reaching meniscus
        if (pos[i * 3 + 1] > 0.82) {
          pos[i * 3 + 1] = -1.65;
        }
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
