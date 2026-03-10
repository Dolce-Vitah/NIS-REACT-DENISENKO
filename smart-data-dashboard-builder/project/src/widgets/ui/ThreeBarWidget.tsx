import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { DatasetRecord } from '../../entities/dataset/types';
import type { ThreeWidgetConfig } from '../../entities/widget/types';
import { groupSum, hasNumericValues } from '../lib/chartData';
import { useFiltersStore } from '../../store/filtersStore';
import { useI18n } from '../../shared/i18n/useI18n';

const MAX_BARS = 24;
const EMPTY_SCALE = 0.0001;

export function ThreeBarWidget({
  config,
  rows,
}: {
  config: ThreeWidgetConfig;
  rows: DatasetRecord[];
}) {
  const { language } = useI18n();
  const ru = language === 'ru';
  const mountRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();
  const filters = useFiltersStore((s) => s.filters);
  const toggleCategoryValueFilter = useFiltersStore((s) => s.toggleCategoryValueFilter);
  const [hovered, setHovered] = useState<{
    x: number;
    y: number;
    label: string;
    value: number;
  } | null>(null);

  const chartData = useMemo(
    () =>
      groupSum(rows, config.categoryField, config.valueField)
        .sort((a, b) => b.value - a.value)
        .slice(0, MAX_BARS),
    [rows, config.categoryField, config.valueField]
  );
  const hasNumericValueField = useMemo(
    () => hasNumericValues(rows, config.valueField),
    [rows, config.valueField]
  );

  const activeValues = useMemo(() => {
    if (!config.categoryField) return [];
    const categoryFilter = filters.find((filter) => {
      return filter.type === 'category' && filter.field === config.categoryField;
    });
    return categoryFilter?.type === 'category' ? categoryFilter.values : [];
  }, [config.categoryField, filters]);

  const dataRef = useRef(chartData);
  const activeValuesRef = useRef(activeValues);
  const tooltipRef = useRef<(typeof chartData)[number] | null>(null);

  useEffect(() => {
    dataRef.current = chartData;
    activeValuesRef.current = activeValues;
  }, [chartData, activeValues]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    mount.innerHTML = '';
    const computedStyle = window.getComputedStyle(mount);
    const chartLine = computedStyle.getPropertyValue('--gpv2-chart-line').trim();
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
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const matrix = new THREE.Matrix4();
    const scale = new THREE.Vector3(1, 1, 1);
    const quaternion = new THREE.Quaternion();
    const color = new THREE.Color();
    let visibleInViewport = true;
    let documentVisible = !document.hidden;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(theme.palette.mode === 'dark' ? '#0f1720' : '#f8f9fd');
    scene.fog = new THREE.Fog(scene.background, 14, 28);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(8, 8, 11);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 6;
    controls.maxDistance = 24;
    controls.target.set(0, 1.5, 0);

    const ambient = new THREE.AmbientLight(
      theme.palette.mode === 'dark' ? 0x8fa3bf : 0xffffff,
      0.72
    );
    scene.add(ambient);

    const dir = new THREE.DirectionalLight(
      theme.palette.mode === 'dark' ? 0xd0e2ff : 0xffffff,
      0.95
    );
    dir.position.set(8, 16, 8);
    scene.add(dir);

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(36, 12),
      new THREE.MeshStandardMaterial({
        color: theme.palette.mode === 'dark' ? 0x182638 : 0xeef1fb,
        roughness: 0.92,
        metalness: 0.03,
        side: THREE.DoubleSide,
      })
    );
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);

    const grid = new THREE.GridHelper(26, 26, 0x607d8b, 0x90a4ae);
    grid.position.y = 0.01;
    scene.add(grid);

    const geometry = new THREE.BoxGeometry(0.75, 1, 0.75);
    const material = new THREE.MeshStandardMaterial({
      color: chartLine || theme.palette.primary.main,
    });
    const bars = new THREE.InstancedMesh(geometry, material, MAX_BARS);
    bars.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    bars.castShadow = false;
    bars.receiveShadow = false;
    scene.add(bars);

    const currentHeights = new Array<number>(MAX_BARS).fill(EMPTY_SCALE);
    const targetHeights = new Array<number>(MAX_BARS).fill(EMPTY_SCALE);
    const labels = new Array<string>(MAX_BARS).fill('');
    const values = new Array<number>(MAX_BARS).fill(0);

    const updateTargets = () => {
      const data = dataRef.current;
      const max = Math.max(...data.map((item) => item.value), 1);
      for (let i = 0; i < MAX_BARS; i++) {
        const point = data[i];
        if (!point) {
          targetHeights[i] = EMPTY_SCALE;
          labels[i] = '';
          values[i] = 0;
          continue;
        }
        targetHeights[i] = Math.max((point.value / max) * 8, 0.2);
        labels[i] = point.label;
        values[i] = point.value;
      }
    };
    updateTargets();

    const applyInstances = () => {
      const selectedValues = activeValuesRef.current;
      for (let i = 0; i < MAX_BARS; i++) {
        currentHeights[i] = THREE.MathUtils.lerp(currentHeights[i], targetHeights[i], 0.14);
        const h = currentHeights[i];
        const x = i - MAX_BARS / 2 + 0.5;
        scale.set(1, h, 1);
        matrix.compose(new THREE.Vector3(x, h / 2, 0), quaternion, scale);
        bars.setMatrixAt(i, matrix);

        const isActive = selectedValues.length === 0 || selectedValues.includes(labels[i]);
        const baseColor = palette.length ? palette[i % palette.length] : chartLine || '#667eea';
        color.set(baseColor);
        if (!isActive) color.multiplyScalar(0.45);
        bars.setColorAt(i, color);
      }
      bars.instanceMatrix.needsUpdate = true;
      if (bars.instanceColor) bars.instanceColor.needsUpdate = true;
    };
    applyInstances();

    const onPointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const intersections = raycaster.intersectObject(bars);
      const first = intersections[0];
      if (!first || first.instanceId === undefined) {
        tooltipRef.current = null;
        setHovered(null);
        return;
      }
      const idx = first.instanceId;
      if (!labels[idx]) {
        tooltipRef.current = null;
        setHovered(null);
        return;
      }
      tooltipRef.current = { label: labels[idx], value: values[idx] } as (typeof chartData)[number];
      setHovered({
        x: event.clientX - rect.left + 12,
        y: event.clientY - rect.top + 12,
        label: labels[idx],
        value: values[idx],
      });
    };

    const onPointerLeave = () => {
      tooltipRef.current = null;
      setHovered(null);
    };

    const onClick = () => {
      const current = tooltipRef.current;
      if (!current || !config.categoryField) return;
      toggleCategoryValueFilter(config.categoryField, current.label);
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

    const viewportObserver = new IntersectionObserver((entries) => {
      visibleInViewport = entries[0]?.isIntersecting ?? true;
    });
    viewportObserver.observe(mount);

    const onVisibilityChange = () => {
      documentVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!visibleInViewport || !documentVisible) return;
      controls.update();
      updateTargets();
      applyInstances();
      bars.rotation.y += 0.0012;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      viewportObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      renderer.domElement.removeEventListener('click', onClick);
      controls.dispose();
      geometry.dispose();
      material.dispose();
      plane.geometry.dispose();
      (plane.material as THREE.Material).dispose();
      renderer.dispose();
      mount.innerHTML = '';
    };
  }, [
    theme.palette.mode,
    theme.palette.primary.main,
    config.categoryField,
    config.style?.chartPalette,
    toggleCategoryValueFilter,
  ]);

  if (!config.categoryField || !config.valueField) {
    return (
      <Typography color="text.secondary">
        {ru ? 'Выберите поля категории/значения' : 'Select category/value fields'}
      </Typography>
    );
  }
  if (!hasNumericValueField) {
    return (
      <Typography color="text.secondary">
        {ru
          ? 'Выбранное поле значения не содержит числовых значений'
          : 'Selected value field has no numeric values'}
      </Typography>
    );
  }

  const hasData = chartData.length > 0;
  if (!hasData)
    return (
      <Typography color="text.secondary">
        {ru ? 'Нет данных для 3D-графика' : 'No data for 3D chart'}
      </Typography>
    );

  return (
    <Box
      sx={{ position: 'relative', width: '100%', height: 220, borderRadius: 1, overflow: 'hidden' }}
    >
      <Box ref={mountRef} sx={{ width: '100%', height: 220 }} />
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
          {hovered.label}: {hovered.value.toFixed(2)}
        </Box>
      )}
    </Box>
  );
}
