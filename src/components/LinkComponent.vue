<template>
  <div class="linkComponent" v-if="band != null">
    <p class="copyToClipboard" @click="copyToClipboard(band.id)">{{band.id}}</p>
    <p><a :href="buildLink()" target="_blank">{{buildLink()}}</a></p>
  </div>
</template>

<script>
export default {
  name: 'LinkComponent',

  props: {
    band: {
      required: true
    }
  },

  methods: {
    buildLink () {
      let url = process.env.VUE_APP_MA_METAL_ARCHIVES_URL
      return url.replace('%s', this.band.id)
    },

    async copyToClipboard (bandId) {
      await navigator.clipboard.writeText(bandId)
      this.highlightElement(bandId)
    },

    highlightElement (bandId) {
    }
  }
}
</script>

<style scoped>
  .linkComponent {
    text-align: right;
  }

  .linkComponent a {
    color: #42b983;
  }

  .copyToClipboard {
    cursor: pointer;
  }
</style>
