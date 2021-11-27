<template>
  <div>
    <table :class="$style.table">
      <thead :class="$style.header">
        <th v-for="column in columns" :key="column.id" :class="column.class">
          <slot name="headerItem" v-bind="{ column, class: $style['header-item'] }"></slot>
        </th>
      </thead>

      <tbody :class="$style.body">
        <tr v-for="row in items" :key="row.id" :class="$style.row">
          <td
            v-for="([colKey, col], index) in Object.entries(row)"
            :key="colKey"
            :class="[$style.column, columns[index].class]"
          >
            {{col}}
          </td>
        </tr>
      </tbody>
    </table>
    <slot v-if="!haveItems" name="no-more">
      <div :class="$style['no-more-message']">
        No results :(
      </div>
    </slot>
    <slot name="after"></slot>
  </div>
</template>

<script>
import defaultTypes from '../constants/defaultTypes';

export default {
  name: 'MyTable',
  props: {
    items: defaultTypes.array(),
    columns: defaultTypes.array(),
  },
  computed: {
    haveItems() {
      return !!this.items?.length;
    }
  }
};
</script>

<style module>
.table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}
.header-item {
  background: var(--gray);
  overflow: hidden;
}
.column {
  text-align: left;
  border-bottom: 1px solid var(--gray);
  padding: 1rem 1rem;
  overflow: hidden;
  max-height: 100px;
  height: 100px;
}
.no-more-message {
  display: flex;
  text-align: center;
  justify-content: center;
  padding: 15px;
}
</style>
