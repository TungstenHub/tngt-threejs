import THREE from './deps/three.js';
import { cylinder } from './cylinder.js';

const polyhedron = (data, inn_material, ext_material, ext_thickness = 0.04) => {
  const inn_geometry = new THREE.BufferGeometry();

  inn_geometry.setFromPoints( 
    [].concat(...data.faces.map(
      f => f.map(i => new THREE.Vector3( ...data.verts[i] )) 
    ))
  );

  const ext_polyh = new THREE.Group();
  for (let vertex of data.verts) {
    let sph = new THREE.SphereGeometry( ext_thickness, 16, 16 );
    sph = new THREE.Mesh( sph, ext_material );
    sph.position.set(...vertex);
    ext_polyh.add( sph );
  }

  const edges_coords = data.edges.map(e => [
    new THREE.Vector3(...data.verts[e[0]]), 
    new THREE.Vector3(...data.verts[e[1]])
  ]);

  for (let ec of edges_coords) {
    ext_polyh.add( cylinder(ec[0], ec[1], ext_thickness, ext_material) );
  }

  ext_polyh.add(new THREE.Mesh( inn_geometry, inn_material ));

  return ext_polyh;
}

export {
  polyhedron
}