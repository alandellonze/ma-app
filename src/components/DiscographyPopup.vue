<template>
  <div class="discographyPopup" v-if="value != null">
    <div class="discographyPopupContent">
      <div>{{value.type}}</div>

      <div v-if="(value.type === 'PLUS' || value.type === 'CHANGE')">
        <div v-for="albumRevised in value.revised" v-bind:key="albumRevised.id">
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
      switch (this.value.type) {
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

      // reset value's state
      this.$emit('input', null)
    },

    handlePlus () {
      this.plusAlbum({
        albumDiff: this.value
      })
    },

    handleMinus () {
      this.minusAlbum({
        albumDiff: this.value
      })
    },

    async handleChange () {
      await this.changeAlbum({
        albumDiff: this.value
      })
    }
  }
}
</script>

<style>
.discographyPopup {
  position: fixed;
  z-index: 1;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

.discographyPopupContent {
  background-color: #FEFEFE;
  margin: auto;
  padding: 20px;
  border: 1px solid #888888;
  width: 80%;
}
</style>
