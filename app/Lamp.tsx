"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { MotionValue } from "motion/react";
import * as THREE from "three";
import { useMemo, useRef } from "react";

type LampProps = {
  progress: MotionValue<number>;
};

function clamp01(value: number) {
  return THREE.MathUtils.clamp(value, 0, 1);
}

function smooth(value: number) {
  const x = clamp01(value);
  return x * x * (3 - 2 * x);
}

function range(
  value: number,
  start: number,
  end: number
) {
  if (end === start) return 0;

  return clamp01(
    (value - start) / (end - start)
  );
}

function lerp(
  value: number,
  start: number,
  end: number
) {
  return THREE.MathUtils.lerp(start, end, value);
}

export default function Lamp({
  progress,
}: LampProps) {
  const root = useRef<THREE.Group>(null);

  const shellLeft = useRef<THREE.Mesh>(null);
  const shellRight = useRef<THREE.Mesh>(null);

  const innerPanel = useRef<THREE.Mesh>(null);

  const topCap = useRef<THREE.Mesh>(null);
  const bottomCap = useRef<THREE.Mesh>(null);

  const neck = useRef<THREE.Mesh>(null);
  const base = useRef<THREE.Mesh>(null);
  const baseRing = useRef<THREE.Mesh>(null);

  const glowLight = useRef<THREE.PointLight>(null);

  const cameraGroup = useRef<THREE.Group>(null);

  const { camera } = useThree();

  /*
   * =========================================================
   * MATERIALS
   * =========================================================
   */

  const metal = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#d8d8d4",
        metalness: 0.94,
        roughness: 0.23,
        clearcoat: 0.65,
        clearcoatRoughness: 0.18,
      }),
    []
  );

  const darkerMetal = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#999995",
        metalness: 0.96,
        roughness: 0.2,
        clearcoat: 0.5,
        clearcoatRoughness: 0.2,
      }),
    []
  );

  const innerMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#fff0ce",
        emissive: "#ffb74c",
        emissiveIntensity: 1.15,
        roughness: 0.25,
      }),
    []
  );

  /*
   * =========================================================
   * FRAME LOOP
   * =========================================================
   */

  useFrame((_, delta) => {
    if (!root.current) return;

    const p = progress.get();

    /*
     * -------------------------------------------------------
     * MASTER LAMP ROTATION
     * -------------------------------------------------------
     */

    let rotationY = 0;

    // Scene 01 — barely rotates.
    if (p < 0.12) {
      const t = smooth(range(p, 0, 0.12));

      rotationY = lerp(
        t,
        -0.08,
        0.18
      );
    }

    // Scene 02 — clear product reveal.
    else if (p < 0.28) {
      const t = smooth(range(p, 0.12, 0.28));

      rotationY = lerp(
        t,
        0.18,
        Math.PI * 0.45
      );
    }

    // Scene 03 — slower elegant movement.
    else if (p < 0.40) {
      const t = smooth(range(p, 0.28, 0.40));

      rotationY = lerp(
        t,
        Math.PI * 0.45,
        Math.PI * 0.72
      );
    }

    // Scene 04 — dramatic rotation.
    else if (p < 0.58) {
      const t = smooth(range(p, 0.40, 0.58));

      rotationY = lerp(
        t,
        Math.PI * 0.72,
        Math.PI * 2.3
      );
    }

    // Scene 05 — settle down.
    else if (p < 0.73) {
      const t = smooth(range(p, 0.58, 0.73));

      rotationY = lerp(
        t,
        Math.PI * 2.3,
        Math.PI * 2.55
      );
    }

    // Scene 06 — product-detail orbit.
    else if (p < 0.87) {
      const t = smooth(range(p, 0.73, 0.87));

      rotationY = lerp(
        t,
        Math.PI * 2.55,
        Math.PI * 3.15
      );
    }

    // Scene 07 — final hero rotation.
    else {
      const t = smooth(range(p, 0.87, 1));

      rotationY = lerp(
        t,
        Math.PI * 3.15,
        Math.PI * 3.75
      );
    }

    root.current.rotation.y = THREE.MathUtils.damp(
      root.current.rotation.y,
      rotationY,
      3.2,
      delta
    );

    /*
     * -------------------------------------------------------
     * CINEMATIC CAMERA
     * -------------------------------------------------------
     */

    let targetX = 0;
    let targetY = 0.7;
    let targetZ = 6;

    /*
     * Scene 01
     * Static hero reveal.
     */

    if (p < 0.12) {
      const t = smooth(range(p, 0, 0.12));

      targetX = lerp(t, 0, 0.12);
      targetY = lerp(t, 0.7, 0.78);
      targetZ = lerp(t, 6.2, 5.9);
    }

    /*
     * Scene 02
     * Camera begins orbiting around product.
     */

    else if (p < 0.28) {
      const t = smooth(range(p, 0.12, 0.28));

      targetX = lerp(t, 0.12, -0.65);
      targetY = lerp(t, 0.78, 0.95);
      targetZ = lerp(t, 5.9, 5.2);
    }

    /*
     * Scene 03
     * Slight pull back and upward movement.
     */

    else if (p < 0.40) {
      const t = smooth(range(p, 0.28, 0.40));

      targetX = lerp(t, -0.65, 0.5);
      targetY = lerp(t, 0.95, 0.58);
      targetZ = lerp(t, 5.2, 5.8);
    }

    /*
     * Scene 04
     * Camera gets closer and moves dramatically.
     */

    else if (p < 0.58) {
      const t = smooth(range(p, 0.40, 0.58));

      targetX = lerp(t, 0.5, -0.85);
      targetY = lerp(t, 0.58, 1.15);
      targetZ = lerp(t, 5.8, 4.6);
    }

    /*
     * Scene 05
     * Pull back — breathing room.
     */

    else if (p < 0.73) {
      const t = smooth(range(p, 0.58, 0.73));

      targetX = lerp(t, -0.85, 0.3);
      targetY = lerp(t, 1.15, 0.68);
      targetZ = lerp(t, 4.6, 6.2);
    }

    /*
     * Scene 06
     * Intimate product orbit.
     */

    else if (p < 0.87) {
      const t = smooth(range(p, 0.73, 0.87));

      targetX = lerp(t, 0.3, -0.42);
      targetY = lerp(t, 0.68, 0.82);
      targetZ = lerp(t, 6.2, 5.1);
    }

    /*
     * Scene 07
     * Return to centered hero shot.
     */

    else {
      const t = smooth(range(p, 0.87, 1));

      targetX = lerp(t, -0.42, 0);
      targetY = lerp(t, 0.82, 0.72);
      targetZ = lerp(t, 5.1, 6.1);
    }

    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      targetX,
      2.4,
      delta
    );

    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      targetY,
      2.4,
      delta
    );

    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      targetZ,
      2.4,
      delta
    );

    camera.lookAt(0, 1.0, 0);

    /*
     * -------------------------------------------------------
     * DECONSTRUCTION
     * -------------------------------------------------------
     */

    const breakIn = smooth(
      range(p, 0.415, 0.50)
    );

    const breakOut = smooth(
      range(p, 0.50, 0.585)
    );

    const separation =
      breakIn * (1 - breakOut);

    /*
     * Shells
     */

    if (shellLeft.current) {
      shellLeft.current.position.x =
        THREE.MathUtils.damp(
          shellLeft.current.position.x,
          -0.31 - separation * 1.35,
          5,
          delta
        );

      shellLeft.current.position.y =
        THREE.MathUtils.damp(
          shellLeft.current.position.y,
          1.3 + separation * 0.3,
          5,
          delta
        );

      shellLeft.current.rotation.z =
        THREE.MathUtils.damp(
          shellLeft.current.rotation.z,
          separation * 0.2,
          5,
          delta
        );

      shellLeft.current.rotation.x =
        THREE.MathUtils.damp(
          shellLeft.current.rotation.x,
          separation * 0.12,
          5,
          delta
        );
    }

    if (shellRight.current) {
      shellRight.current.position.x =
        THREE.MathUtils.damp(
          shellRight.current.position.x,
          0.31 + separation * 1.35,
          5,
          delta
        );

      shellRight.current.position.y =
        THREE.MathUtils.damp(
          shellRight.current.position.y,
          1.3 - separation * 0.3,
          5,
          delta
        );

      shellRight.current.rotation.z =
        THREE.MathUtils.damp(
          shellRight.current.rotation.z,
          -separation * 0.2,
          5,
          delta
        );

      shellRight.current.rotation.x =
        THREE.MathUtils.damp(
          shellRight.current.rotation.x,
          -separation * 0.12,
          5,
          delta
        );
    }

    /*
     * Inner panel
     */

    if (innerPanel.current) {
      innerPanel.current.position.z =
        THREE.MathUtils.damp(
          innerPanel.current.position.z,
          0.38 + separation * 1.5,
          5,
          delta
        );

      innerPanel.current.rotation.y =
        THREE.MathUtils.damp(
          innerPanel.current.rotation.y,
          separation * 0.35,
          5,
          delta
        );
    }

    /*
     * Top cap
     */

    if (topCap.current) {
      topCap.current.position.y =
        THREE.MathUtils.damp(
          topCap.current.position.y,
          3.08 + separation * 0.72,
          5,
          delta
        );

      topCap.current.rotation.z =
        THREE.MathUtils.damp(
          topCap.current.rotation.z,
          separation * 0.14,
          5,
          delta
        );
    }

    /*
     * Bottom cap
     */

    if (bottomCap.current) {
      bottomCap.current.position.y =
        THREE.MathUtils.damp(
          bottomCap.current.position.y,
          -0.48 - separation * 0.72,
          5,
          delta
        );

      bottomCap.current.rotation.z =
        THREE.MathUtils.damp(
          bottomCap.current.rotation.z,
          -separation * 0.14,
          5,
          delta
        );
    }

    /*
     * Base movement.
     */

    if (neck.current) {
      neck.current.position.y =
        THREE.MathUtils.damp(
          neck.current.position.y,
          -0.64 - separation * 0.12,
          5,
          delta
        );
    }

    if (base.current) {
      base.current.position.y =
        THREE.MathUtils.damp(
          base.current.position.y,
          -0.82 - separation * 0.08,
          5,
          delta
        );

      base.current.rotation.y =
        THREE.MathUtils.damp(
          base.current.rotation.y,
          separation * 0.55,
          5,
          delta
        );
    }

    if (baseRing.current) {
      baseRing.current.rotation.y =
        THREE.MathUtils.damp(
          baseRing.current.rotation.y,
          separation * -0.7,
          5,
          delta
        );
    }

    /*
     * -------------------------------------------------------
     * LIGHT TEMPERATURE
     * -------------------------------------------------------
     */

    let targetColor = new THREE.Color(
      "#ffbd63"
    );

    let targetIntensity = 0.9;

    /*
     * Warm → neutral
     */

    if (p >= 0.27 && p < 0.38) {
      const t = smooth(
        range(p, 0.27, 0.38)
      );

      targetColor.lerpColors(
        new THREE.Color("#ffbd63"),
        new THREE.Color("#fff2d6"),
        t
      );

      targetIntensity = lerp(
        t,
        0.9,
        0.68
      );
    }

    /*
     * Neutral → cool
     */

    if (p >= 0.38 && p < 0.45) {
      const t = smooth(
        range(p, 0.38, 0.45)
      );

      targetColor.lerpColors(
        new THREE.Color("#fff2d6"),
        new THREE.Color("#dce9ff"),
        t
      );

      targetIntensity = lerp(
        t,
        0.68,
        0.45
      );
    }

    /*
     * Deconstruction
     */

    if (p >= 0.45 && p < 0.59) {
      targetColor.set("#dce9ff");
      targetIntensity = 0.42;
    }

    /*
     * Return to warmth
     */

    if (p >= 0.59 && p < 0.75) {
      const t = smooth(
        range(p, 0.59, 0.75)
      );

      targetColor.lerpColors(
        new THREE.Color("#dce9ff"),
        new THREE.Color("#ffbd63"),
        t
      );

      targetIntensity = lerp(
        t,
        0.42,
        0.9
      );
    }

    /*
     * Finale
     */

    if (p >= 0.75) {
      targetColor.set("#ffca78");
      targetIntensity = 0.92;
    }

    if (glowLight.current) {
      glowLight.current.color.lerp(
        targetColor,
        1 - Math.exp(-4 * delta)
      );

      glowLight.current.intensity =
        THREE.MathUtils.damp(
          glowLight.current.intensity,
          targetIntensity,
          4,
          delta
        );
    }

    /*
     * -------------------------------------------------------
     * SUBTLE FLOAT
     * -------------------------------------------------------
     */

    const float =
      Math.sin(
        performance.now() * 0.00055
      ) * 0.012;

    root.current.position.y =
      THREE.MathUtils.damp(
        root.current.position.y,
        -0.55 + float,
        3,
        delta
      );

    /*
     * -------------------------------------------------------
     * SCENE-SPECIFIC TILT
     * -------------------------------------------------------
     */

    let targetTilt = 0;

    if (p > 0.14 && p < 0.28) {
      targetTilt = 0.025;
    }

    if (p > 0.415 && p < 0.585) {
      targetTilt = -0.055;
    }

    if (p > 0.73 && p < 0.87) {
      targetTilt = 0.018;
    }

    root.current.rotation.x =
      THREE.MathUtils.damp(
        root.current.rotation.x,
        targetTilt,
        3,
        delta
      );
  });

  return (
    <group
      ref={root}
      position={[0, -0.55, 0]}
    >
      {/* =====================================================
          MAIN BODY
      ===================================================== */}

      <mesh
        ref={shellLeft}
        position={[-0.31, 1.3, 0]}
        material={metal}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[0.62, 3.5, 0.72]}
        />
      </mesh>

      <mesh
        ref={shellRight}
        position={[0.31, 1.3, 0]}
        material={metal}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[0.62, 3.5, 0.72]}
        />
      </mesh>

      {/* =====================================================
          INNER LIGHT PANEL
      ===================================================== */}

      <mesh
        ref={innerPanel}
        position={[0, 1.3, 0.38]}
        material={innerMaterial}
      >
        <boxGeometry
          args={[0.78, 2.9, 0.035]}
        />
      </mesh>

      {/* =====================================================
          RECESSED FRAME
      ===================================================== */}

      <mesh
        position={[0, 1.3, 0.355]}
        material={darkerMetal}
      >
        <boxGeometry
          args={[0.84, 2.98, 0.025]}
        />
      </mesh>

      {/* =====================================================
          TOP
      ===================================================== */}

      <mesh
        ref={topCap}
        position={[0, 3.08, 0]}
        material={metal}
        castShadow
      >
        <boxGeometry
          args={[1.32, 0.14, 0.78]}
        />
      </mesh>

      {/* =====================================================
          BOTTOM
      ===================================================== */}

      <mesh
        ref={bottomCap}
        position={[0, -0.48, 0]}
        material={metal}
        castShadow
      >
        <boxGeometry
          args={[1.32, 0.14, 0.78]}
        />
      </mesh>

      {/* =====================================================
          NECK
      ===================================================== */}

      <mesh
        ref={neck}
        position={[0, -0.64, 0]}
        material={darkerMetal}
        castShadow
      >
        <cylinderGeometry
          args={[0.2, 0.2, 0.25, 64]}
        />
      </mesh>

      {/* =====================================================
          MAIN BASE
      ===================================================== */}

      <mesh
        ref={base}
        position={[0, -0.82, 0]}
        material={darkerMetal}
        castShadow
        receiveShadow
      >
        <cylinderGeometry
          args={[0.92, 1.04, 0.18, 96]}
        />
      </mesh>

      {/* =====================================================
          BASE RING
      ===================================================== */}

      <mesh
        ref={baseRing}
        position={[0, -0.93, 0]}
        material={metal}
      >
        <cylinderGeometry
          args={[0.71, 0.78, 0.055, 96]}
        />
      </mesh>

      {/* =====================================================
          INTERNAL LIGHT
      ===================================================== */}

      <pointLight
        ref={glowLight}
        position={[0, 1.25, 0.82]}
        intensity={0.9}
        distance={3.7}
        decay={2}
        color="#ffbd63"
      />

      <pointLight
        position={[0, 1.25, -0.25]}
        intensity={0.16}
        distance={2.4}
        decay={2}
        color="#fff0d0"
      />
    </group>
  );
}