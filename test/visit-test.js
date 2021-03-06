var tape = require("tape"),
    d3_octree = require("../");

tape("octree.visit(callback) visits each node in a octree", function(test) {
  var results = [], q = d3_octree.octree()
      .addAll([[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]]);
  test.equal(q.visit(function(node, x0, y0, z0, x1, y1, z1) { results.push([x0, y0, z0, x1, y1, z1]); }), q);
  test.deepEqual(results, [
    [0.0, 0.0, 0.0, 1.0, 1.0, 1.0],
    [0.0, 0.0, 0.0, 0.5, 0.5, 0.5],
    [0.5, 0.0, 0.0, 1.0, 0.5, 0.5],
    [0.0, 0.5, 0.0, 0.5, 1.0, 0.5],
    [0.5, 0.5, 0.0, 1.0, 1.0, 0.5],
    [0.0, 0.0, 0.5, 0.5, 0.5, 1.0],
    [0.5, 0.0, 0.5, 1.0, 0.5, 1.0],
    [0.0, 0.5, 0.5, 0.5, 1.0, 1.0],
    [0.5, 0.5, 0.5, 1.0, 1.0, 1.0]
  ]);
  test.end();
});

tape("octree.visit(callback) applies pre-order traversal", function(test) {
  var results = [], q = d3_octree.octree()
      .extent([[0, 0, 0], [960, 960, 960]])
      .addAll([[100, 100, 100], [200, 200, 200], [300, 300, 300]]);
  test.equal(q.visit(function(node, x0, y0, z0, x1, y1, z1) { results.push([x0, y0, z0, x1, y1, z1]); }), q);
  test.deepEqual(results, [
    [  0,   0,   0, 1024, 1024, 1024],
    [  0,   0,   0,  512,  512,  512],
    [  0,   0,   0,  256,  256,  256],
    [  0,   0,   0,  128,  128,  128],
    [128, 128, 128,  256,  256,  256],
    [256, 256, 256,  512,  512,  512]
  ]);
  test.end();
});

tape("octree.visit(callback) does not recurse if the callback returns truthy", function(test) {
  var results = [], q = d3_octree.octree()
      .extent([[0, 0, 0], [960, 960, 960]])
      .addAll([[100, 100, 100], [700, 700, 700], [800, 800, 800]]);
  test.equal(q.visit(function(node, x0, y0, z0, x1, y1, z1) { results.push([x0, y0, z0, x1, y1, z1]); return x0 > 0; }), q);
  test.deepEqual(results, [
    [   0,    0,    0, 1024, 1024, 1024],
    [   0,    0,    0,  512,  512,  512],
    [ 512,  512,  512, 1024, 1024, 1024]
  ]);
  test.end();
});

tape("octree.visit(callback) on an empty octree with no bounds does nothing", function(test) {
  var results = [], q = d3_octree.octree();
  test.equal(q.visit(function(node, x0, y0, z0, x1, y1, z1) { results.push([x0, y0, z0, x1, y1, z1]); }), q);
  test.equal(results.length, 0);
  test.end();
});

tape("octree.visit(callback) on an empty octree with bounds does nothing", function(test) {
  var results = [], q = d3_octree.octree()
      .extent([[0, 0, 0], [960, 960, 960]]);
  test.equal(q.visit(function(node, x0, y0, z0, x1, y1, z1) { results.push([x0, y0, z0, x1, y1, z1]); }), q);
  test.deepEqual(results.length, 0);
  test.end();
});
