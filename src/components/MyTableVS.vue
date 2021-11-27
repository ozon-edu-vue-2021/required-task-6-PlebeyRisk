<template>
  <div>
    <div :class="$style.content">
      <RecycleScroller
        :items="items"
        :item-size="100"
        :buffer="2000"
        key-field="id"
        page-mode
      >
        <template #before>
          <div :class="$style.header">
            <div v-for="column in columns" :key="column.id" :class="column.class">
              <slot name="headerItem" v-bind="{ column, class: $style['header-item'] }"></slot>
            </div>
          </div>
        </template>

        <template v-slot="{ item: row }">
          <div :class="$style.row">
            <div
              v-for="([colKey, col], index) in Object.entries(row)"
              :key="colKey"
              :class="[$style.column, columns[index].class]"
            >
              {{col}}
            </div>
          </div>
        </template>

        <template #after>
          <slot name="after"></slot>
        </template>
      </RecycleScroller>
    </div>
  </div>
</template>

<script>
import defaultTypes from '../constants/defaultTypes';

export default {
  name: 'MyTableVS',
  props: {
    items: defaultTypes.array(),
    columns: defaultTypes.array(),
  },
};
</script>

<style module>
.header {
  display: flex;
  font-weight: bold;
}
.header-item {
  background: var(--gray);
  overflow: hidden;
  border: 1px solid var(--white);
}
.content {
  max-height: 100vh;
}
.row {
  display: flex;
}
.column {
  text-align: left;
  border-bottom: 1px solid var(--gray);
  padding: 1rem 1rem;
  overflow: hidden;
  max-height: 100px;
  height: 100px;
  display: flex;
  align-items: center;
}
</style>
