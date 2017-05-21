var Plasma= function(gameObj){

	this.gameObj = gameObj;
	this.parent = this.gameObj.parent;
	this.position = this.gameObj.position;
	this.velocity = this.gameObj.velocity;
	this.acceleration = this.gameObj.acceleration;
	this.scale = this.gameObj.scale;
	this.counter = 0;
	this.draggable=true;




}

Plasma.prototype.updateGameObj = function(){
	this.gameObj.position = this.position;
	this.gameObj.acceleration = this.acceleration;
	this.gameObj.velocity = this.velocity;
	this.gameObj.scale = this.scale;
	this.gameObj.parent = this.parent;
}

Plasma.prototype.move = function(dt){
	this.gameObj.move(dt);
}

Plasma.prototype.draw = function(camera){
	this.gameObj.draw(camera);
}

