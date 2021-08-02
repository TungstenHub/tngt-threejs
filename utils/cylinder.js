import THREE from './deps/three.js';

const cylinder = function (A, B, thickness, material) {
  var vec = B.clone(); vec.sub(A);
  var h = vec.length();
  vec.normalize();
  var quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vec);
  var geometry = new THREE.CylinderGeometry(thickness, thickness, h, 16);
  geometry.translate(0, h / 2, 0);
  var cylinder = new THREE.Mesh(geometry, material);
  cylinder.applyQuaternion(quaternion);
  cylinder.position.set(A.x, A.y, A.z);
  return cylinder;
};

export {
  cylinder
}