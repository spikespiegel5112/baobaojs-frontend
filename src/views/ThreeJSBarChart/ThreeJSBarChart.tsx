import React from "react";

import ThreeJSBarChartContent from "./ThreeJSBarChartContent";

export default function ThreeJSBarChart() {
  return (
    <div
      style={{
        transform: "translateZ(30px)",
        transformStyle: "preserve-3d",
        filter: "drop-shadow(0 25px 20px rgba(0,0,0,0.2))",
      }}
    >
      <ThreeJSBarChartContent text="客流空域分布" />
    </div>
  );
}
