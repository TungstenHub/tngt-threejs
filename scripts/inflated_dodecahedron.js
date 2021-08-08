import init from '../utils/init.js';

import {polyh_data} from '../utils/regular_polyhedra.js';
import {spherical_strip} from '../utils/spherical_strip.js';

const {THREE, renderer, scene, camera} = init('inflated_dodecahedron', {
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

// OBJECT //

var wire = new THREE.Group();

const data = polyh_data.dodec;

var wire_mat = new THREE.MeshPhongMaterial( {
  color: '#222222', 
  side: THREE.DoubleSide,
} );

for (let e of data.edges) {
  wire.add(new THREE.Mesh(
    spherical_strip(
      new THREE.Vector3(...data.verts[e[0]]),
      new THREE.Vector3(...data.verts[e[1]])
    ), wire_mat )
  );
}

const sph_geom = new THREE.SphereGeometry( 0.999, 64, 64 );
const sph_mat = new THREE.MeshPhongMaterial( {
  color: '#FF9800', 
  transparent: true,
  opacity: 0.7,
} );
const sphere = new THREE.Mesh( sph_geom, sph_mat );

// END //

const rot = [(Math.random()-0.5)*0.005,(Math.random()-0.5)*0.005,(Math.random()-0.5)*0.005];

scene.add( wire );
scene.add( sphere );

var render = function () {

  wire.rotation.x += rot[0];
  wire.rotation.y += rot[1];
  wire.rotation.z += rot[2];

  requestAnimationFrame( render );

  renderer.render( scene, camera );

};

render();