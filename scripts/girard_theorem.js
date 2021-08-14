import init from '../utils/init.js';

import {
	sphBase,
  sphOrig,
  SphVertex,
  SphSegment,
	SphAngle,
  SphTriangle,
} from '../utils/spherical_geometry.js';

const {THREE, renderer, scene, camera, gui} = init('girard_theorem', {
  orbitControls: true,
	gui: true,
	guiWidth: 200,
  cameraPos: [1.8,0.2,0.6]
});
			
// LIGHTS //

const lights = [];
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

// COLORS & MATERIALS //

const white =  '#FFFFFF';
const blue =   '#2196F3';
const orange = '#EF6C00';
const pink =   '#AD1457';

const phong = (color, opacity=1) => new THREE.MeshPhongMaterial( { 
	color,
	side: THREE.DoubleSide,
	transparent: opacity != 1,
  opacity: opacity, 
} );

// SPHERE //

scene.add( sphBase, sphOrig );

// VERTICES //

const A = new SphVertex(new THREE.Vector3());
const B = new SphVertex(new THREE.Vector3());
const C = new SphVertex(new THREE.Vector3());
const Ah = new SphVertex(new THREE.Vector3());
const Bh = new SphVertex(new THREE.Vector3());
const Ch = new SphVertex(new THREE.Vector3());
A.in(scene);
B.in(scene);
C.in(scene);
Ah.in(scene);
Bh.in(scene);
Ch.in(scene);

// SIDES //

const a  = new SphSegment(B.position,  C.position,  blue);
const a1 = new SphSegment(C.position,  Bh.position, blue, false);
const a2 = new SphSegment(Bh.position, Ch.position, blue, false);
const a3 = new SphSegment(Ch.position, B.position,  blue, false);
const b  = new SphSegment(C.position,  A.position,  orange);
const b1 = new SphSegment(A.position,  Ch.position, orange, false);
const b2 = new SphSegment(Ch.position, Ah.position, orange, false);
const b3 = new SphSegment(Ah.position, C.position,  orange, false);
const c  = new SphSegment(A.position,  B.position,  pink);
const c1 = new SphSegment(B.position,  Ah.position, pink, false);
const c2 = new SphSegment(Ah.position, Bh.position, pink, false);
const c3 = new SphSegment(Bh.position, A.position,  pink, false);
a.in(scene); a1.in(scene); a2.in(scene); a3.in(scene);
b.in(scene); b1.in(scene); b2.in(scene); b3.in(scene);
c.in(scene); c1.in(scene); c2.in(scene); c3.in(scene);

// ANGLES //

const alpha = new SphAngle(A.position,B.position,C.position, blue);
const beta  = new SphAngle(B.position,C.position,A.position, orange);
const gamma = new SphAngle(C.position,A.position,B.position, pink);
alpha.in(scene);
beta.in(scene);
gamma.in(scene);

// TRIANGLE //

const t     = new SphTriangle(A .position,B .position,C .position, phong(white));
const t_a   = new SphTriangle(Ah.position,B .position,C .position, phong(blue,   0.5));
const t_b   = new SphTriangle(A .position,Bh.position,C .position, phong(orange, 0.5));
const t_c   = new SphTriangle(A .position,B .position,Ch.position, phong(pink,   0.5));
const t_a_h = new SphTriangle(A .position,B .position,C .position, phong(blue,   0.5));
const t_b_h = new SphTriangle(A .position,B .position,C .position, phong(orange, 0.5));
const t_c_h = new SphTriangle(A .position,B .position,C .position, phong(pink,   0.5));
const t_h   = new SphTriangle(Ah.position,Bh.position,Ch.position, phong(white,  1));
scene.add(t, t_h, t_a, t_b, t_c, t_a_h, t_b_h, t_c_h);
[t_a_h, t_b_h, t_c_h, t_h].forEach(t => t.visible = false);

// INTERACTIVITY //

const data = {
	a: 0.3,
	b: 0.3,
	c: 0.3,
	T: true,
	A: true,
	B: true,
	C: true,
	'T \'': false,
	'A \'': false,
	'B \'': false,
	'C \'': false,
};

const updateTriangle = () => {

	const av = new THREE.Vector3(Math.cos(data.a), Math.sin(data.a), 0);
	const bv = new THREE.Vector3(Math.cos(data.b), -Math.sin(data.b)/2, -Math.sqrt(3)*Math.sin(data.b)/2);
	const cv = new THREE.Vector3(Math.cos(data.c), -Math.sin(data.c)/2,  Math.sqrt(3)*Math.sin(data.c)/2);
	
	A.set(av);
	B.set(bv);
	C.set(cv);

	Ah.set(new THREE.Vector3(-av.x, -av.y, -av.z));
	Bh.set(new THREE.Vector3(-bv.x, -bv.y, -bv.z));
	Ch.set(new THREE.Vector3(-cv.x, -cv.y, -cv.z));

	a .set(B.position,  C.position );
	a1.set(C.position,  Bh.position);
	a2.set(Bh.position, Ch.position);
	a3.set(Ch.position, B.position );
	b .set(C.position,  A.position );
	b1.set(A.position,  Ch.position);
	b2.set(Ch.position, Ah.position);
	b3.set(Ah.position, C.position );
	c .set(A.position,  B.position );
	c1.set(B.position,  Ah.position);
	c2.set(Ah.position, Bh.position);
	c3.set(Bh.position, A.position );

	t    .set(A .position, B .position, C .position);
	t_a  .set(Ah.position, B .position, C .position);
  t_b  .set(A .position, Bh.position, C .position);
  t_c  .set(A .position, B .position, Ch.position);
	t_a_h.set(A .position, Bh.position, Ch.position);
  t_b_h.set(Ah.position, B .position, Ch.position);
  t_c_h.set(Ah.position, Bh.position, C .position);
	t_h  .set(Ah.position, Bh.position, Ch.position);

	alpha.set(A.position, B.position, C.position);
	beta.set(B.position, C.position, A.position);
	gamma.set(C.position, A.position, B.position);
	
}

const updateVisibility = (triangle, label) => () => {
	triangle.visible = data[label];
};

updateTriangle();

// GUI //

gui.add( data, 'a', 0.15, Math.PI/2 - 0.1 ).onChange( updateTriangle );
gui.add( data, 'b', 0.15, Math.PI/2 - 0.1 ).onChange( updateTriangle );
gui.add( data, 'c', 0.15, Math.PI/2 - 0.1 ).onChange( updateTriangle );
gui.add( data, 'T' ).onChange( updateVisibility(t,   'T') );
gui.add( data, 'A' ).onChange( updateVisibility(t_a, 'A') );
gui.add( data, 'B' ).onChange( updateVisibility(t_b, 'B') );
gui.add( data, 'C' ).onChange( updateVisibility(t_c, 'C') );
gui.add( data, 'T \'' ).onChange( updateVisibility(t_h,   'T \'') );
gui.add( data, 'A \'' ).onChange( updateVisibility(t_a_h, 'A \'') );
gui.add( data, 'B \'' ).onChange( updateVisibility(t_b_h, 'B \'') );
gui.add( data, 'C \'' ).onChange( updateVisibility(t_c_h, 'C \'') );

// END //

const render = function () {

	requestAnimationFrame( render );

	renderer.render( scene, camera );

};

render();