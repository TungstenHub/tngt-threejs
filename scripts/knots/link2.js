import init from '../../utils/init.js';

import data from './data/link_2_data.js';

const link2 = id => {

  const {THREE, renderer, scene, camera, orbit, text} = init(id, {
    orbitControls: true,
    text: true,
    cameraFov: 50,
    cameraPos: [0,0,2]
  });
  renderer.setClearColor( 0xE0E0E0, 1 );
  orbit.enablePan = false;
  orbit.enableZoom = false;

  text.innerHTML = id.substring(1).replace('_','^');
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

  const knots = [];
  const colors = [0x00B8D4, 0xFFD600];
  let curve, geometry, material, knot;

  for (let i = 0; i < 2; i++) {
    curve = new THREE.CatmullRomCurve3( 
      data[id][i].map(x => new THREE.Vector3(...x).multiplyScalar(0.07)), 
      true);
    geometry = new THREE.TubeGeometry(curve, 128, 0.07, 8, true );
    material = new THREE.MeshStandardMaterial( {
      color: colors[i],
      roughness: 0.5,
      metalness: 0,
      flatShading: true
    } );
    knot = new THREE.Mesh( geometry, material );
    knots.push( knot );
    scene.add( knot );
  }
  
  // END //
  
  var render = function () {
  
    knots.forEach(k => k.rotation.y += 0.015);
  
    requestAnimationFrame( render );
  
    renderer.render( scene, camera );
  
  };
  
  render();

}

export default link2;
