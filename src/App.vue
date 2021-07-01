<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <span> | </span>
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2C3E50;
}

#nav {
  position: fixed;
  top: 15px;
  right: 15px;
}

#nav a {
  text-decoration: none;
  font-weight: bold;
  color: #2C3E50;
}

#nav a.router-link-exact-active {
  text-decoration: none;
  color: #42B983;
}
</style>
