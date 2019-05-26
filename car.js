function Car (img, tv, x, y) {
	this.carImg = loadImage("assets/" + img);
	this.pos = createVector(x, y);
	this.width = openWindowWidth/45;
	this.height = openWindowHeight/40;
	this.dir = 0;
	this.rotation = 0;
	this.velocity = createVector(0, 0);
	this.isAccelerating = false;
	this.isAcceleratingBack = false;
	this.transparentV = tv;

	this.update = function () {
		if (this.isAccelerating) {
			this.accelerate();
		}
		else if (this.isAcceleratingBack) {
			this.accelerateBack();
		}
		this.pos.add(this.velocity);
		// adding friction
		this.velocity.mult(0.95);
		//this.width = openWindowWidth/25;
	    //this.height = openWindowHeight/20;
	}

	this.accelerating = function (a) {
		this.isAccelerating = a;
	}

	this.acceleratingBack = function (a) {
		this.isAcceleratingBack = a;
	}

	this.accelerate = function () {
		var gas = p5.Vector.fromAngle(this.dir);
		// speed forward
		gas.mult(10 * (this.width + this.height) / 3000);
		//console.log(this.velocity);
		this.velocity.add(gas);
	}

	this.accelerateBack = function () {
		var gas = p5.Vector.fromAngle(this.dir-PI);
		// speed backward
		gas.mult(6 * (this.width + this.height) / 3000);
		//console.log(this.velocity);
		this.velocity.add(gas);
	}

	this.render = function () {
        this.eyes(140);
		push();
		//rect(0, 0, openWindowWidth-51, openWindowHeight-101);
		translate(this.pos.x, this.pos.y);
		rotate(this.dir);
		noFill();
		tint(255, this.transparentV);
		stroke(255);
		//rect(-this.width/3, -this.height/3, this.width, this.height);
		image(this.carImg, -this.width/3, -this.height/3, this.width, this.height);
		pop();
	}

	this.setRotation = function (angle) {
		this.rotation = angle;
	}

	this.turn = function () {
		speed = abs(this.velocity.x) + abs(this.velocity.y);
		//console.log(speed);
		if (speed < 0.8) {
			return;
		}
		this.dir += this.rotation;
	}

	this.hit = function (angle) {
		var gas = p5.Vector.fromAngle(angle);
		// speed backward
		gas.mult(60 * (this.width + this.height) / 3000);
		//console.log(this.velocity);
		this.velocity.add(gas);
		crash.play();
	}

    this.eyes = function (len) {
		front = 8;
	    frontLeft = 8;
	    frontRight = 8;
	    left = 8;
	    right = 8;
        let x;
        let y;
        stroke(255);
        // front
        x = this.pos.x + len*cos(this.dir);
        y = this.pos.y + len*sin(this.dir);
		if (showLines) {
			line(this.pos.x, this.pos.y, x, y);
		}
        checkCollision(this.pos.x, this.pos.y, x, y, "front");
		checkPointCollision(this.pos.x, this.pos.y, x, y);
        // front/left
        x = this.pos.x + len*cos(this.dir-0.5);
        y = this.pos.y + len*sin(this.dir-0.5);
		if (showLines) {
			line(this.pos.x, this.pos.y, x, y);
		}
        checkCollision(this.pos.x, this.pos.y, x, y, "front/left");
        // front/right
        x = this.pos.x + len*cos(this.dir+0.5);
        y = this.pos.y + len*sin(this.dir+0.5);
		if (showLines) {
			line(this.pos.x, this.pos.y, x, y);
		}
        checkCollision(this.pos.x, this.pos.y, x, y, "front/right");
        // left
        x = this.pos.x + len*cos(this.dir-1.5);
        y = this.pos.y + len*sin(this.dir-1.5);
		if (showLines) {
			line(this.pos.x, this.pos.y, x, y);
		}
        checkCollision(this.pos.x, this.pos.y, x, y, "left");
        // right
        x = this.pos.x + len*cos(this.dir+1.5);
        y = this.pos.y + len*sin(this.dir+1.5);
		if (showLines) {
			line(this.pos.x, this.pos.y, x, y);
		}
        checkCollision(this.pos.x, this.pos.y, x, y, "right");
    }
}
