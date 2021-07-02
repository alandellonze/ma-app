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

      <button class="confirm" @click="confirm">ok</button>
      <button class="close" @click="close">close</button>

      <!-- FIXME moved into mp3 popup-->
      <button class="confirm" @click="confirmMP3" :disabled="value.type !== 'EQUAL'">mp3</button>
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

      // FIXME moved into mp3 popup
      'checkMP3'
    ]),

    async confirm () {
      switch (this.value.type) {
        case 'EQUAL':
          await this.equalAlbum(this.value)
          break

        case 'PLUS':
          await this.plusAlbum(this.value)
          break

        case 'MINUS':
          await this.minusAlbum(this.value.original[0].id)
          break

        case 'CHANGE':
          await this.changeAlbum(this.value)
          break
      }

      // reload band
      this.findDiffs()

      // close popup
      this.close()
    },

    // FIXME moved into mp3 popup
    async confirmMP3 () {
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
</style>
