import THREE from './deps/three.js';

const spherical_strip = (a,b, width = 0.1) => new THREE.ParametricGeometry(
  ( v, u, optionalTarget ) => {

    var result = optionalTarget || new THREE.Vector3();

    var c = a.clone().cross(b).normalize();

    v = (v - 0.5) * width;

    return result.set(0,0,0)
      .addScaledVector(a,1-u)
      .addScaledVector(b, u )
      .normalize()
      .multiplyScalar(Math.sqrt(1-v*v))
      .addScaledVector(c,v);

  }, 8, 50 )

export {
  spherical_strip
}