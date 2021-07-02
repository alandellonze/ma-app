<template>
  <div>
    <!-- diff table -->
    <div v-html="generateDiffTable(diff)" @click="handleDiffClick"></div>

    <!-- popup component -->
    <AlbumDiffPopup v-model="diffSelected" />
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
      diffSelected: null
    }
  },

  methods: {
    generateDiffTable () {
      let changes = this.diff.changes
      let html = '<p><span class="resultDiff">' + changes + ' differences</span></p>'

      html += '<table cellspacing="0" cellpadding="5" style="font-size: 12px; border-bottom: 1px SOLID #AAAAAA;">'

      this.diff.diffs.forEach((d, index) => {
        switch (d.type) {
          case 'EQUAL':
            d.original.forEach(original => {
              html += '<tr data="' + index + '" class="diffRow">'
              html += this.row(changes, d.type, original, null)
              html += '</tr>'
            })
            break

          case 'PLUS':
            d.revised.forEach(revised => {
              html += '<tr data="' + index + '" class="diffRow plus">'
              html += this.row(changes, d.type, null, revised)
              html += '</tr>'
            })
            break

          case 'MINUS':
            d.original.forEach(original => {
              html += '<tr data="' + index + '" class="diffRow minus">'
              html += this.row(changes, d.type, original, null)
              html += '</tr>'
            })
            break

          case 'CHANGE':
            let i = 0
            for (; i < d.original.length; i++) {
              let original = d.original[i]
              let revised = (i < d.revised.length) ? d.revised[i] : null

              html += '<tr data="' + index + '" class="diffRow change">'
              html += this.row(changes, d.type, original, revised)
              html += '</tr>'
            }

            for (; i < d.revised.length; i++) {
              let revised = d.revised[i]

              html += '<tr data="' + index + '" class="diffRow change">'
              html += this.row(changes, d.type, null, revised)
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
        html += this.position(original)
        html += this.type(original)
        html += this.typeCount(original)
        html += this.name(original)
        html += this.year(original)
        html += this.status(original)
        html += this.mp3Status(original)
      } else if (changes) {
        for (let i = 0; i < 8; i++) {
          html += this.td('', true)
        }
      }

      if (revised) {
        html += this.position(revised)
        html += this.type(revised)
        html += this.typeCount(revised)
        html += this.name(revised)
        html += this.year(revised)
      } else if (changes) {
        for (let i = 0; i < 5; i++) {
          html += this.td('', true)
        }
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

    position (album) {
      let html = this.td()
      html += album.position
      html += '</td>'
      return html
    },

    type (album) {
      let html = this.td()
      if (album.maType) {
        html += '<i title="' + album.type + '">' + album.maType + ' *</i>'
      } else if (album.type) {
        html += album.type
      }
      html += '</td>'
      return html
    },

    typeCount (album) {
      let html = this.td()
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

    name (album) {
      let html = this.td()
      if (album.maName) {
        html += '<i title="' + album.name + '">' + album.maName + '</i> *'
      } else if (album.name) {
        html += album.name
      }
      html += '</td>'
      return html
    },

    year (album) {
      let html = this.td()
      html += album.year
      html += '</td>'
      return html
    },

    status (album) {
      let html
      switch (album.status) {
        case 'NONE':
          html = this.td('none')
          html += '<span title="not declared yet">?</span>'
          break

        case 'MISSED':
          html = this.td('missed')
          html += '<span title="i don\'t have it">x</span>'
          break

        case 'PRESENT':
          html = this.td('present')
          html += '<span title="i have it">v</span>'
          break
      }
      html += '</td>'
      return html
    },

    mp3Status (album) {
      let html
      switch (album.mp3Status) {
        case 'NOT_PRESENT':
          html = this.td('notPresent')
          html += '<span title="mp3 not present">x</span>'
          break

        case 'TMP':
          html = this.td('tmp')
          html += '<span title="mp3 temporary">-</span>'
          break

        case 'PRESENT':
          html = this.td('present')
          html += '<span title="mp3 present">v</span>'
          break
      }
      html += '</td>'
      return html
    },

    td (className, withClosure) {
      let html = '<td style="border-left: 1px SOLID #AAAAAA; border-top: 1px SOLID #AAAAAA;" class="' + className + '">'
      if (withClosure) {
        html += '</td>'
      }
      return html
    },

    handleDiffClick (event) {
      if (event.target.parentNode.matches('.diffRow')) {
        let index = event.target.parentNode.attributes.data.nodeValue
        this.diffSelected = this.diff.diffs[index]
      }
    }
  }
}
</script>
