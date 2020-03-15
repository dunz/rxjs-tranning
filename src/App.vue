<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'App'
};
</script>

<style>
    html, body {
        height: 100%;
    }

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        display: block;
        height: 100%;
    }

    * {
        margin: 0;
        padding: 0;
        text-decoration: none;
        list-style: none;
    }

    div, ul, section, article {
        box-sizing: border-box;
    }
</style>
