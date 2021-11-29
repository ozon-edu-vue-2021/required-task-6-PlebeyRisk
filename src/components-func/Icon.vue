<script lang="jsx">
import defaultTypes from '../constants/defaultTypes';

export default {
  name: 'Icon',
  props: {
    name: String,
    size: defaultTypes.number(24),
    color: String,
  },
  methods: {
    renderIcon() {
      return this.name && this.name.length
        ? require(`../assets/icons/${this.name}.svg`)
        : undefined;
    }
  },
  render() {
    const { $listeners, $style, color = 'black', size } = this;

    const Icon = this.renderIcon();

    return (
      <span class={$style.icon} on={$listeners}>
        <Icon
          fill={color}
          width={size}
          height={size}
          viewBox="0 0 24 24"
        />
      </span>
    );
  }
};
</script>

<style module>
.icon {
  display: flex;
  align-items: center;
}
</style>
