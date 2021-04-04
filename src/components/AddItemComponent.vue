<template>
  <div class='add-item'>
    <form @submit.prevent='emitTask'>
      <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="Enter task..." v-model='task'
        aria-label="Enter task..." aria-describedby="basic-addon">
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="submit">Add Task</button>
        </div>
      </div>
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
