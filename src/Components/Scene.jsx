import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  Suspense,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Html, Line, Stage } from "@react-three/drei";
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
  const { camera } = useThree();
  const [clickedPoint, setClickedPoint] = useState(null);
  const [poi, setPoi] = useState(null);
  const [selectedMeshName, setSelectedMeshName] = useState(null);
  const [circleMesh, setCircleMesh] = useState(null); // State to hold the circle mesh
  const gltf = useGLTF("/future-robot-transformed.glb");
  const group = useRef();
  const raycaster = new Raycaster();
  const mouse = new Vector2();
  const circleMeshRef = useRef(null);

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
        //check if more on left or right of screen
        if (event.clientX / window.innerWidth > 0.5) {
          newpoi.x += 0.5;
        } else {
          newpoi.x -= 0.5;
        }
        setPoi(newpoi);
        setClickedPoint(intersects[0].point);

        if (!circleMeshRef.current) {
          // Create a new circle mesh if it doesn't exist
          const circleGeometry = new CircleGeometry(0.01, 32);
          const circleMaterial = new MeshBasicMaterial({ color: 0xff0000 });
          const newCircleMesh = new Mesh(circleGeometry, circleMaterial);
          group.current.add(newCircleMesh);
          setCircleMesh(newCircleMesh); // Update the state with the new circle mesh
          circleMeshRef.current = newCircleMesh;
        }

        // Update the position of the circle mesh
        circleMeshRef.current.position.copy(
          intersects[0].point.add(new Vector3(0, 0, 0.02))
        );
      }
    },
    [camera]
  );

  return (
    <group position={[0, 0, 0]} ref={group}>
      {clickedPoint && poi && (
        <Line
          points={[clickedPoint, poi]}
          color="black"
          lineWidth={2}
          position={[0, 0, 0]}
        />
      )}
      {poi && (
        <Html position={poi}>
          <div className="bg-gray-200 border-2 border-black px-8 py-4 rounded-xl">
            <p>{selectedMeshName}</p>
          </div>
        </Html>
      )}
      <Stage adjustCamera intensity={0.5} shadows="contact" environment="city">
        <group
          position={[0, -2, 0]}
          onClick={(e) => {
            onClick(e);
          }}
        >
          <primitive object={gltf.scene} />
        </group>
      </Stage>
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
