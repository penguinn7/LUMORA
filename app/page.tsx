"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
} from "@react-three/postprocessing";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";

import Lamp from "./Lamp";

export default function Home() {
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  /*
   * =========================================================
   * SCENE NUMBER
   * =========================================================
   *
   * IMPORTANT:
   * Motion values are objects, so we cannot directly do:
   *
   * {sceneNumber}
   *
   * We keep the animated value internally and convert it
   * into normal React state for the text.
   */

  const [currentScene, setCurrentScene] = useState("01");

  useMotionValueEvent(
    scrollYProgress,
    "change",
    (latest) => {
      let scene = "01";

      if (latest >= 0.88) {
        scene = "07";
      } else if (latest >= 0.725) {
        scene = "06";
      } else if (latest >= 0.58) {
        scene = "05";
      } else if (latest >= 0.415) {
        scene = "04";
      } else if (latest >= 0.275) {
        scene = "03";
      } else if (latest >= 0.135) {
        scene = "02";
      }

      setCurrentScene(scene);
    }
  );

  /*
   * =========================================================
   * BACKGROUND
   * =========================================================
   */

  const background = useTransform(
    scrollYProgress,
    [
      0,
      0.115,
      0.25,
      0.39,
      0.53,
      0.67,
      0.80,
      0.91,
      1,
    ],
    [
      "#020202",
      "#070707",
      "#bcb7ae",
      "#d2cdc4",
      "#0a0a0a",
      "#87827a",
      "#c6c1b8",
      "#050505",
      "#020202",
    ]
  );

  /*
   * =========================================================
   * SCENE 01 — REVEAL
   * =========================================================
   */

  const s1Opacity = useTransform(
    scrollYProgress,
    [0, 0.055, 0.10, 0.135],
    [1, 1, 0.55, 0]
  );

  const s1Y = useTransform(
    scrollYProgress,
    [0, 0.12],
    [0, -45]
  );

  /*
   * =========================================================
   * SCENE 02 — FORM
   * =========================================================
   */

  const s2Opacity = useTransform(
    scrollYProgress,
    [0.135, 0.17, 0.235, 0.27],
    [0, 1, 1, 0]
  );

  const s2X = useTransform(
    scrollYProgress,
    [0.16, 0.23],
    [-70, 0]
  );

  /*
   * =========================================================
   * SCENE 03 — LIGHT
   * =========================================================
   */

  const s3Opacity = useTransform(
    scrollYProgress,
    [0.275, 0.31, 0.37, 0.405],
    [0, 1, 1, 0]
  );

  const s3Y = useTransform(
    scrollYProgress,
    [0.29, 0.37],
    [40, 0]
  );

  /*
   * =========================================================
   * SCENE 04 — DECONSTRUCTION
   * =========================================================
   */

  const s4Opacity = useTransform(
    scrollYProgress,
    [0.415, 0.45, 0.535, 0.575],
    [0, 1, 1, 0]
  );

  const s4TitleX = useTransform(
    scrollYProgress,
    [0.43, 0.49],
    [-90, 0]
  );

  const s4TitleY = useTransform(
    scrollYProgress,
    [0.43, 0.49],
    [35, 0]
  );

  const s4MetaX = useTransform(
    scrollYProgress,
    [0.44, 0.52],
    [80, 0]
  );

  const s4Graphic = useTransform(
    scrollYProgress,
    [0.44, 0.49, 0.55],
    [0, 1, 0]
  );

  /*
   * =========================================================
   * SCENE 05 — STATEMENT
   * =========================================================
   */

  const s5Opacity = useTransform(
    scrollYProgress,
    [0.58, 0.615, 0.68, 0.72],
    [0, 1, 1, 0]
  );

  const s5Y = useTransform(
    scrollYProgress,
    [0.60, 0.68],
    [55, 0]
  );

  /*
   * =========================================================
   * SCENE 06 — DETAILS
   * =========================================================
   */

  const s6Opacity = useTransform(
    scrollYProgress,
    [0.725, 0.76, 0.83, 0.87],
    [0, 1, 1, 0]
  );

  const s6X = useTransform(
    scrollYProgress,
    [0.74, 0.81],
    [-60, 0]
  );

  /*
   * =========================================================
   * SCENE 07 — FINALE
   * =========================================================
   */

  const s7Opacity = useTransform(
    scrollYProgress,
    [0.88, 0.94, 1],
    [0, 1, 1]
  );

  const s7Y = useTransform(
    scrollYProgress,
    [0.89, 0.97],
    [35, 0]
  );

  /*
   * =========================================================
   * PAGE
   * =========================================================
   */

  return (
    <main
      ref={container}
      className="relative w-full"
      style={{
        height: "700vh",
      }}
    >
      <motion.div
        className="fixed inset-0 overflow-hidden"
        style={{
          background,
        }}
      >

        {/* =================================================
            3D WORLD
        ================================================= */}

        <Canvas
          camera={{
            position: [0, 0.7, 6],
            fov: 38,
            near: 0.1,
            far: 100,
          }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
          }}
        >
          <ambientLight intensity={0.10} />

          <directionalLight
            position={[4, 6, 5]}
            intensity={0.38}
          />

          <directionalLight
            position={[-4, 2, -3]}
            intensity={0.12}
          />

          <Environment preset="studio" />

          <Lamp
            progress={scrollYProgress}
          />

          <EffectComposer>
            <Bloom
              intensity={0.12}
              luminanceThreshold={1.08}
              luminanceSmoothing={0.92}
              mipmapBlur
            />
          </EffectComposer>
        </Canvas>

        {/* =================================================
            MINIMAL HEADER
        ================================================= */}

        <div className="pointer-events-none absolute left-7 right-7 top-7 z-50 flex items-center justify-between md:left-10 md:right-10 md:top-9">
          <p className="text-[9px] uppercase tracking-[0.55em] text-white/55 mix-blend-difference">
            LUMORA
          </p>

          <p className="text-[8px] uppercase tracking-[0.45em] text-white/35 mix-blend-difference">
            OBJECT / {currentScene}
          </p>
        </div>

        {/* =================================================
            SCENE 01 — REVEAL
        ================================================= */}

        <motion.section
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            opacity: s1Opacity,
            y: s1Y,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">

              <p className="mb-7 text-[9px] uppercase tracking-[0.72em] text-white/45">
                LUMORA
              </p>


            </div>
          </div>

          <div className="absolute left-7 top-[12%] md:left-10">
            <p className="text-[8px] uppercase tracking-[0.5em] text-white/25">
              01 / REVEAL
            </p>
          </div>

          <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 text-center">
            <p className="text-[8px] uppercase tracking-[0.42em] text-white/25">
              SCROLL TO EXPLORE
            </p>

            <div className="mx-auto mt-4 h-8 w-px bg-white/15" />
          </div>
        </motion.section>

        {/* =================================================
            SCENE 02 — FORM
        ================================================= */}

        <motion.section
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            opacity: s2Opacity,
          }}
        >
          <motion.div
            className="absolute left-[7%] top-[18%]"
            style={{
              x: s2X,
            }}
          >
            <p className="mb-4 text-[8px] uppercase tracking-[0.5em] text-black/30">
              02 / FORM
            </p>

            <h2 className="text-6xl font-light tracking-[-0.06em] text-black/65 md:text-8xl lg:text-9xl">
              FORM
            </h2>
          </motion.div>

          <div className="absolute bottom-[14%] left-[7%]">
            <p className="max-w-[190px] text-[8px] uppercase leading-5 tracking-[0.15em] text-black/30">
              Proportion.
              <br />
              Structure.
              <br />
              Presence.
            </p>
          </div>

          <div className="absolute right-[7%] top-[25%] text-right">
            <p className="text-[8px] uppercase tracking-[0.45em] text-black/30">
              LIGHT
            </p>

            <p className="mt-4 text-[8px] uppercase tracking-[0.45em] text-black/30">
              SHADOW
            </p>

            <p className="mt-4 text-[8px] uppercase tracking-[0.45em] text-black/30">
              MATERIAL
            </p>
          </div>
        </motion.section>

        {/* =================================================
            SCENE 03 — LIGHT
        ================================================= */}

        <motion.section
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
          style={{
            opacity: s3Opacity,
          }}
        >
          <motion.div
            className="text-center"
            style={{
              y: s3Y,
            }}
          >
            <p className="mb-7 text-[8px] uppercase tracking-[0.58em] text-black/30">
              03 / LIGHT
            </p>

            <h2 className="text-4xl font-light leading-[1.06] tracking-[-0.035em] text-black/65 md:text-6xl lg:text-7xl">
              ONE FORM.
              <br />
              EVERY MOOD.
            </h2>

            <div className="mx-auto mt-10 h-px w-24 bg-black/15" />

            <div className="mt-8 flex justify-center gap-8 md:gap-12">
              <span className="text-[8px] uppercase tracking-[0.38em] text-black/30">
                WARM
              </span>

              <span className="text-[8px] uppercase tracking-[0.38em] text-black/30">
                NEUTRAL
              </span>

              <span className="text-[8px] uppercase tracking-[0.38em] text-black/30">
                COOL
              </span>
            </div>
          </motion.div>
        </motion.section>

        {/* =================================================
            SCENE 04 — MOTION
        ================================================= */}

        <motion.section
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            opacity: s4Opacity,
          }}
        >
          <motion.div
            className="absolute left-[7%] top-[14%]"
            style={{
              x: s4TitleX,
              y: s4TitleY,
            }}
          >
            <p className="mb-5 text-[8px] uppercase tracking-[0.5em] text-white/25">
              04 / MOTION
            </p>

            <h2 className="text-4xl font-light leading-[1.03] tracking-[-0.045em] text-white/78 md:text-6xl lg:text-7xl">
              ENGINEERED
              <br />
              TO MOVE.
            </h2>
          </motion.div>

          <motion.div
            className="absolute bottom-[15%] right-[7%] text-right"
            style={{
              x: s4MetaX,
            }}
          >
            <p className="text-[8px] uppercase tracking-[0.45em] text-white/25">
              FORM
            </p>

            <p className="mt-4 text-[8px] uppercase tracking-[0.45em] text-white/25">
              COMPONENTS
            </p>

            <p className="mt-4 text-[8px] uppercase tracking-[0.45em] text-white/25">
              PRECISION
            </p>
          </motion.div>

          <motion.div
            className="absolute left-[7%] right-[7%] top-1/2 h-px origin-center bg-white/10"
            style={{
              scaleX: s4Graphic,
            }}
          />

          <motion.div
            className="absolute bottom-[9%] left-1/2 top-[9%] w-px origin-center bg-white/10"
            style={{
              scaleY: s4Graphic,
            }}
          />

          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              opacity: s4Graphic,
              scale: s4Graphic,
            }}
          >
            <div className="h-5 w-5 rounded-full border border-white/15" />
          </motion.div>
        </motion.section>

        {/* =================================================
            SCENE 05 — PRESENCE
        ================================================= */}

        <motion.section
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            opacity: s5Opacity,
          }}
        >
          <motion.div
            className="absolute bottom-[13%] left-[8%]"
            style={{
              y: s5Y,
            }}
          >
            <p className="mb-6 text-[8px] uppercase tracking-[0.5em] text-black/30">
              05 / PRESENCE
            </p>

            <h2 className="text-3xl font-light leading-[1.07] tracking-[-0.035em] text-black/65 md:text-5xl lg:text-6xl">
              A STATEMENT,
              <br />
              EVEN WHEN
              <br />
              IT&apos;S OFF.
            </h2>
          </motion.div>

          <div className="absolute right-[8%] top-[15%]">
            <p className="text-[8px] uppercase tracking-[0.45em] text-black/25">
              OBJECT / 01
            </p>
          </div>
        </motion.section>

        {/* =================================================
            SCENE 06 — DETAILS
        ================================================= */}

        <motion.section
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            opacity: s6Opacity,
          }}
        >
          <motion.div
            className="absolute left-[8%] top-[11%]"
            style={{
              x: s6X,
            }}
          >
            <p className="mb-11 text-[8px] uppercase tracking-[0.5em] text-black/30">
              06 / DETAILS
            </p>

            <div className="space-y-8">

              <div>
                <p className="text-[8px] uppercase tracking-[0.35em] text-black/25">
                  01
                </p>
              </div>

              <div>
                <p className="text-[8px] uppercase tracking-[0.35em] text-black/25">
                  02
                </p>

                <h3 className="mt-2 text-xl font-light tracking-wide text-black/65 md:text-3xl">
                  ADAPTIVE LIGHT
                </h3>
              </div>

              <div>
                <p className="text-[8px] uppercase tracking-[0.35em] text-black/25">
                  03
                </p>

                <h3 className="mt-2 text-xl font-light tracking-wide text-black/65 md:text-3xl">
                  TOUCH CONTROL
                </h3>
              </div>

            </div>
          </motion.div>

          <div className="absolute bottom-[12%] right-[8%] text-right">
            <p className="text-[8px] uppercase tracking-[0.42em] text-black/25">
              DESIGNED
            </p>

            <p className="mt-3 text-[8px] uppercase tracking-[0.42em] text-black/25">
              WITH INTENTION
            </p>
          </div>
        </motion.section>

        {/* =================================================
            SCENE 07 — FINALE
        ================================================= */}

        <motion.section
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
          style={{
            opacity: s7Opacity,
          }}
        >
          <motion.div
            className="text-center"
            style={{
              y: s7Y,
            }}
          >
            <p className="mb-7 text-[9px] uppercase tracking-[0.72em] text-white/40">
              LUMORA
            </p>

            <h3 className="text-4xl font-light leading-[1.04] tracking-[0.055em] text-black/88 md:text-6xl lg:text-8xl">
              LIGHT
              <br />
              SHAPES MOOD.
            </h3>

            <div className="mx-auto mt-8 h-px w-16 bg-white/15" />

            <button
              className="
                pointer-events-auto
                mt-10
                border
                border-white/25
                px-9
                py-4
                text-[8px]
                uppercase
                tracking-[0.45em]
                text-white/65
                transition-all
                duration-500
                hover:bg-white
                hover:text-black
              "
            >
              EXPLORE LUMORA
            </button>
          </motion.div>

          <div className="absolute top-[11%]">
            <p className="text-[8px] uppercase tracking-[0.5em] text-white/22">
              07 / FINALE
            </p>
          </div>
        </motion.section>

      </motion.div>
    </main>
  );
}