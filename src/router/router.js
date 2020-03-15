import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '../components/HelloWorld';
import AutoComplete from '../components/quick-rx/AutoComplete';
import Carousel from '../components/quick-rx/Carousel';


const routes = [
    {
        path: '/',
        redirect: '/HelloWorld'
    },
    {
        path: '/HelloWorld',
        name: 'HelloWorld',
        component: HelloWorld
    },
    {
        path: '/AutoComplete',
        name: 'AutoComplete',
        component: AutoComplete
    },
    {
        path: '/Carousel',
        name: 'Carousel',
        component: Carousel
    }
];

Vue.use(Router);
export const router = new Router({
    mode: 'history',
    routes
});

