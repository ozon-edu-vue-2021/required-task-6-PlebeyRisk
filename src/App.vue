<template>
  <div id="app">
    <PostsTable />
  </div>
</template>

<script>
import PostsTable from './components/PostsTable.vue';

export default {
  name: 'App',
  components: {
    PostsTable,
  },
};
</script>
