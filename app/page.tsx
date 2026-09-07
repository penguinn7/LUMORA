
"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { MotionValue } from "motion/react";
import * as THREE from "three";
import { useMemo, useRef } from "react";

type LampProps = {
  progress: MotionValue<number>;
};

/* =========================================================
   HELPERS
   ========================================================= */

function clamp01(value: number) {
  return THREE.MathUtils.clamp(value, 0, 1);
}

function smooth(value: number) {
  const x = clamp01(value);
  return x * x * (3 - 2 * x);
}

function range(value: number, start: number, end: number) {
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
  return THREE.MathUtils.lerp(
    start,
    end,
    value
  );
}

/* =========================================================
   LAMP
   ========================================================= */

export default function Lamp({
  progress,
}: LampProps) {
  /* =======================================================
     REFS
     ======================================================= */

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

  const { camera } = useThree();

  /* =======================================================
     COLORS
     ======================================================= */

  const warmColor = useMemo(
    () => new THREE.Color("#FFBD63"),
    []
  );

  const neutralColor = useMemo(
    () => new THREE.Color("#FFF2D6"),
    []
  );

  const coolColor = useMemo(
    () => new THREE.Color("#DCE9FF"),
    []
  );

  const finalWarmColor = useMemo(
    () => new THREE.Color("#FFCA78"),
    []
  );

  /* =======================================================
     MATERIALS

     MAIN BODY
     Light sage / olive metallic.
     ======================================================= */

  const metal = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#A8B29D",

        metalness: 0.88,
        roughness: 0.24,

        clearcoat: 0.75,
        clearcoatRoughness: 0.18,
      }),
    []
  );

  /* =======================================================
     DARKER STRUCTURAL METAL
     ======================================================= */

  const darkMetal = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#68725F",

        metalness: 0.92,
        roughness: 0.22,

        clearcoat: 0.65,
        clearcoatRoughness: 0.18,
      }),
    []
  );

  /* =======================================================
     LIGHT METALLIC ACCENT
     ======================================================= */

  const lightMetal = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#C4CCB9",

        metalness: 0.9,
        roughness: 0.2,

        clearcoat: 0.8,
        clearcoatRoughness: 0.15,
      }),
    []
  );

  /* =======================================================
     LIGHT PANEL

     Slightly creamy rather than aggressively orange.
     ======================================================= */

  const lightMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#FFF4DE",

        emissive: "#FFB34D",
        emissiveIntensity: 0.72,

        roughness: 0.28,
      }),
    []
  );

  /* =======================================================
     INNER DARK FRAME
     ======================================================= */

  const innerDarkMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#34382F",

        roughness: 0.34,
        metalness: 0.35,
      }),
    []
  );

  /* =========================================================
     FRAME LOOP
     ========================================================= */

  useFrame((_, delta) => {
    if (!root.current) return;

    const p = progress.get();

    /* =====================================================
       CINEMATIC ROTATION
       ===================================================== */

    let targetRotation = 0;

    if (p < 0.12) {
      const t = smooth(
        range(p, 0, 0.12)
      );

      targetRotation = lerp(
        t,
        -0.08,
        0.16
      );
    } else if (p < 0.28) {
      const t = smooth(
        range(p, 0.12, 0.28)
      );

      targetRotation = lerp(
        t,
        0.16,
        Math.PI * 0.48
      );
    } else if (p < 0.40) {
      const t = smooth(
        range(p, 0.28, 0.40)
      );

      targetRotation = lerp(
        t,
        Math.PI * 0.48,
        Math.PI * 0.75
      );
    } else if (p < 0.58) {
      const t = smooth(
        range(p, 0.40, 0.58)
      );

      targetRotation = lerp(
        t,
        Math.PI * 0.75,
        Math.PI * 2.35
      );
    } else if (p < 0.73) {
      const t = smooth(
        range(p, 0.58, 0.73)
      );

      targetRotation = lerp(
        t,
        Math.PI * 2.35,
        Math.PI * 2.55
      );
    } else if (p < 0.87) {
      const t = smooth(
        range(p, 0.73, 0.87)
      );

      targetRotation = lerp(
        t,
        Math.PI * 2.55,
        Math.PI * 3.18
      );
    } else {
      const t = smooth(
        range(p, 0.87, 1)
      );

      targetRotation = lerp(
        t,
        Math.PI * 3.18,
        Math.PI * 3.72
      );
    }

    root.current.rotation.y =
      THREE.MathUtils.damp(
        root.current.rotation.y,
        targetRotation,
        3,
        delta
      );

    /* =====================================================
       CAMERA
       ===================================================== */

    let targetX = 0;
    let targetY = 0.72;
    let targetZ = 6;

    if (p < 0.12) {
      const t = smooth(
        range(p, 0, 0.12)
      );

      targetX = lerp(t, 0, 0.1);
      targetY = lerp(t, 0.72, 0.8);
      targetZ = lerp(t, 6.4, 5.9);
    } else if (p < 0.28) {
      const t = smooth(
        range(p, 0.12, 0.28)
      );

      targetX = lerp(t, 0.1, -0.65);
      targetY = lerp(t, 0.8, 0.95);
      targetZ = lerp(t, 5.9, 5.15);
    } else if (p < 0.40) {
      const t = smooth(
        range(p, 0.28, 0.40)
      );

      targetX = lerp(t, -0.65, 0.5);
      targetY = lerp(t, 0.95, 0.58);
      targetZ = lerp(t, 5.15, 5.75);
    } else if (p < 0.58) {
      const t = smooth(
        range(p, 0.40, 0.58)
      );

      targetX = lerp(t, 0.5, -0.9);
      targetY = lerp(t, 0.58, 1.15);
      targetZ = lerp(t, 5.75, 4.55);
    } else if (p < 0.73) {
      const t = smooth(
        range(p, 0.58, 0.73)
      );

      targetX = lerp(t, -0.9, 0.3);
      targetY = lerp(t, 1.15, 0.68);
      targetZ = lerp(t, 4.55, 6.25);
    } else if (p < 0.87) {
      const t = smooth(
        range(p, 0.73, 0.87)
      );

      targetX = lerp(t, 0.3, -0.42);
      targetY = lerp(t, 0.68, 0.82);
      targetZ = lerp(t, 6.25, 5.15);
    } else {
      const t = smooth(
        range(p, 0.87, 1)
      );

      targetX = lerp(t, -0.42, 0);
      targetY = lerp(t, 0.82, 0.72);
      targetZ = lerp(t, 5.15, 6.2);
    }

    camera.position.x =
      THREE.MathUtils.damp(
        camera.position.x,
        targetX,
        2.4,
        delta
      );

    camera.position.y =
      THREE.MathUtils.damp(
        camera.position.y,
        targetY,
        2.4,
        delta
      );

    camera.position.z =
      THREE.MathUtils.damp(
        camera.position.z,
        targetZ,
        2.4,
        delta
      );

    camera.lookAt(
      0,
      1.05,
      0
    );

    /* =====================================================
       DECONSTRUCTION
       ===================================================== */

    const breakIn = smooth(
      range(p, 0.415, 0.50)
    );

    const breakOut = smooth(
      range(p, 0.50, 0.585)
    );

    const separation =
      breakIn *
      (1 - breakOut);

    /* LEFT SHELL */

    if (shellLeft.current) {
      shellLeft.current.position.x =
        THREE.MathUtils.damp(
          shellLeft.current.position.x,
          -0.31 -
            separation * 1.35,
          5,
          delta
        );

      shellLeft.current.position.y =
        THREE.MathUtils.damp(
          shellLeft.current.position.y,
          1.3 +
            separation * 0.3,
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

    /* RIGHT SHELL */

    if (shellRight.current) {
      shellRight.current.position.x =
        THREE.MathUtils.damp(
          shellRight.current.position.x,
          0.31 +
            separation * 1.35,
          5,
          delta
        );

      shellRight.current.position.y =
        THREE.MathUtils.damp(
          shellRight.current.position.y,
          1.3 -
            separation * 0.3,
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

    /* INNER PANEL */

    if (innerPanel.current) {
      innerPanel.current.position.z =
        THREE.MathUtils.damp(
          innerPanel.current.position.z,
          0.38 +
            separation * 1.5,
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

    /* TOP CAP */

    if (topCap.current) {
      topCap.current.position.y =
        THREE.MathUtils.damp(
          topCap.current.position.y,
          3.08 +
            separation * 0.72,
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

    /* BOTTOM CAP */

    if (bottomCap.current) {
      bottomCap.current.position.y =
        THREE.MathUtils.damp(
          bottomCap.current.position.y,
          -0.48 -
            separation * 0.72,
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

    /* =====================================================
       FLOATING BASE
       ===================================================== */

    if (neck.current) {
      neck.current.position.y =
        THREE.MathUtils.damp(
          neck.current.position.y,
          -0.64 -
            separation * 0.12,
          5,
          delta
        );
    }

    if (base.current) {
      base.current.position.y =
        THREE.MathUtils.damp(
          base.current.position.y,
          -0.68 -
            separation * 0.08,
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

    /* =====================================================
       LIGHT TEMPERATURE
       ===================================================== */

    const targetColor =
      new THREE.Color();

    let targetIntensity = 0.82;

    if (p < 0.27) {
      targetColor.copy(
        warmColor
      );

      targetIntensity = 0.82;
    }

    if (
      p >= 0.27 &&
      p < 0.38
    ) {
      const t = smooth(
        range(p, 0.27, 0.38)
      );

      targetColor.lerpColors(
        warmColor,
        neutralColor,
        t
      );

      targetIntensity = lerp(
        t,
        0.82,
        0.64
      );
    }

    if (
      p >= 0.38 &&
      p < 0.45
    ) {
      const t = smooth(
        range(p, 0.38, 0.45)
      );

      targetColor.lerpColors(
        neutralColor,
        coolColor,
        t
      );

      targetIntensity = lerp(
        t,
        0.64,
        0.4
      );
    }

    if (
      p >= 0.45 &&
      p < 0.59
    ) {
      targetColor.copy(
        coolColor
      );

      targetIntensity = 0.4;
    }

    if (
      p >= 0.59 &&
      p < 0.75
    ) {
      const t = smooth(
        range(p, 0.59, 0.75)
      );

      targetColor.lerpColors(
        coolColor,
        warmColor,
        t
      );

      targetIntensity = lerp(
        t,
        0.4,
        0.82
      );
    }

    if (p >= 0.75) {
      targetColor.copy(
        finalWarmColor
      );

      targetIntensity = 0.84;
    }

    if (glowLight.current) {
      glowLight.current.color.lerp(
        targetColor,
        1 -
          Math.exp(
            -4 * delta
          )
      );

      glowLight.current.intensity =
        THREE.MathUtils.damp(
          glowLight.current.intensity,
          targetIntensity,
          4,
          delta
        );
    }

    /* =====================================================
       FLOAT
       ===================================================== */

    const time =
      performance.now();

    const float =
      Math.sin(
        time * 0.00055
      ) * 0.018;

    const secondaryFloat =
      Math.sin(
        time * 0.00031
      ) * 0.006;

    root.current.position.y =
      THREE.MathUtils.damp(
        root.current.position.y,
        -0.25 +
          float +
          secondaryFloat,
        3,
        delta
      );

    /* =====================================================
       CINEMATIC TILT
       ===================================================== */

    let targetTilt = 0;

    if (
      p > 0.14 &&
      p < 0.28
    ) {
      targetTilt = 0.025;
    }

    if (
      p > 0.415 &&
      p < 0.585
    ) {
      targetTilt = -0.055;
    }

    if (
      p > 0.73 &&
      p < 0.87
    ) {
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

  /* =========================================================
     MODEL
     ========================================================= */

  return (
    <group
      ref={root}
      position={[
        0,
        -0.55,
        0,
      ]}
      scale={0.68}
    >
      {/* ===================================================
          LEFT SHELL
          =================================================== */}

      <mesh
        ref={shellLeft}
        position={[
          -0.31,
          1.3,
          0,
        ]}
        material={metal}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[
            0.62,
            3.5,
            0.72,
          ]}
        />
      </mesh>

      {/* ===================================================
          RIGHT SHELL
          =================================================== */}

      <mesh
        ref={shellRight}
        position={[
          0.31,
          1.3,
          0,
        ]}
        material={metal}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[
            0.62,
            3.5,
            0.72,
          ]}
        />
      </mesh>

      {/* ===================================================
          DARK INNER FRAME
          =================================================== */}

      <mesh
        position={[
          0,
          1.3,
          0.355,
        ]}
        material={
          innerDarkMaterial
        }
      >
        <boxGeometry
          args={[
            0.84,
            2.98,
            0.025,
          ]}
        />
      </mesh>

      {/* ===================================================
          LIGHT PANEL
          =================================================== */}

      <mesh
        ref={innerPanel}
        position={[
          0,
          1.3,
          0.38,
        ]}
        material={
          lightMaterial
        }
      >
        <boxGeometry
          args={[
            0.78,
            2.9,
            0.035,
          ]}
        />
      </mesh>

      {/* ===================================================
          TOP CAP
          =================================================== */}

      <mesh
        ref={topCap}
        position={[
          0,
          3.08,
          0,
        ]}
        material={metal}
        castShadow
      >
        <boxGeometry
          args={[
            1.32,
            0.14,
            0.78,
          ]}
        />
      </mesh>

      {/* ===================================================
          BOTTOM CAP
          =================================================== */}

      <mesh
        ref={bottomCap}
        position={[
          0,
          -0.48,
          0,
        ]}
        material={metal}
        castShadow
      >
        <boxGeometry
          args={[
            1.32,
            0.14,
            0.78,
          ]}
        />
      </mesh>

      {/* ===================================================
          NECK
          =================================================== */}

      <mesh
        ref={neck}
        position={[
          0,
          -0.64,
          0,
        ]}
        material={
          lightMetal
        }
        castShadow
      >
        <cylinderGeometry
          args={[
            0.2,
            0.2,
            0.25,
            64,
          ]}
        />
      </mesh>

      {/* ===================================================
          BASE
          =================================================== */}

      <mesh
        ref={base}
        position={[
          0,
          -0.68,
          0,
        ]}
        material={
          darkMetal
        }
        castShadow
        receiveShadow
      >
        <cylinderGeometry
          args={[
            0.5,
            0.56,
            0.055,
            96,
          ]}
        />
      </mesh>

      {/* ===================================================
          BASE RING
          =================================================== */}

      <mesh
        ref={baseRing}
        position={[
          0,
          -0.74,
          0,
        ]}
        material={metal}
      >
        <cylinderGeometry
          args={[
            0.4,
            0.45,
            0.025,
            96,
          ]}
        />
      </mesh>

      {/* ===================================================
          PRIMARY GLOW
          =================================================== */}

      <pointLight
        ref={glowLight}
        position={[
          0,
          1.25,
          0.82,
        ]}
        intensity={0.82}
        distance={3.7}
        decay={2}
        color="#FFBD63"
      />

      {/* ===================================================
          SECONDARY FILL
          =================================================== */}

      <pointLight
        position={[
          0,
          1.25,
          -0.25,
        ]}
        intensity={0.12}
        distance={2.4}
        decay={2}
        color="#FFF0D0"
      />
    </group>
  );
}
