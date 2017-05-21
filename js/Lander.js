var Lander = function(gameObject){
	
	this.gameObject = gameObject;




};

Lander.prototype.draw = function(camera){
	
	this.gameObject.draw(camera);
};

Lander.prototype.move = function(dt){
	
	this.gameObject.move(dt);
}