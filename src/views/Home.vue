<template>
  <div>
    <!-- title -->
    <TitleComponent />

    <!-- search bar -->
    <div class="searchBar">
      <div>
        <input v-model="bandName" />
        <button @click.stop="loadAllBands">Go</button>
      </div>

      <!-- bands result -->
      <div>
        <div v-if="bands != null && bands.length > 1">
          found {{bands.length}} bands:

          <div class="bandsResultContainer">
            <div class="bandsResult" v-for="b in bands" v-bind:key="b.id">
              <span @click.stop="loadDiffs(b)">{{b.id}} - {{b.name}}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- band result -->
      <div>
        <div v-if="band != null">
          {{band.name}}
        </div>
      </div>
    </div>

    <!-- link component -->
    <LinkComponent :band="band" v-if="band != null"></LinkComponent>

    <!-- diff table -->
    <div class="diffResultContainer" v-if="diff != null">
      <div class="diffResult">
        <AlbumDiffComponent :diff="diff.albumDiff" />
        <MP3DiffComponent :diff="diff.mp3Diff" />
        <CoversDiffComponent :diff="diff.coversDiff" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import AlbumDiffComponent from '@/components/AlbumDiffComponent'
import CoversDiffComponent from '@/components/CoversDiffComponent'
import LinkComponent from '@/components/LinkComponent'
import MP3DiffComponent from '@/components/MP3DiffComponent'
import TitleComponent from '@/components/TitleComponent'

export default {
  components: {
    AlbumDiffComponent,
    CoversDiffComponent,
    LinkComponent,
    MP3DiffComponent,
    TitleComponent
  },

  data () {
    return {
      bandName: null
    }
  },

  computed: {
    ...mapGetters([
      'bands',
      'band',
      'diff'
    ])
  },

  methods: {
    ...mapActions([
      'findAllBands',
      'setBands',
      'setBand',
      'setDiff',
      'findDiffs'
    ]),

    reset () {
      this.setBands(null)
      this.setBand(null)
      this.setDiff(null)
    },

    async loadAllBands () {
      this.reset()
      await this.findAllBands(this.bandName)

      if (this.bands.length === 1) {
        this.loadDiffs(this.bands[0])
      }
    },

    loadDiffs (band) {
      this.setDiff(null)
      this.setBand(band)
      this.findDiffs()
    }
  }
}
</script>

<style>
  .searchBar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 0 30%;
    min-height: 70px;
  }

  .searchBar > div {
    min-width: 150px;
  }

  .bandsResultContainer {
    height: 50px;
    overflow-y: auto;
  }

  .bandsResult {
    display: flex;
    justify-content: space-around;
    flex-direction: column;
  }

  .diffResultContainer {
    overflow-y: auto;
    height: 610px;
  }

  .diffResult {
    display: flex;
    justify-content: space-around;
  }

  .resultDiff {
    font-style: italic;
    font-size: small;
  }

  .diffRow {
    cursor: pointer;
  }

  .diffRow:hover {
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

  .present {
    background-color: #40fca7;
  }

  .notPresent {
    background-color: #ff8686;
  }

  .tmp {
    background-color: #ffff77;
  }

  .missed {
    background-color: #9bcbff;
  }
</style>
