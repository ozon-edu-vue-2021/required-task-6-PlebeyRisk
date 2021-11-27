<template>
  <span :class="$style.icon">
    <component
      v-if="name && name.length"
      :fill="color || 'black'"
      :width="size"
      :height="size"
      viewBox="0 0 24 24"
      :is="require(`../assets/icons/${name}.svg`)"
    />
  </span>
</template>

<script>
import defaultTypes from '../constants/defaultTypes';

export default {
  name: 'Icon',
  props: {
    name: String,
    size: defaultTypes.number(24),
    color: String,
  },
};
</script>

<style module>
.icon {
  display: flex;
  align-items: center;
}
</style>
