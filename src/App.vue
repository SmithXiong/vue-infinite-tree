<template>
  <div id="app">
    <tree/>
  </div>
</template>

<script>
import tree from './components/tree'

export default {
  name: 'App',
  components: {
    tree
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
