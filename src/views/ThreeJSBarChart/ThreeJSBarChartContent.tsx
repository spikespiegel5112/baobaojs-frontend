import React, { useCallback, useEffect, useRef, useState } from "react";

import * as THREE from "three";
import tinycolor from "tinycolor2";
import { Text } from "troika-three-text";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import "./ThreeJSBarChart.scss";
import hdrUrl from "@/assets/spruit_sunrise_1k.hdr?url";

interface ChartDataItem {
  value: number;
  percentage: number;
}

interface ChartData {
  dispersedAirportPassengerCount: ChartDataItem;
  dispersedBusinessDistrictPassengerCount: ChartDataItem;
  dispersedEhailingPassengerCount: ChartDataItem;
  dispersedMetroPassengerCount: ChartDataItem;
  dispersedOthersPassengerCount: ChartDataItem;
  dispersedParkingPassengerCount: ChartDataItem;
  dispersedTaxiPassengerCount: ChartDataItem;
}

interface Props {
  text?: string;

  // 五分钟时间标识发生变化时，触发数据刷新
  refreshKey?: string | number;

  // 获取项目静态资源地址
  getAssetUrl: (path: string) => string;

  className?: string;
}

const chartConfig = [
  {
    label: "机场方向",
    color: "#F75C5C",
    key: "dispersedAirportPassengerCount",
  },
  {
    label: "商务区方向",
    color: "#FF7F50",
    key: "dispersedBusinessDistrictPassengerCount",
  },
  {
    label: "网约车",
    color: "#FFF44F",
    key: "dispersedEhailingPassengerCount",
  },
  {
    label: "地铁",
    color: "#51b369",
    key: "dispersedMetroPassengerCount",
  },
  {
    label: "其他",
    color: "#00E5EE",
    key: "dispersedOthersPassengerCount",
  },
  {
    label: "停车库",
    color: "#5bb5f8",
    key: "dispersedParkingPassengerCount",
  },
  {
    label: "出租车",
    color: "#D8BFD8",
    key: "dispersedTaxiPassengerCount",
  },
];

const initialChartData = (): ChartData =>
  Object.fromEntries(
    chartConfig.map((item) => [item.key, { value: 0, percentage: 0 }]),
  ) as ChartData;

const disposeGroupChildren = (group: THREE.Group) => {
  while (group.children.length > 0) {
    const child = group.children[0];

    child.traverse((object) => {
      const disposable = object as THREE.Object3D & { dispose?: () => void };
      disposable.dispose?.();

      const mesh = object as THREE.Mesh;
      mesh.geometry?.dispose();

      if (mesh.material) {
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((material) => material.dispose());
      }
    });

    group.remove(child);
  }
};

const ThreeJSBarChartContent: React.FC<Props> = ({ refreshKey, getAssetUrl, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const chartGroupRef = useRef<THREE.Group | null>(null);
  const labelGroupRef = useRef<THREE.Group | null>(null);
  const animationIdRef = useRef<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData>(initialChartData);
  const [sceneReady, setSceneReady] = useState(false);

  // 保存最新的请求函数和资源地址函数

  // ==========================================
  // 1. Three.js 场景初始化
  // ==========================================

  useEffect(() => {
    const mount = mountRef.current;
    const container = containerRef.current;

    if (!mount || !container) return;

    const chartWidth = container.clientWidth;
    const chartHeight = container.clientHeight;

    if (chartWidth <= 0 || chartHeight <= 0) {
      console.warn("Three.js 容器尺寸无效");
      return;
    }

    // 创建场景
    const scene = new THREE.Scene();
    scene.background = null;

    sceneRef.current = scene;

    // 创建相机
    const camera = new THREE.PerspectiveCamera(75, chartWidth / chartHeight, 0.1, 1000);

    const distance = 11;
    const angle = Math.PI / 0.5;

    camera.position.set(0, Math.sin(angle) * distance, Math.cos(angle) * distance);

    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.setSize(chartWidth, chartHeight);

    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 创建轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);

    controls.minPolarAngle = Math.PI / 5;
    controls.maxPolarAngle = Math.PI / 5;

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    controlsRef.current = controls;

    // 创建图表分组
    const chartGroup = new THREE.Group();
    scene.add(chartGroup);
    chartGroupRef.current = chartGroup;

    // 标签独立于图表组，避免继承饼图旋转
    const labelGroup = new THREE.Group();
    scene.add(labelGroup);
    labelGroupRef.current = labelGroup;

    // 环境光
    const ambientLight = new THREE.AmbientLight(0xdddddd, 3.5);

    scene.add(ambientLight);

    // 点光源
    const pointLight = new THREE.PointLight(0xffffff, 8);

    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // HDR 环境贴图
    const pmremGenerator = new THREE.PMREMGenerator(renderer);

    pmremGenerator.compileEquirectangularShader();

    const hdrLoader = new RGBELoader();

    hdrLoader.load(
      hdrUrl,
      (hdrTexture) => {
        if (!sceneRef.current) {
          hdrTexture.dispose();
          pmremGenerator.dispose();
          return;
        }

        const envMap = pmremGenerator.fromEquirectangular(hdrTexture).texture;

        scene.environment = envMap;

        hdrTexture.dispose();
        pmremGenerator.dispose();
        setSceneReady(true);
      },
      undefined,
      (error) => {
        console.error("HDR 加载失败:", error);
        pmremGenerator.dispose();
      },
    );

    // 当前组件没有定义实际的悬停交互，因此不注册空的鼠标事件。

    // ==========================================
    // 3. 自适应容器尺寸
    // ==========================================

    const resizeObserver = new ResizeObserver(() => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    });

    resizeObserver.observe(container);

    // ==========================================
    // 4. 动画渲染循环
    // ==========================================

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      controls.update();

      // 只旋转图表本身，不旋转场景中的灯光和标签容器
      chartGroup.rotation.y += 0.00008;

      scene.updateMatrixWorld(true);

      // 更新引出线和圆点的透明度
      chartGroup.children.forEach((slice) => {
        const sphere = slice.children.find((child) => child.userData.isSphere) as
          THREE.Mesh | undefined;

        const line = slice.children.find((child) => child.userData.isLabelLine) as
          THREE.Line | undefined;

        if (sphere && line) {
          const worldPosition = new THREE.Vector3();

          sphere.getWorldPosition(worldPosition);

          const distance = camera.position.distanceTo(worldPosition);

          const normalizedDistance = THREE.MathUtils.clamp(distance - 6, 0, 1);

          const opacity = 1 - normalizedDistance;

          (line.material as THREE.LineBasicMaterial).opacity = opacity;

          (sphere.material as THREE.Material).opacity = opacity;
        }
      });

      // 标签跟随扇区移动，但始终正对相机并保持屏幕水平
      chartGroup.children.forEach((slice) => {
        const label = slice.userData.label as Text | undefined;
        const localPosition = slice.userData.labelLocalPosition as THREE.Vector3 | undefined;

        if (!label || !localPosition) return;

        const worldPosition = chartGroup.localToWorld(localPosition.clone());
        label.position.copy(worldPosition);
        label.quaternion.copy(camera.quaternion);
      });

      renderer.render(scene, camera);
    };

    animate();

    // ==========================================
    // 5. 组件销毁
    // ==========================================

    return () => {
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }

      resizeObserver.disconnect();

      controls.dispose();

      // 释放整个场景中的几何体和材质
      scene.traverse((object) => {
        const disposable = object as THREE.Object3D & { dispose?: () => void };
        disposable.dispose?.();

        const mesh = object as THREE.Mesh;

        if (mesh.geometry) {
          mesh.geometry.dispose();
        }

        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

          materials.forEach((material) => {
            material.dispose();
          });
        }
      });

      // 清理场景
      scene.clear();

      renderer.dispose();
      renderer.forceContextLoss();

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }

      pmremGenerator.dispose();

      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      controlsRef.current = null;
      chartGroupRef.current = null;
      labelGroupRef.current = null;
    };
  }, [getAssetUrl]);

  // ==========================================
  // 6. 创建三维文字标签
  // ==========================================

  const createLabel = useCallback((labelText: string, position: THREE.Vector3, color: string) => {
    const textMesh = new Text();

    textMesh.text = labelText;
    textMesh.fontSize = 0.4;
    textMesh.color = color;
    textMesh.position.copy(position);

    textMesh.anchorX = "center";
    textMesh.anchorY = "middle";

    textMesh.outlineWidth = 0.01;
    textMesh.outlineColor = "#666";

    // 强制在所有普通场景物体之后渲染
    textMesh.renderOrder = 999;

    textMesh.sync(() => {
      const materials = Array.isArray(textMesh.material) ? textMesh.material : [textMesh.material];

      materials.forEach((material) => {
        material.depthTest = false;
        material.depthWrite = false;
        material.needsUpdate = true;
      });
    });

    textMesh.sync();

    return textMesh;
  }, []);

  // ==========================================
  // 7. 创建扇区引出线
  // ==========================================

  const createLabelLine = useCallback(
    (angle: number, radius: number, height: number, color: string) => {
      const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 1,
      });

      const bendDistance = 0.1;
      const bendDistance2 = 0.5;
      const shrinkFactor = 0.9;

      const points = [
        new THREE.Vector3(
          Math.cos(angle) * radius * shrinkFactor,
          height / 2,
          Math.sin(angle) * radius * shrinkFactor,
        ),
        new THREE.Vector3(
          Math.cos(angle) * (radius + bendDistance),
          height * 2.2,
          Math.sin(angle) * (radius + bendDistance),
        ),
        new THREE.Vector3(
          Math.cos(angle) * (radius + bendDistance2),
          height * 2.2,
          Math.sin(angle) * (radius + bendDistance2),
        ),
      ];

      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const line = new THREE.Line(geometry, material);

      line.userData.isLabelLine = true;

      const sphereGeometry = new THREE.SphereGeometry(0.05, 8, 8);

      const sphereMaterial = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 1,
      });

      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

      sphere.userData.isSphere = true;
      sphere.position.copy(points[2]);

      return { line, sphere };
    },
    [],
  );

  // ==========================================
  // 8. 创建三维饼图扇区
  // ==========================================

  const createPieSlice = useCallback(
    (
      startAngle: number,
      endAngle: number,
      outerRadius: number,
      innerRadius: number,
      height: number,
      color: string,
    ) => {
      const shape = new THREE.Shape();

      shape.moveTo(Math.cos(startAngle) * outerRadius, Math.sin(startAngle) * outerRadius);

      shape.absarc(0, 0, outerRadius, startAngle, endAngle, false);

      shape.lineTo(Math.cos(endAngle) * innerRadius, Math.sin(endAngle) * innerRadius);

      shape.absarc(0, 0, innerRadius, endAngle, startAngle, true);

      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: height,
        bevelEnabled: false,
      });

      geometry.rotateX(Math.PI / 2);

      const topMaterial = new THREE.MeshPhongMaterial({
        color,
        shininess: 100,
        specular: 0xffffff,
        side: THREE.DoubleSide,
      });

      const sideMaterial = new THREE.MeshLambertMaterial({
        color: tinycolor(color).darken(10).toString(),
      });

      const mesh = new THREE.Mesh(geometry, [topMaterial, sideMaterial]);

      mesh.position.y += 0.5;

      return mesh;
    },
    [],
  );

  // ==========================================
  // 9. 根据数据构建三维模型
  // ==========================================

  useEffect(() => {
    if (!sceneReady) return;

    const scene = sceneRef.current;
    const chartGroup = chartGroupRef.current;
    const labelGroup = labelGroupRef.current;

    if (!scene || !chartGroup || !labelGroup) return;

    disposeGroupChildren(chartGroup);
    disposeGroupChildren(labelGroup);

    const data = chartConfig.map((item) => ({
      ...item,
      value: chartData[item.key as keyof ChartData].percentage,
    }));

    const total = data.reduce((sum, item) => sum + Number(item.value), 0);

    if (!total) return;

    let startAngle = 0;

    const radiusOffset = 1;
    const outerRadius = 2.5;
    const innerRadius = 1.2;
    const height = 1;

    data.forEach((item) => {
      const angle = (Number(item.value) / total) * Math.PI * 2;

      const midAngle = startAngle + angle / 2;

      const slice = createPieSlice(
        startAngle,
        startAngle + angle,
        outerRadius + radiusOffset,
        innerRadius + radiusOffset / 2,
        height,
        item.color,
      );

      // 创建引出线
      const { line, sphere } = createLabelLine(midAngle, outerRadius, height, "#fff");

      slice.add(line);
      slice.add(sphere);

      // 创建文字标签
      const textPosition = new THREE.Vector3(
        Math.cos(midAngle) * 3.5,
        height * 2 + 2,
        Math.sin(midAngle) * 3.5,
      );

      const label = createLabel(`${item.label}\n${item.value}%`, textPosition, "#ffffff");

      // 标签不作为 slice 子对象，避免继承扇区旋转
      labelGroup.add(label);

      slice.userData.label = label;
      slice.userData.labelLocalPosition = textPosition.clone();
      slice.userData.color = item.color;

      slice.position.y += 1.8;

      chartGroup.add(slice);
      // 创建饼图之后
      chartGroup.renderOrder = 1;

      // 创建文字之后
      labelGroup.renderOrder = 999;

      startAngle += angle;
    });

    return () => {
      disposeGroupChildren(chartGroup);
      disposeGroupChildren(labelGroup);
    };
  }, [sceneReady, chartData, createPieSlice, createLabel, createLabelLine]);

  // ==========================================
  // 10. 数据转换
  // ==========================================

  const transformData = useCallback((responseData: Record<string, number>): ChartData => {
    const result = initialChartData();

    let total = 0;

    chartConfig.forEach((item) => {
      const value = Math.abs(Number(responseData[item.key] ?? 0));

      result[item.key as keyof ChartData] = {
        value,
        percentage: 0,
      };

      total += value;
    });

    chartConfig.forEach((item) => {
      const chartItem = result[item.key as keyof ChartData];

      chartItem.percentage = total ? Number(((chartItem.value / total) * 100).toFixed(2)) : 0;
    });

    return result;
  }, []);

  // ==========================================
  // 11. 获取实时客流数据
  // ==========================================

  // 初次加载及 refreshKey 变化时刷新
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const data = {
          dispersedAirportPassengerCount: 20,
          dispersedBusinessDistrictPassengerCount: 20,
          dispersedEhailingPassengerCount: 20,
          dispersedMetroPassengerCount: 20,
          dispersedOthersPassengerCount: 20,
          dispersedParkingPassengerCount: 20,
          dispersedTaxiPassengerCount: 20,
        };
        const response = {
          data,
        };
        if (cancelled) return;

        setChartData(transformData(response.data));
      } catch (error) {
        if (!cancelled) {
          console.error("客流数据获取失败:", error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [refreshKey, transformData]);

  // ==========================================
  // 12. JSX
  // ==========================================

  return (
    <div className="passenger-flow-block">
      {loading && (
        <div className="common_loading_wrapper">
          <div className="loading-spinner" />
        </div>
      )}

      <div
        ref={containerRef}
        className={`ThreeJSBarChartContent ${className}`}
      >
        <div ref={mountRef} />
      </div>
    </div>
  );
};

export default ThreeJSBarChartContent;
