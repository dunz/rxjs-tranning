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
import {fromEvent, merge, of, interval, concat, defer, asyncScheduler, animationFrameScheduler} from 'rxjs';
import {map, switchMap, takeUntil, first, startWith, withLatestFrom, share, distinctUntilChanged, scan, tap, observeOn, takeWhile} from 'rxjs/operators';

const IS_SUPPORT_TOUCH = 'ontouchstart' in window;
const EVENTS = {
    start: IS_SUPPORT_TOUCH ? 'touchstart' : 'mousedown',
    move: IS_SUPPORT_TOUCH ? 'touchmove' : 'mousemove',
    end: IS_SUPPORT_TOUCH ? 'touchend' : 'mouseup'
};

export default {
    name: 'Carousel',
    data() {
        return {
            $viewer: null,
            $container: null,
            DURATION: 200
        };
    },
    methods: {
        toPos(obs$) {
            return obs$.pipe(
                map((event) => IS_SUPPORT_TOUCH ? event.changedTouches[0].pageX : event.pageX)
            );
        },
        translateX(posX) {
            this.$container.style.transform = `translate3d(${posX}px, 0, 0)`;
        },
        animation(from, to, duration = 300) {
            return defer(() => {
                const scheduler = animationFrameScheduler;
                const start = scheduler.now();
                const rate$ = interval(0, animationFrameScheduler).pipe(
                    map(() => (scheduler.now() - start) / duration),
                    takeWhile(rate => rate < 1)
                );
                return concat(of(0), rate$, of(1)).pipe(
                    map((rate) => from + (to - from) * rate)
                );
            });
        }
    },
    mounted() {
        this.$viewer = document.getElementById('viewer');
        const panelCount = document.querySelectorAll('.panel').length || 0;
        this.$container = document.getElementById('container');

        const size$ = fromEvent(window, 'resize').pipe(
            startWith(0),
            map(() => this.$viewer.clientWidth)
        );
        const start$ = fromEvent(document, EVENTS.start).pipe(this.toPos);
        const move$ = fromEvent(document, EVENTS.move).pipe(this.toPos);
        const end$ = fromEvent(document, EVENTS.end);
        const drag$ = start$.pipe(
            switchMap((start) => move$.pipe(
                map((move) => move - start),
                takeUntil(end$)
            )),
            distinctUntilChanged(),
            map(distance => ({distance})),
            tap((drag) => console.log('drag$', drag)),
            share()
        );
        const drop$ = drag$.pipe(
            switchMap((drag) => end$.pipe(
                map(() => drag),
                first()
            )),
            withLatestFrom(size$, (drag, size) => ({...drag, size})),
            tap((drop) => console.log('drop$', drop)),
            share()
        );
        const carousel$ = merge(drag$, drop$).pipe(
            scan((store, {distance, size}) => {
                const updateStore = {
                    from: -(store.index * store.size) + distance
                };
                const threshold = size / 3;

                if (size) {
                    let tobeIndex = store.index;
                    if (Math.abs(distance) - threshold > 0) {
                        tobeIndex = distance > 0    // 오른쪽으로 이동
                            ? Math.max(tobeIndex - 1, 0)
                            : Math.min(tobeIndex + 1, panelCount - 1);
                    }
                    updateStore.index = tobeIndex;
                    updateStore.to = -(tobeIndex * size);
                    updateStore.size = size;
                } else {
                    updateStore.to = updateStore.from;
                }

                return {...store, ...updateStore};
            }, {
                from: 0,
                to: 0,
                index: 0,
                size: 0
            }),
            switchMap(({from, to}) => from === to ? of(to) : this.animation(from, to, this.DURATION))
        );

        carousel$.subscribe(to => {
            this.translateX(to);
        });

        of('A', 'B', 'C').pipe(
            tap(v => console.log(v, '데이터처리 1')),
            tap(v => console.log(v, '데이터처리 2')),
            // observeOn(asyncScheduler),
            tap(v => console.log(v, '데이터처리 3')),
            observeOn(asyncScheduler),
            tap(v => console.log(v, '데이터처리 4')),
            // observeOn(asapScheduler),
            tap(v => console.log(v, '데이터처리 5')),
            tap(v => console.log(v, '데이터처리 6'))
        );
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