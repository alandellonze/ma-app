<template>
  <button @click="executeAllDiff">all diff</button>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions([
      'findAllDiffs'
    ]),

    executeAllDiff () {
      this.findAllDiffs()
    }
  }
}
</script>
