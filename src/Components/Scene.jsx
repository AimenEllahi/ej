import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  Suspense,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import Loader from "./Loader";
import Model from "./Model";

export default function Scene() {
  return (
    <div className="relative h-screen w-screen">
      <Canvas shadows>
        <ambientLight intensity={3} color={"#3F2305"} />
        <Suspense fallback={<Loader />}>
          <Environment preset="studio" />

          <Model />
        </Suspense>
      </Canvas>
    </div>
  );
}
