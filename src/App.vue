<template>
  <div id="app">
    <button
      :class="[$style.btn, {[$style.active]: tableComponent === 'PostsTable'}]"
      @click="tableComponent = 'PostsTable'"
    >
      Рендер на обычных компонентах
    </button>

    <button
      :class="[$style.btn, {[$style.active]: tableComponent ==='PostsTableFunc'}]"
      @click="tableComponent = 'PostsTableFunc'"
    >
      Рендер на функциональных компонентах
    </button>

    <component :is="tableComponent" />
  </div>
</template>

<script>
import PostsTable from './components/PostsTable.vue';
import PostsTableFunc from './components-func/PostsTable.vue';

export default {
  name: 'App',
  components: {
    PostsTable,
    PostsTableFunc,
  },
  data() {
    return  {
      tableComponent: null,
    };
  },
};
</script>

<style module>
.btn {
  margin-right: 10px;
}
.btn:last-child {
  margin-right: 0;
}
.btn.active {
  background-color: var(--primary);
  color: var(--white);
  margin-bottom: 10px;
}
</style>
