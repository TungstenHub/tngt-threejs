import init from '../utils/init.js';

import MarchingCubes from '../utils/deps/marchingCubes.js';

const {THREE, renderer, scene, camera, gui} = init('quadrics', {
  gui: true,
  orbitControls: true,
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

// OBJECT //

const quadricData = {
	a11: 1,
	a22: 1,
	a33: 1,
	a12: 0,
	a13: 0,
	a23: 0,
	a1: 0,
	a2: 0,
	a3: 0,
	a: -1
};

const quadValue = function (data, x, y, z) {
	return data.a11*x*x+
				data.a22*y*y+
				data.a33*z*z+
				data.a12*2*x*y+
				data.a13*2*x*z+
				data.a23*2*y*z+
				data.a1*x+
				data.a2*y+
				data.a3*z+
				data.a;
}

const res = 50;
const material = new THREE.MeshPhongMaterial( {
	color: '#1565C0', // blue 800
	transparent: true,
	opacity: 0.8,
	side: THREE.DoubleSide,
	flatShading: false
} );

const quadric = new MarchingCubes( res, material );
quadric.isolation = 0;

for ( let k = 0 ; k < res ; k++ ) {
	for ( let j = 0 ; j < res ; j++ ) {
		for ( let i = 0 ; i < res ; i++ ) {

		const x = 8*(i-res/2)/res;
		const y = 8*(j-res/2)/res;
		const z = 8*(k-res/2)/res;

		quadric.field[ i + j*res + k*res*res ] = quadValue(quadricData,x,z,y); // to have z as height

		}
	}
}

const updateQuadric = function () {
	quadric.reset();
	for ( let k = 0 ; k < res ; k++ ) {
		for ( let j = 0 ; j < res ; j++ ) {
			for ( let i = 0 ; i < res ; i++ ) {

			const x = 8*(i-res/2)/res;
			const y = 8*(j-res/2)/res;
			const z = 8*(k-res/2)/res;

			quadric.field[ i + j*res + k*res*res ] = quadValue(quadricData,x,z,y); // to have z as height

			}
		}
	}
}

// GUI //

const special_quadrics = gui.addFolder( 'Special Quadrics' );
special_quadrics.add({ sphere:function(){ 
	quadricData.a11 = 1;
	quadricData.a22 = 1;
	quadricData.a33 = 1;
	quadricData.a12 = 0;
	quadricData.a13 = 0;
	quadricData.a23 = 0;
	quadricData.a1 = 0;
	quadricData.a2 = 0;
	quadricData.a3 = 0;
	quadricData.a = -1;
	updateQuadric(); }},'sphere').name("Sphere");
special_quadrics.add({ elliptic_paraboloid:function(){ 
	quadricData.a11 = 1;
	quadricData.a22 = 1;
	quadricData.a33 = 0;
	quadricData.a12 = 0;
	quadricData.a13 = 0;
	quadricData.a23 = 0;
	quadricData.a1 = 0;
	quadricData.a2 = 0;
	quadricData.a3 = -1;
	quadricData.a = 0;
	updateQuadric(); }},'elliptic_paraboloid').name("Elliptic Paraboloid");
special_quadrics.add({ hyperbolic_paraboloid:function(){ 
	quadricData.a11 = 1;
	quadricData.a22 = -1;
	quadricData.a33 = 0;
	quadricData.a12 = 0;
	quadricData.a13 = 0;
	quadricData.a23 = 0;
	quadricData.a1 = 0;
	quadricData.a2 = 0;
	quadricData.a3 = -1;
	quadricData.a = 0;
	updateQuadric(); }},'hyperbolic_paraboloid').name("Hyperbolic Paraboloid");
special_quadrics.add({ elliptic_hyperboloid_one_sheet:function(){ 
	quadricData.a11 = 1;
	quadricData.a22 = 1;
	quadricData.a33 = -1;
	quadricData.a12 = 0;
	quadricData.a13 = 0;
	quadricData.a23 = 0;
	quadricData.a1 = 0;
	quadricData.a2 = 0;
	quadricData.a3 = 0;
	quadricData.a = -1;
	updateQuadric(); }},'elliptic_hyperboloid_one_sheet').name("Hyperboloid 1 Sheet");
special_quadrics.add({ elliptic_hyperboloid_two_sheets:function(){ 
	quadricData.a11 = 1;
	quadricData.a22 = 1;
	quadricData.a33 = -1;
	quadricData.a12 = 0;
	quadricData.a13 = 0;
	quadricData.a23 = 0;
	quadricData.a1 = 0;
	quadricData.a2 = 0;
	quadricData.a3 = 0;
	quadricData.a = 1;
	updateQuadric(); }},'elliptic_hyperboloid_two_sheets').name("Hyperboloid 2 Sheets");
special_quadrics.add({ cone:function(){ 
	quadricData.a11 = 1;
	quadricData.a22 = 1;
	quadricData.a33 = -1;
	quadricData.a12 = 0;
	quadricData.a13 = 0;
	quadricData.a23 = 0;
	quadricData.a1 = 0;
	quadricData.a2 = 0;
	quadricData.a3 = 0;
	quadricData.a = 0;
	updateQuadric(); }},'cone').name("Cone");
special_quadrics.add({ elliptical_cylinder:function(){ 
	quadricData.a11 = 1;
	quadricData.a22 = 1;
	quadricData.a33 = 0;
	quadricData.a12 = 0;
	quadricData.a13 = 0;
	quadricData.a23 = 0;
	quadricData.a1 = 0;
	quadricData.a2 = 0;
	quadricData.a3 = 0;
	quadricData.a = -1;
	updateQuadric(); }},'elliptical_cylinder').name("Elliptical Cylinder");
special_quadrics.add({ hyperbolic_cylinder:function(){ 
	quadricData.a11 = 1;
	quadricData.a22 = -1;
	quadricData.a33 = 0;
	quadricData.a12 = 0;
	quadricData.a13 = 0;
	quadricData.a23 = 0;
	quadricData.a1 = 0;
	quadricData.a2 = 0;
	quadricData.a3 = 0;
	quadricData.a = 1;
	updateQuadric(); }},'hyperbolic_cylinder').name("Hyperbolic Cylinder");
special_quadrics.add({ parabolic_cylinder:function(){ 
	quadricData.a11 = 1;
	quadricData.a22 = 0;
	quadricData.a33 = 0;
	quadricData.a12 = 0;
	quadricData.a13 = 0;
	quadricData.a23 = 0;
	quadricData.a1 = 0;
	quadricData.a2 = -1;
	quadricData.a3 = 0;
	quadricData.a = 0;
	updateQuadric(); }},'parabolic_cylinder').name("Parabolic Cylinder");
special_quadrics.add({ two_crossing_planes:function(){ 
	quadricData.a11 = 1;
	quadricData.a22 = -1;
	quadricData.a33 = 0;
	quadricData.a12 = 0;
	quadricData.a13 = 0;
	quadricData.a23 = 0;
	quadricData.a1 = 0;
	quadricData.a2 = 0;
	quadricData.a3 = 0;
	quadricData.a = 0;
	updateQuadric(); }},'two_crossing_planes').name("Two Crossing Planes");
special_quadrics.add({ two_parallel_planes:function(){ 
	quadricData.a11 = 1;
	quadricData.a22 = 0;
	quadricData.a33 = 0;
	quadricData.a12 = 0;
	quadricData.a13 = 0;
	quadricData.a23 = 0;
	quadricData.a1 = 0;
	quadricData.a2 = 0;
	quadricData.a3 = 0;
	quadricData.a = -1;
	updateQuadric(); }},'two_parallel_planes').name("Two Parallel Planes");
special_quadrics.open();


const parameters = gui.addFolder( 'Parameters' );
parameters.add( quadricData, 'a11', -5, 5 ).listen().onChange( updateQuadric );
parameters.add( quadricData, 'a22', -5, 5 ).listen().onChange( updateQuadric );
parameters.add( quadricData, 'a33', -5, 5 ).listen().onChange( updateQuadric );
parameters.add( quadricData, 'a12', -5, 5 ).listen().onChange( updateQuadric );
parameters.add( quadricData, 'a13', -5, 5 ).listen().onChange( updateQuadric );
parameters.add( quadricData, 'a23', -5, 5 ).listen().onChange( updateQuadric );
parameters.add( quadricData, 'a1', -5, 5 ).listen().onChange( updateQuadric );
parameters.add( quadricData, 'a2', -5, 5 ).listen().onChange( updateQuadric );
parameters.add( quadricData, 'a3', -5, 5 ).listen().onChange( updateQuadric );
parameters.add( quadricData, 'a', -5, 5 ).listen().onChange( updateQuadric );

// END //

scene.add( quadric );

const render = function () {

	requestAnimationFrame( render );

	renderer.render( scene, camera );

};

render();