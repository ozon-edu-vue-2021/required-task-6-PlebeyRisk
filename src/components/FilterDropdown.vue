<template>
  <v-dropdown>
    <Icon name="filter" :class="$style.icon" :color="iconColor" />

    <div slot="popper">
      <button @click="onClickReset">Сбросить</button>
      <input :value="value" @input="onInput"/>
    </div>
  </v-dropdown>
</template>

<script>
import Icon from './Icon.vue';
import defaultTypes from '../constants/defaultTypes';
import color from '../constants/colors';

export default {
  name: 'FilterDropdown',
  components: {
    Icon,
  },
  props: {
    value: defaultTypes.string(''),
  },
  computed: {
    isActive() {
      return this.value?.length;
    },
    iconColor() {
      return this.isActive ? color.primary : undefined;
    }
  },
  methods: {
    onInput(event) {
      this.$emit('change', event.target.value);
    },
    onClickReset() {
      this.$emit('reset');
    },
  }
};
</script>

<style module>
.icon {
  cursor: pointer;
}
</style>
