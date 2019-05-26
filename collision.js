let front = 1;
let frontLeft = 1;
let frontRight = 1;
let left = 1;
let right = 1;

function checkCollision (x1, y1, x2, y2, index) {
    for (let i = 0; i < linesX.length/2-1; i++) {
        lineLine(linesX[i], linesY[i], linesX[i+1], linesY[i+1], x1, y1, x2, y2, index);
    }
    lineLine(linesX[linesX.length/2-1], linesY[linesX.length/2-1], linesX[0], linesY[0], x1, y1, x2, y2, index);
    for (let i = linesX.length/2; i < linesX.length-1; i++) {
        lineLine(linesX[i], linesY[i], linesX[i+1], linesY[i+1], x1, y1, x2, y2, index);
    }
    lineLine(linesX[linesX.length-1], linesY[linesX.length-1], linesX[linesX.length/2], linesY[linesX.length/2], x1, y1, x2, y2, index);
}

function checkPointCollision (x1, y1, x2, y2) {
    for (let i = 0; i < linesX.length/2; i++) {
        lineLine(linesX[i], linesY[i], linesX[i+12], linesY[i+12], x1, y1, x2, y2, "checkPoint" + i.toString());
    }
}

function lineLine (x1, y1, x2, y2, x3, y3, x4, y4, index) {
	let uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
	let uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

	if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
		//console.log("hit: " + index);
        let x = x1 + uA * (x2 - x1);
        let y = y1 + uA * (y2 - y1);
        if (showLines) {
			ellipse(x, y, 10, 10);
		}
        //console.log(getDistBetweenPoints(x, y, x3, y3));

        // saving state values
        switch (index) {
            case "front":
                front = round(getDistBetweenPoints(x, y, x3, y3) / 20);
                //console.log(round(getDistBetweenPoints(x, y, x3, y3) / 20));
                break;
            case "front/left":
                frontLeft = round(getDistBetweenPoints(x, y, x3, y3) / 20);
                break;
            case "front/right":
                frontRigth = round(getDistBetweenPoints(x, y, x3, y3) / 20);
                break;
            case "left":
                left = round(getDistBetweenPoints(x, y, x3, y3) / 20);
                break;
            case "right":
                right = round(getDistBetweenPoints(x, y, x3, y3) / 20);
                break;
        }
        // checkpoint/track collision detection
        if (getDistBetweenPoints(x, y, x3, y3) < 25 && index.substring(0, 10) == "checkPoint") {
            //console.log(index);
            if (index == "checkPoint0" && lastCeckPoint == "checkPoint11") {
                completeLap();
            }
            if (index != lastCeckPoint) {
                lastCeckPoint = index;
                //reward = 1000;
                let d = Date.now();
                if (allowFastTraining) {
                    checkpointTime = d - checkPointStartTime;
                    let i = parseInt(index.substring(10));
                    cpCompare = bestCheckpoints[i];
                    if (bestCheckpoints[i] == 0 || bestCheckpoints[i] >  checkpointTime) {
                        bestCheckpoints[i] = checkpointTime;
                    }
                }
                checkPointStartTime = d;
                checkpointsReached ++;
            }
        }
        if (getDistBetweenPoints(x, y, x3, y3) < 25 && index != "left" && index != "right" && index.substring(0, 10) != "checkPoint") {
            resetCar();
        } else if (getDistBetweenPoints(x, y, x3, y3) < 15 && index.substring(0, 10) != "checkPoint") {
            resetCar();
        }
		return index;
	}
	return 0;
}

function getDistBetweenPoints (x1, y1, x2, y2) {
    return round(sqrt(pow(abs(x1 - x2), 2) + pow(abs(y1 - y2), 2)));
}
