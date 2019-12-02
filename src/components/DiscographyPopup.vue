<template>
  <div class="discographyPopup">
    <div v-if="albumDiff != null">
      <div>{{albumDiff.type}}</div>

      <div v-if="(albumDiff.type === 'PLUS' || albumDiff.type === 'CHANGE')">
        <div v-for="albumRevised in albumDiff.revised" v-bind:key="albumRevised.id">
          <input v-model="albumRevised.position" />
          <input v-model="albumRevised.type" />
          <input v-model="albumRevised.typeCount" />
          <input v-model="albumRevised.name" />
          <input v-model="albumRevised.year" />
        </div>
      </div>

      <button @click="handleClick">Ok</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'DiscographyPopup',

  props: {
    albumDiff: Object
  },

  methods: {
    ...mapActions([
      'plusAlbum',
      'minusAlbum',
      'changeAlbum'
    ]),

    async handleClick () {
      switch (this.albumDiff.type) {
        case 'PLUS':
          this.handlePlus()
          break

        case 'MINUS':
          this.handleMinus()
          break

        case 'CHANGE':
          this.handleChange()
          break
      }

      // reset state
      this.show = false
    },

    handlePlus () {
      return this.plusAlbum({
        albumDiff: this.albumDiff
      })
    },

    handleMinus () {
      return this.minusAlbum({
        albumDiff: this.albumDiff
      })
    },

    handleChange () {
      return this.changeAlbum({
        albumDiff: this.albumDiff
      })
    }
  }
}
</script>
