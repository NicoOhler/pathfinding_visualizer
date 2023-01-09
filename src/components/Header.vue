<template>
    <div id="header">
        <b-navbar id="title" toggleable="lg" variant="info" type="dark" fill class="mt0">
            <!--b-img
                :src="require('../../public/images/simplistic_maze.jpg')"
                width="50%"
                height="50%"
                alt="Maze Logo"
            ></b-img-->
            <b-navbar-brand><b>Pathfinder</b></b-navbar-brand>
            <b-navbar-nav>
                <b-dropdown variant="primary" id="selection" :text="selection" class="m-md-2">
                    <b-dropdown-item @click="selectionChange(states.START)">START</b-dropdown-item>
                    <b-dropdown-item @click="selectionChange(states.END)">END</b-dropdown-item>
                    <b-dropdown-item @click="selectionChange(states.WALL)">WALL</b-dropdown-item>
                    <b-dropdown-item @click="selectionChange(states.EMPTY)">EMPTY</b-dropdown-item>
                </b-dropdown>
                <b-dropdown variant="primary" id="algorithm" :text="algorithm" class="m-md-2">
                    <b-dropdown-item disabled @click="algorithmChange('Prototype')"
                        >Prototype</b-dropdown-item
                    >
                    <b-dropdown-item @click="algorithmChange('Dijkstra')">Dijkstra</b-dropdown-item>
                    <b-dropdown-item @click="algorithmChange('A*')">A*</b-dropdown-item>
                </b-dropdown>
                <b-nav-item>
                    <b-input-group prepend="Delay:" append="ms">
                        <b-form-input
                            v-model="delay"
                            type="number"
                            min="0"
                            max="3000"
                            placeholder="Delay in milliseconds"
                            @input="$emit('delayChange', delay)"
                        ></b-form-input>
                    </b-input-group>
                </b-nav-item>
                <b-nav-item>
                    <b-input-group prepend="Columns:">
                        <b-form-input
                            v-model="cols"
                            type="number"
                            min="1"
                            max="200"
                            placeholder="Columns"
                            @input="$emit('colChange', parseInt(cols))"
                        ></b-form-input>
                    </b-input-group>
                </b-nav-item>
                <b-nav-item>
                    <b-input-group prepend="Rows:">
                        <b-form-input
                            v-model="rows"
                            type="number"
                            min="1"
                            max="100"
                            placeholder="Rows"
                            @input="$emit('rowChange', parseInt(rows))"
                        ></b-form-input>
                    </b-input-group>
                </b-nav-item>
            </b-navbar-nav>

            <!-- right side-->
            <b-navbar-nav class="ml-auto">
                <b-nav-item>
                    <b-button variant="success" @click="$emit('find')">Find</b-button>
                </b-nav-item>
                <b-nav-item>
                    <b-button variant="warning" @click="$emit('pause')">Pause</b-button>
                </b-nav-item>
                <b-nav-item>
                    <b-button variant="danger" @click="$emit('clear')">Clear</b-button>
                </b-nav-item>
            </b-navbar-nav>
        </b-navbar>
    </div>
</template>

<script>
import { NODE_STATES } from "../Node";
export default {
    name: "Header",
    props: {
        initialCols: Number,
        initialRows: Number,
        initialAlgorithm: String
    },
    data() {
        return {
            states: NODE_STATES,
            selection: NODE_STATES.START,
            algorithm: this.initialAlgorithm,
            delay: 50,
            cols: this.initialCols,
            rows: this.initialRows
        };
    },
    methods: {
        selectionChange(selection) {
            this.$emit("selectionChange", selection);
            this.selection = selection;
        },
        algorithmChange(algorithm) {
            this.$emit("algorithmChange", algorithm);
            this.algorithm = algorithm;
        }
    }
};
</script>

<style>
#header {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#title {
    padding-left: 1%;
    height: 10vh;
}

li {
    display: inline-block;
    margin: 0 10px;
}

p {
    color: white;
    background: aqua;
}
</style>
