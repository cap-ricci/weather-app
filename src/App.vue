/* eslint-disable @typescript-eslint/camelcase */
<template>
  <div id='app'>
    <div class='alert alert-success alert-dismissible fade show' role='alert'>
      With Bootstrap!
      <button
        type='button'
        class='close'
        data-dismiss='alert'
        aria-label='Close'>
        <span aria-hidden='true'>&times;</span>
      </button>
    </div>
    <div>selected result: {{ selectedSearchOption }}</div>
    <hr>
    <vue-autosearch
      v-model="selectedSearchOption"
      :search-function="searchFunction"
      :max-height="400"
    />
    <!-- <div class='container'>
      <div class='row justify-content-center'>
        <div class='col-6 card'>
          <div class='card-body'>
            <add-item @added='passTask' />
            <item-list :addedText='text' />
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import AddItem from './components/AddItemComponent.vue';
import ItemList from './components/ItemComponent.vue';
import VueAutosearch from './components/VueAutosearch.vue';

@Component({
  components: {
    'add-item': AddItem,
    'item-list': ItemList,
    'vue-autosearch': VueAutosearch,
  },
})
export default class App extends Vue {
  public text = '';

  public selectedSearchOption = null;

  public searchTimeout: null | number = null;

  public passTask(task: string): void {
    this.text = task;
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
