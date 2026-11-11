import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

type FlightWorldOptions = {
  mobile?: boolean;
  reduced?: boolean;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

function makeCloudTexture(size: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, size, size);
    const blobs = Math.round(size / 9);
    for (let i = 0; i < blobs; i += 1) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const radius = size * (0.03 + Math.random() * 0.13);
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, 'rgba(255,255,255,0.92)');
      gradient.addColorStop(0.45, 'rgba(255,252,250,0.42)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    const clearings = Math.round(size / 14);
    ctx.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < clearings; i += 1) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const radius = size * (0.02 + Math.random() * 0.09);
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, 'rgba(0,0,0,0.9)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function makeGlowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(255,248,226,1)');
    gradient.addColorStop(0.22, 'rgba(255,224,168,0.85)');
    gradient.addColorStop(0.55, 'rgba(255,188,138,0.25)');
    gradient.addColorStop(1, 'rgba(255,188,138,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeSkyTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 8;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#0a1226');
    gradient.addColorStop(0.3, '#243a67');
    gradient.addColorStop(0.52, '#5e6f9f');
    gradient.addColorStop(0.68, '#b48fa0');
    gradient.addColorStop(0.82, '#f0b491');
    gradient.addColorStop(1, '#ffe8c9');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 8, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export class FlightWorld {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly plane = new THREE.Group();
  private readonly curve: THREE.CatmullRomCurve3;
  private readonly cloudNear: THREE.Mesh;
  private readonly cloudFar: THREE.Mesh;
  private readonly cloudTextures: THREE.Texture[] = [];
  private readonly disposables: Array<{ dispose: () => void }> = [];
  private readonly pmrem: THREE.PMREMGenerator;
  private readonly environment: THREE.Texture;
  private readonly mobile: boolean;
  private readonly reduced: boolean;
  private trail!: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
  private trailPositions!: Float32Array;
  private trailAttribute!: THREE.BufferAttribute;
  private trailCount = 0;
  private exhaust!: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
  private exhaustPositions!: Float32Array;
  private exhaustAttribute!: THREE.BufferAttribute;
  private exhaustCount = 0;
  private progress = 0;
  private disposed = false;
  private readonly airportGroup = new THREE.Group();
  private readonly airportMaterials: Array<{ material: THREE.Material; opacity: number }> = [];
  private readonly loaderMaterials: Array<{ material: THREE.Material; opacity: number }> = [];
  private readonly takeoffDir = new THREE.Vector3();
  private readonly takeoffStart = new THREE.Vector3();
  private readonly groundQuaternion = new THREE.Quaternion();
  private readonly cruisePlanePosition = new THREE.Vector3();
  private readonly cruisePlaneQuaternion = new THREE.Quaternion();
  private readonly cruiseCameraPosition = new THREE.Vector3();
  private readonly cruiseLookAt = new THREE.Vector3();
  private readonly groundY = -7.02;
  private cargoDoorPivot!: THREE.Group;
  private cargoBox!: THREE.Group;
  private cargoBoxHome = new THREE.Vector3();
  private cargoBoxTarget = new THREE.Vector3();
  private loaderGroup!: THREE.Group;
  private landingGear!: THREE.Group;

  constructor(canvas: HTMLCanvasElement, options: FlightWorldOptions = {}) {
    this.mobile = Boolean(options.mobile);
    this.reduced = Boolean(options.reduced);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !this.mobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.mobile ? 1.25 : 1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.06;
    this.renderer.shadowMap.enabled = !this.mobile;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0xd9b6ad, 42, 150);

    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 700);

    this.pmrem = new THREE.PMREMGenerator(this.renderer);
    this.environment = this.pmrem.fromScene(new RoomEnvironment(), 0.035).texture;
    this.scene.environment = this.environment;
    this.scene.environmentIntensity = 0.55;

    this.curve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-27, 3.4, -17),
        new THREE.Vector3(-15, 8.8, -5),
        new THREE.Vector3(-2, 4.4, 7),
        new THREE.Vector3(11, 9.6, 2),
        new THREE.Vector3(23, 2.6, -15),
      ],
      false,
      'catmullrom',
      0.5,
    );

    const start = this.curve.getPointAt(0);
    this.takeoffDir.copy(this.curve.getTangentAt(0)).setY(0).normalize();
    this.takeoffStart.copy(start).addScaledVector(this.takeoffDir, -26);
    this.takeoffStart.y = this.groundY + 0.58;
    const groundLook = new THREE.Object3D();
    groundLook.position.copy(this.takeoffStart);
    groundLook.lookAt(this.takeoffStart.clone().add(this.takeoffDir));
    this.groundQuaternion.copy(groundLook.quaternion);

    this.buildSky();
    this.buildLights();
    this.cloudNear = this.buildCloudSea(-7.4, 0.9, 3.5, 0.22);
    this.cloudFar = this.buildCloudSea(-10.6, 0.55, 2.1, 0.14);
    this.buildSun();
    this.buildParticles();
    this.buildTrail();
    this.buildExhaust();
    this.buildPlane();
    this.buildAirport();
    this.buildLoader();

    this.scene.add(this.plane);
    this.resize();
    this.setProgress(0);
    this.captureCruisePose();
  }

  private captureCruisePose() {
    this.cruisePlanePosition.copy(this.plane.position);
    this.cruisePlaneQuaternion.copy(this.plane.quaternion);
    this.cruiseCameraPosition.copy(this.camera.position);
  }

  private trackAirportMaterial(material: THREE.Material) {
    material.transparent = true;
    this.airportMaterials.push({ material, opacity: material.opacity });
    this.disposables.push(material);
    return material;
  }

  private trackLoaderMaterial(material: THREE.Material) {
    material.transparent = true;
    this.loaderMaterials.push({ material, opacity: material.opacity });
    this.disposables.push(material);
    return material;
  }

  private setAirportFade(fade: number) {
    const amount = clamp01(fade);
    this.airportGroup.visible = amount > 0.008;
    this.airportMaterials.forEach(({ material, opacity }) => {
      material.opacity = opacity * amount;
      material.depthWrite = amount > 0.55;
    });
  }

  private setLoaderFade(fade: number) {
    const amount = clamp01(fade);
    this.loaderGroup.visible = amount > 0.012;
    this.loaderMaterials.forEach(({ material, opacity }) => {
      material.opacity = opacity * amount;
      material.depthWrite = amount > 0.55;
    });
  }

  private buildAirport() {
    const groundMaterial = this.trackAirportMaterial(
      new THREE.MeshStandardMaterial({ color: 0x3d2c38, roughness: 0.96, metalness: 0.02 }),
    );
    const groundGeometry = new THREE.PlaneGeometry(520, 520);
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, this.groundY - 0.12, -12);
    ground.receiveShadow = true;
    this.airportGroup.add(ground);
    this.disposables.push(groundGeometry);

    const runway = new THREE.Group();
    const runwayCenter = this.takeoffStart.clone().addScaledVector(this.takeoffDir, 30);
    runway.position.set(runwayCenter.x, this.groundY, runwayCenter.z);
    runway.rotation.y = Math.atan2(this.takeoffDir.x, this.takeoffDir.z);

    const stripMaterial = this.trackAirportMaterial(
      new THREE.MeshStandardMaterial({ color: 0x20242d, roughness: 0.82, metalness: 0.12 }),
    );
    const stripGeometry = new THREE.BoxGeometry(20, 0.12, 184);
    const strip = new THREE.Mesh(stripGeometry, stripMaterial);
    strip.position.y = 0.04;
    strip.receiveShadow = true;
    runway.add(strip);
    this.disposables.push(stripGeometry);

    const shoulderMaterial = this.trackAirportMaterial(
      new THREE.MeshStandardMaterial({ color: 0x553f4a, roughness: 0.95 }),
    );
    for (const side of [-1, 1]) {
      const shoulderGeometry = new THREE.BoxGeometry(2.4, 0.08, 184);
      const shoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
      shoulder.position.set(side * 11.2, 0.015, 0);
      runway.add(shoulder);
      this.disposables.push(shoulderGeometry);
    }

    const dashMaterial = this.trackAirportMaterial(
      new THREE.MeshBasicMaterial({ color: 0xe8d8c5 }),
    );
    const dashGeometry = new THREE.BoxGeometry(0.32, 0.025, 4.8);
    const dashCount = 22;
    const dashes = new THREE.InstancedMesh(dashGeometry, dashMaterial, dashCount);
    const matrix = new THREE.Matrix4();
    for (let i = 0; i < dashCount; i += 1) {
      matrix.makeTranslation(0, 0.13, -84 + i * 8);
      dashes.setMatrixAt(i, matrix);
    }
    dashes.instanceMatrix.needsUpdate = true;
    runway.add(dashes);
    this.disposables.push(dashGeometry);

    const lightMaterial = this.trackAirportMaterial(
      new THREE.MeshBasicMaterial({ color: 0xffd8a1 }),
    );
    const lightGeometry = new THREE.SphereGeometry(0.1, 6, 6);
    const lightRows = 22;
    const edgeLights = new THREE.InstancedMesh(lightGeometry, lightMaterial, lightRows * 2);
    let lightIndex = 0;
    for (const side of [-1, 1]) {
      for (let i = 0; i < lightRows; i += 1) {
        matrix.makeTranslation(side * 10.6, 0.2, -84 + i * 8);
        edgeLights.setMatrixAt(lightIndex, matrix);
        lightIndex += 1;
      }
    }
    edgeLights.instanceMatrix.needsUpdate = true;
    runway.add(edgeLights);
    this.disposables.push(lightGeometry);

    const apronMaterial = this.trackAirportMaterial(
      new THREE.MeshStandardMaterial({ color: 0x4a3743, roughness: 0.92 }),
    );
    const apronGeometry = new THREE.BoxGeometry(58, 0.08, 68);
    const apron = new THREE.Mesh(apronGeometry, apronMaterial);
    apron.position.set(31, 0.01, -32);
    apron.receiveShadow = true;
    runway.add(apron);
    this.disposables.push(apronGeometry);

    const terminalMaterial = this.trackAirportMaterial(
      new THREE.MeshStandardMaterial({ color: 0x6e5360, roughness: 0.7, metalness: 0.15 }),
    );
    const terminalGeometry = new THREE.BoxGeometry(18, 8, 54);
    const terminal = new THREE.Mesh(terminalGeometry, terminalMaterial);
    terminal.position.set(58, 4, -32);
    runway.add(terminal);
    this.disposables.push(terminalGeometry);

    const glowMaterial = this.trackAirportMaterial(
      new THREE.MeshBasicMaterial({ color: 0xffcf9a }),
    );
    const glowGeometry = new THREE.BoxGeometry(0.5, 0.14, 48);
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.set(48.8, 2.4, -32);
    runway.add(glow);
    this.disposables.push(glowGeometry);

    this.airportGroup.add(runway);
    this.scene.add(this.airportGroup);
    this.setAirportFade(1);
  }

  private buildLoader() {
    const group = new THREE.Group();
    const offset = new THREE.Vector3(1.22, 0, 0.72).applyQuaternion(this.groundQuaternion);
    group.position.copy(this.takeoffStart).add(offset);
    group.position.y = this.groundY;
    group.quaternion.copy(this.groundQuaternion);

    const metal = this.trackLoaderMaterial(
      new THREE.MeshStandardMaterial({ color: 0xc9b7ad, roughness: 0.5, metalness: 0.55 }),
    );
    const darkMetal = this.trackLoaderMaterial(
      new THREE.MeshStandardMaterial({ color: 0x30282e, roughness: 0.68, metalness: 0.35 }),
    );
    const belt = this.trackLoaderMaterial(
      new THREE.MeshStandardMaterial({ color: 0x5b454f, roughness: 0.9 }),
    );
    const beacon = this.trackLoaderMaterial(
      new THREE.MeshBasicMaterial({ color: 0xffc987 }),
    );

    const bedGeometry = new THREE.BoxGeometry(1.5, 0.1, 1.05);
    const bed = new THREE.Mesh(bedGeometry, metal);
    bed.position.set(0, 0.52, 0);
    bed.castShadow = true;
    group.add(bed);
    this.disposables.push(bedGeometry);

    const beltGeometry = new THREE.BoxGeometry(1.28, 0.035, 0.82);
    const beltMesh = new THREE.Mesh(beltGeometry, belt);
    beltMesh.position.set(0, 0.585, 0);
    group.add(beltMesh);
    this.disposables.push(beltGeometry);

    for (const x of [-0.58, 0.58]) {
      for (const z of [-0.36, 0.36]) {
        const legGeometry = new THREE.BoxGeometry(0.09, 0.46, 0.09);
        const leg = new THREE.Mesh(legGeometry, darkMetal);
        leg.position.set(x, 0.27, z);
        group.add(leg);
        this.disposables.push(legGeometry);
      }
    }

    const axleGeometry = new THREE.BoxGeometry(1.28, 0.06, 0.06);
    const axle = new THREE.Mesh(axleGeometry, darkMetal);
    axle.position.set(0, 0.14, -0.34);
    group.add(axle);
    this.disposables.push(axleGeometry);

    const wheelGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 12);
    wheelGeometry.rotateZ(Math.PI / 2);
    for (const x of [-0.52, 0.52]) {
      const wheel = new THREE.Mesh(wheelGeometry, darkMetal);
      wheel.position.set(x, 0.13, -0.36);
      group.add(wheel);
    }
    this.disposables.push(wheelGeometry);

    const beaconGeometry = new THREE.SphereGeometry(0.055, 8, 8);
    const beaconMesh = new THREE.Mesh(beaconGeometry, beacon);
    beaconMesh.position.set(0.52, 0.82, 0.36);
    group.add(beaconMesh);
    this.disposables.push(beaconGeometry);

    this.loaderGroup = group;
    this.scene.add(group);
    this.setLoaderFade(1);
  }

  private buildSky() {
    const texture = makeSkyTexture();
    this.cloudTextures.push(texture);
    const geometry = new THREE.SphereGeometry(320, 32, 20);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
      depthWrite: false,
      toneMapped: false,
      fog: false,
    });
    const sky = new THREE.Mesh(geometry, material);
    sky.rotation.y = Math.PI * 0.35;
    this.scene.add(sky);
  }

  private buildLights() {
    const hemisphere = new THREE.HemisphereLight(0xcfe0ff, 0xffc9a5, 1.15);
    this.scene.add(hemisphere);

    const key = new THREE.DirectionalLight(0xfff0d8, 3.1);
    key.position.set(26, 34, 16);
    key.castShadow = true;
    key.shadow.mapSize.set(this.mobile ? 512 : 1024, this.mobile ? 512 : 1024);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 120;
    key.shadow.camera.left = -36;
    key.shadow.camera.right = 36;
    key.shadow.camera.top = 36;
    key.shadow.camera.bottom = -36;
    key.shadow.bias = -0.0007;
    key.shadow.radius = 6;
    this.scene.add(key);

    const rim = new THREE.DirectionalLight(0x9fb7ff, 2.0);
    rim.position.set(-24, 10, -26);
    this.scene.add(rim);

    const fill = new THREE.DirectionalLight(0xffd2c0, 0.7);
    fill.position.set(-6, -14, 18);
    this.scene.add(fill);

    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(220, 220),
      new THREE.ShadowMaterial({ opacity: 0.16 }),
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -7.1;
    shadowPlane.receiveShadow = true;
    shadowPlane.renderOrder = -1;
    this.scene.add(shadowPlane);
    this.disposables.push(shadowPlane.geometry, shadowPlane.material as THREE.Material);
  }

  private buildCloudSea(y: number, opacity: number, repeat: number, speed: number) {
    const texture = makeCloudTexture(this.mobile ? 380 : 620);
    texture.repeat.set(repeat, repeat);
    texture.offset.set(Math.random(), Math.random());
    this.cloudTextures.push(texture);

    const geometry = new THREE.PlaneGeometry(900, 900);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity,
      depthWrite: false,
      toneMapped: false,
      fog: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = y;
    mesh.renderOrder = 2;
    mesh.userData.speed = speed;
    this.scene.add(mesh);
    this.disposables.push(geometry, material);
    return mesh;
  }

  private buildSun() {
    const texture = makeGlowTexture();
    this.cloudTextures.push(texture);
    const material = new THREE.SpriteMaterial({
      map: texture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.7,
      toneMapped: false,
      fog: false,
    });
    const sun = new THREE.Sprite(material);
    sun.position.set(78, 18, -140);
    sun.scale.set(42, 42, 1);
    this.scene.add(sun);
    this.disposables.push(material);
  }

  private buildParticles() {
    const count = this.mobile ? 120 : 260;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = -45 + Math.random() * 90;
      positions[i * 3 + 1] = -2 + Math.random() * 24;
      positions[i * 3 + 2] = -45 + Math.random() * 90;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xffe6c4,
      size: 0.16,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    const points = new THREE.Points(geometry, material);
    this.scene.add(points);
    this.disposables.push(geometry, material);
  }

  private buildTrail() {
    this.trailCount = this.mobile ? 18 : 40;
    this.trailPositions = new Float32Array(this.trailCount * 3);
    const colors = new Float32Array(this.trailCount * 3);
    const palette = [
      new THREE.Color('#b3122f'),
      new THREE.Color('#8b6bd1'),
      new THREE.Color('#e0405a'),
      new THREE.Color('#a58ae0'),
    ];
    for (let i = 0; i < this.trailCount; i += 1) {
      const color = palette[i % palette.length];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    const geometry = new THREE.BufferGeometry();
    this.trailAttribute = new THREE.BufferAttribute(this.trailPositions, 3);
    geometry.setAttribute('position', this.trailAttribute);
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: this.mobile ? 0.34 : 0.27,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    points.renderOrder = 3;
    points.visible = !this.reduced;
    this.scene.add(points);
    this.disposables.push(geometry, material);
    this.trail = points;
  }

  private buildExhaust() {
    this.exhaustCount = this.mobile ? 18 : 34;
    this.exhaustPositions = new Float32Array(this.exhaustCount * 3);
    const geometry = new THREE.BufferGeometry();
    this.exhaustAttribute = new THREE.BufferAttribute(this.exhaustPositions, 3);
    geometry.setAttribute('position', this.exhaustAttribute);
    const material = new THREE.PointsMaterial({
      size: this.mobile ? 0.38 : 0.3,
      color: 0xe8dfd6,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      sizeAttenuation: true,
      blending: THREE.NormalBlending,
      toneMapped: false,
    });
    this.exhaust = new THREE.Points(geometry, material);
    this.exhaust.frustumCulled = false;
    this.exhaust.renderOrder = 4;
    this.exhaust.visible = !this.reduced;
    this.scene.add(this.exhaust);
    this.disposables.push(geometry, material);
  }

  private updateExhaust(power: number, backDir: THREE.Vector3, spread = 0.08) {
    if (!this.exhaust || this.reduced) return;
    const material = this.exhaust.material;
    material.opacity = Math.min(0.5, Math.max(0, power * 0.55));
    this.exhaust.visible = power > 0.01;
    const count = this.exhaustCount;
    for (let i = 0; i < count; i += 1) {
      const depth = 0.25 + (i / Math.max(1, count - 1)) * (1.1 + power * 1.4);
      const jitter = spread + depth * 0.08;
      for (const side of [-1, 1]) {
        const local = new THREE.Vector3(
          side * 1.18 + (Math.random() - 0.5) * jitter,
          -0.2 + (Math.random() - 0.5) * jitter * 0.8,
          0.02,
        );
        this.plane.localToWorld(local);
        local.addScaledVector(backDir, depth + Math.random() * 0.25);
        local.y += Math.random() * jitter * 0.5;
        if (side === -1) {
          this.exhaustPositions[i * 3] = local.x;
          this.exhaustPositions[i * 3 + 1] = local.y;
          this.exhaustPositions[i * 3 + 2] = local.z;
        }
      }
    }
    // fill both engines
    for (let i = 0; i < count; i += 1) {
      const side = i % 2 === 0 ? -1 : 1;
      const depth = 0.3 + (i / Math.max(1, count - 1)) * (1.2 + power * 1.6);
      const jitter = spread + depth * 0.07;
      const local = new THREE.Vector3(
        side * 1.18 + (Math.random() - 0.5) * jitter,
        -0.2 + (Math.random() - 0.5) * jitter * 0.7,
        0.02,
      );
      this.plane.localToWorld(local);
      local.addScaledVector(backDir, depth + Math.random() * 0.2);
      local.y += (Math.random() - 0.2) * jitter;
      this.exhaustPositions[i * 3] = local.x;
      this.exhaustPositions[i * 3 + 1] = local.y;
      this.exhaustPositions[i * 3 + 2] = local.z;
    }
    this.exhaustAttribute.needsUpdate = true;
  }

  private updateTrail(t: number) {
    if (!this.trail || this.reduced) return;
    const count = this.trailCount;
    for (let i = 0; i < count; i += 1) {
      const depth = i / Math.max(1, count - 1);
      const u = clamp01(t - depth * 0.085);
      const point = this.curve.getPointAt(u);
      const flutter = Math.sin(t * 28 + i * 0.9) * (0.1 + depth * 0.2);
      const sway = Math.cos(t * 21 + i * 1.7) * (0.14 + depth * 0.2);
      this.trailPositions[i * 3] = point.x + flutter;
      this.trailPositions[i * 3 + 1] = point.y + sway - 0.16 - depth * 0.32;
      this.trailPositions[i * 3 + 2] = point.z + flutter * 0.6;
    }
    this.trailAttribute.needsUpdate = true;
  }

  private buildPlane() {
    const body = new THREE.MeshPhysicalMaterial({
      color: 0xfdfaf7,
      metalness: 0.25,
      roughness: 0.24,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1.15,
    });
    const pearl = new THREE.MeshPhysicalMaterial({
      color: 0xf2e6e6,
      metalness: 0.35,
      roughness: 0.3,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1,
      side: THREE.DoubleSide,
    });
    const gold = new THREE.MeshStandardMaterial({
      color: 0xe7c98f,
      metalness: 1,
      roughness: 0.28,
      envMapIntensity: 1.2,
    });
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0x101b2c,
      metalness: 0.9,
      roughness: 0.08,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.5,
    });
    const engine = new THREE.MeshStandardMaterial({
      color: 0xc9d1da,
      metalness: 1,
      roughness: 0.22,
      envMapIntensity: 1.3,
    });
    const engineDark = new THREE.MeshStandardMaterial({
      color: 0x1a2230,
      metalness: 0.8,
      roughness: 0.35,
    });
    this.disposables.push(body, pearl, gold, glass, engine, engineDark);

    // Fuselage: lathe profile along +Z.
    const profile = [
      [0.015, -2.05],
      [0.11, -1.92],
      [0.24, -1.62],
      [0.37, -1.18],
      [0.45, -0.55],
      [0.46, 0.1],
      [0.43, 0.72],
      [0.34, 1.24],
      [0.22, 1.66],
      [0.09, 1.94],
      [0.0, 2.06],
    ].map(([radius, z]) => new THREE.Vector2(radius, z));

    const fuselageGeometry = new THREE.LatheGeometry(profile, this.mobile ? 36 : 64);
    fuselageGeometry.rotateX(Math.PI / 2);
    const fuselage = new THREE.Mesh(fuselageGeometry, body);
    fuselage.castShadow = true;
    this.plane.add(fuselage);
    this.disposables.push(fuselageGeometry);

    // Cockpit visor.
    const visorGeometry = new THREE.SphereGeometry(0.3, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2);
    visorGeometry.scale(0.94, 0.6, 1.75);
    const visor = new THREE.Mesh(visorGeometry, glass);
    visor.position.set(0, 0.29, 1.24);
    visor.castShadow = true;
    this.plane.add(visor);
    this.disposables.push(visorGeometry);

    // Cabin windows.
    const windowGeometry = new THREE.BoxGeometry(0.03, 0.06, 0.1);
    const windowMaterial = new THREE.MeshStandardMaterial({
      color: 0x2c3b4e,
      metalness: 0.9,
      roughness: 0.18,
      envMapIntensity: 1.2,
    });
    const perSide = this.mobile ? 8 : 12;
    const windows = new THREE.InstancedMesh(windowGeometry, windowMaterial, perSide * 2);
    const matrix = new THREE.Matrix4();
    const zStart = -1.15;
    const zStep = 2.4 / (perSide - 1);
    let index = 0;
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < perSide; i += 1) {
        const z = zStart + i * zStep;
        const x = side * 0.425;
        matrix.makeTranslation(x, 0.13, z);
        windows.setMatrixAt(index, matrix);
        index += 1;
      }
    }
    windows.instanceMatrix.needsUpdate = true;
    this.plane.add(windows);
    this.disposables.push(windowGeometry, windowMaterial);

    // Gold livery stripe.
    for (const side of [-1, 1]) {
      const stripeGeometry = new THREE.BoxGeometry(0.018, 0.045, 2.35);
      const stripe = new THREE.Mesh(stripeGeometry, gold);
      stripe.position.set(side * 0.44, -0.03, -0.05);
      this.plane.add(stripe);
      this.disposables.push(stripeGeometry);
    }

    // Gold spine along the top of the fuselage.
    const spineGeometry = new THREE.BoxGeometry(0.055, 0.02, 2.2);
    const spine = new THREE.Mesh(spineGeometry, gold);
    spine.position.set(0, 0.462, -0.1);
    this.plane.add(spine);
    this.disposables.push(spineGeometry);

    // Wings.
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0.32, 0.64);
    wingShape.lineTo(2.95, -0.28);
    wingShape.lineTo(2.84, -0.86);
    wingShape.lineTo(0.32, -0.94);
    wingShape.closePath();
    const wingGeometry = new THREE.ExtrudeGeometry(wingShape, {
      depth: 0.09,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.025,
      bevelSegments: 2,
      steps: 1,
    });
    wingGeometry.rotateX(Math.PI / 2);
    wingGeometry.translate(0, 0.045, 0);
    this.disposables.push(wingGeometry);

    const rightWing = new THREE.Mesh(wingGeometry, pearl);
    rightWing.rotation.z = 0.07;
    rightWing.castShadow = true;
    this.plane.add(rightWing);

    const leftWingGeometry = wingGeometry.clone();
    leftWingGeometry.scale(-1, 1, 1);
    const leftWing = new THREE.Mesh(leftWingGeometry, pearl);
    leftWing.rotation.z = -0.07;
    leftWing.castShadow = true;
    this.plane.add(leftWing);
    this.disposables.push(leftWingGeometry);

    // Winglets.
    for (const side of [-1, 1]) {
      const wingletGeometry = new THREE.BoxGeometry(0.05, 0.34, 0.5);
      const winglet = new THREE.Mesh(wingletGeometry, gold);
      winglet.position.set(side * 2.95, 0.17, -0.58);
      winglet.rotation.z = side * -0.22;
      this.plane.add(winglet);
      this.disposables.push(wingletGeometry);
    }

    // Engines.
    for (const side of [-1, 1]) {
      const nacelleGeometry = new THREE.CylinderGeometry(0.2, 0.235, 0.86, 24, 1, true);
      nacelleGeometry.rotateX(Math.PI / 2);
      const nacelle = new THREE.Mesh(nacelleGeometry, engine);
      nacelle.position.set(side * 1.18, -0.2, 0.02);
      nacelle.castShadow = true;
      this.plane.add(nacelle);
      this.disposables.push(nacelleGeometry);

      const intakeGeometry = new THREE.TorusGeometry(0.2, 0.035, 12, 28);
      const intake = new THREE.Mesh(intakeGeometry, engine);
      intake.position.set(side * 1.18, -0.2, 0.45);
      this.plane.add(intake);
      this.disposables.push(intakeGeometry);

      const fanGeometry = new THREE.CircleGeometry(0.185, 28);
      const fan = new THREE.Mesh(fanGeometry, engineDark);
      fan.position.set(side * 1.18, -0.2, 0.445);
      this.plane.add(fan);
      this.disposables.push(fanGeometry);

      const pylonGeometry = new THREE.BoxGeometry(0.09, 0.22, 0.52);
      const pylon = new THREE.Mesh(pylonGeometry, pearl);
      pylon.position.set(side * 1.14, 0.0, -0.02);
      this.plane.add(pylon);
      this.disposables.push(pylonGeometry);
    }

    // Vertical stabiliser.
    const finShape = new THREE.Shape();
    finShape.moveTo(-1.98, 0.04);
    finShape.lineTo(-1.02, 0.04);
    finShape.lineTo(-1.5, 0.92);
    finShape.lineTo(-1.82, 0.92);
    finShape.closePath();
    const finGeometry = new THREE.ExtrudeGeometry(finShape, {
      depth: 0.07,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.02,
      bevelSegments: 2,
      steps: 1,
    });
    finGeometry.rotateY(-Math.PI / 2);
    finGeometry.translate(0.035, 0, 0);
    const fin = new THREE.Mesh(finGeometry, body);
    fin.castShadow = true;
    this.plane.add(fin);
    this.disposables.push(finGeometry);

    // Horizontal stabilisers.
    for (const side of [-1, 1]) {
      const stabiliserGeometry = wingGeometry.clone();
      stabiliserGeometry.scale(side * 0.34, 0.34, 0.34);
      const stabiliser = new THREE.Mesh(stabiliserGeometry, pearl);
      stabiliser.position.set(side * 0.02, 0.06, -1.58);
      this.plane.add(stabiliser);
      this.disposables.push(stabiliserGeometry);
    }

    // Tail light.
    const lightGeometry = new THREE.SphereGeometry(0.055, 12, 12);
    const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffb0a0, toneMapped: false });
    const tailLight = new THREE.Mesh(lightGeometry, lightMaterial);
    tailLight.position.set(0, -0.02, -2.06);
    this.plane.add(tailLight);
    this.disposables.push(lightGeometry, lightMaterial);

    // Cargo hold and hinged door.
    const holdMaterial = new THREE.MeshStandardMaterial({
      color: 0x241b20,
      metalness: 0.25,
      roughness: 0.92,
    });
    const holdGeometry = new THREE.BoxGeometry(0.014, 0.42, 0.58);
    const hold = new THREE.Mesh(holdGeometry, holdMaterial);
    hold.position.set(0.424, 0.0, 0.72);
    this.plane.add(hold);
    this.disposables.push(holdGeometry, holdMaterial);

    const doorMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf7ece8,
      metalness: 0.22,
      roughness: 0.32,
      clearcoat: 0.7,
      clearcoatRoughness: 0.22,
      envMapIntensity: 1.05,
    });
    this.cargoDoorPivot = new THREE.Group();
    this.cargoDoorPivot.position.set(0.432, 0.22, 0.72);
    const doorGeometry = new THREE.BoxGeometry(0.018, 0.46, 0.58);
    const doorPanel = new THREE.Mesh(doorGeometry, doorMaterial);
    doorPanel.position.y = -0.23;
    doorPanel.castShadow = true;
    this.cargoDoorPivot.add(doorPanel);
    this.plane.add(this.cargoDoorPivot);
    this.disposables.push(doorGeometry, doorMaterial);

    // Plain blush cargo box with a gold ribbon cross.
    const cargoMaterial = new THREE.MeshStandardMaterial({
      color: 0xf1b4c5,
      metalness: 0.08,
      roughness: 0.52,
      envMapIntensity: 0.9,
    });
    const ribbonMaterial = new THREE.MeshStandardMaterial({
      color: 0xe7c98f,
      metalness: 0.8,
      roughness: 0.3,
      envMapIntensity: 1.1,
    });
    const boxSize = 0.24;
    this.cargoBox = new THREE.Group();
    const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize * 0.92, boxSize);
    const boxMesh = new THREE.Mesh(boxGeometry, cargoMaterial);
    boxMesh.castShadow = true;
    this.cargoBox.add(boxMesh);
    const bandA = new THREE.Mesh(
      new THREE.BoxGeometry(boxSize + 0.006, boxSize * 0.16, boxSize + 0.006),
      ribbonMaterial,
    );
    const bandB = new THREE.Mesh(
      new THREE.BoxGeometry(boxSize * 0.16, boxSize * 0.94, boxSize + 0.006),
      ribbonMaterial,
    );
    this.cargoBox.add(bandA, bandB);
    this.cargoBoxHome.set(1.22, 0.12, 0.72);
    this.cargoBoxTarget.set(0.3, 0.02, 0.72);
    this.cargoBox.position.copy(this.cargoBoxHome);
    this.plane.add(this.cargoBox);
    this.disposables.push(boxGeometry, cargoMaterial, ribbonMaterial);

    // Landing gear, hidden once airborne.
    this.landingGear = new THREE.Group();
    const gearMaterial = new THREE.MeshStandardMaterial({
      color: 0x26232a,
      metalness: 0.7,
      roughness: 0.42,
    });
    const strutGeometry = new THREE.CylinderGeometry(0.018, 0.018, 0.36, 7);
    const wheelGeometry = new THREE.CylinderGeometry(0.085, 0.085, 0.055, 12);
    wheelGeometry.rotateZ(Math.PI / 2);
    for (const gear of [
      { x: 0, z: 1.35 },
      { x: -0.56, z: -0.28 },
      { x: 0.56, z: -0.28 },
    ]) {
      const strut = new THREE.Mesh(strutGeometry, gearMaterial);
      strut.position.set(gear.x, -0.55, gear.z);
      this.landingGear.add(strut);
      const wheel = new THREE.Mesh(wheelGeometry, gearMaterial);
      wheel.position.set(gear.x, -0.73, gear.z);
      this.landingGear.add(wheel);
    }
    this.plane.add(this.landingGear);
    this.disposables.push(strutGeometry, wheelGeometry, gearMaterial);

    this.plane.scale.setScalar(0.92);
  }

  setTakeoff(value: number) {
    if (this.disposed) return;
    const u = clamp01(value);
    if (u >= 1) {
      this.setProgress(0);
      return;
    }

    const dir = this.takeoffDir;
    const roll = smoothstep(0.08, 0.36, u);
    const taxi = smoothstep(0.34, 0.72, u);
    const accel = smoothstep(0.62, 0.9, u);
    const travel = 26 * (roll * 0.18 + taxi * 0.42 + accel * 0.4 + smoothstep(0.88, 1, u) * 0.12);
    const groundPoint = this.takeoffStart.clone().addScaledVector(dir, travel);
    groundPoint.y = this.groundY + 0.58;
    const climb = smoothstep(0.66, 1, u);
    const position = groundPoint.lerp(this.cruisePlanePosition, climb);
    const idleBob = Math.sin(u * Math.PI * 10) * 0.012 * (1 - climb);
    position.y += idleBob;
    this.plane.position.copy(position);

    const pitch = smoothstep(0.64, 0.92, u) * 0.44;
    const groundRotation = this.groundQuaternion
      .clone()
      .multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-pitch, 0, 0)));
    groundRotation.slerp(this.cruisePlaneQuaternion, smoothstep(0.86, 1, u));
    this.plane.quaternion.copy(groundRotation);

    const doorOpen = smoothstep(0.02, 0.15, u) * (1 - smoothstep(0.24, 0.33, u));
    this.cargoDoorPivot.rotation.z = doorOpen * 1.06;

    const load = smoothstep(0.08, 0.24, u);
    this.cargoBox.position.lerpVectors(this.cargoBoxHome, this.cargoBoxTarget, load);
    this.cargoBox.rotation.y = -0.18 * (1 - load);
    this.cargoBox.visible = u < 0.32;

    const loaderOut = smoothstep(0.28, 0.45, u);
    this.loaderGroup.position.y = this.groundY - loaderOut * 1.3;
    this.setLoaderFade(1 - loaderOut);

    const airportFade = 1 - smoothstep(0.46, 0.88, u);
    this.setAirportFade(airportFade);

    this.landingGear.visible = u < 0.84;

    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.groundQuaternion);
    const forward = dir.clone();
    const drift = Math.sin(u * Math.PI * 2) * 0.18;
    const loadCamera = this.takeoffStart
      .clone()
      .addScaledVector(right, (this.mobile ? 8.8 : 7.2) + drift)
      .add(new THREE.Vector3(0, this.mobile ? 3.0 : 2.5, 0))
      .addScaledVector(forward, (this.mobile ? 5.8 : 4.8) + smoothstep(0, 0.35, u) * 1.1);
    const loadTarget = this.takeoffStart
      .clone()
      .addScaledVector(right, 0.2)
      .add(new THREE.Vector3(0, 0.12, 0))
      .addScaledVector(forward, 0.55 + smoothstep(0, 0.35, u) * 0.4);

    const chaseCamera = position
      .clone()
      .addScaledVector(right, this.mobile ? 7.8 : 6.6)
      .add(new THREE.Vector3(0, this.mobile ? 3.8 : 3.1, 0))
      .addScaledVector(forward, this.mobile ? -13 : -11.5);
    const chaseTarget = position
      .clone()
      .addScaledVector(forward, 4)
      .add(new THREE.Vector3(0, 1.0, 0));

    const follow = smoothstep(0.3, 0.66, u);
    const handover = smoothstep(0.7, 1, u);
    const cameraPosition = loadCamera
      .lerp(chaseCamera, follow)
      .lerp(this.cruiseCameraPosition, handover);
    const lookTarget = loadTarget.lerp(chaseTarget, follow).lerp(this.cruiseLookAt, handover);

    this.camera.position.copy(cameraPosition);
    this.camera.lookAt(lookTarget);

    const nearMap = (this.cloudNear.material as THREE.MeshBasicMaterial).map;
    const farMap = (this.cloudFar.material as THREE.MeshBasicMaterial).map;
    if (nearMap) nearMap.offset.x = u * 0.12;
    if (farMap) farMap.offset.x = u * 0.07;
    if (this.trail) this.trail.visible = false;

    const throttle = smoothstep(0.06, 0.24, u) * 0.45 + smoothstep(0.24, 0.72, u) * 0.35 + smoothstep(0.72, 1, u) * 0.5;
    const backDir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.plane.quaternion).normalize();
    if (this.exhaust) this.updateExhaust(throttle, backDir, 0.05 + throttle * 0.06);

    this.render();
  }

  setProgress(value: number) {
    if (this.disposed) return;
    const t = clamp01(value);
    this.progress = t;
    this.setAirportFade(0);
    this.setLoaderFade(0);
    this.cargoDoorPivot.rotation.z = 0;
    this.cargoBox.visible = false;
    this.landingGear.visible = false;
    if (this.trail) this.trail.visible = !this.reduced;
    if (this.exhaust) {
      this.exhaust.visible = false;
      (this.exhaust.material as THREE.PointsMaterial).opacity = 0;
    }

    const point = this.curve.getPointAt(t);
    const tangent = this.curve.getTangentAt(t).normalize();
    const nextTangent = this.curve.getTangentAt(Math.min(1, t + 0.012)).normalize();

    const bob = Math.sin(t * Math.PI * 6.2) * 0.09;
    this.plane.position.set(point.x, point.y + bob, point.z);
    this.plane.up.set(0, 1, 0);
    this.plane.lookAt(point.clone().add(tangent));

    const turn = new THREE.Vector3().crossVectors(tangent, nextTangent);
    const bank = THREE.MathUtils.clamp(-turn.y * 26, -0.62, 0.62);
    this.plane.rotateZ(bank);

    const up = new THREE.Vector3(0, 1, 0);
    const right = new THREE.Vector3().crossVectors(tangent, up).normalize();
    const orbit = -0.45 + t * 1.55;
    const distance = 20.5 - Math.sin(t * Math.PI) * 6.5;
    const behind = Math.cos(orbit) * distance;
    const side = Math.sin(orbit) * distance;
    const height = 5.8 + Math.sin(t * Math.PI) * 1.6 + Math.cos(t * Math.PI * 2) * 0.5;

    const cameraPosition = point
      .clone()
      .add(tangent.clone().multiplyScalar(-behind))
      .add(right.clone().multiplyScalar(side))
      .add(new THREE.Vector3(0, height, 0));

    this.camera.position.copy(cameraPosition);
    const look = point.clone().add(tangent.clone().multiplyScalar(3.4)).add(new THREE.Vector3(0, 0.9, 0));
    this.camera.lookAt(look);
    this.cruiseLookAt.copy(look);

    this.updateTrail(t);

    const nearMap = (this.cloudNear.material as THREE.MeshBasicMaterial).map;
    const farMap = (this.cloudFar.material as THREE.MeshBasicMaterial).map;
    if (nearMap) nearMap.offset.x = this.progress * (this.cloudNear.userData.speed as number);
    if (farMap) farMap.offset.x = this.progress * (this.cloudFar.userData.speed as number);

    this.render();
  }

  resize() {
    if (this.disposed) return;
    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    if (!width || !height) return;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.render();
  }

  render() {
    if (this.disposed) return;
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.environment.dispose();
    this.pmrem.dispose();
    this.cloudTextures.forEach((texture) => texture.dispose());
    this.disposables.forEach((item) => item.dispose());
    this.scene.environment = null;
    this.renderer.setAnimationLoop(null);
    this.renderer.dispose();
  }
}
