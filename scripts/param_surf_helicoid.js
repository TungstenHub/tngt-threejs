import init from '../utils/init.js';

const {THREE, renderer, scene, camera, gui} = init('param_surf_helicoid', {
  gui: true,
  orbitControls: true,
  cameraPos: [0,0,10]
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
	a: 0.5,
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

		u *= 6*Math.PI;
		v *= 6;

		const x = Math.cos(u) * v;
		const z = Math.sin(u) * v;
		const y = data.a*u;

		return result.set( x, y, z );

	}
}

var geometry = new THREE.ParametricGeometry( surfaceParamGenerator(surfaceData), 128, 64 );
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


function updateSurface() {
	geometry = new THREE.ParametricGeometry( surfaceParamGenerator(surfaceData), 128, 64 );
	obj.geometry.dispose();
	obj.geometry = geometry;
	obj.children[0] = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), wire_material);
}

updateSurface();

// GUI //

gui.add( surfaceData, 'a', 0, 1 ).onChange( updateSurface );

var folder = gui.addFolder( 'Parameter Range' );

folder.add( surfaceData, 'u', 0, 1 ).onChange( updateSurface );
folder.add( surfaceData, 'v', 0, 1 ).onChange( updateSurface );

// END //

scene.add( obj );

var render = function () {

	requestAnimationFrame( render );

	renderer.render( scene, camera );

};

render();