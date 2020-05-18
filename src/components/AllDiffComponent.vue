<template>
  <div class="allDiff">
    <button @click="executeAllDiff">all diff</button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'AllDiffComponent',

  methods: {
    ...mapActions([
      'allDiff'
    ]),

    executeAllDiff () {
      this.allDiff()
    }

  }
}
</script>

<style>
</style>
