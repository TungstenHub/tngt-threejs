import init from '../utils/init.js';

import baseUrl from '../assets/provider.js';

import {
	sphBase,
  sphOrig,
  SphVertex,
  SphSegment,
	SphAngle,
  SphTriangle,
} from '../utils/spherical_geometry.js';

const {THREE, renderer, scene, camera, gui, text: expl} = init('spherical_trigonometry_relations', {
  orbitControls: true,
	gui: true,
	text: true,
  cameraPos: [2,0.5,-0.2]
});

expl.style.fontSize = 18 + 'px';
expl.style.bottom = expl.style.top;
expl.style.top = 'initial';
			
// LIGHTS //

var lights = [];
lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

lights[ 0 ].position.set( 0, 200, 0 );
lights[ 1 ].position.set( 100, 200, 100 );
lights[ 2 ].position.set( - 100, - 200, - 100 );

const light = new THREE.AmbientLight( 0x404040 )

scene.add( lights[ 0 ] );
scene.add( lights[ 1 ] );
scene.add( lights[ 2 ] );
scene.add( light );

// SPHERE //

scene.add( sphBase, sphOrig );

// RIGHT ANGLE //

const angle_geom = new THREE.PlaneBufferGeometry();
angle_geom.translate(-0.5,0.5,0);
angle_geom.scale(0.04, 0.04, 0.04);

const angle = new THREE.Mesh( 
	angle_geom, 
	new THREE.MeshBasicMaterial( { color: '#FFFFFF' } ) 
);

scene.add( angle );

// VERTICES //

const A = new SphVertex(new THREE.Vector3(1,0,0));
const B = new SphVertex(new THREE.Vector3());
const C = new SphVertex(new THREE.Vector3());
A.in(scene);
B.in(scene);
C.in(scene);

// SIDES //

const a = new SphSegment(B.position,C.position, '#2196F3');
const b = new SphSegment(C.position,A.position, '#EF6C00');
const c = new SphSegment(A.position,B.position, '#AD1457');
a.in(scene);
b.in(scene);
c.in(scene);

// ANGLE //

const alpha = new SphAngle(A.position,B.position,C.position, '#2196F3');
alpha.in(scene);

// TRIANGLE //

const t = new SphTriangle(A.position,B.position,C.position, 
new THREE.MeshPhongMaterial( { 
	color: '#FFFFFF',
	side: THREE.DoubleSide 
} ));
scene.add(t);

// TEXT //

const loader = new THREE.FontLoader();
let font;
loader.load(
	baseUrl + '/fonts/source_code_pro__medium.json',
	f => {font = f; updateTriangle();}
);

const [a_text, b_text, c_text] = 
	['#2196F3', '#EF6C00', '#AD1457'].map(c =>
		new THREE.Mesh(
			new THREE.BufferGeometry(), 
			new THREE.MeshStandardMaterial( { 
				color: c,
				emissive: c
			} )
		)
	);

a_text.rotateY(Math.PI/2);

b_text.rotateY(Math.PI/2);
b_text.position.y = -0.1;

c_text.rotateY(Math.PI/2);

scene.add(a_text, b_text, c_text);

// INTERACTIVITY //

const data = {
	a: 0.3,
	b: 0.5,
	alpha: Math.tan(0.3)/Math.sin(0.5)
};

function updateTriangle() {

	const cv = new THREE.Vector3(Math.cos(data.b), 0, -Math.sin(data.b));
	const bv = new THREE.Vector3(Math.cos(data.b)*Math.cos(data.a), Math.sin(data.a), -Math.sin(data.b)*Math.cos(data.a));
	
	B.set(bv);
	C.set(cv);

	a.set(B.position, C.position);
	b.set(C.position, A.position);
	c.set(A.position, B.position);

	t.set(A.position, B.position, C.position);

	angle.position.x = cv.x;
	angle.position.z = cv.z;
	angle.rotation.y = Math.PI/2 + data.b;

	alpha.set(A.position, B.position, C.position);

	if (font) {

		const a_mid = bv.clone().add(cv).multiplyScalar(0.5).normalize();

		a_text.geometry.dispose();
		a_text.geometry = new THREE.TextBufferGeometry( 'a = ' + (data.a*180/Math.PI).toFixed(2) + '°', {
			font: font,
			size: 0.05,
			height: 0.005,
			curveSegments: 4
		} );
		
		a_text.position.x = a_mid.x * 1.05;
		a_text.position.y = a_mid.y * 1.05;
		a_text.position.z = a_mid.z * 1.05 - 0.05;

		b_text.geometry.dispose();
		b_text.geometry = new THREE.TextBufferGeometry( 'b = ' + (data.b*180/Math.PI).toFixed(2) + '°', {
			font: font,
			size: 0.05,
			height: 0.005,
			curveSegments: 4
		} );
		
		b_text.position.x = Math.cos(data.b / 2) * 1.05;
		b_text.position.z = - Math.sin(data.b / 2) * 1.05 + 0.22;

		const c_ang = Math.acos(bv.x);
		const c_mid = A.position.clone().add(bv).multiplyScalar(0.5).normalize();

		c_text.geometry.dispose();
		c_text.geometry = new THREE.TextBufferGeometry( 'c = ' + (c_ang*180/Math.PI).toFixed(2) + '°', {
			font: font,
			size: 0.05,
			height: 0.005,
			curveSegments: 4
		} );
		
		c_text.position.x = c_mid.x * 1.05;
		c_text.position.y = c_mid.y * 1.05;
		c_text.position.z = c_mid.z * 1.05 + 0.48;

		const alpha_v = Math.atan(data.alpha);

		expl.innerHTML = 
		'α = ' + (alpha_v*180/Math.PI).toFixed(2) + '°<br>' + 
		'<b>sin(α) = sin(a) / sin(c)</b> = ' + Math.sin(data.a).toFixed(2) + ' / ' + Math.sin(c_ang).toFixed(2) + ' = ' + Math.sin(alpha_v).toFixed(2) + '<br>' + 
		'<b>cos(α) = tan(b) / tan(c)</b> = ' + Math.tan(data.b).toFixed(2) + ' / ' + Math.tan(c_ang).toFixed(2) + ' = ' + Math.cos(alpha_v).toFixed(2) + '<br>' +  
		'<b>tan(α) = tan(a) / sin(b)</b> = ' + Math.tan(data.a).toFixed(2) + ' / ' + Math.sin(data.b).toFixed(2) + ' = ' + Math.tan(alpha_v).toFixed(2);

	}
	
}

updateTriangle();

// GUI //

gui.add( data, 'a', 0.001, Math.PI/2 - 0.01 ).listen().onChange( updateA );
gui.add( data, 'b', 0.001, Math.PI/2 - 0.01 ).onChange( updateB );

function updateA() {
	data.alpha = Math.tan(data.a)/Math.sin(data.b);
	updateTriangle();
}

function updateB() {
	data.a = Math.atan(data.alpha*Math.sin(data.b));
	updateTriangle();
}

// END //

var render = function () {

	requestAnimationFrame( render );

	renderer.render( scene, camera );

};

render();