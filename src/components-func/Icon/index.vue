<script lang="jsx">
import defaultTypes from '../../constants/defaultTypes';
import style from './icon.module.css';

export default {
  name: 'Icon',
  functional: true,
  props: {
    name: String,
    size: defaultTypes.number(24),
    color: String,
  },
  render(h, context) {
    const { props, listeners, data } = context;
    const { color = 'black', size, name } = props;

    const Icon = name?.length
      ? require(`../../assets/icons/${name}.svg`)
      : undefined;

    return (
      <span class={[style.icon, data.class ]} on={listeners}>
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
