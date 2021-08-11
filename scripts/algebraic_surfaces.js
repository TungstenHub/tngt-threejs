import init from '../utils/init.js';

import MarchingCubes from '../utils/deps/marchingCubes.js';

const {THREE, renderer, scene, camera, gui} = init('algebraic_surfaces', {
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

let polynomial = function (x, y, z) {
	return Math.pow(x,3)+Math.pow(y,3)+Math.pow(z,3)+1-0.25*Math.pow(x+y+z+1,3);
}

const res = 50;
const material = new THREE.MeshPhongMaterial( {
	color: '#FFF59D',
	transparent: true,
	opacity: 0.8,
	side: THREE.DoubleSide,
	flatShading: false
} );

const surface = new MarchingCubes( res, material );
surface.isolation = 0;

for ( let k = 0 ; k < res ; k++ ) {
	for ( let j = 0 ; j < res ; j++ ) {
		for ( let i = 0 ; i < res ; i++ ) {

		const x = 8*(i-res/2)/res;
		const y = 8*(j-res/2)/res;
		const z = 8*(k-res/2)/res;

		surface.field[ i + j*res + k*res*res ] = polynomial(x,z,y); // to have z as height

		}
	}
}

const updateSurface = function () {
	surface.reset();
	for ( let k = 0 ; k < res ; k++ ) {
		for ( let j = 0 ; j < res ; j++ ) {
			for ( let i = 0 ; i < res ; i++ ) {

			const x = 8*(i-res/2)/res;
			const y = 8*(j-res/2)/res;
			const z = 8*(k-res/2)/res;

			surface.field[ i + j*res + k*res*res ] = polynomial(x,z,y); // to have z as height

			}
		}
	}
}

// GUI //

gui.add({ clebsch_cubic:function(){ 
	polynomial = function (x, y, z) {
		return Math.pow(x,3)+Math.pow(y,3)+Math.pow(z,3)+1-0.25*Math.pow(x+y+z+1,3);
	};
	material.color = {r: 255/255, g: 245/255, b: 157/255};
	updateSurface(); }},'clebsch_cubic').name("Clebsch Cubic");
gui.add({ cayley_cubic:function(){ 
	polynomial = function (x, y, z) {
		return x*x+y*y-x*x*z+y*y*z+z*z-1;
	};
	material.color = {r: 165/255, g: 214/255, b: 167/255};
	updateSurface(); }},'cayley_cubic').name("Cayley Cubic");
gui.add({ kummer_quartic:function(){ 
	polynomial = function (x, y, z) {
		const mu = 1.2;
		const lambda = 2; // scale
		return Math.pow(x*x+y*y+z*z-lambda*lambda*mu*mu,2)-(3*mu*mu-1)/(3-mu*mu)*(lambda-z-Math.sqrt(2)*x)*(lambda-z+Math.sqrt(2)*x)*(lambda+z+Math.sqrt(2)*y)*(lambda+z-Math.sqrt(2)*y);
	};
	material.color = {r: 144/255, g: 202/255, b: 249/255};
	updateSurface(); }},'kummer_quartic').name("Kummer Quartic");
gui.add({ togliatti_quintic:function(){ 
	polynomial = function (x, y, z) {
		const pi = Math.PI;
		return (1-Math.sqrt(5-Math.sqrt(5))/2*z)*Math.pow(x*x+y*y-1+(1+3*Math.sqrt(5))/4*z*z,2)-3.8496061120482923113983843766*(x-z)*(Math.cos(2*pi/5)*x-Math.sin(2*pi/5)*y-z)*(Math.cos(4*pi/5)*x-Math.sin(4*pi/5)*y-z)*(Math.cos(6*pi/5)*x-Math.sin(6*pi/5)*y-z)*(Math.cos(8*pi/5)*x-Math.sin(8*pi/5)*y-z);
	};
	material.color = {r: 244/255, g: 143/255, b: 177/255};
	updateSurface(); }},'togliatti_quintic').name("Togliatti Quintic");
gui.add({ barth_sextic:function(){ 
	polynomial = function (x, y, z) {
		const pi = Math.PI;
		const lambda = 1.7; // scale
		return 4*(Math.pow((1+Math.sqrt(5))/2,2)*x*x-y*y)*(Math.pow((1+Math.sqrt(5))/2,2)*y*y-z*z)*(Math.pow((1+Math.sqrt(5))/2,2)*z*z-x*x)-(1+2*((1+Math.sqrt(5))/2))*lambda*lambda*Math.pow(x*x+y*y+z*z-lambda*lambda,2);
	};
	material.color = {r: 255/255, g: 204/255, b: 128/255};
	updateSurface(); }},'barth_sextic').name("Barth Sextic");

// END //4*(Math.pow((1+Math.sqrt(5))/2,2)*x*x-y*y)*(((1+Math.sqrt(5))/2)^2*y*y-z*z)*(((1+Math.sqrt(5))/2)^2*z*z-x*x)-1*(1+2*((1+Math.sqrt(5))/2))*(x*x+y*y+z*z-1)^2

scene.add( surface );

const render = function () {

	requestAnimationFrame( render );

	renderer.render( scene, camera );

};

render();