// TODO: extract to another file
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

const polyhedron = (data, inn_material, ext_material, ext_thickness = 0.04) => {
  const inn_geometry = new THREE.Geometry();

  for (let v of data.verts) {
    inn_geometry.vertices.push( new THREE.Vector3( ...v ) );
  }

  for (let f of data.faces) {
    inn_geometry.faces.push( new THREE.Face3( ...f ) );
  }

  const ext_polyh = new THREE.Group();
  for (let vertex of inn_geometry.vertices) {
    let sph = new THREE.SphereGeometry( ext_thickness, 16, 16 );
    sph = new THREE.Mesh( sph, ext_material );
    sph.position.set(vertex.x, vertex.y, vertex.z);
    ext_polyh.add( sph );
  }

  const edges_coords = data.edges.map(
    e => [inn_geometry.vertices[e[0]],inn_geometry.vertices[e[1]]]);

  for (let ec of edges_coords) {
    ext_polyh.add( cylinder(ec[0], ec[1], ext_thickness, ext_material) );
  }

  ext_polyh.add(new THREE.Mesh( inn_geometry, inn_material ));

  return ext_polyh;
}