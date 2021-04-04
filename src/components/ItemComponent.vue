<template>
    <ul class='list-group list-group-flush'>
      <li class="list-group-item" v-for='(item, index) in items' :key='index'>
        <input type='checkbox' :checked='item.status' /> {{ item.text }}
      </li>
    </ul>
</template>

<script lang='ts'>
import {
  Component, Prop, Watch, Vue,
} from 'vue-property-decorator';
import Item from '../types/Item';

@Component
export default class ItemComponent extends Vue {
  @Prop({ default: () => [] }) items!: Item[];

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
