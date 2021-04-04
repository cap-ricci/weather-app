<template>
  <div id='app'>
    <img alt='Vue logo' src='./assets/logo.png' />
    <hello-world msg='Welcome to Your Vue.js + TypeScript first App' />
    <add-item @added='passTask'/>
    <item-list :addedText='text'/>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';
import AddItem from './components/AddItemComponent.vue';
import ItemList from './components/ItemComponent.vue';

@Component({
  components: {
    'hello-world': HelloWorld,
    'add-item': AddItem,
    'item-list': ItemList,
  },
})
export default class App extends Vue {
  public text = '';

  public passTask(task: string): void {
    this.text = task;
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
