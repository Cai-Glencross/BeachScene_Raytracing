var app;
var overlay;
var pendingResources = {};

// App constructor
var App = function(canvas) {
	theApp = this;
	this.keysPressed = {};
	this.clicked = false;
	this.mouseX  = 0;
	this.mouseY = 0;
	//keys pressed
	document.onkeydown= function(event){
		app.keysPressed[keyboardMap[event.keyCode]]=true;
	}
	document.onkeyup = function(event){
		app.keysPressed[keyboardMap[event.keyCode]]=false;
	}



	// set a pointer to our canvas
	this.canvas = canvas;
	
	// if no GL support, cry
	this.gl = canvas.getContext("experimental-webgl");
	if (this.gl == null) {
		alert( ">>> Browser does not support WebGL <<<" );
		return;
	}
	
	// set the initial canvas size and viewport
	this.canvas.width = this.canvas.clientWidth;
	this.canvas.height = this.canvas.clientHeight;
	this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

	// create a simple scene
	this.scene = new Scene3d(this.gl);

	document.onmousedown = function(event){
		app.scene.camera.mouseDown();
	}

	document.onmousemove = function(event){
		app.scene.camera.mouseMove(event);
	}

	document.onmouseup = function(event){
		app.scene.camera.mouseUp();
	}

	//camera resize shit
	window.addEventListener('resize', function() {
	  theApp.canvas.width = this.canvas.clientWidth;
	  theApp.canvas.height = this.canvas.clientHeight;
	  theApp.gl.viewport(0, 0,
	    this.canvas.width, this.canvas.height);
	  theApp.scene.camera.setAspectRatio(
	    this.canvas.clientWidth /
	    this.canvas.clientHeight );
});	
}

// animation frame update
App.prototype.update = function() {
	
	var pendingResourceNames = Object.keys(pendingResources);
	if(pendingResourceNames.length === 0) {
		// animate and draw scene
		this.scene.update(this.gl,this.keysPressed);
		overlay.innerHTML = "Ready.";
	} else {
		overlay.innerHTML = "Loading: " + pendingResourceNames;
	}

	// refresh
	window.requestAnimationFrame(function() {
		app.update();
	});
}

// entry point from HTML
window.addEventListener('load', function() {

	var canvas = document.getElementById("canvas");
	overlay = document.getElementById("overlay");
	overlay.innerHTML = "WebGL";

	app = new App(canvas);

	window.requestAnimationFrame(function() {
		app.update();
	});

});