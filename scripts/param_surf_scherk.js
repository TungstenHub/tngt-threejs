import init from '../utils/init.js';

const {THREE, renderer, scene, camera, gui} = init('param_surf_scherk', {
  gui: true,
  orbitControls: true,
  cameraPos: [0,0,3]
});

// LIGHTS //

var lights = [];
lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

lights[ 0 ].position.set( 0, 200, 0 );
lights[ 1 ].position.set( 100, 200, 100 );
lights[ 2 ].position.set( - 100, - 200, - 100 );

var light = new THREE.AmbientLight( 0x404040 ); 

scene.add( light );
scene.add( lights[ 0 ] );
scene.add( lights[ 1 ] );
scene.add( lights[ 2 ] );

// OBJECT //

const surfaceData = {
	showOther: false,
	u: 1,
	v: 1
};

const surfaceParamGenerator = function (data) {
	
	return function ( u, v, optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();

		u -= 0.5;
		u *= data.u;
		v -= 0.5;
		v *= data.v;

		u *= Math.PI;
		v *= Math.PI;

		const x = u;
		const z = v;
		const y = Math.log(Math.cos(u)/Math.cos(v));

		return result.set( x, y, z );

	}
}

var geometry = new THREE.ParametricGeometry( surfaceParamGenerator(surfaceData), 32, 32 );
var material = new THREE.MeshPhongMaterial( {
	color: '#1565C0', // blue 800
	transparent: true,
	opacity: 0.8,
	side: THREE.DoubleSide,
	flatShading: true
} );
var wire_material = new THREE.LineBasicMaterial( {
	color: 0xffffff,
	transparent: true,
	opacity: 0.5
} );

var obj = new THREE.Mesh( geometry, material );
obj.add( new THREE.LineSegments(new THREE.WireframeGeometry(geometry), wire_material) );

var obj1 = new THREE.Mesh( geometry, material );
obj1.add( new THREE.LineSegments(new THREE.WireframeGeometry(geometry), wire_material) );
var obj2 = new THREE.Mesh( geometry, material );
obj2.add( new THREE.LineSegments(new THREE.WireframeGeometry(geometry), wire_material) );
var obj3 = new THREE.Mesh( geometry, material );
obj3.add( new THREE.LineSegments(new THREE.WireframeGeometry(geometry), wire_material) );
var obj4 = new THREE.Mesh( geometry, material );
obj4.add( new THREE.LineSegments(new THREE.WireframeGeometry(geometry), wire_material) );
obj1.position.x += Math.PI;
obj2.position.x += Math.PI;
obj3.position.x -= Math.PI;
obj4.position.x -= Math.PI;
obj1.position.z += Math.PI;
obj2.position.z -= Math.PI;
obj3.position.z += Math.PI;
obj4.position.z -= Math.PI;
obj1.visible = false;
obj2.visible = false;
obj3.visible = false;
obj4.visible = false;


function updateSurface() {
	geometry = new THREE.ParametricGeometry( surfaceParamGenerator(surfaceData), 32, 32 );
	obj.geometry.dispose();
	obj.geometry = geometry;
	obj.children[0] = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), wire_material);
}

updateSurface();

// GUI //

gui.add( surfaceData, 'showOther' ).onChange( () => {
	obj1.visible = surfaceData.showOther;
	obj2.visible = surfaceData.showOther;
	obj3.visible = surfaceData.showOther;
	obj4.visible = surfaceData.showOther;
} );

var folder = gui.addFolder( 'Parameter Range' );

folder.add( surfaceData, 'u', 0, 1 ).onChange( updateSurface );
folder.add( surfaceData, 'v', 0, 1 ).onChange( updateSurface );

// END //

scene.add( obj );
scene.add( obj1 );
scene.add( obj2 );
scene.add( obj3 );
scene.add( obj4 );

var render = function () {

	requestAnimationFrame( render );

	renderer.render( scene, camera );

};

render();