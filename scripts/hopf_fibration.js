import init from '../utils/init.js';

const {THREE, renderer, scene, camera} = init('hopf_fibration', {
  orbitControls: true,
  cameraFov: 15,
  cameraPos: [40,10,0]
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

// CIRCLE GENERATOR //

const circleGenerator = function (w1,w2) {
	
	return function ( alpha ) {

		const cos_alpha = Math.cos(2*Math.PI*alpha);
		const sin_alpha = Math.sin(2*Math.PI*alpha);

		const mod = Math.sqrt(1+w1*w1+w2*w2);

		const a = cos_alpha/mod;
		const b = sin_alpha/mod;
		const c = (cos_alpha*w1 - sin_alpha*w2)/mod;
		const d = (cos_alpha*w2 + sin_alpha*w1)/mod;

		const x = a/(1-d);
		const z = b/(1-d);
		const y = c/(1-d);
	
		return new THREE.Vector3( x, y, z )
	
	}
}

const colors = ['#C62828', '#EF6C00', '#F9A825', '#2E7D32', '#00838F'];
// red, orange, yellow, green, cyan 800

for (let k = 0; k < 5; k++) {

	const circle_material = new THREE.MeshPhongMaterial( {
		color: colors[k],
		transparent: true,
		opacity: 0.8,
		side: THREE.DoubleSide,
		flatShading: true
	} );
	
	const num = (k==0 ? 1 : 12);
	for (let i = 0; i < num; i++) {
		const circle_path = new THREE.Curve();

		circle_path.getPoint = circleGenerator(Math.tan(k*Math.PI/10)*Math.cos(Math.PI*i/6),Math.tan(k*Math.PI/10)*Math.sin(Math.PI*i/6));

		const circle_geometry = new THREE.TubeGeometry(circle_path, 64, 0.02, 8);
		
		const circle = new THREE.Mesh( circle_geometry, circle_material );

		scene.add( circle );

	}

}

const geometry = new THREE.CylinderBufferGeometry( 0.02, 0.02, 16, 8 );
const material = new THREE.MeshPhongMaterial( {
	color: '#0277BD', // light blue 800
	transparent: true,
	opacity: 0.8,
	side: THREE.DoubleSide,
	flatShading: true
} );
const cylinder = new THREE.Mesh( geometry, material );
scene.add( cylinder );


// END //

const render = function () {

	requestAnimationFrame( render );

	renderer.render( scene, camera );

};

render();