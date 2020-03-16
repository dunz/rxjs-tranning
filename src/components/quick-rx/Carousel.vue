<template>
    <div class="viewer" id="viewer">
        <ul class="container" id="container">
            <li class="panel darkorange">Pannel 1</li>
            <li class="panel magenta">Pannel 2</li>
            <li class="panel chartreuse">Pannel 3</li>
            <li class="panel gold">Pannel 4</li>
        </ul>
    </div>
</template>

<script>
import {fromEvent} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';

export default {
    name: 'Carousel',
    mounted() {
        // const $viewer = document.getElementById('viewer');
        const $container = document.getElementById('container');

        const IS_SUPPORT_TOUCH = 'ontouchstart' in window;
        const EVENTS = {
            start: IS_SUPPORT_TOUCH ? 'touchstart' : 'mousedown',
            move: IS_SUPPORT_TOUCH ? 'touchmove' : 'mousemove',
            end: IS_SUPPORT_TOUCH ? 'touchend' : 'mouseup'
        };

        const $start = fromEvent($container, EVENTS.start);
        const $move = fromEvent($container, EVENTS.move);
        const $end = fromEvent($container, EVENTS.end);
        const $drag = $start.pipe(
            switchMap(() => $move.pipe(
                takeUntil($end)
            ))
        );

        // $start.subscribe((event) => {
        //     console.log('$start', event);
        // });
        // $move.subscribe((event) => {
        //     console.log('$move', event);
        // });
        // $end.subscribe((event) => {
        //     console.log('$end', event);
        // });
        $drag.subscribe((event) => {
            console.log('$drag', event);
        });

    }
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