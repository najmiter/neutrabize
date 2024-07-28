import gsap from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import getStarfield from './getStarfield.js';
import { getFresnelMat } from './getFresnelMat.js';

import './style.css';

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

animate();

gsap.to(camera.position, {
  z: 5,
  y: w / h,
  duration: 3,
  ease: 'power3.inOut',
  onUpdate: function () {
    camera.updateProjectionMatrix();
  },
});

//

////

window.onload = () => {
  const dateTime = document.getElementById('date-time') as HTMLDivElement;
  const date = document.getElementById('date') as HTMLDivElement;
  const time = document.getElementById('time') as HTMLDivElement;

  date.textContent = `${new Date().toLocaleString('en-us', { weekday: 'long', month: 'long', day: 'numeric' })}`;
  time.textContent = `${new Date().toLocaleString('en-us', { hour: 'numeric', minute: '2-digit', hour12: true }).split(' ')[0]}`;

  gsap.fromTo(
    dateTime,
    { y: h / 3, opacity: 0, scale: 0 },
    {
      y: window.innerHeight / 9,
      opacity: 1,
      scale: 1,
      duration: 2,
      delay: 1,
      ease: 'power3.inOut',
    }
  );

  // ////

  const shortcuts = document.getElementById('shortcuts') as HTMLDivElement;

  chrome.topSites.get((topSites) => {
    displayTopSites(topSites);
  });

  function displayTopSites(sites: Array<chrome.topSites.MostVisitedURL>) {
    shortcuts.innerHTML = '';
    sites.forEach((site) => {
      const link = createSiteElement(site);
      shortcuts.appendChild(link);
    });
  }

  function createSiteElement(site: chrome.topSites.MostVisitedURL) {
    const link = document.createElement('a');
    link.setAttribute('class', 'shortcut-item');
    link.href = site.url;

    link.innerHTML = `
        <li style="max-width: 24px">
            <img
                class="shortcut-icon"
                src=${yoChromeGiveMeSomeOfThatShit(site.url)}
                alt="favicon"
            />
        </li>
        <p
            class="shortcut-name"
        >
            ${site.title}
        </p>
    `;

    return link;
  }

  function yoChromeGiveMeSomeOfThatShit(u: string) {
    const url = new URL(chrome.runtime.getURL('/_favicon/'));
    url.searchParams.set('pageUrl', u);
    url.searchParams.set('size', '24');
    return url.toString();
  }

  gsap.fromTo(
    shortcuts,
    { y: h / 2, opacity: 0, scale: 0, x: '-50%' },
    {
      y: window.innerHeight / 1.2,
      x: '-50%',
      opacity: 1,
      scale: 1,
      duration: 2,
      delay: 1,
      ease: 'power3.inOut',
    }
  );

  window.onresize = () =>
    (shortcuts.style.transform = `translate(-50%, ${window.innerHeight / 1.2}px)`);
};
