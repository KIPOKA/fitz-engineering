import { useEffect, type RefObject } from "react";
import * as THREE from "three";

type Mode = "hybrid" | "structure" | "architecture";

export function useThreeScene(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  mode: Mode,
  setProgress: (progress: number) => void,
) {
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#050914");
    scene.fog = new THREE.FogExp2("#050914", 0.03);

    const camera = new THREE.PerspectiveCamera(
      45,
      innerWidth / innerHeight,
      0.1,
      200,
    );
    camera.position.set(12, 8, 14);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const ambient = new THREE.HemisphereLight("#d9edff", "#090d18", 1.1);
    scene.add(ambient);

    const key = new THREE.DirectionalLight("#fff1d2", 3.2);
    key.position.set(8, 18, 10);
    key.castShadow = true;
    scene.add(key);

    const blueLight = new THREE.PointLight("#168cff", 12, 28);
    blueLight.position.set(-8, 7, 5);
    scene.add(blueLight);

    const orangeLight = new THREE.PointLight("#ff6b2c", 8, 24);
    orangeLight.position.set(7, 5, -5);
    scene.add(orangeLight);

    const root = new THREE.Group();
    scene.add(root);

    const structure = new THREE.Group();
    const architecture = new THREE.Group();
    const forces = new THREE.Group();
    const site = new THREE.Group();
    root.add(structure, architecture, forces, site);

    const structureMat = new THREE.MeshStandardMaterial({
      color: "#38a9ff",
      metalness: 0.65,
      roughness: 0.28,
      emissive: "#06294a",
      emissiveIntensity: 0.8,
    });
    const concreteMat = new THREE.MeshStandardMaterial({
      color: "#8792a1",
      roughness: 0.72,
      metalness: 0.08,
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: "#9bdcff",
      metalness: 0.05,
      roughness: 0.12,
      transmission: 0.18,
      transparent: true,
      opacity: 0.5,
      emissive: "#092a44",
      emissiveIntensity: 0.55,
    });
    const warmMat = new THREE.MeshStandardMaterial({
      color: "#e8b56a",
      metalness: 0.45,
      roughness: 0.3,
      emissive: "#4b2309",
      emissiveIntensity: 0.25,
    });

    // Ground
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(55, 96),
      new THREE.MeshStandardMaterial({ color: "#070b13", roughness: 1 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.03;
    ground.receiveShadow = true;
    scene.add(ground);

    // Concentric architectural rings
    for (let r = 4; r <= 16; r += 4) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(r - 0.006, r + 0.006, 128),
        new THREE.MeshBasicMaterial({
          color: "#1a7fd0",
          transparent: true,
          opacity: 0.18,
          side: THREE.DoubleSide,
        }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.02;
      scene.add(ring);
    }

    const foundation = new THREE.Mesh(
      new THREE.BoxGeometry(7.4, 0.8, 7.4),
      concreteMat,
    );
    foundation.position.y = 0.4;
    foundation.castShadow = true;
    foundation.receiveShadow = true;
    structure.add(foundation);

    // Underground foundation blocks
    for (let i = 0; i < 8; i++) {
      const pile = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.25, 2.5, 12),
        concreteMat,
      );
      const x =
        i % 4 === 0 ? -2.8 : i % 4 === 1 ? -0.95 : i % 4 === 2 ? 0.95 : 2.8;
      const z = i < 4 ? -2.8 : 2.8;
      pile.position.set(x, -0.8, z);
      structure.add(pile);
    }

    // Columns and slabs
    const columns: THREE.Mesh[] = [];
    const positions = [-2.5, 0, 2.5];
    for (const x of positions)
      for (const z of positions) {
        const c = new THREE.Mesh(
          new THREE.BoxGeometry(0.32, 7.8, 0.32),
          structureMat,
        );
        c.position.set(x, 4.25, z);
        c.scale.y = 0.001;
        c.castShadow = true;
        columns.push(c);
        structure.add(c);
      }

    const slabs: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const slab = new THREE.Mesh(
        new THREE.BoxGeometry(7, 0.22, 7),
        concreteMat,
      );
      slab.position.y = 1.6 + i * 1.65;
      slab.scale.set(0.001, 1, 0.001);
      slab.castShadow = true;
      slabs.push(slab);
      structure.add(slab);
    }

    const beams: THREE.Mesh[] = [];
    for (let level = 0; level < 5; level++) {
      for (const z of [-2.5, 0, 2.5]) {
        const b = new THREE.Mesh(
          new THREE.BoxGeometry(7, 0.22, 0.22),
          structureMat,
        );
        b.position.set(0, 1.6 + level * 1.65, z);
        b.scale.x = 0.001;
        beams.push(b);
        structure.add(b);
      }
    }

    const core = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 8, 1.8),
      new THREE.MeshStandardMaterial({
        color: "#236ea8",
        metalness: 0.5,
        roughness: 0.4,
        emissive: "#082d4b",
        emissiveIntensity: 0.8,
      }),
    );
    core.position.y = 4.15;
    core.scale.y = 0.001;
    structure.add(core);

    // ---- Realistic facade: procedural window-grid texture (lit + unlit
    // windows) so the tower reads as an occupied, habitable building rather
    // than an abstract glass drum.
    const windowCanvas = document.createElement("canvas");
    windowCanvas.width = 256;
    windowCanvas.height = 256;
    const wctx = windowCanvas.getContext("2d") as CanvasRenderingContext2D;
    wctx.fillStyle = "#141d29";
    wctx.fillRect(0, 0, 256, 256);
    const gridCols = 8;
    const gridRows = 8;
    const cellW = 256 / gridCols;
    const cellH = 256 / gridRows;
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const lit = Math.random() < 0.32;
        wctx.fillStyle = lit ? "#ffd58a" : "#0c1420";
        const pad = 4;
        wctx.fillRect(
          c * cellW + pad,
          r * cellH + pad,
          cellW - pad * 2,
          cellH - pad * 2,
        );
      }
    }
    const windowTexture = new THREE.CanvasTexture(windowCanvas);
    windowTexture.wrapS = THREE.RepeatWrapping;
    windowTexture.wrapT = THREE.RepeatWrapping;
    windowTexture.repeat.set(6, 1);

    const windowMat = new THREE.MeshStandardMaterial({
      map: windowTexture,
      emissiveMap: windowTexture,
      emissive: "#ffffff",
      emissiveIntensity: 1.1,
      roughness: 0.55,
      metalness: 0.1,
    });

    // Rectangular tower shell, one panel per floor per side, so the
    // structure reveal animation still builds it floor by floor.
    const panels: THREE.Mesh[] = [];
    const wallFaces: { x?: number; z?: number; ry: number }[] = [
      { z: 3.72, ry: 0 },
      { z: -3.72, ry: Math.PI },
      { x: 3.72, ry: Math.PI / 2 },
      { x: -3.72, ry: -Math.PI / 2 },
    ];
    for (let level = 0; level < 5; level++) {
      wallFaces.forEach((face) => {
        const panel = new THREE.Mesh(
          new THREE.BoxGeometry(7.2, 1.5, 0.08),
          windowMat,
        );
        panel.position.set(face.x ?? 0, 2.05 + level * 1.65, face.z ?? 0);
        panel.rotation.y = face.ry;
        panel.scale.set(0.001, 0.001, 1);
        panel.castShadow = true;
        panels.push(panel);
        architecture.add(panel);
      });
    }

    // Roof: parapet, mechanical penthouse and antenna, like a real rooftop
    const roofGroup = new THREE.Group();
    const parapet = new THREE.Mesh(
      new THREE.BoxGeometry(7.6, 0.35, 7.6),
      concreteMat,
    );
    parapet.position.y = 8.2;
    roofGroup.add(parapet);

    const penthouse = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.9, 2.2),
      new THREE.MeshStandardMaterial({ color: "#5b6472", roughness: 0.6 }),
    );
    penthouse.position.y = 8.85;
    roofGroup.add(penthouse);

    const antenna = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 2.2, 6),
      new THREE.MeshStandardMaterial({ color: "#9aa4b2" }),
    );
    antenna.position.y = 10.4;
    roofGroup.add(antenna);

    roofGroup.scale.y = 0.001;
    architecture.add(roofGroup);

    // Corner accent lighting (reads as engineered detail, not decoration)
    const fins: THREE.Mesh[] = [];
    const corners: [number, number][] = [
      [3.72, 3.72],
      [3.72, -3.72],
      [-3.72, 3.72],
      [-3.72, -3.72],
    ];
    for (const [x, z] of corners) {
      const f = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 8.4, 0.08),
        new THREE.MeshBasicMaterial({
          color: "#38a9ff",
          transparent: true,
          opacity: 0.8,
        }),
      );
      f.position.set(x, 4.2, z);
      f.scale.y = 0.001;
      fins.push(f);
      architecture.add(f);
    }

    // Balconies on mid floors — signals a lived-in, residential building
    const balconies: THREE.Group[] = [];
    for (const level of [1, 2, 3]) {
      for (const bx of [-1.9, 0, 1.9]) {
        const balcony = new THREE.Group();
        const slab = new THREE.Mesh(
          new THREE.BoxGeometry(1.5, 0.1, 0.9),
          concreteMat,
        );
        slab.position.set(bx, 1.55 + level * 1.65, 4.05);
        balcony.add(slab);

        const rail = new THREE.Mesh(
          new THREE.BoxGeometry(1.5, 0.55, 0.04),
          glassMat,
        );
        rail.position.set(bx, 1.85 + level * 1.65, 4.5);
        balcony.add(rail);

        balcony.scale.set(0.001, 0.001, 0.001);
        balconies.push(balcony);
        architecture.add(balcony);
      }
    }

    // Ground-floor entrance: glazed lobby + canopy + plaza paving
    const entrance = new THREE.Group();
    const lobbyGlass = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 1.9, 0.12),
      glassMat,
    );
    lobbyGlass.position.set(0, 0.95, 3.76);
    entrance.add(lobbyGlass);

    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 0.12, 1.8),
      warmMat,
    );
    canopy.position.set(0, 2.05, 4.6);
    entrance.add(canopy);

    [-1.5, 1.5].forEach((x) => {
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 2.05, 8),
        concreteMat,
      );
      post.position.set(x, 1.0, 5.4);
      entrance.add(post);
    });

    const plaza = new THREE.Mesh(
      new THREE.BoxGeometry(6, 0.06, 3.4),
      new THREE.MeshStandardMaterial({ color: "#3a4351", roughness: 0.9 }),
    );
    plaza.position.set(0, 0.03, 5.2);
    entrance.add(plaza);

    entrance.scale.set(0.001, 0.001, 0.001);
    architecture.add(entrance);

    // Site context: trees + lamp posts, always present, for human scale
    const treeMat = new THREE.MeshStandardMaterial({
      color: "#2f5233",
      roughness: 0.9,
    });
    const trunkMat = new THREE.MeshStandardMaterial({
      color: "#4a3524",
      roughness: 1,
    });
    const treeSpots: [number, number][] = [
      [-6.5, 5.5],
      [6.5, 5.2],
      [-7.2, -4.8],
      [7.4, -3.6],
    ];
    treeSpots.forEach(([x, z]) => {
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.13, 1.1, 7),
        trunkMat,
      );
      trunk.position.set(x, 0.55, z);
      const canopyTree = new THREE.Mesh(
        new THREE.ConeGeometry(0.75, 1.7, 8),
        treeMat,
      );
      canopyTree.position.set(x, 1.75, z);
      site.add(trunk, canopyTree);
    });

    const lampMat = new THREE.MeshStandardMaterial({
      color: "#3d4652",
      roughness: 0.5,
    });
    const lampGlowMat = new THREE.MeshBasicMaterial({ color: "#ffd58a" });
    const lampSpots: [number, number][] = [
      [-3.0, 6.2],
      [3.0, 6.2],
      [-5.6, 0],
      [5.6, 0],
    ];
    lampSpots.forEach(([x, z]) => {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 2.4, 8),
        lampMat,
      );
      pole.position.set(x, 1.2, z);
      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 10, 10),
        lampGlowMat,
      );
      glow.position.set(x, 2.45, z);
      site.add(pole, glow);
    });

    // Force/load-path particles
    const particleCount = 90;
    const positionsArray = new Float32Array(particleCount * 3);
    const speeds: number[] = [];
    for (let i = 0; i < particleCount; i++) {
      positionsArray[i * 3] = (Math.random() - 0.5) * 6;
      positionsArray[i * 3 + 1] = Math.random() * 8;
      positionsArray[i * 3 + 2] = (Math.random() - 0.5) * 6;
      speeds.push(0.3 + Math.random() * 0.9);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positionsArray, 3),
    );
    const particleMat = new THREE.PointsMaterial({
      color: "#ff6b2c",
      size: 0.075,
      transparent: true,
      opacity: 0.85,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    forces.add(particles);

    // Engineering grid
    const grid = new THREE.GridHelper(18, 18, "#1765a8", "#102a42");
    grid.position.y = 0.06;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.5;
    scene.add(grid);

    let currentProgress = 0;
    let targetProgress = 0;
    let raf = 0;

    const update = () => {
      currentProgress += (targetProgress - currentProgress) * 0.075;
      const p = currentProgress;

      const structureP = THREE.MathUtils.smoothstep(p, 0.08, 0.55);
      const facadeP = THREE.MathUtils.smoothstep(p, 0.43, 0.82);
      const finishP = THREE.MathUtils.smoothstep(p, 0.7, 1);

      columns.forEach((c, i) => {
        c.scale.y = Math.max(0.001, structureP * (0.86 + (i % 3) * 0.05));
      });
      beams.forEach((b, i) => {
        b.scale.x = Math.max(0.001, structureP * (0.75 + (i % 3) * 0.08));
      });
      slabs.forEach((s) => {
        s.scale.x = Math.max(0.001, structureP);
        s.scale.z = Math.max(0.001, structureP);
      });
      core.scale.y = Math.max(0.001, structureP);
      foundation.position.y =
        0.4 - (1 - THREE.MathUtils.smoothstep(p, 0, 0.2)) * 0.7;

      panels.forEach((panel) => {
        panel.scale.x = Math.max(0.001, facadeP);
        panel.scale.y = Math.max(0.001, facadeP);
      });
      roofGroup.scale.y = Math.max(0.001, facadeP);
      fins.forEach((f) => {
        f.scale.y = Math.max(0.001, facadeP);
      });

      const finishScale = Math.max(0.001, finishP);
      entrance.scale.set(finishScale, finishScale, finishScale);
      balconies.forEach((b) => {
        b.scale.set(finishScale, finishScale, finishScale);
      });

      const structureVisible = mode !== "architecture";
      const architectureVisible = mode !== "structure";
      structure.visible = structureVisible;
      architecture.visible = architectureVisible;
      forces.visible = mode !== "architecture";

      const targetX = Math.sin(p * Math.PI * 1.8) * (11 - p * 2.5);
      const targetZ = Math.cos(p * Math.PI * 1.8) * (13 - p * 2.5);
      const targetY = 6.8 + p * 1.6;
      camera.position.x += (targetX - camera.position.x) * 0.045;
      camera.position.y += (targetY - camera.position.y) * 0.045;
      camera.position.z += (targetZ - camera.position.z) * 0.045;
      camera.lookAt(0, 4, 0);

      root.rotation.y = p * Math.PI * 0.55;
      blueLight.intensity = 10 + (1 - p) * 8;
      orangeLight.intensity = 5 + p * 10;
      // scene.fog.density = 0.03 - p * 0.01;

      const pos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const yIndex = i * 3 + 1;
        pos[yIndex] -= 0.025 * speeds[i];
        if (pos[yIndex] < 0.2) pos[yIndex] = 8.2;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(update);
    };

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      targetProgress = max > 0 ? scrollY / max : 0;
      setProgress(targetProgress);
    };

    const onResize = () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    };

    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    onScroll();
    update();

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      renderer.dispose();
      particleGeo.dispose();
      windowTexture.dispose();
    };
  }, [mode, canvasRef, setProgress]);
}
