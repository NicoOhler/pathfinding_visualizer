<template>
    <div id="app">
        <Header
            :initialCols="cols"
            :initialRows="rows"
            :initialAlgorithm="algorithm"
            @selectionChange="updateSelection"
            @delayChange="updatedelay"
            @colChange="updateCols"
            @rowChange="updateRows"
            @algorithmChange="updateAlgorithm"
            @find="findShortestPath"
            @clear="clearBoard"
            @pause="paused = finding ? !paused : paused"
        ></Header>
        <Board
            :nodeRows="nodeRows"
            :rows="rows"
            :cols="cols"
            :selectionMode="selectionMode"
            @nodeUpdate="updateNodeState"
        ></Board>
    </div>
</template>

<script>
import { Node, NODE_STATES } from "./Node";

import Board from "./components/Board.vue";
import Header from "./components/Header.vue";

export default {
    name: "App",
    components: {
        Header,
        Board
    },
    data() {
        return {
            nodeRows: undefined,
            startNode: undefined,
            endNode: undefined,
            selectionMode: NODE_STATES.START,
            algorithm: "Dijkstra",
            delay: 50,
            finding: false,
            paused: false,
            rows: 15,
            cols: 30
        };
    },
    mounted() {
        this.initializeBoard();
        //this.printNodes();
    },
    methods: {
        // * helper methods
        // returns node with index (x,y) if existent
        node: function(x, y) {
            if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) return this.nodeRows[y].cols[x];
            return undefined;
        },
        // ! DEBUGGING ONLY!!! - console output of all nodes
        printNodes: function() {
            let str = "";
            for (let col = 0; col < this.cols; col++) str += "\t\t" + col;
            for (let row = 0; row < this.rows; row++) {
                str += "\n";
                str += row + "\t";
                for (let col = 0; col < this.cols; col++) str += "\t" + this.node(col, row).state;
            }

            console.log(str);
        },

        // * board methods
        // initializes node array with empty nodes
        initializeBoard: function() {
            this.nodeRows = [];
            for (let i = 0; i < this.rows; i++) {
                this.nodeRows.push({ y: i, cols: [] });
                for (let j = 0; j < this.cols; j++) this.nodeRows[i].cols.push(new Node(j, i));
            }
        },
        // sets every node to default
        // does nothing when executed while finding shortest path
        clearBoard: function() {
            if (!this.finding) {
                this.startNode = undefined;
                this.endNode = undefined;
                for (let row = 0; row < this.rows; row++)
                    for (let col = 0; col < this.cols; col++) {
                        let node = this.node(col, row);
                        node.setState(NODE_STATES.EMPTY);
                        node.distance = Infinity;
                        node.previous = undefined;
                    }
                // ? this.updateSelection(NODE_STATES.START);
            }
        },
        // * update methods
        // changes current state selection (START/END/EMPTY...)
        updateSelection: function(selection) {
            this.selectionMode = selection;
        },
        // todo input bug
        // updates number of columns without losing current node states
        updateCols: function(cols) {
            let difference = cols - this.cols;

            // if difference negative ==> remove cols from each row
            while (difference < 0) {
                for (let i = 0; i < this.rows; i++) this.nodeRows[i].cols.pop();
                difference++;
            }

            // if difference positive ==> add new cols to each row
            while (difference > 0) {
                let colIndex = cols - difference;
                for (let i = 0; i < this.rows; i++)
                    this.nodeRows[i].cols.push(new Node(colIndex, i));
                difference--;
            }

            this.cols = cols;
        },
        // updates number of rows without losing current node states
        updateRows: function(rows) {
            let difference = rows - this.rows;

            // if difference negative ==> remove rows
            while (difference < 0) {
                this.nodeRows.pop();
                difference++;
            }

            // if difference positive ==> add new rows and add columns to its corresponding row
            while (difference > 0) {
                let rowIndex = rows - difference;
                this.nodeRows.push({ y: rowIndex, cols: [] });
                for (let j = 0; j < this.cols; j++)
                    this.nodeRows[rowIndex].cols.push(new Node(j, rowIndex));
                difference--;
            }
            this.rows = rows;
        },
        // changes which algorithm is being used
        updateAlgorithm: function(algorithm) {
            this.algorithm = algorithm;
        },
        // changes the delay between each algorithm iteration
        updatedelay: function(delay) {
            this.delay = delay;
        },
        // sets state of node to current selection
        updateNodeState: function(node) {
            // set the reference of end/start node to undefined whenever the state of end/start node changes
            if (node.state == NODE_STATES.END) this.endNode = undefined;
            if (node.state == NODE_STATES.START) this.startNode = undefined;

            // replace reference of start node with new start node
            // also set previous start node to EMPTY
            if (this.selectionMode == NODE_STATES.START) {
                if (this.startNode) this.startNode.setState(NODE_STATES.EMPTY);
                this.startNode = node;
            }
            // replace reference of end node with new end node
            // also set previous end node to EMPTY
            if (this.selectionMode == NODE_STATES.END) {
                if (this.endNode) this.endNode.setState(NODE_STATES.EMPTY);
                this.endNode = node;
            }
            node.setState(this.selectionMode);
            //this.printNodes();
        },
        // * actual path finding
        // finds the shortest path between start and end node using the selected algorithm
        // needs start/end node
        findShortestPath: async function() {
            // return if already searching
            if (this.finding) return;
            // return if startNode/endNode undefined
            if (!this.startNode || !this.endNode) {
                console.log("Start/Endnode missing!");
                return;
            }

            this.finding = true;

            // use selected algorithm
            switch (this.algorithm) {
                case "Prototype":
                    console.log("Prototype has not been implemented yet!");
                    //this.findPrototype();
                    break;
                case "Dijkstra":
                    await this.findDijkstra();
                    break;
                case "A*":
                    await this.findAStar();
                    break;
                default:
                    console.log("There is no such algorithm implemented.");
            }

            // Display shortest path
            let currentNode = this.endNode.previous;
            while (currentNode && currentNode != this.startNode) {
                currentNode.setState(NODE_STATES.SHORTEST);
                currentNode = currentNode.previous;
            }

            this.finding = false;
        },
        // initializes board for pathfinding
        // set previous/distance/g/h/f to undefined
        // set calculated/edge/shortest to empty
        initializeForPathfinding: function() {
            for (let row = 0; row < this.rows; row++)
                for (let col = 0; col < this.cols; col++) {
                    let node = this.node(col, row);
                    node.distance = Infinity;
                    node.previous = undefined;

                    node.g = undefined;
                    node.h = undefined;
                    node.f = undefined;

                    // set state to empty if calculated/edge/shortest
                    if (
                        node.state == NODE_STATES.CALCULATED ||
                        node.state == NODE_STATES.EDGE ||
                        node.state == NODE_STATES.SHORTEST
                    )
                        node.setState(NODE_STATES.EMPTY);
                }
        },
        // returns the distance between 2 nodes
        getDistanceBetween: function(source, destination) {
            if (source && destination)
                return Math.abs(source.x - destination.x) + Math.abs(source.y - destination.y);
            return undefined;
        },
        // takes nodes array as argument and returns node with shortest distance
        getNodeWithShortestDistance: function(nodes) {
            let shortestNode = { distance: Infinity };
            if (!Array.isArray(nodes)) return undefined;
            // loop over each node
            for (let i = 0; i < nodes.length; i++)
                // if current node shorter ==> update shortestNode
                if (nodes[i].distance <= shortestNode.distance) shortestNode = nodes[i];

            // Todo
            if (this.algorithm == "Prototype") {
                nodes = nodes.values;
                let result = nodes.next();
                while (!result.done)
                    if (result.value.distance <= shortestNode.distance) shortestNode = result.value;
            }

            return shortestNode;
        },
        // takes nodes array as argument and returns node with lowest f cost
        getNodeWithLowestF: function(nodes) {
            let nodeWithLowestF = { f: Infinity };

            if (!Array.isArray(nodes)) return undefined;
            // loop over each node
            for (let i = 0; i < nodes.length; i++)
                // if current node has lower f ==> update nodeWithLowestF
                if (nodes[i].f <= nodeWithLowestF.f) nodeWithLowestF = nodes[i];
            return nodeWithLowestF;
        },
        // * pathfinding algorithm implementations
        // ! JUST A PROTOTYPE - DOES NOT WORK
        findPrototype: function() {
            console.log(this.startNode);
            let unvisited = new Set();
            let visited = new Set();
            unvisited.add(this.startNode);
            this.startNode.distance = 0;
            let previousNode = this.startNode;

            while (unvisited.size) {
                let currentNode = this.getNodeWithShortestDistance(unvisited);
                currentNode.previous = previousNode;
                currentNode.distance = currentNode.previous.distance + 1;
                console.log(currentNode.id);

                visited.add(currentNode.id);

                let above = this.node(currentNode.x, currentNode.y - 1);
                console.log("above " + above);
                if (above && !visited.has(above.id)) unvisited.add(above);

                let below = this.node(currentNode.x, currentNode.y + 1);
                console.log("below " + below);
                if (below && !visited.has(below.id)) unvisited.add(below);

                let left = this.node(currentNode.x - 1, currentNode.y);
                console.log("left " + left);
                if (left && !visited.has(left.id)) unvisited.add(left);

                let right = this.node(currentNode.x + 1, currentNode.y);
                console.log("right " + right);
                if (right && !visited.has(right.id)) unvisited.add(right);

                unvisited.delete(currentNode);
            }
            console.log(this.endNode);
        },
        // finds the shortest path between start and end if there is one
        // uses Dijkstra's algorithm
        findDijkstra: async function() {
            let unvisited = [];
            let currentDistanceLevel = 0;

            // initialize for pathfinding
            // set distance to infinity and
            this.initializeForPathfinding();
            // add each node to list of unvisited nodes except for walls
            for (let row = 0; row < this.rows; row++)
                for (let col = 0; col < this.cols; col++) {
                    let node = this.node(col, row);
                    // only add to unvisited if not a wall
                    if (node.state != NODE_STATES.WALL) unvisited.push(node);
                }

            this.startNode.distance = 0;

            // loop over each unvisited node
            while (unvisited.length) {
                // pause algorithm if pause button has been pressed
                while (this.paused) await new Promise(r => setTimeout(r, this.delay));

                // get node with shortest distance
                let currentNode = this.getNodeWithShortestDistance(unvisited);

                // remove node with shortest distance
                let index = unvisited.indexOf(currentNode);
                if (index > -1) unvisited.splice(index, 1);

                if (currentNode.distance <= this.endNode.distance) {
                    // set node state to calculated unless its the start/end node
                    if (this.endNode.id != currentNode.id && this.startNode.id != currentNode.id)
                        currentNode.setState(NODE_STATES.CALCULATED);

                    // get node neighbours
                    let neighbours = [];
                    neighbours.push(this.node(currentNode.x, currentNode.y - 1));
                    neighbours.push(this.node(currentNode.x, currentNode.y + 1));
                    neighbours.push(this.node(currentNode.x - 1, currentNode.y));
                    neighbours.push(this.node(currentNode.x + 1, currentNode.y));

                    // calculate distance for each neighbour, which is neither undefined nor WALL
                    // update node.distance if new distance is shorter
                    for (let i = 0; i < neighbours.length; i++) {
                        let neighbour = neighbours[i];
                        let distanceBetweenCurrentAndNeighbour = currentNode.distance + 1;

                        // if neither undefined nor WALL
                        if (neighbour && neighbour.state != NODE_STATES.WALL)
                            if (distanceBetweenCurrentAndNeighbour < neighbours[i].distance) {
                                // update distance to start if shorter
                                neighbour.distance = distanceBetweenCurrentAndNeighbour;
                                neighbour.previous = currentNode;

                                // set node state to EDGE if not endNode
                                if (this.endNode.id != neighbour.id)
                                    neighbour.setState(NODE_STATES.EDGE);
                            }
                    }

                    // artificial delay for animations/clarity
                    if (this.delay && currentNode.distance > currentDistanceLevel) {
                        await new Promise(r => setTimeout(r, this.delay));
                        currentDistanceLevel = currentNode.distance;
                    }
                }
            }
        },
        findAStar: async function() {
            let visited = [];
            let unvisited = [];
            unvisited.push(this.startNode);

            // initialize for pathfinding
            // set each node's costs to undefined,
            // set calculated/edge/shortest to empty
            this.initializeForPathfinding();

            this.startNode.g = 0;
            this.startNode.h = 0;
            this.startNode.f = 0;

            while (unvisited.length) {
                let currentNode = this.getNodeWithLowestF(unvisited);

                // return if end reached
                if (currentNode == this.endNode) return;

                visited.push(currentNode);
                unvisited.splice(unvisited.indexOf(currentNode), 1);

                // get neighbours of current node
                let neighbours = [];
                neighbours.push(this.node(currentNode.x, currentNode.y - 1));
                neighbours.push(this.node(currentNode.x, currentNode.y + 1));
                neighbours.push(this.node(currentNode.x - 1, currentNode.y));
                neighbours.push(this.node(currentNode.x + 1, currentNode.y));
                if (currentNode.state != NODE_STATES.START)
                    currentNode.setState(NODE_STATES.CALCULATED);

                // calculate costs of all neighbour except for walls or already visited nodes
                for (let i = 0; i < neighbours.length; i++) {
                    let neighbour = neighbours[i];

                    if (
                        neighbour &&
                        neighbour.state != NODE_STATES.WALL &&
                        !visited.includes(neighbour)
                    ) {
                        // g - distance from start node
                        // h - distance from end node
                        // f - actual cost
                        ////neighbour.g = this.getDistanceBetween(neighbour, this.startNode);
                        neighbour.g = currentNode.g + 1;
                        neighbour.h = this.getDistanceBetween(neighbour, this.endNode);
                        neighbour.f = neighbour.g + neighbour.h;
                        // remember which neigbour has the lowest f cost
                        if (neighbour.g > currentNode.g) {
                            neighbour.previous = currentNode;
                            unvisited.push(neighbour);
                        }
                        // set node state to calculated unless its the start/end node
                        if (this.endNode.id != neighbour.id && this.startNode.id != neighbour.id)
                            neighbour.setState(NODE_STATES.EDGE);
                    }
                }
                // artificial delay for animations/clarity
                if (this.delay) await new Promise(r => setTimeout(r, this.delay));
            }
        }
    }
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
