import init from '../utils/init.js';

import MarchingCubes from '../utils/deps/marchingCubes.js';

import { polyh_data } from '../utils/regular_polyhedra.js';
import { cylinder } from '../utils/cylinder.js';

const {THREE, renderer, scene, camera} = init('clebsch_cubic', {
  orbitControls: true,
	cameraPos: [0,0,20],
});

renderer.localClippingEnabled = true;
			
// LIGHTS //

const lights = [];
lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

lights[ 0 ].position.set( 0, 200, 0 );
lights[ 1 ].position.set( 100, 200, 100 );
lights[ 2 ].position.set( - 100, - 200, - 100 );

const light = new THREE.AmbientLight( 0x404040 ); 

scene.add( light );
scene.add( lights[ 0 ] );
scene.add( lights[ 1 ] );
scene.add( lights[ 2 ] );

// OBJECT //

const clipPlanes = [];

for (let col of [polyh_data.icos.verts, polyh_data.dodec.verts]) {
	for (let v of col) {
		clipPlanes.push(new THREE.Plane( new THREE.Vector3( ...v ), 9 ));
	}
}

const polynomial = function (x, y, z) {
	return Math.pow(x,3)+Math.pow(y,3)+Math.pow(z,3)+1-0.5*Math.pow(x+y+z+1,3);
}

const cubic_lines = [
	[[3.73205, 6.56018, -6.56018], [3.73205, -6.56018, 6.56018]], 
	[[-1., 2.57522, 9.61084], [-1., -2.57522, -9.61084]], 
	[[0.267949, 7.06853, -7.06853], [0.267949, -7.06853, 7.06853]], 
	[[-1., 7.03562, -7.03562], [-1., -7.03562, 7.03562]], 
	[[-4.69396, -5.84627, 6.61724], [6.08323, 4.82416, -6.30252]], 
	[[-2.57522, -9.61084, -1.], [2.57522, 9.61084, -1.]], 
	[[-6.56018, 3.73205, 6.56018], [6.56018, 3.73205, -6.56018]], 
	[[-4.69396, 6.61724, -5.84627], [6.08323, -6.30252, 4.82416]], 
	[[-2.57522, -1., -9.61084], [2.57522, -1., 9.61084]], 
	[[-1., 9.61084, 2.57522], [-1., -9.61084, -2.57522]], 
	[[-7.03562, -1., 7.03562], [7.03562, -1., -7.03562]], 
	[[-6.56018, 6.56018, 3.73205], [6.56018, -6.56018, 3.73205]], 
	[[-7.14453, -6.73483, 1.89679], [7.55408, 5.40475, -3.70467]], 
	[[-3.70467, 5.40475, 7.55408], [1.89679, -6.73483, -7.14453]], 
	[[-7.03562, 7.03562, -1.], [7.03562, -7.03562, -1.]], 
	[[-6.73483, -7.14453, 1.89679], [5.40475, 7.55408, -3.70467]], 
	[[-6.30252, 4.82416, 6.08323], [6.61724, -5.84627, -4.69396]], 
	[[-6.30252, 6.08323, 4.82416], [6.61724, -4.69396, -5.84627]], 
	[[-7.14453, 1.89679, -6.73483], [7.55408, -3.70467, 5.40475]], 
	[[-9.61084, -1., -2.57522], [9.61084, -1., 2.57522]], 
	[[-5.84627, -4.69396, 6.61724], [4.82416, 6.08323, -6.30252]], 
	[[-7.06853, 0.267949, 7.06853], [7.06853, 0.267949, -7.06853]], 
	[[-7.06853, 7.06853, 0.267949], [7.06853, -7.06853, 0.267949]], 
	[[-5.84627, 6.61724, -4.69396], [4.82416, -6.30252, 6.08323]], 
	[[-9.61084, -2.57522, -1.], [9.61084, 2.57522, -1.]], 
	[[-6.73483, 1.89679, -7.14453], [5.40475, -3.70467, 7.55408]], 
	[[-3.70467, 7.55408, 5.40475], [1.89679, -7.14453, -6.73483]]
]

const line_material = new THREE.MeshPhongMaterial( { color: '#FFFFFF' } );
	for (let line of cubic_lines) {
		scene.add( cylinder(
			new THREE.Vector3( ...line[0] ), 
			new THREE.Vector3( ...line[1] ), 
			0.1, line_material) );
	}

const res = 80;
const radius = 10;
const material = new THREE.MeshPhongMaterial( {
	color: '#0277BD',
	transparent: true,
	opacity: 0.8,
	side: THREE.DoubleSide,
	flatShading: false,
	clippingPlanes: clipPlanes,
	clipShadows: true
} );

const surface = new MarchingCubes( res, material );
surface.isolation = 0;

for ( let k = 0 ; k < res ; k++ ) {
	for ( let j = 0 ; j < res ; j++ ) {
		for ( let i = 0 ; i < res ; i++ ) {

		const x = 2*radius*(i-res/2)/res;
		const y = 2*radius*(j-res/2)/res;
		const z = 2*radius*(k-res/2)/res;

		surface.field[ i + j*res + k*res*res ] = polynomial(x,z,y); // to have z as height

		}
	}
}

surface.scale.x = radius;
surface.scale.y = radius;
surface.scale.z = radius;

// END //

scene.add( surface );

const render = function () {

	requestAnimationFrame( render );

	renderer.render( scene, camera );

};

render();