<template>
  <div>
    <!-- diff table -->
    <div v-html="generateDiffTable(diff)" @click="handleAlbumDiffClick"></div>

    <!-- popup component -->
    <AlbumDiffPopup v-model="albumDiffSelected" />
  </div>
</template>

<script>
import AlbumDiffPopup from '@/components/AlbumDiffPopup'

export default {
  components: {
    AlbumDiffPopup
  },

  props: {
    diff: {
      required: true
    }
  },

  data () {
    return {
      albumDiffSelected: null
    }
  },

  methods: {
    generateDiffTable (albumDiff) {
      let changes = albumDiff.changes
      let html = '<p><span class="resultDiff">' + changes + ' differences</span></p>'

      html += '<table cellspacing="0" cellpadding="5" style="font-size: 12px; border-bottom: 1px SOLID #AAAAAA;">'

      albumDiff.diffs.forEach((albumDiff, index) => {
        switch (albumDiff.type) {
          case 'EQUAL':
            albumDiff.original.forEach(albumOriginal => {
              html += '<tr data="' + index + '" class="diffRow">'
              html += this.generateRows(changes, albumDiff.type, albumOriginal, null)
              html += '</tr>'
            })
            break

          case 'PLUS':
            albumDiff.revised.forEach(albumRevised => {
              html += '<tr data="' + index + '" class="diffRow plus">'
              html += this.generateRows(changes, albumDiff.type, null, albumRevised)
              html += '</tr>'
            })
            break

          case 'MINUS':
            albumDiff.original.forEach(albumOriginal => {
              html += '<tr data="' + index + '" class="diffRow minus">'
              html += this.generateRows(changes, albumDiff.type, albumOriginal, null)
              html += '</tr>'
            })
            break

          case 'CHANGE':
            let i = 0
            for (; i < albumDiff.original.length; i++) {
              let albumOriginal = albumDiff.original[i]
              let albumRevised = (i < albumDiff.revised.length) ? albumDiff.revised[i] : null

              html += '<tr data="' + index + '" class="diffRow change">'
              html += this.generateRows(changes, albumDiff.type, albumOriginal, albumRevised)
              html += '</tr>'
            }

            for (; i < albumDiff.revised.length; i++) {
              let albumRevised = albumDiff.revised[i]

              html += '<tr data="' + index + '" class="diffRow change">'
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
      if (event.target.parentNode.matches('.diffRow')) {
        let index = event.target.parentNode.attributes.data.nodeValue
        this.albumDiffSelected = this.diff.diffs[index]
      }
    }
  }
}
</script>
