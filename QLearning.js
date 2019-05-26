let Q = [];
// 16807 579194
for (let i = 0; i <= 37448; i++) {
    //[nothing, left, right, break]
	Q[i] = [0, 0, 0, 0];
    //Q[i] = [Math.random(), Math.random(), Math.random(), Math.random()];
}

function calcQ (state, decision, reward, nextState) {
	Q[state][decision] = round(Q[state][decision] + 0.7 * (reward + 1 * Math.max(Q[nextState][0], Q[nextState][1], Q[nextState][2], Q[nextState][3]) - Q[state][decision]));
	//Q[state][decision] = round(0.7 * (reward + 1 * max(Q[nextState][0], Q[nextState][1]) - Q[state][decision]));
	//Q[state][decision] = round(reward + 0.8 * max(Q[nextState][0], Q[nextState][1]));
	//Q[state][decision] = (1-0.7) * Q[state][decision] + 0.7 * (reward + 1 * max(Q[nextState][0], Q[nextState][1]));
}

function getState (front, frontLeft, frontRight, left, right) {
	let state = 0;
	for (let i = 0; i < front; i++) {
		state ++;
		for (let j = 0; j < frontLeft; j++) {
			state ++;
			for (let k = 0; k < frontRight; k++) {
				state ++;
                for (let l = 0; l < left; l++) {
					state ++;
                    for (let m = 0; m < right; m++) {
                        state ++;
        			}
    			}
			}
		}
	}
	return state;
}

function getAction (state) {
	let rnd = int(random(0, 200));
	if (rnd == 7) {
		return int(random(0, 4));
	}
    switch (Math.max(Q[state][0], Q[state][1], Q[state][2], Q[state][3])) {
        case Q[state][0]:
            return 0;
        case Q[state][1]:
            return 1;
        case Q[state][2]:
            return 2;
        case Q[state][3]:
            return 3;
    }
}

function saveQ () {
	localStorage.setItem("QArray", JSON.stringify(Q));
}

function loadQ () {
	Q = JSON.parse(localStorage.getItem("QArray"));
}

// object for speed based QLearning
function QState (state, action) {
	this.state = state;
	this.action = action;
}

function rewardForSpeed (time) {
	for (let i = 0; i < stateArray.length; i++) {
		//console.log((cpCompare+10-time)/5);
		Q[stateArray[i].state][stateArray[i].action] += round((cpCompare+100-time)/20);
	}
	stateArray = [];
}
