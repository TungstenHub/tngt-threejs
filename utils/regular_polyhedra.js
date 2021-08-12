const polyhData = {
  tetr: {
    verts: [
      [ 1/Math.sqrt(3),  1/Math.sqrt(3),  1/Math.sqrt(3)],
      [ 1/Math.sqrt(3), -1/Math.sqrt(3), -1/Math.sqrt(3)],
      [-1/Math.sqrt(3),  1/Math.sqrt(3), -1/Math.sqrt(3)],
      [-1/Math.sqrt(3), -1/Math.sqrt(3),  1/Math.sqrt(3)]
    ],
    edges: [
      [0, 1], 
      [0, 2], 
      [0, 3], 
      [1, 2], 
      [1, 3], 
      [2, 3]
    ],
    faces: [
      [0, 1, 2],
      [0, 3, 1],
      [0, 2, 3],
      [1, 3, 2]
    ],
  },
  cube: {
    verts: [
      [ 1/Math.sqrt(3),  1/Math.sqrt(3),  1/Math.sqrt(3)],
      [ 1/Math.sqrt(3),  1/Math.sqrt(3), -1/Math.sqrt(3)],
      [ 1/Math.sqrt(3), -1/Math.sqrt(3),  1/Math.sqrt(3)],
      [ 1/Math.sqrt(3), -1/Math.sqrt(3), -1/Math.sqrt(3)],
      [-1/Math.sqrt(3),  1/Math.sqrt(3),  1/Math.sqrt(3)],
      [-1/Math.sqrt(3),  1/Math.sqrt(3), -1/Math.sqrt(3)],
      [-1/Math.sqrt(3), -1/Math.sqrt(3),  1/Math.sqrt(3)],
      [-1/Math.sqrt(3), -1/Math.sqrt(3), -1/Math.sqrt(3)],
    ],
    edges: [
      [0, 1], 
      [2, 3], 
      [4, 5], 
      [6, 7], 
      [0, 2], 
      [1, 3],
      [4, 6], 
      [5, 7],
      [0, 4], 
      [1, 5],
      [2, 6], 
      [3, 7],
    ],
    faces: [
      [0, 1, 2],
      [3, 2, 1],
      [4, 5, 6],
      [7, 6, 5],
      [0, 4, 2],
      [6, 2, 4],
      [1, 5, 3],
      [7, 3, 5],
      [0, 1, 4],
      [5, 4, 1],
      [2, 3, 6],
      [7, 6, 3]
    ],
  },
  oct: {
    verts: [
      [ 1, 0, 0],
      [-1, 0, 0],
      [ 0, 1, 0],
      [ 0,-1, 0],
      [ 0, 0, 1],
      [ 0, 0,-1],
    ],
    edges: [
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
      [2, 4],
      [4, 3],
      [3, 5],
      [5, 2],
    ],
    faces: [
      [0, 2, 4],
      [0, 2, 5],
      [0, 3, 4],
      [0, 3, 5],
      [1, 2, 4],
      [1, 2, 5],
      [1, 3, 4],
      [1, 3, 5]
    ],
  },
  dodec: {
    verts: [
      [-0.9822866114758778, 0, 0.18760062803311447],
      [0.9822866114758778, 0, -0.18760062803311447],
      [-0.30354339137881814, -0.9342135312589209, 0.18760062803311447],
      [-0.30354339137881814, 0.9342135312589209, 0.18760062803311447],
      [0.7946902654867257, -0.5773743933771053, 0.18760062803311447],
      [0.7946902654867257, 0.5773743933771053, 0.18760062803311447],
      [-0.18760062803311447, -0.5773743933771053, 0.7946902654867257],
      [-0.18760062803311447, 0.5773743933771053, 0.7946902654867257],
      [-0.49114401941193264, -0.35683699685983444, -0.7946902654867257],
      [-0.49114401941193264, 0.35683699685983444, -0.7946902654867257],
      [0.49114401941193264, -0.35683699685983444, 0.7946902654867257],
      [0.49114401941193264, 0.35683699685983444, 0.7946902654867257],
      [0.6070874964316301, 0, -0.7946902654867257],
      [-0.7946902654867257, -0.5773743933771053, -0.18760062803311447],
      [-0.7946902654867257, 0.5773743933771053, -0.18760062803311447],
      [-0.6070874964316301, 0, 0.7946902654867257],
      [0.18760062803311447, -0.5773743933771053, -0.7946902654867257],
      [0.18760062803311447, 0.5773743933771053, -0.7946902654867257],
      [0.30354339137881814, -0.9342135312589209, -0.18760062803311447],
      [0.30354339137881814, 0.9342135312589209, -0.18760062803311447]
    ],
    edges: [
      [0, 13],
      [0, 14],
      [0, 15],
      [1, 4],
      [1, 5],
      [1, 12],
      [2, 6],
      [2, 13],
      [2, 18],
      [3, 7],
      [3, 14],
      [3, 19],
      [4, 10],
      [4, 18],
      [5, 11],
      [5, 19],
      [6, 10],
      [6, 15],
      [7, 11],
      [7, 15],
      [8, 9],
      [8, 13],
      [8, 16],
      [9, 14],
      [9, 17],
      [10, 11],
      [12, 16],
      [12, 17],
      [16, 18],
      [17, 19]
    ],
    faces: [
      [14, 9, 8],
      [14, 8, 13],
      [14, 13, 0],
      [1, 5, 11],
      [1, 11, 10],
      [1, 10, 4],
      [4, 10, 6],
      [4, 6, 2],
      [4, 2, 18],
      [10, 11, 7],
      [10, 7, 15],
      [10, 15, 6],
      [11, 5, 19],
      [11, 19, 3],
      [11, 3, 7],
      [5, 1, 12],
      [5, 12, 17],
      [5, 17, 19],
      [1, 4, 18],
      [1, 18, 16],
      [1, 16, 12],
      [3, 19, 17],
      [3, 17, 9],
      [3, 9, 14],
      [17, 12, 16],
      [17, 16, 8],
      [17, 8, 9],
      [16, 18, 2],
      [16, 2, 13],
      [16, 13, 8],
      [2, 6, 15],
      [2, 15, 0],
      [2, 0, 13],
      [15, 7, 3],
      [15, 3, 14],
      [15, 14, 0]
    ],
  },
  icos: {
    verts: [
      [0, 0, -1],
      [0, 0, 1],
      [-0.8944269376073148, 0, -0.4472129430728127],
      [0.8944269376073148, 0, 0.4472129430728127],
      [0.7236064715364063, -0.5257308447338067, -0.4472129430728127],
      [0.7236064715364063, 0.5257308447338067, -0.4472129430728127],
      [-0.7236064715364063, -0.5257308447338067, 0.4472129430728127],
      [-0.7236064715364063, 0.5257308447338067, 0.4472129430728127],
      [-0.27639352846359366, -0.8506503816280201, -0.4472129430728127],
      [-0.27639352846359366, 0.8506503816280201, -0.4472129430728127],
      [0.27639352846359366, -0.8506503816280201, 0.4472129430728127],
      [0.27639352846359366, 0.8506503816280201, 0.4472129430728127]
    ],
    edges: [
      [0, 2],
      [0, 4],
      [0, 5],
      [0, 8],
      [0, 9],
      [1, 3],
      [1, 6],
      [1, 7],
      [1, 10],
      [1, 11],
      [2, 6],
      [2, 7],
      [2, 8],
      [2, 9],
      [3, 4],
      [3, 5],
      [3, 10],
      [3, 11],
      [4, 5],
      [4, 8],
      [4, 10],
      [5, 9],
      [5, 11],
      [6, 7],
      [6, 8],
      [6, 10],
      [7, 9],
      [7, 11],
      [8, 10],
      [9, 11]
    ],
    faces: [
      [1, 11, 7],
      [1, 7, 6],
      [1, 6, 10],
      [1, 10, 3],
      [1, 3, 11],
      [4, 8, 0],
      [5, 4, 0],
      [9, 5, 0],
      [2, 9, 0],
      [8, 2, 0],
      [11, 9, 7],
      [7, 2, 6],
      [6, 8, 10],
      [10, 4, 3],
      [3, 5, 11],
      [4, 10, 8],
      [5, 3, 4],
      [9, 11, 5],
      [2, 7, 9],
      [8, 6, 2]
    ],
  }
};

export {
  polyhData
}