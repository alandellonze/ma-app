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
      let html = '<p>COVERS <span class="resultDiff">' + changes + ' differences</span></p>'

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
              html += '<tr data="' + index + '" class="diffRow change">'
              html += this.row(changes, d.type, null, revised)
              html += '</tr>'
            })
            break

          case 'MINUS':
            d.original.forEach(original => {
              html += '<tr data="' + index + '" class="diffRow change">'
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
        html += this.name(original)
        html += this.status(diffType)
      } else if (changes) {
        for (let i = 0; i < 2; i++) {
          html += this.td('', true)
        }
      }

      if (revised) {
        html += this.name(revised)
      } else if (changes) {
        html += this.td('', true)
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
      let html = this.td()
      html += cover
      html += '</td>'
      return html
    },

    status (diffType) {
      let html
      switch (diffType) {
        case 'EQUAL':
          html = this.td('present')
          html += '<span title="i have it">v</span>'
          break

        case 'MINUS':
          html = this.td('notPresent')
          html += '<span title="not present">x</span>'
          break

        case 'CHANGE':
          html = this.td('tmp')
          html += '<span title="i have it">x</span>'
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
    }
  }
}
</script>
