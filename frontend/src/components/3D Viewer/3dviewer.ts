import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeJsComponent = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  const controls = useRef(null);
  const model = useRef();

  useEffect(() => {
    // Set up scene
    renderer.setSize(500, 500);
    renderer.setClearColor(0x000000, 0);
    document.body.appendChild(renderer.domElement);

    // Set up camera position
    camera.position.z = 10;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Color, Intensity
    scene.add(ambientLight);

    // Add point light
    const pointLight = new THREE.PointLight(0xffffff, 1); // Color, Intensity
    pointLight.position.set(-5, -5, 10); // X, Y, Z
    scene.add(pointLight);

    controls.current = new OrbitControls(camera, renderer.domElement);

    const loader = new GLTFLoader();
    loader.load(
      '/model/scene.gltf', // Update with the path to your GLTF model
      (gltf) => {
        model.current = gltf.scene;
        scene.add(gltf.scene);

        // Center the model
        const boundingBox = new THREE.Box3().setFromObject(gltf.scene);
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        model.current.position.sub(center);

        // Set camera position to point directly at the center of the model
        camera.position.copy(center);
        camera.position.z += boundingBox.max.z; // Adjust the distance as needed

        controls.current.target.set(center.x, center.y, center.z);
        controls.current.update();
      },
      undefined,
      (error) => {
        console.error('Error loading 3D model:', error);
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Update controls
      if (controls.current) {
        controls.current.update();
      }

      // Render the scene
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      renderer.setSize(500, 500);
    };

    window.addEventListener('resize', handleResize);

    // Clean up on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null; // This component doesn't render anything directly
};

export default ThreeJsComponent;
