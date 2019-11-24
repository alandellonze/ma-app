<template>
  <div class="discography">
    <h2>Metal Archives</h2>

    <input v-model="bandName" />
    <button @click="findDiscography">Go</button>

    <div v-if="discography != null">
      <p>{{discography.band.name}} ({{discography.changes}} differences)</p>

      <div v-html="generateAlbumDiff(discography.albumDiffs)" @click="handleAlbumDiffClick"></div>
    </div>

    <!-- // FIXME just to log -->
    {{elementSelected}}
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'DiscographyComponent',

  data () {
    return {
      bandName: 'Vhäldemar',
      // FIXME just to log
      elementSelected: null
    }
  },

  computed: {
    ...mapGetters([
      'discography'
    ])
  },

  methods: {
    ...mapActions([
      'loadDiscography',
      'plusAlbum',
      'minusAlbum',
      'changeAlbum'
    ]),

    findDiscography () {
      this.loadDiscography(this.bandName)
    },

    generateAlbumDiff (albumDiffs) {
      let html = '<table cellspacing="0" cellpadding="5" style="font-size: 12px; border-bottom: 1px SOLID #AAAAAA;">'

      albumDiffs.forEach((albumDiff, index) => {
        switch (albumDiff.type) {
          case 'EQUAL':
            albumDiff.original.forEach(albumOriginal => {
              html += '<tr>'
              html += this.generateRows(albumDiff.type, albumOriginal, null)
              html += '</tr>'
            })
            break

          case 'PLUS':
            albumDiff.revised.forEach(albumRevised => {
              html += '<tr data="' + index + '" class="albumDiff plus">'
              html += this.generateRows(albumDiff.type, null, albumRevised)
              html += '</tr>'
            })
            break

          case 'MINUS':
            albumDiff.original.forEach(albumOriginal => {
              html += '<tr data="' + index + '" class="albumDiff minus">'
              html += this.generateRows(albumDiff.type, albumOriginal, null)
              html += '</tr>'
            })
            break

          case 'CHANGE':
            let i = 0
            for (; i < albumDiff.original.length; i++) {
              let albumOriginal = albumDiff.original[i]
              let albumRevised = (i < albumDiff.revised.length) ? albumDiff.revised[i] : null

              html += '<tr data="' + index + '" class="albumDiff change">'
              html += this.generateRows(albumDiff.type, albumOriginal, albumRevised)
              html += '</tr>'
            }

            for (; i < albumDiff.revised.length; i++) {
              let albumRevised = albumDiff.revised[i]

              html += '<tr data="' + index + '" class="albumDiff change">'
              html += this.generateRows(albumDiff.type, null, albumRevised)
              html += '</tr>'
            }
            break
        }
      })

      html += '</table>'
      return html
    },

    generateRows (diffType, albumOriginal, albumRevised) {
      let html = this.generateDiffType(diffType)

      if (albumOriginal) {
        html += this.generatePosition(albumOriginal)
        html += this.generateType(albumOriginal)
        html += this.generateTypeCount(albumOriginal)
        html += this.generateName(albumOriginal)
        html += this.generateYear(albumOriginal)
        html += this.generateStatus(albumOriginal)
      } else {
        html += this.generateTd(true)
        html += this.generateTd(true)
        html += this.generateTd(true)
        html += this.generateTd(true)
        html += this.generateTd(true)
        html += this.generateTd(true)
      }

      if (albumRevised) {
        html += this.generateType(albumRevised)
        html += this.generateTypeCount(albumRevised)
        html += this.generateName(albumRevised)
        html += this.generateYear(albumRevised)
      } else {
        html += this.generateTd(true)
        html += this.generateTd(true)
        html += this.generateTd(true)
        html += this.generateTd(true)
      }

      return html
    },

    generateDiffType (diffType) {
      let html = '<td style="border-top: 1px SOLID #AAAAAA;">'
      switch (diffType) {
        case 'PLUS':
          html += '+'
          break

        case 'MINUS':
          html += '-'
          break

        case 'CHANGE':
          html += '>'
          break
      }
      html += '</td>'
      return html
    },

    generatePosition (album) {
      let html = this.generateTd()
      html += album.position
      html += '</td>'
      return html
    },

    generateType (album) {
      let html = this.generateTd()
      if (album.maType) {
        html += '<i>' + album.maType + '</i>'
      } else if (album.type) {
        html += album.type
      }
      html += '</td>'
      return html
    },

    generateTypeCount (album) {
      let html = this.generateTd()
      if (album.maTypeCount) {
        html += '<i>' + this.formatInteger(album.maTypeCount) + '</i>'
      } else if (album.typeCount) {
        html += this.formatInteger(album.typeCount)
      }
      html += '</td>'
      return html
    },

    formatInteger (i) {
      return ('0' + i).slice(-2)
    },

    generateName (album) {
      let html = this.generateTd()
      if (album.maName) {
        html += '<i>' + album.maName + '</i>'
      } else if (album.name) {
        html += album.name
      }
      html += '</td>'
      return html
    },

    generateYear (album) {
      let html = this.generateTd()
      html += album.year
      html += '</td>'
      return html
    },

    generateStatus (album) {
      let html = this.generateTd()
      switch (album.status) {
        case 'NONE':
          html += '?'
          break

        case 'MISSED':
          html += 'x'
          break

        case 'PRESENT':
        case 'PRESENT_WITH_COVER':
          html += 'v'
          break
      }
      html += '</td>'
      return html
    },

    generateTd (withClosure) {
      let html = '<td style="border-left: 1px SOLID #AAAAAA; border-top: 1px SOLID #AAAAAA;">'
      if (withClosure) {
        html += '</td>'
      }
      return html
    },

    handleAlbumDiffClick (event) {
      if (event.target.parentNode.matches('.albumDiff')) {
        let bandId = this.discography.band.id
        let index = event.target.parentNode.attributes.data.nodeValue
        let albumDiff = this.discography.albumDiffs[index]
        switch (albumDiff.type) {
          case 'PLUS':
            this.handleAlbumDiffPlus(bandId, albumDiff)
            break

          case 'MINUS':
            this.handleAlbumDiffMinus(bandId, albumDiff)
            break

          case 'CHANGE':
            this.handleAlbumDiffChange(bandId, albumDiff)
            break
        }

        // FIXME just to log
        this.elementSelected = albumDiff
      }
    },

    handleAlbumDiffPlus (bandId, albumDiff) {
      this.plusAlbum({
        bandId: bandId,
        albumRevised: albumDiff.revised[0]
      })
    },

    handleAlbumDiffMinus (bandId, albumDiff) {
      this.minusAlbum({
        bandId: bandId,
        albumOriginal: albumDiff.original[0]
      })
      console.log('-')
      console.log(bandId, albumDiff)
    },

    handleAlbumDiffChange (bandId, albumDiff) {
      this.changeAlbum({
        bandId: bandId,
        albumOriginal: albumDiff.original[0],
        albumRevised: albumDiff.revised[0]
      })
    }
  }
}
</script>

<style>
  .albumDiff {
    cursor: pointer;
  }

  .plus {
    background-color: #77FF77;
    color: #7777FF;
  }

  .minus {
    background-color: #FF7777;
    color: #FFFF77;
  }

  .change {
    background-color: #EEECC0;
    color: #555555;
  }
</style>
