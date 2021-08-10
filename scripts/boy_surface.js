import init from '../utils/init.js';

const {THREE, renderer, scene, camera} = init('boy_surface', {
  orbitControls: true,
	cameraPos: [0,0,3],
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

// Boy Surface - Bryant-Kusner parameterization 
// https://en.wikipedia.org/wiki/Boy%27s_surface#Parametrization_of_Boy's_surface
//
// SAGE CODE
//
// var('u v')
// assume(u,'real')
// assume(v,'real')
// w = u*exp(I*v)
//
// g1 = -3/2*(w*(1-w**4)/(w**6+sqrt(5)*w**3-1)).imag()
// g2 = -3/2*(w*(1+w**4)/(w**6+sqrt(5)*w**3-1)).real()
// g3 = ((1+w**6)/(w**6+sqrt(5)*w**3-1)).imag()-1/2
//
// print(g1.reduce_trig())
// print(g2.reduce_trig())
// print(g3.reduce_trig())

const sq5 = Math.sqrt(5);
const param = function ( v, u, optionalTarget ) {

	const result = optionalTarget || new THREE.Vector3();

	v *= 2 * Math.PI;
	
	const a = (Math.pow(u,12) - 2*Math.pow(u,6)*Math.cos(6*v) + 5*Math.pow(u,6) + 2*(sq5*Math.pow(u,9) - sq5*Math.pow(u,3))*Math.cos(3*v) + 1);
	const b = (Math.pow(u,12) + 2*sq5*Math.pow(u,9)*Math.cos(3*v) - 2*Math.pow(u,6)*Math.cos(6*v) + 5*Math.pow(u,6) - 2*sq5*Math.pow(u,3)*Math.cos(3*v) + 1);

	const g1 = -3/4*Math.pow(u,11)*(Math.sin(11*v) + Math.sin(v))/a + 3/4*Math.pow(u,11)*(Math.sin(11*v) - Math.sin(v))/a + 3/4*sq5*Math.pow(u,8)*(Math.sin(8*v) +Math. sin(2*v))/a - 3/4*sq5*Math.pow(u,8)*(Math.sin(8*v) - Math.sin(2*v))/a + 3/4*Math.pow(u,7)*(Math.sin(7*v) + Math.sin(5*v))/a - 3/4*Math.pow(u,7)*(Math.sin(7*v) - Math.sin(5*v))/a - 3/2*Math.pow(u,5)*Math.sin(5*v)/b + 3/4*sq5*Math.pow(u,4)*(Math.sin(4*v) + Math.sin(2*v))/a - 3/4*sq5*Math.pow(u,4)*(Math.sin(4*v) - Math.sin(2*v))/a + 3/2*u*Math.sin(v)/b;
	
	const g2 = -3/4*Math.pow(u,11)*(Math.cos(11*v) + Math.cos(v))/a + 3/4*Math.pow(u,11)*(Math.cos(11*v) - Math.cos(v))/a - 3/4*sq5*Math.pow(u,8)*(Math.cos(8*v) +Math. cos(2*v))/a + 3/4*sq5*Math.pow(u,8)*(Math.cos(8*v) - Math.cos(2*v))/a - 3/4*Math.pow(u,7)*(Math.cos(7*v) + Math.cos(5*v))/a + 3/4*Math.pow(u,7)*(Math.cos(7*v) - Math.cos(5*v))/a + 3/2*Math.pow(u,5)*Math.cos(5*v)/b - 3/4*sq5*Math.pow(u,4)*(Math.cos(4*v) + Math.cos(2*v))/a + 3/4*sq5*Math.pow(u,4)*(Math.cos(4*v) - Math.cos(2*v))/a + 3/2*u*Math.cos(v)/b;
	
	const g3 = sq5*Math.pow(u,9)*Math.sin(3*v)/a - 2*Math.pow(u,6)*Math.sin(6*v)/b - sq5*Math.pow(u,3)*Math.sin(3*v)/b - 1/2;

	const g = g1*g1 + g2*g2 + g3*g3;
	
	const x = g1/g;
	const z = g2/g;
	const y = g3/g+0.5;

	return result.set( x, y, z );

}

const geometry = new THREE.ParametricGeometry( param, 100, 100 );
const material = new THREE.MeshPhongMaterial( {
	color: '#1565C0', // blue 800
	transparent: true,
	opacity: 0.8,
	side: THREE.DoubleSide,
	flatShading: true
} );
const wire_material = new THREE.LineBasicMaterial( {
	color: 0xffffff,
	transparent: true,
	opacity: 0.5
} );

const obj = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), wire_material);
obj.add( new THREE.Mesh( geometry, material ) );

// END //

scene.add( obj );

const render = function () {

	requestAnimationFrame( render );

	renderer.render( scene, camera );

};

window.addEventListener( 'resize', function () {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}, false );

render();