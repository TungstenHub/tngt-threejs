import init from '../utils/init.js';

const {THREE, renderer, scene, camera, gui} = init('dupin_cyclides', {
	gui: true,
  orbitControls: true,
	cameraPos: [0,0,10],
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

let t = 0;

const surfaceParamGenerator = function (theta) {
	
	return function ( u, v, optionalTarget ) {

		const result = optionalTarget || new THREE.Vector3();

		const cos_theta = Math.cos(theta);
		const sin_theta = Math.sin(theta);

		u *= 2*Math.PI;
		v *= 2*Math.PI;

		const a = Math.cos(u)/Math.sqrt(2);
		const b = Math.sin(u)/Math.sqrt(2);
		const c = Math.cos(v)/Math.sqrt(2);
		const d = Math.sin(v)/Math.sqrt(2);

		const aa = cos_theta*a-sin_theta*c;
		const cc = cos_theta*c+sin_theta*a;
		const bb = cos_theta*b-sin_theta*d;
		const dd = cos_theta*d+sin_theta*b;

		const x = aa/(1-dd);
		const y = bb/(1-dd);
		const z = cc/(1-dd);

		return result.set( x, y, z );

	}
}

let geometry = new THREE.ParametricGeometry( surfaceParamGenerator(t), 64, 64 );
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

const obj = new THREE.Mesh( geometry, material );
obj.add( new THREE.LineSegments(new THREE.WireframeGeometry(geometry), wire_material) );


function updateSurface() {
	geometry = new THREE.ParametricGeometry( surfaceParamGenerator(t), 64, 64 );
	obj.geometry.dispose();
	obj.geometry = geometry;
	obj.children[0] = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), wire_material);
}

updateSurface();

const options = {move: true};

// GUI //

gui.add( options, 'move')

// END //

scene.add( obj );

const render = function () {

	requestAnimationFrame( render );

	if (options.move) {
		t += 0.002;
		updateSurface();
	}

	renderer.render( scene, camera );

};

render();