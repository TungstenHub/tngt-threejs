import init from '../utils/init.js';

import {polyhData} from '../utils/regular_polyhedra.js';
import {polyhedron} from '../utils/polyhedron.js';

const {THREE, renderer, scene, camera} = init('dodecahedron', {
  orbitControls: true,
  cameraFov: 15,
  cameraPos: [10,0,0]
});

// LIGHTS //

var lights = [];
lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

lights[ 0 ].position.set( 0, 200, 0 );
lights[ 1 ].position.set( 100, 200, 100 );
lights[ 2 ].position.set( - 100, - 200, - 100 );

var light = new THREE.AmbientLight( 0x404040 ); 

scene.add( light );
scene.add( lights[ 0 ] );
scene.add( lights[ 1 ] );
scene.add( lights[ 2 ] );

// POLYHEDRON //

const data = polyhData.dodec;

const innMaterial = new THREE.MeshPhongMaterial( {
  color: '#170E00', 
  transparent: true,
  opacity: 0.9,
  side: THREE.DoubleSide,
  flatShading: true
} );

const extMaterial = new THREE.MeshPhongMaterial( { color: '#FF9800' } );

const extPolyh = polyhedron(data, innMaterial, extMaterial);

// END //

const rot = [(Math.random()-0.5)*0.005,(Math.random()-0.5)*0.005,(Math.random()-0.5)*0.005];

scene.add( extPolyh );

var render = function () {

  extPolyh.rotation.x += rot[0];
  extPolyh.rotation.y += rot[1];
  extPolyh.rotation.z += rot[2];

  requestAnimationFrame( render );

  renderer.render( scene, camera );

};

render();