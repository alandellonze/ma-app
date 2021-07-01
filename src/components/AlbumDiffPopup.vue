<template>
  <div class="discographyPopup" v-if="value != null" @keydown.esc="close()">
    <div class="discographyPopupContent">
      <div>{{value.type}}</div>

      <div v-if="value.type === 'EQUAL'">
        <div v-for="album in value.original" v-bind:key="album.id">
          <table>
            <tr>
              <td><input class="position" v-model="album.position" /></td>
              <td><input class="type" v-model="album.type" /></td>
              <td><input class="typeCount" v-model="album.typeCount" /></td>
              <td><input class="name" v-model="album.name" /></td>
              <td><input class="year" v-model="album.year" /></td>
              <td>
                <select class="status" v-model="album.status">
                  <option value="NONE">? - NONE</option>
                  <option value="MISSED">x - MISSED</option>
                  <option value="PRESENT">v - PRESENT</option>
                </select>
              </td>
            </tr>
            <tr>
              <td><span class="position"></span></td>
              <td><input class="type" v-model="album.maType" /></td>
              <td><input class="typeCount" v-model="album.maTypeCount" /></td>
              <td><input class="name" v-model="album.maName" /></td>
              <td><span class="year"></span></td>
              <td><span class="status"></span></td>
            </tr>
          </table>
        </div>
      </div>

      <div v-if="value.type === 'PLUS' || value.type === 'CHANGE'">
        <div v-for="album in value.revised" v-bind:key="album.id">
          <input class="position" v-model="album.position" />
          <input class="type" v-model="album.type" />
          <input class="typeCount" v-model="album.typeCount" />
          <input class="name" v-model="album.name" />
          <input class="year" v-model="album.year" />
          <select class="status" v-model="album.status">
            <option value="NONE">? - NONE</option>
            <option value="MISSED">x - MISSED</option>
            <option value="PRESENT">v - PRESENT</option>
          </select>
        </div>
      </div>

      <button @click="confirm" class="confirm">ok</button>
      <button @click="close" class="close">close</button>

      <button
        v-if="value.type === 'EQUAL' && value.original[0].mp3Status !== 'NOT_PRESENT' && value.original[0].coverStatus !== 'NOT_PRESENT'"
        @click="handleCheckMP3" class="checkMP3">
        mp3
      </button>
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
      'equalAlbum',
      'plusAlbum',
      'minusAlbum',
      'changeAlbum',
      'checkMP3'
    ]),

    async confirm () {
      switch (this.value.type) {
        case 'EQUAL':
          await this.handleEqual()
          break

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

      // reload band
      this.findDiffs()

      // close popup
      this.close()
    },

    handleEqual () {
      return this.equalAlbum(this.value)
    },

    handlePlus () {
      return this.plusAlbum(this.value)
    },

    handleMinus () {
      return this.minusAlbum(this.value.original[0].id)
    },

    handleChange () {
      return this.changeAlbum(this.value)
    },

    handleCheckMP3 () {
      return this.checkMP3(this.value.original[0].id)
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

.position {
  width: 22px;
}

.type {
  width: 100px;
}

.typeCount {
  width: 20px;
}

.name {
  width: 500px;
}

.year {
  width: 35px;
}

.status {
  width: 175px;
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

.checkMP3 {
  float: right;
}
</style>
