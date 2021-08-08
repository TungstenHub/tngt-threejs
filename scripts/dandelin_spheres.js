import init from '../utils/init.js';

const {THREE, renderer, scene, camera, gui} = init('dandelin_spheres', {
  gui: true,
  orbitControls: true,
  cameraPos: [3,2,0]
});

const
p1 = new THREE.Plane(new THREE.Vector3( 0, 1, 0 ), 1.2),
p2 = new THREE.Plane(new THREE.Vector3( 0, -1, 0 ), 1.2),
p3 = new THREE.Plane(new THREE.Vector3( 1, 0, 0 ), 1.2),
p4 = new THREE.Plane(new THREE.Vector3( -1, 0, 0 ), 1.2),
p5 = new THREE.Plane(new THREE.Vector3( 0, 0, 1 ), 1.2),
p6 = new THREE.Plane(new THREE.Vector3( 0, 0, -1 ), 1.2),
p7 = new THREE.Plane(new THREE.Vector3( -1, 0, 0 ), 0);
renderer.clippingPlanes = [p1,p2,p3,p4,p5,p6];
renderer.localClippingEnabled = true;

// LIGHTS //

var lights = [];
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

var cone_geometry = new THREE.ConeBufferGeometry(1, 1, 50, 2, true);
var cone_material = new THREE.MeshPhongMaterial( {
	color: '#1565C0', // blue 800
	transparent: true,
	opacity: 0.8,
	side: THREE.DoubleSide,
	flatShading: true,
	clippingPlanes: [ p7 ],
	clipShadows: true
} );
var cone = new THREE.Mesh( cone_geometry, cone_material );

// PLANE //

var plane_geometry = new THREE.PlaneBufferGeometry(2.5, 3, 50, 60);
var plane_material = new THREE.MeshPhongMaterial( {
	color: '#424242', // gray 800
	transparent: true,
	opacity: 0.8,
	side: THREE.DoubleSide,
	flatShading: true,
	clippingPlanes: [ p7 ],
	clipShadows: true
} );
var plane = new THREE.Mesh( plane_geometry, plane_material );

// DANDELIN SPHERES //

var sphere1_geometry = new THREE.SphereBufferGeometry( 1, 32, 32 );
var sphere1_material = new THREE.MeshPhongMaterial( {
	color: '#EF6C00', // orange 800
	transparent: true,
	opacity: 0.8,
	side: THREE.DoubleSide,
	flatShading: true
} );
var sphere1 = new THREE.Mesh( sphere1_geometry, sphere1_material );

var sphere2_geometry = new THREE.SphereBufferGeometry( 1, 32, 32 );
var sphere2_material = new THREE.MeshPhongMaterial( {
	color: '#AD1457', // pink 800
	transparent: true,
	opacity: 0.8,
	side: THREE.DoubleSide,
	flatShading: true
} );
var sphere2 = new THREE.Mesh( sphere2_geometry, sphere2_material );

// WIRE //
var wire_material = new THREE.LineBasicMaterial( {
	color: 0xffffff,
	transparent: true,
	opacity: 0.5
} );

cone.add( new THREE.LineSegments(new THREE.WireframeGeometry(cone_geometry), wire_material) );
plane.add( new THREE.LineSegments(new THREE.WireframeGeometry(plane_geometry), wire_material) );
sphere1.add( new THREE.LineSegments(new THREE.WireframeGeometry(sphere1_geometry), wire_material) );
sphere2.add( new THREE.LineSegments(new THREE.WireframeGeometry(sphere2_geometry), wire_material) );

// DOUBLE CONE //
const up_cone = cone.clone();
up_cone.rotation.x = Math.PI;

cone.position.y = -0.5;
up_cone.position.y = 0.5;

// CONIC AND INTERACTIVITY //

const planeData = {
	y: 0.3,
	theta: Math.PI/9,
	alpha: 0
};

//~//

var conic_path = new THREE.Curve();

conic_path.getPoint = function ( alpha ) {

	var t = planeData.y/(1-Math.sin(2*Math.PI*alpha)*Math.tan(-planeData.theta));
	var tx = t * Math.cos(2*Math.PI*alpha);
	var ty = t;
	var tz = t * Math.sin(2*Math.PI*alpha);

	return new THREE.Vector3( tx,ty,tz )

};

var conic_geometry = new THREE.TubeBufferGeometry(conic_path, 32, 0.01, 8);

var conic_material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
var conic = new THREE.Mesh( conic_geometry, conic_material );

//~//

var tg1_path = new THREE.Curve();

tg1_path.getPoint = function ( alpha ) {

	var r = dand_coords(Math.tan(planeData.theta),planeData.y)[0].h/2
	var tx = r * Math.cos(2*Math.PI*alpha);
	var ty = r;
	var tz = r * Math.sin(2*Math.PI*alpha);

	return new THREE.Vector3( tx,ty,tz )

};

var tg1_geometry = new THREE.TubeBufferGeometry(tg1_path, 32, 0.01, 8);

var tg1_material = new THREE.MeshBasicMaterial( { color: '#FF9800' } ); // orange 500
var tg1 = new THREE.Mesh( tg1_geometry, tg1_material );

//~//

var tg2_path = new THREE.Curve();

tg2_path.getPoint = function ( alpha ) {

	var r = dand_coords(Math.tan(planeData.theta),planeData.y)[1].h/2
	var tx = r * Math.cos(2*Math.PI*alpha);
	var ty = r;
	var tz = r * Math.sin(2*Math.PI*alpha);

	return new THREE.Vector3( tx,ty,tz )

};

var tg2_geometry = new THREE.TubeBufferGeometry(tg2_path, 32, 0.01, 8);

var tg2_material = new THREE.MeshBasicMaterial( { color: '#E91E63' } ); // pink 500
var tg2 = new THREE.Mesh( tg2_geometry, tg2_material );

//~//

var q1_geometry = new THREE.SphereBufferGeometry( 0.03, 8, 8 );
var q1 = new THREE.Mesh( q1_geometry, tg1_material );

var q2_geometry = new THREE.SphereBufferGeometry( 0.03, 8, 8 );
var q2 = new THREE.Mesh( q2_geometry, tg2_material );

//~//

var F1I_path = new THREE.Curve();

F1I_path.getPoint = function ( t ) {

	const d_coords = dand_coords(Math.tan(planeData.theta),planeData.y);
	const a = conic_path.getPoint(-planeData.alpha);

	var tx = (1-t)*(0) + t*(a.x);
	var ty = (1-t)*(planeData.y+(d_coords[0].h-planeData.y)*Math.sin(planeData.theta)*Math.sin(planeData.theta)) + t*(a.y);
	var tz = (1-t)*(-(d_coords[0].h-planeData.y)*Math.sin(planeData.theta)*Math.cos(planeData.theta)) + t*(a.z);

	return new THREE.Vector3( tx,ty,tz )

};

var F1I_geometry = new THREE.TubeBufferGeometry(F1I_path, 2, 0.01, 8);

var F1I = new THREE.Mesh( F1I_geometry, tg1_material );

//~//

var F2I_path = new THREE.Curve();

F2I_path.getPoint = function ( t ) {

	const d_coords = dand_coords(Math.tan(planeData.theta),planeData.y);
	const a = conic_path.getPoint(-planeData.alpha);

	var tx = (1-t)*(0) + t*(a.x);
	var ty = (1-t)*(planeData.y+(d_coords[1].h-planeData.y)*Math.sin(planeData.theta)*Math.sin(planeData.theta)) + t*(a.y);
	var tz = (1-t)*(-(d_coords[1].h-planeData.y)*Math.sin(planeData.theta)*Math.cos(planeData.theta)) + t*(a.z);

	return new THREE.Vector3( tx,ty,tz )

};

var F2I_geometry = new THREE.TubeBufferGeometry(F2I_path, 2, 0.01, 8);

var F2I = new THREE.Mesh( F2I_geometry, tg2_material );

//~//

var IC1_path = new THREE.Curve();

IC1_path.getPoint = function ( t ) {

	var r = dand_coords(Math.tan(planeData.theta),planeData.y)[0].h/2
	const a = conic_path.getPoint(-planeData.alpha);

	var tx = (1-t)*(r * Math.cos(-2*Math.PI*planeData.alpha)) + t*(a.x);
	var ty = (1-t)*(r) + t*(a.y);
	var tz = (1-t)*(r * Math.sin(-2*Math.PI*planeData.alpha)) + t*(a.z);

	return new THREE.Vector3( tx,ty,tz )

};

var IC1_geometry = new THREE.TubeBufferGeometry(IC1_path, 2, 0.01, 8);

var IC1 = new THREE.Mesh( IC1_geometry, tg1_material );

//~//

var IC2_path = new THREE.Curve();

IC2_path.getPoint = function ( t ) {

	var r = dand_coords(Math.tan(planeData.theta),planeData.y)[1].h/2
	const a = conic_path.getPoint(-planeData.alpha);

	var tx = (1-t)*(r * Math.cos(-2*Math.PI*planeData.alpha)) + t*(a.x);
	var ty = (1-t)*(r) + t*(a.y);
	var tz = (1-t)*(r * Math.sin(-2*Math.PI*planeData.alpha)) + t*(a.z);

	return new THREE.Vector3( tx,ty,tz )

};

var IC2_geometry = new THREE.TubeBufferGeometry(IC2_path, 2, 0.01, 8);

var IC2 = new THREE.Mesh( IC2_geometry, tg2_material );

//~//

function dand_coords(m,b) {
	const s = Math.sqrt((m*m+1)/2);
	return [{h:b/(1-s),r:b/(1-s)/Math.sqrt(2)},
			{h:b/(1+s),r:b/(1+s)/Math.sqrt(2)}];
}

function updatePlane() {
	
	plane.position.y = planeData.y;
	plane.rotation.x = Math.PI/2 + planeData.theta;

	const d_coords = dand_coords(Math.tan(planeData.theta),planeData.y)

	sphere1.position.y = d_coords[0].h;
	sphere1.scale.x = d_coords[0].r;
	sphere1.scale.y = d_coords[0].r;
	sphere1.scale.z = d_coords[0].r;

	sphere2.position.y = d_coords[1].h;
	sphere2.scale.x = d_coords[1].r;
	sphere2.scale.y = d_coords[1].r;
	sphere2.scale.z = d_coords[1].r;

	conic_geometry = new THREE.TubeBufferGeometry(conic_path, 32, 0.01, 8);
	conic.geometry = conic_geometry;

	tg1_geometry = new THREE.TubeBufferGeometry(tg1_path, 32, 0.01, 8);
	tg1.geometry = tg1_geometry;

	tg2_geometry = new THREE.TubeBufferGeometry(tg2_path, 32, 0.01, 8);
	tg2.geometry = tg2_geometry;

	q1.position.z = -(d_coords[0].h-planeData.y)*Math.sin(planeData.theta)*Math.cos(planeData.theta);
	q1.position.y = planeData.y+(d_coords[0].h-planeData.y)*Math.sin(planeData.theta)*Math.sin(planeData.theta);

	q2.position.z = -(d_coords[1].h-planeData.y)*Math.sin(planeData.theta)*Math.cos(planeData.theta);
	q2.position.y = planeData.y+(d_coords[1].h-planeData.y)*Math.sin(planeData.theta)*Math.sin(planeData.theta);
	
	updateLines();
}

function updateLines() {

	F1I_geometry = new THREE.TubeBufferGeometry(F1I_path, 2, 0.01, 8);
	F1I.geometry = F1I_geometry;

	F2I_geometry = new THREE.TubeBufferGeometry(F2I_path, 2, 0.01, 8);
	F2I.geometry = F2I_geometry;

	IC1_geometry = new THREE.TubeBufferGeometry(IC1_path, 2, 0.01, 8);
	IC1.geometry = IC1_geometry;

	IC2_geometry = new THREE.TubeBufferGeometry(IC2_path, 2, 0.01, 8);
	IC2.geometry = IC2_geometry;
	
}

updatePlane();

// GUI //

gui.add( planeData, 'y', -1, 1 ).onChange( updatePlane );
gui.add( planeData, 'theta', -Math.PI/2, Math.PI/2 ).onChange( updatePlane );
gui.add( planeData, 'alpha', 0, 1 ).onChange( updateLines );

// END //

scene.add( cone );
scene.add( up_cone );
scene.add( plane );
scene.add( sphere1 );
scene.add( sphere2 );
scene.add( conic );
scene.add( tg1 );
scene.add( tg2 );
scene.add( q1 );
scene.add( q2 );
scene.add( F1I );
scene.add( F2I );
scene.add( IC1 );
scene.add( IC2 );


var render = function () {

	requestAnimationFrame( render );

	renderer.render( scene, camera );

};

render();