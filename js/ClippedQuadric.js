var ClippedQuadric =
           function(surfaceCoeffMatrix, clipperCoeffMatrix) {
  this.surfaceCoeffMatrix = surfaceCoeffMatrix;
  this.clipperCoeffMatrix = clipperCoeffMatrix;
}

ClippedQuadric.prototype.setUnitSphere = function(){
  	this.surfaceCoeffMatrix.set(1,0,0,0,
                                0,1,0,0,
                                0,0,1,0,
                                0,0,0,-1);
  	this.clipperCoeffMatrix.set(0,0,0,0,
                                0,1,0,0,
                                0,0,0,0,
                                0,0,0,-1); 
}


ClippedQuadric.prototype.setUnitCylinder = function(){
   this.surfaceCoeffMatrix.set(1,0,0,0,
                              0,0,0,0,
                              0,0,1,0,
                              0,0,0,-1);
  	   
  this.clipperCoeffMatrix.set(0,0,0,0,
                              0,1,0,0,
                              0,0,0,0,
                              0,0,0,-1); 
}

ClippedQuadric.prototype.setUnitCone = function(){
     this.surfaceCoeffMatrix.set(Math.pow(Math.cos(Math.PI/4),2), 0, 0, 0,
                                  0, -Math.pow(Math.sin(Math.PI/4),2),0,0,
                                  0,0, Math.pow(Math.cos(Math.PI/4),2),0,
                                  0,0,0,0 );
    this.clipperCoeffMatrix.set( 0,0,0,0,
                                      0,1,0,0,
                                      0,0,0,0,
                                      0,0,0,-1);

    this.transformClipper(new Mat4().set().translate(0,-1,0)); 
}

ClippedQuadric.prototype.transform = function(tMatrix){

	var T = tMatrix.invert();

	this.surfaceCoeffMatrix.premul(T);
	this.surfaceCoeffMatrix.mul(T.clone().transpose());
	this.clipperCoeffMatrix.premul(T);
	this.clipperCoeffMatrix.mul(T.clone().transpose());
}

ClippedQuadric.prototype.transformClipper = function(tMatrix){

  var T = tMatrix.invert();

  this.clipperCoeffMatrix.premul(T);
  this.clipperCoeffMatrix.mul(T.clone().transpose());


}