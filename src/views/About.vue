<template>
  <div class="about">
    <h2 class="title">Metal Archives</h2>

    <img alt="Metal Archives" src="../assets/logo.png">
    <p>@ade</p>

    <AllDiffComponent />
  </div>
</template>

<script>
import AllDiffComponent from '@/components/AllDiffComponent.vue'

export default {
  name: 'home',

  components: {
    AllDiffComponent
  }
}
</script>

<style>
  .title {
    position: fixed;
    top: 0px;
    left: 15px;
  }
</style>
