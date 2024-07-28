import gsap from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import getStarfield from './getStarfield.js';
import { getFresnelMat } from './getFresnelMat.js';

import './style.css';
import { setDateTime } from './setDateTime.js';
import { getShortcuts } from './getShortcuts.js';
import { setWelcomeText } from './setWelcomeText.js';

const w = window.innerWidth;
const h = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 200);
camera.position.z = 100;
camera.position.y = -50;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);

document.body.appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

const earthGroup = new THREE.Group();
earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
scene.add(earthGroup);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enableDamping = true;
controls.dampingFactor = 0.25;

const detail = 15;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);

const material = new THREE.MeshPhongMaterial({
  map: loader.load('./textures/00_earthmap1k.jpg'),
  specularMap: loader.load('./textures/02_earthspec1k.jpg'),
  bumpMap: loader.load('./textures/01_earthbump1k.jpg'),
  bumpScale: 0.04,
});

const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load('./textures/03_earthlights1k.jpg'),
  blending: THREE.AdditiveBlending,
});

const lightsMesh = new THREE.Mesh(geometry, lightsMat);
earthGroup.add(lightsMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load('./textures/04_earthcloudmap.jpg'),
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  alphaMap: loader.load('./textures/05_earthcloudmaptrans.jpg'),
});

const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);

const stars = getStarfield({ numStars: 2000 });
scene.add(stars);

const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
const now = new Date();
const day = now.getHours() > 6 && now.getHours() < 18;
sunLight.position.set(day ? -1 : -35, day ? 0.5 : -30, day ? 1.5 : -35);
scene.add(sunLight);

const moonMaterial = new THREE.MeshPhongMaterial({
  map: loader.load('./textures/moonmap1k.jpg'),
  bumpMap: loader.load('./textures/moonbump1k.jpg'),
  bumpScale: 0.04,
});

const moonMesh = new THREE.Mesh(geometry, moonMaterial);
moonMesh.position.x = day ? -20 : 10;
moonMesh.position.z = day ? -30 : -10;
moonMesh.position.y = day ? -20 : -5;

scene.add(moonMesh);

let by = 1;
function animate() {
  requestAnimationFrame(animate);

  earthMesh.rotation.y += 0.0002;
  lightsMesh.rotation.y += 0.0002;
  cloudsMesh.rotation.y += 0.0002;
  moonMesh.rotation.y += 0.0002;

  if (moonMesh.position.x >= 50) by = -1;
  if (moonMesh.position.x <= -50) by = 1;

  moonMesh.position.x += by * 0.0002;

  renderer.render(scene, camera);
  controls.update();
}

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);

gsap.to(camera.position, {
  z: 5,
  y: w / h,
  duration: 3,
  ease: 'power3.inOut',
  onUpdate: function () {
    camera.updateProjectionMatrix();
  },
});

window.onload = () => {
  setDateTime();
  getShortcuts();
};

animate();
setWelcomeText();
