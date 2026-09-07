"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Stars } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import Lamp from "./Lamp";

function Moon() {
  const moon = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!moon.current) return;

    moon.current.rotation.y =
      state.clock.elapsedTime * 0.035;

    moon.current.position.y =
      2.65 +
      Math.sin(state.clock.elapsedTime * 0.18) * 0.035;
  });

  return (
    <group>
      <mesh
        ref={moon}
        position={[3.7, 2.65, -2.8]}
      >
        <sphereGeometry args={[0.72, 64, 64]} />
        <meshStandardMaterial
          color="#d9dccb"
          roughness={0.9}
          metalness={0}
          emissive="#aeb89b"
          emissiveIntensity={0.08}
        />
      </mesh>

      <pointLight
        position={[3.7, 2.65, -2.4]}
        intensity={0.3}
        distance={6}
        color="#b9c7d9"
      />
    </group>
  );
}

function Atmosphere() {
  const ring = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ring.current) return;

    ring.current.rotation.z =
      state.clock.elapsedTime * 0.025;

    ring.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.1) * 0.08;
  });

  return (
    <>
      <Stars
        radius={18}
        depth={8}
        count={1100}
        factor={1.25}
        saturation={0}
        fade
        speed={0.18}
      />

      <Sparkles
        count={85}
        scale={[9, 7, 7]}
        size={1.2}
        speed={0.18}
        opacity={0.38}
        color="#d9e2ca"
      />

      <mesh
        ref={ring}
        position={[0, 0.9, -1.5]}
        rotation={[Math.PI / 2.4, 0, 0]}
      >
        <torusGeometry args={[2.9, 0.008, 8, 160]} />
        <meshBasicMaterial
          color="#aab79b"
          transparent
          opacity={0.18}
        />
      </mesh>
    </>
  );
}

function Scene({
  progress,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  return (
    <Canvas
      camera={{
        position: [0, 0.7, 6.3],
        fov: 38,
      }}
      dpr={[1, 1.8]}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
      }}
    >
      <color
        attach="background"
        args={["#050705"]}
      />

      <fog
        attach="fog"
        args={["#050705", 7, 17]}
      />

      <ambientLight
        intensity={0.12}
        color="#c9d2bd"
      />

      <directionalLight
        position={[-4, 5, 4]}
        intensity={0.55}
        color="#dce5d0"
      />

      <directionalLight
        position={[4, 1, -3]}
        intensity={0.28}
        color="#7d91aa"
      />

      <Suspense fallback={null}>
        <Atmosphere />
        <Moon />
        <Lamp progress={progress} />

        <EffectComposer>
          <Bloom
            intensity={0.72}
            luminanceThreshold={0.82}
            luminanceSmoothing={0.7}
            mipmapBlur
          />

          <Vignette
            eskil={false}
            offset={0.16}
            darkness={0.7}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}

function SectionNumber({
  number,
}: {
  number: string;
}) {
  return (
    <div className="section-number">
      <span>{number}</span>
      <i />
    </div>
  );
}

function EditorialLine() {
  return (
    <div className="editorial-line">
      <span />
      <span />
      <span />
    </div>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(
    scrollYProgress,
    {
      stiffness: 80,
      damping: 28,
      mass: 0.45,
    }
  );

  const introOpacity = useTransform(
    smoothProgress,
    [0, 0.12],
    [1, 0]
  );

  const introY = useTransform(
    smoothProgress,
    [0, 0.16],
    [0, -90]
  );

  const moonTextOpacity = useTransform(
    smoothProgress,
    [0.57, 0.66, 0.72],
    [0, 1, 0]
  );

  const finalScale = useTransform(
    smoothProgress,
    [0.84, 1],
    [0.96, 1]
  );

  return (
    <main className="lumora-site">
      <div className="fixed-scene">
        <Scene progress={smoothProgress} />
      </div>

      <header className="site-nav">
        <a
          href="#top"
          className="brand"
        >
          LUMORA
        </a>

        <div className="nav-center">
          <span>OBJECT 01</span>
          <span>LIGHT / FORM</span>
        </div>

        <a
          href="#explore"
          className="nav-link"
        >
          EXPLORE
          <span>↗</span>
        </a>
      </header>

      <div className="scroll-progress">
        <motion.div
          style={{
            scaleY: smoothProgress,
          }}
        />
      </div>

      <section
        id="top"
        className="hero scene-section"
      >
        <motion.div
          className="hero-copy"
          style={{
            opacity: introOpacity,
            y: introY,
          }}
        >
          <p className="eyebrow">
            A STUDY IN LIGHT
          </p>

          <h1>
            LIGHT
            <br />
            <em>GIVEN FORM.</em>
          </h1>

          <p className="hero-description">
            A sculptural object designed not merely
            to illuminate a room, but to change the
            feeling within it.
          </p>

          <div className="scroll-prompt">
            <span className="scroll-dot" />
            <span>SCROLL TO ENTER</span>
          </div>
        </motion.div>

        <div className="hero-meta">
          <span>DESIGNED 2026</span>
          <span>INDOOR / OBJECT</span>
        </div>
      </section>

      <section className="scene-section form-section">
        <div className="section-copy left-copy">
          <SectionNumber number="01" />

          <p className="eyebrow">
            THE OBJECT
          </p>

          <h2>
            SOME OBJECTS
            <br />
            <em>CHANGE A ROOM.</em>
          </h2>

          <p>
            LUMORA is reduced to its essential
            elements — a luminous core, a precise
            shell and a quiet architectural base.
          </p>
        </div>

        <div className="side-label">
          <span>SCULPTURAL</span>
          <span>PRECISE</span>
          <span>QUIET</span>
        </div>

        <div className="measurement measurement-one">
          <span>320</span>
          <i />
          <small>MM</small>
        </div>
      </section>

      <section className="scene-section interaction-section">
        <div className="center-copy">
          <SectionNumber number="02" />

          <p className="eyebrow">
            INTERACT WITH FORM
          </p>

          <h2>
            LOOK CLOSER.
          </h2>

          <p>
            The object is made to be discovered.
            <br />
            <strong>Drag the lamp.</strong>
          </p>

          <div className="drag-indicator">
            <span>←</span>
            <div>
              <i />
              <i />
              <i />
            </div>
            <span>→</span>
          </div>
        </div>
      </section>

      <section className="scene-section light-section">
        <div className="light-copy">
          <SectionNumber number="03" />

          <p className="eyebrow">
            LIGHT AS ATMOSPHERE
          </p>

          <h2>
            ONE FORM.
            <br />
            <em>DIFFERENT FEELINGS.</em>
          </h2>

          <p>
            Warmth for slow evenings.
            <br />
            Clarity for focused hours.
            <br />
            Stillness after midnight.
          </p>
        </div>

        <div className="light-orbit">
          <span>WARM</span>
          <span>NEUTRAL</span>
          <span>MOON</span>
        </div>
      </section>

      <section className="scene-section exploded-section">
        <div className="exploded-copy">
          <SectionNumber number="04" />

          <p className="eyebrow">
            ANATOMY
          </p>

          <h2>
            BEAUTY
            <br />
            <em>IN THE DETAILS.</em>
          </h2>

          <p>
            Every component has a reason to exist.
            Every proportion is deliberate.
          </p>
        </div>

        <div className="component-label label-shell">
          <b>01</b>
          <span>OUTER SHELL</span>
          <small>LIGHT SAGE METAL</small>
        </div>

        <div className="component-label label-core">
          <b>02</b>
          <span>LIGHT CORE</span>
          <small>ADAPTIVE ILLUMINATION</small>
        </div>

        <div className="component-label label-base">
          <b>03</b>
          <span>FOUNDATION</span>
          <small>WEIGHTED METAL</small>
        </div>
      </section>

      <section className="scene-section moon-section">
        <motion.div
          className="moon-copy"
          style={{
            opacity: moonTextOpacity,
          }}
        >
          <SectionNumber number="05" />

          <p className="eyebrow">
            AFTER DARK
          </p>

          <h2>
            WHEN EVERYTHING
            <br />
            <em>ELSE GOES QUIET.</em>
          </h2>

          <p>
            LUMORA shifts with the hour.
            <br />
            Cooler. Softer. Almost lunar.
          </p>
        </motion.div>
      </section>

      <section
        id="explore"
        className="scene-section philosophy-section"
      >
        <div className="philosophy-top">
          <span>LIGHT / 01</span>
          <span>FORM / 02</span>
          <span>MOOD / 03</span>
        </div>

        <div className="philosophy-main">
          <p className="eyebrow">
            THE LUMORA PRINCIPLE
          </p>

          <h2>
            DON'T JUST
            <br />
            <em>LIGHT A ROOM.</em>
            <br />
            CHANGE IT.
          </h2>

          <EditorialLine />

          <p className="philosophy-body">
            We believe lighting should feel less
            like equipment and more like architecture.
            Something that occupies space even when
            it is switched off.
          </p>
        </div>
      </section>

      <section className="scene-section final-section">
        <motion.div
          className="final-copy"
          style={{
            scale: finalScale,
          }}
        >
          <p className="eyebrow">
            LUMORA / OBJECT 01
          </p>

          <h2>
            LIGHT
            <br />
            <em>SHAPES MOOD.</em>
          </h2>

          <div className="final-button">
            <span>DISCOVER LUMORA</span>
            <span>↗</span>
          </div>
        </motion.div>

        <div className="final-footer">
          <span>SCULPTURAL LIGHTING</span>
          <span>2026</span>
          <span>© LUMORA</span>
        </div>
      </section>
    </main>
  );
}

