import THREE from './deps/three.js';

const _sphBase = () => {
  const geometry = new THREE.SphereBufferGeometry( 0.99, 50, 25, 0, Math.PI *2, -0.001, Math.PI + 0.002 );
  const edges = new THREE.EdgesGeometry( geometry );
  const sphere = new THREE.LineSegments( edges );
  sphere.material.linewidth = 1;
  sphere.material.opacity = 0.3;
  sphere.material.transparent = true;
  return sphere;
};

const sphBase = _sphBase();

const sphOrig = new THREE.Mesh( 
  new THREE.SphereBufferGeometry( 0.005, 16, 16 ), 
  new THREE.MeshBasicMaterial( { color: '#FFFFFF' } ) 
); 

class SphVertex {
  constructor(a) {
    this.vert = new THREE.Mesh( 
      new THREE.SphereBufferGeometry( 0.013, 16, 16 ), 
      new THREE.MeshBasicMaterial( { color: '#FFFFFF' } ) 
    );
    this.line = [];
    for (let i = 0; i < 16; i++) {
      this.line.push(
        new THREE.Line( 
          new THREE.BufferGeometry(), 
          new THREE.LineBasicMaterial( { 
            linewidth: 4, 
            color: '#FFFFFF', 
            transparent: true, 
            opacity: (15-i)/16 
          } ) 
        )
      );
    }
    this.set(a);
  }

  set(a) {
    this.a = a;
    
    this.vert.position.x = this.a.x;
    this.vert.position.y = this.a.y;
    this.vert.position.z = this.a.z;
    this.line.forEach((l,i) => {
      l.geometry.dispose();
      l.geometry = new THREE.BufferGeometry().setFromPoints([ 
        this.a.clone().multiplyScalar( i/16 ),
        this.a.clone().multiplyScalar( (i+1)/16 ),
      ]);
    });
  }

  get position() {return this.a; }

  in(scene) {
    scene.add(this.vert);
    scene.add(...this.line);
  }
}

class SphSegment {
  constructor(a, b, color, angle=true) {
    const seg_mat = new THREE.MeshPhongMaterial( { 
      color,
      side: THREE.DoubleSide
    } );
    this.seg = new THREE.Mesh(new THREE.BufferGeometry(), seg_mat);
    if (angle) {
      const ang_mat = new THREE.MeshStandardMaterial( { 
        color,
        emissive: color,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
      } );
      this.ang = new THREE.Mesh(new THREE.BufferGeometry(), ang_mat);
    }
    this.set(a,b);
  }

  static seg(a,b) {

    const curve = new THREE.Curve()

    curve.getPoint = function ( alpha ) {
      return new THREE.Vector3()
        .addScaledVector(a, 1 - alpha)
        .addScaledVector(b, alpha)
        .normalize();
    };

    return new THREE.TubeBufferGeometry(curve, 64, 0.01, 16);
  }

  static ang(a,b) {

    const func = (u,v,target) => 
      target.set(0,0,0)
        .addScaledVector(a, 1 - u)
        .addScaledVector(b, u)
        .normalize()
        .multiplyScalar(0.4 * v - 0.001);

    return new THREE.ParametricBufferGeometry( func, 16, 16 );
  }

  update() {
    this.seg.geometry.dispose();
    this.seg.geometry = SphSegment.seg(this.a, this.b);
    if (this.ang) {
      this.ang.geometry.dispose();
      this.ang.geometry = SphSegment.ang(this.a, this.b);
    }
  }

  set(a,b) {
    this.a = a;
    this.b = b;
    this.update();
  }

  in(scene) {
    scene.add(this.seg);
    if (this.ang) scene.add(this.ang);
  }
}

class SphAngle {
  constructor(a,b,c, color) {
    const ang_mat = new THREE.MeshStandardMaterial( { 
      color,
      emissive: color,
      emissiveIntensity: 0.1,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide
    } );
    this.ang = new THREE.Mesh(new THREE.BufferGeometry(), ang_mat);
    this.set(a,b,c);
  }

  static ang(a,b,c) {
    const bb = b.clone().cross(a).cross(a).normalize().multiplyScalar(-1);
    const cc = c.clone().cross(a).cross(a).normalize().multiplyScalar(-1);
    const func = (u,v,target) => 
      target.set(0,0,0)
        .add(bb)
        .lerp(cc, u)
        .normalize()
        .multiplyScalar(0.1 * v)
        .add(a)
        .normalize()
        .multiplyScalar(1.001);

    return new THREE.ParametricBufferGeometry( func, 16, 16 );
  }

  update() {
    this.ang.geometry.dispose();
    this.ang.geometry = SphAngle.ang(this.a, this.b, this.c);
  }

  set(a,b,c) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.update();
  }

  in(scene) {
    scene.add(this.ang);
  }
}

class SphTriangle extends THREE.Mesh {
  constructor(a, b, c, mat) {
    super(new THREE.BufferGeometry(), mat);
    this.set(a,b,c);
  }

  static of(a,b,c) {

    const func = (u,v,target) => 
      target.set(0,0,0)
        .addScaledVector(a, (1-u)*(1-v))
        .addScaledVector(b, u*(1-v))
        .addScaledVector(c, v)
        .normalize();

    return new THREE.ParametricBufferGeometry( func, 128, 64 );
  }

  update() {
    this.geometry.dispose();
    this.geometry = SphTriangle.of(this.a, this.b, this.c);
  }

  set(a,b,c) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.update();
  }
}

export {
  sphBase,
  sphOrig,
  SphVertex,
  SphSegment,
  SphAngle,
  SphTriangle,
}