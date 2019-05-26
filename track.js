function Track (r, sr, skip) {
    this.radius = r;
    this.smallRadius = sr;
    this.offset = [];

    // create random offsets
    for (let i = 0; i < 36; i+=skip) {
        this.offset[i] = random(-50, 50);
        // creating arrays
        let r = this.radius + this.offset[i];
        linesX.push(r * cos(i*10 * PI / 180)+openWindowWidth/2);
        linesY.push(r * sin(i*10 * PI / 180)+openWindowHeight/2);
    }

    for (let i = 0; i < 36; i+=skip) {
        // creating arrays
        let r = this.smallRadius + this.offset[i];
        linesX.push(r * cos(i*10 * PI / 180)+openWindowWidth/2);
        linesY.push(r * sin(i*10 * PI / 180)+openWindowHeight/2);
    }

    this.render = function () {
        stroke(255);
        noFill();
        // outSide
        beginShape();
        fill(100);
        for (let i = 0; i < 36; i+=skip) {
            let r = this.radius + this.offset[i];
    		vertex(r * cos(i*10 * PI / 180)+openWindowWidth/2, (r * sin(i*10 * PI / 180)+openWindowHeight/2));
    	}
        endShape(CLOSE);
        // inside
        beginShape();
        fill(23, 69, 2);
        for (let i = 0; i < 36; i+=skip) {
            let r = this.smallRadius + this.offset[i];
    		vertex(r * cos(i*10 * PI / 180)+openWindowWidth/2, (r * sin(i*10 * PI / 180)+openWindowHeight/2));
    	}
        endShape(CLOSE);
        if (showCheckpoints) {
            this.renderCheckPoints();
        }
        this.renderFinishLine();
    }

    this.renderCheckPoints = function () {
        for (let i = 0; i < linesX.length/2; i++) {
            line(linesX[i], linesY[i], linesX[i+12], linesY[i+12]);
        }
    }

    this.renderFinishLine = function () {
        let r = this.radius + this.offset[0];
        push();
        strokeWeight(30);
        line(linesX[0]-openWindowWidth/100, linesY[0], linesX[12]+openWindowWidth/100, linesY[12]);
        strokeWeight(1);
        fill(0);
        textSize(24);
        text("START", linesX[12]+openWindowWidth/40, linesY[12]+openWindowWidth/250);
        pop();
    }
}
