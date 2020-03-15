<template>
    <div class="viewer">
        <ul class="container">
            <li class="panel darkorange">Pannel 1</li>
            <li class="panel magenta">Pannel 2</li>
            <li class="panel chartreuse">Pannel 3</li>
            <li class="panel gold">Pannel 4</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'Carousel'
};
</script>

<style scoped>
    .viewer {
        overflow: hidden;
        height: 100%;
    }

    .container {
        white-space: nowrap;
        height: 100%;
    }

    .panel {
        display: inline-block;
        font-weight: bold;
        height: 100%;
        width: 100%;
        font-size: 16vw;
        user-select: none;
        cursor: pointer;
        padding-top: 30vh;
    }

    .darkorange {
        background: darkorange;
    }

    .magenta {
        background: magenta;
    }

    .chartreuse {
        background: chartreuse;
    }

    .gold {
        background: gold;
    }


</style>