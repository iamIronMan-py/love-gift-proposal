import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

type FlightWorldOptions = {
  mobile?: boolean;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

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
  private progress = 0;
  private disposed = false;

  constructor(canvas: HTMLCanvasElement, options: FlightWorldOptions = {}) {
    this.mobile = Boolean(options.mobile);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !this.mobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.mobile ? 1.5 : 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.06;
    this.renderer.shadowMap.enabled = true;
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

    this.buildSky();
    this.buildLights();
    this.cloudNear = this.buildCloudSea(-7.4, 0.9, 3.5, 0.34);
    this.cloudFar = this.buildCloudSea(-10.6, 0.55, 2.1, 0.22);
    this.buildSun();
    this.buildParticles();
    this.buildPlane();

    this.scene.add(this.plane);
    this.resize();
    this.setProgress(0);
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

    this.plane.scale.setScalar(0.92);
  }

  setProgress(value: number) {
    if (this.disposed) return;
    const t = clamp01(value);
    this.progress = t;

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
