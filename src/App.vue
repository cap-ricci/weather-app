/* eslint-disable @typescript-eslint/camelcase */
<template>
  <div id='app'>
    <vue-autosearch
      @passOption='addForecast'
      :search-function='searchFunction'
      :max-height='400'
    />
    <div v-if="isRepeatedRequest">{{ repeatedRequestMessage }}</div>
    <div v-for='(item, index) in placeList' :key='index'>
        <li>{{ item.name }}</li>
    </div>
    <!-- <forecast-list/> -->
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import VueAutosearch from './components/VueAutosearch.vue';
import Place, { isInBufferArea, ZERO_PLACE } from './types/Place';

@Component({
  components: {
    'vue-autosearch': VueAutosearch,
  },
})
export default class App extends Vue {
  @Prop({ default: () => [ZERO_PLACE] }) placeList!: Place[];

  public repeatedRequestMessage = 'try with another one!';

  public isRepeatedRequest = false;

  public searchTimeout: null | number = null;

  public addForecast(option: Place): void {
    // TODO push selected placed in list, confront new query with selected places
    this.isRepeatedRequest = false;
    const url = 'http://localhost:3000/data';
    this.isRepeatedRequest = this.placeList
      .map((element) => isInBufferArea(element, option, 9))
      .reduce((acc, res) => res || acc, false);
    if (!this.isRepeatedRequest) {
      this.placeList.push(option);
      // fetch..
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(option),
        headers: {
          'content-type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          this.selectedSearchOption = result;
        });
    }
  }

  public searchFunction(searchTerm: string) {
    return new Promise((resolve) => {
      if (this.searchTimeout) clearTimeout(this.searchTimeout);

      if (searchTerm.length < 3) {
        resolve({
          message: 'needs at least 3 characters',
        });
      }

      this.searchTimeout = setTimeout(async () => resolve({
        result: (await (await fetch(`https://nominatim.openstreetmap.org/search.php?q=${searchTerm}&polygon_geojson=1&format=jsonv2`)).json())
          .map((result: { place_id: number; display_name: string; lat: string; lon: string }) => ({
            id: result.place_id, name: result.display_name, lat: result.lat, lon: result.lon,
          })),
      }), 500);
    });
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
