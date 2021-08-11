import init from '../utils/init.js';

const {THREE, renderer, scene, camera} = init('sphere', {
  orbitControls: true,
	cameraPos: [0,0,15],
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

const geometry = new THREE.SphereGeometry( 5, 32, 32 );
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

render();