import React, { useState, useEffect, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  Sparkles,
  OrbitControls,
  Html,
  Line,
} from "@react-three/drei";
import { useRef, useCallback } from "react";
import { Raycaster, Vector2, Vector3 } from "three";
import Loader from "./Loader";

const Model = () => {
  const { scene, camera } = useThree();
  const [clickedPoint, setClickedPoint] = useState(null);
  const [poi, setPoi] = useState(null);
  const [selectedMeshName, setSelectedMeshName] = useState(null);
  const gltf = useGLTF("/future-robot-transformed.glb");
  const group = useRef();
  const raycaster = new Raycaster();
  const mouse = new Vector2();
  const onClick = useCallback(
    (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      console.log("outside if", mouse);
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(
        group.current.children,
        true
      );
      if (intersects.length > 0) {
        setSelectedMeshName(intersects[0].object.name);
        const newpoi = new Vector3();
        console.log("intersects", intersects[0].object);
        intersects[0].object.getWorldPosition(newpoi);
        console.log("newpoi", newpoi);
        newpoi.x += 1;
        setPoi(newpoi);
        const intersection = intersects[0];
        console.log("intersection", intersection.point);
        setClickedPoint(intersection.point);
      }
    },
    [camera, scene]
  );

  return (
    <group position={[0, 0, 0]}>
      {clickedPoint && poi && (
        <Line points={[clickedPoint, poi]} color="black" lineWidth={2} />
      )}
      {poi && (
        <Html position={poi}>
          <div className="bg-gray-200 border-2 border-black px-8 py-4 rounded-xl">
            <p>{selectedMeshName}</p>
          </div>
        </Html>
      )}
      <group
        ref={group}
        position={[0, -2, 0]}
        onClick={(e) => {
          onClick(e);
        }}
      >
        <primitive object={gltf.scene} scale={4} />
      </group>
    </group>
  );
};

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
