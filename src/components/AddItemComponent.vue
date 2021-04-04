<template>
  <div class='add-item'>
    <form @submit.prevent='emitTask'>
      <input type='text' placeholder='Enter task...' v-model='task' />
      <button type='submit'>Add Task</button>
    </form>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class AddItemComponent extends Vue {
  public task = '';

  public emitTask(): void {
    this.$emit('added', this.task);
    this.task = '';
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
