<template>
  <div class="linkComponent">
    <p class="copyToClipboard" @click="copyToClipboard(band.id)">band id: {{band.id}}</p>

    <p><a :href="buildLink()" target="_blank">{{buildLink()}}</a></p>
  </div>
</template>

<script>
export default {
  props: {
    band: {
      required: true
    }
  },

  methods: {
    copyToClipboard (text) {
      navigator.clipboard.writeText(text)
    },

    buildLink () {
      let url = process.env.VUE_APP_MA_METAL_ARCHIVES_URL
      return url.replace('%s', this.band.maKey)
    }
  }
}
</script>

<style scoped>
  .linkComponent {
    position: fixed;
    top: 0;
    right: 15px;
    font-size: small;
    font-style: italic;
    text-align: left;
  }

  .linkComponent a {
    color: #42B983;
  }

  .copyToClipboard {
    text-decoration: underline;
    cursor: pointer;
  }
</style>
