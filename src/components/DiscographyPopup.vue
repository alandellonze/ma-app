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
          <select v-model="albumRevised.status">
            <option value="NONE">? - NONE</option>
            <option value="MISSED">x - MISSED</option>
            <option value="PRESENT">v - PRESENT</option>
            <option value="PRESENT_WITH_COVER">v - PRESENT WITH COVER</option>
          </select>
        </div>
      </div>

      <button @click="confirm" class="confirm">ok</button>
      <button @click="close" class="close">close</button>
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

    async confirm () {
      switch (this.value.type) {
        case 'PLUS':
          await this.handlePlus()
          break

        case 'MINUS':
          await this.handleMinus()
          break

        case 'CHANGE':
          await this.handleChange()
          break
      }

      // close popup
      this.close()
    },

    handlePlus () {
      return this.plusAlbum({
        albumDiff: this.value
      })
    },

    handleMinus () {
      return this.minusAlbum({
        albumDiff: this.value
      })
    },

    handleChange () {
      return this.changeAlbum({
        albumDiff: this.value
      })
    },

    close () {
      // reset value's state
      this.$emit('input', null)
    }
  }
}
</script>

<style scoped>
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

.confirm {
  cursor: pointer;
}

.close {
  outline: none;
  border: none;
  color: #0000DD;
  text-decoration: underline;
  cursor: pointer;
}
</style>
