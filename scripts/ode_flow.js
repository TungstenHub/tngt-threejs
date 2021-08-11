import init from '../utils/init.js';

const {THREE, renderer, scene, camera, gui} = init('ode_flow', {
	gui: true,
  orbitControls: true,
  cameraFar: 500,
  cameraPos: [50,-50,0],
	cameraUp: [0, 0, 1],
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

const geometry = new THREE.SphereGeometry( 0.5, 32, 32 );
const material_white = new THREE.MeshLambertMaterial( {
	color: '#FFFFFF', 
} );
const material_blue = new THREE.MeshLambertMaterial( {
	color: '#1565C0', // blue 800
} );

const n = 8;
const points = [];

const add_cube = function () {
	for (let i=-n+1; i<=n; i++) {
		for (let j=-n+1; j<=n; j++) {
			for (let k=-n+1; k<=n; k++) {
				const a = (i==-n+1 || i==n);
				const b = (j==-n+1 || j==n);
				const c = (k==-n+1 || k==n);
				if (a || b || c) {
					let sphere;
					if ((a && b) || (b && c) || (c && a)) {
						sphere = new THREE.Mesh( geometry, material_blue );
					} else {
						sphere = new THREE.Mesh( geometry, material_white );
					}
					sphere.position.x = 2*(i-0.5);
					sphere.position.y = 2*(j-0.5);
					sphere.position.z = 2*(k-0.5);
					scene.add( sphere );
					points.push( sphere )
				}
			}
		}
	}
}

add_cube();

const eta = 0.002;

const diff_eq = {dx: '10*(y-x)', dy: 'x*(28-(z+27))-y', dz: 'x*y-8/3*(z+27)'};

let flow;

const update_flow = function () {
	const f_str = '(function (point) { \
	const x = point.position.x; \
	const y = point.position.y; \
	const z = point.position.z; \
	point.position.x += eta*(' + diff_eq.dx + '); \
	point.position.y += eta*(' + diff_eq.dy + '); \
	point.position.z += eta*(' + diff_eq.dz + ');})';
	flow = eval(f_str);
}

update_flow();

const options = {move: true};

// GUI //

gui.add( options, 'move').name("Flow");
gui.add({ reset_flow: function(){
	points.forEach(function(item, index, array) {
		scene.remove(item);
	});			
	add_cube();
}},'reset_flow').name("Reset");
gui.add( diff_eq, 'dx').name("x'").listen().onChange( update_flow );
gui.add( diff_eq, 'dy').name("y'").listen().onChange( update_flow );
gui.add( diff_eq, 'dz').name("z'").listen().onChange( update_flow );

// END //

const render = function () {

	requestAnimationFrame( render );

	if (options.move) {
		points.forEach(function(item, index, array) {
			flow(item);
		});
	}

	renderer.render( scene, camera );

};

render();