var IndexedTrianglesGeometry = function(gl, jsonObject){
	
	var indices = [].concat.apply([], jsonObject.faces);
  this.gl=gl;
	this.numIndices = indices.length;

	this.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,
	    Float32Array.from(jsonObject.vertices),
	    gl.STATIC_DRAW);

    this.vertexNormalBuffer = gl.createBuffer();
  	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
  	gl.bufferData(gl.ARRAY_BUFFER,
    	Float32Array.from(jsonObject.normals),
    	gl.STATIC_DRAW);

  	this.vertexTexCoordBuffer = gl.createBuffer();
  	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTexCoordBuffer);
  	gl.bufferData(gl.ARRAY_BUFFER,
    	Float32Array.from([].concat.apply([], jsonObject.texturecoords)),
    	gl.STATIC_DRAW);

  	this.indexBuffer = gl.createBuffer();
  	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    	Uint16Array.from(indices),
    	gl.STATIC_DRAW);

    //console.log(jsonObject.texturecoords);

}


IndexedTrianglesGeometry.prototype.draw = function(){
    var gl = this.gl;
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0,
    3, gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1,
    3, gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTexCoordBuffer);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2,
    2, gl.FLOAT, //< two pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );


  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.drawElements(gl.TRIANGLES, this.numIndices, gl.UNSIGNED_SHORT, 0);
}