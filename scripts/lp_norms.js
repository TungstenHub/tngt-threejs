import init from '../utils/init.js';

import MarchingCubes from '../utils/deps/marchingCubes.js';

const {THREE, renderer, scene, camera, gui} = init('lp_norms', {
  gui: true,
  orbitControls: true,
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

const normData = {
  p: 2
};

const normValue = function (data, x, y, z) {
  return Math.pow(Math.abs(x), data.p) + 
         Math.pow(Math.abs(y), data.p) + 
         Math.pow(Math.abs(z), data.p) - 1;
}

var res = 50;
var width = 2.2;
var material = new THREE.MeshPhongMaterial( {
  color: '#1565C0', // blue 800
  transparent: true,
  opacity: 0.8,
  side: THREE.DoubleSide,
  flatShading: false
} );

const ball = new MarchingCubes( res, material );
ball.isolation = 0;

for ( var k = 0 ; k < res ; k++ ) {
  for ( var j = 0 ; j < res ; j++ ) {
    for ( var i = 0 ; i < res ; i++ ) {

    var x = width*(i-res/2)/res;
    var y = width*(j-res/2)/res;
    var z = width*(k-res/2)/res;

    ball.field[ i + j*res + k*res*res ] = normValue(normData,x,z,y); // to have z as height

    }
  }
}

scene.add( ball );

// GUI //

const updateBall = function () {
  ball.reset();
  for ( var k = 0 ; k < res ; k++ ) {
    for ( var j = 0 ; j < res ; j++ ) {
      for ( var i = 0 ; i < res ; i++ ) {

      var x = width*(i-res/2)/res;
      var y = width*(j-res/2)/res;
      var z = width*(k-res/2)/res;

      ball.field[ i + j*res + k*res*res ] = normValue(normData,x,z,y); // to have z as height

      }
    }
  }
}

var special_norms = gui.addFolder( 'Special norms' );
special_norms.add({ norm0_5 :function(){ 
  normData.p = 0.5;
  updateBall(); }},'norm0_5').name("L-0.5 norm");
special_norms.add({ norm1 :function(){ 
  normData.p = 1;
  updateBall(); }},'norm1').name("L1 norm");
special_norms.add({ norm2 :function(){ 
  normData.p = 2;
  updateBall(); }},'norm2').name("L2 norm");
special_norms.add({ norm5 :function(){ 
  normData.p = 5;
  updateBall(); }},'norm5').name("L5 norm");
special_norms.add({ norm_inf :function(){ 
  normData.p = 100;
  updateBall(); }},'norm_inf').name("L-inf norm");
special_norms.open();

var parameters = gui.addFolder( 'Parameters' );
parameters.add( normData, 'p', 0, 10 ).listen().onChange( updateBall );
parameters.open();

// END //

var render = function () {

  requestAnimationFrame( render );

  renderer.render( scene, camera );

};

render();
