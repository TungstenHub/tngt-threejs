
import * as THREE from 'https://cdn.skypack.dev/three@0.123.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.123.0/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'https://cdn.skypack.dev/three@0.123.0/examples/jsm/libs/dat.gui.module.js';

const init = (ident, ops = {}) => {

  const container = document.getElementById(`threejs__${ident}`);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, container.offsetWidth / container.offsetHeight, 0.1, 50 );
  camera.position.z = -3;

  const renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( container.offsetWidth, container.offsetHeight );
  renderer.setClearColor( 0x000000, 1 );
  renderer.domElement.style.position = 'absolute';


  window.addEventListener( 'resize', function () {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( container.offsetWidth, container.offsetHeight );
  }, false );

  container.appendChild( renderer.domElement );

  let orbit;
  if (ops.orbitControls) {
    orbit = new OrbitControls( camera, renderer.domElement );
  }

  let gui;
  if (ops.gui) {
    gui = new GUI({ autoPlace: false });
    gui.domElement.style.position = 'relative';
    container.appendChild( gui.domElement );
  }

  return {
    THREE,
    renderer,
    scene,
    camera,
    orbit,
    gui,
  }
}

export default init;