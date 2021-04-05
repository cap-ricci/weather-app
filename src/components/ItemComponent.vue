<template>
<div>
    <ul class='list-group list-group-flush'>
      <div v-for='(item, index) in items' :key='index'>
        <li class="list-group-item" v-if="!item.status">
        <input type="checkbox" v-model="item.status">
        <label>{{ item.text }} {{ item.status }}</label>
      </li></div>
    </ul>
    <p>Completed:</p>
    <ul class='list-group list-group-flush'>
      <div v-for='(item, index) in items' :key='index'>
        <li class="list-group-item" v-if="item.status">
        <input type="checkbox" v-model="item.status">
        <label>{{ item.text }} {{ item.status }}</label>
      </li></div>
    </ul>
</div>
</template>

<script lang='ts'>
import {
  Component, Prop, Watch, Vue,
} from 'vue-property-decorator';
import Item from '../types/Item';

@Component
export default class ItemComponent extends Vue {
  @Prop({ default: () => [] }) items!: Item[];

  @Prop({ default: () => [] }) completed!: Item[];

  @Prop() addedText!: string;

  @Watch('addedText')
  addTask(): void {
    this.items.push({ text: this.addedText, status: false });
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
