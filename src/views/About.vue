<template>
  <div class="about">
    <!-- title -->
    <TitleComponent />

    <!-- logo -->
    <img class="logo" alt="Metal Archives" src="../assets/logo.png" />
    <p>@ade</p>

    <!-- all diff button -->
    <AllDiffComponent />
  </div>
</template>

<script>
import TitleComponent from '@/components/TitleComponent'
import AllDiffComponent from '@/components/AllDiffComponent'

export default {
  components: {
    TitleComponent,
    AllDiffComponent
  }
}
</script>

<style>
  .about {
    padding-top: 50px;
  }

  .logo{
    border-radius: 10px;
  }
</style>
