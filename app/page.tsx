"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<"hybrid" | "structure" | "architecture">(
    "hybrid",
  );

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
  }, [mode]);

  const phase =
    progress < 0.22
      ? "FOUNDATION"
      : progress < 0.48
        ? "STRUCTURE"
        : progress < 0.73
          ? "ENVELOPE"
          : "ARCHITECTURE";

  return (
    <main className="site">
      <canvas ref={canvasRef} className="scene" />

      <header className="nav">
        <div className="logo">
          <span>◈</span> Fitz Engineering
        </div>
        <nav>
          <a href="#work">Projects</a>
          <a href="#engineering">Engineering</a>
          <a href="#architecture">Architecture</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="status">
          <i /> {phase}
        </div>
      </header>

      <div className="mode-switch">
        {(["structure", "hybrid", "architecture"] as const).map((item) => (
          <button
            key={item}
            className={mode === item ? "active" : ""}
            onClick={() => setMode(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <aside className="scroll-index">
        <span>01</span>
        <div className="line">
          <b style={{ height: `${Math.max(4, progress * 100)}%` }} />
        </div>
        <span>08</span>
      </aside>

      <section className="hero panel">
        <div className="eyebrow">
          <span /> ARCHITECTURE × STRUCTURAL ENGINEERING
        </div>
        <h1>
          ENGINEER
          <br />
          <em>THE VISION.</em>
        </h1>
        <p>
          We turn architectural ambition into buildings that stand, perform and
          endure.
        </p>
        <div className="scroll-hint">
          <span>↓</span> SCROLL TO BUILD
        </div>
        <div className="coordinates">
          03°14' / 07°42'
          <br />
          STRUCTURAL GRID / A
        </div>
      </section>

      <section className="spacer">
        <div className="phase-label">01 — THE IDEA</div>
      </section>

      <section className="content-section" id="engineering">
        <div className="content-card blue-card">
          <div className="eyebrow blue">02 — STRUCTURAL ENGINEERING</div>
          <h2>
            THE BUILDING
            <br />
            HAS A <em>SKELETON.</em>
          </h2>
          <p>
            Columns. Beams. Slabs. Core. Foundation. Every visible gesture
            begins with an invisible logic of forces.
          </p>
          <div className="metrics">
            <div>
              <b>LOAD</b>
              <span>PATH</span>
            </div>
            <div>
              <b>LATERAL</b>
              <span>STABILITY</span>
            </div>
            <div>
              <b>MATERIAL</b>
              <span>INTELLIGENCE</span>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section right" id="architecture">
        <div className="content-card orange-card">
          <div className="eyebrow orange">03 — ARCHITECTURE</div>
          <h2>
            WHEN ENGINEERING
            <br />
            BECOMES <em>FORM.</em>
          </h2>
          <p>
            The façade wraps around the structural system. Light, material,
            proportion and space turn technical intelligence into architecture.
          </p>
          <div className="material-row">
            <span>GLASS</span>
            <span>CONCRETE</span>
            <span>STEEL</span>
            <span>LIGHT</span>
          </div>
        </div>
      </section>

      <section className="statement">
        <div>
          <span>STRUCTURE</span>
          <strong>+</strong>
          <span>ARCHITECTURE</span>
          <strong>=</strong>
          <em>ONE BUILDING</em>
        </div>
      </section>

      <section className="projects" id="work">
        <div className="section-head">
          <div>
            <div className="eyebrow">04 — SELECTED WORK</div>
            <h2>
              BUILDINGS
              <br />
              <em>WITH LOGIC.</em>
            </h2>
          </div>
          <p>
            Selected projects where architectural ambition and structural
            intelligence are developed together.
          </p>
        </div>
        <div className="project-grid">
          {["VERTEX TOWER", "NEXUS CAMPUS", "AURELIA HOUSE", "CIVIC FORUM"].map(
            (name, i) => (
              <article className="project" key={name}>
                <div className={`project-visual v${i + 1}`}>
                  <span>0{i + 1}</span>
                  <div className="mini-building" />
                </div>
                <div className="project-info">
                  <div>
                    <h3>{name}</h3>
                    <p>
                      {i % 2
                        ? "Cultural / Commercial"
                        : "Mixed Use / Residential"}
                    </p>
                  </div>
                  <span>→</span>
                </div>
              </article>
            ),
          )}
        </div>
      </section>

      <section className="process">
        <div className="eyebrow">05 — OUR METHOD</div>
        <h2>
          ONE PROCESS.
          <br />
          <em>NO DIVISION.</em>
        </h2>
        <div className="process-line">
          {[
            "CONCEPT",
            "ANALYSIS",
            "STRUCTURE",
            "ARCHITECTURE",
            "COORDINATION",
            "DELIVERY",
          ].map((x, i) => (
            <div key={x}>
              <b>0{i + 1}</b>
              <span>{x}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="cta" id="contact">
        <div className="eyebrow">06 — START A PROJECT</div>
        <h2>
          LET'S BUILD
          <br />
          <em>WHAT'S NEXT.</em>
        </h2>
        <p>
          Bring us the difficult idea. We'll bring architecture and structure
          together.
        </p>
        <a className="cta-button" href="mailto:hello@axisform.com">
          START A CONVERSATION <span>↗</span>
        </a>
      </section>

      <footer>
        <div className="logo">
          <span>◈</span> Fitz Engineering
        </div>
        <p>Architecture × Structural Engineering</p>
        <span>© 2026</span>
      </footer>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@300;400;500;600;700&display=swap");
        :global(*) {
          box-sizing: border-box;
        }
        :global(html) {
          scroll-behavior: smooth;
        }
        :global(body) {
          margin: 0;
          background: #050914;
          color: #f3f5f8;
          font-family: Manrope, Arial, sans-serif;
        }
        :global(a) {
          color: inherit;
          text-decoration: none;
        }
        .site {
          min-height: 100vh;
          background: transparent;
          overflow: hidden;
        }
        .scene {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }
        .nav {
          position: fixed;
          z-index: 20;
          top: 0;
          left: 0;
          width: 100%;
          height: 82px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 4vw;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: linear-gradient(#050914dd, transparent);
          backdrop-filter: blur(12px);
        }
        .logo {
          font-family: "DM Mono";
          font-size: 12px;
          letter-spacing: 0.12em;
        }
        .logo span {
          color: #38a9ff;
          font-size: 18px;
          margin-right: 8px;
        }
        .nav nav {
          display: flex;
          gap: 30px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #aeb8c8;
        }
        .nav nav a:hover {
          color: #fff;
        }
        .status {
          font: 10px "DM Mono";
          color: #7f8ca0;
          letter-spacing: 0.12em;
        }
        .status i {
          display: inline-block;
          width: 6px;
          height: 6px;
          background: #38a9ff;
          border-radius: 50%;
          box-shadow: 0 0 14px #38a9ff;
          margin-right: 8px;
        }
        .mode-switch {
          position: fixed;
          right: 4vw;
          top: 104px;
          z-index: 20;
          border: 1px solid #ffffff1c;
          border-radius: 999px;
          padding: 4px;
          background: #05091499;
          backdrop-filter: blur(15px);
        }
        .mode-switch button {
          border: 0;
          background: transparent;
          color: #718096;
          padding: 9px 13px;
          border-radius: 999px;
          font: 10px "DM Mono";
          text-transform: uppercase;
          cursor: pointer;
        }
        .mode-switch button.active {
          background: #eaf6ff;
          color: #07101b;
        }
        .scroll-index {
          position: fixed;
          z-index: 20;
          right: 2vw;
          top: 42%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          font: 9px "DM Mono";
          color: #66758a;
        }
        .line {
          height: 110px;
          width: 1px;
          background: #ffffff20;
          position: relative;
        }
        .line b {
          position: absolute;
          top: 0;
          left: -1px;
          width: 3px;
          background: #38a9ff;
          box-shadow: 0 0 10px #38a9ff;
        }
        .panel {
          position: relative;
          z-index: 3;
        }
        .hero {
          min-height: 100vh;
          padding: 18vh 8vw;
          display: flex;
          flex-direction: column;
          justify-content: center;
          pointer-events: none;
        }
        .eyebrow {
          font: 10px "DM Mono";
          letter-spacing: 0.18em;
          color: #8794a8;
          margin-bottom: 24px;
        }
        .eyebrow span {
          display: inline-block;
          width: 34px;
          height: 1px;
          background: #38a9ff;
          vertical-align: middle;
          margin-right: 12px;
        }
        .eyebrow.blue {
          color: #5dbaff;
        }
        .eyebrow.orange {
          color: #ff9a66;
        }
        .hero h1 {
          font-size: clamp(64px, 9vw, 150px);
          line-height: 0.86;
          letter-spacing: -0.07em;
          font-weight: 300;
          margin: 0;
          max-width: 900px;
          text-shadow: 0 10px 50px #000;
        }
        .hero h1 em,
        .content-card h2 em,
        .projects h2 em,
        .process h2 em,
        .cta h2 em {
          font-style: normal;
          color: #38a9ff;
        }
        .hero p {
          max-width: 450px;
          color: #aab4c4;
          line-height: 1.7;
          font-size: 15px;
          margin: 34px 0;
        }
        .scroll-hint {
          font: 10px "DM Mono";
          letter-spacing: 0.16em;
          color: #dce8f4;
          margin-top: 20px;
        }
        .scroll-hint span {
          display: inline-flex;
          width: 30px;
          height: 30px;
          border: 1px solid #38a9ff;
          border-radius: 50%;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
        }
        .coordinates {
          position: absolute;
          right: 8vw;
          bottom: 10vh;
          color: #657287;
          font: 9px/1.8 "DM Mono";
          text-align: right;
        }
        .spacer {
          height: 100vh;
          position: relative;
          z-index: 2;
        }
        .phase-label {
          position: absolute;
          bottom: 8vh;
          left: 8vw;
          color: #5e6c7e;
          font: 10px "DM Mono";
          letter-spacing: 0.15em;
        }
        .content-section {
          min-height: 100vh;
          position: relative;
          z-index: 3;
          padding: 18vh 8vw;
          display: flex;
          align-items: center;
        }
        .content-section.right {
          justify-content: flex-end;
        }
        .content-card {
          max-width: 570px;
          padding: 50px;
          background: linear-gradient(135deg, #071426dd, #06101bd9);
          border: 1px solid #ffffff12;
          box-shadow: 0 30px 100px #0008;
          backdrop-filter: blur(18px);
        }
        .content-card.orange-card {
          background: linear-gradient(135deg, #1a100bdd, #090c14e8);
        }
        .content-card h2,
        .projects h2,
        .process h2,
        .cta h2 {
          font-size: clamp(44px, 6vw, 90px);
          font-weight: 300;
          line-height: 0.9;
          letter-spacing: -0.055em;
          margin: 0;
        }
        .orange-card h2 em {
          color: #ff8855;
        }
        .content-card p {
          color: #aeb8c8;
          line-height: 1.8;
          font-size: 14px;
          max-width: 470px;
          margin: 30px 0;
        }
        .metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          border-top: 1px solid #ffffff15;
          padding-top: 22px;
        }
        .metrics div {
          display: flex;
          flex-direction: column;
          font: 9px "DM Mono";
          letter-spacing: 0.08em;
        }
        .metrics b {
          color: #38a9ff;
          font-weight: 400;
        }
        .metrics span {
          color: #66758a;
          margin-top: 5px;
        }
        .material-row {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          color: #ff9a66;
          font: 9px "DM Mono";
          letter-spacing: 0.1em;
          border-top: 1px solid #ffffff15;
          padding-top: 20px;
        }
        .statement {
          min-height: 70vh;
          position: relative;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 10vw;
        }
        .statement div {
          font-size: clamp(30px, 5vw, 75px);
          line-height: 1.1;
          letter-spacing: -0.05em;
          font-weight: 300;
        }
        .statement span {
          color: #7f8b9d;
        }
        .statement strong {
          color: #ff8754;
          font-weight: 300;
          padding: 0 14px;
        }
        .statement em {
          display: block;
          color: #fff;
          font-style: normal;
        }
        .projects {
          position: relative;
          z-index: 3;
          padding: 12vh 7vw;
          background: linear-gradient(180deg, #070b12dd 0%, #05091499 100%);
          backdrop-filter: blur(6px);
        }
        .section-head {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 60px;
          margin-bottom: 70px;
        }
        .section-head p {
          max-width: 360px;
          color: #7e8a9c;
          line-height: 1.7;
          font-size: 13px;
        }
        .project-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 60px 24px;
        }
        .project-visual {
          height: 460px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #101c2dcc, #263b50cc);
        }
        .project-visual.v2 {
          background: linear-gradient(135deg, #211712cc, #533423cc);
        }
        .project-visual.v3 {
          background: linear-gradient(135deg, #172319cc, #334a38cc);
        }
        .project-visual.v4 {
          background: linear-gradient(135deg, #17151fcc, #44344ecc);
        }
        .project-visual > span {
          position: absolute;
          top: 18px;
          left: 20px;
          font: 10px "DM Mono";
          color: #ffffff88;
        }
        .mini-building {
          position: absolute;
          left: 50%;
          bottom: -10px;
          transform: translateX(-50%);
          height: 75%;
          width: 45%;
          background: linear-gradient(90deg, #ffffff10, #ffffff38, #ffffff08);
          border: 1px solid #ffffff2a;
          box-shadow: 0 0 100px #38a9ff22;
        }
        .mini-building:after {
          content: "";
          position: absolute;
          inset: 8% 10%;
          background:
            repeating-linear-gradient(
              to bottom,
              transparent 0 30px,
              #ffffff25 31px 32px
            ),
            repeating-linear-gradient(
              to right,
              transparent 0 28px,
              #ffffff18 29px 30px
            );
        }
        .project-info {
          display: flex;
          justify-content: space-between;
          padding: 18px 4px;
          border-bottom: 1px solid #ffffff1a;
        }
        .project-info h3 {
          font-size: 15px;
          font-weight: 500;
          margin: 0 0 6px;
        }
        .project-info p {
          font: 10px "DM Mono";
          color: #6f7d90;
          margin: 0;
        }
        .project-info > span {
          color: #38a9ff;
          font-size: 22px;
        }
        .process {
          position: relative;
          z-index: 3;
          padding: 16vh 8vw;
          background: linear-gradient(180deg, #f0eee8f0 0%, #f0eee8cc 100%);
          backdrop-filter: blur(10px);
          color: #101722;
        }
        .process .eyebrow {
          color: #687384;
        }
        .process h2 em {
          color: #176eb1;
        }
        .process-line {
          margin-top: 100px;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          border-top: 1px solid #10172233;
        }
        .process-line div {
          padding: 22px 10px 0;
          border-right: 1px solid #10172222;
          min-height: 120px;
        }
        .process-line b {
          display: block;
          color: #e16e3c;
          font: 10px "DM Mono";
          margin-bottom: 30px;
        }
        .process-line span {
          font: 10px "DM Mono";
          letter-spacing: 0.08em;
        }
        .cta {
          position: relative;
          z-index: 3;
          min-height: 90vh;
          padding: 15vh 8vw;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: radial-gradient(
            circle at 70% 40%,
            #12395b99,
            #05091400 48%
          );
        }
        .cta h2 em {
          color: #ff8a58;
        }
        .cta p {
          max-width: 430px;
          color: #8e9aac;
          line-height: 1.7;
        }
        .cta-button {
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          width: 270px;
          border: 1px solid #38a9ff66;
          padding: 17px 18px;
          margin-top: 25px;
          color: #e8f5ff;
          font: 10px "DM Mono";
          letter-spacing: 0.08em;
          background: #0b1a2bcc;
          backdrop-filter: blur(6px);
        }
        .cta-button:hover {
          background: #38a9ff;
          color: #04101b;
        }
        .cta-button span {
          font-size: 18px;
        }
        footer {
          position: relative;
          z-index: 3;
          padding: 35px 7vw;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #ffffff12;
          background: linear-gradient(180deg, transparent, #05091499);
          backdrop-filter: blur(10px);
          color: #637084;
          font: 9px "DM Mono";
          letter-spacing: 0.08em;
        }
        @media (max-width: 800px) {
          .nav nav {
            display: none;
          }
          .status {
            display: none;
          }
          .mode-switch {
            top: 90px;
            right: 20px;
          }
          .scroll-index {
            display: none;
          }
          .hero {
            padding: 140px 25px 80px;
          }
          .hero h1 {
            font-size: 65px;
          }
          .coordinates {
            display: none;
          }
          .content-section,
          .content-section.right {
            padding: 100px 20px;
            justify-content: center;
          }
          .content-card {
            padding: 28px;
          }
          .metrics {
            grid-template-columns: 1fr;
          }
          .statement {
            min-height: 55vh;
            padding: 30px;
          }
          .section-head {
            display: block;
          }
          .section-head p {
            margin-top: 30px;
          }
          .projects {
            padding: 90px 20px;
          }
          .project-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .project-visual {
            height: 350px;
          }
          .process {
            padding: 100px 20px;
          }
          .process-line {
            grid-template-columns: repeat(2, 1fr);
            margin-top: 60px;
          }
          .cta {
            padding: 100px 25px;
          }
          footer {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
          }
        }
      `}</style>
    </main>
  );
}
