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
  return THREE.MathUtils.lerp(
    start,
    end,
    value
  );
}

export default function Lamp({
  progress,
}: LampProps) {
  const root = useRef<THREE.Group>(null);

  const shellLeft =
    useRef<THREE.Mesh>(null);

  const shellRight =
    useRef<THREE.Mesh>(null);

  const innerPanel =
    useRef<THREE.Mesh>(null);

  const topCap =
    useRef<THREE.Mesh>(null);

  const bottomCap =
    useRef<THREE.Mesh>(null);

  const neck =
    useRef<THREE.Mesh>(null);

  const base =
    useRef<THREE.Mesh>(null);

  const baseRing =
    useRef<THREE.Mesh>(null);

  const glowLight =
    useRef<THREE.PointLight>(null);

  const { camera } = useThree();

  const drag = useRef({
    active: false,
    x: 0,
    rotation: 0,
  });

  const warmColor = useMemo(
    () => new THREE.Color("#ffbd63"),
    []
  );

  const neutralColor = useMemo(
    () => new THREE.Color("#fff2d6"),
    []
  );

  const coolColor = useMemo(
    () => new THREE.Color("#dce9ff"),
    []
  );

  const finalWarmColor = useMemo(
    () => new THREE.Color("#ffca78"),
    []
  );

  const targetColor = useMemo(
    () => new THREE.Color(),
    []
  );

  const metal = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#a8b29d",
        metalness: 0.88,
        roughness: 0.24,
        clearcoat: 0.75,
        clearcoatRoughness: 0.18,
      }),
    []
  );

  const darkMetal = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#68725f",
        metalness: 0.92,
        roughness: 0.22,
        clearcoat: 0.65,
        clearcoatRoughness: 0.18,
      }),
    []
  );

  const lightMetal = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#c4ccb9",
        metalness: 0.9,
        roughness: 0.2,
        clearcoat: 0.8,
        clearcoatRoughness: 0.15,
      }),
    []
  );

  const lightMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#fff4de",
        emissive: "#ffb34d",
        emissiveIntensity: 0.72,
        roughness: 0.28,
      }),
    []
  );

  const innerDarkMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#34382f",
        roughness: 0.34,
        metalness: 0.35,
      }),
    []
  );

  useFrame((_, delta) => {
    if (!root.current) return;

    const p = progress.get();

    /*
     * SCROLL ROTATION
     */

    let scrollRotation = 0;

    if (p < 0.12) {
      const t = smooth(
        range(p, 0, 0.12)
      );

      scrollRotation = lerp(
        t,
        -0.08,
        0.16
      );
    } else if (p < 0.28) {
      const t = smooth(
        range(p, 0.12, 0.28)
      );

      scrollRotation = lerp(
        t,
        0.16,
        Math.PI * 0.48
      );
    } else if (p < 0.4) {
      const t = smooth(
        range(p, 0.28, 0.4)
      );

      scrollRotation = lerp(
        t,
        Math.PI * 0.48,
        Math.PI * 0.75
      );
    } else if (p < 0.58) {
      const t = smooth(
        range(p, 0.4, 0.58)
      );

      scrollRotation = lerp(
        t,
        Math.PI * 0.75,
        Math.PI * 2.35
      );
    } else if (p < 0.73) {
      const t = smooth(
        range(p, 0.58, 0.73)
      );

      scrollRotation = lerp(
        t,
        Math.PI * 2.35,
        Math.PI * 2.55
      );
    } else if (p < 0.87) {
      const t = smooth(
        range(p, 0.73, 0.87)
      );

      scrollRotation = lerp(
        t,
        Math.PI * 2.55,
        Math.PI * 3.18
      );
    } else {
      const t = smooth(
        range(p, 0.87, 1)
      );

      scrollRotation = lerp(
        t,
        Math.PI * 3.18,
        Math.PI * 3.72
      );
    }

    /*
     * MANUAL ROTATION
     */

    const manualRotation =
      drag.current.rotation;

    const targetRotation =
      scrollRotation + manualRotation;

    if (!drag.current.active) {
      drag.current.rotation =
        THREE.MathUtils.damp(
          drag.current.rotation,
          0,
          1.5,
          delta
        );
    }

    root.current.rotation.y =
      THREE.MathUtils.damp(
        root.current.rotation.y,
        targetRotation,
        4,
        delta
      );

    /*
     * CAMERA
     */

    let targetX = 0;
    let targetY = 0.72;
    let targetZ = 6;

    if (p < 0.18) {
      const t = smooth(
        range(p, 0, 0.18)
      );

      targetX = lerp(t, 0, -0.35);
      targetY = lerp(t, 0.72, 0.82);
      targetZ = lerp(t, 6.4, 5.7);
    } else if (p < 0.38) {
      const t = smooth(
        range(p, 0.18, 0.38)
      );

      targetX = lerp(t, -0.35, 0.5);
      targetY = lerp(t, 0.82, 0.65);
      targetZ = lerp(t, 5.7, 5.25);
    } else if (p < 0.58) {
      const t = smooth(
        range(p, 0.38, 0.58)
      );

      targetX = lerp(t, 0.5, -0.65);
      targetY = lerp(t, 0.65, 1.05);
      targetZ = lerp(t, 5.25, 4.7);
    } else if (p < 0.75) {
      const t = smooth(
        range(p, 0.58, 0.75)
      );

      targetX = lerp(t, -0.65, 0.2);
      targetY = lerp(t, 1.05, 0.7);
      targetZ = lerp(t, 4.7, 5.9);
    } else {
      const t = smooth(
        range(p, 0.75, 1)
      );

      targetX = lerp(t, 0.2, 0);
      targetY = lerp(t, 0.7, 0.72);
      targetZ = lerp(t, 5.9, 6.2);
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

    /*
     * EXPLODED VIEW
     */

    const breakIn = smooth(
      range(p, 0.415, 0.5)
    );

    const breakOut = smooth(
      range(p, 0.5, 0.585)
    );

    const separation =
      breakIn * (1 - breakOut);

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
    }

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
    }

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

    if (topCap.current) {
      topCap.current.position.y =
        THREE.MathUtils.damp(
          topCap.current.position.y,
          3.08 +
            separation * 0.72,
          5,
          delta
        );
    }

    if (bottomCap.current) {
      bottomCap.current.position.y =
        THREE.MathUtils.damp(
          bottomCap.current.position.y,
          -0.48 -
            separation * 0.72,
          5,
          delta
        );
    }

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
    }

    if (baseRing.current) {
      baseRing.current.position.y =
        THREE.MathUtils.damp(
          baseRing.current.position.y,
          -0.74 -
            separation * 0.12,
          5,
          delta
        );
    }

    /*
     * LIGHT ATMOSPHERE
     */

    let intensity = 0.82;

    if (p < 0.27) {
      targetColor.copy(warmColor);
      intensity = 0.82;
    }

    if (p >= 0.27 && p < 0.38) {
      const t = smooth(
        range(p, 0.27, 0.38)
      );

      targetColor.lerpColors(
        warmColor,
        neutralColor,
        t
      );

      intensity = lerp(
        t,
        0.82,
        0.64
      );
    }

    if (p >= 0.38 && p < 0.45) {
      const t = smooth(
        range(p, 0.38, 0.45)
      );

      targetColor.lerpColors(
        neutralColor,
        coolColor,
        t
      );

      intensity = lerp(
        t,
        0.64,
        0.4
      );
    }

    if (p >= 0.45 && p < 0.59) {
      targetColor.copy(coolColor);
      intensity = 0.4;
    }

    if (p >= 0.59 && p < 0.75) {
      const t = smooth(
        range(p, 0.59, 0.75)
      );

      targetColor.lerpColors(
        coolColor,
        warmColor,
        t
      );

      intensity = lerp(
        t,
        0.4,
        0.82
      );
    }

    if (p >= 0.75) {
      targetColor.copy(finalWarmColor);
      intensity = 0.84;
    }

    if (glowLight.current) {
      glowLight.current.color.lerp(
        targetColor,
        1 - Math.exp(-4 * delta)
      );

      glowLight.current.intensity =
        THREE.MathUtils.damp(
          glowLight.current.intensity,
          intensity,
          4,
          delta
        );
    }

    /*
     * FLOATING
     */

    const time =
      performance.now();

    const floating =
      Math.sin(
        time * 0.00055
      ) * 0.018;

    root.current.position.y =
      THREE.MathUtils.damp(
        root.current.position.y,
        -0.25 + floating,
        3,
        delta
      );
  });

  const handlePointerDown = (
    event: any
  ) => {
    event.stopPropagation();

    drag.current.active = true;
    drag.current.x =
      event.clientX;
  };

  const handlePointerMove = (
    event: any
  ) => {
    if (!drag.current.active) return;

    const movement =
      event.clientX -
      drag.current.x;

    drag.current.rotation +=
      movement * 0.009;

    drag.current.x =
      event.clientX;
  };

  const handlePointerUp = () => {
    drag.current.active = false;
  };

  return (
    <group
      ref={root}
      position={[0, -0.55, 0]}
      scale={0.68}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerOut={handlePointerUp}
    >
      <mesh
        ref={shellLeft}
        position={[-0.31, 1.3, 0]}
        material={metal}
        castShadow
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
      >
        <boxGeometry
          args={[0.62, 3.5, 0.72]}
        />
      </mesh>

      <mesh
        position={[0, 1.3, 0.355]}
        material={innerDarkMaterial}
      >
        <boxGeometry
          args={[0.84, 2.98, 0.025]}
        />
      </mesh>

      <mesh
        ref={innerPanel}
        position={[0, 1.3, 0.38]}
        material={lightMaterial}
      >
        <boxGeometry
          args={[0.78, 2.9, 0.035]}
        />
      </mesh>

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

      <mesh
        ref={neck}
        position={[0, -0.64, 0]}
        material={lightMetal}
      >
        <cylinderGeometry
          args={[0.2, 0.2, 0.25, 64]}
        />
      </mesh>

      <mesh
        ref={base}
        position={[0, -0.68, 0]}
        material={darkMetal}
        castShadow
      >
        <cylinderGeometry
          args={[0.5, 0.56, 0.055, 96]}
        />
      </mesh>

      <mesh
        ref={baseRing}
        position={[0, -0.74, 0]}
        material={metal}
      >
        <cylinderGeometry
          args={[0.4, 0.45, 0.025, 96]}
        />
      </mesh>

      <pointLight
        ref={glowLight}
        position={[0, 1.25, 0.82]}
        intensity={0.82}
        distance={3.7}
        decay={2}
        color="#ffbd63"
      />

      <pointLight
        position={[0, 1.25, -0.25]}
        intensity={0.12}
        distance={2.4}
        decay={2}
        color="#fff0d0"
      />
    </group>
  );
}
