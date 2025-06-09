import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/PointerLockControls.js';

let camera, scene, renderer, controls;
let listener, sound1, sound2, sound3;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
const velocity = new THREE.Vector3();

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // Add fog for atmosphere
  scene.fog = new THREE.FogExp2(0x000000, 0.07);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  listener = new THREE.AudioListener();
  camera.add(listener);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new PointerLockControls(camera, document.body);

  const startBtn = document.getElementById('startBtn');
  startBtn.addEventListener('click', () => {
    controls.lock();
    startBtn.style.display = 'none';
  });

  controls.addEventListener('lock', () => {
    console.log('Pointer locked');
  });
  controls.addEventListener('unlock', () => {
    console.log('Pointer unlocked');
    startBtn.style.display = 'block';
  });

  // Create the creepy hallway
  createHallway();

  // Sounds
  const audioLoader = new THREE.AudioLoader();

  sound1 = new THREE.PositionalAudio(listener);
  audioLoader.load('sounds/footsteps.wav', (buffer) => {
    sound1.setBuffer(buffer);
    sound1.setRefDistance(5);
    sound1.setLoop(true);
    sound1.play();
  });

  sound2 = new THREE.PositionalAudio(listener);
  audioLoader.load('sounds/whispers.wav', (buffer) => {
    sound2.setBuffer(buffer);
    sound2.setRefDistance(5);
    sound2.setLoop(true);
    sound2.play();
  });

  sound3 = new THREE.PositionalAudio(listener);
  audioLoader.load('sounds/door-creak.mp3', (buffer) => {
    sound3.setBuffer(buffer);
    sound3.setRefDistance(5);
    sound3.setLoop(true);
    sound3.play();
  });

  // Boxes representing sound sources in the hallway
  const box1 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );
  box1.position.set(-3, 0.5, -15);
  box1.add(sound1);
  scene.add(box1);

  const box2 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshStandardMaterial({ color: 0x00ff00 })
  );
  box2.position.set(3, 0.5, -18);
  box2.add(sound2);
  scene.add(box2);

  const box3 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshStandardMaterial({ color: 0x0000ff })
  );
  box3.position.set(0, 0.5, -25);
  box3.add(sound3);
  scene.add(box3);

  // Movement keys
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  window.addEventListener('resize', onWindowResize);
}

function createHallway() {
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
  const wallGeometry = new THREE.BoxGeometry(1, 4, 20);

  // Left wall
  const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
  leftWall.position.set(-5, 2, -10);
  scene.add(leftWall);

  // Right wall
  const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
  rightWall.position.set(5, 2, -10);
  scene.add(rightWall);

  // Ceiling
  const ceilingGeometry = new THREE.BoxGeometry(10, 1, 20);
  const ceiling = new THREE.Mesh(ceilingGeometry, wallMaterial);
  ceiling.position.set(0, 4.5, -10);
  scene.add(ceiling);

  // Floor (darker)
  const floorGeometry = new THREE.BoxGeometry(10, 0.5, 20);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 1 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.set(0, 0, -10);
  scene.add(floor);

  // Flickering light near the end of the hallway
  const flickerLight = new THREE.PointLight(0xff6600, 1, 10);
  flickerLight.position.set(0, 3, -25);
  scene.add(flickerLight);

  // Flicker effect
  let flickerOn = true;
  setInterval(() => {
    flickerOn = !flickerOn;
    flickerLight.intensity = flickerOn ? 1 : 0.2;
  }, 300);
}

function onKeyDown(event) {
  switch (event.code) {
    case 'KeyW': moveForward = true; break;
    case 'KeyS': moveBackward = true; break;
    case 'KeyA': moveLeft = true; break;
    case 'KeyD': moveRight = true; break;
  }
}

function onKeyUp(event) {
  switch (event.code) {
    case 'KeyW': moveForward = false; break;
    case 'KeyS': moveBackward = false; break;
    case 'KeyA': moveLeft = false; break;
    case 'KeyD': moveRight = false; break;
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  if (controls.isLocked === true) {
    const delta = 0.05;
    velocity.set(0, 0, 0);

    if (moveForward) velocity.z -= delta;
    if (moveBackward) velocity.z += delta;
    if (moveLeft) velocity.x -= delta;
    if (moveRight) velocity.x += delta;

    controls.moveRight(velocity.x);
    controls.moveForward(velocity.z);
  }

  renderer.render(scene, camera);
}