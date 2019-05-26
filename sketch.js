let car;
let car1;
let track1;
let speed;
let leftUp = true;
let rightUp = true;
let race = true;
let justSpawned;
let tires = [];
let checkPoints = [];
let linesX = [];
let linesY = [];
let lastCeckPoint = "checkPoint0";
let startTime = 0;
let currentTime = 0;
let lastTime = 0;
let currentBest = 0;
// time
let s = 0;
let ms = 0;
let ls = 0;
let lms = 0;
let bs = 0;
let bms = 0;
let currentCP = 0;
let checkPointStartTime = 0;
let checkpointTime = 0;
let lastCheckpointTime = 0;
let checkpointsReached = 0;
let lastCheckpointsReached = 0;
// QLearning
let QLearning = true;
let state;
let revard;
let action;
let lastState = 0;
let lastAction = 0;
let deaths = -1;
let lastDeathsNum = 0;
let stateArray = [];
let bestCheckpoints = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let cpCompare = 0;
// user values
let showLines = false;
let showCheckpoints = false;
let allowFastTraining = false;
let logValues = false;
// GUI
let toggleLines;
let toggleCP;
let toggleFastTraining;
let toggleQLearning;
let buttonSaveQ;
let buttonLoadQ;
// sprites
let redCar = "redCar.png";
// window
let openWindowWidth = 0;
let openWindowHeight = 0;

let allow = false;

function setup () {
	openWindowWidth = windowWidth;
	openWindowHeight = windowHeight;
	createCanvas(openWindowWidth-20, openWindowHeight-30);
    track = new Track((openWindowWidth+openWindowHeight)/7, (openWindowWidth+openWindowHeight)/11, 3);
	let r = track.radius + track.offset[0];
	car = new Car(redCar, 255, (r * cos(3*10 * PI / 180)+openWindowWidth/2), (sin(3*10 * PI / 180)+openWindowHeight/2));
	car.dir = 1.5;
	reward = 0;
	startTime = Date.now();
	checkPointStartTime = Date.now();
	// GUI
	toggleLines = createCheckbox('Render lines', false);
	toggleCP = createCheckbox('Render checkpoints', false);
	toggleFastTraining = createCheckbox('Punish if slow', false);
	toggleQLearning = createCheckbox('QLearning', true);
	toggleLines.changed(checkLines);
	toggleCP.changed(checkCP);
	toggleFastTraining.changed(checkFT);
	toggleQLearning.changed(checkQ);
	buttonSaveQ = createButton('Save Q');
	buttonLoadQ = createButton('Load Q');
	buttonSaveQ.mousePressed(saveQ);
	buttonLoadQ.mousePressed(loadQ);
	// GUI POS
	toggleLines.position(20, 135);
	toggleCP.position(20, 170);
	toggleFastTraining.position(20, 205);
	toggleQLearning.position(20, 240);
	buttonSaveQ.position(20, 275);
	buttonLoadQ.position(20, 310);
}

function draw () {
	background(23, 69, 28);
	strokeWeight(2);
	// graphics
    track.render();
	car.render();
	car.turn();
	car.update();
	// turning values
	if (rightUp && leftUp) {
		car.setRotation(0);
	} else if (rightUp) {
		if (car.isAcceleratingBack) {
			car.setRotation(0.07);
		} else {
			car.setRotation(-0.07);
		}
	} else if (leftUp) {
		if (car.isAcceleratingBack) {
			car.setRotation(-0.07);
		} else {
			car.setRotation(0.07);
		}
	}

	// time
	if (race) {
		lastCheckpointTime = Date.now() - checkPointStartTime;
		if (lastCheckpointTime > 2000 && QLearning) {
			resetCar();
		}
		currentTime = Date.now() - startTime;
		s = int(currentTime/1000);
		ms = currentTime - int(currentTime/1000) * 1000;
		ls = int(lastTime/1000);
		lms = lastTime - int(lastTime/1000) * 1000;
		bs = int(currentBest/1000);
		bms = currentBest - int(currentBest/1000) * 1000;
	}
	textSize(32);
	fill(255);
	text('Time: ' + s + "s " + ms + "ms", 10, 30);
	text('Last Lap: ' + ls + "s " + lms + "ms", 10, 65);
	text('Best Lap: ' + bs + "s " + bms + "ms", 10, 100);
	// QLearning
	state = getState(front, frontLeft, frontRight, left, right);
	if ((justSpawned || (allow && lastState != state)) && QLearning) {
		justSpawned = false;
		allow = false;
		action = getAction(state);
		if (deaths > lastDeathsNum) {
			reward =  -100;
		} else if (checkpointsReached > lastCheckpointsReached && allowFastTraining) {
			lastCheckpointsReached = checkpointsReached;
			rewardForSpeed(checkpointTime);
			reward = 1;
		}else {
			reward = 1;
		}
		if  (logValues) {
			console.log("State: " + state + " Values:" + Q[state]);
		}
		calcQ(lastState, lastAction, reward, state);
		switch (action) {
			case 0:
				setTimeout(() => allow=true, 100);
				break;
			case 1:
				simTurn(true);
				break;
			case 2:
				simTurn(false);
				break;
			default:
				simAccelerate();
				break;
		}
		stateArray.push(new QState(lastState, lastAction));
		lastState = state;
		lastAction = action;
		lastDeathsNum = deaths;
	}
	//let coordinateIndex = parseInt(lastCeckPoint.substring(lastCeckPoint.indexOf("t")+1));
	//reward = round(getDistBetweenPoints(car.pos.x, car.pos.y, (linesX[coordinateIndex]+linesX[coordinateIndex+12])/2, (linesY[coordinateIndex]+linesY[coordinateIndex+12])/2)/10);
}

function keyReleased () {
	if (!QLearning) {
		if (keyCode == RIGHT_ARROW || keyCode == 68) {
			rightUp = true;
		} else if (keyCode == LEFT_ARROW || keyCode == 65) {
			leftUp = true;
		} else if (keyCode == UP_ARROW || keyCode == 87) {
			car.accelerating(false);
		} else if (keyCode == DOWN_ARROW || keyCode == 83) {
			car.acceleratingBack(false);
		}
	}
}

function keyPressed () {
	if (!QLearning) {
		if (keyCode == RIGHT_ARROW || keyCode == 68) {
			rightUp = false;
			//turning.play();
		} else if (keyCode == LEFT_ARROW || keyCode == 65) {
			leftUp = false;
			//turning.play();
		} else if (keyCode == UP_ARROW || keyCode == 87) {
			car.accelerating(true);
		} else if (keyCode == DOWN_ARROW || keyCode == 83) {
			car.acceleratingBack(true);
		}
	}
}

function simTurn (left) {
	if (left) {
		leftUp = false;
		setTimeout(() => leftUp = true, 100);
		setTimeout(() => allow=true, 100);
	} else {
		rightUp = false;
		setTimeout(() => rightUp = true, 100);
		setTimeout(() => allow=true, 100);
	}
}

function simAccelerate () {
	car.accelerating(false);
	setTimeout(() => car.accelerating(true), 50);
	setTimeout(() => allow=true, 50);
}

function resetCar () {
	lastCeckPoint = "checkPoint0";
	let r = track.radius + track.offset[0];
	car.pos.x = (r * cos(3*10 * PI / 180)+openWindowWidth/2);
	car.pos.y = (sin(3*10 * PI / 180)+openWindowHeight/2);
	car.dir = 1.5;
	car.velocity = createVector(0, 0);
	startTime = Date.now();
	deaths ++;
	checkPointStartTime = Date.now();
	justSpawned = true;
	QArray = [];
	if (QLearning) {
		car.accelerating(true);
	}
}

function completeLap () {
	if (currentTime < currentBest || currentBest == 0) {
		currentBest = currentTime;
	}
	lastTime = currentTime;
	startTime = Date.now();
}

// GUI
function checkLines() {
	if (this.checked()) {
		showLines = true;
	} else {
		showLines = false;
	}
}

function checkCP() {
	if (this.checked()) {
		showCheckpoints = true;
	} else {
		showCheckpoints = false;
	}
}

function checkFT() {
	if (this.checked()) {
		allowFastTraining = true;
	} else {
		allowFastTraining = false;
	}
}

function checkQ() {
	if (this.checked()) {
		QLearning = true;
		car.accelerating(true);
	} else {
		QLearning = false;
		car.accelerating(false);
	}
}
