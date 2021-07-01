<template>
  <div>

    <!-- diff table -->
    <div v-html="generateDiffTable()"></div>
  </div>
</template>

<script>
export default {
  props: {
    diff: {
      required: true
    }
  },

  methods: {
    generateDiffTable () {
      let changes = this.diff.changes
      let html = '<p>MP3 <span class="resultDiff">' + changes + ' differences</span></p>'

      html += '<table cellspacing="0" cellpadding="5" style="font-size: 12px; border-bottom: 1px SOLID #AAAAAA;">'

      this.diff.diffs.forEach((coverDiff, index) => {
        switch (coverDiff.type) {
          case 'EQUAL':
            coverDiff.original.forEach(albumOriginal => {
              html += '<tr data="' + index + '" class="diffRow">'
              html += this.row(changes, coverDiff.type, albumOriginal, null)
              html += '</tr>'
            })
            break

          case 'PLUS':
            coverDiff.revised.forEach(albumRevised => {
              html += '<tr data="' + index + '" class="diffRow change">'
              html += this.row(changes, coverDiff.type, null, albumRevised)
              html += '</tr>'
            })
            break

          case 'MINUS':
            coverDiff.original.forEach(albumOriginal => {
              html += '<tr data="' + index + '" class="diffRow change">'
              html += this.row(changes, coverDiff.type, albumOriginal, null)
              html += '</tr>'
            })
            break

          case 'CHANGE':
            let i = 0
            for (; i < coverDiff.original.length; i++) {
              let albumOriginal = coverDiff.original[i]
              let albumRevised = (i < coverDiff.revised.length) ? coverDiff.revised[i] : null

              html += '<tr data="' + index + '" class="diffRow change">'
              html += this.row(changes, coverDiff.type, albumOriginal, albumRevised)
              html += '</tr>'
            }

            for (; i < coverDiff.revised.length; i++) {
              let albumRevised = coverDiff.revised[i]

              html += '<tr data="' + index + '" class="diffRow change">'
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

    generateTd (className, withClosure) {
      let html = '<td style="border-left: 1px SOLID #AAAAAA; border-top: 1px SOLID #AAAAAA;" class="' + className + '">'
      if (withClosure) {
        html += '</td>'
      }
      return html
    }
  }
}
</script>
