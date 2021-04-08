var cells = [];

function setup() {     
  createCanvas(800, 600);
	for (i = 0; i < 10; i++)
	{
		cells.push(new Cell(random(1,3)));
	}
}

function draw() {
  background(0);

  for (var i=0; i<cells.length; i++){
    if (mouseIsPressed){
	  var a = createVector(mouseX,mouseY);//TODO
	  var b = createVector(cells[i].loc.x, cells[i].loc.y);
	  var wind = p5.Vector.sub(b, a);
	  wind.setMag(0.1);  
      cells[i].applyForce(wind);
	  
  }
    cells[i].checkCollisions();
    var friction = cells[i].speed.copy();
    friction.mult(-1);
    friction.normalize();
    friction.mult(0.03);
    cells[i].applyForce(friction);
    cells[i].run();
	cells[i].aging();
  }
}

function Cell(_m, initialLocation) {
  
  this.intersects = false;
  this.maxMass = 6;
  this.agingRate = random(0.003,0.015)
  this.speed = createVector(random(-1,1), random(-1,1)); 
  this.acceleration = createVector(0, 0);
  this.mass = _m || 3;
  this.diam = this.mass * 10;
  this.loc = createVector(random(width), height / 2);
	
  if (initialLocation !== undefined) {
	  this.loc.x = initialLocation.x;
	  this.loc.y = initialLocation.y;
	}
	
  this.run = function() {
    this.draw();
    this.move();
    this.checkBorders();
  }
  
  this.aging = function(){
	  this.mass = this.mass + this.agingRate;
	  if(this.mass > this.maxMass){
		  var randNumber = random(1, 100);
		  var chance = 55;
		  var e = cells.indexOf(this);
		  if (randNumber <= chance){
		     cells.push(this.mitosis());
		     cells.push(this.mitosis());
		  } 
		  cells.splice(e,1);//remove a from the array
	  }
  }

  this.checkCollisions = function() {
	  this.intersects = false;
	  for (j = 0; j < cells.length; j++){
	    if (cells[j] !== this){
		var d = createVector(this.loc.x, this.loc.y);
		var c = createVector(cells[j].loc.x, cells[j].loc.y);
		var distancex = p5.Vector.sub(c, d);
		if( distancex.mag() < (this.diam/2 + cells[j].diam/2)){
				this.intersects = true;
				this.acceleration = distancex;
				this.acceleration.setMag(0.8);
			}
		}
	  }
  }
  
  
  this.mitosis = function() {
	var displace = [5, -5]
	var randloc= random(displace);//either +5 or - 5
	var h= randloc+this.loc.x;
	var i= randloc+this.loc.y;
    var newloc = createVector(h, i); //or -5
	var newmass =  this.mass/3;
    var childCell = new Cell(newmass, newloc);
    return childCell;
  }
  
  this.draw = function() {
    this.diam = this.mass * 10;
    ellipse(this.loc.x, this.loc.y, this.diam, this.diam);
	noStroke();
	if (this.intersects == true){
		fill('red'); 
	} else if  (this.intersects == false){
		fill(125);
	}
  }


  this.move = function() {
    this.speed.add(this.acceleration);
    this.loc.add(this.speed);
    this.acceleration.mult(0);
  }

  this.checkBorders = function() {     
    if (this.loc.x > width-this.diam/2) {
      this.loc.x = width-this.diam/2;
      this.speed.x *= -1;
    } else if (this.loc.x < this.diam/2) {
      this.speed.x *= -1;
      this.loc.x = this.diam/2;
    }
    if (this.loc.y > height-this.diam/2) {
      this.speed.y *= -1;
      this.loc.y = height-this.diam/2;
    }
     else if (this.loc.y < this.diam/2) {
      this.speed.y *= -1;
      this.loc.y = this.diam/2;
    }
  }

  this.applyForce = function(f) {
    var adjustedForce = f.copy();
    adjustedForce.div(this.mass);
    this.acceleration.add(adjustedForce);
  }
}
