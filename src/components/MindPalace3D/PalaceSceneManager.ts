// PalaceSceneManager.ts
// Complete Three.js 3D world generator for the Clozapine Mind Palace
// Manages the Grand Rotunda hub, 9 custom architectural chambers, interactive doors,
// spatial loci pedestals, particle systems, and the 3rd-person animated character avatar.

import * as THREE from "three";
import { PalaceRoom, PalaceRoomId, MnemonicLocus } from "../../types";
import { PALACE_ROOMS } from "../../data/clozapineData";
import { CharacterController } from "./CharacterController";

export interface DoorObject {
  roomId: PalaceRoomId;
  doorNumber: number;
  name: string;
  position: THREE.Vector3;
  rotationY: number;
  leftDoor: THREE.Mesh;
  rightDoor: THREE.Mesh;
  isOpen: boolean;
  openProgress: number; // 0 to 1
  portalRing: THREE.Mesh;
  doorLight: THREE.PointLight;
}

export interface LocusObject {
  locus: MnemonicLocus;
  position: THREE.Vector3;
  pedestal: THREE.Group;
  artifactMesh: THREE.Object3D;
  beaconBeam: THREE.Mesh;
  ring: THREE.Mesh;
  light: THREE.PointLight;
}

export class PalaceSceneManager {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public characterController: CharacterController;

  // Character 3D components
  public characterGroup: THREE.Group;
  private leftLegPivot: THREE.Group;
  private rightLegPivot: THREE.Group;
  private leftArmPivot: THREE.Group;
  private rightArmPivot: THREE.Group;
  private capeMesh: THREE.Mesh;
  private lanternLight: THREE.PointLight;
  private lanternMesh: THREE.Mesh;

  // World state
  public currentMode: "rotunda" | "room" = "rotunda";
  public activeRoomId: PalaceRoomId | null = null;
  public worldGroup: THREE.Group; // Swapped or rebuilt per room
  public doors: DoorObject[] = [];
  public currentRoomLoci: LocusObject[] = [];
  public exitDoor: { leftDoor: THREE.Group | THREE.Mesh; rightDoor: THREE.Group | THREE.Mesh; position: THREE.Vector3; openProgress?: number } | null = null;

  // Active interaction targets detected by proximity
  public nearestDoor: DoorObject | null = null;
  public nearestLocus: LocusObject | null = null;
  public isNearExitDoor: boolean = false;

  // Particle systems & animated objects
  private animatedMeshes: Array<{
    mesh: THREE.Object3D;
    rotationSpeed?: THREE.Vector3;
    bobSpeed?: number;
    bobHeight?: number;
    initialY?: number;
  }> = [];

  // Canvas textures cache
  private textureCache: Map<string, THREE.CanvasTexture> = new Map();

  // Callbacks to React UI
  private onTriggerEnterRoom?: (roomId: PalaceRoomId) => void;
  private onTriggerReturnRotunda?: () => void;

  public container: HTMLDivElement;

  constructor(
    container: HTMLDivElement,
    onTriggerEnterRoom?: (roomId: PalaceRoomId) => void,
    onTriggerReturnRotunda?: () => void,
    onFootstep?: () => void,
    onInteract?: () => void
  ) {
    this.container = container;
    this.onTriggerEnterRoom = onTriggerEnterRoom;
    this.onTriggerReturnRotunda = onTriggerReturnRotunda;

    // 1. Setup Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0f1d);
    this.scene.fog = new THREE.FogExp2(0x0a0f1d, 0.010);

    // 2. Setup Camera
    const width = container.clientWidth > 0 ? container.clientWidth : (typeof window !== "undefined" && window.innerWidth > 0 ? window.innerWidth : 800);
    const height = container.clientHeight > 0 ? container.clientHeight : (typeof window !== "undefined" && window.innerHeight > 0 ? window.innerHeight : 600);
    const aspect = width / height;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 200);
    this.camera.position.set(0, 4, 13.5);

    // 3. Setup Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // 4. Setup Character Controller & Mesh
    this.characterController = new CharacterController(onFootstep, onInteract);
    const { group, leftLeg, rightLeg, leftArm, rightArm, cape, lantern, light } = this.buildCharacterModel();
    this.characterGroup = group;
    this.leftLegPivot = leftLeg;
    this.rightLegPivot = rightLeg;
    this.leftArmPivot = leftArm;
    this.rightArmPivot = rightArm;
    this.capeMesh = cape;
    this.lanternMesh = lantern;
    this.lanternLight = light;
    this.scene.add(this.characterGroup);

    // 5. Container group for the current world (Rotunda or Room)
    this.worldGroup = new THREE.Group();
    this.scene.add(this.worldGroup);

    // 6. Build Initial Grand Rotunda
    this.buildGrandRotunda();

    // 7. Initial character spawn in center facing North toward Door 1
    this.characterController.setPosition(0, 0, 7.5, Math.PI);
  }

  // =========================================================================
  // CHARACTER BUILDER - High-Contrast Clinical Scholar Avatar
  // =========================================================================
  private buildCharacterModel() {
    const group = new THREE.Group();

    // High-visibility, crisp clinical materials
    const labCoatMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc, // Crisp clean white doctor's coat - stands out vividly
      roughness: 0.35,
      metalness: 0.1,
    });
    const tealTrimMat = new THREE.MeshStandardMaterial({
      color: 0x0d9488, // Clinical teal accents
      roughness: 0.3,
      metalness: 0.5,
    });
    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Sky blue clinical scrub shirt
      roughness: 0.6,
    });
    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Polished brass / gold
      roughness: 0.25,
      metalness: 0.85,
    });
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xf5cfb3,
      roughness: 0.7,
    });
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x292524,
      roughness: 0.8,
    });
    const slacksMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Slate charcoal trousers
      roughness: 0.7,
    });
    const shoesMat = new THREE.MeshStandardMaterial({
      color: 0x451a03, // Mahogany leather dress shoes
      roughness: 0.4,
      metalness: 0.2,
    });

    // 1. Torso & Lab Coat
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.95, 0.46), labCoatMat);
    torso.position.y = 1.38;
    torso.castShadow = true;
    group.add(torso);

    // Inner scrub shirt / tie visible in coat opening
    const innerShirt = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.96, 0.47), shirtMat);
    innerShirt.position.set(0, 1.38, 0);
    group.add(innerShirt);

    // Teal lapels
    const leftLapel = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.8, 0.48), tealTrimMat);
    leftLapel.position.set(-0.16, 1.45, 0);
    const rightLapel = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.8, 0.48), tealTrimMat);
    rightLapel.position.set(0.16, 1.45, 0);
    group.add(leftLapel, rightLapel);

    // 2. Collar & Head
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.16, 12), labCoatMat);
    collar.position.y = 1.86;
    group.add(collar);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 18, 18), skinMat);
    head.position.y = 2.08;
    head.castShadow = true;
    group.add(head);

    // Hair
    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.27, 18, 18, 0, Math.PI * 2, 0, Math.PI * 0.65),
      hairMat
    );
    hair.position.y = 2.14;
    group.add(hair);

    // Scholar Spectacles / Medical Loupes
    const glasses = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.09, 0.08), goldTrimMat);
    glasses.position.set(0, 2.08, 0.23);
    group.add(glasses);

    // 3. Clinician Stethoscope (hanging around neck)
    const stethGroup = new THREE.Group();
    stethGroup.position.set(0, 1.78, 0.08);
    // Dark rubber tube around neck
    const stethTube = new THREE.Mesh(
      new THREE.TorusGeometry(0.26, 0.03, 8, 20, Math.PI * 1.2),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 })
    );
    stethTube.rotation.x = Math.PI * 0.45;
    stethTube.rotation.z = Math.PI * 0.9;
    stethTube.position.set(0, 0.06, 0.04);
    // Gold chest piece / bell resting on chest
    const stethBell = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.04, 16), goldTrimMat);
    stethBell.rotation.x = Math.PI / 2;
    stethBell.position.set(0.08, -0.22, 0.17);
    stethGroup.add(stethTube, stethBell);
    group.add(stethGroup);

    // 4. Lab Coat Tails / Flowing Coat
    const coatTailGeo = new THREE.PlaneGeometry(0.72, 0.9, 4, 4);
    coatTailGeo.translate(0, -0.45, 0);
    const coatTail = new THREE.Mesh(coatTailGeo, labCoatMat);
    coatTail.position.set(0, 0.92, -0.23);
    coatTail.rotation.x = 0.08;
    coatTail.castShadow = true;
    group.add(coatTail);

    // 5. Arms & Hands with Pivots
    // Left Arm Pivot
    const leftArm = new THREE.Group();
    leftArm.position.set(-0.48, 1.74, 0);
    const leftSleeve = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.72, 0.22), labCoatMat);
    leftSleeve.position.y = -0.36;
    leftSleeve.castShadow = true;
    const leftCuff = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.1, 0.23), tealTrimMat);
    leftCuff.position.y = -0.66;
    const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), skinMat);
    leftHand.position.y = -0.76;
    leftArm.add(leftSleeve, leftCuff, leftHand);
    group.add(leftArm);

    // Right Arm Pivot (Holds Diagnostic Torch / Prism)
    const rightArm = new THREE.Group();
    rightArm.position.set(0.48, 1.74, 0);
    const rightSleeve = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.72, 0.22), labCoatMat);
    rightSleeve.position.y = -0.36;
    rightSleeve.castShadow = true;
    const rightCuff = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.1, 0.23), tealTrimMat);
    rightCuff.position.y = -0.66;
    const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), skinMat);
    rightHand.position.y = -0.76;
    rightArm.add(rightSleeve, rightCuff, rightHand);
    group.add(rightArm);

    // 6. Floating Diagnostic Torch / Neural Prism (in front of right hand)
    const torchGroup = new THREE.Group();
    torchGroup.position.set(0.62, 1.35, 0.35); // Forward in hand
    const torchCore = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.16, 0),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 }) // Cyan glowing core
    );
    const torchRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.24, 0.025, 8, 24),
      goldTrimMat
    );
    torchRing.rotation.x = Math.PI * 0.35;
    torchGroup.add(torchCore, torchRing);

    const torchLight = new THREE.PointLight(0x38bdf8, 3.2, 12, 1.6);
    torchLight.position.set(0, 0, 0);
    torchGroup.add(torchLight);
    group.add(torchGroup);

    // 7. Legs & Shoes with Pivots
    // Left Leg
    const leftLeg = new THREE.Group();
    leftLeg.position.set(-0.2, 0.9, 0);
    const leftSlacks = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.58, 0.24), slacksMat);
    leftSlacks.position.y = -0.29;
    leftSlacks.castShadow = true;
    const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.34, 0.36), shoesMat);
    leftShoe.position.set(0, -0.68, 0.06); // Toe points forward
    leftShoe.castShadow = true;
    leftLeg.add(leftSlacks, leftShoe);
    group.add(leftLeg);

    // Right Leg
    const rightLeg = new THREE.Group();
    rightLeg.position.set(0.2, 0.9, 0);
    const rightSlacks = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.58, 0.24), slacksMat);
    rightSlacks.position.y = -0.29;
    rightSlacks.castShadow = true;
    const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.34, 0.36), shoesMat);
    rightShoe.position.set(0, -0.68, 0.06); // Toe points forward
    rightShoe.castShadow = true;
    rightLeg.add(rightSlacks, rightShoe);
    group.add(rightLeg);

    // 8. Ground Spotlight Targeting Disc under player's feet with heading arrow
    const groundDiscGroup = new THREE.Group();
    groundDiscGroup.position.set(0, 0.03, 0);
    const groundRing = new THREE.Mesh(
      new THREE.RingGeometry(0.65, 0.74, 32),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide })
    );
    groundRing.rotation.x = -Math.PI / 2;
    // Forward direction arrow on floor
    const arrowShape = new THREE.Shape();
    arrowShape.moveTo(0, 0.85);
    arrowShape.lineTo(-0.16, 0.55);
    arrowShape.lineTo(0.16, 0.55);
    arrowShape.closePath();
    const arrowGeo = new THREE.ShapeGeometry(arrowShape);
    const arrowMesh = new THREE.Mesh(
      arrowGeo,
      new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide })
    );
    arrowMesh.rotation.x = -Math.PI / 2;
    groundDiscGroup.add(groundRing, arrowMesh);
    group.add(groundDiscGroup);

    // 9. Floating 3D Overhead Name Badge: "Dr. Explorer (You)"
    const nameCanvas = document.createElement("canvas");
    nameCanvas.width = 512;
    nameCanvas.height = 128;
    const nctx = nameCanvas.getContext("2d")!;
    nctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    nctx.roundRect(16, 16, 480, 96, 24);
    nctx.fill();
    nctx.strokeStyle = "#38bdf8";
    nctx.lineWidth = 6;
    nctx.stroke();
    // Green active dot
    nctx.fillStyle = "#22c55e";
    nctx.beginPath();
    nctx.arc(60, 64, 16, 0, Math.PI * 2);
    nctx.fill();
    // Name text
    nctx.fillStyle = "#ffffff";
    nctx.font = "bold 34px Inter, sans-serif";
    nctx.textAlign = "left";
    nctx.textBaseline = "middle";
    nctx.fillText("Dr. Explorer (You)", 96, 64);

    const nameTexture = new THREE.CanvasTexture(nameCanvas);
    const nameBadgeMat = new THREE.SpriteMaterial({ map: nameTexture, transparent: true });
    const nameSprite = new THREE.Sprite(nameBadgeMat);
    nameSprite.position.set(0, 2.75, 0);
    nameSprite.scale.set(1.8, 0.45, 1);
    group.add(nameSprite);

    return {
      group,
      leftLeg,
      rightLeg,
      leftArm,
      rightArm,
      cape: coatTail,
      lantern: torchCore,
      light: torchLight,
    };
  }

  // =========================================================================
  // PROCEDURAL CANVAS TEXTURES FOR CRISP 3D LABELS
  // =========================================================================
  private createTextPlacard(
    title: string,
    subtitle: string,
    accentColor: string = "#f59e0b",
    width: number = 512,
    height: number = 256
  ): THREE.Mesh {
    const key = `${title}-${subtitle}-${accentColor}`;
    let texture = this.textureCache.get(key);

    if (!texture) {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;

      // Background plate
      ctx.fillStyle = "rgba(7, 10, 18, 0.92)";
      ctx.fillRect(0, 0, width, height);

      // Border with accent glow
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 10;
      ctx.strokeRect(10, 10, width - 20, height - 20);

      // Inner thin gold frame
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, width - 40, height - 40);

      // Title
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 38px Cinzel, Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(title, width / 2, height / 2 - 24);

      // Subtitle
      ctx.fillStyle = accentColor;
      ctx.font = "italic 22px Inter, sans-serif";
      ctx.fillText(subtitle, width / 2, height / 2 + 32);

      texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      this.textureCache.set(key, texture);
    }

    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.8), mat);
    return mesh;
  }

  // =========================================================================
  // GRAND ROTUNDA HUB BUILDER
  // =========================================================================
  public buildGrandRotunda() {
    this.currentMode = "rotunda";
    this.activeRoomId = null;
    this.doors = [];
    this.currentRoomLoci = [];
    this.exitDoor = null;
    this.animatedMeshes = [];

    // Clear world group
    while (this.worldGroup.children.length > 0) {
      this.worldGroup.remove(this.worldGroup.children[0]);
    }

    const rotundaRadius = 22;

    // 1. Lighting
    const ambientLight = new THREE.AmbientLight(0x1a2130, 1.4);
    this.worldGroup.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5e6, 2.0);
    dirLight.position.set(12, 25, 12);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 60;
    dirLight.shadow.camera.left = -25;
    dirLight.shadow.camera.right = 25;
    dirLight.shadow.camera.top = 25;
    dirLight.shadow.camera.bottom = -25;
    this.worldGroup.add(dirLight);

    // 2. Marble Floor with concentric gold rings
    const floorGeo = new THREE.CircleGeometry(rotundaRadius + 2, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0c111c,
      roughness: 0.35,
      metalness: 0.45,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.worldGroup.add(floor);

    // Concentric gold rings on floor
    const ringRadii = [4.5, 9, 14, 18];
    ringRadii.forEach((r) => {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(r - 0.08, r + 0.08, 64),
        new THREE.MeshBasicMaterial({ color: 0xd4af37, side: THREE.DoubleSide })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.01;
      this.worldGroup.add(ring);
    });

    // Outer Circular Stone Wall with Arcaded Windows
    const wallGeo = new THREE.CylinderGeometry(rotundaRadius + 1, rotundaRadius + 1, 14, 64, 1, true);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x161a24,
      roughness: 0.8,
      metalness: 0.2,
      side: THREE.BackSide,
    });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.y = 7;
    this.worldGroup.add(wall);

    // High Domed Ceiling Arch with starry skylight
    const domeGeo = new THREE.SphereGeometry(rotundaRadius + 2, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.45);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0x080c14,
      roughness: 0.9,
      side: THREE.BackSide,
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 13;
    this.worldGroup.add(dome);

    // Skylight Oculus Ring
    const oculusRing = new THREE.Mesh(
      new THREE.TorusGeometry(6, 0.35, 16, 48),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.3 })
    );
    oculusRing.position.y = 21;
    oculusRing.rotation.x = Math.PI / 2;
    this.worldGroup.add(oculusRing);

    // Grand Corinthian Columns around the circle
    const numColumns = 18;
    for (let i = 0; i < numColumns; i++) {
      const angle = (i * Math.PI * 2) / numColumns;
      const colX = Math.cos(angle) * (rotundaRadius - 1.5);
      const colZ = Math.sin(angle) * (rotundaRadius - 1.5);

      const colGroup = new THREE.Group();
      colGroup.position.set(colX, 0, colZ);

      // Base
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.8, 1.4),
        new THREE.MeshStandardMaterial({ color: 0x242b3d, roughness: 0.6 })
      );
      base.position.y = 0.4;
      base.castShadow = true;

      // Shaft
      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.48, 0.58, 11, 16),
        new THREE.MeshStandardMaterial({ color: 0x333d54, roughness: 0.5 })
      );
      shaft.position.y = 6.3;
      shaft.castShadow = true;

      // Capital
      const capital = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.8, 1.6),
        new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.6, roughness: 0.4 })
      );
      capital.position.y = 12.2;

      colGroup.add(base, shaft, capital);
      this.worldGroup.add(colGroup);
    }

    // Central Clozapine Neural Nexus Fountain (Center of Palace)
    this.buildCentralNexus();

    // 3. Build 9 Grand Doors around the Rotunda perimeter at radius 18m
    const doorRadius = 18.0;
    const numDoors = PALACE_ROOMS.length; // 9 rooms

    PALACE_ROOMS.forEach((room, index) => {
      // Angle for each door: evenly spaced
      const angle = (index * Math.PI * 2) / numDoors - Math.PI / 2;
      const posX = Math.cos(angle) * doorRadius;
      const posZ = Math.sin(angle) * doorRadius;

      // Door faces towards the center
      const doorFacingYaw = Math.atan2(-posX, -posZ);

      // Radial velvet carpet path leading from central plinth (radius 4.2) to the door threshold (radius 16.8)
      const pathStart = 4.2;
      const pathEnd = 16.8;
      const pathLen = pathEnd - pathStart;
      const pathMid = (pathStart + pathEnd) / 2;
      const pathX = Math.cos(angle) * pathMid;
      const pathZ = Math.sin(angle) * pathMid;

      const carpetMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(room.themeColor.accentHex),
        roughness: 0.85,
        metalness: 0.1,
      });
      const carpetGeo = new THREE.PlaneGeometry(2.4, pathLen);
      const carpetMesh = new THREE.Mesh(carpetGeo, carpetMat);
      carpetMesh.rotation.x = -Math.PI / 2;
      carpetMesh.rotation.z = -angle + Math.PI / 2;
      carpetMesh.position.set(pathX, 0.015, pathZ);
      carpetMesh.receiveShadow = true;
      this.worldGroup.add(carpetMesh);

      // Gold border runners on carpet edges
      const borderMat = new THREE.MeshBasicMaterial({ color: 0xd4af37 });
      const borderGeo = new THREE.PlaneGeometry(0.1, pathLen);
      const leftBorder = new THREE.Mesh(borderGeo, borderMat);
      leftBorder.rotation.x = -Math.PI / 2;
      leftBorder.rotation.z = -angle + Math.PI / 2;
      const perpAngle = angle + Math.PI / 2;
      leftBorder.position.set(
        pathX + Math.cos(perpAngle) * 1.25,
        0.018,
        pathZ + Math.sin(perpAngle) * 1.25
      );
      const rightBorder = new THREE.Mesh(borderGeo, borderMat);
      rightBorder.rotation.x = -Math.PI / 2;
      rightBorder.rotation.z = -angle + Math.PI / 2;
      rightBorder.position.set(
        pathX - Math.cos(perpAngle) * 1.25,
        0.018,
        pathZ - Math.sin(perpAngle) * 1.25
      );
      this.worldGroup.add(leftBorder, rightBorder);

      const doorObj = this.buildDoorPortal(room, index + 1, posX, posZ, doorFacingYaw);
      this.doors.push(doorObj);
    });

    // Starry particulate dust in the air
    this.buildAmbientDustParticles(rotundaRadius);
  }

  // =========================================================================
  // CENTRAL NEURAL FOUNTAIN & CLOZAPINE MOLECULAR MODEL
  // =========================================================================
  private buildCentralNexus() {
    const nexusGroup = new THREE.Group();
    nexusGroup.position.set(0, 0, 0);

    // Multi-tiered marble plinth
    const plinth1 = new THREE.Mesh(
      new THREE.CylinderGeometry(4.2, 4.6, 0.4, 32),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.3 })
    );
    plinth1.position.y = 0.2;
    plinth1.receiveShadow = true;

    const plinth2 = new THREE.Mesh(
      new THREE.CylinderGeometry(3.0, 3.4, 0.5, 32),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.5 })
    );
    plinth2.position.y = 0.65;

    // Glowing energy water basin
    const basinWater = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.4, 0.05, 32),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.85 })
    );
    basinWater.position.y = 0.92;

    nexusGroup.add(plinth1, plinth2, basinWater);

    // Floating Clozapine Molecular Model in Center
    const moleculeGroup = new THREE.Group();
    moleculeGroup.position.set(0, 2.6, 0);

    // Central Dibenzodiazepine Ring (7-membered ring surrounded by two 6-membered rings)
    const centralRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.1, 0.09, 12, 32),
      new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.2 })
    );
    const ringA = new THREE.Mesh(
      new THREE.TorusGeometry(0.75, 0.07, 12, 24),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7, roughness: 0.3 })
    );
    ringA.position.set(-1.4, 0, 0);

    const ringB = new THREE.Mesh(
      new THREE.TorusGeometry(0.75, 0.07, 12, 24),
      new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.7, roughness: 0.3 })
    );
    ringB.position.set(1.4, 0, 0);

    // Atoms (Carbon, Nitrogen, Chlorine)
    const clAtom = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.3, metalness: 0.5 }) // Green Chlorine
    );
    clAtom.position.set(2.1, 0.7, 0);

    const nAtom1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.3, metalness: 0.5 }) // Blue Nitrogen
    );
    nAtom1.position.set(0, 1.1, 0);

    moleculeGroup.add(centralRing, ringA, ringB, clAtom, nAtom1);

    // Rotating orbital energy rings around the molecule
    const orbit1 = new THREE.Mesh(
      new THREE.TorusGeometry(2.1, 0.03, 8, 48),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    orbit1.rotation.x = Math.PI * 0.4;
    const orbit2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.4, 0.03, 8, 48),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b })
    );
    orbit2.rotation.y = Math.PI * 0.4;

    nexusGroup.add(moleculeGroup, orbit1, orbit2);

    // Nexus Point Light
    const nexusLight = new THREE.PointLight(0x06b6d4, 3.5, 18, 1.6);
    nexusLight.position.set(0, 3, 0);
    nexusGroup.add(nexusLight);

    // Register animated rotation
    this.animatedMeshes.push({
      mesh: moleculeGroup,
      rotationSpeed: new THREE.Vector3(0, 0.6, 0.2),
      bobSpeed: 1.5,
      bobHeight: 0.25,
      initialY: 2.6,
    });
    this.animatedMeshes.push({
      mesh: orbit1,
      rotationSpeed: new THREE.Vector3(0.4, 0.5, 0),
    });
    this.animatedMeshes.push({
      mesh: orbit2,
      rotationSpeed: new THREE.Vector3(0, 0.4, 0.6),
    });

    this.worldGroup.add(nexusGroup);
  }

  // =========================================================================
  // GRAND DOOR PORTAL BUILDER
  // =========================================================================
  private buildDoorPortal(
    room: PalaceRoom,
    doorNumber: number,
    x: number,
    z: number,
    facingYaw: number
  ): DoorObject {
    const portalGroup = new THREE.Group();
    portalGroup.position.set(x, 0, z);
    portalGroup.rotation.y = facingYaw;

    const accentColor = new THREE.Color(room.themeColor.accentHex);

    // Stone Archway Frame
    const archMat = new THREE.MeshStandardMaterial({
      color: 0x1f293d,
      roughness: 0.6,
      metalness: 0.25,
    });
    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: accentColor,
      roughness: 0.3,
      metalness: 0.8,
    });

    // Left Arch Column
    const leftCol = new THREE.Mesh(new THREE.BoxGeometry(0.7, 6.2, 0.7), archMat);
    leftCol.position.set(-2.0, 3.1, 0);
    leftCol.castShadow = true;

    // Right Arch Column
    const rightCol = new THREE.Mesh(new THREE.BoxGeometry(0.7, 6.2, 0.7), archMat);
    rightCol.position.set(2.0, 3.1, 0);
    rightCol.castShadow = true;

    // Pediment / Arch Header
    const archHeader = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.2, 0.9), archMat);
    archHeader.position.set(0, 6.4, 0);
    archHeader.castShadow = true;

    // Decorative Triangular Pediment Top
    const pedimentTop = new THREE.Mesh(
      new THREE.ConeGeometry(3.0, 1.2, 4),
      new THREE.MeshStandardMaterial({ color: 0x161e2e, roughness: 0.5 })
    );
    pedimentTop.position.set(0, 7.6, 0);
    pedimentTop.rotation.y = Math.PI / 4;

    // Glowing Portal Rim (Neon Accent Line around Door)
    const rimMat = new THREE.MeshBasicMaterial({ color: accentColor });
    const leftRim = new THREE.Mesh(new THREE.BoxGeometry(0.08, 5.8, 0.08), rimMat);
    leftRim.position.set(-1.62, 2.9, 0.36);
    const rightRim = new THREE.Mesh(new THREE.BoxGeometry(0.08, 5.8, 0.08), rimMat);
    rightRim.position.set(1.62, 2.9, 0.36);
    const topRim = new THREE.Mesh(new THREE.BoxGeometry(3.32, 0.08, 0.08), rimMat);
    topRim.position.set(0, 5.8, 0.36);

    // Ground Threshold Ring
    const thresholdRing = new THREE.Mesh(
      new THREE.RingGeometry(2.2, 2.4, 32),
      new THREE.MeshBasicMaterial({ color: accentColor, side: THREE.DoubleSide })
    );
    thresholdRing.rotation.x = -Math.PI / 2;
    thresholdRing.position.set(0, 0.02, 1.2);

    // Double-Door Slabs with Hinges
    const doorMat = new THREE.MeshStandardMaterial({
      color: 0x2a1f18, // Rich mahogany wood
      roughness: 0.6,
      metalness: 0.2,
    });

    // Glowing doorway portal plane behind the doors
    const portalBacking = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 5.6),
      new THREE.MeshBasicMaterial({
        color: accentColor,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
      })
    );
    portalBacking.position.set(0, 2.8, -0.06);

    // Glowing ascension light beacon into dome
    const beaconBeam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 16, 16),
      new THREE.MeshBasicMaterial({
        color: accentColor,
        transparent: true,
        opacity: 0.3,
      })
    );
    beaconBeam.position.set(0, 9, 0);

    // Left Door Pivot at x = -1.6
    const leftDoorPivot = new THREE.Group();
    leftDoorPivot.position.set(-1.6, 0, 0);
    const leftDoorMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 5.6, 0.18), doorMat);
    leftDoorMesh.position.set(0.8, 2.8, 0); // Center is 0.8 from pivot
    leftDoorMesh.castShadow = true;

    // Left Door Handle
    const leftHandle = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.03, 8, 16), goldTrimMat);
    leftHandle.position.set(1.4, 2.6, 0.12);
    leftDoorPivot.add(leftDoorMesh, leftHandle);

    // Right Door Pivot at x = 1.6
    const rightDoorPivot = new THREE.Group();
    rightDoorPivot.position.set(1.6, 0, 0);
    const rightDoorMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 5.6, 0.18), doorMat);
    rightDoorMesh.position.set(-0.8, 2.8, 0); // Center is -0.8 from pivot
    rightDoorMesh.castShadow = true;

    // Right Door Handle
    const rightHandle = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.03, 8, 16), goldTrimMat);
    rightHandle.position.set(-1.4, 2.6, 0.12);
    rightDoorPivot.add(rightDoorMesh, rightHandle);

    // Floating Illuminated Door Title Placard above Archway
    const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
    const doorRoman = romanNumerals[doorNumber - 1] || `${doorNumber}`;
    const placard = this.createTextPlacard(
      `Door ${doorRoman} • ${room.name}`,
      room.subtitle.slice(0, 48),
      room.themeColor.accentHex
    );
    placard.position.set(0, 8.8, 0.1);

    // Portal Lantern Light
    const doorLight = new THREE.PointLight(accentColor, 2.2, 12, 1.5);
    doorLight.position.set(0, 6.2, 1.2);

    portalGroup.add(
      leftCol,
      rightCol,
      archHeader,
      pedimentTop,
      leftRim,
      rightRim,
      topRim,
      portalBacking,
      beaconBeam,
      thresholdRing,
      leftDoorPivot,
      rightDoorPivot,
      placard,
      doorLight
    );

    this.worldGroup.add(portalGroup);

    return {
      roomId: room.id,
      doorNumber,
      name: room.name,
      position: new THREE.Vector3(x, 0, z),
      rotationY: facingYaw,
      leftDoor: leftDoorPivot as any,
      rightDoor: rightDoorPivot as any,
      isOpen: false,
      openProgress: 0,
      portalRing: thresholdRing,
      doorLight,
    };
  }

  // =========================================================================
  // ROOM CHAMBER BUILDER (TRANSITION THROUGH DOOR INTO DEDICATED ROOM)
  // =========================================================================
  public buildRoomChamber(roomId: PalaceRoomId) {
    this.currentMode = "room";
    this.activeRoomId = roomId;
    this.doors = [];
    this.currentRoomLoci = [];
    this.exitDoor = null;
    this.animatedMeshes = [];

    const room = PALACE_ROOMS.find((r) => r.id === roomId) || PALACE_ROOMS[0];

    // Clear world group
    while (this.worldGroup.children.length > 0) {
      this.worldGroup.remove(this.worldGroup.children[0]);
    }

    const roomSize = 26; // 26x26m chamber
    const accentColor = new THREE.Color(room.themeColor.accentHex);

    // 1. Chamber Lighting
    const ambientLight = new THREE.AmbientLight(0x1a2130, 1.4);
    this.worldGroup.add(ambientLight);

    const roomPointLight = new THREE.PointLight(accentColor, 3.5, 36, 1.4);
    roomPointLight.position.set(0, 9, 0);
    this.worldGroup.add(roomPointLight);

    const ceilingSun = new THREE.DirectionalLight(accentColor, 1.2);
    ceilingSun.position.set(8, 18, 8);
    ceilingSun.castShadow = true;
    this.worldGroup.add(ceilingSun);

    // 2. Chamber Floor
    const floorGeo = new THREE.PlaneGeometry(roomSize * 2, roomSize * 2);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.4,
      metalness: 0.3,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.worldGroup.add(floor);

    // Decorative Chamber Floor Runes / Inlays
    const floorCircle = new THREE.Mesh(
      new THREE.RingGeometry(8, 8.2, 48),
      new THREE.MeshBasicMaterial({ color: accentColor, side: THREE.DoubleSide })
    );
    floorCircle.rotation.x = -Math.PI / 2;
    floorCircle.position.y = 0.01;
    this.worldGroup.add(floorCircle);

    // 3. Chamber Walls
    const wallHeight = 12;
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x131826,
      roughness: 0.7,
      metalness: 0.25,
    });

    // North Wall
    const northWall = new THREE.Mesh(new THREE.BoxGeometry(roomSize * 2, wallHeight, 1), wallMat);
    northWall.position.set(0, wallHeight / 2, -roomSize);
    // South Wall (Has Exit Archway)
    const southWallLeft = new THREE.Mesh(new THREE.BoxGeometry(roomSize - 2.5, wallHeight, 1), wallMat);
    southWallLeft.position.set(-(roomSize / 2 + 1.25), wallHeight / 2, roomSize);
    const southWallRight = new THREE.Mesh(new THREE.BoxGeometry(roomSize - 2.5, wallHeight, 1), wallMat);
    southWallRight.position.set(roomSize / 2 + 1.25, wallHeight / 2, roomSize);
    const southWallTop = new THREE.Mesh(new THREE.BoxGeometry(5, wallHeight - 6, 1), wallMat);
    southWallTop.position.set(0, wallHeight - 3, roomSize);

    // East & West Walls
    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(1, wallHeight, roomSize * 2), wallMat);
    eastWall.position.set(roomSize, wallHeight / 2, 0);
    const westWall = new THREE.Mesh(new THREE.BoxGeometry(1, wallHeight, roomSize * 2), wallMat);
    westWall.position.set(-roomSize, wallHeight / 2, 0);

    this.worldGroup.add(northWall, southWallLeft, southWallRight, southWallTop, eastWall, westWall);

    // 4. Chamber Ceiling
    const ceilMat = new THREE.MeshStandardMaterial({
      color: 0x0a0e1a,
      roughness: 0.8,
    });
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomSize * 2, roomSize * 2), ceilMat);
    ceiling.position.y = wallHeight;
    ceiling.rotation.x = Math.PI / 2;
    this.worldGroup.add(ceiling);

    // 5. Exit Doorway leading back to Grand Rotunda (South wall)
    this.buildExitDoorway(roomSize, accentColor);

    // 6. Central Thematic Centerpiece for this specific Room
    this.buildRoomCenterpiece(room);

    // 7. Build 3D Spatial Loci Stations around the room
    this.buildRoomLoci(room);

    // Reset character position inside the room facing North (away from exit door)
    this.characterController.setPosition(0, 0, roomSize - 5, 0);
  }

  // =========================================================================
  // EXIT DOORWAY IN CHAMBERS - Real Double Wooden Swinging Doors
  // =========================================================================
  private buildExitDoorway(roomSize: number, accentColor: THREE.Color) {
    const exitGroup = new THREE.Group();
    exitGroup.position.set(0, 0, roomSize);

    const colMat = new THREE.MeshStandardMaterial({ color: 0x1e283d, roughness: 0.5 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.25 });

    // Archway Columns
    const colLeft = new THREE.Mesh(new THREE.BoxGeometry(0.7, 6.2, 0.8), colMat);
    colLeft.position.set(-2.0, 3.1, 0);
    const colRight = new THREE.Mesh(new THREE.BoxGeometry(0.7, 6.2, 0.8), colMat);
    colRight.position.set(2.0, 3.1, 0);

    // Header & Arch
    const archHeader = new THREE.Mesh(new THREE.BoxGeometry(5.0, 1.2, 0.9), colMat);
    archHeader.position.set(0, 6.2, 0);

    // Exit Placard
    const placard = this.createTextPlacard(
      "Return to Grand Rotunda",
      "Doorway to Central Palace Hub",
      "#d4af37"
    );
    placard.position.set(0, 7.8, -0.1);
    placard.rotation.y = Math.PI; // Face inwards toward chamber

    // Doorway Glow Portal
    const portalGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 5.4),
      new THREE.MeshBasicMaterial({
        color: 0xd4af37,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
      })
    );
    portalGlow.position.set(0, 2.7, 0.1);

    // Threshold Ring
    const threshold = new THREE.Mesh(
      new THREE.RingGeometry(2.0, 2.2, 32),
      new THREE.MeshBasicMaterial({ color: 0xd4af37, side: THREE.DoubleSide })
    );
    threshold.rotation.x = -Math.PI / 2;
    threshold.position.set(0, 0.02, -1.2);

    // Real Double Swinging Exit Doors
    const doorWoodMat = new THREE.MeshStandardMaterial({
      color: 0x2a1f18,
      roughness: 0.6,
      metalness: 0.2,
    });

    const leftExitPivot = new THREE.Group();
    leftExitPivot.position.set(-1.6, 0, 0);
    const leftExitMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 5.6, 0.18), doorWoodMat);
    leftExitMesh.position.set(0.8, 2.8, 0);
    const leftExitHandle = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.03, 8, 16), goldMat);
    leftExitHandle.position.set(1.4, 2.6, -0.12);
    leftExitPivot.add(leftExitMesh, leftExitHandle);

    const rightExitPivot = new THREE.Group();
    rightExitPivot.position.set(1.6, 0, 0);
    const rightExitMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 5.6, 0.18), doorWoodMat);
    rightExitMesh.position.set(-0.8, 2.8, 0);
    const rightExitHandle = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.03, 8, 16), goldMat);
    rightExitHandle.position.set(-1.4, 2.6, -0.12);
    rightExitPivot.add(rightExitMesh, rightExitHandle);

    exitGroup.add(
      colLeft,
      colRight,
      archHeader,
      placard,
      portalGlow,
      threshold,
      leftExitPivot,
      rightExitPivot
    );
    this.worldGroup.add(exitGroup);

    this.exitDoor = {
      leftDoor: leftExitPivot,
      rightDoor: rightExitPivot,
      position: new THREE.Vector3(0, 0, roomSize),
      openProgress: 0,
    };
  }

  // =========================================================================
  // ROOM THEMATIC CENTERPIECE
  // =========================================================================
  private buildRoomCenterpiece(room: PalaceRoom) {
    const centerGroup = new THREE.Group();
    centerGroup.position.set(0, 0, 0);

    const accentColor = new THREE.Color(room.themeColor.accentHex);

    switch (room.id) {
      case "history": {
        // Towering Antique Bookshelves & Kane 1988 Golden Monument
        const shelfMat = new THREE.MeshStandardMaterial({ color: 0x2b1810, roughness: 0.7 });
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(7, 8, 1.2), shelfMat);
        shelf.position.set(0, 4, -9);

        // Kane Golden Plinth
        const plinth = new THREE.Mesh(
          new THREE.CylinderGeometry(2, 2.4, 1.4, 16),
          new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.4 })
        );
        plinth.position.y = 0.7;

        // Floating Kane 1988 Golden Resuscitation Scroll
        const scrollMat = new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          metalness: 0.9,
          roughness: 0.2,
        });
        const scroll = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2.2, 16), scrollMat);
        scroll.rotation.z = Math.PI / 2;
        scroll.position.y = 2.4;

        centerGroup.add(shelf, plinth, scroll);
        this.animatedMeshes.push({
          mesh: scroll,
          rotationSpeed: new THREE.Vector3(0, 0.8, 0),
          bobSpeed: 1.8,
          bobHeight: 0.2,
          initialY: 2.4,
        });
        break;
      }

      case "pharmacodynamics": {
        // Neon Synaptic Receptor Sphere Matrix
        const coreReceptor = new THREE.Mesh(
          new THREE.SphereGeometry(1.6, 24, 24),
          new THREE.MeshStandardMaterial({
            color: 0x10b981,
            wireframe: true,
            emissive: 0x059669,
            emissiveIntensity: 0.8,
          })
        );
        coreReceptor.position.y = 3.2;

        // 5 Orbiting Receptor Nodes (D2, 5-HT2A, H1, M1, Alpha-1)
        const receptorColors = [0xef4444, 0x3b82f6, 0xf59e0b, 0xa855f7, 0x06b6d4];
        for (let i = 0; i < 5; i++) {
          const orbitGroup = new THREE.Group();
          orbitGroup.position.y = 3.2;
          const node = new THREE.Mesh(
            new THREE.SphereGeometry(0.35, 16, 16),
            new THREE.MeshStandardMaterial({ color: receptorColors[i], roughness: 0.2, metalness: 0.7 })
          );
          node.position.set(3.0 * Math.cos((i * Math.PI * 2) / 5), 0, 3.0 * Math.sin((i * Math.PI * 2) / 5));
          orbitGroup.add(node);
          centerGroup.add(orbitGroup);
          this.animatedMeshes.push({
            mesh: orbitGroup,
            rotationSpeed: new THREE.Vector3(0, 0.4 + i * 0.15, 0),
          });
        }

        centerGroup.add(coreReceptor);
        this.animatedMeshes.push({
          mesh: coreReceptor,
          rotationSpeed: new THREE.Vector3(0.3, 0.5, 0.2),
          bobSpeed: 1.2,
          bobHeight: 0.3,
          initialY: 3.2,
        });
        break;
      }

      case "pharmacokinetics": {
        // CYP1A2 Metabolic Engine with Copper Pipes and Steam Vent
        const furnace = new THREE.Mesh(
          new THREE.CylinderGeometry(2.4, 2.8, 3.6, 24),
          new THREE.MeshStandardMaterial({ color: 0x78350f, metalness: 0.8, roughness: 0.3 })
        );
        furnace.position.y = 1.8;

        const chimney = new THREE.Mesh(
          new THREE.CylinderGeometry(0.8, 0.8, 5, 16),
          new THREE.MeshStandardMaterial({ color: 0x92400e, metalness: 0.7, roughness: 0.4 })
        );
        chimney.position.set(0, 5.5, 0);

        // Fluvoxamine Frozen Pipe (Blue Ice)
        const icePipe = new THREE.Mesh(
          new THREE.TorusGeometry(2.2, 0.2, 12, 32),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
        );
        icePipe.position.y = 3.0;
        icePipe.rotation.x = Math.PI / 2;

        centerGroup.add(furnace, chimney, icePipe);
        break;
      }

      case "blackbox": {
        // 5 Obsidian Warning Monoliths in a menacing semicircle
        const monolithColors = [0xef4444, 0xd97706, 0xb91c1c, 0x7c2d12, 0x450a0a];
        for (let i = 0; i < 5; i++) {
          const angle = ((i - 2) * Math.PI) / 6;
          const mono = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 6.5, 0.6),
            new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.8 })
          );
          mono.position.set(Math.sin(angle) * 7.5, 3.25, -Math.cos(angle) * 7.5);
          mono.rotation.y = angle;

          // Glowing Warning Glyph
          const glyph = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 1.4, 0.65),
            new THREE.MeshBasicMaterial({ color: monolithColors[i] })
          );
          glyph.position.set(Math.sin(angle) * 7.5, 4.5, -Math.cos(angle) * 7.5);
          centerGroup.add(mono, glyph);
        }
        break;
      }

      case "hematology": {
        // The 1500 White Shield Wall & 2025 REMS Freedom Monument
        const shieldWall = new THREE.Mesh(
          new THREE.BoxGeometry(8, 4.5, 0.6),
          new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, metalness: 0.6 })
        );
        shieldWall.position.set(0, 2.25, -6);

        // Broken Bureaucratic Seal Monument (2025 REMS)
        const brokenSeal = new THREE.Mesh(
          new THREE.TorusGeometry(1.4, 0.25, 12, 24, Math.PI * 1.5),
          new THREE.MeshStandardMaterial({ color: 0x14b8a6, metalness: 0.8, roughness: 0.2 })
        );
        brokenSeal.position.set(0, 3, 0);

        centerGroup.add(shieldWall, brokenSeal);
        this.animatedMeshes.push({
          mesh: brokenSeal,
          rotationSpeed: new THREE.Vector3(0, 0.6, 0),
          bobSpeed: 1.6,
          bobHeight: 0.2,
          initialY: 3.0,
        });
        break;
      }

      case "titration": {
        // Giant Rotating Clockwork Gears & 48-Hour Hourglass
        const gear1 = new THREE.Mesh(
          new THREE.TorusGeometry(2.4, 0.35, 8, 24),
          new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 })
        );
        gear1.position.set(0, 4.5, -3);

        const hourglass = new THREE.Mesh(
          new THREE.ConeGeometry(0.9, 1.8, 16),
          new THREE.MeshStandardMaterial({ color: 0xa855f7, transparent: true, opacity: 0.8 })
        );
        hourglass.position.set(0, 2.8, 0);

        centerGroup.add(gear1, hourglass);
        this.animatedMeshes.push({
          mesh: gear1,
          rotationSpeed: new THREE.Vector3(0, 0, 0.5),
        });
        this.animatedMeshes.push({
          mesh: hourglass,
          rotationSpeed: new THREE.Vector3(0, 0.7, 0),
          bobSpeed: 1.4,
          bobHeight: 0.2,
          initialY: 2.8,
        });
        break;
      }

      default: {
        // Generic Majestic Monument
        const monument = new THREE.Mesh(
          new THREE.OctahedronGeometry(1.8),
          new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.3, metalness: 0.7 })
        );
        monument.position.y = 3.2;
        centerGroup.add(monument);
        this.animatedMeshes.push({
          mesh: monument,
          rotationSpeed: new THREE.Vector3(0.4, 0.6, 0.2),
          bobSpeed: 1.5,
          bobHeight: 0.3,
          initialY: 3.2,
        });
        break;
      }
    }

    this.worldGroup.add(centerGroup);
  }

  // =========================================================================
  // 3D SPATIAL LOCI PEDESTAL BUILDER
  // =========================================================================
  private buildRoomLoci(room: PalaceRoom) {
    const loci = room.spatialLoci;
    const accentColor = new THREE.Color(room.themeColor.accentHex);

    // Position loci in distinct cardinal/quadrant stations around the chamber
    const locusPositions = [
      new THREE.Vector3(-10, 0, -8),
      new THREE.Vector3(10, 0, -8),
      new THREE.Vector3(-11, 0, 7),
      new THREE.Vector3(11, 0, 7),
      new THREE.Vector3(0, 0, 11),
    ];

    loci.forEach((locus, index) => {
      const pos = locusPositions[index % locusPositions.length];
      const locusGroup = new THREE.Group();
      locusGroup.position.copy(pos);

      // 1. Carved Marble Pedestal
      const pedestalBase = new THREE.Mesh(
        new THREE.CylinderGeometry(1.4, 1.6, 0.3, 16),
        new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.6 })
      );
      pedestalBase.position.y = 0.15;
      pedestalBase.receiveShadow = true;

      const pedestalShaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.9, 1.1, 1.6, 16),
        new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.5, metalness: 0.2 })
      );
      pedestalShaft.position.y = 1.05;
      pedestalShaft.castShadow = true;

      const pedestalTop = new THREE.Mesh(
        new THREE.CylinderGeometry(1.3, 1.1, 0.25, 16),
        new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.3, metalness: 0.7 })
      );
      pedestalTop.position.y = 1.95;

      // 2. Floating 3D Artifact Mesh
      const artifact = this.createLocusArtifact(locus, index, accentColor);
      artifact.position.y = 2.8;

      // 3. Glowing Vertical Beacon Beam
      const beaconGeo = new THREE.CylinderGeometry(0.12, 0.35, 10, 16, 1, true);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: accentColor,
        transparent: true,
        opacity: 0.28,
        side: THREE.DoubleSide,
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.y = 6.8;

      // 4. Glowing Floor Ring
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(1.8, 2.0, 32),
        new THREE.MeshBasicMaterial({ color: accentColor, side: THREE.DoubleSide })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.02;

      // 5. Floating 3D Title Badge
      const placard = this.createTextPlacard(
        `Station ${index + 1}: ${locus.name.slice(0, 32)}`,
        locus.categoryTag,
        room.themeColor.accentHex,
        384,
        192
      );
      placard.position.set(0, 4.4, 0);

      // 6. Point Light for Beacon
      const light = new THREE.PointLight(accentColor, 1.8, 8, 1.8);
      light.position.set(0, 3.2, 0);

      locusGroup.add(pedestalBase, pedestalShaft, pedestalTop, artifact, beacon, ring, placard, light);
      this.worldGroup.add(locusGroup);

      this.currentRoomLoci.push({
        locus,
        position: pos,
        pedestal: locusGroup,
        artifactMesh: artifact,
        beaconBeam: beacon,
        ring,
        light,
      });

      this.animatedMeshes.push({
        mesh: artifact,
        rotationSpeed: new THREE.Vector3(0, 0.8 + index * 0.2, 0),
        bobSpeed: 1.6 + index * 0.2,
        bobHeight: 0.22,
        initialY: 2.8,
      });
    });
  }

  // =========================================================================
  // CREATIVE 3D ARTIFACT GENERATOR FOR LOCI
  // =========================================================================
  private createLocusArtifact(locus: MnemonicLocus, index: number, accentColor: THREE.Color): THREE.Object3D {
    const group = new THREE.Group();
    const title = locus.name.toLowerCase();

    if (title.includes("flask") || title.includes("alembic")) {
      // Chemical Flask
      const flaskBody = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.2, metalness: 0.6 })
      );
      const neck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.6, 12),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.2, metalness: 0.6 })
      );
      neck.position.y = 0.45;
      group.add(flaskBody, neck);
    } else if (title.includes("shield") || title.includes("wall") || title.includes("1500")) {
      // Shield
      const shield = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.45, 0.12, 6),
        new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.7, roughness: 0.3 })
      );
      shield.rotation.x = Math.PI / 2;
      group.add(shield);
    } else if (title.includes("chalice") || title.includes("cup")) {
      // Chalice
      const chalice = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.1, 0.7, 16),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 })
      );
      group.add(chalice);
    } else if (title.includes("hour") || title.includes("clock") || title.includes("cadence")) {
      // Hourglass / Clock
      const cone1 = new THREE.Mesh(
        new THREE.ConeGeometry(0.4, 0.5, 16),
        new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.3 })
      );
      const cone2 = new THREE.Mesh(
        new THREE.ConeGeometry(0.4, 0.5, 16),
        new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.3 })
      );
      cone2.rotation.x = Math.PI;
      cone2.position.y = 0.5;
      group.add(cone1, cone2);
    } else if (title.includes("scroll") || title.includes("declaration") || title.includes("rems")) {
      // Parchment Scroll
      const scroll = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.9, 16),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.5 })
      );
      scroll.rotation.z = Math.PI / 4;
      group.add(scroll);
    } else if (title.includes("key") || title.includes("lock")) {
      // Golden Key
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.24, 0.05, 8, 16),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 })
      );
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 })
      );
      stem.position.y = -0.45;
      group.add(ring, stem);
    } else {
      // Polyhedral Gem Crystal
      const gem = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.5, 0),
        new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.2, metalness: 0.8 })
      );
      group.add(gem);
    }

    return group;
  }

  // =========================================================================
  // AMBIENT DUST PARTICLES
  // =========================================================================
  private buildAmbientDustParticles(radius: number) {
    const particleCount = 280;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * (radius - 2);
      positions[i] = Math.cos(angle) * r;
      positions[i + 1] = 0.5 + Math.random() * 12;
      positions[i + 2] = Math.sin(angle) * r;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.16,
      transparent: true,
      opacity: 0.65,
    });

    const particles = new THREE.Points(geometry, material);
    this.worldGroup.add(particles);

    this.animatedMeshes.push({
      mesh: particles,
      rotationSpeed: new THREE.Vector3(0, 0.04, 0),
    });
  }

  // =========================================================================
  // MAIN TICK / UPDATE LOOP
  // =========================================================================
  public update(deltaSeconds: number) {
    const dt = Math.min(deltaSeconds, 0.1);

    // 1. Update Character Physics & Animation
    const boundaryRadius = this.currentMode === "rotunda" ? 30 : 24;
    this.characterController.update(dt, boundaryRadius);

    const { position, rotation, walkCycle, isMoving } = this.characterController;

    // Update character model root position and rotation
    this.characterGroup.position.set(position.x, position.y, position.z);
    this.characterGroup.rotation.y = rotation;

    // Leg stride pendulum animation
    if (isMoving) {
      const legAngle = Math.sin(walkCycle) * 0.65;
      this.leftLegPivot.rotation.x = legAngle;
      this.rightLegPivot.rotation.x = -legAngle;

      // Arm swing in opposite phase to legs
      this.leftArmPivot.rotation.x = -legAngle * 0.75;
      this.rightArmPivot.rotation.x = legAngle * 0.75;

      // Cape flutter
      this.capeMesh.rotation.x = 0.25 + Math.sin(walkCycle * 2) * 0.12;
    } else {
      // Smooth return to neutral stance
      this.leftLegPivot.rotation.x *= 0.85;
      this.rightLegPivot.rotation.x *= 0.85;
      this.leftArmPivot.rotation.x *= 0.85;
      this.rightArmPivot.rotation.x *= 0.85;
      this.capeMesh.rotation.x = 0.1;
    }

    // Floating lantern gentle hover bob
    this.lanternMesh.position.y = Math.sin(Date.now() * 0.003) * 0.08;

    // 2. Camera Tracking
    this.updateCamera();

    // 3. Proximity Checks for Doors & Loci
    this.updateProximityChecks(dt);

    // 4. Update Animated Meshes (Rotations, Bobs)
    const time = Date.now() * 0.001;
    this.animatedMeshes.forEach((item) => {
      if (item.rotationSpeed) {
        item.mesh.rotation.x += item.rotationSpeed.x * dt;
        item.mesh.rotation.y += item.rotationSpeed.y * dt;
        item.mesh.rotation.z += item.rotationSpeed.z * dt;
      }
      if (item.bobSpeed && item.bobHeight && item.initialY !== undefined) {
        item.mesh.position.y = item.initialY + Math.sin(time * item.bobSpeed) * item.bobHeight;
      }
    });

    // 5. Render Scene
    this.renderer.render(this.scene, this.camera);
  }

  // =========================================================================
  // CAMERA POSITIONING & THIRD-PERSON ORBIT
  // =========================================================================
  private updateCamera() {
    const { position, cameraYaw, cameraPitch, cameraDistance, isFirstPerson } = this.characterController;

    if (isFirstPerson) {
      // First Person: Camera placed at character head position
      this.camera.position.set(position.x, position.y + 2.05, position.z);
      const lookDist = 5.0;
      const targetX = position.x + Math.sin(cameraYaw) * Math.cos(cameraPitch) * lookDist;
      const targetY = position.y + 2.05 - Math.sin(cameraPitch) * lookDist;
      const targetZ = position.z + Math.cos(cameraYaw) * Math.cos(cameraPitch) * lookDist;
      this.camera.lookAt(targetX, targetY, targetZ);
    } else {
      // Third Person: Camera orbits behind character
      const offsetX = Math.sin(cameraYaw) * Math.cos(cameraPitch) * cameraDistance;
      const offsetY = Math.sin(cameraPitch) * cameraDistance + 1.8;
      const offsetZ = Math.cos(cameraYaw) * Math.cos(cameraPitch) * cameraDistance;

      this.camera.position.set(position.x + offsetX, position.y + offsetY, position.z + offsetZ);
      // Look at character chest/head height
      this.camera.lookAt(position.x, position.y + 1.6, position.z);
    }
  }

  // =========================================================================
  // PROXIMITY DETECTION FOR DOORS AND LOCI
  // =========================================================================
  private updateProximityChecks(dt: number) {
    const charPos = new THREE.Vector3(
      this.characterController.position.x,
      this.characterController.position.y,
      this.characterController.position.z
    );

    if (this.currentMode === "rotunda") {
      let closestDoor: DoorObject | null = null;
      let minDoorDist = 7.0;

      this.doors.forEach((door) => {
        const dist = charPos.distanceTo(door.position);

        if (dist < minDoorDist) {
          minDoorDist = dist;
          closestDoor = door;
        }

        // Animate door opening when player is near
        const shouldOpen = dist < 5.8;
        door.isOpen = shouldOpen;

        if (shouldOpen && door.openProgress < 1) {
          door.openProgress = Math.min(1, door.openProgress + dt * 2.8);
        } else if (!shouldOpen && door.openProgress > 0) {
          door.openProgress = Math.max(0, door.openProgress - dt * 2.8);
        }

        // Swing doors inwards: Left door rotates Y = -openProgress * 1.6 rad
        door.leftDoor.rotation.y = -door.openProgress * 1.55;
        door.rightDoor.rotation.y = door.openProgress * 1.55;

        // Auto-enter threshold: if player walks right into the doorway
        if (dist < 2.0 && this.onTriggerEnterRoom) {
          this.onTriggerEnterRoom(door.roomId);
        }
      });

      this.nearestDoor = closestDoor;
      this.nearestLocus = null;
      this.isNearExitDoor = false;
    } else {
      // In Room Chamber: Check proximity to Loci & Exit Door
      this.nearestDoor = null;

      // Check Loci
      let closestLocus: LocusObject | null = null;
      let minLocusDist = 4.2;

      this.currentRoomLoci.forEach((item) => {
        const dist = charPos.distanceTo(item.position);
        if (dist < minLocusDist) {
          minLocusDist = dist;
          closestLocus = item;
        }

        // Pulse beacon beam if player is near
        if (dist < 4.2) {
          (item.beaconBeam.material as THREE.MeshBasicMaterial).opacity = 0.65;
          item.light.intensity = 3.2;
        } else {
          (item.beaconBeam.material as THREE.MeshBasicMaterial).opacity = 0.28;
          item.light.intensity = 1.8;
        }
      });

      this.nearestLocus = closestLocus;

      // Check Exit Doorway
      if (this.exitDoor) {
        const exitDist = charPos.distanceTo(this.exitDoor.position);
        this.isNearExitDoor = exitDist < 5.0;

        // Animate exit door opening when approaching
        const shouldOpen = exitDist < 5.8;
        if (this.exitDoor.openProgress === undefined) this.exitDoor.openProgress = 0;

        if (shouldOpen && this.exitDoor.openProgress < 1) {
          this.exitDoor.openProgress = Math.min(1, this.exitDoor.openProgress + dt * 2.8);
        } else if (!shouldOpen && this.exitDoor.openProgress > 0) {
          this.exitDoor.openProgress = Math.max(0, this.exitDoor.openProgress - dt * 2.8);
        }

        // Swing doors inwards towards the chamber
        this.exitDoor.leftDoor.rotation.y = this.exitDoor.openProgress * 1.55;
        this.exitDoor.rightDoor.rotation.y = -this.exitDoor.openProgress * 1.55;

        // Auto-exit threshold
        if (exitDist < 2.0 && this.onTriggerReturnRotunda) {
          this.onTriggerReturnRotunda();
        }
      }
    }
  }

  // Handle Resize
  public onResize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // Cleanup
  public dispose() {
    this.renderer.dispose();
  }
}
