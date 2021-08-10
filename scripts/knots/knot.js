import init from '../../utils/init.js';

import data from './data/knot_data.js';

const knot = id => {

  const {THREE, renderer, scene, camera, orbit, text} = init(id, {
    orbitControls: true,
    text: true,
    cameraFov: 50,
    cameraPos: [0,0,2]
  });
  renderer.setClearColor( 0xE0E0E0, 1 );
  orbit.enablePan = false;
  orbit.enableZoom = false;

  text.innerHTML = id.substring(1);
  text.style.color = 'black';
  text.style.top = 10 + 'px';
  text.style.left = 10 + 'px';
  text.style.textShadow = '0px 0px 5px #E0E0E0';
  
  // LIGHTS //
  
  scene.add( new THREE.HemisphereLight( 0xaaaaaa, 0x444444 ) );
  const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
  light.position.set( 1, 1, 1 );
  scene.add( light );
  
  // OBJECT //
  
  const curve = new THREE.CatmullRomCurve3( 
    data[id].map(x => new THREE.Vector3(...x).multiplyScalar(0.07)), 
    true);
  const geometry = new THREE.TubeGeometry(curve, 128, 0.07, 8, true );
  const material = new THREE.MeshStandardMaterial( {
    color: 0x00B8D4,
    roughness: 0.5,
    metalness: 0,
    flatShading: true
  } );
  const knot = new THREE.Mesh( geometry, material );
  scene.add( knot );
  
  // END //
  
  var render = function () {
  
    knot.rotation.y += 0.015;
  
    requestAnimationFrame( render );
  
    renderer.render( scene, camera );
  
  };
  
  render();

}

export default knot;
