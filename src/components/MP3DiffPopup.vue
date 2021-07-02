<template>
  <div class="discographyPopup" v-if="value != null" @keydown.esc="close()">
    <div class="discographyPopupContent">
      <div>{{value.type}}</div>

      <button class="confirm" @click="confirm" :disabled="value.type !== 'EQUAL'">ok</button>
      <button class="close" @click="close">close</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    value: {
      required: true
    }
  },

  methods: {
    ...mapActions([
      'findDiffs',
      'checkMP3'
    ]),

    // FIXME how to get the album id?
    async confirm () {
      await this.checkMP3(this.value.original[0].id)

      // close popup
      this.close()
    },

    close () {
      // reset the state of field called 'value'
      this.$emit('input', null)
    }
  }
}
</script>

<style scoped>
.discographyPopup {
  position: fixed;
  z-index: 1;
  padding-top: 160px;
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
  border-radius: 10px;
  border: 1px solid #888888;
  width: 50%;
}

.close {
  outline: none;
  border: none;
  color: #0000DD;
  text-decoration: underline;
  cursor: pointer;
}
</style>
