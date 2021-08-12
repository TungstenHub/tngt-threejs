import init from '../utils/init.js';

import { polyhData } from '../utils/regular_polyhedra.js';
import { cylinder } from '../utils/cylinder.js';

const {THREE, renderer, scene, camera, gui} = init('so3_contract_double_twist', {
	gui: true,
  orbitControls: true,
	cameraFov: 15,
	cameraFar: 100,
	cameraPos: [0,35,56],
});
			
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

// CUBE //

const n = 14;

const cubeData = polyhData.cube;

const faceIdxs = [
	[0,1,2,3],
	[4,5,6,7],
	[8,9,10,11],
];

const colors = [
	0xE91E63, // pink 500
	0x2196F3, // blue 500
	0xFFEB3B, // yellow 500
];

const totalCube = new THREE.Group();

for (let i = 0; i<3; i++) {
	const innGeometry = new THREE.BufferGeometry();
	
	innGeometry.setFromPoints( 
		[].concat(...faceIdxs[i].map(
			j => cubeData.faces[j].map(i => new THREE.Vector3( ...cubeData.verts[i] )) 
		))
	);

	const innMaterial = new THREE.MeshPhongMaterial( {
		color: colors[i], 
		side: THREE.DoubleSide,
		flatShading: true
	} );

	totalCube.add(new THREE.Mesh( innGeometry, innMaterial ));
}


const extThickness = 0.03;
const extMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );

for (let vertex of cubeData.verts) {
	let sph = new THREE.SphereGeometry( extThickness, 8, 8 );
	sph = new THREE.Mesh( sph, extMaterial );
	sph.position.set(...vertex);
	totalCube.add( sph );
}

const edges_coords = cubeData.edges.map(e => [
	new THREE.Vector3(...cubeData.verts[e[0]]), 
	new THREE.Vector3(...cubeData.verts[e[1]])
]);

for (let ec of edges_coords) {
	totalCube.add( cylinder(ec[0], ec[1], extThickness, extMaterial) );
}

const cubes = [];
for (let k=0; k<=n; k++) {
	cubes.push(totalCube.clone()
		.translateX(1.5*(k-n/2)))
}

// ROTATION PARAMETER //

const opts = {
	a: 0,
	auto: true
};

function updateCubes() {
	// The resulting quaternion comes from rotating Z pole
	// around an axis between Z and X axes
	for (let k=0; k<=n; k++) {
		const A = 2*Math.PI*opts.a;
		const B = Math.PI*(n-k)/(2*n);
		const cA = Math.cos(A);
		const sA = Math.sin(A);
		const cB = Math.cos(B);
		const sB = Math.sin(B);
		cubes[k].setRotationFromQuaternion(new THREE.Quaternion().set( 
			sB * cB * (1-cA), 
			- sA * sB, 
			1 - sB * sB * (1-cA), 
			0 ));
	}

}

updateCubes();

// GUI //

gui.add( opts, 'a', 0, 1 ).listen().onChange( updateCubes );
gui.add( opts, 'auto');

// END //

for (let cube of cubes) {scene.add( cube );}

const render = function () {

	requestAnimationFrame( render );

	if (opts.auto) {
		opts.a += 0.002 + (opts.a >= 1 ? -1 : 0);

		updateCubes();
	}

	renderer.render( scene, camera );

};

render();