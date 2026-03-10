import { Box, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { DatasetRecord } from '../../entities/dataset/types';
import type { ThreeWidgetConfig } from '../../entities/widget/types';
import { groupSum } from '../lib/chartData';

export function ThreeBarWidget({
  config,
  rows,
}: {
  config: ThreeWidgetConfig;
  rows: DatasetRecord[];
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const data = groupSum(rows, config.categoryField, config.valueField).slice(0, 12);
    if (!data.length) return;

    const width = mount.clientWidth || 320;
    const height = 220;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f8f9fd');

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(10, 10, 12);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(10, 20, 10);
    scene.add(dir);

    const max = Math.max(...data.map((d) => d.value), 1);
    const bars: THREE.Mesh[] = [];
    const barMaterial = new THREE.MeshStandardMaterial({ color: 0x1976d2 });

    data.forEach((d, i) => {
      const h = Math.max((d.value / max) * 8, 0.2);
      const geom = new THREE.BoxGeometry(0.8, h, 0.8);
      const mesh = new THREE.Mesh(geom, barMaterial.clone());
      mesh.position.set(i - data.length / 2, h / 2, 0);
      (mesh.material as THREE.MeshStandardMaterial).color.setHSL((i / data.length) * 0.6, 0.7, 0.5);
      bars.push(mesh);
      scene.add(mesh);
    });

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 10),
      new THREE.MeshBasicMaterial({ color: 0xeef1fb, side: THREE.DoubleSide })
    );
    plane.rotation.x = Math.PI / 2;
    plane.position.y = 0;
    scene.add(plane);

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      scene.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth || 320;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);

      bars.forEach((b) => {
        b.geometry.dispose();
        (b.material as THREE.Material).dispose();
      });

      plane.geometry.dispose();
      (plane.material as THREE.Material).dispose();

      renderer.dispose();
      mount.innerHTML = '';
    };
  }, [rows, config.categoryField, config.valueField]);

  if (!config.categoryField || !config.valueField) {
    return <Typography color="text.secondary">Select category/value fields</Typography>;
  }

  const hasData = groupSum(rows, config.categoryField, config.valueField).length > 0;
  if (!hasData) return <Typography color="text.secondary">No data for 3D chart</Typography>;

  return <Box ref={mountRef} sx={{ width: '100%', height: 220, borderRadius: 1, overflow: 'hidden' }} />;
}