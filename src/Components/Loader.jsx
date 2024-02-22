import React from "react";
import { Html, useProgress } from "@react-three/drei";

export default function Loader() {
  const { progress } = useProgress();
  return (
    <Html
      className="absolute helvetica top-0 left-0 bg-white !z-[10] w-screen h-screen flex items-center justify-center"
      center
    >
      <span className="text-black text-2xl"> {progress}% loaded</span>
    </Html>
  );
}
