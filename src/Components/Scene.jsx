import React, {
  useState,
  useEffect,
  Suspense,
  useRef,
  useCallback,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Html, Line } from "@react-three/drei";
import {
  Raycaster,
  Vector2,
  Vector3,
  CircleGeometry,
  MeshBasicMaterial,
  Mesh,
} from "three";
import Loader from "./Loader";

const Model = () => {
  const { scene, camera } = useThree();
  const [clickedPoint, setClickedPoint] = useState(null);
  const [poi, setPoi] = useState(null);
  const [selectedMeshName, setSelectedMeshName] = useState(null);
  const [circleMesh, setCircleMesh] = useState(null); // State to hold the circle mesh
  const gltf = useGLTF("/future-robot-transformed.glb");
  const group = useRef();
  const raycaster = new Raycaster();
  const mouse = new Vector2();

  const onClick = useCallback(
    (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(
        group.current.children,
        true
      );
      if (intersects.length > 0) {
        setSelectedMeshName(intersects[0].object.name);
        const newpoi = new Vector3();
        intersects[0].object.getWorldPosition(newpoi);
        newpoi.x += 1;
        setPoi(newpoi);
        setClickedPoint(intersects[0].point);

        // Remove the previous circle mesh if it exists
        if (circleMesh) {
          group.current.remove(circleMesh);
        }

        // Create a new circle mesh
        const circleGeometry = new CircleGeometry(0.05, 32);
        const circleMaterial = new MeshBasicMaterial({ color: 0xff0000 });
        const newCircleMesh = new Mesh(circleGeometry, circleMaterial);
        newCircleMesh.position.copy(
          intersects[0].point.add(new Vector3(0, 0, 0.1))
        );
        group.current.add(newCircleMesh);
        setCircleMesh(newCircleMesh);
      }
    },
    [camera, scene, circleMesh]
  );

  return (
    <group position={[0, 0, 0]} ref={group}>
      {clickedPoint && poi && (
        <Line
          points={[clickedPoint, poi]}
          color="black"
          lineWidth={2}
          position={[0, 0, 0.2]}
        />
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
