import init from '../utils/init.js';

import {polyhData} from '../utils/regular_polyhedra.js';
import {polyhedron} from '../utils/polyhedron.js';
import {cylinder} from '../utils/cylinder.js';

const {THREE, renderer, scene, camera, gui} = init('tetrahedron_through_paper', {
	gui: true,
  orbitControls: true,
	cameraPos: [1,0,-3],
});
			
// LIGHTS //

const lights = [];
lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

lights[ 0 ].position.set( 0, 200, 0 );
lights[ 1 ].position.set( 100, 200, 100 );
lights[ 2 ].position.set( - 100, - 200, - 100 );

scene.add( lights[ 0 ] );
scene.add( lights[ 1 ] );
scene.add( lights[ 2 ] );

// TETRAHEDRON //

const data = polyhData.tetr;

const tetrThickness = 0.02;

const extMaterial = new THREE.MeshPhongMaterial( { color: '#FFFFFF' } );

const tetrahedron = polyhedron(data, null, extMaterial, tetrThickness);

tetrahedron.rotateY(Math.PI/4);

scene.add( tetrahedron );

// PLANE //

const plane_geometry = new THREE.PlaneGeometry(3, 3, 60, 60);
const plane_material = new THREE.MeshPhongMaterial( {
	color: '#424242', // gray 800
	transparent: true,
	opacity: 0.8,
	side: THREE.DoubleSide,
	flatShading: true
} );
const plane = new THREE.Mesh( plane_geometry, plane_material );

const wire_material = new THREE.LineBasicMaterial( {
	color: 0xffffff,
	transparent: true,
	opacity: 0.5
} );

plane.add( new THREE.LineSegments(new THREE.WireframeGeometry(plane_geometry), wire_material) );

scene.add( plane );

// CUTS //

const cut_material = new THREE.MeshBasicMaterial( { color: '#03A9F4' } );

const cutThickness = 0.02;

scene.add( cylinder(
	new THREE.Vector3(-1.2,1/Math.sqrt(3),0), 
	new THREE.Vector3(1.2,1/Math.sqrt(3),0), 
	cutThickness, cut_material) );
scene.add( cylinder(
	new THREE.Vector3(0,1/Math.sqrt(3),0), 
	new THREE.Vector3(0,-1/Math.sqrt(3)-0.2,0), 
	cutThickness, cut_material) );

// INTERACTIVITY //

const positionData = {
	a: -2
};

function updateTetrahedron() {
	tetrahedron.position.set(0,Math.sqrt(2)*Math.abs(positionData.a),-positionData.a);
}

updateTetrahedron();

// GUI //

gui.add( positionData, 'a', -2, 2 ).onChange( updateTetrahedron );

// END //

const render = function () {

	requestAnimationFrame( render );

	renderer.render( scene, camera );

};

render();