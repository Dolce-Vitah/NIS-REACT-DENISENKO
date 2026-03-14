import { Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { DatasetRecord } from '../../entities/dataset/types';
import type { ThreeScatterWidgetConfig } from '../../entities/widget/types';
import { useFiltersStore } from '../../store/filtersStore';
import { useI18n } from '../../shared/i18n/useI18n';

const MAX_POINTS = 600;
const CHART_SCALE = 8;

type ScatterPoint = {
  x: number;
  y: number;
  z: number;
  rawX: number;
  rawY: number;
  rawZ: number;
  category: string;
};

function toNumber(value: DatasetRecord[string]): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const normalized = value.trim().replace(',', '.');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function normalize(value: number, min: number, max: number): number {
  if (max - min < Number.EPSILON) return 0;
  return ((value - min) / (max - min)) * CHART_SCALE - CHART_SCALE / 2;
}

export function ThreeScatterWidget({
  config,
  rows,
}: {
  config: ThreeScatterWidgetConfig;
  rows: DatasetRecord[];
}) {
  const { language } = useI18n();
  const ru = language === 'ru';
  const theme = useTheme();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [drillCategory, setDrillCategory] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [hovered, setHovered] = useState<{
    x: number;
    y: number;
    category: string;
    rawX: number;
    rawY: number;
    rawZ: number;
  } | null>(null);

  const filters = useFiltersStore((s) => s.filters);
  const toggleCategoryValueFilter = useFiltersStore((s) => s.toggleCategoryValueFilter);

  const activeValues = useMemo(() => {
    if (!config.categoryField) return [];
    const categoryFilter = filters.find((filter) => {
      return filter.type === 'category' && filter.field === config.categoryField;
    });
    return categoryFilter?.type === 'category' ? categoryFilter.values : [];
  }, [config.categoryField, filters]);

  const points = useMemo<ScatterPoint[]>(() => {
    const xField = config.xField;
    const yField = config.yField;
    const zField = config.zField;
    const categoryField = config.categoryField;
    if (!xField || !yField || !zField) return [];

    const raw = rows
      .map((row) => {
        const rawX = toNumber(row[xField]);
        const rawY = toNumber(row[yField]);
        const rawZ = toNumber(row[zField]);
        if (rawX === null || rawY === null || rawZ === null) return null;
        return {
          rawX,
          rawY,
          rawZ,
          category: categoryField ? String(row[categoryField] ?? 'N/A') : 'N/A',
        };
      })
      .filter((point): point is NonNullable<typeof point> => point !== null)
      .slice(0, MAX_POINTS);

    if (!raw.length) return [];

    const xs = raw.map((point) => point.rawX);
    const ys = raw.map((point) => point.rawY);
    const zs = raw.map((point) => point.rawZ);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const minZ = Math.min(...zs);
    const maxZ = Math.max(...zs);

    return raw.map((point) => ({
      rawX: point.rawX,
      rawY: point.rawY,
      rawZ: point.rawZ,
      category: point.category,
      x: normalize(point.rawX, minX, maxX),
      y: normalize(point.rawY, minY, maxY),
      z: normalize(point.rawZ, minZ, maxZ),
    }));
  }, [rows, config.categoryField, config.xField, config.yField, config.zField]);

  const activeDrillCategory = useMemo(() => {
    if (!drillCategory) return null;
    return points.some((point) => point.category === drillCategory) ? drillCategory : null;
  }, [drillCategory, points]);

  const visiblePoints = useMemo(() => {
    if (!activeDrillCategory) return points;
    return points.filter((point) => point.category === activeDrillCategory);
  }, [activeDrillCategory, points]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    mount.innerHTML = '';
    const computedStyle = window.getComputedStyle(mount);
    const palette = [
      computedStyle.getPropertyValue('--gpv2-chart-pie-1').trim(),
      computedStyle.getPropertyValue('--gpv2-chart-pie-2').trim(),
      computedStyle.getPropertyValue('--gpv2-chart-pie-3').trim(),
      computedStyle.getPropertyValue('--gpv2-chart-pie-4').trim(),
      computedStyle.getPropertyValue('--gpv2-chart-pie-5').trim(),
      computedStyle.getPropertyValue('--gpv2-chart-pie-6').trim(),
    ].filter(Boolean);

    const width = mount.clientWidth || 320;
    const height = 220;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(theme.palette.mode === 'dark' ? '#0f1720' : '#f8f9fd');
    scene.fog = new THREE.Fog(scene.background, 11, 24);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(8, 8, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 0, 0);

    const ambient = new THREE.AmbientLight(0xffffff, 0.72);
    const directional = new THREE.DirectionalLight(0xffffff, 0.82);
    directional.position.set(8, 16, 8);
    scene.add(ambient, directional);

    const axisGrid = new THREE.GridHelper(12, 12, 0x607d8b, 0x90a4ae);
    const axes = new THREE.AxesHelper(4.5);
    scene.add(axisGrid, axes);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(visiblePoints.length * 3);
    const colors = new Float32Array(visiblePoints.length * 3);
    const color = new THREE.Color();
    const hasCategoryFilter = activeValues.length > 0;

    const categoryColors = new Map<string, string>();
    visiblePoints.forEach((point, index) => {
      positions[index * 3] = point.x;
      positions[index * 3 + 1] = point.y;
      positions[index * 3 + 2] = point.z;

      const isSelected = !hasCategoryFilter || activeValues.includes(point.category);
      const baseColor =
        categoryColors.get(point.category) ??
        (() => {
          const next = palette.length
            ? palette[categoryColors.size % palette.length]
            : theme.palette.primary.main;
          categoryColors.set(point.category, next);
          return next;
        })();
      color.set(baseColor);
      if (!isSelected) color.multiplyScalar(0.45);
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
    });

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });

    const cloud = new THREE.Points(geometry, material);
    scene.add(cloud);

    const raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 0.26;
    const pointer = new THREE.Vector2();
    const hoveredPointRef = { current: null as ScatterPoint | null };

    const onPointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObject(cloud);
      const hit = intersects[0];
      if (!hit || hit.index === undefined) {
        hoveredPointRef.current = null;
        setHovered(null);
        return;
      }
      const point = visiblePoints[hit.index];
      if (!point) {
        hoveredPointRef.current = null;
        setHovered(null);
        return;
      }
      hoveredPointRef.current = point;
      setHovered({
        x: event.clientX - rect.left + 12,
        y: event.clientY - rect.top + 12,
        category: point.category,
        rawX: point.rawX,
        rawY: point.rawY,
        rawZ: point.rawZ,
      });
    };

    const onPointerLeave = () => {
      hoveredPointRef.current = null;
      setHovered(null);
    };

    const onClick = () => {
      const point = hoveredPointRef.current;
      if (!point || !config.categoryField) return;
      toggleCategoryValueFilter(config.categoryField, point.category);
      setDrillCategory((current) => (current === point.category ? null : point.category));
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerleave', onPointerLeave);
    renderer.domElement.addEventListener('click', onClick);

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
      if (autoRotate) {
        cloud.rotation.y += 0.003;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      renderer.domElement.removeEventListener('click', onClick);
      controls.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      mount.innerHTML = '';
    };
  }, [
    activeValues,
    config.categoryField,
    config.style?.chartPalette,
    theme.palette.mode,
    theme.palette.primary.main,
    visiblePoints,
    autoRotate,
    toggleCategoryValueFilter,
  ]);

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
          ? 'Нет доступных числовых точек для 3D scatter'
          : 'No numeric points available for 3D scatter'}
      </Typography>
    );
  }

  return (
    <Box
      sx={{ position: 'relative', width: '100%', height: 220, borderRadius: 1, overflow: 'hidden' }}
    >
      <Box ref={mountRef} sx={{ width: '100%', height: 220 }} />
      {activeDrillCategory && (
        <Button
          size="small"
          variant="outlined"
          onClick={() => setDrillCategory(null)}
          sx={{ position: 'absolute', left: 8, top: 8, zIndex: 2 }}
        >
          {ru ? 'Drilldown' : 'Drilldown'}: {activeDrillCategory} ({ru ? 'сброс' : 'reset'})
        </Button>
      )}
      <Button
        size="small"
        variant="outlined"
        onClick={() => setAutoRotate((prev) => !prev)}
        sx={{ position: 'absolute', right: 8, top: 8, zIndex: 2 }}
      >
        {autoRotate ? (ru ? 'Пауза вращения' : 'Pause spin') : ru ? 'Автовращение' : 'Auto spin'}
      </Button>
      {hovered && (
        <Box
          sx={{
            position: 'absolute',
            left: hovered.x,
            top: hovered.y,
            pointerEvents: 'none',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            px: 1,
            py: 0.5,
            fontSize: 12,
            boxShadow: 2,
          }}
        >
          {hovered.category}
          <br />
          X: {hovered.rawX.toFixed(2)} | Y: {hovered.rawY.toFixed(2)} | Z: {hovered.rawZ.toFixed(2)}
        </Box>
      )}
    </Box>
  );
}
