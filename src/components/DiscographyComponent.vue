<template>
  <div>
    <div class="header">
      <h2 class="title">Metal Archives</h2>

      <div class="center">
        <!-- search component -->
        <input v-model="bandName" />
        <button @click.stop="loadDiff">Go</button>
      </div>
    </div>

    <!-- diff table -->
    <div class="result" v-if="diff != null">
      <div v-html="generateAlbumDiff(diff.band, diff.albumDiff)" @click="handleAlbumDiffClick"></div>
      <div v-html="generateMP3Diff(diff.band, diff.mp3Diff)"></div>
      <div v-html="generateCoversDiff(diff.band, diff.coversDiff)"></div>
    </div>

    <!-- popup component -->
    <discography-popup v-model="albumDiffSelected"></discography-popup>

    <!-- link component -->
    <div class="linkComponent" v-if="diff != null">
      <link-component :band="diff.band"></link-component>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DiscographyPopup from '@/components/DiscographyPopup.vue'
import LinkComponent from '@/components/LinkComponent.vue'

export default {
  name: 'DiscographyComponent',

  components: {
    DiscographyPopup,
    LinkComponent
  },

  data () {
    return {
      bandName: null,
      albumDiffSelected: null
    }
  },

  computed: {
    ...mapGetters([
      'diff'
    ])
  },

  methods: {
    ...mapActions([
      'getAllDiff'
    ]),

    loadDiff () {
      this.albumDiffSelected = null

      this.getAllDiff({
        bandName: this.bandName
      })
    },

    generateAlbumDiff (band, albumDiff) {
      let changes = albumDiff.changes
      let html = '<p>' + band.name + ' <span class="resultDiff">(' + changes + ' differences)</span></p>'

      html += '<table cellspacing="0" cellpadding="5" style="font-size: 12px; border-bottom: 1px SOLID #AAAAAA;">'

      albumDiff.diffs.forEach((albumDiff, index) => {
        switch (albumDiff.type) {
          case 'EQUAL':
            albumDiff.original.forEach(albumOriginal => {
              html += '<tr data="' + index + '" class="albumDiff">'
              html += this.generateRows(changes, albumDiff.type, albumOriginal, null)
              html += '</tr>'
            })
            break

          case 'PLUS':
            albumDiff.revised.forEach(albumRevised => {
              html += '<tr data="' + index + '" class="albumDiff plus">'
              html += this.generateRows(changes, albumDiff.type, null, albumRevised)
              html += '</tr>'
            })
            break

          case 'MINUS':
            albumDiff.original.forEach(albumOriginal => {
              html += '<tr data="' + index + '" class="albumDiff minus">'
              html += this.generateRows(changes, albumDiff.type, albumOriginal, null)
              html += '</tr>'
            })
            break

          case 'CHANGE':
            let i = 0
            for (; i < albumDiff.original.length; i++) {
              let albumOriginal = albumDiff.original[i]
              let albumRevised = (i < albumDiff.revised.length) ? albumDiff.revised[i] : null

              html += '<tr data="' + index + '" class="albumDiff change">'
              html += this.generateRows(changes, albumDiff.type, albumOriginal, albumRevised)
              html += '</tr>'
            }

            for (; i < albumDiff.revised.length; i++) {
              let albumRevised = albumDiff.revised[i]

              html += '<tr data="' + index + '" class="albumDiff change">'
              html += this.generateRows(changes, albumDiff.type, null, albumRevised)
              html += '</tr>'
            }
            break
        }
      })

      html += '</table>'
      return html
    },

    generateRows (changes, diffType, albumOriginal, albumRevised) {
      let html = this.generateDiffType(diffType)

      if (albumOriginal) {
        html += this.generatePosition(albumOriginal)
        html += this.generateType(albumOriginal)
        html += this.generateTypeCount(albumOriginal)
        html += this.generateName(albumOriginal)
        html += this.generateYear(albumOriginal)
        html += this.generateStatus(albumOriginal)
        html += this.generateMP3Status(albumOriginal)
        html += this.generateCoverStatus(albumOriginal)
      } else if (changes) {
        for (let i = 0; i < 8; i++) {
          html += this.generateTd('', true)
        }
      }

      if (albumRevised) {
        html += this.generatePosition(albumRevised)
        html += this.generateType(albumRevised)
        html += this.generateTypeCount(albumRevised)
        html += this.generateName(albumRevised)
        html += this.generateYear(albumRevised)
      } else if (changes) {
        for (let i = 0; i < 5; i++) {
          html += this.generateTd('', true)
        }
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
        html += '<i title="' + album.type + '">' + album.maType + ' *</i>'
      } else if (album.type) {
        html += album.type
      }
      html += '</td>'
      return html
    },

    generateTypeCount (album) {
      let html = this.generateTd()
      if (album.maTypeCount) {
        html += '<i title="' + album.typeCount + '">' + this.formatInteger(album.maTypeCount) + ' *</i>'
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
        html += '<i title="' + album.name + '">' + album.maName + '</i> *'
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
      let html
      switch (album.status) {
        case 'NONE':
          html = this.generateTd('none')
          html += '<span title="not declared yet">?</span>'
          break

        case 'MISSED':
          html = this.generateTd('missed')
          html += '<span title="i don\'t have it">x</span>'
          break

        case 'PRESENT':
          html = this.generateTd('present')
          html += '<span title="i have it">v</span>'
          break
      }
      html += '</td>'
      return html
    },

    generateMP3Status (album) {
      let html
      switch (album.mp3Status) {
        case 'NOT_PRESENT':
          html = this.generateTd('notPresent')
          html += '<span title="mp3 not present">x</span>'
          break

        case 'TMP':
          html = this.generateTd('tmp')
          html += '<span title="mp3 temporary">-</span>'
          break

        case 'PRESENT':
          html = this.generateTd('present')
          html += '<span title="mp3 present">v</span>'
          break
      }
      html += '</td>'
      return html
    },

    generateCoverStatus (album) {
      let html
      switch (album.coverStatus) {
        case 'NOT_PRESENT':
          html = this.generateTd('notPresent')
          html += '<span title="cover not present">x</span>'
          break

        case 'PRESENT':
          html = this.generateTd('present')
          html += '<span title="cover present">v</span>'
          break
      }
      html += '</td>'
      return html
    },

    generateTd (className, withClosure) {
      let html = '<td style="border-left: 1px SOLID #AAAAAA; border-top: 1px SOLID #AAAAAA;" class="' + className + '">'
      if (withClosure) {
        html += '</td>'
      }
      return html
    },

    handleAlbumDiffClick (event) {
      if (event.target.parentNode.matches('.albumDiff')) {
        let index = event.target.parentNode.attributes.data.nodeValue
        this.albumDiffSelected = this.diff.albumDiff.diffs[index]
      }
    },

    /*********/
    /* COVER */
    /*********/

    generateCoversDiff (band, coversDiff) {
      let changes = coversDiff.changes
      let html = '<p>covers <span class="resultDiff">(' + changes + ' differences)</span></p>'

      html += '<table cellspacing="0" cellpadding="5" style="font-size: 12px; border-bottom: 1px SOLID #AAAAAA;">'

      coversDiff.diffs.forEach((coverDiff, index) => {
        switch (coverDiff.type) {
          case 'EQUAL':
            coverDiff.original.forEach(albumOriginal => {
              html += '<tr data="' + index + '" class="albumDiff">'
              html += this.row(changes, coverDiff.type, albumOriginal, null)
              html += '</tr>'
            })
            break

          case 'PLUS':
            coverDiff.revised.forEach(albumRevised => {
              html += '<tr data="' + index + '" class="albumDiff change">'
              html += this.row(changes, coverDiff.type, null, albumRevised)
              html += '</tr>'
            })
            break

          case 'MINUS':
            coverDiff.original.forEach(albumOriginal => {
              html += '<tr data="' + index + '" class="albumDiff change">'
              html += this.row(changes, coverDiff.type, albumOriginal, null)
              html += '</tr>'
            })
            break

          case 'CHANGE':
            let i = 0
            for (; i < coverDiff.original.length; i++) {
              let albumOriginal = coverDiff.original[i]
              let albumRevised = (i < coverDiff.revised.length) ? coverDiff.revised[i] : null

              html += '<tr data="' + index + '" class="albumDiff change">'
              html += this.row(changes, coverDiff.type, albumOriginal, albumRevised)
              html += '</tr>'
            }

            for (; i < coverDiff.revised.length; i++) {
              let albumRevised = coverDiff.revised[i]

              html += '<tr data="' + index + '" class="albumDiff change">'
              html += this.row(changes, coverDiff.type, null, albumRevised)
              html += '</tr>'
            }
            break
        }
      })

      html += '</table>'
      return html
    },

    row (changes, diffType, original, revised) {
      let html = this.diffType(diffType)

      if (original) {
        html += this.name(original)
        html += this.status(diffType)
      } else if (changes) {
        for (let i = 0; i < 2; i++) {
          html += this.generateTd('', true)
        }
      }

      if (revised) {
        html += this.name(revised)
      } else if (changes) {
        html += this.generateTd('', true)
      }

      return html
    },

    diffType (diffType) {
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

    name (cover) {
      let html = this.generateTd()
      html += cover
      html += '</td>'
      return html
    },

    status (diffType) {
      let html
      switch (diffType) {
        case 'EQUAL':
          html = this.generateTd('present')
          html += '<span title="i have it">v</span>'
          break

        case 'MINUS':
          html = this.generateTd('notPresent')
          html += '<span title="not present">x</span>'
          break

        case 'CHANGE':
          html = this.generateTd('tmp')
          html += '<span title="i have it">x</span>'
          break
      }
      html += '</td>'
      return html
    },

    /*******/
    /* MP3 */
    /*******/

    generateMP3Diff (band, mp3Diff) {
      let changes = mp3Diff.changes
      let html = '<p>mp3 <span class="resultDiff">(' + changes + ' differences)</span></p>'

      html += '<table cellspacing="0" cellpadding="5" style="font-size: 12px; border-bottom: 1px SOLID #AAAAAA;">'

      mp3Diff.diffs.forEach((coverDiff, index) => {
        switch (coverDiff.type) {
          case 'EQUAL':
            coverDiff.original.forEach(albumOriginal => {
              html += '<tr data="' + index + '" class="albumDiff">'
              html += this.row(changes, coverDiff.type, albumOriginal, null)
              html += '</tr>'
            })
            break

          case 'PLUS':
            coverDiff.revised.forEach(albumRevised => {
              html += '<tr data="' + index + '" class="albumDiff change">'
              html += this.row(changes, coverDiff.type, null, albumRevised)
              html += '</tr>'
            })
            break

          case 'MINUS':
            coverDiff.original.forEach(albumOriginal => {
              html += '<tr data="' + index + '" class="albumDiff change">'
              html += this.row(changes, coverDiff.type, albumOriginal, null)
              html += '</tr>'
            })
            break

          case 'CHANGE':
            let i = 0
            for (; i < coverDiff.original.length; i++) {
              let albumOriginal = coverDiff.original[i]
              let albumRevised = (i < coverDiff.revised.length) ? coverDiff.revised[i] : null

              html += '<tr data="' + index + '" class="albumDiff change">'
              html += this.row(changes, coverDiff.type, albumOriginal, albumRevised)
              html += '</tr>'
            }

            for (; i < coverDiff.revised.length; i++) {
              let albumRevised = coverDiff.revised[i]

              html += '<tr data="' + index + '" class="albumDiff change">'
              html += this.row(changes, coverDiff.type, null, albumRevised)
              html += '</tr>'
            }
            break
        }
      })

      html += '</table>'
      return html
    }

  }
}
</script>

<style>
  .header {
    position: fixed;
    top: 0;
    width: 50%;
    background-color: #FFFFFF;
  }

  .title {
    position: fixed;
    top: 0;
    left: 15px;
  }

  .center {
    margin-top: 15px;
  }

  .result {
    display: flex;
    justify-content: space-around;
    margin-top: 100px;
  }

  .resultDiff {
    font-style: italic;
    font-size: small;
  }

  .albumDiff {
    cursor: pointer;
  }

  .albumDiff:hover {
    background-color: #EFEFEF;
    color: #555555;
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

  .linkComponent {
    position: fixed;
    bottom: 15px;
    right: 15px;
    font-size: small;
    font-style: italic;
  }

  .present {
    background-color: #40fca7;
  }

  .missed {
    background-color: #9bcbff;
  }

  .tmp {
    background-color: #ffff77;
  }

  .notPresent {
    background-color: #ff8686;
  }
</style>
