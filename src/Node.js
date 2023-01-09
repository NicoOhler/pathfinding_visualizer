const NODE_STATES = {
	START: "Start",
	END: "End",
	WALL: "Wall",
	EMPTY: "Empty",
	CALCULATED: "Calculated",
	SHORTEST: "Shortest",
	EDGE: "Edge",
};

class Node {
	distance = 0
	previous = undefined
	f=undefined
	g=undefined
	h=undefined

	constructor(x, y) {
		this.id = x + "_" + y;
		this.x = x;
		this.y = y;
		this.distance = Infinity
		this.setState(NODE_STATES.EMPTY);
	}

	setState(state) {
		this.state = state;
		this.color = this.getColorByState();
	}

	getColorByState() {
		switch (this.state) {
			case NODE_STATES.EMPTY:
				return "lightgrey";
			case NODE_STATES.START:
				return "yellow";
			case NODE_STATES.END:
				return "red";
			case NODE_STATES.WALL:
				return "slategrey";
			case NODE_STATES.CALCULATED:
				return "lightblue";
			case NODE_STATES.EDGE:
				return "green";
			case NODE_STATES.SHORTEST:
				return "orange";
			default:
				return "no such state";
		}
	}
}

module.exports.Node = Node;
module.exports.NODE_STATES = NODE_STATES;
