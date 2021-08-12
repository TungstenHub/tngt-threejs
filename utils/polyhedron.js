import THREE from './deps/three.js';
import { cylinder } from './cylinder.js';

const polyhedron = (data, innMaterial, extMaterial, extThickness = 0.04) => {
  const extPolyh = new THREE.Group();

  if (innMaterial) {
    const innGeometry = new THREE.BufferGeometry();
  
    innGeometry.setFromPoints( 
      [].concat(...data.faces.map(
        f => f.map(i => new THREE.Vector3( ...data.verts[i] )) 
      ))
    );

    extPolyh.add(new THREE.Mesh( innGeometry, innMaterial ));
  }

  for (let vertex of data.verts) {
    let sph = new THREE.SphereGeometry( extThickness, 16, 16 );
    sph = new THREE.Mesh( sph, extMaterial );
    sph.position.set(...vertex);
    extPolyh.add( sph );
  }

  const edgesCoords = data.edges.map(e => [
    new THREE.Vector3(...data.verts[e[0]]), 
    new THREE.Vector3(...data.verts[e[1]])
  ]);

  for (let ec of edgesCoords) {
    extPolyh.add( cylinder(ec[0], ec[1], extThickness, extMaterial) );
  }

  return extPolyh;
}

export {
  polyhedron
}