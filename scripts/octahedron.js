import init from '../utils/init.js';

import {polyh_data} from '../utils/regular_polyhedra.js';
import {polyhedron} from '../utils/polyhedron.js';

const {THREE, renderer, scene, camera} = init('octahedron', {
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

const data = polyh_data.oct;

const inn_material = new THREE.MeshPhongMaterial( {
  color: '#150309', 
  transparent: true,
  opacity: 0.9,
  side: THREE.DoubleSide,
  flatShading: true
} );

const ext_material = new THREE.MeshPhongMaterial( { color: '#E91E63' } );

const ext_polyh = polyhedron(data, inn_material, ext_material);

// END //

const rot = [(Math.random()-0.5)*0.005,(Math.random()-0.5)*0.005,(Math.random()-0.5)*0.005];

scene.add( ext_polyh );

var render = function () {

  ext_polyh.rotation.x += rot[0];
  ext_polyh.rotation.y += rot[1];
  ext_polyh.rotation.z += rot[2];

  requestAnimationFrame( render );

  renderer.render( scene, camera );

};

window.addEventListener( 'resize', function () {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}, false );

render();