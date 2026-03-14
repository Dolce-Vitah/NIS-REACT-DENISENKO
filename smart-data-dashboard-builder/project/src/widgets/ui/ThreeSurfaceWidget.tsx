import { Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { DatasetRecord } from '../../entities/dataset/types';
import type { ThreeSurfaceWidgetConfig } from '../../entities/widget/types';
import { useI18n } from '../../shared/i18n/useI18n';

const GRID_SIZE = 24;
const SURFACE_SIZE = 10;
const SURFACE_HEIGHT = 3.8;

type SurfacePoint = {
  x: number;
  y: number;
  z: number;
};

function toNumber(value: DatasetRecord[string]): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function normalizeIndex(value: number, min: number, max: number, size: number): number {
  if (Math.abs(max - min) < Number.EPSILON) return Math.floor((size - 1) / 2);
  const ratio = (value - min) / (max - min);
  const raw = Math.floor(ratio * (size - 1));
  return Math.max(0, Math.min(size - 1, raw));
}

export function ThreeSurfaceWidget({
  config,
  rows,
}: {
  config: ThreeSurfaceWidgetConfig;
  rows: DatasetRecord[];
}) {
  const { language } = useI18n();
  const ru = language === 'ru';
  const theme = useTheme();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [wireframe, setWireframe] = useState(false);

  const points = useMemo<SurfacePoint[]>(() => {
    const xField = config.xField;
    const yField = config.yField;
    const zField = config.zField;
    if (!xField || !yField || !zField) return [];
    return rows
      .map((row) => {
        const x = toNumber(row[xField]);
        const y = toNumber(row[yField]);
        const z = toNumber(row[zField]);
        if (x === null || y === null || z === null) return null;
        return { x, y, z };
      })
      .filter((item): item is SurfacePoint => item !== null);
  }, [rows, config.xField, config.yField, config.zField]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    mount.innerHTML = '';
    const computedStyle = window.getComputedStyle(mount);
    const chartLine = computedStyle.getPropertyValue('--gpv2-chart-line').trim();

    const width = mount.clientWidth || 320;
    const height = 220;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(theme.palette.mode === 'dark' ? '#0f1720' : '#f8f9fd');
    scene.fog = new THREE.Fog(scene.background, 12, 24);

    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 1000);
    camera.position.set(8, 7, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 5;
    controls.maxDistance = 24;
    controls.target.set(0, 0.5, 0);

    const ambient = new THREE.AmbientLight(
      theme.palette.mode === 'dark' ? 0x8fa3bf : 0xffffff,
      0.6
    );
    const key = new THREE.DirectionalLight(
      theme.palette.mode === 'dark' ? 0xd0e2ff : 0xffffff,
      0.9
    );
    key.position.set(9, 14, 6);
    const fill = new THREE.PointLight(theme.palette.mode === 'dark' ? 0x74b9ff : 0x90caf9, 0.5, 20);
    fill.position.set(-8, 5, -6);
    scene.add(ambient, key, fill);

    const grid = new THREE.GridHelper(12, 18, 0x607d8b, 0x90a4ae);
    scene.add(grid);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 12),
      new THREE.MeshStandardMaterial({
        color: theme.palette.mode === 'dark' ? 0x152233 : 0xf2f4fd,
        roughness: 0.95,
        metalness: 0.02,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.02;
    scene.add(floor);

    const geometry = new THREE.PlaneGeometry(
      SURFACE_SIZE,
      SURFACE_SIZE,
      GRID_SIZE - 1,
      GRID_SIZE - 1
    );
    geometry.rotateX(-Math.PI / 2);

    const material = new THREE.MeshStandardMaterial({
      color: chartLine || (theme.palette.mode === 'dark' ? 0x43a5ff : 0x1976d2),
      roughness: 0.44,
      metalness: 0.12,
      side: THREE.DoubleSide,
      wireframe,
    });
    const surface = new THREE.Mesh(geometry, material);
    surface.position.y = 0.02;
    scene.add(surface);

    const positions = geometry.attributes.position as THREE.BufferAttribute;
    const cells = Array.from({ length: GRID_SIZE * GRID_SIZE }, () => ({
      sum: 0,
      count: 0,
    }));

    if (points.length) {
      const xs = points.map((p) => p.x);
      const ys = points.map((p) => p.y);
      const zs = points.map((p) => p.z);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const minZ = Math.min(...zs);
      const maxZ = Math.max(...zs);
      const zSpan = Math.max(maxZ - minZ, Number.EPSILON);

      for (const point of points) {
        const ix = normalizeIndex(point.x, minX, maxX, GRID_SIZE);
        const iy = normalizeIndex(point.y, minY, maxY, GRID_SIZE);
        const idx = iy * GRID_SIZE + ix;
        const normalizedZ = (point.z - minZ) / zSpan;
        cells[idx].sum += normalizedZ;
        cells[idx].count += 1;
      }

      for (let idx = 0; idx < GRID_SIZE * GRID_SIZE; idx++) {
        const { sum, count } = cells[idx];
        const smoothed = count > 0 ? sum / count : 0;
        const heightValue = smoothed * SURFACE_HEIGHT;
        positions.setY(idx, heightValue);
      }

      geometry.computeVertexNormals();
    }

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const hoverPoint = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffc107 })
    );
    hoverPoint.visible = false;
    scene.add(hoverPoint);

    const onPointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObject(surface)[0];
      if (!hit) {
        hoverPoint.visible = false;
        return;
      }
      hoverPoint.visible = true;
      hoverPoint.position.copy(hit.point);
    };

    const onPointerLeave = () => {
      hoverPoint.visible = false;
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerleave', onPointerLeave);

    const resizeObserver = new ResizeObserver(() => {
      const w = mount.clientWidth || 320;
      const h = mount.clientHeight || 220;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(mount);

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      controls.dispose();
      hoverPoint.geometry.dispose();
      (hoverPoint.material as THREE.Material).dispose();
      geometry.dispose();
      material.dispose();
      floor.geometry.dispose();
      (floor.material as THREE.Material).dispose();
      renderer.dispose();
      mount.innerHTML = '';
    };
  }, [points, theme.palette.mode, wireframe, config.style?.chartPalette]);

  if (!config.xField || !config.yField || !config.zField) {
    return (
      <Typography color="text.secondary">
        {ru ? 'Выберите числовые поля X, Y и Z' : 'Select X, Y and Z numeric fields'}
      </Typography>
    );
  }

  if (!points.length) {
    return (
      <Typography color="text.secondary">
        {ru
          ? 'Нет доступных числовых точек для 3D surface'
          : 'No numeric points available for 3D surface'}
      </Typography>
    );
  }

  return (
    <Box
      sx={{ position: 'relative', width: '100%', height: 220, borderRadius: 1, overflow: 'hidden' }}
    >
      <Box ref={mountRef} sx={{ width: '100%', height: 220 }} />
      <Button
        size="small"
        variant="outlined"
        onClick={() => setWireframe((prev) => !prev)}
        sx={{ position: 'absolute', left: 8, top: 8, zIndex: 2 }}
      >
        {wireframe ? (ru ? 'Сплошная' : 'Solid') : ru ? 'Каркас' : 'Wireframe'}
      </Button>
    </Box>
  );
}
