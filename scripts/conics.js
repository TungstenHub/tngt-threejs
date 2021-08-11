import init from '../utils/init.js';

const {THREE, renderer, scene, camera, gui} = init('conics', {
	gui: true,
  orbitControls: true,
	cameraPos: [3,2,0],
});

const
p1 = new THREE.Plane(new THREE.Vector3( 0, 1, 0 ), 1.2),
p2 = new THREE.Plane(new THREE.Vector3( 0, -1, 0 ), 1.2),
p3 = new THREE.Plane(new THREE.Vector3( 1, 0, 0 ), 1.2),
p4 = new THREE.Plane(new THREE.Vector3( -1, 0, 0 ), 1.2),
p5 = new THREE.Plane(new THREE.Vector3( 0, 0, 1 ), 1.2),
p6 = new THREE.Plane(new THREE.Vector3( 0, 0, -1 ), 1.2);
renderer.clippingPlanes = [p1,p2,p3,p4,p5,p6];

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

// CONE //

const cone_geometry = new THREE.ConeGeometry(1, 1, 50, 12, true);
const cone_material = new THREE.MeshPhongMaterial( {
	color: '#1565C0', // blue 800
	transparent: true,
	opacity: 0.8,
	side: THREE.DoubleSide,
	flatShading: true
} );
const cone = new THREE.Mesh( cone_geometry, cone_material );

// PLANE //

const plane_geometry = new THREE.PlaneGeometry(2.5, 3, 50, 60);
const plane_material = new THREE.MeshPhongMaterial( {
	color: '#424242', // gray 800
	transparent: true,
	opacity: 0.8,
	side: THREE.DoubleSide,
	flatShading: true
} );
const plane = new THREE.Mesh( plane_geometry, plane_material );

// CONE AND PLANE WIRE //
const wire_material = new THREE.LineBasicMaterial( {
	color: 0xffffff,
	transparent: true,
	opacity: 0.5
} );

cone.add( new THREE.LineSegments(new THREE.WireframeGeometry(cone_geometry), wire_material) );
plane.add( new THREE.LineSegments(new THREE.WireframeGeometry(plane_geometry), wire_material) );

// DOUBLE CONE //
const up_cone = cone.clone();
up_cone.rotation.x = Math.PI;

cone.position.y = -0.5;
up_cone.position.y = 0.5;

// CONIC AND INTERACTIVITY //

const planeData = {
	y: 0.3,
	theta: Math.PI/6
};

const conic_path = new THREE.Curve();

conic_path.getPoint = function ( alpha ) {

	const t = planeData.y/(1-Math.sin(2*Math.PI*alpha)*Math.tan(-planeData.theta));
	const tx = t * Math.cos(2*Math.PI*alpha);
	const ty = t;
	const tz = t * Math.sin(2*Math.PI*alpha);

	return new THREE.Vector3( tx, ty, tz )

};

let conic_geometry = new THREE.TubeGeometry(conic_path, 64, 0.01, 32);

const conic_material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
const conic = new THREE.Mesh( conic_geometry, conic_material );

function updatePlane() {
	
	plane.position.y = planeData.y;
	plane.rotation.x = Math.PI/2 + planeData.theta;

	conic_path.getPoint = function ( alpha ) {

		const t = planeData.y/(1-Math.sin(2*Math.PI*alpha)*Math.tan(-planeData.theta));
		const tx = t * Math.cos(2*Math.PI*alpha);
		const ty = t;
		const tz = t * Math.sin(2*Math.PI*alpha);
	
		return new THREE.Vector3( tx, ty, tz )
	
	};

	conic_geometry = new THREE.TubeGeometry(conic_path, 64, 0.01, 32);
	conic.geometry = conic_geometry;
	
}

updatePlane();

// GUI //

gui.add( planeData, 'y', -1, 1 ).onChange( updatePlane );
gui.add( planeData, 'theta', -Math.PI/2, Math.PI/2 ).onChange( updatePlane );

// END //

scene.add( cone );
scene.add( up_cone );
scene.add( plane );
scene.add( conic );


const render = function () {

	requestAnimationFrame( render );

	renderer.render( scene, camera );

};

render();