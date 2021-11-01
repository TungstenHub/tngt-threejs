
import THREE from './deps/three.js';
import OrbitControls from './deps/orbitControls.js';
import GUI from './deps/datGUI.js';

const init = (ident, ops = {}) => {

  const container = document.getElementById(`threejs__${ident}`);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 
    ops.cameraFov || 75, 
    container.offsetWidth / container.offsetHeight, 
    0.1, 
    ops.cameraFar || 50 
  );
  camera.position.set(...(ops.cameraPos || [0,0,-3]));
  if (ops.cameraUp) camera.up.set( ...ops.cameraUp );

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

  renderer.domElement.id = `threejs__canvas__${ident}`;

  container.appendChild( renderer.domElement );

  let orbit;
  if (ops.orbitControls) {
    orbit = new OrbitControls( camera, renderer.domElement );
  }

  let gui;
  if (ops.gui) {
    gui = new GUI({ 
      autoPlace: false, 
      ...(ops.guiWidth && { width: ops.guiWidth }) 
    });
    gui.domElement.style.position = 'relative';
    container.appendChild( gui.domElement );
  }

  let text;
  if (ops.text) {
    text = document.createElement('div');
    text.style.position = 'absolute';
    text.style.width = 100;
    text.style.height = 100;
    text.style.color = "white";
    text.style.fontFamily = "Source Code Pro";
    text.style.fontSize = 24 + 'px';
    text.innerHTML = "";
    text.style.top = 20 + 'px';
    text.style.left = 20 + 'px';
    container.appendChild( text );
  }

  return {
    THREE,
    renderer,
    scene,
    camera,
    orbit,
    gui,
    text,
  }
}

export default init;