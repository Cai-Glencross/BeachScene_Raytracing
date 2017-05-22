var Scene3d = function(gl){

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);


  this.camera = new PerspectiveCamera();
  this.camera.position = new Vec3(0,0,10);


  //bg Program
  this.vsBackground = new Shader(gl, gl.VERTEX_SHADER, "Bg_vs.essl");
  this.fsBackground = new Shader(gl, gl.FRAGMENT_SHADER, "Bg_fs.essl");
  this.bgProgram = new Program(gl, this.vsBackground, this.fsBackground);


    //lightsource array
    this.lightSourceArray = [];
    this.lightPositionArray = [];
    this.lightPowerDensityArray = [];
    this.lightRotationAngle=0;

    var mainLightPosition = new Vec4(0,5,10,1);
    var mainLightPowerDensity = new Vec4(.05,.05,.05,1);
    var mainLight = new LightSource(mainLightPosition,mainLightPowerDensity);
    this.lightSourceArray.push(mainLight);






    //bgMaterial
    this.bgMaterial = new Material(gl,this.bgProgram);
    //this.bgMaterial.colorTexture.set(this.bgTexture);

    //ClippedQuadrics object;

    var clippedQuadrics = [];
    var brdfs = [];

    var sphere = new Mat4().set(1,0,0,0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, -9);

    var cylinder = new Mat4().set(1,0,0,0,
            0,1,0,0,
            0,0,0,0,
            0,0,0,-2);

    var noClipper = new Mat4().set(0,0,0,0,
                                  0,0,0,0,
                                  0,0,0,0,
                                  0,0,0,-1);

    this.ball = new ClippedQuadric(sphere, noClipper);
    this.ball.transform(new Mat4().set().scale(new Vec3(.1,.1,.1)).translate(new Vec3(1,0,-6)));
    this.ballAcceleration = new Vec3(0,-.1,0);
    this.ballVelocity = new Vec3(0,-.1,0);
    this.ballPosition = new Vec3(1,0,-6);

    clippedQuadrics.push(this.ball);
    brdfs.push(new Vec4(-1,-1,-1,-1));


    var sandSphere = new Mat4().set(1,0,0,0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, -1);

    var sandSphereClipper = new Mat4().set(0,0,0,0,
                                          0,1,0,0,
                                          0,0,0,0,
                                          0,0,0,-1);

    var island = new ClippedQuadric(sandSphere, noClipper);

    island.transform(new Mat4().set().scale(new Vec3(10,.1,10)).translate(new Vec3(0,-2,-10)));


    clippedQuadrics.push(island);
    brdfs.push(new Vec4(1,1,0,1));

    var pole = new ClippedQuadric(new Mat4(), new Mat4());
    pole.setUnitCylinder();
    pole.transform(new Mat4().set().scale(.1,2,.1).translate(-4,0,-10));

    clippedQuadrics.push(pole);
    brdfs.push(new Vec4(1,1,1,1));

    var roof = new ClippedQuadric(new Mat4(),new Mat4());
    roof.setUnitSphere();
    roof.transformClipper(new Mat4().translate(0,1,0));
    roof.transform(new Mat4().scale(1.2,.5,1.2).translate(-4,1.5,-10));

    clippedQuadrics.push(roof);
    brdfs.push(new Vec4(0,0,1,1));

    var castleBase = new ClippedQuadric(new Mat4(), new Mat4());
    castleBase.setUnitCylinder();
    castleBase.transform(new Mat4().set().scale(1,.3,1).translate(0,-1.7,-10));

    clippedQuadrics.push(castleBase);
    brdfs.push(new Vec4(1,1,0,1));


    var castleCap= new ClippedQuadric(castleBase.clipperCoeffMatrix, castleBase.surfaceCoeffMatrix);

    clippedQuadrics.push(castleCap);
    brdfs.push(new Vec4(1,1,0,1));

    var castleTower1= new ClippedQuadric(new Mat4(),new Mat4());
    castleTower1.setUnitCylinder();
    castleTower1.transformClipper(new Mat4().scale(1,2,1));
    castleTower1.transform(new Mat4().set().scale(.2,1,.2).translate(0,-1.5,-9));

    clippedQuadrics.push(castleTower1);
    brdfs.push(new Vec4(1,1,0,1));

    var cone = new Mat4().set(Math.pow(Math.cos(Math.PI/4),2), 0, 0, 0,
                                  0, -Math.pow(Math.sin(Math.PI/4),2),0,0,
                                  0,0, Math.pow(Math.cos(Math.PI/4),2),0,
                                  0,0,0,0 );
    var coneClipper = new Mat4().set( 0,0,0,0,
                                      0,1,0,0,
                                      0,0,0,0,
                                      0,0,0,-1); 


    var castleTower1Roof = new ClippedQuadric(cone.clone(), coneClipper.clone());
    castleTower1Roof.transformClipper(new Mat4().set().translate(0,-1,0));
    castleTower1Roof.transform(new Mat4().set().scale(.2,.2,.2).translate(0,-.8,-9));

    clippedQuadrics.push(castleTower1Roof);
    brdfs.push(new Vec4(1,0,0,1));

    var castleTower2= new ClippedQuadric(new Mat4(),new Mat4());
    castleTower2.setUnitCylinder();
    castleTower2.transformClipper(new Mat4().scale(1,2,1));
    castleTower2.transform(new Mat4().set().scale(.2,1,.2).translate(0,-1.5,-11));

    clippedQuadrics.push(castleTower2);
    brdfs.push(new Vec4(1,1,0,1));

        var castleTower2Roof = new ClippedQuadric(cone.clone(), coneClipper.clone());
    castleTower2Roof.transformClipper(new Mat4().set().translate(0,-1,0));
    castleTower2Roof.transform(new Mat4().set().scale(.2,.2,.2).translate(0,-.8,-11));

    clippedQuadrics.push(castleTower2Roof);
    brdfs.push(new Vec4(1,0,0,1));

    var castleTower3= new ClippedQuadric(new Mat4(),new Mat4());
    castleTower3.setUnitCylinder();
    castleTower3.transformClipper(new Mat4().scale(1,2,1));
    castleTower3.transform(new Mat4().set().scale(.2,1,.2).translate(1,-1.5,-10));

    clippedQuadrics.push(castleTower3);
    brdfs.push(new Vec4(1,1,0,1));

    var castleTower3Roof = new ClippedQuadric(cone.clone(), coneClipper.clone());
    castleTower3Roof.transformClipper(new Mat4().set().translate(0,-1,0));
    castleTower3Roof.transform(new Mat4().set().scale(.2,.2,.2).translate(1,-.8,-10));

    clippedQuadrics.push(castleTower3Roof);
    brdfs.push(new Vec4(1,0,0,1));


    var castleTower4= new ClippedQuadric(new Mat4(),new Mat4());
    castleTower4.setUnitCylinder();
    castleTower4.transformClipper(new Mat4().scale(1,2,1));
    castleTower4.transform(new Mat4().set().scale(.2,1,.2).translate(-1,-1.5,-10));

    clippedQuadrics.push(castleTower4);
    brdfs.push(new Vec4(1,1,0,1));

    var castleTower4Roof = new ClippedQuadric(cone.clone(), coneClipper.clone());
    castleTower4Roof.transformClipper(new Mat4().set().translate(0,-1,0));
    castleTower4Roof.transform(new Mat4().set().scale(.2,.2,.2).translate(-1,-.8,-10));

    clippedQuadrics.push(castleTower4Roof);
    brdfs.push(new Vec4(1,0,0,1));



    var oceanPlane = new Mat4().set(0,0,0,0,
                                    0,1,0,0,
                                    0,0,0,0,
                                    0,0,0,-1);

    var oceanClipper = new Mat4().set(0,0,0,0,
                                      0,1,0,0,
                                      0,0,0,0,
                                      0,0,0,-1);

    var ocean = new ClippedQuadric(oceanPlane, oceanClipper);
    ocean.transformClipper(new Mat4().set().translate(0,1,0));
    ocean.transform(new Mat4().set().translate(0,-3,0));

    clippedQuadrics.push(ocean);
    brdfs.push(new Vec4(-2,-2,-2,-2));

    var palmTreeTrunk1 = new ClippedQuadric(new Mat4(),new Mat4());
    palmTreeTrunk1.setUnitCone();
    palmTreeTrunk1.transform(new Mat4().set().scale(.3,1.2,.3).translate(8,.5,-6));

    clippedQuadrics.push(palmTreeTrunk1);
    brdfs.push(new Vec4(139/255,69/255,19/255));

    var palmTreeTrunk2 = new ClippedQuadric(new Mat4(),new Mat4());
    palmTreeTrunk2.setUnitCone();
    palmTreeTrunk2.transform(new Mat4().set().scale(.3,1.2,.3).translate(8,2,-6));

    clippedQuadrics.push(palmTreeTrunk2);
    brdfs.push(new Vec4(139/255,69/255,19/255));

    var palmTreeTrunk3 = new ClippedQuadric(new Mat4(),new Mat4());
    palmTreeTrunk3.setUnitCone();
    palmTreeTrunk3.transform(new Mat4().set().scale(.3,1.2,.3).translate(8,3.5,-6));

    clippedQuadrics.push(palmTreeTrunk3);
    brdfs.push(new Vec4(139/255,69/255,19/255));

    var palmLeaf1 = new ClippedQuadric(new Mat4(), new Mat4());
    palmLeaf1.setUnitSphere();
    palmLeaf1.transformClipper(new Mat4().set().translate(0,1.5,0));
    palmLeaf1.transform(new Mat4().set().scale(1,.4,.2).translate(8.8,3.2,-6));

    clippedQuadrics.push(palmLeaf1);
    brdfs.push(new Vec4(0,1,0,1));

    var palmLeaf2 = new ClippedQuadric(new Mat4(), new Mat4());
    palmLeaf2.setUnitSphere();
    palmLeaf2.transformClipper(new Mat4().set().translate(0,1.5,0));
    palmLeaf2.transform(new Mat4().set().scale(1,.4,.2).rotate(Math.PI/4,0,1,0).translate(7.4,3.2,-5.5));

    clippedQuadrics.push(palmLeaf2);
    brdfs.push(new Vec4(0,1,0,1));

    var palmLeaf3 = new ClippedQuadric(new Mat4(), new Mat4());
    palmLeaf3.setUnitSphere();
    palmLeaf3.transformClipper(new Mat4().set().translate(0,1.5,0));
    palmLeaf3.transform(new Mat4().set().scale(1,.4,.2).rotate(-Math.PI/3,0,1,0).translate(7.65,3.2,-6.7));

    clippedQuadrics.push(palmLeaf3);
    brdfs.push(new Vec4(0,1,0,1));






    




    var j = 0;
    for (var i = 0; i < clippedQuadrics.length; i++) {
      this.bgMaterial.quadrics[j].set(clippedQuadrics[i].surfaceCoeffMatrix);
      j++;
      this.bgMaterial.quadrics[j].set(clippedQuadrics[i].clipperCoeffMatrix);
      j++;
      this.bgMaterial.brdfs[i].set(brdfs[i]);
    };





    this.bgQuad = new QuadGeometry(gl);
    this.bgMesh = new Mesh(this.bgQuad,this.bgMaterial);
    this.bgObject = new GameObject2D(this.bgMesh);

    this.timeElapsed=0.0;




}

Scene3d.prototype.update = function(gl, keysPressed){
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // clear the screen
  gl.clear(gl.COLOR_BUFFER_BIT);




  this.lightPositionArray = [];
  this.lightPowerDensityArray = [];

  for (var i = this.lightSourceArray.length - 1; i >= 0; i--) {
    this.lightPositionArray.push(this.lightSourceArray[i].position);
    this.lightPowerDensityArray.push(this.lightSourceArray[i].powerDensity);
  };

  var timeAtThisFrame = new Date().getTime();
   var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
   this.timeAtLastFrame = timeAtThisFrame;

   this.camera.move(dt,keysPressed);

    if(this.ballVelocity.y<0.0&&this.ballPosition.y<-.115){
      this.ballVelocity.y = -this.ballVelocity.y;
      if (this.ballVelocity.y<.01){
        this.ballAcceleration= new Vec3(0,0,0);
        this.ballVelocity = new Vec3(0,0,0);
      }

    }
    this.ballVelocity.add(this.ballAcceleration.times(dt));
    this.ballPosition.add(this.ballVelocity.times(dt));

    this.ball.transform(new Mat4().set().translate(this.ballVelocity));
    this.bgMaterial.quadrics[0].set(this.ball.surfaceCoeffMatrix);
    this.bgMaterial.quadrics[1].set(this.ball.clipperCoeffMatrix);

    if (dt >0.0){
      this.timeElapsed+=dt;
    }


    this.bgMaterial.dt.set(this.timeElapsed);







  this.bgObject.draw(this.camera,this.lightPositionArray,this.lightPowerDensityArray);

}

