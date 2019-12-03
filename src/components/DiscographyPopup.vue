<template>
  <div class="discographyPopup" v-if="value">
    <div class="discographyPopupContent">
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
    albumDiff: Object,
    value: {
      required: true
    }
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
      this.plusAlbum({
        albumDiff: this.albumDiff
      })
    },

    handleMinus () {
      this.minusAlbum({
        albumDiff: this.albumDiff
      })
    },

    async handleChange () {
      // await this.changeAlbum({
      //   albumDiff: this.albumDiff
      // })
      this.$emit('input', !this.value)
    }
  }
}
</script>

<style>
.discographyPopup {
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

.discographyPopupContent {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}
</style>
