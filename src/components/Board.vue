<template>
    <div id="board">
        <table>
            <tr v-for="row in nodeRows" :key="row.y">
                <td
                    v-for="node in row.cols"
                    @mousedown="mouseOverAndPressed('down', node)"
                    @mouseup="mouseOverAndPressed('up', node)"
                    @mouseover="mouseOverAndPressed('over', node)"
                    @mouseleave="mouseOverAndPressed('left', node)"
                    :key="node.id"
                    id="unselectable"
                    :style="{
                        border: '1px solid grey',
                        backgroundColor: node.color,
                        height: nodeHeightPercentage,
                        width: nodeWidthPercentage,
                    }"
                >
                <!-- todo show g/h/f cost>
                    <div v-if="node.distance != Infinity">{{ node.distance }}</div-->
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    name: "Board",
    props: {
        rows: Number,
        cols: Number,
        nodeRows: Array
    },
    data() {
        return {
            mouseOver: false,
            mousePressed: false
        };
    },
    computed: {
        nodeHeightPercentage: function() {
            return 100 / this.rows + "%";
        },
        nodeWidthPercentage: function() {
            return 100 / this.cols + "%";
        }
    },
    methods: {
        mouseOverAndPressed: function(event, node) {
            switch (event) {
                case "over":
                    this.mouseOver = true;
                    break;
                case "left":
                    this.mouseOver = false;
                    break;
                case "down":
                    this.mousePressed = true;
                    break;
                case "up":
                    this.mousePressed = false;
                    break;
            }
            if (this.mouseOver && this.mousePressed) this.$emit("nodeUpdate", node);
        }
    }
};
</script>

<style>
#board {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

table {
    border: 2px solid black;
    width: 100%;
    height: 90vh;
}

#unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
</style>
